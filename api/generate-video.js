// 새 모델: 길이(5s/9s), 해상도(540p/720p/1080p), 비율 지정 가능
const MODEL_ID = "fal-ai/luma-dream-machine/ray-2-flash/image-to-video";
// 예전 주문 조회 호환용
const LEGACY_MODEL_ID = "fal-ai/luma-dream-machine/image-to-video";

const ALLOWED_DURATION = ["5s", "9s"];
const ALLOWED_RESOLUTION = ["540p", "720p", "1080p"];
const ALLOWED_ASPECT = ["16:9", "9:16", "4:3", "3:4", "21:9", "9:21", "1:1"];

// Supabase 추가
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

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
      // 새 모델로 먼저 조회, 실패하면 예전 모델로 조회 (과거 주문 호환)
      let status = null;
      let modelUsed = MODEL_ID;
      try {
        status = await fal.queue.status(MODEL_ID, { requestId: id, logs: false });
      } catch (_) {
        status = await fal.queue.status(LEGACY_MODEL_ID, { requestId: id, logs: false });
        modelUsed = LEGACY_MODEL_ID;
      }

      if (status.status === "COMPLETED") {
        let result = null;
        const notes = [];

        try {
          const r1 = await fal.queue.result(modelUsed, { requestId: id });
          result = r1?.data || r1;
        } catch (e1) {
          notes.push("client result: " + e1.message);
        }

        if (!result && status.response_url) {
          try {
            const r2 = await fetch(status.response_url, {
              headers: { "Authorization": "Key " + process.env.FAL_KEY }
            });
            const bodyText = await r2.text();
            if (r2.ok) {
              try { result = JSON.parse(bodyText); } catch (_) { notes.push("direct: non-JSON"); }
            } else {
              notes.push("direct: HTTP " + r2.status + " body=" + bodyText.slice(0, 300));
            }
          } catch (e2) {
            notes.push("direct: " + e2.message);
          }
        }

        let videoUrl =
          result?.video?.url ||
          result?.data?.video?.url ||
          result?.output?.video?.url ||
          null;

        if (!videoUrl && result) {
          const raw = JSON.stringify(result);
          const m = raw.match(/https:\/\/[^"]+\.(mp4|mov|webm)[^"]*/);
          if (m) videoUrl = m[0];
        }

        // Supabase 영구 저장 로직 추가
        if (videoUrl) {
          try {
            const videoResponse = await fetch(videoUrl)
            const videoBuffer = await videoResponse.arrayBuffer()

            const fileName = `${id}.mp4`
            const { error: uploadError } = await supabase.storage
            .from('results')
            .upload(fileName, videoBuffer, {
                contentType: 'video/mp4',
                upsert: true
              })

            if (!uploadError) {
              const { data: urlData } = supabase.storage
              .from('results')
              .getPublicUrl(fileName)

              await supabase.from('orders').update({
                result_url: urlData.publicUrl,
                status: 'completed',
                fal_video_url: videoUrl
              }).eq('order_id', id)

              videoUrl = urlData.publicUrl // 응답 URL을 Supabase로 교체
            }
          } catch (e) {
            console.error('Supabase upload failed:', e)
          }
        }
        // Supabase 로직 끝

        return res.status(200).json({
         ...status,
          status: "COMPLETED",
          output: videoUrl? [videoUrl] : [],
          debug: videoUrl? undefined : { notes: notes, result: result }
        });
      }

      return res.status(200).json(status);
    } catch (err) {
      console.error("Error querying status:", err);
      return res.status(500).json({ error: err.message || "Failed to query status from Fal.ai" });
    }
  }

  // ─────────── POST: 이미지로 영상 생성 요청 ───────────
  if (req.method === "POST") {
    const { imageData, prompt, duration, resolution, aspectRatio } = req.body || {};
    if (!imageData) {
      return res.status(400).json({ error: "Missing imageData base64 string" });
    }

    try {
      const matches = imageData.match(/^data:([A-Za-z0-9.+\/-]+);base64,(.+)$/);
      if (!matches || matches.length!== 3) {
        return res.status(400).json({ error: "Invalid base64 imageData format." });
      }

      // 옵션 검증 — 잘못된 값이 오면 안전한 기본값으로
      const safeDuration = ALLOWED_DURATION.includes(duration)? duration : "5s";
      const safeResolution = ALLOWED_RESOLUTION.includes(resolution)? resolution : "540p";
      const safeAspect = ALLOWED_ASPECT.includes(aspectRatio)? aspectRatio : "9:16";

      const submitPrompt = prompt || "Cinematic 3D camera pan, high fashion, smooth motion, high detail, masterpiece";

      const queueResult = await fal.queue.submit(MODEL_ID, {
        input: {
          image_url: imageData,
          prompt: submitPrompt,
          duration: safeDuration,
          resolution: safeResolution,
          aspect_ratio: safeAspect
        }
      });

      console.log("Fal.ai Queue Submitted. ID:", queueResult.request_id,
        "| opts:", safeDuration, safeResolution, safeAspect);

      return res.status(200).json({
        success: true,
        requestId: queueResult.request_id,
        options: { duration: safeDuration, resolution: safeResolution, aspectRatio: safeAspect }
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
