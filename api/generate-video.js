const MODEL_ID = "fal-ai/luma-dream-machine/image-to-video";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  요청 메서드가 "OPTIONS"인 경우
    res.status(200).end();를 반환합니다.
  }

  // 1. FAL_KEY 상태 확인
  만약 process.env.FAL_KEY가 아니라면 {
    return res.status(500).json({ error: "FAL_KEY 환경 변수가 Vercel에 구성되어 있지 않습니다." });
  }

  // 2. 모두 GET 검증(id, requestId, request_id 지원)
  요청 방식이 "GET"인 경우
    const id = req.query.id || req.query.requestId || req.query.request_id;
    id가 아닌 경우 {
      return res.status(400).json({ error: "request_id 매개변수가 누락되었습니다(id, requestId 또는 request_id를 사용하세요)." });
    }
  }

  // 3. @fal-ai/client import (CommonJS/ESM 호환)
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
      const status = await fal.queue.status(MODEL_ID, {
        requestId: id,
        로그: false
      });

      // 수정 #3: queue.status()는 출력을 포함하지 않습니다.
      // COMPLETED일 때 queue.result()를 호출해서
      // 프론트엔드가 기대되는 출력[0]형태로 영상 URL을 보내드립니다.
      상태가 "완료됨"인 경우 {
        videoUrl을 null로 설정하세요.

        // 가능하다면 status.data에서 직접 추출해 보세요.
        만약 (status.data)이면 {
          비디오 URL =
            상태.데이터.비디오?.url ||
            (status.data.video && typeof status.data.video === 'string' ? status.data.video : null) ||
            (status.data.output && status.data.output[0]) ||
            (status.data.images && status.data.images[0]?.url) ||
            널;
        }

        // status.data에서 해결되지 않은 경우 queue.result로 대체합니다.
        만약 (!videoUrl) {
          노력하다 {
            const result = await fal.queue.result(MODEL_ID, { requestId: id });
            console.log("Fal Queue Result raw payload:", JSON.stringify(result));
            비디오 URL =
              결과?.데이터?.비디오?.URL ||
              결과?.비디오?.URL ||
              (result?.data?.video && typeof result.data.video === 'string' ? result.data.video : null) ||
              (result?.video && typeof result.video === 'string' ? result.video : null) ||
              (result?.data?.output && result.data.output[0]) ||
              (result?.output && result.output[0]) ||
              (result?.data?.images && result.data.images[0]?.url) ||
              (result?.images && result.images[0]?.url) ||
              널;
          } catch (resultErr) {
            console.error("결과 대체 항목을 가져오는 중 오류 발생:", resultErr);
          }
        }

        res.status(200).json({를 반환합니다.
          ...상태,
          상태: "완료됨"
          출력: videoUrl ? [videoUrl] : []
        });
      }

      res.status(200).json(status)를 반환합니다.
    } catch (err) {
      console.error("상태 조회 오류:", err);
      return res.status(500).json({ error: err.message || "Fal.ai에서 상태를 조회하는 데 실패했습니다." });
    }
  }

  요청 방식이 "POST"인 경우
    const { imageData, prompt } = req.body || {};
    만약 (!imageData)라면 {
      return res.status(400).json({ error: "imageData base64 문자열이 누락되었습니다." });
    }

    노력하다 {
      const matches = imageData.match(/^data:([A-Za-z0-9.+\/-]+);base64,(.+)$/);
      일치하는 항목이 없거나 일치하는 항목의 길이가 3이 아니면 {
        return res.status(400).json({ error: "잘못된 base64 imageData 형식입니다." });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      // 수정 #1: fal.storage.upload()는 Blob/File을 받아들입니다.
      // 버퍼 + 옵션을 넘기면 안 Blob으로 감싸서 전달합니다.
      const blob = new Blob([buffer], { type: mimeType });

      // 수정 #2: Storage.upload()는 URL 문자열을 직접 반환합니다.
      // (객체의 .url 프로퍼티가있음).
      const imageUrl = await fal.storage.upload(blob);

      console.log("이미지가 Fal CDN에 성공적으로 업로드되었습니다:", imageUrl);

      const submitPrompt = prompt || "영화 같은 3D 카메라 패닝, 고급 패션, 부드러운 움직임, 높은 디테일, 명작";

      const queueResult = await fal.queue.submit(MODEL_ID, {
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
      오류 본문과 오류 본문의 세부 정보가 일치하는 경우 {
        노력하다 {
          errMsg += " | detail: " + JSON.stringify(err.body.detail);
        } 잡다 (_) {}
      }
      오류 메시지에 "금지됨", "권한 없음", "승인되지 않음"이 포함되거나 오류 상태 코드가 403 또는 401인 경우 {
        errMsg = "Fal.ai API Key가 유효하지 않은 크기가 있습니다 (401/403). Vercel 건강 상태의 FAL_KEY 값과 권한을 부여하십시오.";
      }
      res.status(500).json({ error: errMsg })를 반환합니다.
    }
  }

  return res.status(405).json({ error: "메서드가 허용되지 않습니다" });
};
