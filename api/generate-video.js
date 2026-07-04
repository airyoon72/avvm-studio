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

  // 2. Validate GET parameters immediately (support id, requestId, and request_id)
  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    if (!id) {
      return res.status(400).json({ error: "Missing request_id parameter (use id, requestId, or request_id)." });
    }

    try {
      // 2a. Call status endpoint directly via native global fetch
      const statusRes = await fetch(`https://queue.fal.run/${MODEL_ID}/requests/${id}/status`, {
        headers: { "Authorization": `Key ${falKey}` }
      });
      if (!statusRes.ok) {
        throw new Error(`Fal.ai status query error: ${statusRes.status}`);
      }
      
      const status = await statusRes.json();

      // 2b. If status is COMPLETED, query response endpoint directly to extract the URL
      if (status.status === "COMPLETED") {
        try {
          const resultRes = await fetch(`https://queue.fal.run/${MODEL_ID}/requests/${id}/response`, {
            headers: { "Authorization": `Key ${falKey}` }
          });
          if (resultRes.ok) {
            const result = await resultRes.json();
            const videoUrl =
              result?.video?.url ||
              result?.data?.video?.url ||
              (result?.video && typeof result.video === 'string' ? result.video : null) ||
              (result?.output && result.output[0]) ||
              null;
            
            return res.status(200).json({
              ...status,
              status: "COMPLETED",
              output: videoUrl ? [videoUrl] : []
            });
          }
        } catch (resErr) {
          console.error("Error fetching queue response:", resErr);
        }
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
      const matches = imageData.match(/^data:([A-Za-z0-9.+\/-]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid base64 imageData format." });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      // 3a. Upload binary file directly using standard multipart FormData
      const formData = new FormData();
      const fileBlob = new Blob([buffer], { type: mimeType });
      formData.append("file", fileBlob, `upload-${Date.now()}.${mimeType.split('/')[1] || 'jpg'}`);

      console.log("Uploading file via REST API...");
      const uploadRes = await fetch("https://queue.fal.run/files/upload", {
        method: "POST",
        headers: { "Authorization": `Key ${falKey}` },
        body: formData
      });

      if (!uploadRes.ok) {
        const uploadErrText = await uploadRes.text();
        throw new Error(`Fal.ai storage upload failed: ${uploadRes.status} | ${uploadErrText}`);
      }

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;
      console.log("Image uploaded to Fal CDN successfully:", imageUrl);

      // 3b. Submit prompt to the queue
      const submitPrompt = prompt || "Cinematic 3D camera pan, high fashion, smooth motion, high detail, masterpiece";
      const submitRes = await fetch(`https://queue.fal.run/${MODEL_ID}`, {
        method: "POST",
        headers: {
          "Authorization": `Key ${falKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: {
            image_url: imageUrl,
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
        imageUrl: imageUrl
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
