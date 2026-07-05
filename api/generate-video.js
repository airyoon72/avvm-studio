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

  // ─────────── GET: 상태 조회 + 완료 시 영상 URL 반환 ───────────
  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    if (!id) {
      return res.status(400).json({ error: "Missing request_id parameter." });
    }
    try {
      const status = await fal.queue.status(MODEL_ID, { requestId: id, logs: false });

      if (status.status === "COMPLETED") {
        try {
          const result = await fal.queue.result(MODEL_ID, { requestId: id });

          // 다양한 응답 구조에서 영상 URL 추출 시도
          let videoUrl =
            result?.data?.video?.url ||
            result?.video?.url ||
            result?.data?.output?.video?.url ||
            (Array.isArray(result?.data?.output) ? result.data.output[0] : null) ||
            null;

          // 최후의 수단: 결과 전체에서 영상 URL 패턴 검색
          if (!videoUrl) {
            const raw = JSON.stringify(result);
            const m = raw.match(/https:\/\/[^"]+\.(mp4|mov|webm)[^"]*/);
            if (m) videoUrl = m[0];
          }

          return res.status(200).json({
            ...status,
            status: "COMPLETED",
            output: videoUrl ? [videoUrl] : [],
            debug: videoUrl ? undefined : result
          });
        } catch (resultErr) {
          console.error("Error fetching result:", resultErr);
          return res.status(200).json({
            ...status,
            output: [],
            debug: "result fetch failed: " + resultErr.message
          });
        }
      }

      return res.status(200).json(status);
    } catch (err) {
      console.error("Error querying status:", err);
      return res.status(500).json({ error: err.message || "Failed to query status from Fal.ai" });
    }
  }

  // ─────────── POST: 이미지로 영상 생성 요청 ───────────
  if (req.method === "POST") {
    const { imageData, prompt } = req.body || {};
    if (!imageData) {
      return res.status(400).json({ error: "Missing imageData base64 string" });
    }

    try {
      // 데이터 URI 형식 검증
      const matches = imageData.match(/^data:([A-Za-z0-9.+\/-]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid base64 imageData format." });
      }

      const submitPrompt = prompt || "Cinematic 3D camera pan, high fashion, smooth motion, high detail, masterpiece";

      // 스토리지 업로드 생략 — fal.ai는 base64 데이터 URI를 image_url로 직접 받음
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

