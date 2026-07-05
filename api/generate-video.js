const MODEL_ID = "fal-ai/luma-dream-machine/image-to-video";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (!process.env.FAL_KEY) {
    return res.status(500).json({ error: "FAL_KEY environment variable is not configured on Vercel." });
  }

  let fal;
  try {
    const falModule = await import("@fal-ai/client");
    fal = falModule.fal;
    fal.config({ credentials: process.env.FAL_KEY });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load @fal-ai/client: " + err.message });
  }

  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    if (!id) {
      return res.status(400).json({ error: "Missing request_id parameter." });
    }
    try {
      const status = await fal.queue.status(MODEL_ID, { requestId: id, logs: false });

      if (status.status === "COMPLETED") {
        let result = null;
        let fetchNote = null;

        if (status.response_url) {
          try {
            const r = await fetch(status.response_url, {
              headers: { "Authorization": "Key " + process.env.FAL_KEY }
            });
            if (r.ok) {
              result = await r.json();
            } else {
              fetchNote = "response_url fetch HTTP " + r.status;
            }
          } catch (e) {
            fetchNote = "response_url fetch error: " + e.message;
          }
        }

        let videoUrl =
          result?.video?.url ||
          result?.data?.video?.url ||
          result?.output?.video?.url ||
          null;

        if (!videoUrl && result) {
          const raw = JSON.stringify(result);
          const m = raw.match(/https:\/\/[^"]+\.(mp4|mov|webm)[^"]*/);
          if (m) videoUrl = m[0];
        }

        return res.status(200).json({
          ...status,
          status: "COMPLETED",
          output: videoUrl ? [videoUrl] : [],
          debug: videoUrl ? undefined : (fetchNote || result)
        });
      }

      return res.status(200).json(status);
    } catch (err) {
      console.error("Error querying status:", err);
      return res.status(500).json({ error: err.message || "Failed to query status from Fal.ai" });
    }
  }

  if (req.method === "POST") {
    const { imageData, prompt } = req.body || {};
    if (!imageData) {
      return res.status(400).json({ error: "Missing imageData base64 string" });
    }

    try {
      const matches = imageData.match(/^data:([A-Za-z0-9.+\/-]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid base64 imageData format." });
      }

      const submitPrompt = prompt || "Cinematic 3D camera pan, high fashion, smooth motion, high detail, masterpiece";

      const queueResult = await fal.queue.submit(MODEL_ID, {
        input: {
          image_url: imageData,
          prompt: submitPrompt
        }
      });

      console.log("Fal.ai Queue Submitted. ID:", queueResult.request_id);

      return res.status(200).json({
        success: true,
        requestId: queueResult.request_id
      });
    } catch (err) {
      console.error("Error initiating Fal generation:", err);
      let errMsg = err.message || "Failed to start Fal.ai video generation";
      if (err.body && err.body.detail) {
        try { errMsg += " | detail: " + JSON.stringify(err.body.detail); } catch (_) {}
      }
      return res.status(500).json({ error: errMsg });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
