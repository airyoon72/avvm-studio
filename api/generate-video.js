module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  요청 메서드가 "OPTIONS"인 경우
    res.status(200).end();를 반환합니다.
  }

  // 1. FAL_KEY가 있는지 확인하십시오
  만약 process.env.FAL_KEY가 아니라면 {
    return res.status(500).json({ error: "FAL_KEY 환경 변수가 Vercel에 구성되어 있지 않습니다." });
  }

  // 2. GET 매개변수를 즉시 검증합니다(지원 ID, 요청 ID 및 요청 ID).
  요청 방식이 "GET"인 경우
    const id = req.query.id || req.query.requestId || req.query.request_id;
    id가 아닌 경우 {
      return res.status(400).json({ error: "request_id 매개변수가 누락되었습니다(id, requestId 또는 request_id를 사용하세요)." });
    }
  }

  // 3. CommonJS ESM require 충돌을 우회하기 위한 @fal-ai/client의 동적 가져오기
  떨어지게 놔두세요;
  노력하다 {
    const falModule = await import("@fal-ai/client");
    fal = falModule.fal;
    fal.config({ credentials: process.env.FAL_KEY });
  } catch (err) {
    console.error("@fal-ai/client를 동적으로 가져오는 데 실패했습니다:", err);
    return res.status(500).json({ error: "Failed to load @fal-ai/client dependency dynamically: " + err.message });
  }

  요청 방식이 "GET"인 경우
    const id = req.query.id || req.query.requestId || req.query.request_id;
    노력하다 {
      const status = await fal.queue.status("fal-ai/luma-dream-machine/image-to-video", {
        requestId: id,
        로그: false
      });
      res.status(200).json(status)를 반환합니다.
    } catch (err) {
      console.error("상태 조회 오류:", err);
      return res.status(500).json({ error: err.message || "Fal.ai에서 상태를 조회하는 데 실패했습니다." });
    }
  }

  요청 방식이 "POST"인 경우
    const { imageData, prompt } = req.body;
    만약 (!imageData)라면 {
      return res.status(400).json({ error: "imageData base64 문자열이 누락되었습니다." });
    }

    노력하다 {
      const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      일치하는 항목이 없거나 일치하는 항목의 길이가 3이 아니면 {
        return res.status(400).json({ error: "잘못된 base64 imageData 형식입니다." });
      }
      
      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');

      확장자를 "png"로 설정하세요.
      만약 mimeType에 "jpeg"이 포함되어 있거나 "jpg"이 포함되어 있다면,
        확장자 = "jpg";
      } 그렇지 않고 mimeType에 "webp"가 포함되어 있으면 {
        확장 = "webp";
      }

      const fileName = `upload-${Date.now()}.${extension}`;

      const uploadResult = await fal.storage.upload(buffer, {
        파일 이름: 파일 이름,
        콘텐츠 유형: mimeType
      });

      const imageUrl = uploadResult.url;
      console.log("이미지가 Fal CDN에 성공적으로 업로드되었습니다:", imageUrl);

      const submitPrompt = prompt || "영화 같은 3D 카메라 패닝, 고급 패션, 부드러운 움직임, 높은 디테일, 명작";

      const queueResult = await fal.queue.submit("fal-ai/luma-dream-machine/image-to-video", {
        입력: {
          이미지 URL: 이미지 URL,
          프롬프트: 제출 프롬프트
        }
      });

      console.log("Fal.ai 큐 제출이 성공적으로 완료되었습니다. ID:", queueResult.request_id);

      res.status(200).json({를 반환합니다.
        성공: 사실입니다.
        requestId: queueResult.request_id,
        이미지 URL: 이미지 URL
      });
    } catch (err) {
      console.error("Fal 생성 시작 중 오류 발생:", err);
      let errMsg = err.message || "Fal.ai 비디오 생성을 시작하는 데 실패했습니다.";
      오류 메시지에 "금지됨"이라는 메시지가 포함되어 있거나, "권한 없음"이라는 메시지가 포함되어 있거나, 오류 상태 코드가 403인 경우 {
        errMsg = "Fal.ai API Key가 유효하지 않은 엄지손가락이 있습니다(403 Forbidden). Vercel 건강 상태의 FAL_KEY 값을 확인하세요.";
      }
      res.status(500).json({ error: errMsg })를 반환합니다.
    }
  }

  return res.status(405).json({ error: "메서드가 허용되지 않습니다" });
};
