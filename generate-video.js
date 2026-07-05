 // AVVM generate-video API — 최종 통합본 (팻팀장 검수 완료)
// 포함: Ray-2 Flash 모델 + 화질/길이 옵션 + response_url 폴백(버그픽스)
//      + 구주문 호환 + Supabase 영구 보관
const MODEL_ID = "fal-ai/luma-dream-machine/ray-2-flash/image-to-video";
const LEGACY_MODEL_ID = "fal-ai/luma-dream-machine/image-to-video";

const ALLOWED_DURATION = ["5s", "9s"];
const ALLOWED_RESOLUTION = ["540p", "720p", "1080p"];
const ALLOWED_ASPECT = ["16:9", "9:16", "4:3", "3:4", "21:9", "9:21", "1:1"];

async function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  } catch (e) {
    console.error("Supabase init failed:", e.message);
    return null;
  }
}

// fal 영상을 Supabase Storage로 복사하고 영구 URL 반환 (실패 시 null)
async function archiveVideo(supabase, requestId, falUrl) {
  try {
    const dl = await fetch(falUrl);
    if (!dl.ok) throw new Error("download HTTP " + dl.status);
    const buf = Buffer.from(await dl.arrayBuffer());

    const path = requestId + ".mp4";
    const { error: upErr } = await supabase.storage
      .from("videos")
      .upload(path, buf, { contentType: "video/mp4", upsert: true });
    if (upErr) throw upErr;

    const { data } = supabase.storage.from("videos").getPublicUrl(path);
    return (data && data.publicUrl) || null;
  } catch (e) {
    console.error("archiveVideo failed:", e.message);
    return null;
  }
}

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

  // ─────────── GET: 상태 조회 + 완료 시 영구 URL 반환 ───────────
  if (req.method === "GET") {
    const id = req.query.id || req.query.requestId || req.query.request_id;
    if (!id) {
      return res.status(400).json({ error: "Missing request_id parameter." });
    }
    try {
      const supabase = await getSupabase();

      // 0) 이미 보관된 영상이 있으면 fal 조회 없이 즉시 반환 (중복 복사 방지)
      if (supabase) {
        try {
          const { data: existing } = await supabase
            .from("orders")
            .select("result_url")
            .eq("request_id", id)
            .maybeSingle();
          if (existing && existing.result_url) {
            return res.status(200).json({
              status: "COMPLETED",
              request_id: id,
              output: [existing.result_url],
              archived: true
            });
          }
        } catch (e) {
          console.error("Supabase lookup failed:", e.message);
        }
      }

      // 1) fal 상태 조회 (새 모델 → 실패 시 예전 모델: 구주문 호환)
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

        // 2a) 클라이언트로 결과 조회
        try {
          const r1 = await fal.queue.result(modelUsed, { requestId: id });
          result = (r1 && r1.data) || r1;
        } catch (e1) {
          notes.push("client result: " + e1.message);
        }

        // 2b) 실패 시 response_url 직접 조회 (핵심 버그픽스 — 제거 금지)
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

        // 3) 다양한 응답 구조에서 영상 URL 추출
        let videoUrl =
          (result && result.video && result.video.url) ||
          (result && result.data && result.data.video && result.data.video.url) ||
          (result && result.output && result.output.video && result.output.video.url) ||
          null;

        if (!videoUrl && result) {
          const raw = JSON.stringify(result);
          const m = raw.match(/https:\/\/[^"]+\.(mp4|mov|webm)[^"]*/);
          if (m) videoUrl = m[0];
        }

        // 4) Supabase에 영구 보관 (실패해도 fal URL로 폴백)
        let finalUrl = videoUrl;
        let archived = false;
        if (videoUrl && supabase) {
          const permanentUrl = await archiveVideo(supabase, id, videoUrl);
          if (permanentUrl) {
            finalUrl = permanentUrl;
            archived = true;
            try {
              await supabase.from("orders").upsert(
                { request_id: id, result_url: permanentUrl, status: "completed" },
                { onConflict: "request_id" }
              );
            } catch (e) {
              console.error("orders upsert failed:", e.message);
            }
          }
        }

        return res.status(200).json({
          ...status,
          status: "COMPLETED",
          output: finalUrl ? [finalUrl] : [],
          archived: archived,
          debug: finalUrl ? undefined : { notes: notes, result: result }
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
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: "Invalid base64 imageData format." });
      }

      // 옵션 검증 — 허용 외 값은 안전한 기본값으로
      const safeDuration = ALLOWED_DURATION.includes(duration) ? duration : "5s";
      const safeResolution = ALLOWED_RESOLUTION.includes(resolution) ? resolution : "540p";
      const safeAspect = ALLOWED_ASPECT.includes(aspectRatio) ? aspectRatio : "9:16";

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

      // 주문 행 기록 (실패해도 생성 흐름은 계속)
      try {
        const supabase = await getSupabase();
        if (supabase && queueResult.request_id) {
          await supabase.from("orders").insert({
            request_id: queueResult.request_id,
            status: "processing"
          });
        }
      } catch (dbErr) {
        console.error("orders insert failed:", dbErr.message);
      }

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
