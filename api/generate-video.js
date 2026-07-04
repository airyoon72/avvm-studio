module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. Ensure FAL_KEY is present
  if (!process.env.FAL_KEY) {
    return res.status(500).json({ error: "FAL_KEY environment variable is not configured on Vercel." });
  }

  // 2. Validate GET parameters immediately (support id, requestId, and request_id)
  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    if (!id) {
      return res.status(400).json({ error: "Missing request_id parameter (use id, requestId, or request_id)." });
    }
  }

  // 3. Dynamic import of @fal-ai/client to bypass CommonJS ESM require crash
  let fal;
  try {
    const falModule = await import("@fal-ai/client");
    fal = falModule.fal;
    fal.config({ credentials: process.env.FAL_KEY });
  } catch (err) {
    console.error("Failed to dynamically import @fal-ai/client:", err);
    return res.status(500).json({ error: "Failed to load @fal-ai/client dependency dynamically: " + err.message });
  }

  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    try {
      let status = await fal.queue.status("fal-ai/luma-dream-machine/image-to-video", {
        requestId: id,
        logs: false
      });

      // If status is COMPLETED, query queue.result to fetch the final video URL and append it to status.output
      if (status.status === 'COMPLETED') {
        try {
          const result = await fal.queue.result("fal-ai/luma-dream-machine/image-to-video", {
            requestId: id
          });
          const videoUrl = result.video?.url || (result.data?.video?.url) || (result.data?.output?.[0]) || (result.data?.images?.[0]?.url);
          if (videoUrl) {
            status.output = [videoUrl];
          }
        } catch (resErr) {
          console.error("Error retrieving queue result:", resErr);
        }
      }

      return res.status(200).json(status);
    } catch (err) {
      console.error("Error querying status:", err);
      return res.status(500).json({ error: err.message || "Failed to query status from Fal.ai" });
    }
  }

  if (req.method === "POST") {
    const { imageData, prompt } = req.body;
    if (!imageData) {
      return res.status(400).json({ error: "Missing imageData base64 string" });
    }

    try {
      const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid base64 imageData format." });
      }
      
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      // Wrap Buffer inside a Web API Blob for fal.storage.upload() compatibility in Vercel's Node 18+ runtime
      const blob = new Blob([buffer], { type: mimeType });

      const uploadResult = await fal.storage.upload(blob);
      const imageUrl = typeof uploadResult === 'string' ? uploadResult : (uploadResult.url || uploadResult.imageUrl);
      
      console.log("Image uploaded to Fal CDN successfully:", imageUrl);

      const submitPrompt = prompt || "Cinematic 3D camera pan, high fashion, smooth motion, high detail, masterpiece";

      const queueResult = await fal.queue.submit("fal-ai/luma-dream-machine/image-to-video", {
        input: {
          image_url: imageUrl,
          prompt: submitPrompt
        }
      });

      console.log("Fal.ai Queue Submitted successfully. ID:", queueResult.request_id);

      return res.status(200).json({
        success: true,
        requestId: queueResult.request_id,
        imageUrl: imageUrl
      });
    } catch (err) {
      console.error("Error initiating Fal generation:", err);
      let errMsg = err.message || "Failed to start Fal.ai video generation";
      if (errMsg.toLowerCase().includes("forbidden") || errMsg.toLowerCase().includes("unauthorized") || err.status === 403) {
        errMsg = "Fal.ai API Key가 유효하지 않거나 승인이 거부되었습니다 (403 Forbidden). Vercel 환경 변수의 FAL_KEY 값과 권한을 확인해 주세요.";
      }
      return res.status(500).json({ error: errMsg });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
