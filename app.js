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
const tr=(key,fallback)=>window.AVVM_I18N?.t?.(key,fallback)||fallback;

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
  const order=window.ORDER ? (window.ORDER[lang]||window.ORDER.ko) : null;
  const planPrefix=order?.planPrefix || (lang === 'en' ? 'Selected plan: ' : '선택한 플랜: ');
  if(summary) summary.textContent=`${planPrefix}${window.selectedPlan} · ${window.prices[window.selectedPlan]||window.prices.Pro}`;
}

document.addEventListener('avvm:languagechange', () => {
  setOrderSummary();
  updatePhotoUploadLabel();
  if(!paymentInProgress) setPaymentButtonBusy(false);
});

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
    if(label) label.textContent=tr('attachPhoto','사진 첨부하기');
    if(small) small.textContent=tr('acceptedImageTypes','JPG, PNG, WEBP 등 이미지 파일');
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

function selectCategory(category){
  if(!category) return;
  const target=$$('.cat').find(button=>button.dataset.category===category);
  if(!target) return;
  $$('.cat').forEach(button=>button.classList.toggle('active',button===target));
}

$$('[data-open]').forEach(b=>b.addEventListener('click',()=>{
  selectCategory(b.dataset.category);
  openOrder(b.dataset.plan);
}));
document.addEventListener('click', function(e){
  const choice=e.target.closest('[data-plan-choice]');
  if(!choice) return;
  openOrder(choice.getAttribute('data-plan-choice'));
});

if($('#closeModal')) $('#closeModal').addEventListener('click',closeOrder); 
if(modal) modal.addEventListener('click',e=>{if(e.target===modal)closeOrder();});

$$('.cat').forEach(b=>b.addEventListener('click',()=>{selectCategory(b.dataset.category); toast(`${b.textContent} mood selected`);}));

let lastOrder=null;
const apiBase = (
  location.protocol === 'file:' ||
  location.hostname === 'localhost' ||
  location.hostname === '127.0.0.1' ||
  location.hostname.endsWith('.lhr.life') ||
  location.hostname.endsWith('.vercel.app')
) ? 'https://avvm.studio' : '';
function makeOrderId(){ 
  return 'AVVM-' + new Date().toISOString().slice(0,10).replaceAll('-','') + '-' + Math.random().toString(36).slice(2,7).toUpperCase(); 
}

const MAX_SOURCE_IMAGE_BYTES = 15 * 1024 * 1024;
// This leaves room for the JSON envelope below Vercel's request-body limit.
const MAX_IMAGE_DATA_URL_CHARS = 3500000;
const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function getVideoOptions(){
  const resolution = document.getElementById('resolution')?.value || '1080p';
  return {
    duration: '5s',
    resolution: resolution === '4K' ? '1080p' : resolution,
    aspectRatio: document.getElementById('aspectRatio')?.value || '9:16'
  };
}

function validateImageFile(file){
  if(!file) throw new Error(tr('imageRequired', '영상 제작에 사용할 사진을 첨부해주세요.'));
  if(!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new Error(tr('imageType', 'JPG, PNG 또는 WEBP 형식의 사진만 사용할 수 있습니다.'));
  }
  if(file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new Error(tr('imageSize', '사진 원본은 15MB 이하로 선택해주세요.'));
  }
}

/* 브라우저에서 먼저 축소해 전송 시간과 요청 실패를 줄입니다. */
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
        const dataUrl = canvas.toDataURL('image/jpeg', isMobile ? 0.7 : 0.76);
        if(dataUrl.length > MAX_IMAGE_DATA_URL_CHARS) {
          reject(new Error('사진을 더 작게 압축할 수 없습니다. 원본 사진을 잘라내거나 다른 사진으로 선택해주세요.'));
          return;
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('사진을 읽지 못했습니다. JPG, PNG 또는 WEBP 파일을 선택해주세요.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('사진 파일을 읽는 중 오류가 발생했습니다.'));
    reader.readAsDataURL(file);
  });
}

function makeVideoPrompt(order){
  return `A beautiful cinematic video of brand ${order.brand}, style ${order.category}, mood ${order.mood}. High fashion, flowing movement, smooth panning shot, photorealistic, masterpiece.`;
}

async function requestVideoGeneration(order){
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(apiBase + '/api/generate-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageData: order.imageData,
        prompt: makeVideoPrompt(order),
        duration: order.duration || '5s',
        resolution: order.resolution,
        aspectRatio: order.aspectRatio
      }),
      signal: controller.signal
    });
    const data = await res.json().catch(() => ({}));
    if(!res.ok) throw new Error(data.error || `HTTP 오류 ${res.status}`);
    if(!data.requestId) throw new Error('서버에서 영상 요청 번호를 받지 못했습니다.');
    return data;
  } catch(error) {
    if(error.name === 'AbortError') throw new Error('서버 응답 제한 시간(60초)을 초과했습니다. 잠시 후 다시 시도해주세요.');
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function orderIndexEntry(order){
  const { imageData, ...summary } = order;
  return summary;
}

function saveOrder(order){
  try {
    const oldOrders = JSON.parse(localStorage.getItem('avvmOrders') || '[]');
    const orders = Array.isArray(oldOrders) ? oldOrders : [];
    const summaries = orders
      .filter(item => item?.token !== order.token)
      .map(orderIndexEntry);
    summaries.unshift(orderIndexEntry(order));
    localStorage.setItem('avvmOrders', JSON.stringify(summaries.slice(0, 12)));
    localStorage.setItem('avvmOrder_' + order.token, JSON.stringify(order));
    localStorage.setItem('avvmLastOrder', JSON.stringify(orderIndexEntry(order)));
    lastOrder = order;
    return true;
  } catch(error) {
    console.error('Order storage failed:', error);
    toast('브라우저 저장 공간이 부족합니다. 다른 사진으로 다시 시도해주세요.');
    return false;
  }
}

function saveOrderUpdate(order){
  try {
    localStorage.setItem('avvmOrder_' + order.token, JSON.stringify(order));
    localStorage.setItem('avvmLastOrder', JSON.stringify(orderIndexEntry(order)));
    lastOrder = order;
  } catch(error) {
    console.error('Order update storage failed:', error);
  }
}

/* ==========================================
   [HOOK 1b: 결제 성공 후 실제 주문 접수 & 영상 생성]
   ========================================== */
async function proceedWithOrderCreation(orderId, brand, email, phone, privacyConsent, notifyConsent, refundConsent, rightsConsent, marketingConsent, category, mood, paymentResponse, totalAmount, imageData) {
  if(modalCard) modalCard.classList.add('done');
  if($('#successOrderId')) $('#successOrderId').textContent='ORDER #' + orderId;
  toast(tr('orderStarting', '주문 접수 시작 ✓'));

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
      ${tr('uploadingImage', '서버 연결 및 이미지 업로드 중...')}
    </div>
    <div style="width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:999px; overflow:hidden; margin:10px 0;">
      <div id="videoProgressBar" style="width:10%; height:100%; background:var(--lime); transition:width 0.4s ease; border-radius:999px;"></div>
    </div>
    <div id="videoProgressLabel" style="font-size:11px; color:rgba(255,255,255,0.6)">${tr('uploadingImageHint', 'Fal.ai CDN으로 사진 데이터를 전송하고 있습니다.')}</div>
  `;

  if (!document.getElementById('spinnerStyle')) {
    const style = document.createElement('style');
    style.id = 'spinnerStyle';
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
  }

  const token=(crypto && crypto.getRandomValues) ? Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b=>b.toString(16).padStart(2,'0')).join('') : Math.random().toString(36).slice(2)+Date.now().toString(36);
  const videoOptions = getVideoOptions();
  const imgFile = $('#imageInput')?.files?.[0];
  
  const draft={
    orderId,
    token,
    createdAt:new Date().toISOString(),
    brand, email, phone, imageData,
    consents:{ privacy:privacyConsent, transactionalNotice:notifyConsent, customDigitalRefundLimit:refundConsent, imageRights:rightsConsent, marketing:marketingConsent },
    plan:window.selectedPlan,
    price:window.prices[window.selectedPlan]||window.prices.Pro,
    category, mood,
    duration: videoOptions.duration,
    aspectRatio: videoOptions.aspectRatio,
    resolution: videoOptions.resolution,
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

  try {
    const dataGen = await requestVideoGeneration(draft);
    requestId = dataGen.requestId;
    draft.requestId = requestId;
    draft.statusUrl = dataGen.statusUrl;
    draft.responseUrl = dataGen.responseUrl;
    draft.status = 'processing';
    draft.statusKo = '영상 제작 중';
  } catch (err) {
    apiError = err.message || '네트워크 요청이 실패했습니다.';
    console.error('Failed to start video generation API:', err);
  }

  draft.viewUrl = location.origin + '/order.html?t=' + draft.token;
  saveOrder(draft);

  if($('#successOrderId')) $('#successOrderId').textContent='ORDER #' + draft.orderId;
  const view=$('#viewOrderLink'); if(view){ view.href=draft.viewUrl; }
  const copy=$('#orderLinkCopy'); if(copy){ copy.textContent='주문 및 결제가 완료되었습니다.'; copy.dataset.customized='1'; }
  toast(tr('orderComplete', '주문 접수 완료 ✓'));

  if (requestId) {
    startPolling(requestId, draft.token);
  } else if (apiError) {
    showDetailedFailure(apiError, draft.token, progressDiv);
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

function setPaymentButtonBusy(busy, busyLabel){
  const button=$('#submitOrder');
  if(!button) return;
  button.disabled=busy || !(
    $('#privacyConsent')?.checked &&
    $('#notifyConsent')?.checked &&
    $('#refundConsent')?.checked &&
    $('#rightsConsent')?.checked
  );
  button.textContent=busy ? (busyLabel || tr('paymentOpening', '결제창을 여는 중...')) : (window.AVVM_I18N?.language === 'en' ? 'TEST PAYMENT' : '테스트 결제하기');
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
  const rightsConsent=!!($('#rightsConsent')?.checked);
  const marketingConsent=!!($('#marketingConsent')?.checked);
  const category=$('.cat.active')?.textContent?.trim() || 'Custom';
  const mood=$('#moodInput')?.value?.trim() || '';

  if(!brand){toast('성함 / 브랜드명을 입력해주세요'); focusCustomerField('#brandInput','#brandInput2'); return;}
  if(email && !email.includes('@')){toast('이메일 형식을 확인해주세요'); focusCustomerField('#emailInput','#emailInput2'); return;}
  if(!phone){toast('카톡/문자 알림용 휴대폰 번호를 입력해주세요'); focusCustomerField('#phoneInput','#phoneInput2'); return;}
  if(!privacyConsent || !notifyConsent || !refundConsent || !rightsConsent){toast('필수 동의 항목을 확인해주세요'); focusAndReveal('#consentGroup'); return;}
  if(window.selectedPlan === 'Custom' || String(window.prices[window.selectedPlan]||'').includes('상담')){
    toast(tr('planContact', 'Custom 플랜은 상담 후 견적으로 진행됩니다.'));
    return;
  }

  const imageFile = $('#imageInput')?.files?.[0];
  try {
    validateImageFile(imageFile);
  } catch(error) {
    toast(error.message);
    focusAndReveal('#photoUploadVisibleBlock');
    return;
  }

  const orderId=makeOrderId();
  const totalAmount=getNumericPrice(window.selectedPlan);
  if(!Number.isFinite(totalAmount) || totalAmount < 100){
    toast(tr('amountError', '결제 금액을 확인할 수 없습니다.'));
    return;
  }

  paymentInProgress=true;
  setPaymentButtonBusy(true, tr('optimizingImage', '사진 최적화 중...'));

  try{
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const imageData = await compressImage(imageFile, isMobile ? 768 : 1024, isMobile ? 768 : 1024);
    setPaymentButtonBusy(true, tr('paymentOpening', '결제창을 여는 중...'));

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
      toast(tr('paymentClosed', '결제창이 닫혔습니다. 다시 시도해주세요.'));
      return;
    }
    if(response.code){
      console.warn('PortOne payment failed:',response);
      toast(response.message || tr('paymentFailed', '결제가 취소되었거나 실패했습니다.'));
      return;
    }

    toast(tr('paymentComplete', '결제가 완료되었습니다. 주문을 접수합니다.'));
    
    // 결제 성공 시에만 AI 영상 생성 및 주문 등록 진행
    await proceedWithOrderCreation(
      orderId, brand, email, phone,
      privacyConsent, notifyConsent, refundConsent, rightsConsent, marketingConsent,
      category, mood, response, totalAmount, imageData
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
function escapeHtml(value){
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}

function showDetailedFailure(errorMessage, token, container) {
  if(!container) return;
  container.innerHTML = `
    <div style="font-size:12px; font-weight:800; color:#ff4d4d; margin-bottom:8px; text-transform:uppercase;">✗ ${tr('requestFailed', '영상 제작 요청 실패')}</div>
    <div style="font-size:11px; color:rgba(255,255,255,0.7); line-height:1.6; margin-bottom:12px; word-break:break-all;">
      에러 내용: ${escapeHtml(errorMessage)}<br/>
      <span style="color:rgba(255,255,255,0.45); font-size:10px;">(Vercel의 FAL_KEY 설정과 API 상태를 다시 확인해 주세요.)</span>
    </div>
    <button id="retryVideoBtn" class="btn btn-primary" style="margin-top:6px; padding:10px 18px; font-size:11px; background:#ff4d4d; border-color:#ff4d4d; color:#fff; cursor:pointer;">${tr('retryGeneration', '재시도')}</button>
  `;
  
  document.getElementById('retryVideoBtn')?.addEventListener('click', async () => {
    container.innerHTML = `
      <div style="font-size:12px; font-weight:800; color:var(--lime); margin-bottom:8px; display:flex; align-items:center; justify-content:center; gap:6px;">
        <span class="spinner" style="display:inline-block; width:12px; height:12px; border:2px solid var(--lime); border-top-color:transparent; border-radius:50%; animation:spin 1s linear infinite;"></span>
        ${tr('retrying', '영상을 다시 요청하는 중...')}
      </div>
    `;
    const order = JSON.parse(localStorage.getItem('avvmOrder_' + token) || '{}');
    if (order.imageData) {
      try {
        const dataGen = await requestVideoGeneration(order);
        order.requestId = dataGen.requestId;
        order.statusUrl = dataGen.statusUrl;
        order.responseUrl = dataGen.responseUrl;
        order.status = 'processing';
        order.statusKo = '영상 제작 중';
        saveOrderUpdate(order);
        startPolling(dataGen.requestId, token);
      } catch (err) {
        showDetailedFailure(err.message || "네트워크 연결이 원활하지 않습니다.", token, container);
      }
    } else {
      showDetailedFailure('저장된 사진을 찾을 수 없습니다. 사진을 다시 첨부해 새 주문을 만들어 주세요.', token, container);
    }
  });
}

function showCompletedVideo(videoUrl, container, token) {
  const order = token
    ? JSON.parse(localStorage.getItem('avvmOrder_' + token) || '{}')
    : JSON.parse(localStorage.getItem('avvmLastOrder') || '{}');

  order.videoUrl = videoUrl;
  if(order?.token) saveOrderUpdate(order);

  if (window.AVVMDeliveryMVP) {
    window.AVVMDeliveryMVP.render(order, container);
    return;
  }

  container.innerHTML = `
    <div style="font-size:12px;font-weight:800;color:var(--lime);margin-bottom:10px;">
      ✓ ${tr('statusCompleted', '영상 제작 완료!')}
    </div>
    <video src="${escapeHtml(videoUrl)}" controls autoplay loop playsinline style="width:100%;border-radius:12px;background:#000;"></video>
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
        if (label) label.textContent = `${tr('statusQueued', '대기열 진입 중')} (${statusData.queue_position || 1})`;
      } else if (status === 'IN_PROGRESS') {
        const pct = Math.max(20, Math.min(95, Math.round((statusData.progress || 0) * 100)));
        if (bar) bar.style.width = `${pct}%`;
        if (label) label.textContent = `${tr('statusProcessing', '영상 프레임 렌더링 중...')} ${pct}%`;
      } else if (status === 'COMPLETED') {
        clearInterval(interval);
        if (bar) bar.style.width = '100%';
        if (label) label.textContent = tr('statusCompleted', '영상 제작 완료!');
        
        const videoUrl = statusData.output && statusData.output[0];
        if (videoUrl) {
          order.videoUrl = videoUrl;
          order.status = 'completed';
          order.statusKo = '제작 완료';
          saveOrderUpdate(order);
          showCompletedVideo(videoUrl, progressDiv, token);
        } else {
          if (label) label.textContent = '제작 완료되었으나 영상 파일을 찾을 수 없습니다.';
        }
      } else if (status === 'FAILED') {
        clearInterval(interval);
        order.status = 'failed';
        order.statusKo = '제작 실패';
        saveOrderUpdate(order);
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
    if($('#privacyConsent')) $('#privacyConsent').checked = false; 
    if($('#notifyConsent')) $('#notifyConsent').checked = false; 
    if($('#refundConsent')) $('#refundConsent').checked = false; 
    if($('#rightsConsent')) $('#rightsConsent').checked = false; 
    if($('#marketingConsent')) $('#marketingConsent').checked = false; 
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

/* Sample videos are loaded only when their card approaches the viewport. */
(function(){
  const videos = Array.from(document.querySelectorAll('.proof-video'));
  if (!videos.length) return;

  const loadVideo = (video) => {
    if (video.dataset.loaded) return;
    const source = video.querySelector('source[data-src]');
    if (!source) return;
    source.src = source.dataset.src;
    video.dataset.loaded = 'true';
    video.load();
    video.play().catch(() => {});
  };

  if (!('IntersectionObserver' in window)) {
    videos.forEach(loadVideo);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadVideo(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '280px 0px' });

  videos.forEach((video) => observer.observe(video));
})();
