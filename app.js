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
const trTemplate=(key,fallback,values={})=>String(tr(key,fallback)).replace(/\{(\w+)\}/g,(_,name)=>values[name] ?? `{${name}}`);

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
  'Profile Pro':'₩29,900',
  'Jewelry Motion':'₩59,900',
  'Logo Lab':'₩69,900',
  'Before / After Reel':'₩29,900'
}; 
window.selectedPlan='Pro';

/* A plan promises one known delivery quality. Customers do not have to guess
   which output is included, and the API receives the same locked value. */
const PLAN_OUTPUTS = Object.freeze({
  'Mini Transform': { resolution: '540p', label: '540P · MINI' },
  'Basic Transform': { resolution: '720p', label: 'HD · 720P' },
  'Best Transform': { resolution: '720p', label: 'HD · 720P' },
  '3 Style Set': { resolution: '720p', label: 'HD · 720P' },
  'Starter': { resolution: '720p', label: 'HD · 720P' },
  'Pro': { resolution: '1080p', label: 'FULL HD · 1080P' },
  'Signature': { resolution: '1080p', label: 'FULL HD · 1080P' },
  'Custom': { resolution: '1080p', label: 'CUSTOM · CONSULTATION' },
  'Memorial Basic': { resolution: '1080p', label: 'FULL HD · 1080P' },
  'Memorial Duo': { resolution: '1080p', label: 'FULL HD · 1080P' },
  'ID Mini': { resolution: '1080p', label: 'FILE DELIVERY' },
  'ID Set': { resolution: '1080p', label: 'FILE DELIVERY' },
  'Profile Pro': { resolution: '1080p', label: 'FILE DELIVERY' },
  'Jewelry Motion': { resolution: '1080p', label: 'FULL HD · 1080P' },
  'Logo Lab': { resolution: '1080p', label: 'FULL HD · 1080P' },
  'Before / After Reel': { resolution: '1080p', label: 'FULL HD · 1080P' }
});
window.AVVM_PLAN_OUTPUTS = PLAN_OUTPUTS;

/* The customer authorises one original BEFORE photo. AVVM first creates an
   explicitly labelled AI AFTER concept, then uses that verified pair for video. */
const BEFORE_AFTER_ROUTES = Object.freeze({
  beauty: {
    category: 'Beauty', aspect: '9:16',
    prompt: 'The reference contains a customer BEFORE photo on the left and an authorised AI AFTER styling concept on the right. Create one restrained beauty-editorial transition. Preserve the same person, facial identity, body proportions and natural texture. Never imply skin improvement, efficacy, cosmetic procedure, a different face, or an actual treatment result. No text or labels.'
  },
  fitness: {
    category: 'Custom', aspect: '9:16',
    prompt: 'The reference contains a customer BEFORE photo on the left and an authorised AI AFTER style concept on the right. Create one composed fashion-and-confidence transition while preserving the exact same person, face and body. Do not invent body changes, muscle definition, weight loss, health improvement, diet results, or performance claims. No text or labels.'
  },
  interior: {
    category: 'Custom', aspect: '16:9',
    prompt: 'The reference contains a customer BEFORE interior on the left and an authorised AI AFTER styling concept on the right. Make a clean architectural match-cut. Preserve real room geometry, walls, windows, doors, circulation and fixed structures. Do not present the concept as completed construction or invent a larger room, a new view, or unprovided structures. No text or labels.'
  },
  pet: {
    category: 'Custom', aspect: '9:16',
    prompt: 'The reference contains a customer BEFORE pet photo on the left and an authorised AI AFTER portrait concept on the right. Create one warm, gentle transition. Preserve the animal identity, coat pattern, face, size and anatomy. No new animal, altered markings, extra limbs, unsafe action, health claim, or human-like behavior. No text or labels.'
  }
});
window.avvmBeforeAfterType = '';
window.avvmGeneratedAfterImageUrl = '';
window.avvmGeneratedAfterPreviewUrl = '';
window.avvmBeforeAfterVideoDirection = '';

/* An AI AFTER concept calls a paid image-generation endpoint. Keep a small,
   clearly visible pre-payment allowance per browser session so a customer can
   compare concepts without the preview flow becoming an open-ended cost. */
const BEFORE_AFTER_CONCEPT_LIMIT = 2;
const BEFORE_AFTER_CONCEPT_ATTEMPTS_KEY = 'avvm.beforeAfterConceptAttempts.v1';

function getBeforeAfterConceptAttempts(){
  try{
    return Math.max(0, Math.min(
      BEFORE_AFTER_CONCEPT_LIMIT,
      Number.parseInt(sessionStorage.getItem(BEFORE_AFTER_CONCEPT_ATTEMPTS_KEY) || '0', 10) || 0
    ));
  }catch(error){
    return Number(window.__avvmBeforeAfterConceptAttempts || 0);
  }
}

function useBeforeAfterConceptAttempt(){
  const next=Math.min(BEFORE_AFTER_CONCEPT_LIMIT,getBeforeAfterConceptAttempts()+1);
  try{ sessionStorage.setItem(BEFORE_AFTER_CONCEPT_ATTEMPTS_KEY,String(next)); }
  catch(error){ window.__avvmBeforeAfterConceptAttempts=next; }
  return next;
}

function isKoreanBeforeAfterUi(){
  return (localStorage.getItem('avvmLang') || 'ko') === 'ko';
}

function updateBeforeAfterConceptAllowance(){
  const notice=$('#beforeAfterGenerationLimit');
  if(!notice) return;
  const remaining=Math.max(0,BEFORE_AFTER_CONCEPT_LIMIT-getBeforeAfterConceptAttempts());
  notice.classList.toggle('is-exhausted',remaining===0);
  notice.innerHTML=remaining
    ? trTemplate('baConceptRemaining', '결제 전 AI AFTER 시안은 최대 <b>{limit}회</b> 만들 수 있습니다. <strong>남은 {remaining}회</strong>', { limit: BEFORE_AFTER_CONCEPT_LIMIT, remaining })
    : trTemplate('baConceptExhausted', '결제 전 AI AFTER 시안 <b>{limit}회</b>를 모두 사용했습니다. 현재 시안으로 영상 제작을 진행해 주세요.', { limit: BEFORE_AFTER_CONCEPT_LIMIT });
}

function isBeforeAfterPlan(plan = window.selectedPlan) {
  return String(plan) === 'Before / After Reel';
}

function getBeforeAfterRoute() {
  return BEFORE_AFTER_ROUTES[window.avvmBeforeAfterType] || BEFORE_AFTER_ROUTES.beauty;
}

function getPlanOutput(plan = window.selectedPlan) {
  return PLAN_OUTPUTS[String(plan)] || PLAN_OUTPUTS.Pro;
}

function syncPlanOutput(plan = window.selectedPlan) {
  const output = getPlanOutput(plan);
  const hidden = $('#resolution');
  const value = $('#resolutionIncludedValue');
  const planLabel = $('#resolutionIncludedPlan');
  const helper = $('#resolutionHelper');
  if (hidden) hidden.value = output.resolution;
  if (value) value.textContent = output.label;
  if (planLabel) {
    planLabel.textContent = String(plan) === 'Custom'
      ? tr('customDeliverySpec', '상담 후 납품 사양 확정')
      : trTemplate('planIncluded', '{plan} 플랜에 포함', { plan });
  }
  if (helper) {
    helper.textContent = String(plan) === 'Custom'
      ? tr('customScopeNote', '추가 장면·특수 연출·제작 범위는 상담 견적으로 확정합니다.')
      : tr('resolutionPlanNote', '해상도는 플랜에 포함되어 있으며, 원본 사진 품질에 따라 최종 검수 시 안내드립니다.');
  }
  updatePreflightOutput();
}
window.syncPlanOutput = syncPlanOutput;

function getNumericPrice(plan) {
  const priceStr = window.prices[plan] || '₩39,900';
  if (priceStr.includes('상담') || priceStr.includes('Negotiation')) return 100;
  const cleaned = priceStr.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 100;
}

function setOrderSummary(){
  const lang=localStorage.getItem('avvmLang')||'ko';
  const order=window.ORDER ? (window.ORDER[lang]||window.ORDER.en||window.ORDER.ko) : null;
  const planPrefix=order?.planPrefix || (lang === 'ko' ? '선택한 플랜: ' : 'Selected plan: ');
  if(summary) summary.textContent=`${planPrefix}${window.selectedPlan} · ${window.prices[window.selectedPlan]||window.prices.Pro}`;
}

document.addEventListener('avvm:languagechange', () => {
  setOrderSummary();
  updatePhotoUploadLabel();
  if(isBeforeAfterPlan()) syncBeforeAfterOrderUi();
  updatePreflightOutput();
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
  const isPair=isBeforeAfterPlan();
  if(input.files && input.files[0]){
    if(label) label.textContent=isPair ? tr('baBeforeAttached','BEFORE 첨부 완료 ✓') : tr('photoAttached','첨부 완료 ✓');
    if(small) small.textContent=input.files[0].name;
    box.classList.add('has-file');
  }else{
    if(label) label.textContent=isPair ? tr('baBeforeAttach','BEFORE 사진 첨부하기') : tr('attachPhoto','사진 첨부하기');
    if(small) small.textContent=isPair ? tr('baBeforeAttachHint','같은 대상의 변화 전 실제 사진') : tr('acceptedImageTypes','JPG, PNG, WEBP 등 이미지 파일');
    box.classList.remove('has-file');
  }
}

/* The brand can accept a photo, a written idea, or a spoken idea at the first
   touchpoint. Photo remains the best source for image-based plans; voice and
   typing create the same editable production brief without trapping the user
   in a separate flow. */
const projectInputState = {
  mode: 'photo',
  recognition: null,
  voiceTranscript: { state: 'idle', text: '' }
};

function projectSpeechLanguage(){
  const language = localStorage.getItem('avvmLang') || 'ko';
  return ({ ko:'ko-KR', en:'en-US', ja:'ja-JP', zh:'zh-CN', es:'es-ES', fr:'fr-FR', de:'de-DE', pt:'pt-PT', hi:'hi-IN', ar:'ar-SA' })[language] || 'en-US';
}

function renderProjectVoiceTranscript(){
  const card = $('#voiceTranscriptCard');
  if (!card) return;
  const visible = projectInputState.mode === 'voice';
  card.hidden = !visible;
  if (!visible) return;

  const status = $('#voiceTranscriptStatus');
  const output = $('#voiceTranscriptText');
  const voice = projectInputState.voiceTranscript || { state: 'idle', text: '' };
  const copy = {
    idle: ['inputMethodVoicePreparing', 'Your voice request is ready to start.'],
    listening: ['inputMethodVoiceListening', 'Listening to your request now.'],
    recognizing: ['inputMethodVoiceRecognized', 'Recognised request'],
    complete: ['inputMethodVoiceAdded', 'Added to your production request'],
    retry: ['inputMethodVoiceRetry', 'We could not hear a request. Try again or type it instead.']
  }[voice.state] || ['inputMethodVoicePreparing', 'Your voice request is ready to start.'];

  card.dataset.voiceState = voice.state;
  if (status) status.textContent = tr(copy[0], copy[1]);
  if (output) output.textContent = voice.text || tr('inputMethodVoiceTranscriptPlaceholder', 'What you say will appear here in real time.');
}

function setProjectVoiceTranscript(state, text = ''){
  projectInputState.voiceTranscript = { state, text: String(text || '').trim() };
  renderProjectVoiceTranscript();
}

function updateProjectInputMethod(){
  const mode = projectInputState.mode;
  $$('.input-method-card').forEach(button => {
    const active = button.dataset.inputMode === mode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const note = $('#inputMethodNote');
  if (!note) return;
  const key = mode === 'typing' ? 'inputMethodNoteTyping' : mode === 'voice' ? 'inputMethodNoteVoice' : 'inputMethodNotePhoto';
  note.textContent = tr(key, 'Start your production request in the way that feels easiest.');
  renderProjectVoiceTranscript();
}

function revealProjectBrief(){
  const field = $('#moodInput');
  focusAndReveal('#moodInput');
  window.setTimeout(() => field?.focus({ preventScroll: true }), 180);
  return field;
}

function finishProjectVoiceInput(transcript = ''){
  const button = $('.input-method-card[data-input-mode="voice"]');
  button?.classList.remove('is-listening');
  projectInputState.recognition = null;
  const note = $('#inputMethodNote');
  if (!note) return;
  if (transcript.trim()) {
    setProjectVoiceTranscript('complete', transcript);
    note.textContent = tr('inputMethodVoiceComplete', 'Your voice request has been added.');
  } else if (projectInputState.mode === 'voice') {
    setProjectVoiceTranscript('retry');
    note.textContent = tr('inputMethodVoiceRetry', 'We could not hear a request. Try again or type it instead.');
  }
}

function startProjectVoiceInput(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    projectInputState.mode = 'typing';
    updateProjectInputMethod();
    toast(tr('inputMethodVoiceUnavailable', 'Voice input is not supported in this browser. Please type your request instead.'));
    revealProjectBrief();
    return;
  }
  if (projectInputState.recognition) {
    projectInputState.recognition.abort();
    return;
  }

  /* Keep the user at the voice card while they speak. The transcript below
     appears in place, and the request field is filled silently in parallel. */
  const field = $('#moodInput');
  if (!field) return;
  const recognition = new SpeechRecognition();
  const initialValue = String(field.value || '').trim();
  let transcript = '';
  recognition.lang = projectSpeechLanguage();
  recognition.interimResults = true;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;
  setProjectVoiceTranscript('listening');
  recognition.onresult = event => {
    let finalText = '';
    let interimText = '';
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const text = event.results[index][0]?.transcript || '';
      if (event.results[index].isFinal) finalText += text;
      else interimText += text;
    }
    transcript = `${transcript} ${finalText}`.trim();
    const current = `${transcript} ${interimText}`.trim();
    field.value = [initialValue, current].filter(Boolean).join(initialValue && current ? '\n' : '');
    field.dispatchEvent(new Event('input', { bubbles: true }));
    setProjectVoiceTranscript(current ? 'recognizing' : 'listening', current);
  };
  recognition.onerror = event => {
    if (event.error !== 'aborted' && event.error !== 'no-speech') {
      projectInputState.mode = 'typing';
      updateProjectInputMethod();
      toast(tr('inputMethodVoiceUnavailable', 'Voice input is not supported in this browser. Please type your request instead.'));
    }
  };
  recognition.onend = () => finishProjectVoiceInput(transcript);
  projectInputState.recognition = recognition;
  $('.input-method-card[data-input-mode="voice"]')?.classList.add('is-listening');
  updateProjectInputMethod();
  try { recognition.start(); }
  catch(error) { finishProjectVoiceInput(); }
}

function setProjectInputMode(mode, options = {}){
  const next = ['photo', 'typing', 'voice'].includes(mode) ? mode : 'photo';
  if (next !== 'voice' && projectInputState.recognition) projectInputState.recognition.abort();
  projectInputState.mode = next;
  updateProjectInputMethod();
  if (next === 'photo') {
    if (options.openPicker) $('#imageInput')?.click();
    else focusAndReveal('#photoUploadVisibleBlock');
    return;
  }
  if (next === 'typing') {
    revealProjectBrief();
    return;
  }
  startProjectVoiceInput();
}

$$('.input-method-card').forEach(button => {
  button.addEventListener('click', () => setProjectInputMode(button.dataset.inputMode, { openPicker: button.dataset.inputMode === 'photo' }));
});
$$('[data-voice-edit]').forEach(button => {
  button.addEventListener('click', () => setProjectInputMode('typing'));
});
document.addEventListener('avvm:languagechange', updateProjectInputMethod);
updateProjectInputMethod();

function updateAfterPhotoUploadLabel(){
  const button=$('#generateAfterImage');
  const label=button?.querySelector('span');
  if(!button || !label) return;
  const ready=Boolean(window.avvmGeneratedAfterImageUrl);
  const busy=button.dataset.loading==='true';
  const remaining=Math.max(0,BEFORE_AFTER_CONCEPT_LIMIT-getBeforeAfterConceptAttempts());
  const exhausted=remaining===0;
  const korean=isKoreanBeforeAfterUi();
  label.textContent=busy
    ? tr('baGeneratingAfter','AI AFTER 시안 생성 중…')
    : exhausted
      ? (korean ? `AI AFTER 시안 ${BEFORE_AFTER_CONCEPT_LIMIT}회 완료` : `${BEFORE_AFTER_CONCEPT_LIMIT} AI AFTER CONCEPTS USED`)
      : ready
        ? (korean ? `AI AFTER 시안 다시 만들기 · ${remaining}회 남음` : `REGENERATE AI AFTER · ${remaining} LEFT`)
        : (korean ? `AI AFTER 시안 만들기 · ${remaining}회 남음` : `CREATE AI AFTER · ${remaining} LEFT`);
  button.classList.toggle('is-ready',ready);
  button.classList.toggle('is-exhausted',exhausted);
  button.disabled=busy || exhausted;
  button.setAttribute('aria-disabled',String(busy || exhausted));
  button.title=exhausted
    ? (korean ? '결제 전 AI AFTER 시안 2회를 모두 사용했습니다.' : 'Both pre-payment AI AFTER concepts have been used.')
    : '';
  updateBeforeAfterConceptAllowance();
}

function clearBeforeAfterSourcePreview(){
  const preview=$('#beforeAfterSourcePreview');
  const before=$('#beforeAfterPreviewBefore');
  const after=$('#beforeAfterPreviewAfter');
  const urls=window.__avvmBeforeAfterPreviewUrls || [];
  urls.forEach((url)=>{ try{ URL.revokeObjectURL(url); }catch(error){} });
  window.__avvmBeforeAfterPreviewUrls=[];
  if(before) before.removeAttribute('src');
  if(after) after.removeAttribute('src');
  if(preview){ preview.hidden=true; preview.classList.remove('is-ready','is-playing'); }
}

function refreshBeforeAfterSourcePreview(){
  const preview=$('#beforeAfterSourcePreview');
  const beforeFile=$('#imageInput')?.files?.[0];
  const afterUrl=window.avvmGeneratedAfterPreviewUrl || window.avvmGeneratedAfterImageUrl;
  if(!preview || !isBeforeAfterPlan() || !beforeFile || !afterUrl){
    clearBeforeAfterSourcePreview();
    return;
  }
  clearBeforeAfterSourcePreview();
  const beforeUrl=URL.createObjectURL(beforeFile);
  window.__avvmBeforeAfterPreviewUrls=[beforeUrl];
  const before=$('#beforeAfterPreviewBefore');
  const after=$('#beforeAfterPreviewAfter');
  const range=$('#beforeAfterPreviewRange');
  const stage=$('#beforeAfterSourceStage');
  if(before) before.src=beforeUrl;
  if(after) after.src=afterUrl;
  if(range) range.value='50';
  if(stage) stage.style.setProperty('--pair-split','50%');
  preview.hidden=false;
  requestAnimationFrame(()=>preview.classList.add('is-ready'));
}

function resetGeneratedAfterConcept(){
  window.avvmGeneratedAfterImageUrl='';
  window.avvmGeneratedAfterPreviewUrl='';
  clearBeforeAfterSourcePreview();
  updateAfterPhotoUploadLabel();
}

async function makeAfterConceptPreview(imageUrl){
  try{
    const image=await readImageSource(imageUrl);
    const longest=Math.max(image.naturalWidth,image.naturalHeight);
    const scale=Math.min(1,720/longest);
    const width=Math.max(2,Math.round(image.naturalWidth*scale));
    const height=Math.max(2,Math.round(image.naturalHeight*scale));
    const canvas=document.createElement('canvas');
    canvas.width=width;
    canvas.height=height;
    const ctx=canvas.getContext('2d');
    ctx.drawImage(image,0,0,width,height);
    ctx.fillStyle='rgba(4,6,3,.20)';
    ctx.fillRect(0,0,width,height);
    ctx.save();
    ctx.translate(width/2,height/2);
    ctx.rotate(-Math.PI/7);
    ctx.fillStyle='rgba(235,255,145,.76)';
    ctx.font=`900 ${Math.max(11,Math.round(Math.min(width,height)/16))}px Inter,Arial,sans-serif`;
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    const mark='AVVM · AI CONCEPT PREVIEW';
    const spacing=Math.max(76,Math.round(Math.min(width,height)/3));
    for(let y=-height;y<=height;y+=spacing){
      for(let x=-width;x<=width;x+=spacing*1.75) ctx.fillText(mark,x,y);
    }
    ctx.restore();
    return canvas.toDataURL('image/jpeg',.68);
  }catch(error){
    console.warn('Could not prepare local AI AFTER preview:',error);
    return imageUrl;
  }
}

function pause(ms){
  return new Promise(resolve=>setTimeout(resolve,ms));
}

async function pollAfterImageGeneration(requestId){
  for(let attempt=0;attempt<48;attempt+=1){
    await pause(attempt ? 1500 : 700);
    const response=await fetch(`${apiBase}/api/generate-after-image?id=${encodeURIComponent(requestId)}`,{
      headers:{Accept:'application/json'}
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.error || 'AFTER 시안 상태를 확인하지 못했습니다.');
    if(data.status==='COMPLETED' && data.imageUrl) return data.imageUrl;
    if(['FAILED','CANCELLED','ERROR'].includes(String(data.status||'').toUpperCase())){
      throw new Error(data.error || 'AFTER 시안 생성이 완료되지 않았습니다.');
    }
  }
  throw new Error('AFTER 시안 생성 시간이 길어지고 있습니다. 잠시 후 다시 시도해주세요.');
}

async function generateAfterConcept(){
  if(!isBeforeAfterPlan()) return;
  if(getBeforeAfterConceptAttempts() >= BEFORE_AFTER_CONCEPT_LIMIT){
    toast(isKoreanBeforeAfterUi()
      ? '결제 전 AI AFTER 시안 2회를 모두 사용했습니다. 현재 시안으로 제작을 진행해 주세요.'
      : 'Both pre-payment AI AFTER concepts have been used. Continue with the current concept.');
    updateAfterPhotoUploadLabel();
    return;
  }
  const file=$('#imageInput')?.files?.[0];
  const consent=$('#beforeAfterAiConsent')?.checked;
  try{ validateImageFile(file); }
  catch(error){ toast(error.message); focusAndReveal('#photoUploadVisibleBlock'); return; }
  if(!consent){
    toast('AI AFTER 시안 생성을 위한 사진 처리 동의를 확인해주세요.');
    focusAndReveal('#beforeAfterAiConsent');
    return;
  }

  const button=$('#generateAfterImage');
  if(button?.dataset.loading==='true') return;
  if(button) button.dataset.loading='true';
  updateAfterPhotoUploadLabel();
  try{
    const mobile=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const imageData=await compressImage(file,mobile ? 1024 : 1280,mobile ? 1280 : 1280);
    const response=await fetch(`${apiBase}/api/generate-after-image`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        imageData,
        transformationType:window.avvmBeforeAfterType || 'beauty',
        aspectRatio:getBeforeAfterRoute().aspect,
        brief:String($('#beforeAfterBrief')?.value || '').trim()
      })
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok || !data.request_id) throw new Error(data.error || 'AFTER 시안 요청을 시작하지 못했습니다.');
    // The generation provider has accepted this request, so it may incur cost
    // even if the later status poll is interrupted.
    useBeforeAfterConceptAttempt();
    updateAfterPhotoUploadLabel();
    const imageUrl=await pollAfterImageGeneration(data.request_id);
    window.avvmGeneratedAfterImageUrl=imageUrl;
    window.avvmGeneratedAfterPreviewUrl=await makeAfterConceptPreview(imageUrl);
    refreshBeforeAfterSourcePreview();
    toast(tr('baAfterReady','AI AFTER 시안 완료 ✓'));
    $('#beforeAfterSourcePreview')?.scrollIntoView({behavior:'smooth',block:'center'});
  }catch(error){
    console.error('AI AFTER concept failed:',error);
    toast(error?.message || 'AFTER 시안을 만들지 못했습니다. 잠시 후 다시 시도해주세요.');
  }finally{
    if(button) delete button.dataset.loading;
    updateAfterPhotoUploadLabel();
  }
}

function setBeforeAfterPreviewSplit(value){
  const stage=$('#beforeAfterSourceStage');
  if(stage) stage.style.setProperty('--pair-split',`${Math.max(0,Math.min(100,Number(value)||0))}%`);
}

function setBeforeAfterAspect(aspect){
  const field=$('#aspectRatio');
  if(field) field.value=aspect;
  const group=$('[data-option-group="aspect"]');
  if(group) group.querySelectorAll('.option-chip').forEach((button)=>button.classList.toggle('active',button.dataset.value===aspect));
}

function syncBeforeAfterOrderUi(plan = window.selectedPlan){
  const isPair=isBeforeAfterPlan(plan);
  const route=getBeforeAfterRoute();
  const pairGroup=$('#beforeAfterUploadGroup');
  const uploadBlock=$('#photoUploadVisibleBlock');
  const title=uploadBlock?.querySelector('.order-form-section-title');
  const helper=uploadBlock?.querySelector('.order-form-helper');
  const styleBlock=$('.style-select-block');
  const aspectGroup=$('#aspectGroup');
  const resolutionGroup=$('#resolutionGroup');
  if(title && !title.dataset.avvmDefaultText) title.dataset.avvmDefaultText=title.textContent;
  if(helper && !helper.dataset.avvmDefaultText) helper.dataset.avvmDefaultText=helper.textContent;
  if(pairGroup) pairGroup.hidden=!isPair;
  if(isPair){
    if(title) title.textContent=tr('baBeforeUploadTitle','1. BEFORE 사진 업로드');
    if(helper) helper.textContent=tr('baBeforeUploadCopy','원본 사진을 먼저 첨부한 뒤, 보고 싶은 AFTER 장면을 적고 시안을 만드세요.');
    if(styleBlock) styleBlock.style.display='none';
    if(aspectGroup) aspectGroup.style.display='none';
    if(resolutionGroup) resolutionGroup.style.display='block';
    setBeforeAfterAspect(route.aspect);
  }else{
    if(title) title.textContent=title.dataset.avvmDefaultText || '1. 제작할 사진 업로드';
    if(helper) helper.textContent=helper.dataset.avvmDefaultText || '고객님의 사진 또는 상품 이미지를 첨부해 주세요. 지금 첨부하지 않아도 결제 후 업로드할 수 있습니다.';
  }
  updatePhotoUploadLabel();
  updateAfterPhotoUploadLabel();
  if(isPair) refreshBeforeAfterSourcePreview();
  else clearBeforeAfterSourcePreview();
}

let sourceQuality = null;

function setSourceText(selector, value){
  const element=$(selector);
  if(element) element.textContent=value;
}

function qualityGrade(score){
  if(score >= 86) return {label:'PREMIUM READY', tone:'premium', tip:'Excellent source. The image has enough detail for a refined cinematic treatment.'};
  if(score >= 68) return {label:'PRODUCTION READY', tone:'ready', tip:'Good source. A clean final result is expected with the selected production direction.'};
  if(score >= 48) return {label:'USE WITH CARE', tone:'care', tip:'Usable source. A sharper or brighter original will improve identity and product detail.'};
  return {label:'SOURCE UPGRADE', tone:'upgrade', tip:'For a better result, choose a brighter, higher-resolution original with a clear subject.'};
}

function updatePreflightOutput(){
  const output=$('#preflightOutput');
  if(!output) return;
  const category=$('.cat.active')?.dataset?.category || 'Beauty';
  const options=getVideoOptions();
  const plan=window.selectedPlan || 'Pro';
  output.textContent=`${category.toUpperCase()} · ${options.aspectRatio} · ${options.resolution.toUpperCase()} · ${plan.toUpperCase()}`;
}

function clearSourceIntelligence(){
  const panel=$('#imagePreview');
  const preview=$('#previewImg');
  if(window.__avvmSourcePreviewUrl){
    URL.revokeObjectURL(window.__avvmSourcePreviewUrl);
    window.__avvmSourcePreviewUrl=null;
  }
  if(preview) preview.removeAttribute('src');
  if(panel) panel.classList.remove('on','is-analyzing');
  sourceQuality=null;
}

function readSourceMetrics(file){
  return new Promise((resolve,reject)=>{
    const objectUrl=URL.createObjectURL(file);
    const image=new Image();
    image.onload=()=>{
      try{
        const width=image.naturalWidth || image.width;
        const height=image.naturalHeight || image.height;
        const longest=Math.max(width,height);
        const scale=Math.min(1, 280 / longest);
        const sampleWidth=Math.max(32,Math.round(width*scale));
        const sampleHeight=Math.max(32,Math.round(height*scale));
        const canvas=document.createElement('canvas');
        canvas.width=sampleWidth;
        canvas.height=sampleHeight;
        const context=canvas.getContext('2d',{willReadFrequently:true});
        context.drawImage(image,0,0,sampleWidth,sampleHeight);
        const pixels=context.getImageData(0,0,sampleWidth,sampleHeight).data;
        const luminance=new Float32Array(sampleWidth*sampleHeight);
        let sum=0;
        for(let index=0,pixel=0; index<luminance.length; index++,pixel+=4){
          const value=0.2126*pixels[pixel]+0.7152*pixels[pixel+1]+0.0722*pixels[pixel+2];
          luminance[index]=value;
          sum+=value;
        }
        const average=sum/luminance.length;
        let variance=0;
        let edgeSum=0;
        let edgeCount=0;
        for(let y=1;y<sampleHeight;y++){
          for(let x=1;x<sampleWidth;x++){
            const value=luminance[y*sampleWidth+x];
            variance+=(value-average)*(value-average);
            edgeSum+=Math.abs(value-luminance[y*sampleWidth+x-1])+Math.abs(value-luminance[(y-1)*sampleWidth+x]);
            edgeCount+=2;
          }
        }
        const contrast=Math.sqrt(variance/Math.max(1,(sampleWidth-1)*(sampleHeight-1)));
        const detail=edgeSum/Math.max(1,edgeCount);
        const minDimension=Math.min(width,height);
        const resolutionScore=minDimension>=1440?35:minDimension>=1080?31:minDimension>=720?25:minDimension>=480?17:8;
        const exposureScore=average>=65 && average<=205?24:average>=45 && average<=225?16:7;
        const contrastScore=contrast>=48?16:contrast>=30?12:contrast>=18?7:3;
        const detailScore=detail>=17?18:detail>=11?14:detail>=7?8:3;
        const fileScore=file.size>=180000?7:3;
        const score=Math.max(18,Math.min(100,Math.round(resolutionScore+exposureScore+contrastScore+detailScore+fileScore)));
        resolve({width,height,average,contrast,detail,score});
      }catch(error){
        reject(error);
      }finally{
        URL.revokeObjectURL(objectUrl);
      }
    };
    image.onerror=()=>{
      URL.revokeObjectURL(objectUrl);
      reject(new Error('이미지 분석에 실패했습니다.'));
    };
    image.src=objectUrl;
  });
}

function renderSourceMetrics(metrics){
  sourceQuality=metrics;
  const grade=qualityGrade(metrics.score);
  const panel=$('#imagePreview');
  if(panel){
    panel.classList.remove('is-analyzing');
    panel.dataset.grade=grade.tone;
  }
  setSourceText('#preflightStatus',grade.label);
  setSourceText('#photoQualityScore',String(metrics.score));
  setSourceText('#photoQualityGrade',grade.label);
  setSourceText('#photoQualitySize',`${metrics.width}×${metrics.height}`);
  setSourceText('#photoQualityLight',metrics.average>=65 && metrics.average<=205?'BALANCED':metrics.average<65?'DARK':'BRIGHT');
  setSourceText('#photoQualityDetail',metrics.detail>=11?'CLEAR':metrics.detail>=7?'SOFT':'LOW');
  setSourceText('#photoQualityTip',grade.tip);
  const meter=$('#photoQualityMeter');
  if(meter) meter.style.width=`${metrics.score}%`;
  updatePreflightOutput();
}

async function inspectSourceImage(file){
  if(!file){
    clearSourceIntelligence();
    return;
  }
  const panel=$('#imagePreview');
  const preview=$('#previewImg');
  if(panel) panel.classList.add('on','is-analyzing');
  if(window.__avvmSourcePreviewUrl) URL.revokeObjectURL(window.__avvmSourcePreviewUrl);
  window.__avvmSourcePreviewUrl=URL.createObjectURL(file);
  if(preview) preview.src=window.__avvmSourcePreviewUrl;
  setSourceText('#preflightStatus','ANALYZING SOURCE');
  setSourceText('#photoQualityScore','--');
  setSourceText('#photoQualityGrade','ANALYZING');
  setSourceText('#photoQualityTip','Checking resolution, exposure and visible detail before production.');
  updatePreflightOutput();
  try{
    renderSourceMetrics(await readSourceMetrics(file));
  }catch(error){
    console.warn('Source quality analysis failed:',error);
    if(panel) panel.classList.remove('is-analyzing');
    setSourceText('#preflightStatus','SOURCE READY');
    setSourceText('#photoQualityGrade','SOURCE READY');
    setSourceText('#photoQualityTip','Your source is attached. The production team will check the original before final rendering.');
  }
}

function handleSourceImageChange(){
  if(isBeforeAfterPlan()) resetGeneratedAfterConcept();
  updatePhotoUploadLabel();
  inspectSourceImage($('#imageInput')?.files?.[0]);
  refreshBeforeAfterSourcePreview();
}

if($('#imageInput')){
  $('#imageInput').addEventListener('change', handleSourceImageChange);
}
if($('#generateAfterImage')) $('#generateAfterImage').addEventListener('click',generateAfterConcept);
$$('[data-ba-prompt]').forEach((button)=>button.addEventListener('click',()=>{
  const field=$('#beforeAfterBrief');
  if(!field) return;
  field.value=button.dataset.baPrompt || '';
  window.avvmBeforeAfterVideoDirection='';
  field.focus();
  if(window.avvmGeneratedAfterImageUrl) resetGeneratedAfterConcept();
}));
if($('#beforeAfterBrief')) $('#beforeAfterBrief').addEventListener('input',()=>{
  window.avvmBeforeAfterVideoDirection='';
  if(window.avvmGeneratedAfterImageUrl) resetGeneratedAfterConcept();
});

/* The finder deliberately creates a production direction rather than a treatment
   promise. Search terms remain the customer's intent; the guardrails preserve
   identity and keep the visual result clearly conceptual. */
const AFTER_PROMPT_FINDER = Object.freeze({
  portrait: {
    label: 'IDENTITY · PORTRAIT',
    tests: /portrait|profile|ceo|headshot|editorial|fashion|lookbook|\ud504\ub85c\ud544|\uc99d\uba85|\uc5d0\ub514\ud1a0\ub9ac\uc5bc|\ud328\uc158|\ud654\ubcf4|\uba54\uc774\ud06c\uc5c5|\ud5e4\uc5b4|\uc5fc\uc0c9|\uc2a4\ud0c0\uc77c/i,
    direction: 'Create a contemporary premium portrait restyle through grooming, wardrobe, colour, and flattering light only. Keep the supplied person instantly recognisable, age-authentic, and naturally textured.',
    request: 'Contemporary premium portrait styling, refined grooming, wardrobe and flattering light; age-authentic and naturally textured.'
  },
  wedding: {
    label: 'WEDDING · EDITORIAL',
    tests: /wedding|bridal|bride|groom|veil|anniversary|\uc6e8\ub529|\uc2e0\ubd80|\uc2e0\ub791|\ub4dc\ub808\uc2a4|\uae30\ub150\uc77c|\ud504\ub85c\ud3ec\uc988/i,
    direction: 'Create an elegant, contemporary wedding editorial with refined hair, wardrobe, fabric texture, and soft directional light. Keep the supplied person recognisable and the mood believable, intimate, and timeless.',
    request: 'Elegant contemporary wedding editorial with refined hair, wardrobe, fabric texture and soft directional light.'
  },
  interior: {
    label: 'SPACE · NEXT',
    tests: /interior|room|home|house|cafe|store|restaurant|kitchen|living|furniture|\uc778\ud14c\ub9ac\uc5b4|\ubc29|\uc9d1|\uac70\uc2e4|\uc8fc\ubc29|\uce74\ud398|\ub9e4\uc7a5|\uac00\uad6c|\uc870\uba85|\uacf5\uac04/i,
    direction: 'Create a premium interior styling concept using furniture, lighting, colour, and atmosphere. Preserve the exact room geometry, walls, windows, doors, and fixed structures; do not imply completed construction.',
    request: 'Premium interior styling through furnishings, lighting, colour and atmosphere while retaining the existing room structure.'
  },
  pet: {
    label: 'PET · PORTRAIT',
    tests: /pet|dog|cat|puppy|kitten|animal|\ubc18\ub824|\uac15\uc544\uc9c0|\uace0\uc591\uc774|\ubc18\ub824\ub3d9\ubb3c/i,
    direction: 'Create a warm, premium pet portrait with a gentle setting, clean light, and natural grooming. Preserve the animal’s exact markings, face, scale, anatomy, and temperament; no human-like behaviour or health claim.',
    request: 'Warm premium pet portrait with a gentle setting, clean light and natural grooming while preserving exact markings and anatomy.'
  },
  memory: {
    label: 'MEMORY · RESTORE',
    tests: /memory|old photo|vintage|archive|parents|family|memorial|black.?white|\uc62e\uc0ac\uc9c4|\uace0\uc804|\ud761\ubc31|\ubd80\ubaa8\ub2d8|\uac00\uc871|\uba54\ubaa8\ub9ac\uc5bc|\ucd94\uc5b5/i,
    direction: 'Create a dignified restoration concept that retains the original era, expression, clothing, and framing. Improve clarity and gentle colour balance only; do not restyle, de-age, or replace any person.',
    request: 'Dignified restoration that retains the original era, expression, clothing and framing with gentle clarity and colour balance.'
  },
  default: {
    label: 'AVVM · CUSTOM DIRECTION',
    tests: /.*/,
    direction: 'Create a premium, contemporary visual concept that makes the requested change through art direction, light, colour, wardrobe, styling, and believable atmosphere while keeping the source authentic.',
    request: 'Premium contemporary visual direction through art direction, light, colour, styling and believable atmosphere.'
  }
});

const AFTER_PROMPT_MODES = Object.freeze({
  cinematic: {
    label: 'CINEMATIC',
    image: 'Use restrained cinema-grade lighting, considered depth, a refined colour grade, and one memorable hero frame.',
    video: 'Begin still, make one deliberate camera push or parallax move through the transition, then settle into a quiet hero hold.',
    request: 'Cinematic light, controlled depth and a calm, precise transition.'
  },
  commercial: {
    label: 'COMMERCIAL',
    image: 'Use clean premium campaign light, polished detail, high clarity, and a confident presentation-ready composition.',
    video: 'Lead with a clear first-second visual reveal, use one precise optical match-cut, then resolve into a stable campaign hero frame.',
    request: 'Clean premium campaign light, polished detail and a precise optical reveal.'
  },
  emotional: {
    label: 'EMOTIONAL',
    image: 'Use intimate natural light, gentle atmosphere, truthful texture, and a warm, personally meaningful editorial frame.',
    video: 'Begin with a brief still pause, let natural light or atmosphere carry one soft transition, then hold on a warm, believable final frame.',
    request: 'Warm natural light, intimate atmosphere and a gentle, believable transition.'
  }
});

let afterPromptMode = 'cinematic';
let generatedAfterPrompt = '';
let generatedAfterRequestBrief = '';
let generatedAfterVideoPrompt = '';
let generatedAfterNegativePrompt = '';
let generatedAfterIntent = '';

function normaliseAfterPromptIntent(query) {
  const compact = String(query || '').replace(/\s+/g, ' ').trim();
  if (!compact) return '';
  return compact.replace(/[<>]/g, '').slice(0, 180);
}

function getAfterPromptDirection(intent) {
  return Object.values(AFTER_PROMPT_FINDER).find((item) => item !== AFTER_PROMPT_FINDER.default && item.tests.test(intent)) || AFTER_PROMPT_FINDER.default;
}

function buildAfterPrompt(intent) {
  const direction = getAfterPromptDirection(intent);
  const route = getBeforeAfterRoute();
  const mode = AFTER_PROMPT_MODES[afterPromptMode] || AFTER_PROMPT_MODES.cinematic;
  const shared = 'NON-NEGOTIABLE IDENTITY LOCK: use the supplied BEFORE photo as the authoritative reference. Preserve the same subject, apparent age range, facial geometry, eye shape, nose, lips, jawline, hairline, body proportions, ethnicity, and distinctive features. Never age up, age down, change anatomy, replace the subject, make a treatment claim, or create a lookalike.';
  const quality = 'Photorealistic, high-end commercial art direction, crisp focus, natural texture, clean contemporary colour grade, no text, no logo, no watermark, no split screen.';
  const safety = route.category === 'Custom' && window.avvmBeforeAfterType === 'interior'
    ? 'This is a visual styling concept only, not a construction, property, or furnishing guarantee.'
    : route.category === 'Custom' && window.avvmBeforeAfterType === 'pet'
      ? 'This is a portrait styling concept only, not a health, age, or behaviour result.'
      : 'This is a styling concept only, not a medical, cosmetic, body, fitness, or treatment result.';
  return {
    label: `${direction.label} · ${mode.label}`,
    prompt: `Customer intent: ${intent}. ${shared} ${direction.direction} ${mode.image} ${quality} ${safety}`,
    videoPrompt: `Customer-approved ${mode.label.toLowerCase()} art direction: ${mode.video} Preserve the approved BEFORE and AI AFTER pair exactly. The motion must be a visual styling transition only, never evidence of a health, cosmetic, body, construction, or behavioural result. Keep the image stable, photorealistic, and free of text, logos, split screens, dividers, or watermarks.`,
    negativePrompt: 'No identity drift, face replacement, age change, anatomy change, body transformation, invented treatment result, health claim, altered pet markings, changed room geometry, new structures, text, logo, watermark, split-screen layout, divider, flicker, unstable details, extra limbs, or distorted hands.',
    // The API adds the full identity and safety guardrails on every request.
    // Keep the customer-facing field compact so its 420-character server limit
    // always retains the requested direction instead of truncating it.
    requestBrief: `Customer intent: ${intent}. ${direction.request} ${mode.request}`.slice(0, 420)
  };
}

function renderGeneratedAfterPrompt(intent) {
  const cleanIntent = normaliseAfterPromptIntent(intent);
  if (!cleanIntent) {
    toast(tr('afterPromptNeedIntent', 'Describe the change or scene you want first.'));
    $('#afterPromptSearch')?.focus();
    return;
  }
  const result = buildAfterPrompt(cleanIntent);
  generatedAfterIntent = cleanIntent;
  generatedAfterPrompt = result.prompt;
  generatedAfterRequestBrief = result.requestBrief;
  generatedAfterVideoPrompt = result.videoPrompt;
  generatedAfterNegativePrompt = result.negativePrompt;
  const root = $('#afterPromptResult');
  const type = $('#afterPromptResultType');
  const text = $('#afterPromptResultText');
  const video = $('#afterVideoPromptResult');
  const negative = $('#afterNegativePromptResult');
  if (type) type.textContent = result.label;
  if (text) text.textContent = result.prompt;
  if (video) video.textContent = result.videoPrompt;
  if (negative) negative.textContent = result.negativePrompt;
  if (root) root.hidden = false;
}

function applyGeneratedAfterPrompt() {
  if (!generatedAfterPrompt || !generatedAfterRequestBrief) return;
  const field = $('#beforeAfterBrief');
  if (!field) return;
  field.value = generatedAfterRequestBrief;
  field.dispatchEvent(new Event('input', { bubbles: true }));
  window.avvmBeforeAfterVideoDirection = generatedAfterVideoPrompt;
  field.focus();
  toast(tr('afterPromptApplied', 'Generated prompt applied to your AFTER request.'));
}

$('#generateAfterPrompt')?.addEventListener('click', () => renderGeneratedAfterPrompt($('#afterPromptSearch')?.value));
$('#afterPromptSearch')?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') { event.preventDefault(); renderGeneratedAfterPrompt(event.currentTarget.value); }
});
$$('[data-after-prompt-query]').forEach((button) => button.addEventListener('click', () => {
  const input = $('#afterPromptSearch');
  if (input) input.value = button.dataset.afterPromptQuery || '';
  renderGeneratedAfterPrompt(input?.value);
}));
$$('[data-after-prompt-mode]').forEach((button) => button.addEventListener('click', () => {
  const nextMode = button.dataset.afterPromptMode;
  if (!AFTER_PROMPT_MODES[nextMode]) return;
  afterPromptMode = nextMode;
  $$('[data-after-prompt-mode]').forEach((item) => item.classList.toggle('is-active', item === button));
  if (generatedAfterIntent) renderGeneratedAfterPrompt(generatedAfterIntent);
}));
$('#applyAfterPrompt')?.addEventListener('click', applyGeneratedAfterPrompt);
$$('[data-after-prompt-copy]').forEach((copyButton) => copyButton.addEventListener('click', async (event) => {
  const type = event.currentTarget.dataset.afterPromptCopy;
  const value = type === 'video' ? generatedAfterVideoPrompt : type === 'negative' ? generatedAfterNegativePrompt : generatedAfterPrompt;
  if (!value) return;
  await copyRecipePrompt(value);
  const button = event.currentTarget;
  const original = button.textContent;
  button.textContent = tr('afterPromptCopied', 'COPIED ✓');
  setTimeout(() => { if (button.isConnected) button.textContent = original; }, 1600);
}));
if($('#beforeAfterPreviewRange')) $('#beforeAfterPreviewRange').addEventListener('input',(event)=>{
  const stage=$('#beforeAfterSourceStage');
  if(stage) stage.classList.remove('is-playing');
  setBeforeAfterPreviewSplit(event.target.value);
});
if($('#beforeAfterPreviewPlay')) $('#beforeAfterPreviewPlay').addEventListener('click',()=>{
  const stage=$('#beforeAfterSourceStage');
  if(!stage) return;
  stage.classList.remove('is-playing');
  setBeforeAfterPreviewSplit(0);
  requestAnimationFrame(()=>requestAnimationFrame(()=>stage.classList.add('is-playing')));
});

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
  if(plan === 'Before / After Reel' && !window.avvmBeforeAfterType) window.avvmBeforeAfterType='beauty';
  if(plan !== 'Before / After Reel') window.avvmBeforeAfterType='';
  if(['Jewelry Motion','Logo Lab'].includes(plan)) selectCategory('Design');
  if(plan === 'Before / After Reel') selectCategory(getBeforeAfterRoute().category);
  window.selectedPlan=plan||window.selectedPlan;
  if(plan === 'Jewelry Motion') guideState.presetId='design-jewel-prism';
  if(plan === 'Logo Lab') guideState.presetId='design-logo-minimal';
  if(modalCard){
    modalCard.classList.remove('done');
    modalCard.classList.remove('plan-choosing');
  }
  setOrderSummary();
  syncPlanOutput(plan);
  updateDesignLabBrief();
  if(['Jewelry Motion','Logo Lab'].includes(plan)) renderGuidedStyleFlow({writePrompt:true});
  
  const isIdProfile = plan.startsWith('ID') || plan.startsWith('Profile');
  const isBeforeAfter = isBeforeAfterPlan(plan);
  const guide = $('#uploadGuideBox');
  if (guide) guide.style.display = isIdProfile ? 'block' : 'none';
  const styleBlock = $('.style-select-block');
  if (styleBlock) styleBlock.style.display = (isIdProfile || isBeforeAfter) ? 'none' : 'block';
  const aspectGroup = $('#aspectGroup');
  if (aspectGroup) aspectGroup.style.display = (isIdProfile || isBeforeAfter) ? 'none' : 'block';
  const resolutionGroup = $('#resolutionGroup');
  if (resolutionGroup) resolutionGroup.style.display = isIdProfile ? 'none' : 'block';
  const idSpecGroup = $('#idSpecGroup');
  if (idSpecGroup) idSpecGroup.style.display = isIdProfile ? 'block' : 'none';
  syncBeforeAfterOrderUi(plan);
  updatePreflightOutput();

  if(modal) modal.classList.add('on');
  document.body.style.overflow='hidden';
  if(window.__avvmLenis) window.__avvmLenis.stop();
  requestAnimationFrame(()=>{
    scrollModalToTop();
    setTimeout(()=>{ syncCustomerInputs(); focusAndReveal('#photoUploadVisibleBlock'); },120);
  });
}

function openBeforeAfterOrder(type){
  if(!BEFORE_AFTER_ROUTES[type]) return;
  if(window.avvmBeforeAfterType && window.avvmBeforeAfterType!==type){
    resetGeneratedAfterConcept();
    window.avvmBeforeAfterVideoDirection='';
  }
  window.avvmBeforeAfterType=type;
  selectCategory(BEFORE_AFTER_ROUTES[type].category);
  const mood=$('#moodInput');
  if(mood) mood.value='';
  openOrder('Before / After Reel');
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
  if(category === 'Design' && !['Jewelry Motion','Logo Lab'].includes(window.selectedPlan)){
    window.selectedPlan='Jewelry Motion';
    setOrderSummary();
    syncPlanOutput('Jewelry Motion');
  }
  $$('.cat').forEach(button=>button.classList.toggle('active',button===target));
  updateDesignLabBrief();
  renderGuidedStyleFlow();
  updatePreflightOutput();
}

function isDesignLabSelected(){
  return $('.cat.active')?.dataset?.category === 'Design';
}

function getDesignType(){
  return $('#designLabBrief .design-lab-type.active')?.dataset?.designType || (window.selectedPlan === 'Logo Lab' ? 'logo' : 'jewelry');
}

function updateDesignLabBrief(){
  const panel=$('#designLabBrief');
  if(!panel) return;
  const selected=isDesignLabSelected();
  panel.hidden=!selected;
  if(!selected) return;
  const type=window.selectedPlan === 'Logo Lab' ? 'logo' : 'jewelry';
  panel.querySelectorAll('[data-design-type]').forEach((button)=>button.classList.toggle('active',button.dataset.designType===type));
  const word=$('#logoWordInput');
  if(word) word.closest('.design-logo-word')?.classList.toggle('is-required',type==='logo');
}

function setDesignType(type){
  if(type!=='logo' && type!=='jewelry') return;
  const plan=type==='logo' ? 'Logo Lab' : 'Jewelry Motion';
  window.selectedPlan=plan;
  setOrderSummary();
  syncPlanOutput(plan);
  if(typeof guideState!=='undefined'){
    guideState.presetId=type==='logo' ? 'design-logo-minimal' : 'design-jewel-prism';
  }
  updateDesignLabBrief();
  renderGuidedStyleFlow({writePrompt:true});
  updatePreflightOutput();
}

$$('[data-open]').forEach(b=>b.addEventListener('click',()=>{
  selectCategory(b.dataset.category);
  openOrder(b.dataset.plan);
}));

/* Small-business funnel: one representative product photo becomes a clear
   sales-page brief first, then continues into the normal AVVM video order. */
const commercePageState={type:'product',file:null,previewUrl:''};
const COMMERCE_PAGE_TYPES=Object.freeze({
  product:{label:'PRODUCT STORY',category:'Product',title:'상품의 장점을, 구매 이유로 바꿉니다.',titleEn:'Turn the product benefit into a reason to buy.',cut:'제품 정면 → 디테일 → 사용 장면 → 구매 유도',cutEn:'Product hero → detail → use moment → call to action'},
  food:{label:'FOOD STORY',category:'Food',title:'한 입 전의 기대감을, 첫 화면에서 만듭니다.',titleEn:'Build anticipation before the first bite.',cut:'대표 메뉴 → 질감 클로즈업 → 매장 무드 → 방문 유도',cutEn:'Signature dish → texture close-up → store mood → visit call'},
  space:{label:'SPACE STORY',category:'Custom',title:'공간의 첫인상을, 예약 이유로 바꿉니다.',titleEn:'Turn a first impression of the space into a reason to book.',cut:'공간 전경 → 디테일 → 빛과 동선 → 방문·예약 유도',cutEn:'Wide space → details → light and flow → visit or booking call'}
});

function commerceText(value,fallback){ return String(value||'').trim() || fallback; }
function commerceLocale(korean,english){ return window.AVVM_I18N?.localize?.(korean,english)||korean; }
function renderCommercePageDraft(){
  const meta=COMMERCE_PAGE_TYPES[commercePageState.type]||COMMERCE_PAGE_TYPES.product;
  const name=commerceText($('#commerceProductName')?.value,commerceLocale('대표 상품','Hero product'));
  const benefit=commerceText($('#commerceProductBenefit')?.value,commerceLocale('사진 속 특징을 고객이 바로 이해할 수 있는 구매 포인트로 정리합니다.','We organise the visible details into a purchase point customers can understand immediately.'));
  const preview=$('#commercePagePreviewMedia');
  const label=$('#commerceProductImageLabel');
  if(label) label.textContent=commercePageState.file ? commercePageState.file.name : commerceLocale('사진 선택하기','Choose a photo');
  if(preview){
    if(commercePageState.previewUrl) URL.revokeObjectURL(commercePageState.previewUrl);
    commercePageState.previewUrl='';
    preview.replaceChildren();
    if(commercePageState.file){
      commercePageState.previewUrl=URL.createObjectURL(commercePageState.file);
      const image=document.createElement('img'); image.src=commercePageState.previewUrl; image.alt=commerceLocale(`${name} 대표 사진`,`${name} hero product photo`); preview.append(image);
    }else{ const marker=document.createElement('span'); marker.textContent='YOUR PRODUCT'; preview.append(marker); }
  }
  const title=$('#commercePagePreviewTitle'); if(title) title.textContent=`${name}, ${commerceLocale(meta.title,meta.titleEn)}`;
  const type=$('#commercePagePreviewType'); if(type) type.textContent=meta.label;
  const lead=$('#commercePagePreviewLead'); if(lead) lead.textContent=benefit;
  const points=$('#commercePagePreviewPoints');
  if(points){
    points.replaceChildren();
    [
      commerceLocale(`첫 화면: ${name}의 한 가지 강점`,`First screen: one strong reason to choose ${name}`),
      commerceLocale(`상세 포인트: ${benefit}`,`Detail point: ${benefit}`),
      commerceLocale('마지막: 구매·방문을 부르는 명확한 다음 행동','Final frame: one clear action to buy or visit')
    ].forEach(text=>{const item=document.createElement('li');item.textContent=text;points.append(item);});
  }
  const cut=$('#commercePageVideoLine'); if(cut) cut.textContent=`VIDEO CUT · ${commerceLocale(meta.cut,meta.cutEn)}`;
  const order=$('#commercePageOrder'); if(order) order.disabled=!commercePageState.file;
}

function setupCommercePageMachine(){
  const form=$('#commercePageForm'); if(!form) return;
  const fileInput=$('#commerceProductImage');
  fileInput?.addEventListener('change',()=>{
    const file=fileInput.files?.[0];
    const allowed=['image/jpeg','image/png','image/webp'];
    if(file && (!allowed.includes(file.type) || file.size>4*1024*1024)){ toast(commerceLocale('대표 사진은 4MB 이하의 JPG, PNG, WEBP 파일로 올려주세요.','Please upload a JPG, PNG, or WEBP hero photo smaller than 4 MB.')); fileInput.value=''; commercePageState.file=null; renderCommercePageDraft(); return; }
    commercePageState.file=file||null;
    renderCommercePageDraft();
  });
  $$('.commerce-page-type button').forEach(button=>button.addEventListener('click',()=>{
    commercePageState.type=button.dataset.commerceType||'product';
    $$('.commerce-page-type button').forEach(item=>item.classList.toggle('active',item===button));
    renderCommercePageDraft();
  }));
  form.addEventListener('submit',(event)=>{event.preventDefault();renderCommercePageDraft();$('#commercePageOutput')?.scrollIntoView({behavior:'smooth',block:'center'});});
  $('#commercePageOrder')?.addEventListener('click',()=>{
    if(!commercePageState.file){toast(commerceLocale('먼저 대표 제품 사진을 올려주세요.','Upload a hero product photo first.'));return;}
    const meta=COMMERCE_PAGE_TYPES[commercePageState.type]||COMMERCE_PAGE_TYPES.product;
    selectCategory(meta.category); openOrder('Starter');
    const source=$('#imageInput');
    if(source && window.DataTransfer){
      const transfer=new DataTransfer(); transfer.items.add(commercePageState.file); source.files=transfer.files; handleSourceImageChange();
    }
    const mood=$('#moodInput');
    if(mood) mood.value=`${$('#commercePagePreviewTitle')?.textContent||''}\n${$('#commercePagePreviewLead')?.textContent||''}\n${$('#commercePageVideoLine')?.textContent||''}`;
    toast(commerceLocale('상세페이지 초안과 대표 사진을 광고 영상 주문에 적용했습니다.','The sales-page draft and hero photo were applied to the advertising-video order.'));
  });
}
setupCommercePageMachine();
document.addEventListener('avvm:languagechange',renderCommercePageDraft);

document.addEventListener('click',(event)=>{
  const trigger=event.target.closest('[data-before-after]');
  if(!trigger) return;
  openBeforeAfterOrder(trigger.dataset.beforeAfter);
});

async function copyRecipePrompt(prompt){
  try{
    await navigator.clipboard.writeText(prompt);
  }catch(error){
    const area=document.createElement('textarea');
    area.value=prompt;
    area.setAttribute('readonly','');
    area.style.position='fixed';
    area.style.opacity='0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
}

document.addEventListener('click',async(event)=>{
  const copyButton=event.target.closest('[data-copy-recipe]');
  const applyButton=event.target.closest('[data-apply-recipe]');
  const recipeId=copyButton?.dataset.copyRecipe || applyButton?.dataset.applyRecipe;
  if(!recipeId) return;
  const recipe=PROMPT_RECIPES[recipeId];
  if(!recipe) return;
  if(copyButton){
    await copyRecipePrompt(recipe.prompt);
    copyButton.textContent='COPIED ✓';
    toast('Prompt copied — paste it anywhere or apply it to your order.');
    setTimeout(()=>{ if(copyButton.isConnected) copyButton.textContent='COPY PROMPT'; },1700);
    return;
  }
  selectCategory(recipe.category);
  const moodInput=$('#moodInput');
  if(moodInput) moodInput.value=recipe.prompt;
  openOrder(window.selectedPlan || 'Pro');
  toast('Recipe applied. Add your photo to start the pre-flight check.');
});

document.addEventListener('click', function(e){
  const choice=e.target.closest('[data-plan-choice]');
  if(!choice) return;
  if(choice.dataset.category) selectCategory(choice.dataset.category);
  openOrder(choice.getAttribute('data-plan-choice'));
});

document.addEventListener('click',function(event){
  const choice=event.target.closest('[data-design-type]');
  if(!choice) return;
  setDesignType(choice.dataset.designType);
});

if($('#closeModal')) $('#closeModal').addEventListener('click',closeOrder); 
if(modal) modal.addEventListener('click',e=>{if(e.target===modal)closeOrder();});

$$('.cat').forEach(b=>b.addEventListener('click',()=>{selectCategory(b.dataset.category); toast(`${b.textContent} mood selected`);}));

document.addEventListener('click',(event)=>{
  const chip=event.target.closest('.option-chips .option-chip');
  if(!chip || chip.disabled) return;
  const group=chip.closest('[data-option-group]');
  const groupName=group?.dataset.optionGroup;
  const fieldId={aspect:'aspectRatio',resolution:'resolution',idSpec:'idSpec'}[groupName];
  if(!group || !fieldId) return;
  group.querySelectorAll('.option-chip').forEach(button=>button.classList.toggle('active',button===chip));
  const field=$('#'+fieldId);
  if(field) field.value=chip.dataset.value;
  updatePreflightOutput();
});

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
  const resolution = document.getElementById('resolution')?.value || getPlanOutput().resolution;
  return {
    duration: '5s',
    resolution,
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

function readImageFile(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const image=new Image();
      image.onload=()=>resolve(image);
      image.onerror=()=>reject(new Error('전·후 사진을 읽지 못했습니다. JPG, PNG 또는 WEBP 파일을 다시 선택해주세요.'));
      image.src=reader.result;
    };
    reader.onerror=()=>reject(new Error('전·후 사진 파일을 읽는 중 오류가 발생했습니다.'));
    reader.readAsDataURL(file);
  });
}

function readImageSource(source){
  if(typeof source!=='string') return readImageFile(source);
  return new Promise((resolve,reject)=>{
    const image=new Image();
    image.crossOrigin='anonymous';
    image.onload=()=>resolve(image);
    image.onerror=()=>reject(new Error('AI AFTER 시안을 읽지 못했습니다. 시안을 다시 만들어주세요.'));
    image.src=source;
  });
}

function drawImageCover(ctx,image,x,y,width,height){
  const scale=Math.max(width/image.naturalWidth,height/image.naturalHeight);
  const drawWidth=Math.round(image.naturalWidth*scale);
  const drawHeight=Math.round(image.naturalHeight*scale);
  const drawX=Math.round(x+(width-drawWidth)/2);
  const drawY=Math.round(y+(height-drawHeight)/2);
  ctx.drawImage(image,drawX,drawY,drawWidth,drawHeight);
}

async function composeBeforeAfterSource(beforeFile,afterFile,type){
  const [before,after]=await Promise.all([readImageSource(beforeFile),readImageSource(afterFile)]);
  const route=BEFORE_AFTER_ROUTES[type] || BEFORE_AFTER_ROUTES.beauty;
  const isLandscape=route.aspect==='16:9';
  const width=isLandscape ? 1600 : 1080;
  const height=isLandscape ? 900 : 1920;
  const panelWidth=Math.floor(width/2);
  const canvas=document.createElement('canvas');
  canvas.width=width;
  canvas.height=height;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#070807';
  ctx.fillRect(0,0,width,height);
  drawImageCover(ctx,before,0,0,panelWidth,height);
  drawImageCover(ctx,after,panelWidth,0,width-panelWidth,height);
  const edge=ctx.createLinearGradient(panelWidth-14,0,panelWidth+14,0);
  edge.addColorStop(0,'rgba(0,0,0,.38)');
  edge.addColorStop(.47,'rgba(216,242,51,.86)');
  edge.addColorStop(.53,'rgba(216,242,51,.86)');
  edge.addColorStop(1,'rgba(0,0,0,.38)');
  ctx.fillStyle=edge;
  ctx.fillRect(panelWidth-14,0,28,height);
  const dataUrl=canvas.toDataURL('image/jpeg',0.82);
  if(dataUrl.length>MAX_IMAGE_DATA_URL_CHARS){
    throw new Error('전·후 사진 조합이 너무 큽니다. 원본을 조금 잘라내거나 해상도가 낮은 사진으로 다시 선택해주세요.');
  }
  return dataUrl;
}

const PROMPT_RECIPES={
  'product-orbit':{category:'Product',prompt:'Keep the product, logo, dial, materials, and silhouette exact. The product stays perfectly still while its environment freezes for one beat: suspended dust, a sudden hard-light sweep, then a precise micro push-in. High-end tactile commercial, no deformation, no new text, no invented logos.'},
  'beauty-liquid':{category:'Beauty',prompt:'Keep the exact product and label. A single bead of light travels across the package and turns into a refraction field on the surface around it; the product never changes. Clean tactile beauty film, controlled macro focus, no packaging changes, no unreadable label.'},
  'memorial-return':{category:'Custom',prompt:'Preserve identity, era, clothing, and original framing. Begin completely still, then let one natural breath, a tiny blink, and a nearly imperceptible glance return the photograph to life. Retain archival grain, no modern styling, no dramatic gesture.'},
  'editorial-walk':{category:'Custom',prompt:'Keep the subject identity and wardrobe silhouette. Start on a calm close portrait; a single camera pass across the shoulder reveals an editorial world with the same person already in motion. Believable fabric and hair movement, no face distortion, no extra limbs.'},
  'travel-portal':{category:'Travel',prompt:'Keep the person recognizable. Use a one-take edge-of-frame transition: when the subject passes close to camera, the same movement continues in a sunlit destination. Natural weather and location light, no portal graphics, no sudden body or face changes.'},
  'music-pulse':{category:'Custom',prompt:'Preserve identity and outfit silhouette. One sharp dance accent folds the practical stage lighting around the performer for a beat, then it releases into a clean wide shot. Controlled camera rush, intentional anatomy, high-energy music-video finish. No fighting, violence, face distortion, or extra limbs.'},
  'food-heat':{category:'Food',prompt:'Preserve the exact dish and plating. Begin on one honest tactile detail: rising steam, crisp surface, or small bubbles. Move back to reveal the untouched whole plate in warm natural light. No melting food, no ingredient changes, no extra hands.'},
  'wedding-light':{category:'Wedding',prompt:'Preserve the couple or subject, clothing, and location. Natural light passes behind a veil or shoulder and briefly veils the lens, then reveals a deeper held expression. Quiet cinematic movement, believable fabric, no face changes, no invented guests.'},
  'classic-gate':{category:'Custom',prompt:'Keep the original era, monochrome or archival grain, clothing, and frame. As if a film gate opens, restore only a blink, breath, and slight eye movement. No modern restyle, no altered identity, no dramatic gesture.'},
  'profile-lock':{category:'Custom',prompt:'Lock facial identity, pose, skin texture, and proportions. Minimal living motion only: one calm breath and natural eye focus. Neutral professional light and a trustworthy finish. No face reshaping, no wardrobe change, no background replacement.'}
};

/* The visible path remains short: category → specific mood → one camera rhythm.
   Prompts are original AVVM recipes that prioritise source preservation. */
const STYLE_GUIDES = Object.freeze({
  Beauty: [
    { id: 'beauty-refraction', title: 'LIQUID REFRACTION', titleKo: '리퀴드 굴절광', description: 'Light refracts around an unchanged beauty product.', descriptionKo: '제품은 그대로 두고 빛과 투명한 굴절감만 움직입니다.', prompt: 'Keep the exact beauty product, cap, label, and proportions. A single travelling highlight creates a controlled field of glass-like refraction around the package. Premium macro skincare film, no packaging change, no invented text.' },
    { id: 'beauty-satin', title: 'SATIN SKIN', titleKo: '새틴 스킨', description: 'Soft texture, calm highlights, and an editorial finish.', descriptionKo: '부드러운 광택과 피부 질감을 정돈한 에디토리얼 무드입니다.', prompt: 'Preserve the exact beauty product and skin tone. Use soft satin highlights, restrained texture movement, and a clean editorial beauty grade. No warped packaging, no unreadable labels.' },
    { id: 'beauty-night', title: 'NIGHT CHROME', titleKo: '나이트 크롬', description: 'A sculpted nocturnal campaign with one controlled light sweep.', descriptionKo: '한 번의 빛 스윕으로 완성하는 조각 같은 나이트 캠페인입니다.', prompt: 'Keep the product silhouette and label exact. Shape a dark chromed beauty campaign with one precise light sweep and controlled reflections. No new objects, no distorted logo.' }
  ],
  Product: [
    { id: 'product-physics', title: 'PHYSICS PAUSE', titleKo: '피직스 포즈', description: 'The object stays fixed while light and atmosphere pause around it.', descriptionKo: '제품은 고정하고 빛과 공기만 멈추게 하는 제품 훅입니다.', prompt: 'Keep the product, logo, dial, material, and silhouette exact. The product remains still while dust and light pause for one beat, then release into a precise commercial reveal. No deformation, no invented text.' },
    { id: 'product-orbit', title: 'TACTILE ORBIT', titleKo: '택타일 오빗', description: 'A slow orbit makes material and form feel expensive.', descriptionKo: '느린 궤도 카메라로 소재와 형태를 고급스럽게 보여줍니다.', prompt: 'Preserve exact product geometry, branding, and material finish. Use one slow controlled orbit with tactile micro highlights and clean negative space. No shape changes, no extra product, no unreadable logo.' },
    { id: 'product-macro', title: 'MATERIAL MACRO', titleKo: '머티리얼 매크로', description: 'A close material study resolves into the full product.', descriptionKo: '질감 클로즈업에서 완전한 제품 히어로 컷으로 이어집니다.', prompt: 'Preserve the exact product and its label. Begin on one honest material detail, then resolve into a stable hero product shot. Premium macro commercial, no label distortion, no added text.' }
  ],
  Food: [
    { id: 'food-steam', title: 'STEAM REVEAL', titleKo: '스팀 리빌', description: 'Heat and steam introduce the unchanged plate.', descriptionKo: '온기와 김으로 음식의 첫인상을 살립니다.', prompt: 'Preserve the exact dish, plating, and ingredients. Start with natural steam and a crisp surface detail, then reveal the untouched plate in warm honest light. No melting food, no extra hands, no ingredient changes.' },
    { id: 'food-pour', title: 'POUR MOMENT', titleKo: '푸어 모먼트', description: 'One controlled pour becomes the visual hook.', descriptionKo: '한 번의 절제된 푸어 동작으로 시선을 잡습니다.', prompt: 'Keep the dish, glassware, and serving exact. Use one physically believable controlled pour as the hook, then settle on the untouched final plate. No overflowing liquid, no changing ingredients, no extra hands.' },
    { id: 'food-table', title: 'TABLE GLOW', titleKo: '테이블 글로우', description: 'A warm table scene with a quiet restaurant finish.', descriptionKo: '따뜻한 테이블 위에서 완성하는 조용한 레스토랑 무드입니다.', prompt: 'Preserve the exact menu, plating, and table setting. Use warm practical light, subtle environmental movement, and a composed restaurant-film finish. No ingredient changes, no distorted cutlery.' }
  ],
  Travel: [
    { id: 'travel-pass', title: 'EDGE-OF-FRAME PASS', titleKo: '프레임 패스', description: 'One passing movement reveals a new destination.', descriptionKo: '프레임을 스치는 한 번의 동작으로 새로운 여행지를 엽니다.', prompt: 'Keep the person recognisable and preserve body proportions. One edge-of-frame pass continues naturally into a sunlit destination, with believable weather and location light. No portal graphics, no face changes.' },
    { id: 'travel-postcard', title: 'MOVING POSTCARD', titleKo: '무빙 포스트카드', description: 'A destination opens with slow cinematic atmosphere.', descriptionKo: '느린 시네마틱 분위기로 여행지의 공기를 보여줍니다.', prompt: 'Keep the subject identity, pose, and clothing silhouette stable. Build a moving postcard with natural wind, distant depth, and one gentle travel-camera move. No body distortion, no sudden costume change.' },
    { id: 'travel-night', title: 'NIGHT ROUTE', titleKo: '나이트 루트', description: 'Street lights and a measured walking rhythm create the hook.', descriptionKo: '도시의 불빛과 절제된 워킹 리듬으로 훅을 만듭니다.', prompt: 'Keep the person and outfit recognisable. Use a clean night-street tracking move with realistic reflections and controlled motion. No face change, no extra limbs, no random signage.' }
  ],
  Wedding: [
    { id: 'wedding-veil', title: 'VEIL LIGHT', titleKo: '베일 라이트', description: 'Soft light passes the veil before a held expression.', descriptionKo: '베일을 스치는 빛 뒤로 깊은 표정을 남깁니다.', prompt: 'Preserve the couple or subject, clothing, and location. Soft light moves behind a veil or shoulder, revealing one deeper held expression. Quiet cinematic motion, believable fabric, no face changes, no invented guests.' },
    { id: 'wedding-garden', title: 'GARDEN VOW', titleKo: '가든 바우', description: 'Natural foliage and fabric movement build a calm vow scene.', descriptionKo: '자연스러운 잎과 패브릭 움직임으로 차분한 서약 장면을 만듭니다.', prompt: 'Preserve identity, wedding attire, and venue. Use gentle garden air, natural fabric movement, and a composed cinematic push-in. No changed faces, no invented ceremony details.' },
    { id: 'wedding-after', title: 'AFTERGLOW', titleKo: '애프터글로우', description: 'Warm evening light gives the portrait a final glow.', descriptionKo: '따뜻한 저녁빛으로 인물의 마지막 잔상을 남깁니다.', prompt: 'Keep the couple and wardrobe exact. Create a restrained evening afterglow with warm practical light and one slow camera move. No altered identity, no extra people, no fantasy effects.' }
  ],
  Design: [
    { id: 'design-jewel-prism', designType: 'jewelry', title: 'JEWEL PRISM', titleKo: '주얼 프리즘', description: 'A precise macro light pass makes the design and stone setting legible.', descriptionKo: '스케치의 구조와 세팅을 지키며 프리즘 광으로 실제감을 더합니다.', prompt: 'Use the supplied authorized jewelry sketch or product photograph as the exact design reference. Preserve stone shape, setting, metal tone, and proportions. Translate it into a realistic premium jewelry hero image with a narrow prism-light reflection. No extra jewelry, no altered gem cut, no unreadable text.' },
    { id: 'design-jewel-blueprint', designType: 'jewelry', title: 'BLUEPRINT TO OBJECT', titleKo: '블루프린트 투 오브젝트', description: 'A technical sketch resolves into one clean finished object.', descriptionKo: '치수와 실루엣을 지키며 스케치에서 완성 제품으로 이어집니다.', prompt: 'Respect the supplied design sketch, dimensions, and silhouette. Resolve it into one clean photoreal product on a neutral studio surface, with the same proportions and materials. No invented accessories, no extra logos, no changed design details.' },
    { id: 'design-jewel-gallery', designType: 'jewelry', title: 'GALLERY METAL', titleKo: '갤러리 메탈', description: 'Quiet gallery light gives the finished design a collectible feel.', descriptionKo: '고요한 갤러리 빛으로 완성 디자인의 소장 가치를 보여줍니다.', prompt: 'Preserve the exact supplied jewelry or object design. Use soft gallery lighting, accurate material response, and a clean premium object frame. No changed geometry, no added product, no invented markings.' },
    { id: 'design-logo-minimal', designType: 'logo', title: 'MINIMAL MARK', titleKo: '미니멀 마크', description: 'A confident typographic mark with clean negative space.', descriptionKo: '정돈된 여백과 자신감 있는 워드마크를 만듭니다.', prompt: 'Create a clean, original minimal logo direction from the supplied brand word or sketch. Keep the exact supplied word legible. Use a simple distinctive symbol and generous negative space. Do not imitate existing brands, do not invent extra words, and keep all typography readable.' },
    { id: 'design-logo-symbolic', designType: 'logo', title: 'SYMBOLIC SYSTEM', titleKo: '심볼릭 시스템', description: 'An original emblem and wordmark system built from one idea.', descriptionKo: '하나의 아이디어로 심볼과 워드마크를 함께 설계합니다.', prompt: 'Create an original symbolic logo system from the supplied brand word or sketch. Keep the exact word readable and create one abstract, non-infringing emblem that supports it. Flat vector-like presentation, no existing brand resemblance, no extra text.' },
    { id: 'design-logo-classic', designType: 'logo', title: 'CLASSIC SEAL', titleKo: '클래식 씰', description: 'A restrained heritage seal with a modern finish.', descriptionKo: '절제된 헤리티지 씰에 현대적인 마감을 더합니다.', prompt: 'Create an original classic logo direction from the supplied brand word or sketch. Keep the exact word readable. Use a restrained seal or crest geometry with clean contemporary spacing. No copied trademark, no extra words, no ornate unreadable lettering.' }
  ],
  Custom: [
    { id: 'custom-editorial', title: 'PORTRAIT EDITORIAL', titleKo: '포트레이트 에디토리얼', description: 'A calm portrait becomes a fashion-film still in motion.', descriptionKo: '차분한 인물 사진을 패션 필름의 한 장면으로 만듭니다.', prompt: 'Keep the subject identity and wardrobe silhouette. Begin on a calm close portrait, then use one clean shoulder pass into an editorial world already in motion. Believable hair and fabric, no face distortion.' },
    { id: 'custom-memorial', title: 'MEMORY RETURN', titleKo: '메모리 리턴', description: 'Archival texture remains while only a small gesture returns.', descriptionKo: '사진의 시대감은 지키고 작은 움직임만 되살립니다.', prompt: 'Preserve identity, era, clothing, and original framing. Begin completely still, then return one natural breath, tiny blink, and subtle eye movement. Retain archival grain, no modern styling, no dramatic gesture.' },
    { id: 'custom-performance', title: 'STAGE PULSE', titleKo: '스테이지 펄스', description: 'One musical accent drives a controlled performance moment.', descriptionKo: '하나의 음악적 악센트로 절제된 퍼포먼스를 만듭니다.', prompt: 'Preserve identity and outfit silhouette. One sharp dance accent reshapes practical stage lighting for a beat, then releases into a clean wide shot. Controlled camera rush, intentional anatomy, no violence, no extra limbs.' }
  ]
});

const MOTION_GUIDES = Object.freeze([
  { id: 'restrained', title: 'QUIET', titleKo: '차분하게', description: 'A subtle push-in keeps the source stable.', descriptionKo: '절제된 푸시인으로 원본의 안정감을 지킵니다.', prompt: 'Use only a restrained slow push-in with calm pacing; keep all source details stable.' },
  { id: 'cinematic', title: 'CINEMATIC', titleKo: '시네마틱', description: 'One measured camera pass adds depth.', descriptionKo: '한 번의 카메라 패스로 깊이를 더합니다.', prompt: 'Use one measured cinematic lateral camera pass and a controlled focus transition; do not add cuts.' },
  { id: 'impact', title: 'IMPACT', titleKo: '임팩트', description: 'A precise first-second hook, then control.', descriptionKo: '첫 1초에 훅을 만들고 이후에는 안정적으로 유지합니다.', prompt: 'Create one precise first-second visual hook, then resolve into stable premium motion with no chaotic camera movement.' }
]);

const PROMPT_LIBRARY = Object.freeze([
  { id: 'parents-life-library', category: 'Custom', title: 'PARENTS · LIFE PORTRAIT', titleKo: '부모님 · 인생 초상', keywords: 'parents parent mother father birthday sixtieth seventieth retirement 부모님 엄마 아빠 환갑 칠순 팔순 은퇴', prompt: 'Use only an authorised family portrait. Preserve identity, era, clothing, and expression. Begin in a still, dignified frame, then introduce a small breath, a gentle gaze, and warm window light. A respectful living portrait, no age change, no modern restyle, no invented people.' },
  { id: 'wedding-story-library', category: 'Wedding', title: 'WEDDING · OUR STORY', titleKo: '웨딩 · 우리의 이야기', keywords: 'wedding bride groom couple proposal anniversary first meeting wedding film 웨딩 신부 신랑 커플 프러포즈 기념일 식전영상', prompt: 'Use only authorised photographs of the couple. Preserve both identities, wardrobe, and venue. A soft shoulder-level camera pass catches believable fabric movement and one held shared expression. Elegant wedding story film, no changed faces, no invented guests.' },
  { id: 'baby-milestone-library', category: 'Custom', title: 'BABY · GENTLE MILESTONE', titleKo: '아기 · 소중한 순간', keywords: 'baby newborn first birthday hundred days growth child milestone 아기 신생아 첫돌 백일 성장 돌잔치', prompt: 'Use only an authorised family photograph. Preserve the child’s identity, pose, and clothing. Create only gentle, age-appropriate motion: a natural blink, a small smile, and soft daylight. Keep the framing calm and safe; no adult styling, no exaggerated gesture.' },
  { id: 'product-hero-library', category: 'Product', title: 'PRODUCT · HERO SHORT', titleKo: '제품 · 히어로 숏폼', keywords: 'product ecommerce smart store shop short form launch retail 상품 제품 스마트스토어 쇼핑몰 숏폼 신상품', prompt: 'Keep the exact product, logo, label, material, and silhouette. Start on one tactile detail, make one precise camera pass, then resolve into a clean product hero frame. Premium commerce short, no altered packaging, no invented text or claims.' },
  { id: 'pet-memory-library', category: 'Custom', title: 'PET · MEMORY RETURN', titleKo: '반려동물 · 메모리 리턴', keywords: 'pet dog cat animal memorial rainbow bridge pet memory 반려동물 강아지 고양이 메모리얼 무지개다리', prompt: 'Use only an authorised pet photograph. Preserve the animal’s markings, scale, pose, and original setting. Begin still, then add one natural ear movement, breath, or gentle glance. Warm memory film, no altered markings, no humanised anatomy, no dramatic action.' },
  { id: 'family-archive-library', category: 'Custom', title: 'FAMILY · TIME CAPSULE', titleKo: '가족 · 타임캡슐', keywords: 'family archive old photo reunion grandparents children family history 가족사진 옛사진 가족여행 조부모 추억', prompt: 'Use only authorised family photographs. Preserve every recognisable face, clothing, and the original framing. Retain the archival texture while bringing back only subtle breathing, eye focus, and environmental light. Intimate family time capsule, no identity changes, no invented relatives.' },
  { id: 'travel-recap-library', category: 'Travel', title: 'TRAVEL · MOVING POSTCARD', titleKo: '여행 · 무빙 포스트카드', keywords: 'travel holiday vacation beach city trip postcard travel reel 여행 휴가 바다 도시 여행릴스', prompt: 'Keep the traveller recognisable, with stable body proportions and clothing silhouette. Use natural wind, distant depth, and one slow camera move to make a moving postcard. Believable place light, no portal graphics, no sudden body or costume changes.' },
  { id: 'beauty-liquid-library', category: 'Beauty', title: 'BEAUTY · LIQUID LIGHT', titleKo: '뷰티 · 리퀴드 라이트', keywords: 'beauty skincare serum cosmetic liquid glass skin 뷰티 스킨케어 세럼 화장품', prompt: 'Keep the exact beauty product, cap, label, and colour. A controlled liquid-light reflection travels across the unchanged package, then resolves in clean macro focus. Premium skincare campaign, no package changes, no unreadable text.' },
  { id: 'food-steam-library', category: 'Food', title: 'FOOD · HEAT DETAIL', titleKo: '푸드 · 히트 디테일', keywords: 'food restaurant dish steam dessert cafe menu 푸드 음식 레스토랑 디저트 카페', prompt: 'Preserve the exact dish, plating, and ingredients. Start with one appetising heat detail—steam, crisp surface, or bubbles—then reveal the unchanged plate in warm natural light. No melting food, no added ingredients, no extra hands.' },
  { id: 'jewelry-light', category: 'Product', title: 'JEWELRY · PRISM LIGHT', titleKo: '주얼리 · 프리즘 라이트', keywords: 'jewelry ring necklace gold diamond prism 주얼리 반지 목걸이 다이아', prompt: 'Preserve the exact jewelry design, stones, setting, and material. A narrow prism of light travels through the piece while the camera makes one precise macro move. High-end jewellery campaign, no changed gem cuts, no extra items.' },
  { id: 'watch-orbit', category: 'Product', title: 'WATCH · DIAL ORBIT', titleKo: '시계 · 다이얼 오빗', keywords: 'watch timepiece dial jewelry steel orbit 시계 주얼리 다이얼', prompt: 'Keep the exact watch, dial markers, crown, bracelet, brand mark, and proportions. A slow orbital camera catches a single travelling reflection across the crystal, then settles into a clean hero frame. Luxury product film, no altered numerals, no invented logos.' },
  { id: 'fashion-lookbook-library', category: 'Custom', title: 'FASHION · STILL TO WALK', titleKo: '패션 · 스틸 투 워크', keywords: 'fashion lookbook outfit ootd runway model clothes 패션 룩북 착장 데일리룩 런웨이', prompt: 'Use an authorised fashion photograph. Keep the subject identity and outfit silhouette exactly stable. A calm close portrait becomes one composed walking pass with believable hair and fabric movement. Editorial lookbook film, no face distortion, no extra limbs, no wardrobe swap.' },
  { id: 'property-tour-library', category: 'Custom', title: 'SPACE · QUIET TOUR', titleKo: '공간 · 콰이어트 투어', keywords: 'property real estate apartment house room rental interior tour 부동산 매물 아파트 원룸 공간 집보기', prompt: 'Preserve the exact room layout, windows, furniture, and finishes. Use one slow, believable camera glide through the existing space with natural daylight depth. Premium property tour, no added rooms, no changed dimensions, no misleading fixtures.' },
  { id: 'interior-reveal-library', category: 'Custom', title: 'INTERIOR · BEFORE / AFTER', titleKo: '인테리어 · 비포 애프터', keywords: 'interior before after renovation remodel furniture home decor 인테리어 비포애프터 리모델링 가구 홈데코', prompt: 'Use only the supplied before and after references. Keep room geometry, windows, and fixed structures accurate. Transition with one clear wipe from the real before state to the real after state. No invented renovation, no altered floor plan, no misleading finishes.' },
  { id: 'cafe-ambience-library', category: 'Food', title: 'CAFE · TABLE GLOW', titleKo: '카페 · 테이블 글로우', keywords: 'cafe bakery restaurant menu ambience table coffee 카페 베이커리 레스토랑 메뉴 커피', prompt: 'Preserve the exact menu item, table setting, and café interior. Add only practical warm light, a subtle steam detail, and a composed camera drift. Inviting café film, no changed food, no invented hands, no unreadable menu text.' },
  { id: 'brand-opening-library', category: 'Product', title: 'BRAND · LOGO OPENING', titleKo: '브랜드 · 로고 오프닝', keywords: 'brand logo intro opening identity launch campaign 브랜딩 로고 인트로 런칭 캠페인', prompt: 'Keep the exact supplied logo, proportions, colours, and clear space. Use one deliberate material-light reveal, then hold on the clean original mark. Premium brand opening, no invented letters, no warped logo, no unsupported product claims.' },
  { id: 'birthday-surprise-library', category: 'Custom', title: 'CELEBRATION · BIRTHDAY LIGHT', titleKo: '기념일 · 생일 라이트', keywords: 'birthday celebration anniversary surprise party greeting 생일 축하 기념일 서프라이즈 파티', prompt: 'Use only authorised celebration photographs. Preserve each person’s identity, expression, and venue. Add warm practical lights, a small natural smile, and one gentle camera push. Personal celebration film, no changed faces, no invented text or people.' },
  { id: 'profile-lock-library', category: 'Custom', title: 'PROFILE · LIVING PORTRAIT', titleKo: '프로필 · 리빙 포트레이트', keywords: 'profile id portrait resume business headshot professional 프로필 증명사진 이력서 비즈니스 인물', prompt: 'Use an authorised portrait. Lock facial identity, pose, skin texture, and proportions. Add only a calm breath and natural eye focus under neutral professional light. Trustworthy living profile, no face reshaping, no wardrobe change, no background replacement.' },
  { id: 'automotive-detail-library', category: 'Product', title: 'AUTO · METAL PASS', titleKo: '자동차 · 메탈 패스', keywords: 'car automotive vehicle bike motorcycle metal driving 자동차 차량 바이크 모터사이클', prompt: 'Keep the exact vehicle model, badges, paint, wheels, and body proportions. A measured light pass travels along the existing metal surface before a stable hero angle. Automotive campaign film, no changed model, no added logos, no unsafe driving scene.' },
  { id: 'artwork-motion-library', category: 'Custom', title: 'ART · QUIET MOTION', titleKo: '아트 · 콰이어트 모션', keywords: 'art illustration painting drawing webtoon artwork gallery illustration 일러스트 그림 작품 웹툰 전시', prompt: 'Use only artwork you own or are authorised to animate. Preserve the original line work, palette, composition, and signature. Add one restrained depth movement and a subtle environmental detail. Gallery-grade art motion, no style imitation, no new characters, no altered text.' },
  { id: 'memorial-return-library', category: 'Custom', title: 'MEMORIAL · GENTLE RETURN', titleKo: '메모리얼 · 젠틀 리턴', keywords: 'memorial old photo family pet dog cat vintage memory 메모리얼 옛사진 가족 반려동물 강아지 고양이', prompt: 'Preserve identity, era, clothing, and original framing. Begin completely still, then return a tiny blink, breath, and gentle gaze. Retain archival texture, no modern styling, no dramatic gesture.' },
  { id: 'classic-film-library', category: 'Custom', title: 'CLASSIC · FILM GATE', titleKo: '고전 · 필름 게이트', keywords: 'classic old hollywood black white film vintage actor 고전 흑백 필름 배우', prompt: 'Keep the original era, monochrome grain, clothing, and framing. As if a film gate opens, restore only a blink, breath, and slight eye movement. No modern restyle, no altered identity.' },
  { id: 'music-stage-library', category: 'Custom', title: 'MUSIC · STAGE PULSE', titleKo: '뮤직 · 스테이지 펄스', keywords: 'music dance stage performance singer concert 뮤직 댄스 무대 가수', prompt: 'Preserve identity and outfit silhouette. One precise performance accent reshapes the practical stage light for a beat, then resolves into a stable wide frame. Controlled movement, no violence, no extra limbs.' },
  { id: 'editorial-walk-library', category: 'Custom', title: 'PORTRAIT · EDITORIAL WALK', titleKo: '인물 · 에디토리얼 워크', keywords: 'portrait fashion editorial runway walk model 인물 패션 런웨이 모델', prompt: 'Keep the subject identity and wardrobe silhouette. A calm portrait becomes an editorial walk through one clean shoulder-level camera pass. Believable hair and fabric, no face distortion, no extra limbs.' }
]);

const guideState = { category: '', presetId: '', motionId: 'restrained' };

function isKoreanOrderUi() {
  return (localStorage.getItem('avvmLang') || 'ko') === 'ko';
}

function guidedText(item, key) {
  const korean = item[`${key}Ko`] || item[key] || '';
  const english = item[key] || korean;
  return isKoreanOrderUi() ? korean : (window.AVVM_I18N?.localize?.(korean, english) || english);
}

function getActiveCategory() {
  return $('.cat.active')?.dataset?.category || 'Beauty';
}

function getStylePresets(category = getActiveCategory()) {
  const presets = STYLE_GUIDES[category] || STYLE_GUIDES.Custom;
  if (category !== 'Design') return presets;
  const type = window.selectedPlan === 'Logo Lab' ? 'logo' : 'jewelry';
  return presets.filter((preset) => preset.designType === type);
}

function getGuidedPreset(category = getActiveCategory()) {
  const presets = getStylePresets(category);
  return presets.find((preset) => preset.id === guideState.presetId) || presets[0];
}

function getGuidedMotion() {
  return MOTION_GUIDES.find((motion) => motion.id === guideState.motionId) || MOTION_GUIDES[0];
}

function writeGuidedPrompt() {
  const input = $('#moodInput');
  const preset = getGuidedPreset();
  const motion = getGuidedMotion();
  if (input && preset && motion) input.value = `${preset.prompt} ${motion.prompt}`;
}

function renderPromptLibrary() {
  const library = $('#customPromptLibrary');
  const results = $('#promptLibraryResults');
  const search = $('#promptSearch');
  if (!library || !results) return;

  const customSelected = getActiveCategory() === 'Custom';
  library.hidden = !customSelected;
  if (!customSelected) return;

  const query = String(search?.value || '').trim().toLowerCase();
  const matched = query
    ? PROMPT_LIBRARY.filter((recipe) => [recipe.title, recipe.titleKo, recipe.category, recipe.keywords].join(' ').toLowerCase().includes(query)).slice(0, 6)
    : [
      ...PROMPT_LIBRARY.filter((recipe) => recipe.category === getActiveCategory()),
      ...PROMPT_LIBRARY.filter((recipe) => recipe.category !== getActiveCategory())
    ].slice(0, 6);
  const useLabel = tr('promptLibraryUse', '이 레시피 불러오기');
  const empty = tr('promptLibraryEmpty', '검색 결과가 없습니다. 원하는 장면을 직접 적어주세요.');

  results.innerHTML = matched.length
    ? matched.map((recipe) => `<article class="prompt-library-card"><span>${recipe.category.toUpperCase()}</span><b>${guidedText(recipe, 'title')}</b><button type="button" data-library-recipe="${recipe.id}">${useLabel} ↗</button></article>`).join('')
    : `<p class="prompt-library-empty">${empty}</p>`;
}

function renderGuidedStyleFlow({ writePrompt = false } = {}) {
  const category = getActiveCategory();
  const presets = getStylePresets(category);
  const presetRoot = $('#stylePresetOptions');
  const motionRoot = $('#motionOptions');
  const name = $('#selectedStyleName');
  const description = $('#selectedStyleDescription');
  if (!presetRoot || !motionRoot || !name || !description) return;

  const categoryChanged = guideState.category !== category;
  if (categoryChanged) {
    guideState.category = category;
    guideState.presetId = presets[0].id;
    guideState.motionId = 'restrained';
  }
  const preset = getGuidedPreset(category);
  const motion = getGuidedMotion();

  presetRoot.innerHTML = presets.map((item) => `<button class="guided-style-option${item.id === preset.id ? ' active' : ''}" type="button" data-style-preset="${item.id}"><b>${guidedText(item, 'title')}</b><span>${guidedText(item, 'description')}</span></button>`).join('');
  motionRoot.innerHTML = MOTION_GUIDES.map((item) => `<button class="guided-style-option guided-motion-option${item.id === motion.id ? ' active' : ''}" type="button" data-motion-style="${item.id}"><b>${guidedText(item, 'title')}</b><span>${guidedText(item, 'description')}</span></button>`).join('');
  name.textContent = guidedText(preset, 'title');
  description.textContent = `${guidedText(preset, 'description')} ${guidedText(motion, 'description')}`;

  if (categoryChanged || writePrompt) writeGuidedPrompt();
  renderPromptLibrary();
}

document.addEventListener('click', (event) => {
  const presetButton = event.target.closest('[data-style-preset]');
  if (presetButton) {
    guideState.presetId = presetButton.dataset.stylePreset;
    renderGuidedStyleFlow({ writePrompt: true });
    return;
  }
  const motionButton = event.target.closest('[data-motion-style]');
  if (motionButton) {
    guideState.motionId = motionButton.dataset.motionStyle;
    renderGuidedStyleFlow({ writePrompt: true });
    return;
  }
  const libraryButton = event.target.closest('[data-library-recipe]');
  if (libraryButton) {
    const recipe = PROMPT_LIBRARY.find((item) => item.id === libraryButton.dataset.libraryRecipe);
    if (!recipe) return;
    selectCategory(recipe.category);
    const input = $('#moodInput');
    if (input) input.value = recipe.prompt;
    toast(tr('promptLibraryLoaded', '연출 레시피를 불러왔습니다. 원하는 내용을 덧붙여주세요.'));
  }
});

$('#promptSearch')?.addEventListener('input', renderPromptLibrary);
document.addEventListener('avvm:languagechange', () => {
  renderGuidedStyleFlow();
  syncPlanOutput();
});
renderGuidedStyleFlow({ writePrompt: true });

function getDesignLabBrief(){
  if(!isDesignLabSelected()) return '';
  const mode=getDesignType();
  const word=String($('#logoWordInput')?.value || '').trim().slice(0,36);
  const preset=getGuidedPreset('Design');
  const style=preset?.title || 'DESIGN LAB';
  if(mode==='logo'){
    return `DESIGN LAB LOGO BRIEF: Create an original logo direction for the exact word "${word || 'brand supplied in sketch'}". Selected style: ${style}. Deliver an original mark and a clean motion-logo-ready composition. Do not imitate or recreate an existing trademark.`;
  }
  return `DESIGN LAB JEWELRY BRIEF: Use the supplied authorized sketch or product image as the exact source design. Selected style: ${style}. Preserve dimensions, material, setting, and silhouette before creating the macro motion treatment.`;
}

function createLogoWordmarkSource(word, styleId){
  const label=String(word || 'AVVM').trim().slice(0,36) || 'AVVM';
  const canvas=document.createElement('canvas');
  canvas.width=1536;
  canvas.height=1024;
  const ctx=canvas.getContext('2d');
  const palettes={
    'design-logo-minimal':['#f3f0e8','#111111','#d8f233'],
    'design-logo-symbolic':['#07131b','#effcff','#5be9ff'],
    'design-logo-classic':['#16110d','#f2e1b6','#b99042']
  };
  const [background,ink,accent]=palettes[styleId] || palettes['design-logo-minimal'];
  ctx.fillStyle=background;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle=accent;
  ctx.lineWidth=18;
  ctx.lineCap='round';

  if(styleId==='design-logo-symbolic'){
    ctx.beginPath(); ctx.arc(768,300,125,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(660,300); ctx.lineTo(768,188); ctx.lineTo(876,300); ctx.lineTo(768,412); ctx.closePath(); ctx.stroke();
  }else if(styleId==='design-logo-classic'){
    ctx.beginPath(); ctx.arc(768,306,136,Math.PI*.08,Math.PI*.92); ctx.stroke();
    ctx.beginPath(); ctx.arc(768,306,136,Math.PI*1.08,Math.PI*1.92); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(704,306); ctx.lineTo(768,232); ctx.lineTo(832,306); ctx.lineTo(768,380); ctx.closePath(); ctx.stroke();
  }else{
    ctx.beginPath(); ctx.moveTo(647,414); ctx.lineTo(768,190); ctx.lineTo(889,414); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(689,340); ctx.lineTo(847,340); ctx.stroke();
  }

  let size=152;
  ctx.font=`800 ${size}px Inter, Arial, sans-serif`;
  while(ctx.measureText(label).width>1240 && size>54){ size-=4; ctx.font=`800 ${size}px Inter, Arial, sans-serif`; }
  ctx.fillStyle=ink;
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText(label,768,640);
  ctx.fillStyle=accent;
  ctx.font='900 24px Inter, Arial, sans-serif';
  ctx.fillText('AVVM DESIGN LAB · ORIGINAL WORDMARK DIRECTION',768,765);
  return canvas.toDataURL('image/png');
}

function makeVideoPrompt(order){
  if(order.beforeAfter){
    const route=BEFORE_AFTER_ROUTES[order.beforeAfterType] || BEFORE_AFTER_ROUTES.beauty;
    const customerDirection=String(order.beforeAfterVideoDirection || '').trim().slice(0,1600);
    return `${route.prompt}${customerDirection ? ` ${customerDirection}` : ''} The supplied image is a split pair: begin within the left BEFORE source, use one precise optical wipe or match-cut, and resolve into the right AI AFTER concept. Keep the transition elegant, stable, and clearly visual rather than evidentiary. Never show the split layout, divider, captions, or new claims. Deliver a premium, short vertical or horizontal before/after reel based only on the supplied pair.`;
  }
  const direction=String(order.mood||'').trim();
  const category=String(order.category||'Custom');
  const fallback=`Create a polished ${category} image-to-video film. Preserve the source subject, its identity, proportions, product labels, and composition. Use a clear first-second visual hook, controlled cinematic camera movement, realistic light, and a premium final grade. No face distortion, no extra limbs, no unreadable text, no invented logos.`;
  return `${direction || fallback} Source brand or owner: ${String(order.brand||'AVVM')}. Keep the result photorealistic, stable, and production-ready.`;
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
function updateProductionTracker(stage, progress, message){
  const tracker=$('#videoProgressContainer');
  if(!tracker) return;
  const stages=['source','queue','render','review'];
  const stageIndex={source:0,queue:1,render:2,review:3,done:4,attention:-1}[stage] ?? 0;
  tracker.dataset.stage=stage;
  tracker.querySelectorAll('[data-production-step]').forEach((step,index)=>{
    step.classList.toggle('is-active',stageIndex>=0 && index===Math.min(stageIndex,3));
    step.classList.toggle('is-complete',stageIndex>index || stage==='done');
  });
  const fill=tracker.querySelector('#videoProgressBar');
  if(fill) fill.style.width=`${Math.max(6,Math.min(100,progress||0))}%`;
  const label=tracker.querySelector('#videoProgressLabel');
  if(label && message) label.textContent=message;
  const status=tracker.querySelector('#videoProgressStatus');
  if(status) status.textContent=stage==='done'?'DELIVERED':stage==='attention'?'ACTION NEEDED':stage==='render'?'RENDERING':stage==='queue'?'IN QUEUE':'SOURCE SECURED';
}

async function proceedWithOrderCreation(orderId, brand, email, phone, privacyConsent, notifyConsent, refundConsent, rightsConsent, marketingConsent, category, mood, paymentResponse, totalAmount, imageData, designMeta = {}) {
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
    <div class="production-tracker-head">
      <span>LIVE PRODUCTION TRACKER</span>
      <b id="videoProgressStatus">SOURCE SECURED</b>
    </div>
    <div class="production-tracker-line"><i id="videoProgressBar"></i></div>
    <div class="production-tracker-steps" aria-label="Production progress">
      <span data-production-step="source">SOURCE</span>
      <span data-production-step="queue">QUEUE</span>
      <span data-production-step="render">RENDER</span>
      <span data-production-step="review">REVIEW</span>
    </div>
    <div id="videoProgressLabel" class="production-tracker-copy">${tr('uploadingImage', '원본을 안전하게 전송하고 있습니다.')}</div>
  `;
  updateProductionTracker('source',10,tr('uploadingImage', '원본을 안전하게 전송하고 있습니다.'));

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
    designMode:designMeta.designMode || '',
    logoWord:designMeta.logoWord || '',
    beforeAfter:!!designMeta.beforeAfter,
    beforeAfterType:designMeta.beforeAfterType || '',
    beforeAfterVideoDirection:designMeta.beforeAfterVideoDirection || '',
    beforeImageName:designMeta.beforeImageName || '',
    afterImageName:designMeta.afterImageName || '',
    duration: videoOptions.duration,
    aspectRatio: videoOptions.aspectRatio,
    resolution: videoOptions.resolution,
    idSpec:(document.getElementById("idSpec")?.value || ""),
    imageName: imgFile ? imgFile.name : (designMeta.syntheticSource ? 'avvm-logo-wordmark.png' : 'no_image'),
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
    updateProductionTracker('queue',22,tr('statusQueued', 'AI 제작 대기열에 연결되었습니다.'));
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
  button.textContent=busy ? (busyLabel || tr('paymentOpening', '결제창을 여는 중...')) : tr('testPayment', '테스트 결제하기');
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
  const category=$('.cat.active')?.dataset?.category || 'Custom';
  const beforeAfter=isBeforeAfterPlan();
  const beforeAfterType=beforeAfter ? (window.avvmBeforeAfterType || 'beauty') : '';
  const designMode=category==='Design' ? getDesignType() : '';
  const logoWord=category==='Design' ? String($('#logoWordInput')?.value || '').trim().slice(0,36) : '';
  const baseMood=$('#moodInput')?.value?.trim() || '';
  const designBrief=getDesignLabBrief();
  const mood=[baseMood,designBrief].filter(Boolean).join(' ');

  if(!brand){toast('성함 / 브랜드명을 입력해주세요'); focusCustomerField('#brandInput','#brandInput2'); return;}
  if(email && !email.includes('@')){toast('이메일 형식을 확인해주세요'); focusCustomerField('#emailInput','#emailInput2'); return;}
  if(!phone){toast('카톡/문자 알림용 휴대폰 번호를 입력해주세요'); focusCustomerField('#phoneInput','#phoneInput2'); return;}
  if(!privacyConsent || !notifyConsent || !refundConsent || !rightsConsent){toast('필수 동의 항목을 확인해주세요'); focusAndReveal('#consentGroup'); return;}
  if(window.selectedPlan === 'Custom' || String(window.prices[window.selectedPlan]||'').includes('상담')){
    toast(tr('planContact', 'Custom 플랜은 상담 후 견적으로 진행됩니다.'));
    return;
  }

  const imageFile = $('#imageInput')?.files?.[0];
  const generatedAfterImageUrl = window.avvmGeneratedAfterImageUrl || '';
  const createTextLogo=category==='Design' && designMode==='logo' && !imageFile;
  if(createTextLogo && !logoWord){
    toast('로고에 넣을 단어 또는 브랜드명을 입력해주세요.');
    focusAndReveal('#logoWordInput');
    return;
  }
  if(!createTextLogo){
    try {
      validateImageFile(imageFile);
      if(beforeAfter && !generatedAfterImageUrl) throw new Error(tr('baAfterNeeded','전환 영상을 만들기 전 AI AFTER 시안을 먼저 만들어 주세요.'));
    } catch(error) {
      toast(error.message);
      focusAndReveal(beforeAfter && !generatedAfterImageUrl ? '#beforeAfterUploadGroup' : '#photoUploadVisibleBlock');
      return;
    }
  }

  const orderId=makeOrderId();
  const totalAmount=getNumericPrice(window.selectedPlan);
  if(!Number.isFinite(totalAmount) || totalAmount < 100){
    toast(tr('amountError', '결제 금액을 확인할 수 없습니다.'));
    return;
  }

  paymentInProgress=true;
  setPaymentButtonBusy(true, beforeAfter ? tr('baComposing','전·후 사진 정리 중...') : tr('optimizingImage', '사진 최적화 중...'));

  try{
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const imageData = beforeAfter
      ? await composeBeforeAfterSource(imageFile, generatedAfterImageUrl, beforeAfterType)
      : imageFile
        ? await compressImage(imageFile, isMobile ? 768 : 1024, isMobile ? 768 : 1024)
        : createLogoWordmarkSource(logoWord, guideState.presetId);
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
      category, mood, response, totalAmount, imageData, {
        designMode, logoWord, syntheticSource:createTextLogo,
        beforeAfter, beforeAfterType,
        beforeAfterVideoDirection:beforeAfter ? window.avvmBeforeAfterVideoDirection : '',
        beforeImageName:imageFile?.name || '', afterImageName:beforeAfter ? 'AI AFTER concept' : ''
      }
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
  updateProductionTracker('attention',0,'The production request needs attention. You can retry safely.');
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
  updateProductionTracker('done',100,tr('statusCompleted', '영상 제작 완료!'));

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
        const message=`${tr('statusQueued', '대기열 진입 중')} (${statusData.queue_position || 1})`;
        if (bar) bar.style.width = '15%';
        if (label) label.textContent = message;
        updateProductionTracker('queue',15,message);
      } else if (status === 'IN_PROGRESS') {
        const pct = Math.max(20, Math.min(95, Math.round((statusData.progress || 0) * 100)));
        const message=`${tr('statusProcessing', '영상 프레임 렌더링 중...')} ${pct}%`;
        if (bar) bar.style.width = `${pct}%`;
        if (label) label.textContent = message;
        updateProductionTracker('render',pct,message);
      } else if (status === 'COMPLETED') {
        clearInterval(interval);
        if (bar) bar.style.width = '100%';
        if (label) label.textContent = tr('statusCompleted', '영상 제작 완료!');
        updateProductionTracker('review',96,tr('statusCompleted', '렌더링이 완료되어 최종 전달본을 준비합니다.'));
        
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
    clearSourceIntelligence();
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

/* Every sample starts itself, loops silently, and has no native playback UI.
   Samples are activated just before they enter the viewport, so mobile devices
   do not download every film at once. Once started, each one keeps its place
   and resumes after an iOS/browser pause. */
(function(){
  const selector = [
    '.ba-output-video',
    '.proof-video',
    '.sample-card > video',
    '.portfolio-card > video',
    '.memorial-ba-video-wrapper video',
    '.web-studio-logo-motion video',
    '.web-studio-film video'
  ].join(',');
  const videos = Array.from(document.querySelectorAll(selector));
  if (!videos.length) return;

  const started = new Set();
  const play = (video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.controls = false;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.removeAttribute('controls');
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
  };

  videos.forEach((video) => {
    video.addEventListener('canplay', () => {
      if (started.has(video) && !document.hidden) play(video);
    });
    video.addEventListener('pause', () => {
      if (started.has(video) && !document.hidden) window.setTimeout(() => play(video), 120);
    });
    video.addEventListener('ended', () => play(video));
  });

  const activate = (video) => {
    started.add(video);
    if (!document.hidden) play(video);
  };

  if (!('IntersectionObserver' in window)) {
    videos.forEach(activate);
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activate(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '320px 0px', threshold: 0.01 });
    videos.forEach((video) => observer.observe(video));
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) started.forEach(play);
  });
})();

/* The sketch/photo proof uses a native range input so it is draggable by mouse,
   trackpad, keyboard, and touch without a fragile custom pointer handler. */
(function(){
  document.querySelectorAll('[data-jewelry-compare]').forEach((compare)=>{
    const control=compare.querySelector('.jewelry-compare-control');
    if(!control) return;
    const setSplit=(value)=>{
      const safe=Math.max(0,Math.min(100,Number(value)||0));
      compare.style.setProperty('--jewelry-split',`${safe}%`);
      control.setAttribute('aria-valuetext',`${safe}% sketch, ${100-safe}% photo`);
    };
    setSplit(control.value);
    control.addEventListener('input',()=>setSplit(control.value));
  });
})();

/* Keep only the two selected showcase samples moving as they enter view. */
(function(){
  const videos=Array.from(document.querySelectorAll('[data-main-motion]'));
  if(!videos.length) return;
  const visible=new WeakMap();
  const resume=(video)=>{
    if(document.hidden || visible.get(video)===false) return;
    video.muted=true;
    video.defaultMuted=true;
    video.loop=true;
    video.autoplay=true;
    video.playsInline=true;
    video.setAttribute('muted','');
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    const attempt=video.play();
    if(attempt && typeof attempt.catch==='function') attempt.catch(()=>{});
  };
  const observe=(video)=>{
    video.addEventListener('canplay',()=>resume(video));
    video.addEventListener('loadeddata',()=>resume(video));
    video.addEventListener('pause',()=>{
      if(!document.hidden && visible.get(video)) window.setTimeout(()=>resume(video),120);
    });
    video.addEventListener('ended',()=>resume(video));
  };
  videos.forEach(observe);
  if(!('IntersectionObserver' in window)){
    videos.forEach((video)=>{visible.set(video,true);resume(video);});
    return;
  }
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      visible.set(entry.target,entry.isIntersecting);
      if(entry.isIntersecting) resume(entry.target);
    });
  },{rootMargin:'240px 0px',threshold:.05});
  videos.forEach((video)=>observer.observe(video));
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden) videos.forEach((video)=>{if(visible.get(video)) resume(video);});
  });
})();

/* The classic-restoration proof is a key comparison: play it eagerly instead
   of depending on its scroll observer, which some mobile browsers can pause
   after rendering the matching poster frame. */
(function(){
  const video=document.querySelector('#proof-classic-restoration .proof-video');
  if(!video) return;
  const resume=()=>{
    if(document.hidden) return;
    video.muted=true;
    video.defaultMuted=true;
    video.loop=true;
    video.autoplay=true;
    video.playsInline=true;
    video.setAttribute('muted','');
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    const attempt=video.play();
    if(attempt && typeof attempt.catch==='function') attempt.catch(()=>{});
  };
  ['loadedmetadata','loadeddata','canplay','canplaythrough'].forEach((event)=>{
    video.addEventListener(event,resume,{once:false});
  });
  video.addEventListener('pause',()=>{
    if(!document.hidden) window.setTimeout(resume,80);
  });
  video.addEventListener('ended',resume);
  window.addEventListener('pageshow',resume);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden) resume();});
  resume();
  window.setTimeout(resume,300);
  window.setTimeout(resume,1200);
})();
