// Place in: api/upload-source-image.js
// Uploads a compressed source image as binary, then returns a short-lived
// Supabase signed URL that Fal can fetch. No Base64 is accepted here.

const crypto = require("crypto");

const BUCKET = process.env.SOURCE_IMAGE_BUCKET || "source-images";
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const URL_TTL_SECONDS = Number(process.env.SOURCE_IMAGE_URL_TTL_SECONDS || 86400);
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function allowedOrigins() {
  return (process.env.AVVM_ALLOWED_ORIGINS || [
    "https://avvm.studio",
    "https://www.avvm.studio",
    "https://avvmstudio25.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ].join(","))
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && !allowedOrigins().includes(origin)) return false;
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Image-Type");
  return true;
}

async function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function ensurePrivateBucket(supabase) {
  const { data, error } = await supabase.storage.getBucket(BUCKET);
  if (data && !error) return;

  const { error: createError } = await supabase.storage.createBucket(BUCKET, {
    public: false,
    fileSizeLimit: String(MAX_UPLOAD_BYTES),
    allowedMimeTypes: [...IMAGE_TYPES]
  });

  if (createError && !/already exists/i.test(createError.message || "")) {
    throw createError;
  }
}

function extensionFor(contentType) {
  return contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
}

module.exports = async (req, res) => {
  if (!setCors(req, res)) return res.status(403).json({ error: "Origin is not allowed." });
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const contentType = String(req.headers["x-image-type"] || "").toLowerCase();
  if (!IMAGE_TYPES.has(contentType)) {
    return res.status(415).json({ error: "Only JPEG, PNG, and WEBP files are allowed." });
  }

  try {
    // Vercel parses application/octet-stream request bodies as Buffer.
    const body = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || "");
    if (!body.length) return res.status(400).json({ error: "Image body is empty." });
    if (body.length > MAX_UPLOAD_BYTES) {
      return res.status(413).json({ error: "Compressed image must be 4 MB or smaller." });
    }

    const supabase = await getSupabase();
    await ensurePrivateBucket(supabase);

    const clientToken = String(req.query.token || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 48);
    const path = `source/${new Date().toISOString().slice(0, 10)}/${clientToken || "order"}-${crypto.randomUUID()}.${extensionFor(contentType)}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, body, {
      contentType,
      cacheControl: "86400",
      upsert: false
    });
    if (uploadError) throw uploadError;

    const { data: signed, error: signedError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, URL_TTL_SECONDS);
    if (signedError || !signed?.signedUrl) throw signedError || new Error("Could not create image URL.");

    return res.status(201).json({
      imageUrl: signed.signedUrl,
      imagePath: path,
      expiresAt: new Date(Date.now() + URL_TTL_SECONDS * 1000).toISOString()
    });
  } catch (error) {
    console.error("source image upload failed:", error.message);
    return res.status(500).json({ error: "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요." });
  }
};
