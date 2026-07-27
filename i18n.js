/* AVVM multilingual UI: shared by the home page and the order-detail page. */
(function () {
  'use strict';

  const STORAGE_KEY = 'avvmLang';
  const LANGUAGE_META = window.AVVM_LANGUAGE_META || {
    ko: { htmlLang: 'ko', dir: 'ltr' }, en: { htmlLang: 'en', dir: 'ltr' }
  };
  const savedLanguage = localStorage.getItem(STORAGE_KEY);
  let language = LANGUAGE_META[savedLanguage] ? savedLanguage : 'ko';

  const en = {
    heroEyebrow: 'THE AI VIDEO VENDING MACHINE', heroSub: 'Premium commercial videos from a single image.', baInputLabel: 'INPUT · 30-YEAR-OLD PHOTO', baOutputLabel: 'OUTPUT · KKAMSOONI RUNS AGAIN', baProcessTop: 'AI MEMORIAL REMASTER', baProcessBottom: 'STILL PAST → RUNNING MEMORY', baCaseNote: 'One frozen photo. A memory running back to you.', kkamsooniPhoto: 'KKAMSOONI · 30 YEARS AGO', kkamsooniMotion: '🐕 KKAMSOONI, NOW IN MOTION', webStudioEyebrow: 'SISTER BRAND · WEB-STUDIO', webStudioTitle: 'WATCH. JEWELRY.<br>LIFESTYLE.', webStudioCopy: 'WEB-STUDIO curates watches, jewelry, and elevated lifestyle objects through one clear point of view. Discover the sister brand’s promotional film here.', webStudioPending: 'VISIT WEB-STUDIO ↗', proofLabEyebrow: 'RESULT PREVIEW LIBRARY', proofLabTitle: 'YOUR PHOTO,<br>WITH PROOF.', proofLabCopy: 'See the result range first. Every example places a real input image next to its AVVM production result.', proofPortraitName: 'PORTRAIT EDITORIAL', proofPortraitCopy: 'Turn an everyday portrait into a short luxury fashion-campaign film.', proofPortraitInput: 'Everyday portrait', proofPortraitOutput: 'Fashion editorial film', proofMemorialName: 'MEMORIAL RESTORATION', proofMemorialCopy: 'Let a presence in an old photograph move again as a living memory.', proofMemorialInput: 'Old black-and-white photo', proofMemorialOutput: 'A memory in motion', proofProductName: 'PRODUCT ADVERTISING', proofProductCopy: 'Produce an advertising film with light and camera movement from a simple product photo.', proofProductInput: 'Standard product photo', proofProductOutput: 'Luxury advertising film', proofProfileName: 'ID · PROFILE', proofProfileCopy: 'Keep the person’s identity while refining background, wardrobe, and lighting for the right profile use.', proofProfileInput: 'Everyday portrait', proofProfileOutput: 'Refined profile photo', proofBeautyName: 'BEAUTY ADVERTISING', proofBeautyCopy: 'Turn a basic product photo into a beauty film with texture, light, and camera movement.', proofBeautyInput: 'Basic product photo', proofBeautyOutput: 'Liquid beauty film', proofFoodName: 'FOOD ADVERTISING', proofFoodCopy: 'Create a short menu or brand film that brings out food texture and warmth.', proofFoodInput: 'Everyday food photo', proofFoodOutput: 'Cinematic food film', proofTravelName: 'TRAVEL TRANSFORM', proofTravelCopy: 'Turn one portrait into a short reel with a new destination and style.', proofTravelInput: 'Everyday portrait', proofTravelOutput: 'Travel cinema reel', proofWeddingName: 'WEDDING FILM', proofWeddingCopy: 'Build a wedding mood film from one portrait by refining wardrobe, space, and light.', proofWeddingInput: 'Everyday portrait', proofWeddingOutput: 'Wedding editorial film', proofLabNotice: 'These are real production examples for reference. Results vary with the source photo’s focus, light, composition, and selected style; AVVM reviews quality before final delivery.',
    startProject: 'START PROJECT ↗', viewShowreel: 'VIEW SHOWREEL', scrollExplore: 'SCROLL TO EXPLORE',
    beforeAfterCopy: 'Upload one image and AVVM turns it into a commercial-grade cinematic result.',
    demoEyebrow: 'IMAGE TO CINEMA', demoTitle: 'FROM ONE IMAGE<br>TO A COMMERCIAL VIDEO.',
    demoCopy: 'A representative demo where a single image becomes a branded commercial video with cinematic scenes and motion.',
    demoChip1: 'IMAGE BASED', demoChip2: 'CINEMATIC MOTION', demoChip3: 'COMMERCIAL READY', watchTransformation: 'WATCH TRANSFORMATION ↗',
    beautyCopy: 'A 15-second beauty commercial sample with liquid motion, clear light-blue tones, skin close-ups, and product-focused cuts.',
    speedTitle: 'AI SPEED.<br>HUMAN FINISH.', keepTitle: 'KEEP THE<br>PRODUCT RIGHT.', tryTitle: 'TRY BEFORE<br>FULL ORDER.',
    portfolioKicker: 'Portfolio expansion', portfolioTitle: '9 SECTORS.<br>ONE ENGINE.',
    portfolioCopy: 'AVVM spans nine sectors: beauty, automotive, culture, business, festivals, story, metaverse, music video, and action.',
    portAuto: 'An automotive sample with aerial tracking, high-speed cornering, and race energy.',
    portHeritage: 'A culture and tourism sample that combines traditional craftsmanship with future technology.',
    portBusiness: 'A short business-film sample for companies, services, and startups.',
    portBeauty: 'A beauty-campaign sample built around expression, skin texture, and sculpted light.',
    portFestival: 'An event-film sample for fireworks, night events, and local festivals.',
    portStory: 'A lifestyle and story sample that highlights human emotion and atmosphere.',
    portMetaverse: 'A metaverse sample connecting local cultural symbols with a digital network.',
    portMusicVideo: 'A music-video sample with stage performance, rhythmic movement, and dramatic lighting.',
    portAction: 'An experimental action sample with fighting, pursuit, and tense transitions.',
    includedTitle: 'WHAT IS<br>INCLUDED?', consumerKicker: 'For everyone · sticker-photo price', consumerTitle: 'ONE PHOTO,<br>NEW WORLD.',
    consumerCopy: 'Upload one great photo. Turn an everyday image into an overseas landmark, Instagram aesthetic, or fashion-model mood video.',
    travelJumpTitle: 'Jump to global landmarks', travelJumpCopy: 'Expand a seated photo into a global-mood video set in Paris, New York, Santorini, Tokyo, and more.',
    fashionSwitchTitle: 'Switch into a model look', fashionSwitchCopy: 'Transform everyday clothing into a polished fashion-editorial mood, including hair, shoes, and bags.',
    walkTransformTitle: 'Transform in one step', walkTransformCopy: 'As you walk, flip a bag, and turn your head, outfit, accessories, hair, and sunglasses switch at once.',
    miniCopy: '5 seconds / 1 style / a lightweight sticker-photo-style transformation', basicConsumerCopy: '9 seconds / 1 style / a solid SNS transformation',
    bestConsumerCopy: 'About 10 seconds (9 seconds) / travel + fashion mood / stronger TikTok-style transition', setConsumerCopy: 'Three styles at once: travel, fashion, and walking transformations.',
    tryNow: 'TRY NOW', startTransform: 'START TRANSFORM', chooseBest: 'CHOOSE BEST', getSet: 'GET SET',
    promptBoxTitle: 'Hot Transform Styles', promptBoxCopy: 'We made popular short-form transformation prompts easy to choose.',
    prompt1: 'Fashion Glow Up: transform an everyday look into a model-style outfit', prompt2: 'World Travel Transform: turn one photo into a global-destination reel', prompt3: 'Bag Flip Walk: flip a bag and turn your head for a full fashion change',
    starterUse: 'Fast short-form advertising', starterItem1: 'One cinematic video', starterItem2: 'Choose ratio: 9:16 / 16:9 / 1:1', starterItem3: 'Choose resolution: 540p / 720p / 1080p',
    proUse: 'For brand and product advertising', proItem1: 'One premium video', proItem2: 'Choose ratio: 9:16 / 16:9 / 1:1', proItem3: 'One revision included', proItem4: 'Choose resolution: 720p / 1080p',
    signatureUse: 'For advertising, showreels, and brand films', signatureItem1: 'One signature video', signatureItem2: 'Choose ratio: 9:16 / 16:9 / 1:1', signatureItem3: 'Two revisions included', signatureItem4: 'Choose resolution: 1080p / 4K', signatureItem5: 'Director-style review',
    commercialUse: 'Commercial use allowed', priorityWork: 'Priority production', bestSeller: 'Best Seller', start: 'Start',
    sizeChoiceNote: 'Choose 9:16, 16:9, or 1:1. Resolution is plan-dependent; 4K is available only for Signature or Custom.',
    pricingNote: 'Delivery: Starter 24–48 hours, Pro 2–3 business days, Signature 3–5 business days. Timing may vary with image quality, revisions, and 4K. All payments are in KRW.',
    catBeauty: 'Beauty', catProduct: 'Product', catFood: 'Food', catTravel: 'Travel', catWedding: 'Wedding', catCustom: 'Custom', catPersonal: 'Transform',
    modalEyebrow: 'START PROJECT', modalTitle: 'INSERT IMAGE.<br>PRESS START.', aspectTitle: 'Aspect Ratio', resolutionTitle: 'Resolution',
    autoKo1: 'AI creates the first draft; a specialist polishes it for commercial quality.', autoKo2: 'Includes review to reduce distortion of product shape, logos, and labels.', autoKo3: 'Payments are processed in Korean won (KRW).', autoKo4: 'The avvm.studio domain and business-information area are ready.',
    autoKo5: 'AVVM is not a random one-click generator. AI quickly creates a draft, then a human checks commercial quality, brand feel, and visual errors before delivery.',
    autoKo6: 'The vending-machine name means ordering is simple and fast. Results are delivered after specialist review.', autoKo7: 'Our delivery standard includes AI rendering, style polish, and product/logo consistency checks.', autoKo8: 'AI results vary with image quality and style; final review is recommended before commercial use.',
    autoKo9: 'The biggest risk in AI video is broken logos, labels, and packaging. AVVM prioritizes product shape, color, brand impression, and label readability.',
    autoKo10: 'If a label or logo is seriously distorted, we regenerate or replace the cut.', autoKo11: 'We check that bottles, packages, food, and product silhouettes remain faithful to the source.', autoKo12: 'We prioritize the clarity and trust needed for a video that sells, not merely a pretty AI video.',
    autoKo13: 'A future preview space will let you upload a product image, see a quick low-resolution watermarked preview, and continue only when you like it.', autoKo14: 'The MVP starts with sample showreels and consultation-based orders. A free preview is planned next.', autoKo15: 'We clearly explain BGM, sound effects, subtitles, copy, and voice options alongside video length and quality.',
    autoKo16: 'Choose 9:16 / 16:9 / 1:1', autoKo17: 'Choose 9:16 / 16:9 / 1:1', autoKo18: 'Choose 9:16 / 16:9 / 1:1', autoKo19: 'Choose 540p / 720p / 1080p', autoKo20: 'Choose 720p / 1080p', autoKo21: 'Choose 1080p / 4K',
    autoKo22: 'About 10 seconds (9 seconds)', autoKo23: 'About 10 seconds (9 seconds)', autoKo24: '15 seconds', autoKo25: '15 seconds', autoKo26: '30 seconds', autoKo27: '30 seconds',
    autoKo30: 'Your order flow is ready. Until live payment is connected, the order draft is saved in this browser.', autoFinal2: 'We will notify you when the video is ready; you can also check it through the link.', autoFinal3: 'OPEN ORDER LINK', autoFinal4: 'Received', autoFinal5: 'Queued', autoFinal6: 'Under review', autoFinal7: 'Complete',
    paymentOpening: 'Opening payment window...', optimizingImage: 'Optimizing image...', attachPhoto: 'Attach photo', acceptedImageTypes: 'JPG, PNG, or WEBP image file', imageRequired: 'Please attach a photo for video generation.', imageType: 'Only JPG, PNG, or WEBP images are supported.', imageSize: 'Please choose an original image smaller than 15MB.',
    planContact: 'Custom plans proceed with a quote after consultation.', amountError: 'We could not confirm the payment amount.', paymentClosed: 'The payment window was closed. Please try again.', paymentFailed: 'The payment was cancelled or failed.', paymentComplete: 'Payment completed. Registering your order.',
    orderStarting: 'Starting order registration ✓', orderComplete: 'Order registered ✓', uploadingImage: 'Connecting to the server and uploading your image...', uploadingImageHint: 'Sending optimized image data to Fal.ai...',
    requestFailed: 'VIDEO GENERATION REQUEST FAILED', retryGeneration: 'Retry generation', retrying: 'Requesting the video again...', statusQueued: 'Entering the queue', statusProcessing: 'Rendering video frames...', statusCompleted: 'Video complete!', statusFailed: 'Video generation failed',
    orderReceived: 'Order received', orderProcessing: 'Video in production', orderCompleteStatus: 'Production complete', orderFailed: 'Production failed', backHome: 'BACK TO HOME'
  };

  Object.assign(en, {
    proofClassicName: 'CLASSIC PORTRAIT RESTORATION',
    proofClassicCopy: 'Preserve the texture and expression of a black-and-white portrait while bringing it back into motion.',
    proofClassicInput: 'Original classic portrait',
    proofClassicOutput: 'Restored cinematic motion',
    webStudioLogoTransform: 'ORIGINAL LOGO → CRYSTAL TRANSFORM',
    webStudioJewelryFilm: 'JEWELRY CAMPAIGN FILM',
    webStudioWatchFilm: 'WATCH MECHANISM FILM',
    memorialLaunchNotice: '[NEW] <b>Memorial Restoration</b> is here. Restore cherished old photos and beloved pet memories ↗',
    memorialNavTag: 'MEMORIAL',
    beautyFlowKicker: 'DIRECTION FLOW',
    beautyFlowTitle: 'A 15-second beauty film shaped with polished direction',
    beautyFlowSceneLabel: 'SCENE / CONTENT',
    beautyFlowPromptLabel: 'VIDEO PROMPT',
    beautyFlowTime1: 'TIME 00:00–00:05',
    beautyFlowScene1: 'The product arrives over clear ripples as transparent blue light sets the opening mood.',
    beautyFlowPrompt1: 'Glass-like reflections, a restrained camera push-in, and a premium skincare-campaign mood.',
    beautyFlowTime2: 'TIME 00:05–00:10',
    beautyFlowScene2: 'Water texture and skin close-ups continue the clean, sensorial product story.',
    beautyFlowPrompt2: 'Soft slow motion, fresh hydration, and the rhythm of a refined beauty film.',
    beautyFlowTime3: 'TIME 00:10–00:15',
    beautyFlowScene3: 'A composed product end frame leaves a clear, lasting brand impression.',
    beautyFlowPrompt3: 'Stable product form, clean negative space, and a quiet yet luxurious finish.',
    worksKicker: 'CHOOSE A PRODUCTION TYPE',
    worksTitle: 'WHAT DO YOU<br>WANT TO MAKE?',
    worksIntro: 'See a verified result first, then start the production route that fits your photo.',
    worksViewAll: 'VIEW VERIFIED RESULTS ↗',
    worksProductTitle: 'PRODUCT AD',
    worksProductCopy: 'Turn one product photo into a 15-second premium advertising film.',
    worksAutomotiveTitle: 'AUTOMOTIVE FILM',
    worksAutomotiveCopy: 'Build a film with driving energy and brand character from a vehicle photo.',
    worksBeautyTitle: 'BEAUTY AD',
    worksBeautyCopy: 'Turn one product photo into a beauty ad with light, texture, and mood.',
    worksTravelTitle: 'TRAVEL TRANSFORM',
    worksTravelCopy: 'Turn one portrait into a short transformation reel set in a new destination.',
    worksWeddingTitle: 'WEDDING FILM',
    worksWeddingCopy: 'Create a wedding film shaped by wardrobe, space, and light from one portrait.',
    worksPetTitle: 'PET MEMORIAL',
    worksPetCopy: 'Restore a cherished pet photo into a memory that moves again.',
    worksResult: 'VIEW REAL RESULT ↗',
    worksStart: 'MAKE MINE ↗'
  });

  const ko = {
    footerService: '서비스', footerTerms: '이용약관', footerPrivacy: '개인정보처리방침', footerRefund: '환불정책', footerDelivery: '디지털 제공 안내', footerBusiness: '사업자 정보',
    paymentOpening: '결제창을 여는 중...', optimizingImage: '사진 최적화 중...', attachPhoto: '사진 첨부하기', acceptedImageTypes: 'JPG, PNG, WEBP 등 이미지 파일', imageRequired: '영상 제작에 사용할 사진을 첨부해주세요.', imageType: 'JPG, PNG 또는 WEBP 형식의 사진만 사용할 수 있습니다.', imageSize: '사진 원본은 15MB 이하로 선택해주세요.',
    planContact: 'Custom 플랜은 상담 후 견적으로 진행됩니다.', amountError: '결제 금액을 확인할 수 없습니다.', paymentClosed: '결제창이 닫혔습니다. 다시 시도해주세요.', paymentFailed: '결제가 취소되었거나 실패했습니다.', paymentComplete: '결제가 완료되었습니다. 주문을 접수합니다.',
    orderStarting: '주문 접수 시작 ✓', orderComplete: '주문 접수 완료 ✓', uploadingImage: '서버 연결 및 이미지 업로드 중...', uploadingImageHint: 'Fal.ai CDN으로 사진 데이터를 전송하고 있습니다.', requestFailed: '영상 제작 요청 실패', retryGeneration: '재시도', retrying: '영상을 다시 요청하는 중...', statusQueued: '대기열 진입 중', statusProcessing: '영상 프레임 렌더링 중...', statusCompleted: '영상 제작 완료!', statusFailed: '영상 제작에 실패했습니다.',
    orderReceived: '주문 접수 완료', orderProcessing: '영상 제작 중', orderCompleteStatus: '제작 완료', orderFailed: '제작 실패', backHome: '홈페이지로 돌아가기'
  };

  function isKorean() { return language === 'ko'; }

  function t(key, fallback) {
    if (isKorean()) return ko[key] || fallback || key;
    const locale = (window.AVVM_LOCALES || {})[language] || {};
    return locale[key] || en[key] || fallback || key;
  }

  function setText(node, value) { if (node && value != null) node.textContent = value; }
  function setHtml(node, value) { if (node && value != null) node.innerHTML = value; }

  const autoTextNodes = [];

  function normalizeTranslationKey(value) {
    return String(value || '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  function autoMap() {
    return (window.AVVM_AUTO_TRANSLATIONS || {})[language] || {};
  }

  function autoText(source, fallback) {
    if (isKorean()) return source;
    const key = normalizeTranslationKey(source);
    const translated = autoMap()[key] || autoMap()[String(source || '').trim()];
    return translated || fallback || source;
  }

  function autoHtml(source, fallback) {
    if (isKorean()) return source;
    const wrapped = `<span>${source || ''}</span>`;
    let translatedAny = false;
    const translated = wrapped.replace(/>([^<>]+)</g, (match, text) => {
      const leading = (text.match(/^\s*/) || [''])[0];
      const trailing = (text.match(/\s*$/) || [''])[0];
      const value = text.slice(leading.length, text.length - trailing.length);
      const replacement = autoText(value, value);
      if (replacement !== value) translatedAny = true;
      return `>${leading}${replacement}${trailing}<`;
    });
    if (translatedAny) return translated.slice(6, -7);
    return autoText(source, fallback || source);
  }

  function captureAutoTextNodes() {
    if (autoTextNodes.length || !document.body || !window.NodeFilter) return;
    const walker = document.createTreeWalker(document.body, window.NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      const original = node.nodeValue || '';
      if (!parent || !normalizeTranslationKey(original)) continue;
      if (parent.closest('script, style, svg, canvas, option, textarea, [data-i18n], [data-i18n-auto], [data-i18n-exempt]')) continue;
      autoTextNodes.push({ node, original });
    }
  }

  function applyAutoTextNodes() {
    autoTextNodes.forEach(({ node, original }) => {
      if (!node.isConnected) return;
      if (isKorean()) { node.nodeValue = original; return; }
      const leading = (original.match(/^\s*/) || [''])[0];
      const trailing = (original.match(/\s*$/) || [''])[0];
      const value = original.slice(leading.length, original.length - trailing.length);
      node.nodeValue = `${leading}${autoText(value, value)}${trailing}`;
    });
  }

  const helpEnglish = {
    help1: 'Start a project by uploading an image and entering order information.',
    help2: 'Upload a photo and choose a style to begin the order flow.',
    help3: 'View AVVM sample films at a larger size.',
    help4: 'A real Memorial example: the old photo on the left is restored as motion on the right.',
    help5: 'Upload a photo and choose a style to begin the order flow.',
    help6: 'This is a production service: AI creates a draft and a human checks the final quality.',
    help7: 'Final review helps reduce AI-specific errors such as distorted product shapes and logos.',
    help8: 'Foreign-currency displays are reference only; payment and refund standards use KRW.',
    help9: 'The official domain and business information are provided to increase payment trust.',
    help10: 'Play a demo where one photo becomes a cinematic scene.',
    help11: 'A representative demo of an input image becoming a cinematic scene.',
    help12: 'View the action-transformation sample at a larger size.',
    help13: 'Play a beauty and skincare advertising sample.',
    help14: 'A 15-second beauty-ad sample featuring ripples, product shots, and skin close-ups.',
    help15: 'View the beauty sample at a larger size.',
    help16: 'The vending-machine name means ordering is simple; results are delivered after review.',
    help17: 'We check AI results for issues such as awkward hands, broken text, and product distortion.',
    help18: 'The source image guides the result, but AI cannot guarantee a 100% identical reproduction.',
    help19: 'Upload a photo in the order flow to check source resolution, exposure, and visible detail before payment.',
    help20: 'An F1 racing and aerial-drive sample for automotive and sports brands.',
    help21: 'A culture and tourism sample where traditional craftsmanship expands into a future-city mood.',
    help22: 'Suitable for corporate, startup, and service-introduction videos.',
    help23: 'A sample for festivals, local events, and event promotion.',
    help24: 'A sample for emotional drama, lifestyle, and brand-story videos.',
    help25: 'A metaverse expansion sample built around regional culture and network imagery.',
    help26: 'A music-video sample with stage performance, rhythmic movement, and lighting direction.',
    help27: 'A short-form video suitable for fast testing and social-media advertising.',
    help28: 'A premium 15-second video recommended for brand and product advertising.',
    help29: 'A 30-second signature video for showreels, brand films, and premium advertising.',
    help30: 'This opens the KPN test payment window using your order information. For review, close the window without completing payment.'
  };

  Object.assign(en, helpEnglish);

  function localized(selector, englishValue, useHtml) {
    document.querySelectorAll(selector).forEach(node => {
      const attribute = useHtml ? 'data-avvm-ko-html' : 'data-avvm-ko-text';
      if (!node.hasAttribute(attribute)) node.setAttribute(attribute, useHtml ? node.innerHTML : node.textContent);
      const original = node.getAttribute(attribute);
      if (!isKorean()) (useHtml ? setHtml : setText)(node, useHtml ? autoHtml(original, englishValue) : autoText(original, englishValue));
      else (useHtml ? setHtml : setText)(node, original);
    });
  }

  function localizedKey(selector, key, englishValue, useHtml) {
    document.querySelectorAll(selector).forEach(node => {
      const attribute = useHtml ? 'data-avvm-ko-html' : 'data-avvm-ko-text';
      if (!node.hasAttribute(attribute)) node.setAttribute(attribute, useHtml ? node.innerHTML : node.textContent);
      const original = node.getAttribute(attribute);
      const locale = (window.AVVM_LOCALES || {})[language] || {};
      const value = isKorean() ? original : (locale[key] || (useHtml ? autoHtml(original, englishValue) : autoText(original, englishValue)));
      (useHtml ? setHtml : setText)(node, value);
    });
  }

  function applyStaticPageCopy() {
    localizedKey('.quick-nav-item[href="#id-profile"] .nav-sub-tag', 'quickProfileTag', 'ID PHOTO');
    localizedKey('.service-card:nth-of-type(1) p', 'serviceCommercialCopy', 'High-resolution brand advertising and product-showreel videos from one photo.');
    localizedKey('.service-card:nth-of-type(2) p', 'servicePersonalCopy', 'Turn everyday photos into travel short-form reels or trend-forward fashion films.');
    localizedKey('.service-card:nth-of-type(3) p', 'serviceMemorialCopy', 'Restore memories of family, parents, and beloved pets as moving video.');
    localizedKey('.service-card:nth-of-type(4) p', 'serviceIdCopy', 'High-quality digital photos for passports, licences, employee IDs, and profiles without a studio visit.');
    localizedKey('[data-plan-choice="Custom"] strong', 'customQuote', 'Custom quote');
    localizedKey('[data-plan-choice="Memorial Basic"] .plan-choice-tag, [data-plan-choice="ID Set"] .plan-choice-tag', 'recommended', 'Recommended');
  }

  function applyHelpText() {
    document.querySelectorAll('[data-help-key]').forEach(node => {
      if (!node.dataset.helpKo) node.dataset.helpKo = node.dataset.help || '';
      node.dataset.help = isKorean() ? node.dataset.helpKo : t(node.dataset.helpKey, helpEnglish[node.dataset.helpKey] || node.dataset.helpKo);
    });
  }

  function applyMarkedText() {
    document.querySelectorAll('[data-i18n], [data-i18n-auto]').forEach(node => {
      const key = node.dataset.i18n || node.dataset.i18nAuto;
      if (!node.dataset.avvmKoHtml) node.dataset.avvmKoHtml = node.innerHTML;
      const locale = (window.AVVM_LOCALES || {})[language] || {};
      if (!isKorean()) node.innerHTML = locale[key] || autoHtml(node.dataset.avvmKoHtml, en[key] || node.dataset.avvmKoHtml);
      else node.innerHTML = node.dataset.avvmKoHtml;
    });
  }

  function applyFooterAndCheckout() {
    const footerLinks = ['Service', 'Terms', 'Privacy', 'Refund', 'Delivery', 'Business'];
    const footerKeys = ['footerService', 'footerTerms', 'footerPrivacy', 'footerRefund', 'footerDelivery', 'footerBusiness'];
    document.querySelectorAll('.footer-links a').forEach((node, index) => {
      if (!node.dataset.avvmKoText) node.dataset.avvmKoText = node.textContent;
      setText(node, isKorean() ? t(footerKeys[index], node.dataset.avvmKoText) : autoText(node.dataset.avvmKoText, footerLinks[index]));
    });
    localized('.business-info', `
      <b>AVVM.studio business information</b><br>
      Business name: Lalaland Mom · Brand: AVVM.studio · Representative: Dongkuk Yoon<br>
      Business registration no.: 347-37-01807 · Mail-order sales registration: 2026-Gyeonggi Paju-2862<br>
      Contact: 0505-007-5221 · Email: airyoon72@naver.com · Domain: avvm.studio<br>
      Business address: 2F, Unit 02, Building B, 182-37 Miraero 310beon-gil, Paju-si, Gyeonggi-do, Republic of Korea<br>
      This is a made-to-order digital-content service with no physical delivery. Payments are processed in KRW.<br>
      Delivery begins after payment and production materials are received. Transform products take 1–3 business days; 3 Style Set takes 3–7 business days; Starter 24–48 hours; Pro 2–3 business days; Signature 3–5 business days. Memorial and ID/Profile products follow the 24–48 hour period shown on their cards.<br>
      Payment processing and personal-information handling are entrusted to PortOne Co., Ltd. for payment processing, payment-result confirmation, and settlement.<br>
      <a href="#" data-legal="service">Service / product information</a> · <a href="#" data-legal="delivery">Digital-delivery guide</a> · <a href="#" data-legal="terms">Terms</a> · <a href="#" data-legal="privacy">Privacy policy</a> · <a href="#" data-legal="refund">Refund policy</a> · <a href="#" data-legal="pg">PG review information</a>`, true);

    localized('.plan-chooser-head .mini-eyebrow', 'CHOOSE YOUR START');
    localized('.plan-chooser-head h3', 'Choose the type of production you want first.');
    localized('.plan-chooser-head p', 'After pressing Start, choose the product you want before entering payment information.');
    ['Personal / SNS', 'Business / advertising', 'Memorial restoration', 'ID / profile'].forEach((value, index) => localized(`.plan-choice-section:nth-child(${index + 1}) .plan-choice-kicker`, value));
    const planCopy = {
      'Mini Transform': '5 seconds / 1 style / easy first try', 'Basic Transform': '9 seconds / basic SNS transformation', 'Best Transform': 'About 10 seconds (9 seconds) / travel + fashion mood',
      '3 Style Set': 'Travel, fashion, and walking transformation set', 'Starter': 'About 10 seconds (9 seconds) / fast short-form ad', 'Pro': '15 seconds / brand-product ad / one revision',
      'Signature': '30 seconds / showreel-brand film / two revisions', 'Custom': 'Contest, film-festival, and large-brand videos', 'Memorial Basic': 'Restore one photo / one regeneration',
      'Memorial Duo': 'Two-photo video set / one regeneration', 'ID Mini': 'One of passport, resident ID, licence, or résumé', 'ID Set': 'All four formats: passport, resident ID, licence, résumé', 'Profile Pro': 'Premium retouching for employment, ID, and business profiles'
    };
    Object.entries(planCopy).forEach(([plan, value]) => localized(`[data-plan-choice="${plan}"] small`, value));

    localized('#photoUploadVisibleBlock .order-form-section-title', '1. Upload the photo to produce');
    localized('#photoUploadVisibleBlock .order-form-helper', 'Attach your photo or product image. A photo is required before payment to start video production.');
    localized('.photo-upload-drop b', 'Attach photo'); localized('.photo-upload-drop small', 'JPG, PNG, or WEBP image file');
    localized('#uploadGuideBox', '💡 <b>Passport guide:</b> Upload a front-facing photo with a plain background and visible ears.', true);
    localized('#idSpecGroup .order-option-title', 'Choose format');
    [['여권', 'Passport'], ['주민등록증', 'Resident ID'], ['운전면허', 'Driver licence'], ['이력서', 'Résumé']].forEach(([value, copy]) => localized(`#idSpecGroup [data-value="${value}"]`, copy));
    localized('.style-select-block .order-form-section-title', '2. Choose a video style'); localized('.style-select-block .order-form-helper', 'Choose the AI direction and style to apply to your photo.');
    localized('.delivery-info-block .order-form-section-title', '3. Enter delivery contact details'); localized('.delivery-info-block .order-form-helper', 'We will send the completed-video download link by email, KakaoTalk, or SMS.');
    localized('label[for="brandInput"]', 'Name / brand <span>*</span>', true); localized('label[for="emailInput"]', 'Email address'); localized('label[for="phoneInput"]', 'Mobile number <span>*</span>', true);
    [['#brandInput', 'Enter your name or brand'], ['#emailInput', 'Email for the video download link'], ['#phoneInput', 'Mobile number for KakaoTalk/SMS delivery'], ['#moodInput', 'Additional requests or video description (optional)']].forEach(([selector, value]) => {
      const node = document.querySelector(selector); if (!node) return;
      if (!node.dataset.avvmKoPlaceholder) node.dataset.avvmKoPlaceholder = node.placeholder;
      node.placeholder = !isKorean() ? value : node.dataset.avvmKoPlaceholder;
    });
    localized('.checkout-notice', `<p class="test-mode-note"><b>PG review test mode is currently active.</b><br>This button opens the KPN test payment window. Live payment completion is enabled only after PG approval and server verification are connected.</p><b>Before payment</b><p>This product is made-to-order digital content based on your image. Cancellation or refund for a change of mind may be limited after production starts.</p><p><b>Service period:</b> Delivery begins after payment and production materials are received. Transform products take 1–3 business days; 3 Style Set takes 3–7 business days; Starter 24–48 hours; Pro 2–3 business days; Signature 3–5 business days. Memorial and ID/Profile products follow the period shown on their cards.</p><p>You must have rights to use uploaded photos, logos, product images, and portraits. We do not accept impersonation, identity deception, or unauthorized commercial-use requests.</p>`, true);
    const consentCopy = [
      '<b>[Required] Consent to collect and use personal information</b><br>I consent to the collection and use of my name, phone number, email, uploaded image, and order information for order handling and delivery.',
      '<b>[Required] Consent to receive order updates</b><br>I consent to receive transaction-related notices, including order receipt, production updates, and completion notices, by KakaoTalk, SMS, or email.',
      '<b>[Required] Custom digital-content and refund-limit acknowledgement</b><br>I understand this is made-to-order digital content based on my image and request, and cancellation or refund for a change of mind may be limited once production starts.',
      '<b>[Required] Image-use rights and portrait/copyright confirmation</b><br>I confirm that I have the rights to use uploaded photos, logos, product images, and portraits, and that I am not requesting impersonation, identity deception, or unauthorized commercial use.',
      '<b>[Optional] Marketing consent</b><br>I agree to receive events, discounts, new samples, and other marketing information by KakaoTalk, SMS, or email.'
    ];
    document.querySelectorAll('#consentGroup .consent-row span').forEach((node, index) => {
      if (!node.dataset.avvmKoHtml) node.dataset.avvmKoHtml = node.innerHTML;
      node.innerHTML = !isKorean() ? consentCopy[index] : node.dataset.avvmKoHtml;
    });
    localized('#resolutionGroup .order-form-helper', '4K is available only for Signature or Custom plans.');
    const submit = document.getElementById('submitOrder');
    if (submit && submit.getAttribute('aria-busy') !== 'true') setText(submit, !isKorean() ? 'TEST PAYMENT' : '테스트 결제하기');
    localized('#downloadOrder', 'DOWNLOAD VIDEO'); localized('#resetOrder', 'CREATE ANOTHER');
  }

  function applyLowerPageSections() {
    localized('.review-safe-note:not(#service-delivery-period)', '※ AVVM is not an instant automatic-generation tool. It is a made-to-order digital-content production service based on your image. After payment, we review the image, create an AI draft, check quality, and deliver the final result.', true);
    localized('#service-delivery-period', '<strong>Service period</strong><br>We deliver the finished result within the production period announced for each product after payment and production materials are received.<br>Mini, Basic, and Best Transform products take 1–3 business days; 3 Style Set takes 3–7 business days.<br>Starter takes 24–48 hours, Pro takes 2–3 business days, and Signature takes 3–5 business days.<br>Memorial and ID/Profile products follow the 24–48 hour period shown on their cards.<br>Timing may vary with source-image quality, additional materials, requests, or revisions. We will notify you if a delay is expected.', true);

    localized('#memorial .section-bar .view-all', 'A moment met again');
    localized('#memorial .memorial-copy', 'Beloved moments in old photographs can move again.<br>We restore cherished pets and family memories from faded film into a natural video.', true);
    localized('#memorial [data-plan="Memorial Basic"] > .badge', 'Recommended');
    localized('#memorial [data-plan="Memorial Basic"] > p', 'One photo → motion video (including quality restoration)');
    [
      'Natural motion direction from one photo',
      'Basic quality restoration and resolution upscaling',
      '<b>One regeneration included</b>',
      'Delivery: within 24 hours'
    ].forEach((copy, index) => localized(`#memorial [data-plan="Memorial Basic"] li:nth-child(${index + 1})`, copy, true));
    localized('#memorial [data-plan="Memorial Duo"] > p', 'Two-photo set for a richer memory');
    [
      'A different motion video from each of two photos',
      'Basic quality restoration and resolution upscaling',
      '<b>One regeneration included</b>',
      'Delivery: within 48 hours'
    ].forEach((copy, index) => localized(`#memorial [data-plan="Memorial Duo"] li:nth-child(${index + 1})`, copy, true));
    localized('.memorial-bottom-notice', '💡 AI restoration may differ from the original appearance. If you are not satisfied, we will support one regeneration according to the plan. Results are delivered after review.<br>You must have rights to use uploaded family, pet, and memorial photographs. Requests that infringe a third party’s portrait rights, copyright, or reputation may be declined.', true);

    localized('#id-profile .section-bar .view-all', 'ID and profile-photo file production');
    localized('#id-profile .id-copy', 'Prepare a submission-ready photo file from an existing photo, without visiting a photo studio.<br>We make JPG files tailored for passports, resident IDs, driver licences, résumés, employee IDs, and profiles.', true);
    localized('#id-profile [data-plan="ID Mini"] > p', 'One file in one selected format');
    [
      'A source-based file tailored to the selected specification',
      'Choose one: passport, resident ID, driver licence, or résumé',
      'Delivery: <b>within 24 hours</b>'
    ].forEach((copy, index) => localized(`#id-profile [data-plan="ID Mini"] li:nth-child(${index + 1})`, copy, true));
    localized('#id-profile [data-plan="ID Set"] > .badge', 'Recommended');
    localized('#id-profile [data-plan="ID Set"] > p', 'Passport, resident ID, driver licence, and résumé format set');
    [
      'A source-based file tailored to each specification',
      'Complete package of all four major submission formats',
      'Delivery: <b>within 24 hours</b>'
    ].forEach((copy, index) => localized(`#id-profile [data-plan="ID Set"] li:nth-child(${index + 1})`, copy, true));
    localized('#id-profile [data-plan="Profile Pro"] > p', 'Premium retouching for employment, ID, and business profiles');
    [
      'A source-based file tailored to the selected specification',
      'One-to-one detail retouching for skin, symmetry, lighting, and more',
      'Delivery: <b>within 48 hours</b>'
    ].forEach((copy, index) => localized(`#id-profile [data-plan="Profile Pro"] li:nth-child(${index + 1})`, copy, true));
    localized('.id-bottom-notice', '💡 Official passport, resident-ID, and driver-licence photographs may be accepted differently by each institution. AVVM supports specification matching, cropping, file-size adjustment, and natural retouching from the source image, but cannot guarantee final acceptance.<br>We do not process impersonation, identity deception, age alteration, face replacement, or creation of an identity different from a real person. If the source image is substantially below the required standard for focus, lighting, or background, production may not be possible; in that case, a full refund is provided.', true);
  }

  function applyOrderPage() {
    const card = document.querySelector('.order-card');
    if (!card) return;
    localized('.order-card > .section-title', 'Order details');
    const labels = ['Order ID', 'Name / brand', 'Email address', 'Mobile number', 'Selected plan', 'Price', 'Video style', 'Aspect ratio', 'Resolution'];
    document.querySelectorAll('.detail-row span:first-child').forEach((node, index) => {
      if (!node.dataset.avvmKoText) node.dataset.avvmKoText = node.textContent;
      node.textContent = isKorean() ? node.dataset.avvmKoText : autoText(node.dataset.avvmKoText, labels[index]);
    });
    localized('.image-preview-section .section-title', 'Uploaded production photo'); localized('.video-preview-section .section-title', 'Generated AI video'); localized('#emptyMsg', 'No image was attached.'); localized('.order-card > .btn', t('backHome'));
    const statusLabel = document.getElementById('statusLabel');
    if (statusLabel) {
      if (!statusLabel.dataset.avvmKoText) statusLabel.dataset.avvmKoText = statusLabel.textContent;
      setText(statusLabel, isKorean() ? statusLabel.dataset.avvmKoText : autoText(statusLabel.dataset.avvmKoText, t('orderReceived', 'Order received')));
    }
    const image = document.getElementById('orderImg'); if (image) image.alt = !isKorean() ? 'Uploaded photo' : '첨부된 제작 사진';
  }

  function status(status) {
    const map = { payment_completed: 'orderReceived', processing: 'orderProcessing', completed: 'orderCompleteStatus', failed: 'orderFailed', IN_QUEUE: 'statusQueued', IN_PROGRESS: 'statusProcessing', COMPLETED: 'orderCompleteStatus', FAILED: 'orderFailed' };
    return t(map[status] || 'orderReceived');
  }

  function apply(nextLanguage) {
    language = LANGUAGE_META[nextLanguage] ? nextLanguage : 'ko';
    localStorage.setItem(STORAGE_KEY, language);
    const meta = LANGUAGE_META[language];
    document.documentElement.lang = meta.htmlLang || language;
    document.documentElement.dir = meta.dir === 'rtl' ? 'rtl' : 'ltr';
    document.body?.setAttribute('dir-text', meta.dir === 'rtl' ? 'rtl' : 'ltr');
    applyMarkedText();
    applyStaticPageCopy();
    applyFooterAndCheckout();
    applyLowerPageSections();
    applyOrderPage();
    applyAutoTextNodes();
    applyHelpText();
    document.querySelectorAll('[data-avvm-language-select], #nativeLangSelect, #heroNativeLangSelect').forEach(select => { select.value = language; });
    document.dispatchEvent(new CustomEvent('avvm:languagechange', { detail: { language } }));
  }

  function init() {
    captureAutoTextNodes();
    document.querySelectorAll('[data-avvm-language-select], #nativeLangSelect, #heroNativeLangSelect').forEach(select => {
      select.addEventListener('change', event => apply(event.target.value));
    });
    apply(language);
  }

  window.AVVM_I18N = { t, apply, status, languages: LANGUAGE_META, get language() { return language; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
