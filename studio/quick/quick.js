/* AVVM Shorts Studio: local consumer-flow prototype. No external AI, payment, or render calls. */
(function () {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
  const STORE = 'avvmShortsStudioDemo.v1';
  const defaults = { step: 1, industry: 'shopping', productName: '우리 가게의 신제품', benefit: '', audience: 'nearby', format: 'ugc', length: 15, images: [], selectedHook: 0, previewPlaying: false };
  let state = hydrate();
  let toastTimer = null;

  const content = {
    shopping: { label: '상품', seed: '한 번 보면 장바구니에 담고 싶은', tags: ['#신상추천', '#스마트스토어', '#오늘의발견'] },
    food: { label: '메뉴', seed: '오늘의 입맛을 바로 움직이는', tags: ['#동네맛집', '#신메뉴', '#카페추천'] },
    beauty: { label: '뷰티', seed: '내일의 루틴을 바꾸는', tags: ['#뷰티추천', '#데일리루틴', '#셀프케어'] },
    service: { label: '서비스', seed: '시간을 아껴주는', tags: ['#예약', '#우리동네', '#전문서비스'] },
    space: { label: '공간', seed: '오늘 머물고 싶은', tags: ['#숙소추천', '#공간기록', '#주말여행'] }
  };
  const formats = {
    ugc: { label: 'UGC 후기형', prefix: '이거, 왜 이제 알았지?', structure: ['처음 본 순간의 호기심', '직접 써 본 한 줄의 변화', '가볍고 분명한 추천'] },
    problem: { label: '문제 해결형', prefix: '아직도 이 불편함, 그냥 참고 있나요?', structure: ['익숙한 불편을 먼저 제시', '해결의 핵심 장면', '바로 시도할 이유'] },
    comparison: { label: '비교형', prefix: '전과 후, 차이는 생각보다 큽니다.', structure: ['기존 상태를 짧게 대비', '바뀐 선택의 디테일', '결과를 남기는 CTA'] }
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function hydrate() { try { const saved = JSON.parse(localStorage.getItem(STORE)); return { ...clone(defaults), ...(saved || {}), images: [] }; } catch (_) { return clone(defaults); } }
  function persist() { const serializable = { ...state, images: [] }; try { localStorage.setItem(STORE, JSON.stringify(serializable)); } catch (_) {} }
  function escapeHtml(value) { return String(value || '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]); }
  function toast(message) { const item = $('#quickToast'); item.textContent = message; item.classList.add('is-on'); clearTimeout(toastTimer); toastTimer = setTimeout(() => item.classList.remove('is-on'), 2600); }
  function safeName() { return state.productName.trim() || '우리 가게의 신제품'; }
  function objectName() {
    const name = safeName();
    const last = name.trim().slice(-1);
    const code = last.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) return name;
    return `${name}${(code - 0xac00) % 28 === 0 ? '를' : '을'}`;
  }
  function safeBenefit() { return state.benefit.trim() || '한 번 경험하면 다시 찾게 되는 작은 차이를 전합니다.'; }
  function currentMeta() { return content[state.industry] || content.shopping; }
  function currentFormat() { return formats[state.format] || formats.ugc; }
  function durationParts() { return state.length === 25 ? [['0–03초','첫 3초 훅'],['03–09초','제품·메뉴의 존재감'],['09–17초','장점과 사용 장면'],['17–22초','신뢰를 만드는 한 줄'],['22–25초','CTA']] : [['0–03초','첫 3초 훅'],['03–08초','제품·메뉴의 존재감'],['08–12초','장점과 사용 장면'],['12–15초','CTA']]; }
  function hooks() { const product = safeName(); const benefit = safeBenefit(); const meta = currentMeta(); const format = currentFormat(); return [
    { title: `${format.prefix}`, detail: `${objectName()} 처음 보는 고객의 시선을 잡는 시작입니다.` },
    { title: `${meta.seed} ${product}.`, detail: benefit },
    { title: `오늘, ${objectName()} 선택할 이유.`, detail: '가장 중요한 장점만 짧고 선명하게 보여 주세요.' }
  ]; }
  function scriptText() { const product = safeName(); const benefit = safeBenefit(); const format = currentFormat(); const parts = durationParts(); return parts.map((part, index) => {
    const lines = [format.prefix, `${product}, ${benefit}`, '보이는 순간 이해되는 작은 차이.', `지금 ${objectName()} 만나보세요.`, '오늘의 선택을 더 특별하게.'];
    return `[${part[0]}] ${part[1]}\n${lines[index] || lines[lines.length - 1]}`;
  }).join('\n\n'); }
  function ctaText() { return `오늘의 ${currentMeta().label}, ${objectName()} 만나보세요.`; }
  function captionText() { return `${safeName()}\n${safeBenefit()}\n\n${ctaText()}\n\n${currentMeta().tags.join(' ')}`; }
  function plan() { const structure = currentFormat().structure; return { schema:'avvm-shorts-planning-pack/v0.1', mode:'local-demo', createdAt:new Date().toISOString(), input:{ industry:state.industry, productName:safeName(), benefit:safeBenefit(), audience:state.audience, format:state.format, length:state.length, imageCount:state.images.length }, output:{ hooks:hooks(), storyboard:durationParts().map((part,index) => ({ time:part[0], scene:part[1], direction:structure[index] || structure[structure.length - 1] })), script:scriptText(), cta:ctaText(), caption:captionText(), ratio:'9:16' }, adapters:{ copy:'Gemini or equivalent server adapter', video:'Higgsfield server adapter', tts:'TTS server adapter', render:'Remotion/server renderer', billing:'payment/credit server adapter' } }; }
  function dataUrl(file) { return new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result || '')); reader.onerror = () => resolve(''); reader.readAsDataURL(file); }); }
  function renderPhotos() { const list = $('#photoList'); list.innerHTML = state.images.map((item,index) => `<div class="photo-thumb"><img src="${escapeHtml(item.url)}" alt="선택한 사진 ${index + 1}" /><span>${index + 1}</span></div>`).join(''); $('#photoHint').textContent = state.images.length ? `${state.images.length}장 선택됨 · 이 사진은 현재 탭의 미리보기에서만 사용됩니다.` : '아직 사진이 없습니다. 사진 없이도 기획안은 만들 수 있지만, 화면 미리보기는 그래픽 데모로 표시됩니다.'; }
  function renderSelection() { $$('.industry-card').forEach((button) => { const selected = button.dataset.industry === state.industry; button.classList.toggle('is-selected', selected); button.setAttribute('aria-pressed', String(selected)); }); $$('.format-card').forEach((button) => { const selected = button.dataset.format === state.format; button.classList.toggle('is-selected', selected); button.setAttribute('aria-pressed', String(selected)); }); $$('.duration-button').forEach((button) => { const selected = Number(button.dataset.length) === state.length; button.classList.toggle('is-selected', selected); button.setAttribute('aria-pressed', String(selected)); }); }
  function renderProgress() { $$('.progress-list li').forEach((item) => { const selected = Number(item.dataset.progress) === state.step; item.classList.toggle('is-active', selected); if (selected) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); }); }
  function showStep(step) { state.step = step; $$('.quick-step').forEach((item) => { const active = Number(item.dataset.step) === step; item.hidden = !active; item.classList.toggle('is-active', active); }); renderProgress(); if (step === 4) renderResult(); persist(); window.scrollTo({ top: 0, behavior:'smooth' }); }
  function renderResult() { const hookItems = hooks(); const structure = currentFormat().structure; $('#hookList').innerHTML = hookItems.map((hook,index) => `<button class="hook-choice ${state.selectedHook === index ? 'is-selected' : ''}" type="button" data-hook="${index}"><b>${escapeHtml(hook.title)}</b><small>${escapeHtml(hook.detail)}</small></button>`).join(''); $('#storyLength').textContent = `${state.length} SEC`; $('#storyboardList').innerHTML = durationParts().map((part,index) => `<li><b>${String(index + 1).padStart(2,'0')}</b><div><strong>${escapeHtml(part[0])} · ${escapeHtml(part[1])}</strong><span>${escapeHtml(structure[index] || structure[structure.length - 1])}</span></div></li>`).join(''); $('#quickScript').textContent = scriptText(); $('#quickCta').textContent = ctaText(); $('#quickCaption').textContent = captionText();
    const selected = hookItems[state.selectedHook] || hookItems[0]; $('#adEyebrow').textContent = `${currentMeta().label.toUpperCase()} / ${currentFormat().label.toUpperCase()}`; $('#adHeadline').innerHTML = escapeHtml(selected.title).replace(/\s+/g,'<br />'); $('#adSubline').textContent = selected.detail;
    const image = $('#adImage'); image.innerHTML = state.images[0] ? `<img src="${escapeHtml(state.images[0].url)}" alt="${escapeHtml(safeName())} 미리보기" />` : `<span>${escapeHtml(safeName()).slice(0,16).replace(/\s+/g,'<br />')}</span>`; image.style.borderColor = 'rgba(216,242,51,.45)'; $('#adPreview').classList.toggle('is-playing', !!state.previewPlaying); $('#playPreviewBtn').textContent = state.previewPlaying ? '❚❚' : '▶';
  }
  function readInputs() { state.productName = $('#quickProductName').value.trim(); state.benefit = $('#quickBenefit').value.trim(); state.audience = $('#quickAudience').value; persist(); }
  function copy(value, success) { if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(value).then(() => toast(success)).catch(() => fallbackCopy(value, success)); return; } fallbackCopy(value, success); }
  function fallbackCopy(value, success) { const area = document.createElement('textarea'); area.value = value; document.body.append(area); area.select(); document.execCommand('copy'); area.remove(); toast(success); }
  function downloadPlan() { const blob = new Blob([JSON.stringify(plan(), null, 2)], { type:'application/json' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'avvm-shorts-planning-pack.json'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); toast('무료 기획안 JSON을 저장했습니다.'); }
  async function handlePhotos(files) { const selected = Array.from(files || []).filter((file) => /^image\/(jpeg|png|webp)$/.test(file.type)).slice(0, 5); if (!selected.length) { toast('JPG, PNG, WEBP 이미지를 1~5장 선택해 주세요.'); return; } state.images = await Promise.all(selected.map(async (file) => ({ name:file.name, url:await dataUrl(file) }))); renderPhotos(); persist(); toast(`${state.images.length}장 사진을 로컬 미리보기에 추가했습니다.`); }
  function reset() { state = clone(defaults); $('#quickProductName').value = state.productName; $('#quickBenefit').value = state.benefit; $('#quickAudience').value = state.audience; $('#quickPhotos').value = ''; renderPhotos(); renderSelection(); showStep(1); toast('새 광고 기획을 시작합니다.'); }
  function bind() {
    $$('.industry-card').forEach((button) => button.addEventListener('click', () => { state.industry = button.dataset.industry; renderSelection(); persist(); }));
    $$('.format-card').forEach((button) => button.addEventListener('click', () => { state.format = button.dataset.format; renderSelection(); persist(); }));
    $$('.duration-button').forEach((button) => button.addEventListener('click', () => { state.length = Number(button.dataset.length); renderSelection(); persist(); }));
    $$('[data-next-step]').forEach((button) => button.addEventListener('click', () => { if (Number(button.dataset.nextStep) >= 3) readInputs(); showStep(Number(button.dataset.nextStep)); }));
    $$('[data-prev-step]').forEach((button) => button.addEventListener('click', () => showStep(Number(button.dataset.prevStep))));
    $('#quickPhotos').addEventListener('change', (event) => handlePhotos(event.target.files));
    $('#generateQuickBtn').addEventListener('click', () => { readInputs(); state.selectedHook = 0; state.previewPlaying = false; showStep(4); toast('무료 광고 기획안을 구성했습니다.'); });
    document.addEventListener('click', (event) => { const hook = event.target.closest('[data-hook]'); if (!hook) return; state.selectedHook = Number(hook.dataset.hook); renderResult(); persist(); });
    $('#playPreviewBtn').addEventListener('click', () => { state.previewPlaying = !state.previewPlaying; renderResult(); persist(); });
    $('#copyScriptBtn').addEventListener('click', () => copy(scriptText(), '자막·TTS 대본을 복사했습니다.'));
    $('#copyCaptionBtn').addEventListener('click', () => copy(captionText(), '게시용 캡션과 해시태그를 복사했습니다.'));
    $('#quickExportBtn').addEventListener('click', downloadPlan); $('#restartQuickBtn').addEventListener('click', reset);
    ['#quickProductName','#quickBenefit'].forEach((selector) => $(selector).addEventListener('input', readInputs));
    $('#quickAudience').addEventListener('change', readInputs);
  }
  function init() { $('#quickProductName').value = state.productName; $('#quickBenefit').value = state.benefit; $('#quickAudience').value = state.audience; renderPhotos(); renderSelection(); bind(); showStep(state.step || 1); }
  init();
}());
