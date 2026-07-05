const MODEL_ID = "fal-ai/luma-dream-machine/image-to-video";

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

  // 2. Validate GET parameters immediately
  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    if (!id) {
      return res.status(400).json({ error: "Missing request_id parameter (use id, requestId, or request_id)." });
    }
  }

  // 3. Dynamic import of @fal-ai/client to bypass CommonJS/ESM issues
  let fal;
  try {
    const falModule = await import("@fal-ai/client");
    fal = falModule.fal;
    fal.config({ credentials: process.env.FAL_KEY });
  } catch (err) {
    console.error("Failed to dynamically import @fal-ai/client:", err);
    return res.status(500).json({ error: "Failed to load @fal-ai/client dependency: " + err.message });
  }

  // 4. GET Handler: Status Check
  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    try {
      const status = await fal.queue.status(MODEL_ID, {
        requestId: id,
        logs: false
      });

      // If completed, fetch the results to get the output video URL
      if (status.status === "COMPLETED") {
        try {
          const result = await fal.queue.result(MODEL_ID, { requestId: id });
          const videoUrl =
            result?.data?.video?.url ||
            result?.video?.url ||
            (result?.data?.output && result.data.output[0]) ||
            (result?.output && result.output[0]) ||
            null;
          
          return res.status(200).json({
            ...status,
            status: "COMPLETED",
            output: videoUrl ? [videoUrl] : []
          });
        } catch (resErr) {
          console.error("Error fetching queue result:", resErr);
          return res.status(200).json({
            ...status,
            output: []
          });
        }
      }

      return res.status(200).json(status);
    } catch (err) {
      console.error("Error querying status:", err);
      return res.status(500).json({ error: err.message || "Failed to query status from Fal.ai" });
    }
  }

  // 5. POST Handler: Queue Submission
  if (req.method === "POST") {
    const { imageData, prompt } = req.body || {};
    if (!imageData) {
      return res.status(400).json({ error: "Missing imageData base64 string" });
    }

    try {
      console.log("Submitting base64 image to Fal.ai Queue using SDK...");
      const submitPrompt = prompt || "Cinematic 3D camera pan, high fashion, smooth motion, high detail, masterpiece";
      
      const queueResult = await fal.queue.submit(MODEL_ID, {
        input: {
          image_url: imageData,
          prompt: submitPrompt
        }
      });

      console.log("Fal.ai Queue Submitted successfully. ID:", queueResult.request_id);

      return res.status(200).json({
        success: true,
        requestId: queueResult.request_id,
        statusUrl: queueResult.status_url,
        responseUrl: queueResult.response_url,
        imageUrl: imageData
      });
    } catch (err) {
      console.error("Error initiating Fal generation:", err);
      let errMsg = err.message || "Failed to start Fal.ai video generation";
      if (errMsg.toLowerCase().includes("forbidden") || errMsg.toLowerCase().includes("unauthorized") || err.status === 403 || err.status === 401) {
        errMsg = "Fal.ai API Key가 유효하지 않거나 승인이 거부되었습니다 (401/403). Vercel 환경 변수의 FAL_KEY 값과 권한을 확인해 주세요.";
      }
      return res.status(500).json({ error: errMsg });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
