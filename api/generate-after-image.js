// AVVM Before / After still-image generator.
// The customer consents in the order flow before the source photo and prompt
// are sent to Fal for a conceptual AFTER visual.

const MODEL_ID = "fal-ai/flux-pro/kontext/max";
const MAX_IMAGE_DATA_URL_CHARS = 3_500_000;
const IMAGE_DATA_URL = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/;
const ALLOWED_TYPES = new Set(["beauty", "fitness", "interior", "pet"]);
const ALLOWED_ASPECTS = new Set(["16:9", "9:16"]);

function requestError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function allowedOrigins() {
  return (process.env.AVVM_ALLOWED_ORIGINS || [
    "https://avvm.studio", "https://www.avvm.studio", "https://avvmstudio25.vercel.app",
    "http://localhost:3000", "http://127.0.0.1:3000", "null"
  ].join(","))
    .split(",").map(value => value.trim()).filter(Boolean);
}

function setCors(req, res) {
  const origin = String(req.headers.origin || "");
  if (origin && !allowedOrigins().includes(origin)) return false;
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return true;
}

function sourceImage(body) {
  const imageData = typeof body?.imageData === "string" ? body.imageData : "";
  if (!IMAGE_DATA_URL.test(imageData)) {
    throw requestError(415, "JPG, PNG 또는 WEBP 형식의 BEFORE 사진이 필요합니다.");
  }
  if (imageData.length > MAX_IMAGE_DATA_URL_CHARS) {
    throw requestError(413, "사진 용량이 너무 큽니다. 더 작은 사진으로 다시 시도해주세요.");
  }
  return imageData;
}

function compactBrief(value) {
  return String(value || "").replace(/[<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 420);
}

function promptFor(type, brief) {
  const shared = [
    "Create one premium editorial AFTER concept still from the supplied BEFORE photo.",
    "Keep the same subject, viewpoint, perspective, proportions and recognisable identity unless the requested category explicitly changes the styling.",
    "Photorealistic, refined commercial art direction, natural texture and light. No text, logo, watermark, collage, split-screen or before/after labels.",
    "This is an AI visual concept only, not evidence of an actual treatment, outcome, renovation, product performance or health result."
  ];
  const routes = {
    beauty: [
      "Preserve the person's identity, face shape, age and body. Create only an editorial styling variation through makeup, hair, nails, wardrobe, pose and lighting.",
      "Do not alter skin condition, facial structure, body size, weight, age, ethnicity or imply cosmetic, medical or skincare efficacy."
    ],
    fitness: [
      "Preserve the person's identity, face and body exactly. Create a confident fashion, posture, wardrobe and lighting concept only.",
      "Do not change weight, muscles, body shape, height, skin or facial features and do not imply fitness, diet, medical or health results."
    ],
    interior: [
      "Preserve the room geometry, walls, windows, doors, circulation and camera viewpoint. Create a premium interior-styling concept through furnishing, materials, lighting and decor only.",
      "Do not fabricate structural construction work, extra rooms, windows or views that are not present."
    ],
    pet: [
      "Preserve the same pet's species, coat markings, anatomy, size and distinctive features. Create a warm grooming, portrait, environment or memory styling concept only.",
      "Do not portray medical treatment, health improvement, unsafe actions or human-like anatomy."
    ]
  };
  const direction = compactBrief(brief);
  if (direction) shared.push(`Creative direction from the customer: ${direction}.`);
  return [...shared, ...(routes[type] || routes.beauty)].join(" ");
}

function resultImageUrl(result) {
  const data = result?.data || result || {};
  const image = data?.images?.[0] || data?.image || data?.output?.images?.[0];
  return image?.url || image?.image?.url || null;
}

module.exports = async (req, res) => {
  if (!setCors(req, res)) return res.status(403).json({ error: "허용되지 않은 출처의 요청입니다." });
  if (req.method === "OPTIONS") return res.status(204).end();
  if (!process.env.FAL_KEY) return res.status(500).json({ error: "FAL_KEY environment variable is not configured on Vercel." });

  let fal;
  try {
    const falModule = await import("@fal-ai/client");
    fal = falModule.fal;
    fal.config({ credentials: process.env.FAL_KEY });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load @fal-ai/client: " + error.message });
  }

  if (req.method === "GET") {
    const requestId = String(req.query.id || req.query.requestId || "").trim();
    if (!requestId) return res.status(400).json({ error: "Missing request_id parameter." });
    try {
      const status = await fal.queue.status(MODEL_ID, { requestId, logs: false });
      if (status.status !== "COMPLETED") return res.status(200).json({ ...status, request_id: requestId });
      const result = await fal.queue.result(MODEL_ID, { requestId });
      const imageUrl = resultImageUrl(result);
      if (!imageUrl) throw new Error("The AI AFTER image result did not contain an image URL.");
      return res.status(200).json({ ...status, status: "COMPLETED", request_id: requestId, imageUrl });
    } catch (error) {
      console.error("after image status failed:", error.message);
      return res.status(error.statusCode || 500).json({ error: "AFTER 시안 상태를 확인하지 못했습니다. 다시 시도해주세요." });
    }
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const type = String(req.body?.transformationType || "beauty").toLowerCase();
    if (!ALLOWED_TYPES.has(type)) throw requestError(400, "유효하지 않은 전환 유형입니다.");
    const aspectRatio = ALLOWED_ASPECTS.has(req.body?.aspectRatio) ? req.body.aspectRatio : "9:16";
    const request = await fal.queue.submit(MODEL_ID, {
      input: {
        image_url: sourceImage(req.body),
        prompt: promptFor(type, req.body?.brief),
        aspect_ratio: aspectRatio,
        output_format: "jpeg",
        num_images: 1
      }
    });
    return res.status(202).json({ request_id: request.request_id, status: "IN_QUEUE" });
  } catch (error) {
    console.error("after image generation failed:", error.message);
    return res.status(error.statusCode || 500).json({ error: error.statusCode ? error.message : "AFTER 시안을 만들지 못했습니다. 잠시 후 다시 시도해주세요." });
  }
};
