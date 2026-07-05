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
        let result = null;
        let fetchNote = null;

        // fal이 알려준 response_url로 직접 결과 조회
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

        // 다양한 응답 구조에서 영상 URL 추출
        let videoUrl =
          result?.video?.url ||
          result?.data?.video?.url ||
          result?.output?.video?.url ||
          null;

        // 최후의 수단: 결과 전체에서 영상 URL 패턴 검색
        if (!videoUrl && result) {
          const raw = JSON.stringify(result);
          const m = raw.match(/https:\/\/[^"]+\.(mp4|m

