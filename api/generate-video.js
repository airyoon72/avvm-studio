const MODEL_ID = "fal-ai/luma-dream-machine/image-to-video";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const falKey = process.env.FAL_KEY;
  if (!falKey) {
    return res.status(500).json({ error: "FAL_KEY environment variable is not configured on Vercel." });
  }

  // GET: 상태 체크 - 기존 코드 그대로 OK
  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    if (!id) {
      return res.status(400).json({ error: "Missing request_id parameter" });
    }
    try {
      const statusRes = await fetch(`https://queue.fal.run/${MODEL_ID}/requests/${id}/status`, {
        headers: { "Authorization": `Key ${falKey}` }
      });
      if (!statusRes.ok) throw new Error(`Fal.ai status error: ${statusRes.status}`);
      const status = await statusRes.json();

      if (status.status === "COMPLETED") {
        const resultRes = await fetch(`https://queue.fal.run/${MODEL_ID}/requests/${id}/response`, {
          headers: { "Authorization": `Key ${falKey}` }
        });
        if (resultRes.ok) {
          const result = await resultRes.json();
          const videoUrl = result?.video?.url || result?.video || result?.output?.[0] || null;
          return res.status(200).json({...status, status: "COMPLETED", output: videoUrl? [videoUrl] : [] });
        }
      }
      return res.status(200).json(status);
    } catch (err) {
      console.error("Error querying status:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  // POST: 핵심 수정 부분
  if (req.method === "POST") {
    const { imageData, prompt } = req.body || {};
    if (!imageData) {
      return res.status(400).json({ error: "Missing imageData base64 string" });
    }

    try {
      // base64 검증만 하고 바로 fal.ai로 전송 - 업로드 스텝 삭제
      const matches = imageData.match(/^data:([A-Za-z0-9.+\/-]+);base64,(.+)$/);
      if (!matches || matches.length!== 3) {
        return res.status(400).json({ error: "Invalid base64 imageData format." });
      }

      // luma-dream-machine은 image_url 대신 base64 data URI 직접 받음
      const submitPrompt = prompt || "Cinematic 3D camera pan, high fashion, smooth motion, high detail, masterpiece";

      console.log("Submitting to fal.ai queue directly with base64...");
      const submitRes = await fetch(`https://queue.fal.run/${MODEL_ID}`, {
        method: "POST",
        headers: {
          "Authorization": `Key ${falKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: {
            image_url: imageData, // base64 data URI 그대로 넣기
            prompt: submitPrompt
          }
        })
      });

      if (!submitRes.ok) {
        const submitErrText = await submitRes.text();
        throw new Error(`Fal.ai queue submit failed: ${submitRes.status} | ${submitErrText}`);
      }

      const submitData = await submitRes.json();
      console.log("Fal.ai Queue Submitted. ID:", submitData.request_id);

      return res.status(200).json({
        success: true,
        requestId: submitData.request_id
      });
    } catch (err) {
      console.error("Error initiating Fal generation:", err);
      let errMsg = err.message || "Failed to start Fal.ai video generation";
      if (errMsg.includes("401") || errMsg.includes("403")) {
        errMsg = "Fal.ai API Key가 유효하지 않습니다. Vercel FAL_KEY 확인 필요";
      }
      return res.status(500).json({ error: errMsg });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
