// Replace: api/generate-video.js
// New clients send imageUrl (a private Supabase signed URL). imageData remains
// temporarily supported for old deployed clients, so rolling deployment is safe.

const MODEL_ID = "fal-ai/luma-dream-machine/ray-2-flash/image-to-video";
const LEGACY_MODEL_ID = "fal-ai/luma-dream-machine/image-to-video";
const SOURCE_BUCKET = process.env.SOURCE_IMAGE_BUCKET || "source-images";

const ALLOWED_DURATION = ["5s", "9s"];
const ALLOWED_RESOLUTION = ["540p", "720p", "1080p"];
const ALLOWED_ASPECT = ["16:9", "9:16", "4:3", "3:4", "21:9", "9:21", "1:1"];
const MAX_LEGACY_DATA_URL_CHARS = 5_700_000;

async function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  } catch (error) {
    console.error("Supabase init failed:", error.message);
    return null;
  }
}

async function archiveVideo(supabase, requestId, falUrl) {
  try {
    const downloaded = await fetch(falUrl);
    if (!downloaded.ok) throw new Error("download HTTP " + downloaded.status);
    const buffer = Buffer.from(await downloaded.arrayBuffer());

    const path = requestId + ".mp4";
    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(path, buffer, { contentType: "video/mp4", upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("videos").getPublicUrl(path);
    return data?.publicUrl || null;
  } catch (error) {
    console.error("archiveVideo failed:", error.message);
    return null;
  }
}

function getImageSource(body) {
  const imageUrl = typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";
  if (imageUrl) {
    if (!process.env.SUPABASE_URL) throw new Error("SUPABASE_URL is not configured.");

    const source = new URL(imageUrl);
    const supabase = new URL(process.env.SUPABASE_URL);
    const signedPath = `/storage/v1/object/sign/${SOURCE_BUCKET}/`;
    if (source.protocol !== "https:" || source.origin !== supabase.origin || !source.pathname.startsWith(signedPath)) {
      throw new Error("imageUrl must be a signed URL from the private source-images bucket.");
    }
    return imageUrl;
  }

  // Keep old browser versions working during deployment. Remove this branch only
  // after all active clients have received the new app.js.
  const imageData = typeof body?.imageData === "string" ? body.imageData : "";
  const isDataUrl = /^data:([A-Za-z0-9.+\/-]+);base64,[A-Za-z0-9+/=]+$/.test(imageData);
  if (!isDataUrl || imageData.length > MAX_LEGACY_DATA_URL_CHARS) {
    throw new Error("Missing valid imageUrl.");
  }
  return imageData;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (!process.env.FAL_KEY) {
    return res.status(500).json({ error: "FAL_KEY environment variable is not configured on Vercel." });
  }

  let fal;
  try {
    const falModule = await import("@fal-ai/client");
    fal = falModule.fal;
    fal.config({ credentials: process.env.FAL_KEY });
  } catch (error) {
    return res.status(500).json({ error: "Failed to load @fal-ai/client: " + error.message });
  }

  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    if (!id) return res.status(400).json({ error: "Missing request_id parameter." });

    try {
      const supabase = await getSupabase();
      if (supabase) {
        try {
          const { data: existing } = await supabase
            .from("orders")
            .select("result_url")
            .eq("request_id", id)
            .maybeSingle();
          if (existing?.result_url) {
            return res.status(200).json({
              status: "COMPLETED",
              request_id: id,
              output: [existing.result_url],
              archived: true
            });
          }
        } catch (error) {
          console.error("Supabase lookup failed:", error.message);
        }
      }

      let status;
      let modelUsed = MODEL_ID;
      try {
        status = await fal.queue.status(MODEL_ID, { requestId: id, logs: false });
      } catch (_) {
        status = await fal.queue.status(LEGACY_MODEL_ID, { requestId: id, logs: false });
        modelUsed = LEGACY_MODEL_ID;
      }

      if (status.status !== "COMPLETED") return res.status(200).json(status);

      let result = null;
      const notes = [];
      try {
        const queueResult = await fal.queue.result(modelUsed, { requestId: id });
        result = queueResult?.data || queueResult;
      } catch (error) {
        notes.push("client result: " + error.message);
      }

      if (!result && status.response_url) {
        try {
          const direct = await fetch(status.response_url, {
            headers: { Authorization: "Key " + process.env.FAL_KEY }
          });
          const text = await direct.text();
          if (direct.ok) {
            try { result = JSON.parse(text); } catch (_) { notes.push("direct: non-JSON"); }
          } else {
            notes.push("direct: HTTP " + direct.status + " body=" + text.slice(0, 300));
          }
        } catch (error) {
          notes.push("direct: " + error.message);
        }
      }

      let videoUrl =
        result?.video?.url ||
        result?.data?.video?.url ||
        result?.output?.video?.url ||
        null;
      if (!videoUrl && result) {
        const match = JSON.stringify(result).match(/https:\/\/[^\"]+\.(mp4|mov|webm)[^\"]*/);
        if (match) videoUrl = match[0];
      }

      let finalUrl = videoUrl;
      let archived = false;
      if (videoUrl && supabase) {
        const permanentUrl = await archiveVideo(supabase, id, videoUrl);
        if (permanentUrl) {
          finalUrl = permanentUrl;
          archived = true;
          try {
            await supabase.from("orders").upsert(
              { request_id: id, result_url: permanentUrl, status: "completed" },
              { onConflict: "request_id" }
            );
          } catch (error) {
            console.error("orders upsert failed:", error.message);
          }
        }
      }

      return res.status(200).json({
        ...status,
        status: "COMPLETED",
        output: finalUrl ? [finalUrl] : [],
        archived,
        debug: finalUrl ? undefined : { notes, result }
      });
    } catch (error) {
      console.error("Error querying status:", error);
      return res.status(500).json({ error: error.message || "Failed to query status from Fal.ai" });
    }
  }

  if (req.method === "POST") {
    try {
      const { prompt, duration, resolution, aspectRatio } = req.body || {};
      const imageSource = getImageSource(req.body);
      const safeDuration = ALLOWED_DURATION.includes(duration) ? duration : "5s";
      const safeResolution = ALLOWED_RESOLUTION.includes(resolution) ? resolution : "540p";
      const safeAspect = ALLOWED_ASPECT.includes(aspectRatio) ? aspectRatio : "9:16";
      const submitPrompt = prompt || "Cinematic 3D camera pan, high fashion, smooth motion, high detail, masterpiece";

      const queueResult = await fal.queue.submit(MODEL_ID, {
        input: {
          image_url: imageSource,
          prompt: submitPrompt,
          duration: safeDuration,
          resolution: safeResolution,
          aspect_ratio: safeAspect
        }
      });

      try {
        const supabase = await getSupabase();
        if (supabase && queueResult.request_id) {
          await supabase.from("orders").upsert(
            { request_id: queueResult.request_id, status: "processing" },
            { onConflict: "request_id" }
          );
        }
      } catch (error) {
        console.error("orders upsert failed:", error.message);
      }

      return res.status(202).json({
        success: true,
        requestId: queueResult.request_id,
        options: { duration: safeDuration, resolution: safeResolution, aspectRatio: safeAspect }
      });
    } catch (error) {
      console.error("Error initiating Fal generation:", error);
      return res.status(400).json({ error: error.message || "Failed to start Fal.ai video generation" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
