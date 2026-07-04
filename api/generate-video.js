const MODEL_ID = "fal-ai/luma-dream-machine/image-to-video";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 1. FAL_KEY 환경 변수 확인
  if (!process.env.FAL_KEY) {
    return res.status(500).json({ error: "FAL_KEY environment variable is not configured on Vercel." });
  }

  // 2. GET 파라미터 검증 (id, requestId, request_id 모두 지원)
  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    if (!id) {
      return res.status(400).json({ error: "Missing request_id parameter (use id, requestId, or request_id)." });
    }
  }

  // 3. @fal-ai/client 동적 import (CommonJS/ESM 호환)
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
      const status = await fal.queue.status(MODEL_ID, {
        requestId: id,
        logs: false
      });

      // 수정 #3: queue.status()는 output을 포함하지 않음.
      // COMPLETED일 때 queue.result()를 추가 호출해서
      // 프론트엔드가 기대하는 output[0] 형태로 영상 URL을 반환.
      if (status.status === "COMPLETED") {
        try {
          const result = await fal.queue.result(MODEL_ID, { requestId: id });
          const videoUrl =
            result?.data?.video?.url ||
            result?.video?.url ||
            null;
          return res.status(200).json({
            ...status,
            status: "COMPLETED",
            output: videoUrl ? [videoUrl] : []
          });
        } catch (resultErr) {
          console.error("Error fetching result:", resultErr);
          return res.status(200).json({ ...status, output: [] });
        }
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

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      // 수정 #1: fal.storage.upload()는 Blob/File 하나만 받음.
      // Buffer + 옵션 객체를 넘기면 안 되므로 Blob으로 감싸서 전달.
      const blob = new Blob([buffer], { type: mimeType });

      // 수정 #2: storage.upload()는 URL 문자열을 직접 반환함
      // (객체의 .url 프로퍼티가 아님).
      const imageUrl = await fal.storage.upload(blob);

      console.log("Image uploaded to Fal CDN successfully:", imageUrl);

      const submitPrompt = prompt || "Cinematic 3D camera pan, high fashion, smooth motion, high detail, masterpiece";

      const queueResult = await fal.queue.submit(MODEL_ID, {
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
      if (err.body && err.body.detail) {
        try {
          errMsg += " | detail: " + JSON.stringify(err.body.detail);
        } catch (_) {}
      }
      if (errMsg.toLowerCase().includes("forbidden") || errMsg.toLowerCase().includes("unauthorized") || err.status === 403 || err.status === 401) {
        errMsg = "Fal.ai API Key가 유효하지 않거나 승인이 거부되었습니다 (401/403). Vercel 환경 변수의 FAL_KEY 값과 권한을 확인해 주세요.";
      }
      return res.status(500).json({ error: errMsg });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};
