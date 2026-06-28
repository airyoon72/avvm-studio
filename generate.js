// ════════════════════════════════
// AVVM.studio — 영상 생성 API
// Vercel Serverless Function
// POST /api/generate
// ════════════════════════════════

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageUrl, style, brand, orderId, duration, aspectRatio } = req.body;

  if (!imageUrl || !style) {
    return res.status(400).json({ error: '이미지 URL과 스타일이 필요합니다' });
  }

  // ── 영상 길이 검증 (5 / 10 / 15초)
  const VALID_DURATIONS = ['5', '10', '15'];
  const dur = VALID_DURATIONS.includes(String(duration)) ? String(duration) : '5';

  // ── 비율 검증 (5종)
  const VALID_RATIOS = ['9:16', '16:9', '1:1', '3:4', '21:9'];
  const ratio = VALID_RATIOS.includes(aspectRatio) ? aspectRatio : '9:16';

  // ── 스타일별 프롬프트
  const STYLE_PROMPTS = {
    'Dior Luxury':        'luxury fashion advertisement, cinematic gold tones, elegant slow motion, premium brand feel, soft bokeh, 4K',
    'Apple Keynote':      'clean minimalist product reveal, white background, smooth camera pan, tech commercial, precise motion, modern',
    'A24 Film':           'cinematic indie film aesthetic, natural grain, moody lighting, artistic composition, dramatic shadows',
    'Japanese Minimal':   'japanese minimalist aesthetic, zen composition, soft pastel tones, peaceful slow motion, elegant',
    'TikTok Viral':       'dynamic fast cuts, vibrant colors, trending social media style, energetic motion, youth culture',
    'Muji Minimal':       'muji style, clean neutral tones, simple elegant composition, soft natural lighting, lifestyle',
    'Real Estate':        'architectural photography style, wide angle, golden hour lighting, premium property feel, cinematic pan',
    'BMW Cinematic':      'automotive commercial, dramatic lighting, speed and luxury, cinematic wide shot, premium brand',
    'Food Porn':          'food photography, macro close up, steam and texture, warm appetizing tones, slow motion drizzle',
    'Clinical Trust':     'medical professional, clean white aesthetic, trust and precision, soft blue tones, corporate',
    'Fitness Motivation': 'fitness lifestyle, dynamic energy, strong contrast, motivational atmosphere, action sports feel',
    'Netflix Doc':        'documentary style, authentic storytelling, cinematic color grade, dramatic tension, high production',
  };

  const prompt = `${STYLE_PROMPTS[style] || 'cinematic commercial advertisement'}, product: ${brand}, professional advertising video, no text overlay`;

  try {
    const falRes = await fetch('https://queue.fal.run/fal-ai/kling-video/v1.6/pro/image-to-video', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url:    imageUrl,
        prompt:       prompt,
        duration:     dur,
        aspect_ratio: ratio,
        cfg_scale:    0.5,
      }),
    });

    const falData = await falRes.json();

    if (!falRes.ok) {
      console.error('fal.ai error:', falData);
      return res.status(500).json({ error: 'AI 영상 생성 실패', detail: falData });
    }

    return res.status(200).json({
      success:   true,
      requestId: falData.request_id,
      orderId,
      duration:  dur,
      ratio,
      message:   `영상 생성 시작 — ${dur}초 / ${ratio} / 약 2~5분 후 완료`,
    });

  } catch (err) {
    console.error('generate error:', err);
    return res.status(500).json({ error: '서버 오류', detail: err.message });
  }
}
