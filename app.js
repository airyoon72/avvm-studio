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
  'Profile Pro': { resolution: '1080p', label: 'FILE DELIVERY' }
});
window.AVVM_PLAN_OUTPUTS = PLAN_OUTPUTS;

function getPlanOutput(plan = window.selectedPlan) {
  return PLAN_OUTPUTS[String(plan)] || PLAN_OUTPUTS.Pro;
}

function syncPlanOutput(plan = window.selectedPlan) {
  const output = getPlanOutput(plan);
  const hidden = $('#resolution');
  const value = $('#resolutionIncludedValue');
  const planLabel = $('#resolutionIncludedPlan');
  const helper = $('#resolutionHelper');
  const korean = (localStorage.getItem('avvmLang') || 'ko') === 'ko';

  if (hidden) hidden.value = output.resolution;
  if (value) value.textContent = output.label;
  if (planLabel) {
    planLabel.textContent = String(plan) === 'Custom'
      ? (korean ? '상담 후 납품 사양 확정' : 'Delivery specification confirmed after consultation')
      : (korean ? `${plan} 플랜에 포함` : `Included with ${plan}`);
  }
  if (helper) {
    helper.textContent = String(plan) === 'Custom'
      ? (korean ? '추가 장면·특수 연출·제작 범위는 상담 견적으로 확정합니다.' : 'Extra scenes, special direction, and the production scope are confirmed by custom quote.')
      : (korean ? '해상도는 플랜에 포함되어 있으며, 원본 사진 품질에 따라 최종 검수 시 안내드립니다.' : 'Delivery quality is included with your plan; final guidance depends on the source-photo review.');
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
  updatePhotoUploadLabel();
  inspectSourceImage($('#imageInput')?.files?.[0]);
}

if($('#imageInput')){
  $('#imageInput').addEventListener('change', handleSourceImageChange);
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
  syncPlanOutput(plan);
  
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
  updatePreflightOutput();

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
  renderGuidedStyleFlow();
  updatePreflightOutput();
}

$$('[data-open]').forEach(b=>b.addEventListener('click',()=>{
  selectCategory(b.dataset.category);
  openOrder(b.dataset.plan);
}));

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
  openOrder(choice.getAttribute('data-plan-choice'));
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
  { id: 'watch-orbit', category: 'Product', title: 'WATCH · DIAL ORBIT', titleKo: '시계 · 다이얼 오빗', keywords: 'watch timepiece dial jewelry steel orbit 시계 주얼리 다이얼', prompt: 'Keep the exact watch, dial markers, crown, bracelet, brand mark, and proportions. A slow orbital camera catches a single travelling reflection across the crystal, then settles into a clean hero frame. Luxury product film, no altered numerals, no invented logos.' },
  { id: 'jewelry-light', category: 'Product', title: 'JEWELRY · PRISM LIGHT', titleKo: '주얼리 · 프리즘 라이트', keywords: 'jewelry ring necklace gold diamond prism 주얼리 반지 목걸이 다이아', prompt: 'Preserve the exact jewelry design, stones, setting, and material. A narrow prism of light travels through the piece while the camera makes one precise macro move. High-end jewellery campaign, no changed gem cuts, no extra items.' },
  { id: 'beauty-liquid-library', category: 'Beauty', title: 'BEAUTY · LIQUID LIGHT', titleKo: '뷰티 · 리퀴드 라이트', keywords: 'beauty skincare serum cosmetic liquid glass skin 뷰티 스킨케어 세럼 화장품', prompt: 'Keep the exact beauty product, cap, label, and colour. A controlled liquid-light reflection travels across the unchanged package, then resolves in clean macro focus. Premium skincare campaign, no package changes, no unreadable text.' },
  { id: 'food-steam-library', category: 'Food', title: 'FOOD · HEAT DETAIL', titleKo: '푸드 · 히트 디테일', keywords: 'food restaurant dish steam dessert cafe menu 푸드 음식 레스토랑 디저트 카페', prompt: 'Preserve the exact dish, plating, and ingredients. Start with one appetising heat detail—steam, crisp surface, or bubbles—then reveal the unchanged plate in warm natural light. No melting food, no added ingredients, no extra hands.' },
  { id: 'travel-portal-library', category: 'Travel', title: 'TRAVEL · ONE-TAKE ARRIVAL', titleKo: '여행 · 원테이크 도착', keywords: 'travel paris tokyo beach city holiday portal 여행 파리 도쿄 바다 도시', prompt: 'Keep the person recognisable, with stable proportions and clothing silhouette. A single natural edge-of-frame move continues into a new destination with believable location light. No portal graphics, no sudden face or body changes.' },
  { id: 'wedding-veil-library', category: 'Wedding', title: 'WEDDING · VEIL LIGHT', titleKo: '웨딩 · 베일 라이트', keywords: 'wedding bride groom veil ceremony garden 웨딩 신부 신랑 베일', prompt: 'Preserve the couple, wardrobe, and venue. A soft passing veil of light reveals a held expression and believable fabric movement. Quiet wedding film, no changed faces, no invented guests.' },
  { id: 'editorial-walk-library', category: 'Custom', title: 'PORTRAIT · EDITORIAL WALK', titleKo: '인물 · 에디토리얼 워크', keywords: 'portrait fashion editorial runway walk model 인물 패션 런웨이 모델', prompt: 'Keep the subject identity and wardrobe silhouette. A calm portrait becomes an editorial walk through one clean shoulder-level camera pass. Believable hair and fabric, no face distortion, no extra limbs.' },
  { id: 'memorial-return-library', category: 'Custom', title: 'MEMORIAL · GENTLE RETURN', titleKo: '메모리얼 · 젠틀 리턴', keywords: 'memorial old photo family pet dog cat vintage memory 메모리얼 옛사진 가족 반려동물 강아지 고양이', prompt: 'Preserve identity, era, clothing, and original framing. Begin completely still, then return a tiny blink, breath, and gentle gaze. Retain archival texture, no modern styling, no dramatic gesture.' },
  { id: 'music-stage-library', category: 'Custom', title: 'MUSIC · STAGE PULSE', titleKo: '뮤직 · 스테이지 펄스', keywords: 'music dance stage performance singer concert 뮤직 댄스 무대 가수', prompt: 'Preserve identity and outfit silhouette. One precise performance accent reshapes the practical stage light for a beat, then resolves into a stable wide frame. Controlled movement, no violence, no extra limbs.' },
  { id: 'classic-film-library', category: 'Custom', title: 'CLASSIC · FILM GATE', titleKo: '고전 · 필름 게이트', keywords: 'classic old hollywood black white film vintage actor 고전 흑백 필름 배우', prompt: 'Keep the original era, monochrome grain, clothing, and framing. As if a film gate opens, restore only a natural blink, breath, and slight eye movement. No modern restyle, no altered identity.' }
]);

const guideState = { category: '', presetId: '', motionId: 'restrained' };

function isKoreanOrderUi() {
  return (localStorage.getItem('avvmLang') || 'ko') === 'ko';
}

function guidedText(item, key) {
  return isKoreanOrderUi() ? (item[`${key}Ko`] || item[key]) : item[key];
}

function getActiveCategory() {
  return $('.cat.active')?.dataset?.category || 'Beauty';
}

function getGuidedPreset(category = getActiveCategory()) {
  const presets = STYLE_GUIDES[category] || STYLE_GUIDES.Custom;
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
  const matched = PROMPT_LIBRARY.filter((recipe) => {
    if (!query) return true;
    return [recipe.title, recipe.titleKo, recipe.category, recipe.keywords].join(' ').toLowerCase().includes(query);
  }).slice(0, 6);
  const useLabel = isKoreanOrderUi() ? '이 레시피 불러오기' : 'USE THIS RECIPE';
  const empty = isKoreanOrderUi() ? '검색 결과가 없습니다. 원하는 장면을 직접 적어주세요.' : 'No recipe matched. Describe the scene in your own words.';

  results.innerHTML = matched.length
    ? matched.map((recipe) => `<article class="prompt-library-card"><span>${recipe.category.toUpperCase()}</span><b>${guidedText(recipe, 'title')}</b><button type="button" data-library-recipe="${recipe.id}">${useLabel} ↗</button></article>`).join('')
    : `<p class="prompt-library-empty">${empty}</p>`;
}

function renderGuidedStyleFlow({ writePrompt = false } = {}) {
  const category = getActiveCategory();
  const presets = STYLE_GUIDES[category] || STYLE_GUIDES.Custom;
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
    toast(isKoreanOrderUi() ? '연출 레시피를 불러왔습니다. 원하는 내용을 덧붙여주세요.' : 'Recipe loaded. Add any detail you want.');
  }
});

$('#promptSearch')?.addEventListener('input', renderPromptLibrary);
document.addEventListener('avvm:languagechange', () => {
  renderGuidedStyleFlow();
  syncPlanOutput();
});
renderGuidedStyleFlow({ writePrompt: true });

function makeVideoPrompt(order){
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
  button.textContent=busy ? (busyLabel || tr('paymentOpening', '결제창을 여는 중...')) : (window.AVVM_I18N?.language !== 'ko' ? 'TEST PAYMENT' : '테스트 결제하기');
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
