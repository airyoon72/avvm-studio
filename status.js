// ════════════════════════════════
// AVVM.studio — 영상 상태 확인 API
// GET /api/status?requestId=xxx
// ════════════════════════════════

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') return res.status(405).end();

  const { requestId } = req.query;
  if (!requestId) return res.status(400).json({ error: 'requestId 필요' });

  try {
    const statusRes = await fetch(
      `https://queue.fal.run/fal-ai/kling-video/v1.6/pro/image-to-video/requests/${requestId}/status`,
      {
        headers: { 'Authorization': `Key ${process.env.FAL_API_KEY}` },
      }
    );

    const data = await statusRes.json();

    // 완료된 경우 결과 URL 반환
    if (data.status === 'COMPLETED') {
      const resultRes = await fetch(
        `https://queue.fal.run/fal-ai/kling-video/v1.6/pro/image-to-video/requests/${requestId}`,
        { headers: { 'Authorization': `Key ${process.env.FAL_API_KEY}` } }
      );
      const result = await resultRes.json();
      return res.status(200).json({
        status: 'COMPLETED',
        videoUrl: result.video?.url || null,
      });
    }

    return res.status(200).json({ status: data.status || 'IN_PROGRESS' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
