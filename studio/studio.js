/*
 * AVVM AI DESIGN STUDIO — independent static MVP
 * This module does not call production AVVM endpoints and does not transmit files.
 */
(function () {
  'use strict';

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));
  const STORAGE_KEY = 'avvmStudioPrototypeState.v1';
  const VERSION_KEY = 'avvmStudioPrototypeVersions.v1';
  const demoImage = '../sample-product-input-v2.png';
  const demoSrt = `1
00:00:00,000 --> 00:00:03,200
한 번의 요청으로 브랜드의 모든 에셋을 만듭니다.

2
00:00:03,200 --> 00:00:07,800
제품 사진 한 장, 핵심 장점 세 가지.

3
00:00:07,800 --> 00:00:12,500
랜딩페이지와 9대16 광고 영상이 동시에 시작됩니다.

4
00:00:12,500 --> 00:00:17,000
전환율을 높이는 CTA는 첫 3초 안에 보여 주세요.

5
00:00:17,000 --> 00:00:22,200
비포와 애프터, 차이를 한눈에 전달합니다.

6
00:00:22,200 --> 00:00:27,400
브랜드 색상과 자막 안전영역은 모든 화면에 적용됩니다.

7
00:00:27,400 --> 00:00:30,000
지금 AVVM 캠페인을 시작하세요.`;

  const templateData = [
    { id: 'product-launch', title: 'Product Launch', group: 'campaign', text: '신제품을 한 장면으로 각인시키는 런칭 팩', color: '#d8f233' },
    { id: 'cinematic-short', title: 'Cinematic Short', group: 'motion', text: '첫 3초의 시선을 설계하는 세로형 쇼트', color: '#9f8cff' },
    { id: 'before-after', title: 'Before & After', group: 'motion', text: '변화를 믿게 만드는 비교형 시퀀스', color: '#79dfff' },
    { id: 'brand-film', title: 'Brand Film', group: 'motion', text: '브랜드의 태도와 결을 남기는 필름', color: '#f0c47a' },
    { id: 'social-ad', title: 'Social Ad', group: 'campaign', text: '스크롤을 멈추게 하는 1:1 소셜 광고', color: '#ff847e' },
    { id: 'landing-page', title: 'Landing Page', group: 'campaign', text: '전환 흐름을 갖춘 상품 페이지 구조', color: '#d8f233' },
    { id: 'email-campaign', title: 'Email Campaign', group: 'business', text: '브랜드 목소리를 유지하는 뉴스레터', color: '#88c5ff' },
    { id: 'pitch-deck', title: 'Pitch Deck', group: 'business', text: '한 번에 이해되는 설득의 프레젠테이션', color: '#b3a3ff' },
    { id: 'invoice', title: 'Invoice', group: 'business', text: '브랜드가 이어지는 거래 문서', color: '#e0e0e0' },
    { id: 'logo-reveal', title: 'Logo Reveal', group: 'motion', text: '한 장의 로고를 움직이는 기억으로', color: '#d8f233' }
  ];

  const defaultState = {
    project: { name: 'AVVM / Brand launch', updatedAt: new Date().toISOString() },
    brand: {
      name: 'AVVM / Core System',
      url: 'https://avvm.studio',
      sources: [
        { name: 'AVVM storefront / visual audit', type: 'SCREEN' },
        { name: 'AVVM wordmark / current brand', type: 'LOGO' },
        { name: 'campaign sample / product imagery', type: 'IMAGE' }
      ],
      tokens: {
        primary: '#d8f233', ink: '#040404', surface: '#151515', text: '#f3f3f3',
        display: 'Bebas Neue', body: 'Inter', tracking: 1, grid: '12', spacing: 24,
        radius: 18, shadow: 'soft', voice: '정제된 · 자신감 있는 · 간결한', verticalSafe: '10', horizontalSafe: '6'
      }
    },
    campaign: {
      prompt: 'AVVM의 새 캠페인을 시작해 주세요. 사진 한 장에서 영상, 랜딩페이지, 소셜 광고와 이메일까지 같은 브랜드로 완성합니다.',
      image: demoImage,
      imageName: 'sample-product-input-v2.png',
      productName: 'NOCTURNE OBJECT 01', price: '₩89,000',
      benefits: '빛을 흡수하고, 가장 필요한 순간에만 존재감을 드러내는 오브제.',
      audience: '감각적인 20–30대 선물 고객', objective: '신제품 인지도', mood: 'nocturne',
      cta: '당신의 밤을 선택하세요', ratio: '9:16', canvas: 'landing', intensity: 55, density: 70,
      chat: [
        { role: 'assistant', text: 'AVVM Core System을 불러왔습니다. 제품 이미지 한 장에서 8개의 일관된 에셋을 구성할 준비가 됐습니다.' },
        { role: 'assistant', text: '첫 결과물은 “정지한 물성, 절제된 빛”이라는 방향으로 설정했습니다.' }
      ]
    },
    motion: { ratio: '9:16', srt: demoSrt, cues: [], currentTime: 0, selectedCueId: null, showSafe: false },
    logo: {
      name: 'NOVA CAFE', tagline: 'SLOW LIGHT, DAILY RITUAL', category: 'cafe',
      idea: '정제된 인상, 한 번에 기억되는 심볼, 낮과 밤 모두 선명한 브랜드.',
      type: 'wordmark', style: 'minimal', palette: 'system', direction: 'wordmark',
      referenceName: '', motionAddOn: false, motionPreview: false, basePrice: 19900, motionPrice: 9900
    }
  };

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function hydrateState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved !== 'object') return clone(defaultState);
      const next = clone(defaultState);
      next.project = { ...next.project, ...(saved.project || {}) };
      next.brand = { ...next.brand, ...(saved.brand || {}), tokens: { ...next.brand.tokens, ...((saved.brand || {}).tokens || {}) } };
      next.campaign = { ...next.campaign, ...(saved.campaign || {}), image: demoImage };
      next.motion = { ...next.motion, ...(saved.motion || {}), cues: Array.isArray(saved.motion && saved.motion.cues) ? saved.motion.cues : [] };
      next.logo = { ...next.logo, ...(saved.logo || {}), motionPreview: false };
      return next;
    } catch (_) { return clone(defaultState); }
  }

  const state = hydrateState();
  let motionPlayer = { playing: false, frame: null, lastFrame: null, duration: 30 };
  let toastTimer = null;
  let selectedTemplateFilter = 'all';

  /* Adapter boundary: replace the demo methods with authenticated providers later. */
  window.AVVMStudioAdapters = {
    mode: 'demo',
    async analyseBrand(input) {
      const primary = input.tokens.primary || '#d8f233';
      return {
        name: input.url && !input.url.includes('avvm.studio') ? 'Imported / Brand System' : 'AVVM / Core System',
        sources: input.sources,
        tokens: { ...input.tokens, primary },
        note: '로컬 입력값과 AVVM 기본 디자인 토큰을 사용해 시스템을 구성했습니다.'
      };
    },
    async createCampaign(input) {
      return {
        assetCount: 8,
        title: input.productName || 'New campaign',
        direction: `${input.objective} / ${input.mood}`,
        storyboard: ['Opening / material', 'Benefit / proof', 'CTA / recall']
      };
    }
  };

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  }
  function toast(message) {
    const element = $('#toast');
    element.textContent = message;
    element.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('is-on'), 2600);
  }
  function persist() {
    const serializable = clone(state);
    serializable.campaign.image = demoImage;
    serializable.project.updatedAt = new Date().toISOString();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable)); } catch (_) { /* Storage is optional in prototype mode. */ }
    $('#canvasStatus').textContent = 'AUTO-SAVED';
    $('#railProjectName').textContent = state.project.name;
  }
  function setValue(selector, value) {
    const element = $(selector);
    if (element) element.value = value;
  }
  function formatTime(seconds) {
    const time = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(time / 60);
    const remainder = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  }
  function parseTimecode(value) {
    const match = String(value).trim().match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
    if (!match) return 0;
    return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000;
  }
  function cueKind(text, index) {
    const source = String(text).toLowerCase();
    if (/(시작|start|구매|지금|cta|클릭|선택|문의|try|shop)/i.test(source)) return 'cta';
    if (/(비포|애프터|before|after|비교|vs|전후)/i.test(source)) return 'comparison';
    if (/(\d+|%|세 가지|three|첫|first|순서|step)/i.test(source)) return index % 2 ? 'metric' : 'sequence';
    return 'headline';
  }
  function parseSrt(text) {
    const blocks = String(text || '').replace(/\r/g, '').trim().split(/\n\s*\n/).filter(Boolean);
    const cues = [];
    blocks.forEach((block, index) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
      const timeLine = lines.find((line) => line.includes('-->'));
      if (!timeLine) return;
      const [startString, endString] = timeLine.split('-->').map((item) => item.trim());
      const textLines = lines.slice(lines.indexOf(timeLine) + 1).filter((line) => !/^\d+$/.test(line));
      const cueText = textLines.join(' ').trim();
      if (!cueText) return;
      const start = parseTimecode(startString);
      const end = Math.max(start + .4, parseTimecode(endString));
      cues.push({
        id: `cue-${index + 1}-${Math.round(start * 10)}`,
        start, end, text: cueText, type: cueKind(cueText, index), position: 'center', scale: 100
      });
    });
    return cues;
  }
  function ensureCues() {
    if (!state.motion.cues.length) {
      const parsed = parseSrt(state.motion.srt);
      state.motion.cues = parsed.length ? parsed : parseSrt(demoSrt);
    }
    if (!state.motion.selectedCueId || !state.motion.cues.some((cue) => cue.id === state.motion.selectedCueId)) {
      state.motion.selectedCueId = state.motion.cues[0] && state.motion.cues[0].id;
    }
    motionPlayer.duration = Math.max(30, ...state.motion.cues.map((cue) => cue.end));
  }
  function getSelectedCue() { return state.motion.cues.find((cue) => cue.id === state.motion.selectedCueId) || null; }

  function setView(viewName) {
    $$('.studio-view').forEach((view) => view.classList.toggle('is-active', view.dataset.viewPanel === viewName));
    $$('.nav-item[data-view]').forEach((button) => button.classList.toggle('is-active', button.dataset.view === viewName));
    const titles = { dashboard: '프로젝트', brand: '브랜드 시스템', campaign: '캠페인', logo: '로고 만들기', motion: '모션', templates: '템플릿', exports: '내보내기' };
    $('#topbarTitle').textContent = titles[viewName] || '프로젝트';
    if (viewName === 'logo') renderLogoStudio();
    if (viewName === 'motion') renderMotion();
    if (viewName === 'exports') renderVersionHistory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderRecentProjects() {
    const projects = [
      { title: 'Scent / Launch Campaign', meta: 'CAMPAIGN PACK · 8 ASSETS', image: state.campaign.image || demoImage, target: 'campaign' },
      { title: `${state.logo.name} / Logo Studio`, meta: state.logo.motionAddOn ? 'LOGO + MOTION' : 'STATIC LOGO', image: '../sample-classic-actress-input.jpg', target: 'logo' },
      { title: 'AVVM / Logo Reveal', meta: 'MOTION · 00:30', image: '../demo-warrior-refined.jpg', target: 'motion' },
      { title: 'Core / Brand System', meta: 'TOKENS · v01', image: '../sample-classic-actress-input.jpg', target: 'brand' }
    ];
    $('#recentProjectGrid').innerHTML = projects.map((project) => `<button class="project-card" type="button" data-open-view="${project.target}"><span class="project-image" style="background-image:url('${escapeHtml(project.image)}')"></span><small>${project.meta}</small><strong>${project.title}</strong><span>오늘 자동 저장됨</span></button>`).join('');
  }
  function renderSources() {
    $('#brandSourceList').innerHTML = state.brand.sources.map((source) => `<div class="source-file"><b>${escapeHtml(source.name)}</b><span>${escapeHtml(source.type)}</span></div>`).join('');
  }
  function renderTokenControls() {
    const tokens = state.brand.tokens;
    const values = {
      '#tokenPrimary': tokens.primary, '#tokenInk': tokens.ink, '#tokenSurface': tokens.surface, '#tokenText': tokens.text,
      '#tokenDisplay': tokens.display, '#tokenBody': tokens.body, '#tokenTracking': tokens.tracking, '#tokenGrid': tokens.grid,
      '#tokenSpacing': tokens.spacing, '#tokenRadius': tokens.radius, '#tokenShadow': tokens.shadow, '#tokenVoice': tokens.voice,
      '#tokenVerticalSafe': tokens.verticalSafe, '#tokenHorizontalSafe': tokens.horizontalSafe
    };
    Object.entries(values).forEach(([selector, value]) => setValue(selector, value));
    $('#trackingOut').textContent = `${tokens.tracking}px`;
    $('#spacingOut').textContent = `${tokens.spacing}px`;
    $('#radiusOut').textContent = `${tokens.radius}px`;
    $('#brandSystemTitle').textContent = state.brand.name;
    $('#brandUrlInput').value = state.brand.url;
    $('#brandTonePreview').textContent = tokens.voice.toUpperCase();
    const root = document.documentElement.style;
    root.setProperty('--lime', tokens.primary);
    root.setProperty('--ink', tokens.ink);
    root.setProperty('--panel', tokens.surface);
    root.setProperty('--paper', tokens.text);
    root.setProperty('--display', `'${tokens.display}', "Noto Sans KR", sans-serif`);
    root.setProperty('--body', `'${tokens.body}', "Noto Sans KR", system-ui, sans-serif`);
    root.setProperty('--brand-radius', `${tokens.radius}px`);
    $('.brand-preview').style.borderRadius = `${tokens.radius}px`;
    $('.brand-preview-content h3').style.letterSpacing = `${tokens.tracking}px`;
  }
  function updateTokensFromForm() {
    const tokens = state.brand.tokens;
    tokens.primary = $('#tokenPrimary').value;
    tokens.ink = $('#tokenInk').value;
    tokens.surface = $('#tokenSurface').value;
    tokens.text = $('#tokenText').value;
    tokens.display = $('#tokenDisplay').value;
    tokens.body = $('#tokenBody').value;
    tokens.tracking = Number($('#tokenTracking').value);
    tokens.grid = $('#tokenGrid').value;
    tokens.spacing = Number($('#tokenSpacing').value);
    tokens.radius = Number($('#tokenRadius').value);
    tokens.shadow = $('#tokenShadow').value;
    tokens.voice = $('#tokenVoice').value;
    tokens.verticalSafe = $('#tokenVerticalSafe').value;
    tokens.horizontalSafe = $('#tokenHorizontalSafe').value;
    renderTokenControls();
    renderCampaignCanvas();
    renderMotionPreview();
    persist();
  }
  function renderChat() {
    const thread = $('#chatThread');
    thread.innerHTML = state.campaign.chat.map((message) => `<div class="chat-message ${message.role === 'user' ? 'user' : ''}"><b>${message.role === 'user' ? 'YOU' : 'AVVM STUDIO'}</b>${escapeHtml(message.text)}</div>`).join('');
    thread.scrollTop = thread.scrollHeight;
  }
  function syncCampaignInspector() {
    const campaign = state.campaign;
    const values = {
      '#productName': campaign.productName, '#productPrice': campaign.price, '#productBenefits': campaign.benefits,
      '#campaignAudience': campaign.audience, '#campaignObjective': campaign.objective, '#campaignMood': campaign.mood,
      '#campaignCta': campaign.cta, '#motionIntensity': campaign.intensity, '#canvasDensity': campaign.density
    };
    Object.entries(values).forEach(([selector, value]) => setValue(selector, value));
    $('#motionIntensityOut').textContent = `${campaign.intensity}%`;
    $('#canvasDensityOut').textContent = `${campaign.density}%`;
    $('#campaignProjectTitle').textContent = `${campaign.productName.split(' ')[0] || 'New'} / Launch Campaign`;
    $('#campaignPackName').textContent = `AVVM / ${campaign.productName}`;
  }
  function campaignTitle() {
    const name = state.campaign.productName || 'NEW OBJECT';
    const word = name.split(' ').slice(0, 2).join('<br />');
    return word.toUpperCase();
  }
  function renderCampaignCanvas() {
    const campaign = state.campaign;
    const canvas = $('#campaignCanvas');
    const output = campaign.canvas;
    canvas.className = `campaign-canvas canvas-${output}`;
    canvas.style.setProperty('--campaign-image', `url("${String(campaign.image || demoImage).replace(/"/g, '%22')}")`);
    canvas.style.setProperty('--canvas-density', `${campaign.density}%`);
    const title = campaignTitle();
    const benefits = escapeHtml(campaign.benefits);
    if (output === 'storyboard') {
      canvas.innerHTML = ['01 / HOOK', '02 / PROOF', '03 / CTA'].map((label) => `<div class="story-frame"><b>${label}</b></div>`).join('');
    } else {
      canvas.innerHTML = `<div class="campaign-art"></div><span class="canvas-price">${escapeHtml(campaign.price)}</span><div class="canvas-content"><small>${escapeHtml(campaign.objective).toUpperCase()} / ${escapeHtml(campaign.audience).toUpperCase()}</small><h2>${title}</h2><p>${benefits}</p><button class="canvas-cta" type="button" data-copy-cta>${escapeHtml(campaign.cta).toUpperCase()} ↗</button></div>`;
    }
    $$('.canvas-tab').forEach((tab) => tab.classList.toggle('is-active', tab.dataset.canvas === output));
    syncCampaignInspector();
  }
  function updateCampaignFromInspector() {
    const campaign = state.campaign;
    campaign.productName = $('#productName').value.trim() || 'NEW OBJECT';
    campaign.price = $('#productPrice').value.trim() || '₩0';
    campaign.benefits = $('#productBenefits').value.trim() || '브랜드의 핵심 장점을 간결하게 전달합니다.';
    campaign.audience = $('#campaignAudience').value;
    campaign.objective = $('#campaignObjective').value;
    campaign.mood = $('#campaignMood').value;
    campaign.cta = $('#campaignCta').value.trim() || '지금 시작하세요';
    campaign.intensity = Number($('#motionIntensity').value);
    campaign.density = Number($('#canvasDensity').value);
    renderCampaignCanvas();
    persist();
  }
  function campaignPack() {
    const campaign = state.campaign;
    return {
      schema: 'avvm-campaign-pack/v0.1',
      mode: window.AVVMStudioAdapters.mode,
      createdAt: new Date().toISOString(),
      brandSystem: brandSystemData(),
      prompt: campaign.prompt,
      product: {
        name: campaign.productName, price: campaign.price, benefits: campaign.benefits,
        audience: campaign.audience, objective: campaign.objective, mood: campaign.mood, imageReference: campaign.imageName || 'browser-local-image'
      },
      outputs: [
        { type: 'landing-page', ratio: 'responsive', status: 'preview-ready' },
        { type: 'short-form-storyboard', ratio: '9:16', duration: 15, status: 'preview-ready' },
        { type: 'social-ad', ratio: '1:1', status: 'preview-ready' },
        { type: 'banner', ratio: '16:9', status: 'preview-ready' },
        { type: 'email-campaign', ratio: 'responsive', status: 'preview-ready' }
      ],
      copy: {
        headline: campaign.productName,
        body: campaign.benefits,
        cta: campaign.cta,
        script15: `0–03s ${campaign.productName}의 첫 인상. 03–10s ${campaign.benefits} 10–15s ${campaign.cta}.`,
        storyboard: ['Hook: 제품의 정지된 물성', 'Proof: 핵심 장점과 디테일', `CTA: ${campaign.cta}`]
      }
    };
  }
  function brandSystemData() {
    return {
      schema: 'avvm-brand-system/v0.1',
      name: state.brand.name, sourceUrl: state.brand.url, logo: { primary: 'AVVM wordmark', variations: ['light', 'compact'] },
      tokens: clone(state.brand.tokens),
      components: ['button', 'card', 'navigation', 'price-table', 'caption', 'infographic', 'transition'],
      safeAreas: { vertical: `${state.brand.tokens.verticalSafe}%`, horizontal: `${state.brand.tokens.horizontalSafe}%` },
      sources: state.brand.sources, mode: 'local-demo', updatedAt: new Date().toISOString()
    };
  }
  function downloadJson(filename, object) {
    const blob = new Blob([JSON.stringify(object, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function formatWon(value) { return `₩${new Intl.NumberFormat('ko-KR').format(Number(value) || 0)}`; }
  function logoColors() {
    if (state.logo.palette === 'mono') return { ink: '#050505', paper: '#f3f3ef', accent: '#f3f3ef', muted: '#a6a6a0' };
    if (state.logo.palette === 'warm') return { ink: '#17110c', paper: '#f5eee3', accent: '#d6aa67', muted: '#a68c68' };
    return { ink: state.brand.tokens.ink || '#040404', paper: state.brand.tokens.surface || '#151515', accent: state.brand.tokens.primary || '#d8f233', muted: '#a5a5a0' };
  }
  function logoSymbolMarkup() {
    const colors = logoColors();
    const initial = escapeHtml((state.logo.name || 'A').replace(/\s/g, '').slice(0, 1).toUpperCase());
    if (state.logo.type === 'monogram') return `<rect x="60" y="40" width="120" height="120" rx="26" fill="none" stroke="${colors.accent}" stroke-width="7"/><text x="120" y="130" text-anchor="middle" fill="${colors.accent}" font-size="84" font-weight="800" font-family="Arial, sans-serif">${initial}</text>`;
    if (state.logo.type === 'emblem') return `<path d="M120 27 191 68v65l-71 42-71-42V68z" fill="none" stroke="${colors.accent}" stroke-width="7"/><path d="M84 117 108 92l18 18 31-35 22 23" fill="none" stroke="${colors.accent}" stroke-width="9" stroke-linecap="square" stroke-linejoin="miter"/><circle cx="120" cy="100" r="58" fill="${colors.accent}" opacity=".08"/>`;
    return `<path d="M65 158 117 45l52 113M85 116h64" fill="none" stroke="${colors.accent}" stroke-width="11" stroke-linecap="square" stroke-linejoin="miter"/><path d="M151 63h31v95" fill="none" stroke="${colors.accent}" stroke-width="7" stroke-linecap="square"/>`;
  }
  function logoSvgMarkup() {
    const colors = logoColors();
    const name = escapeHtml((state.logo.name || 'NEW BRAND').toUpperCase());
    const tagline = escapeHtml((state.logo.tagline || 'ONE BRAND. ONE PROMPT.').toUpperCase());
    const fontSize = name.length > 18 ? 48 : name.length > 12 ? 60 : 72;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460" role="img" aria-label="${name}">
      <rect width="800" height="460" fill="${colors.ink}"/>
      <g class="logo-symbol">${logoSymbolMarkup()}</g>
      <text x="230" y="180" fill="${colors.paper}" font-size="${fontSize}" font-weight="800" letter-spacing="-2" font-family="Arial, Helvetica, sans-serif">${name}</text>
      <path class="logo-underline" d="M232 212H696" stroke="${colors.accent}" stroke-width="6"/>
      <text x="232" y="258" fill="${colors.muted}" font-size="17" font-weight="700" letter-spacing="4" font-family="Arial, Helvetica, sans-serif">${tagline}</text>
      <text x="64" y="402" fill="${colors.accent}" font-size="13" font-weight="700" letter-spacing="3" font-family="Arial, Helvetica, sans-serif">AVVM LOGO STUDIO / ${escapeHtml(state.logo.style.toUpperCase())}</text>
    </svg>`;
  }
  function logoDirections() {
    return [
      { id: 'wordmark', type: 'wordmark', title: '01 / WORDMARK', text: '이름을 가장 선명하게 남기는 정제된 워드마크' },
      { id: 'monogram', type: 'monogram', title: '02 / MONOGRAM', text: '앱 아이콘·파비콘까지 확장되는 이니셜 시스템' },
      { id: 'emblem', type: 'emblem', title: '03 / EMBLEM', text: '패키지·스티커·모션 인트로에 강한 상징형 마크' }
    ];
  }
  function logoProjectData() {
    const price = state.logo.motionAddOn ? state.logo.basePrice + state.logo.motionPrice : state.logo.basePrice;
    return {
      schema: 'avvm-logo-project/v0.1', mode: 'local-vector-demo', createdAt: new Date().toISOString(),
      brandSystem: brandSystemData(),
      logo: { ...clone(state.logo), price: { static: state.logo.basePrice, motionAddOn: state.logo.motionAddOn ? state.logo.motionPrice : 0, total: price } },
      deliverables: state.logo.motionAddOn ? ['logo.svg', 'logo-project.json', 'browser-logo-reveal-preview', 'motion-scene'] : ['logo.svg', 'logo-project.json']
    };
  }
  function renderLogoStudio() {
    const logo = state.logo;
    const values = {
      '#logoNameInput': logo.name, '#logoTaglineInput': logo.tagline, '#logoCategoryInput': logo.category,
      '#logoIdeaInput': logo.idea, '#logoTypeInput': logo.type, '#logoStyleInput': logo.style, '#logoPaletteInput': logo.palette
    };
    Object.entries(values).forEach(([selector, value]) => setValue(selector, value));
    $('#logoMotionAddOn').checked = !!logo.motionAddOn;
    $('#logoReferenceName').textContent = logo.referenceName ? `${logo.referenceName} · 로컬 참조 파일` : '선택된 참조 파일 없음 · 이 브라우저 밖으로 전송되지 않습니다.';
    const canvas = $('#logoCanvas');
    canvas.classList.toggle('is-motion-preview', !!logo.motionPreview && !!logo.motionAddOn);
    canvas.innerHTML = `<span class="logo-canvas-meta">${logo.motionAddOn ? 'STATIC + MOTION' : 'STATIC LOGO'}</span><div class="logo-stage">${logoSvgMarkup()}</div><span class="logo-canvas-caption">${escapeHtml(logo.category || 'BRAND')} / ${escapeHtml(logo.style || 'MINIMAL')}</span>`;
    $('#logoDirections').innerHTML = logoDirections().map((direction) => `<button class="logo-direction ${logo.direction === direction.id ? 'is-selected' : ''}" type="button" data-logo-direction="${direction.id}"><b>${direction.title}</b><span>${direction.text}</span></button>`).join('');
    const total = logo.motionAddOn ? logo.basePrice + logo.motionPrice : logo.basePrice;
    $('#logoModeBadge').textContent = logo.motionAddOn ? 'MOTION +' : 'STATIC';
    $('#logoTotalPrice').textContent = formatWon(total);
    $('#previewLogoMotionBtn').textContent = logo.motionPreview ? '모션 미리보기 정지' : '로고 모션 미리보기';
    $('#addLogoMotionBtn').disabled = !logo.motionAddOn;
  }
  function updateLogoFromForm() {
    state.logo.name = $('#logoNameInput').value.trim() || 'NEW BRAND';
    state.logo.tagline = $('#logoTaglineInput').value.trim() || 'ONE BRAND. ONE PROMPT.';
    state.logo.category = $('#logoCategoryInput').value.trim();
    state.logo.idea = $('#logoIdeaInput').value.trim();
    state.logo.type = $('#logoTypeInput').value;
    state.logo.style = $('#logoStyleInput').value;
    state.logo.palette = $('#logoPaletteInput').value;
    state.logo.motionAddOn = $('#logoMotionAddOn').checked;
    if (!state.logo.motionAddOn) state.logo.motionPreview = false;
    renderLogoStudio(); renderRecentProjects(); persist();
  }
  function selectLogoDirection(id) {
    const direction = logoDirections().find((item) => item.id === id);
    if (!direction) return;
    state.logo.direction = direction.id;
    state.logo.type = direction.type;
    renderLogoStudio(); persist();
  }
  function createLogoDirections() {
    state.logo.motionPreview = false;
    renderLogoStudio(); renderRecentProjects(); persist();
    toast('3가지 로컬 벡터 로고 방향을 구성했습니다.');
  }
  function handleLogoReference(file) {
    if (!file) return;
    state.logo.referenceName = file.name;
    renderLogoStudio(); persist(); toast(`${file.name}을(를) 로고 참고 파일로 표시했습니다.`);
  }
  function toggleLogoMotionPreview() {
    if (!state.logo.motionAddOn) { toast('움직이는 로고 리빌 옵션을 선택하면 미리볼 수 있습니다.'); return; }
    state.logo.motionPreview = !state.logo.motionPreview;
    renderLogoStudio(); persist();
  }
  function addLogoMotionToTimeline() {
    if (!state.logo.motionAddOn) { toast('먼저 움직이는 로고 리빌 옵션을 선택해 주세요.'); return; }
    ensureCues();
    const time = Math.min(Math.max(0, state.motion.currentTime), Math.max(0, motionPlayer.duration - 3));
    const cue = { id: `cue-logo-${Date.now()}`, start: time, end: time + 2.8, text: `${state.logo.name.toUpperCase()} / LOGO REVEAL`, type: 'headline', position: 'center', scale: 118, logoReveal: true };
    state.motion.cues.push(cue);
    state.motion.cues.sort((a, b) => a.start - b.start);
    state.motion.selectedCueId = cue.id;
    state.logo.motionPreview = true;
    persist(); setView('motion'); renderMotion();
    toast('로고 리빌을 모션 타임라인에 추가했습니다.');
  }
  function exportLogoSvg() {
    const filename = (state.logo.name || 'avvm-logo').toLowerCase().replace(/[^a-z0-9가-힣_-]+/gi, '-').replace(/^-+|-+$/g, '') || 'avvm-logo';
    downloadFile(`${filename}.svg`, logoSvgMarkup(), 'image/svg+xml;charset=utf-8');
    toast('편집 가능한 SVG 로고를 내보냈습니다.');
  }
  function copyText(value, success) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(() => toast(success)).catch(() => toast('복사 권한을 확인해 주세요.'));
      return;
    }
    const area = document.createElement('textarea');
    area.value = value;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    toast(success);
  }

  function renderTemplates() {
    const templates = selectedTemplateFilter === 'all' ? templateData : templateData.filter((item) => item.group === selectedTemplateFilter);
    $('#templateGrid').innerHTML = templates.map((template) => `<article class="template-card" style="--template-color:${template.color}"><small>${template.group.toUpperCase()}</small><h2>${template.title}</h2><p>${template.text}</p><button type="button" data-use-template="${template.id}">템플릿 사용 →</button></article>`).join('');
    $$('.filter-button').forEach((button) => button.classList.toggle('is-active', button.dataset.templateFilter === selectedTemplateFilter));
  }

  function renderVersionHistory() {
    let versions = [];
    try { versions = JSON.parse(localStorage.getItem(VERSION_KEY)) || []; } catch (_) { versions = []; }
    $('#versionHistory').innerHTML = versions.length ? versions.map((version, index) => `<div class="version-row"><b>V${String(versions.length - index).padStart(2, '0')}</b><span>${escapeHtml(version.name)}</span><time>${new Date(version.createdAt).toLocaleString('ko-KR')}</time></div>`).join('') : '<div class="version-row"><b>—</b><span>아직 저장된 버전이 없습니다.</span><time>지금 저장해 보세요</time></div>';
  }
  function saveVersion(label) {
    const version = { name: label || state.project.name, createdAt: new Date().toISOString(), brand: brandSystemData(), campaign: campaignPack(), logo: logoProjectData(), motion: motionExportData() };
    let versions = [];
    try { versions = JSON.parse(localStorage.getItem(VERSION_KEY)) || []; } catch (_) { versions = []; }
    versions.unshift(version);
    localStorage.setItem(VERSION_KEY, JSON.stringify(versions.slice(0, 12)));
    renderVersionHistory();
    toast('버전이 브라우저에 저장되었습니다.');
  }

  function renderMotion() {
    ensureCues();
    $('#srtInput').value = state.motion.srt;
    renderAnalysisSummary();
    renderMotionPreview();
    renderTimeline();
    renderSceneInspector();
  }
  function renderAnalysisSummary() {
    const counts = { metric: 0, comparison: 0, cta: 0 };
    state.motion.cues.forEach((cue) => { if (Object.prototype.hasOwnProperty.call(counts, cue.type)) counts[cue.type] += 1; });
    $('#analysisSummary').innerHTML = `<div class="analysis-cell"><b>${state.motion.cues.length}</b><span>발화 씬</span></div><div class="analysis-cell"><b>${counts.metric + counts.comparison}</b><span>강조 요소</span></div><div class="analysis-cell"><b>${counts.cta}</b><span>CTA 감지</span></div>`;
  }
  function motionCueMarkup(cue) {
    const text = escapeHtml(cue ? cue.text : '타임라인을 분석해 주세요.');
    const type = cue ? cue.type : 'headline';
    const label = { headline: 'AVVM / MESSAGE', metric: 'KEY METRIC', comparison: 'BEFORE / AFTER', cta: 'NEXT ACTION', sequence: 'STEP BY STEP' }[type] || 'MESSAGE';
    if (type === 'metric') return `<span class="graphic-label">${label}</span><div class="graphic-value">${(cue.text.match(/\d+[%]?/) || ['03'])[0]}</div><h2 class="graphic-title">${text.replace(/\d+[%]?/, '')}</h2>`;
    if (type === 'comparison') return `<span class="graphic-label">${label}</span><h2 class="graphic-title">${text}</h2><div class="compare-bars"><i></i><i></i></div>`;
    if (type === 'sequence') return `<span class="graphic-label">${label}</span><div class="sequence-numbers"><i>01</i><i>02</i><i>03</i></div><h2 class="graphic-title">${text}</h2>`;
    if (type === 'cta') return `<span class="graphic-label">${label}</span><div class="cta-shape">${text} →</div>`;
    return `<span class="graphic-label">${label}</span><h2 class="graphic-title">${text}</h2>`;
  }
  function renderMotionPreview() {
    const preview = $('#motionPreview');
    preview.className = `motion-preview ratio-${state.motion.ratio.replace(':', '-')}${state.motion.showSafe ? ' show-safe' : ''}`;
    const cue = state.motion.cues.find((item) => state.motion.currentTime >= item.start && state.motion.currentTime < item.end) || getSelectedCue() || state.motion.cues[0];
    const graphic = $('#motionGraphic');
    graphic.className = `motion-graphic ${cue ? `position-${cue.position}` : ''}`;
    graphic.style.transform = `translate(-50%, -50%) scale(${(cue ? cue.scale : 100) / 100})`;
    if (cue && cue.position === 'top') graphic.style.top = '31%';
    else if (cue && cue.position === 'bottom') graphic.style.top = '65%';
    else graphic.style.top = '50%';
    graphic.innerHTML = motionCueMarkup(cue);
    $('#motionCaption').textContent = cue ? cue.text : '';
    updateMotionTime(state.motion.currentTime);
  }
  function updateMotionTime(time) {
    const duration = Math.max(1, motionPlayer.duration || 30);
    state.motion.currentTime = Math.min(duration, Math.max(0, time));
    const progress = state.motion.currentTime / duration;
    $('#motionTimecode').textContent = `${formatTime(state.motion.currentTime)} / ${formatTime(duration)}`;
    $('#motionProgressBar').style.width = `${progress * 100}%`;
    $('#timelinePlayhead').style.left = `calc(43px + ${(progress * 100).toFixed(3)}%)`;
  }
  function renderTimeline() {
    const duration = Math.max(1, motionPlayer.duration || 30);
    const tickCount = 6;
    $('#timelineDuration').textContent = `${formatTime(duration)}.${String(Math.round((duration % 1) * 10))}`;
    $('#timelineCueCount').textContent = `${state.motion.cues.length} scenes`;
    $('#timelineRuler').innerHTML = Array.from({ length: tickCount }, (_, index) => `<span style="left:${(index / (tickCount - 1)) * 100}%">${formatTime((duration / (tickCount - 1)) * index)}</span>`).join('');
    const cueBlocks = (extraClass = '') => state.motion.cues.map((cue) => {
      const left = (cue.start / duration) * 100;
      const width = Math.max(4, ((cue.end - cue.start) / duration) * 100);
      return `<button type="button" class="timeline-cue ${extraClass} ${cue.id === state.motion.selectedCueId ? 'is-selected' : ''}" data-select-cue="${cue.id}" style="left:${left}%;width:${width}%" title="${escapeHtml(cue.text)}">${escapeHtml(cue.text)}</button>`;
    }).join('');
    $('#captionTrack').innerHTML = cueBlocks();
    $('#graphicTrack').innerHTML = cueBlocks('graphic');
    updateMotionTime(state.motion.currentTime);
  }
  function renderSceneInspector() {
    const cue = getSelectedCue();
    const fields = $('#sceneInspectorFields');
    const empty = $('#sceneInspectorEmpty');
    if (!cue) {
      $('#sceneInspectorTitle').textContent = '씬을 선택하세요';
      $('#sceneTypeBadge').textContent = '—';
      fields.hidden = true; empty.hidden = false; return;
    }
    $('#sceneInspectorTitle').textContent = `씬 ${String(state.motion.cues.indexOf(cue) + 1).padStart(2, '0')}`;
    $('#sceneTypeBadge').textContent = cue.type.toUpperCase();
    fields.hidden = false; empty.hidden = true;
    $('#sceneTextInput').value = cue.text;
    $('#sceneStartInput').value = cue.start.toFixed(1);
    $('#sceneEndInput').value = cue.end.toFixed(1);
    $('#sceneTemplateSelect').value = cue.type;
    $('#scenePositionSelect').value = cue.position;
    $('#sceneScaleInput').value = cue.scale;
    $('#sceneScaleOut').textContent = `${cue.scale}%`;
  }
  function updateSelectedCue() {
    const cue = getSelectedCue();
    if (!cue) return;
    cue.text = $('#sceneTextInput').value.trim() || cue.text;
    cue.start = Math.max(0, Number($('#sceneStartInput').value) || cue.start);
    cue.end = Math.max(cue.start + .4, Number($('#sceneEndInput').value) || cue.end);
    cue.type = $('#sceneTemplateSelect').value;
    cue.position = $('#scenePositionSelect').value;
    cue.scale = Number($('#sceneScaleInput').value);
    motionPlayer.duration = Math.max(30, ...state.motion.cues.map((item) => item.end));
    renderMotionPreview(); renderTimeline(); renderSceneInspector(); persist();
  }
  function selectCue(id) {
    state.motion.selectedCueId = id;
    const cue = getSelectedCue();
    if (cue) updateMotionTime(cue.start);
    renderMotionPreview(); renderTimeline(); renderSceneInspector();
  }
  function toggleMotionPlayback(force) {
    const playing = typeof force === 'boolean' ? force : !motionPlayer.playing;
    motionPlayer.playing = playing;
    $('#motionPlayBtn').textContent = playing ? 'Ⅱ' : '▶';
    if (!playing) { if (motionPlayer.frame) cancelAnimationFrame(motionPlayer.frame); motionPlayer.frame = null; return; }
    motionPlayer.lastFrame = performance.now();
    function advance(now) {
      if (!motionPlayer.playing) return;
      const elapsed = (now - motionPlayer.lastFrame) / 1000;
      motionPlayer.lastFrame = now;
      const next = state.motion.currentTime + elapsed;
      if (next >= motionPlayer.duration) { updateMotionTime(0); renderMotionPreview(); toggleMotionPlayback(false); return; }
      updateMotionTime(next);
      const active = state.motion.cues.find((cue) => state.motion.currentTime >= cue.start && state.motion.currentTime < cue.end);
      if (active && active.id !== state.motion.selectedCueId) { state.motion.selectedCueId = active.id; renderMotionPreview(); renderTimeline(); renderSceneInspector(); }
      motionPlayer.frame = requestAnimationFrame(advance);
    }
    motionPlayer.frame = requestAnimationFrame(advance);
  }
  function motionExportData() {
    return {
      schema: 'avvm-motion-project/v0.1', mode: 'browser-preview-only', createdAt: new Date().toISOString(),
      brandSystem: brandSystemData(), ratio: state.motion.ratio, duration: motionPlayer.duration, srt: state.motion.srt,
      scenes: state.motion.cues.map((cue) => ({ ...cue })), renderer: { status: 'not-configured', note: 'Use a connected Remotion renderer for MP4 output.' }
    };
  }
  function parseCurrentSrt() {
    state.motion.srt = $('#srtInput').value;
    const nextCues = parseSrt(state.motion.srt);
    if (!nextCues.length) { toast('인식 가능한 SRT 타임코드를 찾지 못했습니다.'); return; }
    state.motion.cues = nextCues;
    state.motion.selectedCueId = nextCues[0].id;
    state.motion.currentTime = 0;
    motionPlayer.duration = Math.max(30, ...nextCues.map((cue) => cue.end));
    renderMotion(); persist(); toast(`${nextCues.length}개 발화 구간을 분석했습니다.`);
  }
  function insertMotionScene(kind) {
    const time = Math.min(Math.max(0, state.motion.currentTime), motionPlayer.duration - .5);
    const defaults = {
      logo: { text: 'AVVM / LOGO REVEAL', type: 'headline' },
      chart: { text: '03 / KEY BENEFITS', type: 'metric' },
      cta: { text: state.campaign.cta || '지금 시작하세요', type: 'cta' }
    }[kind];
    const cue = { id: `cue-manual-${Date.now()}`, start: time, end: Math.min(motionPlayer.duration, time + 2.6), text: defaults.text, type: defaults.type, position: 'center', scale: 100 };
    state.motion.cues.push(cue);
    state.motion.cues.sort((a, b) => a.start - b.start);
    state.motion.selectedCueId = cue.id;
    renderMotion(); persist(); toast('타임라인에 장면을 추가했습니다.');
  }

  function startVoiceInput() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const button = $('#voiceButton');
    if (!Recognition) { button.disabled = true; toast('이 브라우저에서는 음성 인식이 지원되지 않습니다.'); return; }
    const recognition = new Recognition();
    recognition.lang = document.documentElement.lang === 'ko' ? 'ko-KR' : 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    button.classList.add('is-listening'); button.innerHTML = '<span>◉</span> 듣는 중…';
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join('');
      $('#campaignPrompt').value = transcript;
      state.campaign.prompt = transcript;
    };
    recognition.onerror = () => toast('음성 인식을 완료하지 못했습니다. 마이크 권한을 확인해 주세요.');
    recognition.onend = () => { button.classList.remove('is-listening'); button.innerHTML = '<span>◌</span> 음성 입력'; persist(); };
    recognition.start();
  }
  async function generateCampaign() {
    const button = $('#generateCampaignBtn');
    button.disabled = true; button.innerHTML = '<span>구성 중…</span><b>·</b>';
    state.campaign.prompt = $('#campaignPrompt').value.trim();
    const result = await window.AVVMStudioAdapters.createCampaign(state.campaign);
    state.campaign.chat.push({ role: 'assistant', text: `${result.title} Campaign Pack을 구성했습니다. 랜딩, 소셜, 배너, 이메일, 15초 스토리보드를 같은 브랜드 토큰으로 연결했습니다.` });
    renderChat(); renderCampaignCanvas(); persist();
    button.disabled = false; button.innerHTML = '<span>캠페인 만들기</span><b>→</b>';
    setView('campaign'); toast(`${result.assetCount}개의 에셋 구성을 만들었습니다.`);
  }
  async function analyseBrand() {
    const button = $('#analyzeBrandBtn');
    button.disabled = true; button.innerHTML = '분석 중…';
    state.brand.url = $('#brandUrlInput').value.trim() || 'https://avvm.studio';
    const result = await window.AVVMStudioAdapters.analyseBrand(state.brand);
    state.brand.name = result.name;
    state.brand.sources = result.sources;
    state.brand.tokens = { ...state.brand.tokens, ...result.tokens };
    renderSources(); renderTokenControls(); persist();
    button.disabled = false; button.innerHTML = '브랜드 시스템 분석 <b>→</b>';
    toast(result.note);
  }
  function useTemplate(id) {
    const template = templateData.find((item) => item.id === id);
    if (!template) return;
    if (template.group === 'motion') {
      if (id === 'before-after') state.motion.cues.unshift({ id: `cue-template-${Date.now()}`, start: 0, end: 3, text: 'BEFORE / AFTER', type: 'comparison', position: 'center', scale: 100 });
      if (id === 'logo-reveal') state.motion.cues.unshift({ id: `cue-template-${Date.now()}`, start: 0, end: 2.8, text: 'AVVM', type: 'headline', position: 'center', scale: 140 });
      state.motion.selectedCueId = state.motion.cues[0].id; renderMotion(); setView('motion');
    } else {
      state.campaign.chat.push({ role: 'assistant', text: `${template.title} 템플릿을 현재 브랜드 시스템에 적용했습니다.` });
      state.campaign.canvas = id === 'email-campaign' ? 'email' : id === 'landing-page' ? 'landing' : 'social';
      renderCampaignCanvas(); renderChat(); setView('campaign');
    }
    persist(); toast(`${template.title} 템플릿을 적용했습니다.`);
  }
  function handleBrandFiles(files) {
    Array.from(files || []).forEach((file) => {
      state.brand.sources.unshift({ name: file.name, type: file.type.includes('video') ? 'VIDEO' : file.type.includes('pdf') ? 'PDF' : file.type.includes('presentation') ? 'PPT' : 'ASSET' });
    });
    renderSources(); persist(); toast(`${files.length}개 소스를 로컬 목록에 추가했습니다.`);
  }
  function handleProductFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast('제품 사진은 이미지 파일만 선택해 주세요.'); return; }
    if (state.campaign.image && state.campaign.image.startsWith('blob:')) URL.revokeObjectURL(state.campaign.image);
    state.campaign.image = URL.createObjectURL(file);
    state.campaign.imageName = file.name;
    renderCampaignCanvas(); renderRecentProjects(); persist(); toast(`${file.name}을(를) 제품 이미지로 적용했습니다.`);
  }
  function resetTokens() {
    state.brand.tokens = clone(defaultState.brand.tokens);
    renderTokenControls(); renderCampaignCanvas(); renderMotionPreview(); persist(); toast('AVVM 기본 토큰으로 복원했습니다.');
  }
  function resetInspector() {
    state.campaign = { ...clone(defaultState.campaign), image: state.campaign.image || demoImage, imageName: state.campaign.imageName || 'sample-product-input-v2.png', chat: state.campaign.chat };
    renderCampaignCanvas(); persist(); toast('캠페인 디렉션을 기본값으로 복원했습니다.');
  }
  function undoLastEdit() {
    const lastUserMessage = [...state.campaign.chat].reverse().findIndex((message) => message.role === 'user');
    if (lastUserMessage < 0) { toast('되돌릴 대화 수정이 없습니다.'); return; }
    state.campaign.chat.splice(state.campaign.chat.length - 1 - lastUserMessage, 1);
    renderChat(); persist(); toast('마지막 대화 지시를 제거했습니다.');
  }
  function createNewProject() {
    state.project.name = 'New / Campaign';
    state.campaign.chat.push({ role: 'assistant', text: '새 프로젝트를 준비했습니다. 제품 사진과 한 줄의 요청으로 시작하세요.' });
    renderChat(); persist(); setView('dashboard'); toast('새 프로젝트를 시작했습니다.');
  }

  function bindEvents() {
    $$('.nav-item[data-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-open-view]');
      if (trigger) setView(trigger.dataset.openView);
      const copy = event.target.closest('[data-copy-cta]');
      if (copy) copyText(state.campaign.cta, 'CTA를 복사했습니다.');
      const cue = event.target.closest('[data-select-cue]');
      if (cue) selectCue(cue.dataset.selectCue);
      const insert = event.target.closest('[data-insert-motion]');
      if (insert) insertMotionScene(insert.dataset.insertMotion);
      const logoDirection = event.target.closest('[data-logo-direction]');
      if (logoDirection) selectLogoDirection(logoDirection.dataset.logoDirection);
      const template = event.target.closest('[data-use-template]');
      if (template) useTemplate(template.dataset.useTemplate);
      const close = event.target.closest('[data-close-dialog]');
      if (close) $('#shortcutDialog').close();
    });
    $('#newProjectBtn').addEventListener('click', createNewProject);
    $('#keyboardHelpBtn').addEventListener('click', () => $('#shortcutDialog').showModal());
    $('#loadDemoBtn').addEventListener('click', () => { setValue('#campaignPrompt', defaultState.campaign.prompt); state.campaign.prompt = defaultState.campaign.prompt; toast('AVVM 데모 요청을 불러왔습니다.'); });
    $('#voiceButton').addEventListener('click', startVoiceInput);
    $('#generateCampaignBtn').addEventListener('click', generateCampaign);
    $('#productImageInput').addEventListener('change', (event) => handleProductFile(event.target.files[0]));
    $$('.ratio-button[data-ratio]').forEach((button) => button.addEventListener('click', () => {
      state.campaign.ratio = button.dataset.ratio;
      $$('.ratio-button[data-ratio]').forEach((item) => item.classList.toggle('is-selected', item === button)); persist();
    }));
    $('#brandAssetsInput').addEventListener('change', (event) => handleBrandFiles(event.target.files));
    const dropZone = $('#brandDropZone');
    ['dragenter', 'dragover'].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.add('is-dragging'); }));
    ['dragleave', 'drop'].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.remove('is-dragging'); }));
    dropZone.addEventListener('drop', (event) => handleBrandFiles(event.dataTransfer.files));
    $('#analyzeBrandBtn').addEventListener('click', analyseBrand);
    $('#resetTokensBtn').addEventListener('click', resetTokens);
    $('#saveBrandBtn').addEventListener('click', () => saveVersion('Brand System / manual save'));
    ['#tokenPrimary','#tokenInk','#tokenSurface','#tokenText','#tokenDisplay','#tokenBody','#tokenTracking','#tokenGrid','#tokenSpacing','#tokenRadius','#tokenShadow','#tokenVoice','#tokenVerticalSafe','#tokenHorizontalSafe'].forEach((selector) => $(selector).addEventListener('input', updateTokensFromForm));
    ['#logoNameInput','#logoTaglineInput','#logoCategoryInput','#logoIdeaInput'].forEach((selector) => $(selector).addEventListener('input', updateLogoFromForm));
    ['#logoTypeInput','#logoStyleInput','#logoPaletteInput','#logoMotionAddOn'].forEach((selector) => $(selector).addEventListener('change', updateLogoFromForm));
    $('#logoReferenceInput').addEventListener('change', (event) => handleLogoReference(event.target.files[0]));
    $('#createLogoBtn').addEventListener('click', createLogoDirections);
    $('#previewLogoMotionBtn').addEventListener('click', toggleLogoMotionPreview);
    $('#addLogoMotionBtn').addEventListener('click', addLogoMotionToTimeline);
    $('#exportLogoSvgBtn').addEventListener('click', exportLogoSvg);
    $('#exportLogoProjectBtn').addEventListener('click', () => { downloadJson('avvm-logo-project.json', logoProjectData()); toast('로고 프로젝트 JSON을 내보냈습니다.'); });
    $('#compareCampaignBtn').addEventListener('click', () => { const overlay = $('#comparisonOverlay'); overlay.hidden = !overlay.hidden; $('#compareCampaignBtn').textContent = overlay.hidden ? '비교 보기' : '비교 닫기'; });
    $('#undoBtn').addEventListener('click', undoLastEdit);
    $('#saveVersionBtn').addEventListener('click', () => saveVersion('Campaign / manual save'));
    $('#downloadPackBtn').addEventListener('click', () => { downloadJson('avvm-campaign-pack.json', campaignPack()); toast('Campaign Pack JSON을 내보냈습니다.'); });
    $('#refreshCampaignBtn').addEventListener('click', () => { updateCampaignFromInspector(); state.campaign.chat.push({ role: 'assistant', text: '수정한 제품 정보와 디렉션을 반영해 모든 화면의 일관성을 갱신했습니다.' }); renderChat(); toast('캠페인을 다시 구성했습니다.'); });
    $('#inspectorResetBtn').addEventListener('click', resetInspector);
    ['#productName','#productPrice','#productBenefits','#campaignAudience','#campaignObjective','#campaignMood','#campaignCta','#motionIntensity','#canvasDensity'].forEach((selector) => $(selector).addEventListener('input', updateCampaignFromInspector));
    $$('.canvas-tab').forEach((tab) => tab.addEventListener('click', () => { state.campaign.canvas = tab.dataset.canvas; renderCampaignCanvas(); persist(); }));
    $('#sendChatBtn').addEventListener('click', () => {
      const input = $('#chatInput'); const text = input.value.trim(); if (!text) return;
      state.campaign.chat.push({ role: 'user', text });
      state.campaign.chat.push({ role: 'assistant', text: '요청을 반영했습니다. 현재는 데모 편집 모드이므로 실제 이미지 생성은 하지 않으며, 캔버스와 Campaign Pack 방향을 갱신했습니다.' });
      input.value = ''; renderChat(); renderCampaignCanvas(); persist();
    });
    $('#srtFileInput').addEventListener('change', (event) => {
      const file = event.target.files[0]; if (!file) return;
      const reader = new FileReader(); reader.onload = () => { $('#srtInput').value = String(reader.result || ''); parseCurrentSrt(); }; reader.readAsText(file);
    });
    $('#loadDemoSrtBtn').addEventListener('click', () => { $('#srtInput').value = demoSrt; parseCurrentSrt(); });
    $('#parseSrtBtn').addEventListener('click', parseCurrentSrt);
    $('#motionPlayBtn').addEventListener('click', () => toggleMotionPlayback());
    $('#toggleSafeAreaBtn').addEventListener('click', () => { state.motion.showSafe = !state.motion.showSafe; renderMotionPreview(); persist(); });
    $$('.ratio-button[data-motion-ratio]').forEach((button) => button.addEventListener('click', () => { state.motion.ratio = button.dataset.motionRatio; $$('.ratio-button[data-motion-ratio]').forEach((item) => item.classList.toggle('is-selected', item === button)); renderMotionPreview(); persist(); }));
    ['#sceneTextInput','#sceneStartInput','#sceneEndInput','#sceneTemplateSelect','#scenePositionSelect','#sceneScaleInput'].forEach((selector) => $(selector).addEventListener('input', updateSelectedCue));
    $('#deleteSceneBtn').addEventListener('click', () => { const cue = getSelectedCue(); if (!cue) return; state.motion.cues = state.motion.cues.filter((item) => item.id !== cue.id); state.motion.selectedCueId = state.motion.cues[0] && state.motion.cues[0].id; renderMotion(); persist(); toast('장면을 삭제했습니다.'); });
    $('#exportMotionBtn').addEventListener('click', () => { downloadJson('avvm-motion-project.json', motionExportData()); toast('모션 프로젝트 JSON을 내보냈습니다.'); });
    $$('.filter-button').forEach((button) => button.addEventListener('click', () => { selectedTemplateFilter = button.dataset.templateFilter; renderTemplates(); }));
    $('#exportCampaignJsonBtn').addEventListener('click', () => { downloadJson('avvm-campaign-pack.json', campaignPack()); toast('Campaign Pack JSON을 내보냈습니다.'); });
    $('#exportBrandJsonBtn').addEventListener('click', () => { downloadJson('brand-system.json', brandSystemData()); toast('brand-system.json을 내보냈습니다.'); });
    $('#clearVersionsBtn').addEventListener('click', () => { localStorage.removeItem(VERSION_KEY); renderVersionHistory(); toast('표시된 버전 기록을 초기화했습니다.'); });
    document.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); generateCampaign(); }
      if (event.key >= '1' && event.key <= '7' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { setView(['dashboard','brand','campaign','logo','motion','templates','exports'][Number(event.key) - 1]); }
      if (event.code === 'Space' && $('#view-motion').classList.contains('is-active') && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { event.preventDefault(); toggleMotionPlayback(); }
    });
  }

  function init() {
    ensureCues();
    setValue('#campaignPrompt', state.campaign.prompt);
    renderRecentProjects(); renderSources(); renderTokenControls(); renderChat(); renderCampaignCanvas(); renderLogoStudio(); renderMotion(); renderTemplates(); renderVersionHistory(); bindEvents(); persist();
  }

  init();
}());
