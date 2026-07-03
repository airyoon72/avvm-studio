const { fal } = require("@fal-ai/client");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (!process.env.FAL_KEY) {
    return res.status(500).json({ error: "FAL_KEY environment variable is not configured on Vercel." });
  }

  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Missing request id parameter." });
    }

    try {
      const status = await fal.queue.status("fal-ai/luma-dream-machine/image-to-video", {
        requestId: id,
        logs: false
      });
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

      let extension = "png";
      if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
        extension = "jpg";
      } else if (mimeType.includes("webp")) {
        extension = "webp";
      }

      const fileName = `upload-${Date.now()}.${extension}`;

      const uploadResult = await fal.storage.upload(buffer, {
        fileName: fileName,
        contentType: mimeType
      });

      const imageUrl = uploadResult.url;
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
