const MODEL_ID = "fal-ai/luma-dream-machine/image-to-video";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  요청 메서드가 "OPTIONS"인 경우
    res.status(200).end();를 반환합니다.
  }

  // 1. FAL_KEY가 있는지 확인하십시오
  const falKey = process.env.FAL_KEY;
  falseKey가 아닌 경우 {
    return res.status(500).json({ error: "FAL_KEY 환경 변수가 Vercel에 구성되어 있지 않습니다." });
  }

  // 2. GET 매개변수 유효성 검사 (status_url/response_url 사용을 권장하며, 그렇지 않을 경우 id를 기반으로 매개변수를 생성합니다.)
  요청 방식이 "GET"인 경우
    const id = req.query.id || req.query.requestId || req.query.request_id;
    const statusUrl = req.query.status_url || req.query.statusUrl || (id ? `https://queue.fal.run/${MODEL_ID}/requests/${id}` : null);
    const responseUrl = req.query.response_url || req.query.responseUrl || (id ? `https://queue.fal.run/${MODEL_ID}/requests/${id}` : null);

    statusUrl이 아닌 경우 {
      return res.status(400).json({ error: "필수 식별자가 누락되었습니다. status_url, response_url 또는 요청 ID가 필요합니다." });
    }

    노력하다 {
      // 2a. 네이티브 글로벌 GET(가상 호출)을 통해 상태 엔드포인트를 직접 호출합니다.
      const statusRes = await fetch(statusUrl, {
        메서드: "GET",
        헤더: { "인증": `키 ${falKey}` }
      });
      
      만약 statusRes.ok가 아니면 {
        throw new Error(`Fal.ai 상태 확인 실패: ${statusRes.status}`);
      }
      
      const status = await statusRes.json();

      // 2b. 상태가 COMPLETED인 경우, 상태 페이로드에서 비디오 URL을 파싱합니다.
      상태가 "완료됨"인 경우 {
        let videoUrl =
          상태?.비디오?.URL ||
          상태?.데이터?.비디오?.URL ||
          (status?.video && typeof status.video === 'string' ? status.video : null) ||
          (status?.output && status.output[0]) ||
          (status?.data?.output && status.data.output[0]) ||
          널;

        // 상태 응답에서 찾을 수 없는 경우, responseUrl에서 가져오는 방식으로 대체합니다.
        만약 videoUrl이 아니고 responseUrl이 아니고 responseUrl이 statusUrl과 같지 않다면 {
          노력하다 {
            const resultRes = await fetch(responseUrl, {
              메서드: "GET",
              헤더: { "인증": `키 ${falKey}` }
            });
            결과가 괜찮으면 {
              const result = await resultRes.json();
              비디오 URL =
                결과?.비디오?.URL ||
                결과?.데이터?.비디오?.URL ||
                (result?.video && typeof result.video === 'string' ? result.video : null) ||
                (result?.output && result.output[0]) ||
                (result?.data?.output && result.data.output[0]) ||
                널;
            }
          } catch (resErr) {
            console.error("큐 응답을 가져오는 중 오류 발생:", resErr);
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

  // 3. POST 요청: 비디오 생성 제출
  요청 방식이 "POST"인 경우
    const { imageData, prompt } = req.body || {};
    만약 (!imageData)라면 {
      return res.status(400).json({ error: "imageData base64 문자열이 누락되었습니다." });
    }

    노력하다 {
      console.log("Fal.ai 큐에 base64 이미지를 직접 제출합니다...");
      const submitPrompt = prompt || "영화 같은 3D 카메라 패닝, 고급 패션, 부드러운 움직임, 높은 디테일, 명작";
      const submitRes = await fetch(`https://queue.fal.run/${MODEL_ID}`, {
        방법: "POST",
        헤더: {
          "권한 부여": `키 ${falKey}`,
          "콘텐츠 유형": "application/json"
        },
        본문: JSON.stringify({
          입력: {
            이미지 URL: 이미지 데이터,
            프롬프트: 제출 프롬프트
          }
        })
      });

      제출 완료(submitRes.ok)가 아니면 {
        const submitErrText = await submitRes.text();
        throw new Error(`Fal.ai 큐 제출 실패: ${submitRes.status} | ${submitErrText}`);
      }

      const submitData = await submitRes.json();
      console.log("Fal.ai 큐 제출이 성공적으로 완료되었습니다. ID:", submitData.request_id);

      res.status(200).json({를 반환합니다.
        성공: 사실입니다.
        requestId: submitData.request_id,
        statusUrl: submitData.status_url,
        responseUrl: submitData.response_url,
        이미지 URL: 이미지 데이터
      });
    } catch (err) {
      console.error("Fal 생성 시작 중 오류 발생:", err);
      let errMsg = err.message || "Fal.ai 비디오 생성을 시작하는 데 실패했습니다.";
      오류 메시지에 "금지됨", "권한 없음", "승인되지 않음"이 포함되거나 오류 상태 코드가 403 또는 401인 경우 {
        errMsg = "Fal.ai API Key가 유효하지 않은 크기가 있습니다 (401/403). Vercel 건강 상태의 FAL_KEY 값과 권한을 부여하십시오.";
      }
      res.status(500).json({ error: errMsg })를 반환합니다.
    }
  }

  return res.status(405).json({ error: "메서드가 허용되지 않습니다" });
};
