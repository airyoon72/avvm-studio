/* ==========================================
   AVVM V10 Scroll Guard & Utility Functions
   ========================================== */
(function(){
  try{
    if(location.hash === '#hero'){
      history.replaceState(null,'',location.pathname + location.search);
    }
    if('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }catch(e){}
})();

const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));

const nav=$('#nav'); 
if(nav) addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40));

const toastEl=$('#toast');
function toast(msg){ 
  if(!toastEl) return;
  toastEl.textContent=msg; 
  toastEl.classList.add('on'); 
  clearTimeout(window.__toastTimer); 
  window.__toastTimer=setTimeout(()=>toastEl.classList.remove('on'),2200); 
}

const modal=$('#orderModal'); 
const modalCard=$('#modalCard'); 
const summary=$('#orderSummary');

window.prices={
  'Mini Transform':'₩4,900',
  'Basic Transform':'₩7,900',
  'Best Transform':'₩12,900',
  '3 Style Set':'₩19,900',
  Starter:'₩19,900',
  Pro:'₩39,900',
  Signature:'₩79,900',
  Custom:'상담 후 견적',
  'Memorial Basic':'₩29,900',
  'Memorial Duo':'₩49,900',
  'ID Mini':'₩5,900',
  'ID Set':'₩9,900',
  'Profile Pro':'₩29,900'
}; 
window.selectedPlan='Pro';

function getNumericPrice(plan) {
  const priceStr = window.prices[plan] || '₩39,900';
  if (priceStr.includes('상담') || priceStr.includes('Negotiation')) return 100;
  const cleaned = priceStr.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 100;
}

function setOrderSummary(){
  const lang=localStorage.getItem('avvmLang')||'ko';
  const order=window.ORDER ? (window.ORDER[lang]||window.ORDER.ko) : {planPrefix:'Selected plan: '};
  if(summary) summary.textContent=`${order.planPrefix || 'Selected plan: '}${window.selectedPlan} · ${window.prices[window.selectedPlan]||window.prices.Pro}`;
}

function scrollModalToTop(){
  try{
    if(modalCard) modalCard.scrollTop=0;
    if(modal) modal.scrollTop=0;
    const panel=modal?.querySelector('.modal-card,.modal-content,.order-panel');
    if(panel) panel.scrollTop=0;
  }catch(e){}
}

function updatePhotoUploadLabel(){
  const input=$('#imageInput');
  const box=$('#photoUploadVisibleBlock');
  if(!input || !box) return;
  const label=box.querySelector('.photo-upload-drop b');
  const small=box.querySelector('.photo-upload-drop small');
  if(input.files && input.files[0]){
    if(label) label.textContent='첨부 완료 ✓';
    if(small) small.textContent=input.files[0].name;
    box.classList.add('has-file');
  }else{
    if(label) label.textContent='사진 첨부하기';
    if(small) small.textContent='JPG, PNG, WEBP 등 이미지 파일';
    box.classList.remove('has-file');
  }
}

if($('#imageInput')){
  $('#imageInput').addEventListener('change', updatePhotoUploadLabel);
}

function syncCustomerInputs(){
  const pairs=[
    ['#brandInput','#brandInput2'],
    ['#emailInput','#emailInput2'],
    ['#phoneInput','#phoneInput2']
  ];
  pairs.forEach(([aSel,bSel])=>{
    const a=$(aSel), b=$(bSel);
    if(!a || !b || a.dataset.synced==='1') return;
    a.dataset.synced='1'; b.dataset.synced='1';
    const sync=(from,to)=>{ if(to.value!==from.value) to.value=from.value; };
    a.addEventListener('input',()=>sync(a,b));
    b.addEventListener('input',()=>sync(b,a));
  });
}
syncCustomerInputs();

function getCustomerValue(primary, secondary){
  const a=$(primary), b=$(secondary);
  return ((b && b.value.trim()) || (a && a.value.trim()) || '');
}

function focusCustomerField(primary, secondary){
  const target=$(secondary) || $(primary);
  if(!target) return;
  try{
    target.scrollIntoView({behavior:'smooth', block:'center'});
    target.classList.add('field-attention');
    setTimeout(()=>target.classList.remove('field-attention'),1900);
    setTimeout(()=>{ try{ target.focus({preventScroll:true}); }catch(e){ target.focus(); } },260);
  }catch(e){}
}

function focusAndReveal(selector){
  const el=$(selector);
  if(!el) return;
  try{
    el.classList.add('field-attention');
    setTimeout(()=>el.classList.remove('field-attention'),1800);
    el.scrollIntoView({behavior:'smooth', block:'center'});
    setTimeout(()=>{ try{ el.focus({preventScroll:true}); }catch(e){ el.focus(); } },260);
  }catch(e){}
}

function openPlanChooser(){
  if(!modalCard || !modal) return;
  modalCard.classList.remove('done');
  modalCard.classList.add('plan-choosing');
  modal.classList.add('on');
  document.body.style.overflow='hidden';
  if(window.__avvmLenis) window.__avvmLenis.stop();
  setTimeout(scrollModalToTop,0);
}

function openOrder(plan){
  if(!plan){ openPlanChooser(); return; }
  window.selectedPlan=plan||window.selectedPlan;
  if(modalCard){
    modalCard.classList.remove('done');
    modalCard.classList.remove('plan-choosing');
  }
  setOrderSummary();

  const chip4K = document.getElementById('chip-4k');
  if (chip4K) {
    if (plan === 'Signature' || plan === 'Custom') {
      chip4K.style.display = 'inline-block';
    } else {
      chip4K.style.display = 'none';
      if (chip4K.classList.contains('active')) {
        chip4K.classList.remove('active');
        const defaultChip = document.querySelector('[data-option-group="resolution"] [data-value="1080p"]');
        if (defaultChip) defaultChip.classList.add('active');
        const hiddenRes = document.getElementById('resolution');
        if (hiddenRes) hiddenRes.value = '1080p';
      }
    }
  }
  
  const isIdProfile = plan.startsWith('ID') || plan.startsWith('Profile');
  const guide = $('#uploadGuideBox');
  if (guide) guide.style.display = isIdProfile ? 'block' : 'none';
  const styleBlock = $('.style-select-block');
  if (styleBlock) styleBlock.style.display = isIdProfile ? 'none' : 'block';
  const aspectGroup = $('#aspectGroup');
  if (aspectGroup) aspectGroup.style.display = isIdProfile ? 'none' : 'block';
  const resolutionGroup = $('#resolutionGroup');
  if (resolutionGroup) resolutionGroup.style.display = isIdProfile ? 'none' : 'block';
  const idSpecGroup = $('#idSpecGroup');
  if (idSpecGroup) idSpecGroup.style.display = isIdProfile ? 'block' : 'none';

  if(modal) modal.classList.add('on');
  document.body.style.overflow='hidden';
  if(window.__avvmLenis) window.__avvmLenis.stop();
  requestAnimationFrame(()=>{
    scrollModalToTop();
    setTimeout(()=>{ syncCustomerInputs(); focusAndReveal('#photoUploadVisibleBlock'); },120);
  });
}

function closeOrder(){ 
  if(modal) modal.classList.remove('on'); 
  if(modalCard) modalCard.classList.remove('plan-choosing'); 
  document.body.style.overflow=''; 
  if(window.__avvmLenis) window.__avvmLenis.start();
}

$$('[data-open]').forEach(b=>b.addEventListener('click',()=>openOrder(b.dataset.plan)));
document.addEventListener('click', function(e){
  const choice=e.target.closest('[data-plan-choice]');
  if(!choice) return;
  openOrder(choice.getAttribute('data-plan-choice'));
});

if($('#closeModal')) $('#closeModal').addEventListener('click',closeOrder); 
if(modal) modal.addEventListener('click',e=>{if(e.target===modal)closeOrder();});

$$('.cat').forEach(b=>b.addEventListener('click',()=>{$$('.cat').forEach(x=>x.classList.remove('active'));b.classList.add('active'); toast(`${b.textContent} mood selected`);}));

let lastOrder=null;
const apiBase = (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.endsWith('.lhr.life')) 
  ? 'https://avvm.studio' 
  : '';

function makeOrderId(){ 
  return 'AVVM-' + new Date().toISOString().slice(0,10).replaceAll('-','') + '-' + Math.random().toString(36).slice(2,7).toUpperCase(); 
}

/* 이미지 압축 (오타 j 완전 제거) */
function compressImage(file, maxW = 1024, maxH = 1024) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxW || h > maxH) {
          if (w > h) { h = Math.round((h * maxW) / w); w = maxW; }
          else { w = Math.round((w * maxH) / h); h = maxH; }
        }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        resolve(canvas.toDataURL('image/jpeg', isMobile ? 0.72 : 0.8));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ==========================================
   [HOOK 1b: 결제 성공 후 실제 주문 접수 & 영상 생성]
   ========================================== */
async function proceedWithOrderCreation(orderId, brand, email, phone, privacyConsent, notifyConsent, refundConsent, marketingConsent, category, mood, paymentResponse, totalAmount) {
  if(modalCard) modalCard.classList.add('done');
  if($('#successOrderId')) $('#successOrderId').textContent='ORDER #' + orderId;
  toast('주문 접수 시작 ✓');

  let progressDiv = document.getElementById('videoProgressContainer');
  if (!progressDiv) {
    progressDiv = document.createElement('div');
    progressDiv.id = 'videoProgressContainer';
    progressDiv.style.cssText = 'margin:18px 0; padding:18px; border-radius:16px; background:rgba(216,242,51,0.06); border:1px dashed rgba(216,242,51,0.3); text-align:center;';
    const successPanel = document.querySelector('.success-panel');
    if (successPanel) {
      const viewLink = document.getElementById('viewOrderLink');
      successPanel.insertBefore(progressDiv, viewLink);
    }
  }

  progressDiv.innerHTML = `
    <div style="font-size:12px; font-weight:800; color:var(--lime); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em; display:flex; align-items:center; justify-content:center; gap:6px;">
      <span class="spinner" style="display:inline-block; width:12px; height:12px; border:2px solid var(--lime); border-top-color:transparent; border-radius:50%; animation:spin 1s linear infinite;"></span>
      서버 연결 및 이미지 업로드 중...
    </div>
    <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:999px; overflow:hidden; margin:10px 0;">
      <div id="videoProgressBar" style="width:10%; height:100%; background:var(--lime); transition:width 0.4s ease; border-radius:999px;"></div>
    </div>
    <div id="videoProgressLabel" style="font-size:11px; color:rgba(255,255,255,0.6)">Fal.ai CDN으로 사진 데이터를 전송하고 있습니다.</div>
  `;

  if (!document.getElementById('spinnerStyle')) {
    const style = document.createElement('style');
    style.id = 'spinnerStyle';
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
  }

  let imageData = '';
  const imgFile = $('#imageInput')?.files?.[0];
  if (imgFile) {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      imageData = await compressImage(imgFile, isMobile ? 768 : 1024, isMobile ? 768 : 1024);
    } catch (e) {
      console.error("Compression failed, raw reader fallback:", e);
      try {
        imageData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imgFile);
        });
      } catch (e2) { console.error(e2); }
    }
  }

  const token=(crypto && crypto.getRandomValues) ? Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b=>b.toString(16).padStart(2,'0')).join('') : Math.random().toString(36).slice(2)+Date.now().toString(36);
  
  const draft={
    orderId,
    token,
    createdAt:new Date().toISOString(),
    brand, email, phone, imageData,
    consents:{ privacy:privacyConsent, transactionalNotice:notifyConsent, customDigitalRefundLimit:refundConsent, marketing:marketingConsent },
    plan:window.selectedPlan,
    price:window.prices[window.selectedPlan]||window.prices.Pro,
    category, mood,
    aspectRatio:(document.getElementById("aspectRatio")?.value || "9:16"),
    resolution:(document.getElementById("resolution")?.value || "540p"),
    idSpec:(document.getElementById("idSpec")?.value || ""),
    imageName: imgFile ? imgFile.name : 'no_image',
    status:'payment_completed',
    statusKo:'결제 완료',
    payment:{
      provider:'portone_v2_kpn',
      paymentId: paymentResponse?.paymentId || orderId,
      txId: paymentResponse?.txId || '',
      currency:'KRW',
      amount: totalAmount,
      browserResponseReceived:true,
      serverVerified:false
    },
    notificationMethod:'kakao_or_sms',
    viewUrl: location.origin + '/order.html?t=' + token
  };

  let requestId = null, apiError = null;

  if (imageData) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    try {
      const resGen = await fetch(apiBase + '/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData,
          prompt: `A beautiful cinematic video of brand ${brand}, style ${category}, mood ${mood}. High fashion, flowing movement, smooth panning shot, 8k resolution, photorealistic, masterpiece.`
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (resGen.ok) {
        const dataGen = await resGen.json();
        if (dataGen.requestId) {
          requestId = dataGen.requestId;
          draft.requestId = requestId;
          draft.statusUrl = dataGen.statusUrl;
          draft.responseUrl = dataGen.responseUrl;
          draft.status = 'processing';
          draft.statusKo = '영상 제작 중';
        } else { apiError = "서버리스 API로부터 잘못된 형식의 응답을 받았습니다."; }
      } else {
        const errData = await resGen.json().catch(() => ({}));
        apiError = errData.error || `HTTP 에러 ${resGen.status}`;
      }
    } catch (err) {
      clearTimeout(timeoutId);
      apiError = (err.name === 'AbortError') ? "서버 응답 제한 시간(15초)을 초과했습니다." : (err.message || "네트워크 요청이 실패했습니다.");
      console.error("Failed to start video generation API:", err);
    }
  }

  try{
    const res=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(draft)});
    if(res.ok){ const data=await res.json(); if(data.orderId) draft.orderId=data.orderId; }
  }catch(e){}

  draft.viewUrl = location.origin + '/order.html?t=' + draft.token;
  lastOrder=draft;
  const orders=JSON.parse(localStorage.getItem('avvmOrders')||'[]').filter(o=>o.token!==draft.token);
  orders.unshift(draft);
  localStorage.setItem('avvmOrders',JSON.stringify(orders.slice(0,50)));
  localStorage.setItem('avvmOrder_'+draft.token, JSON.stringify(draft));
  localStorage.setItem('avvmLastOrder', JSON.stringify(draft));

  if($('#successOrderId')) $('#successOrderId').textContent='ORDER #' + draft.orderId;
  const view=$('#viewOrderLink'); if(view){ view.href=draft.viewUrl; }
  const copy=$('#orderLinkCopy'); if(copy){ copy.textContent='주문 및 결제가 완료되었습니다.'; copy.dataset.customized='1'; }
  toast('주문 접수 완료 ✓');

  if (requestId) {
    startPolling(requestId, draft.token);
  } else if (imageData && apiError) {
    showDetailedFailure(apiError, draft.token, progressDiv);
  } else {
    progressDiv.innerHTML = `
      <div style="font-size:12px; font-weight:800; color:var(--lime); margin-bottom:4px;">주문이 정상 접수되었습니다.</div>
      <div style="font-size:11px; color:rgba(255,255,255,0.6)">실제 비디오 제작을 하려면 사진을 업로드해 주세요.</div>
    `;
  }
}

/* ==========================================
   [HOOK 1a: 결제 모듈 요청 & 검증]
   ========================================== */
const PORTONE_V2_CONFIG = Object.freeze({
  storeId: 'store-d1ebe1b0-2b8e-47aa-8a15-ac7682751ad7',
  channelKey: 'channel-key-aa785533-541b-4702-95ec-2533edb80475'
});
let paymentInProgress = false;

function loadPortOneV2(){
  if(window.PortOne && typeof window.PortOne.requestPayment === 'function'){
    return Promise.resolve(window.PortOne);
  }
  if(window.__avvmPortOneV2Promise) return window.__avvmPortOneV2Promise;
  window.__avvmPortOneV2Promise = new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[data-avvm-portone-v2]');
    if(existing){
      existing.addEventListener('load',()=>resolve(window.PortOne),{once:true});
      existing.addEventListener('error',()=>reject(new Error('PortOne V2 SDK를 불러오지 못했습니다.')),{once:true});
      return;
    }
    const script=document.createElement('script');
    script.src='https://cdn.portone.io/v2/browser-sdk.js';
    script.async=true;
    script.dataset.avvmPortoneV2='1';
    script.onload=()=>{
      if(window.PortOne && typeof window.PortOne.requestPayment === 'function') resolve(window.PortOne);
      else reject(new Error('PortOne V2 SDK 초기화에 실패했습니다.'));
    };
    script.onerror=()=>reject(new Error('PortOne V2 SDK를 불러오지 못했습니다.'));
    document.head.appendChild(script);
  });
  return window.__avvmPortOneV2Promise;
}

function setPaymentButtonBusy(busy){
  const button=$('#submitOrder');
  if(!button) return;
  button.disabled=busy || !(
    $('#privacyConsent')?.checked &&
    $('#notifyConsent')?.checked &&
    $('#refundConsent')?.checked
  );
  button.textContent=busy ? '결제창을 여는 중...' : '테스트 결제하기';
  button.setAttribute('aria-busy', busy ? 'true' : 'false');
}

async function createOrder(){
  if(paymentInProgress) return;
  syncCustomerInputs();
  const brand=getCustomerValue('#brandInput','#brandInput2');
  const email=getCustomerValue('#emailInput','#emailInput2');
  const phone=getCustomerValue('#phoneInput','#phoneInput2');
  const privacyConsent=!!($('#privacyConsent')?.checked);
  const notifyConsent=!!($('#notifyConsent')?.checked);
  const refundConsent=!!($('#refundConsent')?.checked);
  const marketingConsent=!!($('#marketingConsent')?.checked);
  const category=$('.cat.active')?.textContent?.trim() || 'Custom';
  const mood=$('#moodInput')?.value?.trim() || '';

  if(!brand){toast('성함 / 브랜드명을 입력해주세요'); focusCustomerField('#brandInput','#brandInput2'); return;}
  if(email && !email.includes('@')){toast('이메일 형식을 확인해주세요'); focusCustomerField('#emailInput','#emailInput2'); return;}
  if(!phone){toast('카톡/문자 알림용 휴대폰 번호를 입력해주세요'); focusCustomerField('#phoneInput','#phoneInput2'); return;}
  if(!privacyConsent || !notifyConsent || !refundConsent){toast('필수 동의 항목을 확인해주세요'); focusAndReveal('#consentGroup'); return;}
  if(window.selectedPlan === 'Custom' || String(window.prices[window.selectedPlan]||'').includes('상담')){
    toast('Custom 플랜은 상담 후 견적으로 진행됩니다.');
    return;
  }

  const orderId=makeOrderId();
  const totalAmount=getNumericPrice(window.selectedPlan);
  if(!Number.isFinite(totalAmount) || totalAmount < 100){
    toast('결제 금액을 확인할 수 없습니다.');
    return;
  }

  paymentInProgress=true;
  setPaymentButtonBusy(true);

  try{
    const PortOne=await loadPortOneV2();
    // 재결제 시 ID 충돌 방지용 타임스탬프 결합
    const paymentId = (orderId.replace(/[^a-zA-Z0-9]/g, '') + Date.now().toString(36)).slice(0, 32);

    const response=await PortOne.requestPayment({
      storeId:PORTONE_V2_CONFIG.storeId,
      channelKey:PORTONE_V2_CONFIG.channelKey,
      paymentId,
      orderName:`AVVM ${window.selectedPlan}`.slice(0,40),
      totalAmount,
      currency:'CURRENCY_KRW',
      payMethod:'CARD',
      customer:{
        fullName:brand,
        phoneNumber:phone.replace(/[^0-9]/g,''),
        ...(email ? {email} : {})
      }
    });

    if(!response){
      toast('결제창이 닫혔습니다. 다시 시도해주세요.');
      return;
    }
    if(response.code){
      console.warn('PortOne payment failed:',response);
      toast(response.message || '결제가 취소되었거나 실패했습니다.');
      return;
    }

    toast('결제가 완료되었습니다. 주문을 접수합니다.');
    
    // 결제 성공 시에만 AI 영상 생성 및 주문 등록 진행
    await proceedWithOrderCreation(
      orderId, brand, email, phone,
      privacyConsent, notifyConsent, refundConsent, marketingConsent,
      category, mood, response, totalAmount
    );

  }catch(error){
    console.error('PortOne V2 payment error:',error);
    toast(error?.message || '결제 모듈 실행 중 오류가 발생했습니다.');
  }finally{
    paymentInProgress=false;
    setPaymentButtonBusy(false);
  }
}

/* ==========================================
   [안전장치가 적용된 Polling & UI 제어]
   ========================================== */
function showDetailedFailure(errorMessage, token, container) {
  if(!container) return;
  container.innerHTML = `
    <div style="font-size:12px; font-weight:800; color:#ff4d4d; margin-bottom:8px; text-transform:uppercase;">✗ 영상 제작 요청 실패 (Request Failed)</div>
    <div style="font-size:11px; color:rgba(255,255,255,0.7); line-height:1.6; margin-bottom:12px; word-break:break-all;">
      에러 내용: ${errorMessage}<br/>
      <span style="color:rgba(255,255,255,0.45); font-size:10px;">(Vercel의 FAL_KEY 설정과 API 상태를 다시 확인해 주세요.)</span>
    </div>
    <button id="retryVideoBtn" class="btn btn-primary" style="margin-top:6px; padding:10px 18px; font-size:11px; background:#ff4d4d; border-color:#ff4d4d; color:#fff; cursor:pointer;">재시도 (Retry Generation)</button>
  `;
  
  document.getElementById('retryVideoBtn')?.addEventListener('click', async () => {
    container.innerHTML = `
      <div style="font-size:12px; font-weight:800; color:var(--lime); margin-bottom:8px; display:flex; align-items:center; justify-content:center; gap:6px;">
        <span class="spinner" style="display:inline-block; width:12px; height:12px; border:2px solid var(--lime); border-top-color:transparent; border-radius:50%; animation:spin 1s linear infinite;"></span>
        영상을 다시 요청하는 중...
      </div>
    `;
    const order = JSON.parse(localStorage.getItem('avvmOrder_' + token) || '{}');
    if (order.imageData) {
      try {
        const resGen = await fetch(apiBase + '/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: order.imageData,
            prompt: `A beautiful cinematic video of brand ${order.brand}, style ${order.category}, mood ${order.mood}. High fashion, flowing movement, smooth panning shot, 8k resolution, photorealistic, masterpiece.`
          })
        });
        if (resGen.ok) {
          const dataGen = await resGen.json();
          if (dataGen.requestId) {
            order.requestId = dataGen.requestId;
            order.statusUrl = dataGen.statusUrl;
            order.responseUrl = dataGen.responseUrl;
            order.status = 'processing';
            order.statusKo = '영상 제작 중';
            localStorage.setItem('avvmOrder_' + token, JSON.stringify(order));
            startPolling(dataGen.requestId, token);
          } else {
            showDetailedFailure("응답 형식 오류가 발생했습니다.", token, container);
          }
        } else {
          const errData = await resGen.json().catch(() => ({}));
          showDetailedFailure(errData.error || `HTTP 에러 ${resGen.status}`, token, container);
        }
      } catch (err) {
        showDetailedFailure(err.message || "네트워크 연결이 원활하지 않습니다.", token, container);
      }
    }
  });
}

function showCompletedVideo(videoUrl, container, token) {
  const order = token
    ? JSON.parse(localStorage.getItem('avvmOrder_' + token) || '{}')
    : JSON.parse(localStorage.getItem('avvmLastOrder') || '{}');

  order.videoUrl = videoUrl;

  if (window.AVVMDeliveryMVP) {
    window.AVVMDeliveryMVP.render(order, container);
    return;
  }

  container.innerHTML = `
    <div style="font-size:12px;font-weight:800;color:var(--lime);margin-bottom:10px;">
      ✓ AI 영상 제작 완료
    </div>
    <video src="${videoUrl}" controls autoplay loop playsinline style="width:100%;border-radius:12px;background:#000;"></video>
  `;
}

function showRetryButton(requestId, token, container) {
  showDetailedFailure("영상 제작에 실패했습니다.", token, container);
}

function startPolling(requestId, token) {
  let progressDiv = document.getElementById('videoProgressContainer');
  if (!progressDiv) return;

  let pollCount = 0;
  const maxPolls = 100; // 최대 5분 (3초 x 100회)
  let failCount = 0;

  const interval = setInterval(async () => {
    pollCount++;
    if (pollCount > maxPolls) {
      clearInterval(interval);
      showDetailedFailure("요청 대기 시간이 초과되었습니다. 잠시 후 주문 페이지에서 상태를 확인해 주세요.", token, progressDiv);
      return;
    }

    const pollController = new AbortController();
    const pollTimeoutId = setTimeout(() => pollController.abort(), 5000);

    try {
      const order = JSON.parse(localStorage.getItem('avvmOrder_' + token) || '{}');
      let queryUrl = apiBase + `/api/generate-video?id=${requestId}`;
      if (order.statusUrl) {
        queryUrl += `&status_url=${encodeURIComponent(order.statusUrl)}&response_url=${encodeURIComponent(order.responseUrl)}`;
      }

      const res = await fetch(queryUrl, { signal: pollController.signal });
      clearTimeout(pollTimeoutId);
      if (!res.ok) throw new Error("Status query failed");
      
      const statusData = await res.json();
      failCount = 0; // 통신 성공 시 실패 카운트 리셋

      const bar = document.getElementById('videoProgressBar');
      const label = document.getElementById('videoProgressLabel');
      const status = statusData.status; 

      if (status === 'IN_QUEUE') {
        if (bar) bar.style.width = '15%';
        if (label) label.textContent = `대기열 진입 중 (대기번호: ${statusData.queue_position || 1})`;
      } else if (status === 'IN_PROGRESS') {
        const pct = Math.max(20, Math.min(95, Math.round((statusData.progress || 0) * 100)));
        if (bar) bar.style.width = `${pct}%`;
        if (label) label.textContent = `영상 프레임 렌더링 중... ${pct}%`;
      } else if (status === 'COMPLETED') {
        clearInterval(interval);
        if (bar) bar.style.width = '100%';
        if (label) label.textContent = '영상 제작 완료!';
        
        const videoUrl = statusData.output && statusData.output[0];
        if (videoUrl) {
          order.videoUrl = videoUrl;
          order.status = 'completed';
          order.statusKo = '제작 완료';
          localStorage.setItem('avvmOrder_' + token, JSON.stringify(order));
          showCompletedVideo(videoUrl, progressDiv, token);
        } else {
          if (label) label.textContent = '제작 완료되었으나 영상 파일을 찾을 수 없습니다.';
        }
      } else if (status === 'FAILED') {
        clearInterval(interval);
        order.status = 'failed';
        order.statusKo = '제작 실패';
        localStorage.setItem('avvmOrder_' + token, JSON.stringify(order));
        showRetryButton(requestId, token, progressDiv);
      }
    } catch (e) {
      clearTimeout(pollTimeoutId);
      failCount++;
      console.error(`Polling error (${failCount}):`, e);
      if (failCount >= 5) { // 연속 5회 오류 발생 시 무한 루프 방지를 위해 폴링 중단
        clearInterval(interval);
        showDetailedFailure("서버와의 통신이 원활하지 않습니다. 네트워크 연결 상태를 확인해주세요.", token, progressDiv);
      }
    }
  }, 3000);
}

/* ==========================================
   [이벤트 리스너 등록]
   ========================================== */
if($('#submitOrder')) $('#submitOrder').addEventListener('click', createOrder);

if($('#downloadOrder')) {
  $('#downloadOrder').addEventListener('click', async () => {
    const order = lastOrder || JSON.parse(localStorage.getItem('avvmLastOrder') || '{}');
    if (!order || !order.orderId) { toast('저장된 주문이 없습니다.'); return; }
    if (!order.videoUrl) { toast('영상 제작이 아직 완료되지 않았습니다.'); return; }

    const button = $('#downloadOrder');
    const originalText = button?.textContent || 'DOWNLOAD VIDEO';
    if (button) { button.disabled = true; button.textContent = 'DOWNLOADING...'; }

    try {
      const response = await fetch(order.videoUrl);
      if (!response.ok) throw new Error(`영상 다운로드 실패: ${response.status}`);
      const videoBlob = await response.blob();
      const blobUrl = URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${order.orderId || 'AVVM-video'}.mp4`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      toast('영상 다운로드를 시작했습니다.');
    } catch (error) {
      console.error('Video download error:', error);
      toast('영상을 새 창으로 엽니다. 길게 눌러 저장하세요.');
      window.open(order.videoUrl, '_blank', 'noopener');
    } finally {
      if (button) { button.disabled = false; button.textContent = originalText; }
    }
  });
}

if($('#resetOrder')) {
  $('#resetOrder').addEventListener('click', () => { 
    if(modalCard) modalCard.classList.remove('done'); 
    if($('#brandInput')) $('#brandInput').value = ''; 
    if($('#emailInput')) $('#emailInput').value = ''; 
    if($('#phoneInput')) $('#phoneInput').value = ''; 
    if($('#brandInput2')) $('#brandInput2').value = ''; 
    if($('#emailInput2')) $('#emailInput2').value = ''; 
    if($('#phoneInput2')) $('#phoneInput2').value = ''; 
    if($('#notifyConsent')) $('#notifyConsent').checked = true; 
    if($('#moodInput')) $('#moodInput').value = ''; 
    if($('#imageInput')) $('#imageInput').value = ''; 
    if($('#imagePreview')) $('#imagePreview').classList.remove('on'); 
    updatePhotoUploadLabel(); 
    if($('#viewOrderLink')) $('#viewOrderLink').href = '#'; 
    lastOrder = null; 
    setTimeout(() => { syncCustomerInputs(); focusAndReveal('#photoUploadVisibleBlock'); }, 80); 
  });
}

/* ==========================================
   쇼릴 모달 제어 (중복 이벤트 바인딩 방지 처리)
   ========================================== */
(function(){
  const modal = document.getElementById('showreelModal');
  const player = document.getElementById('showreelPlayer');
  const closeBg = document.getElementById('showreelClose');
  const closeX = document.getElementById('showreelX');

  function openShowreel(){
    if(!modal || !player) return;
    modal.classList.add('on');
    modal.setAttribute('aria-hidden','false');
    player.src = 'videos/logo-intro.mp4';
    player.muted = false;
    player.controls = false;
    player.play().catch(()=>{
      player.controls = true;
      player.src = 'videos/showreel.mp4';
      player.play().catch(()=>{});
    });

    player.onended = function(){
      player.controls = true;
      player.src = 'videos/showreel.mp4';
      player.play().catch(()=>{});
      player.onended = null;
    };
  }

  function closeShowreel(){
    if(!modal || !player) return;
    modal.classList.remove('on');
    modal.setAttribute('aria-hidden','true');
    try{ player.pause(); }catch(e){}
    player.removeAttribute('src');
    player.load();
  }

  document.querySelectorAll('.showreel-btn, #watchShowreel').forEach(btn=>{
    btn.addEventListener('click', function(e){
      e.preventDefault();
      openShowreel();
    });
  });

  if(closeBg) closeBg.addEventListener('click', closeShowreel);
  if(closeX) closeX.addEventListener('click', closeShowreel);
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape') closeShowreel();
  });
})();
