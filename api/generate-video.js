const MODEL_ID = "fal-ai/luma-dream-machine/image-to-video";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. Ensure FAL_KEY is present
  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: "FAL_KEY environment variable is not configured on Vercel." });
  }

  // 2. Validate GET parameters (prefer status_url / response_url, fallback to constructing from id)
  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    const statusUrl = req.query.status_url || req.query.statusUrl || (id ? `https://queue.fal.run/${MODEL_ID}/requests/${id}` : null);
    const responseUrl = req.query.response_url || req.query.responseUrl || (id ? `https://queue.fal.run/${MODEL_ID}/requests/${id}` : null);

    if (!statusUrl) {
      return res.status(400).json({ error: "Missing required identifier: status_url, response_url, or request id is required." });
    }

    try {
      // 2a. Call status endpoint directly via native global fetch (GET)
      const statusRes = await fetch(statusUrl, {
        method: "GET",
        headers: { "Authorization": `Key ${falKey}` }
      });
      
      if (!statusRes.ok) {
        throw new Error(`Fal.ai status check failed: ${statusRes.status}`);
      }
      
      const status = await statusRes.json();

      // 2b. If status is COMPLETED, parse the video URL from the status payload
      if (status.status === "COMPLETED") {
        let videoUrl =
          status?.video?.url ||
          status?.data?.video?.url ||
          (status?.video && typeof status.video === 'string' ? status.video : null) ||
          (status?.output && status.output[0]) ||
          (status?.data?.output && status.data.output[0]) ||
          null;

        // If not found in the status response, fall back to fetching from responseUrl
        if (!videoUrl && responseUrl && responseUrl !== statusUrl) {
          try {
            const resultRes = await fetch(responseUrl, {
              method: "GET",
              headers: { "Authorization": `Key ${falKey}` }
            });
            if (resultRes.ok) {
              const result = await resultRes.json();
              videoUrl =
                result?.video?.url ||
                result?.data?.video?.url ||
                (result?.video && typeof result.video === 'string' ? result.video : null) ||
                (result?.output && result.output[0]) ||
                (result?.data?.output && result.data.output[0]) ||
                null;
            }
          } catch (resErr) {
            console.error("Error fetching queue response:", resErr);
          }
        }
        
        return res.status(200).json({
          ...status,
          status: "COMPLETED",
          output: videoUrl ? [videoUrl] : []
        });
      }

      return res.status(200).json(status);
    } catch (err) {
      console.error("Error querying status:", err);
      return res.status(500).json({ error: err.message || "Failed to query status from Fal.ai" });
    }
  }

  // 3. POST request: Video Generation Submission
  if (req.method === "POST") {
    const { imageData, prompt } = req.body || {};
    if (!imageData) {
      return res.status(400).json({ error: "Missing imageData base64 string" });
    }

    try {
      console.log("Submitting base64 image directly to Fal.ai Queue...");
      const submitPrompt = prompt || "Cinematic 3D camera pan, high fashion, smooth motion, high detail, masterpiece";
      const submitRes = await fetch(`https://queue.fal.run/${MODEL_ID}`, {
        method: "POST",
        headers: {
          "Authorization": `Key ${falKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: {
            image_url: imageData,
            prompt: submitPrompt
          }
        })
      });

      if (!submitRes.ok) {
        const submitErrText = await submitRes.text();
        throw new Error(`Fal.ai queue submit failed: ${submitRes.status} | ${submitErrText}`);
      }

      const submitData = await submitRes.json();
      console.log("Fal.ai Queue Submitted successfully. ID:", submitData.request_id);

      return res.status(200).json({
        success: true,
        requestId: submitData.request_id,
        statusUrl: submitData.status_url,
        responseUrl: submitData.response_url,
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
