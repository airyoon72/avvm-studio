/* AVVM multilingual UI: shared by the home page and the order-detail page. */
(function () {
  'use strict';

  const STORAGE_KEY = 'avvmLang';
  const LANGUAGE_META = window.AVVM_LANGUAGE_META || {
    ko: { htmlLang: 'ko', dir: 'ltr' }, en: { htmlLang: 'en', dir: 'ltr' }
  };
  const savedLanguage = localStorage.getItem(STORAGE_KEY);
  let language = LANGUAGE_META[savedLanguage] ? savedLanguage : 'ko';

  const footerLabels = {
    ko: ['서비스', '이용약관', '개인정보처리방침', '환불정책', '디지털 제공 안내', '사업자 정보'],
    en: ['Service', 'Terms', 'Privacy', 'Refund', 'Digital delivery', 'Business information'],
    ja: ['サービス', '利用規約', 'プライバシーポリシー', '返金ポリシー', 'デジタル提供案内', '事業者情報'],
    zh: ['服务', '使用条款', '隐私政策', '退款政策', '数字交付说明', '商家信息'],
    es: ['Servicio', 'Términos', 'Privacidad', 'Reembolsos', 'Entrega digital', 'Información comercial'],
    fr: ['Service', 'Conditions', 'Confidentialité', 'Remboursement', 'Livraison numérique', 'Informations commerciales'],
    de: ['Service', 'Nutzungsbedingungen', 'Datenschutz', 'Rückerstattung', 'Digitale Bereitstellung', 'Unternehmensinformationen'],
    pt: ['Serviço', 'Termos', 'Privacidade', 'Reembolso', 'Entrega digital', 'Informações comerciais'],
    hi: ['सेवा', 'नियम व शर्तें', 'गोपनीयता', 'रिफंड', 'डिजिटल डिलीवरी', 'व्यावसायिक जानकारी'],
    ar: ['الخدمة', 'الشروط والأحكام', 'الخصوصية', 'الاسترداد', 'التسليم الرقمي', 'معلومات الأعمال']
  };

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
    starterUse: 'Fast short-form advertising', starterItem1: 'One cinematic video', starterItem2: 'Choose ratio: 9:16 / 16:9 / 1:1', starterItem3: 'HD · 720p delivery included',
    proUse: 'For brand and product advertising', proItem1: 'One premium video', proItem2: 'Choose ratio: 9:16 / 16:9 / 1:1', proItem3: 'One revision included', proItem4: 'Full HD · 1080p delivery included',
    signatureUse: 'For advertising, showreels, and brand films', signatureItem1: 'One signature video', signatureItem2: 'Choose ratio: 9:16 / 16:9 / 1:1', signatureItem3: 'Two revisions included', signatureItem4: 'Full HD · 1080p master delivery', signatureItem5: 'Director-style review',
    commercialUse: 'Commercial use allowed', priorityWork: 'Priority production', bestSeller: 'Best Seller', start: 'Start',
    sizeChoiceNote: 'Choose 9:16, 16:9, or 1:1. Delivery quality is included and locked to each plan.',
    pricingNote: 'Delivery: Starter 24–48 hours, Pro 2–3 business days, Signature 3–5 business days. Timing may vary with source-image quality and revisions. All payments are in KRW.',
    catBeauty: 'Beauty', catProduct: 'Product', catFood: 'Food', catTravel: 'Travel', catWedding: 'Wedding', catCustom: 'Custom', catPersonal: 'Transform',
    modalEyebrow: 'START PROJECT', modalTitle: 'INSERT IMAGE.<br>PRESS START.', aspectTitle: 'Aspect Ratio', resolutionTitle: 'Resolution',
    autoKo1: 'AI creates the first draft; a specialist polishes it for commercial quality.', autoKo2: 'Includes review to reduce distortion of product shape, logos, and labels.', autoKo3: 'Payments are processed in Korean won (KRW).', autoKo4: 'The avvm.studio domain and business-information area are ready.',
    autoKo5: 'AVVM is not a random one-click generator. AI quickly creates a draft, then a human checks commercial quality, brand feel, and visual errors before delivery.',
    autoKo6: 'The vending-machine name means ordering is simple and fast. Results are delivered after specialist review.', autoKo7: 'Our delivery standard includes AI rendering, style polish, and product/logo consistency checks.', autoKo8: 'AI results vary with image quality and style; final review is recommended before commercial use.',
    autoKo9: 'The biggest risk in AI video is broken logos, labels, and packaging. AVVM prioritizes product shape, color, brand impression, and label readability.',
    autoKo10: 'If a label or logo is seriously distorted, we regenerate or replace the cut.', autoKo11: 'We check that bottles, packages, food, and product silhouettes remain faithful to the source.', autoKo12: 'We prioritize the clarity and trust needed for a video that sells, not merely a pretty AI video.',
    autoKo13: 'A future preview space will let you upload a product image, see a quick low-resolution watermarked preview, and continue only when you like it.', autoKo14: 'The MVP starts with sample showreels and consultation-based orders. A free preview is planned next.', autoKo15: 'We clearly explain BGM, sound effects, subtitles, copy, and voice options alongside video length and quality.',
    autoKo16: 'Choose 9:16 / 16:9 / 1:1', autoKo17: 'Choose 9:16 / 16:9 / 1:1', autoKo18: 'Choose 9:16 / 16:9 / 1:1', autoKo19: 'HD · 720p included', autoKo20: 'Full HD · 1080p included', autoKo21: 'Full HD · 1080p master included',
    styleStepTitle: '2. Choose your video direction', styleStepCopy: 'Choose a production field first, then narrow it down by mood and motion.', styleDetailTitle: 'Choose a detailed mood', styleDetailCopy: 'Only direction options that fit your selected field are shown.', motionTitle: 'Motion intensity', motionCopy: 'Choose one camera move to keep the result stable.', styleDirectionLabel: 'SELECTED DIRECTION', promptLibraryKicker: 'AVVM CURATED RECIPES', promptLibraryTitle: 'Search for the scene you want', promptLibraryCopy: 'Load a production-ready direction recipe, then add your own details.', promptSearchPlaceholder: 'e.g. watch, runway, classic photo, travel, pet', promptLibraryNote: 'Recipes prioritize source preservation and natural movement. Results vary with the photo and final review.', promptEditLabel: 'Add a direction request <span>(optional)</span>', moodPlaceholder: 'Add any scene, color, or mood you want to layer onto the selected direction.', resolutionIncluded: 'PLAN INCLUDED', resolutionHelper: 'Delivery quality is locked to your plan and confirmed through source-photo review.',
    autoKo22: 'About 10 seconds (9 seconds)', autoKo23: 'About 10 seconds (9 seconds)', autoKo24: '15 seconds', autoKo25: '15 seconds', autoKo26: '30 seconds', autoKo27: '30 seconds',
    autoKo30: 'Your order flow is ready. Until live payment is connected, the order draft is saved in this browser.', autoFinal2: 'We will notify you when the video is ready; you can also check it through the link.', autoFinal3: 'OPEN ORDER LINK', autoFinal4: 'Received', autoFinal5: 'Queued', autoFinal6: 'Under review', autoFinal7: 'Complete',
    paymentOpening: 'Opening payment window...', optimizingImage: 'Optimizing image...', attachPhoto: 'Attach photo', acceptedImageTypes: 'JPG, PNG, or WEBP image file', imageRequired: 'Please attach a photo for video generation.', imageType: 'Only JPG, PNG, or WEBP images are supported.', imageSize: 'Please choose an original image smaller than 15MB.',
    planContact: 'Custom plans proceed with a quote after consultation.', amountError: 'We could not confirm the payment amount.', paymentClosed: 'The payment window was closed. Please try again.', paymentFailed: 'The payment was cancelled or failed.', paymentComplete: 'Payment completed. Registering your order.',
    orderStarting: 'Starting order registration ✓', orderComplete: 'Order registered ✓', uploadingImage: 'Connecting to the server and uploading your image...', uploadingImageHint: 'Sending optimized image data to Fal.ai...',
    requestFailed: 'VIDEO GENERATION REQUEST FAILED', retryGeneration: 'Retry generation', retrying: 'Requesting the video again...', statusQueued: 'Entering the queue', statusProcessing: 'Rendering video frames...', statusCompleted: 'Video complete!', statusFailed: 'Video generation failed',
    orderReceived: 'Order received', orderProcessing: 'Video in production', orderCompleteStatus: 'Production complete', orderFailed: 'Production failed', backHome: 'BACK TO HOME'
  };

  Object.assign(en, {
    proofJewelryName: 'SKETCH ↔ JEWEL',
    proofJewelryCopy: 'Drag sideways to compare the sketch with the real ring photo, then see the finished ring in motion.',
    proofJewelryInput: 'Solitaire ring sketch',
    proofJewelryOutput: 'Diamond ring motion',
    proofJewelryDrag: '↔ DRAG SIDE TO SIDE TO COMPARE',
    worksDesignTitle: 'SKETCH DESIGN LAB',
    worksDesignCopy: 'Expand a sketch, product design, or one-word idea into a logo and motion direction.',
    worksDesignMeta: 'FROM ₩59,900 · DESIGN MOTION',
    catDesign: 'Design Lab',
    designPlanKicker: 'SKETCH · LOGO DESIGN',
    jewelryPlanName: 'Jewelry Motion',
    jewelryPlanCopy: 'Sketch or product image / 6–10 sec macro motion / Full HD',
    logoPlanName: 'Logo Lab',
    logoPlanCopy: 'Three logo directions / selected 6-sec motion logo / Full HD',
    designLabTitle: 'Start with a sketch or one word',
    designLabCopy: 'For jewelry, use a sketch or product image. For a logo, use a sketch or brand word. We shape the direction and carry it into motion.',
    designJewelryTitle: 'SKETCH → JEWELRY',
    designJewelryCopy: 'A believable macro film from your sketch or product image',
    designLogoTitle: 'WORD · SKETCH → LOGO',
    designLogoCopy: 'Three logo directions and a motion logo for the selected mark',
    logoWordLabel: 'WORD OR BRAND NAME FOR THE LOGO',
    logoWordPlaceholder: 'e.g. AVVM, LUMI, MY STUDIO',
    logoWordNote: 'With a word alone, we can create a base wordmark direction and start the motion-logo production.',
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
    worksStart: 'MAKE MINE ↗',
    authGoogleNav: 'GOOGLE LOGIN', authOptional: 'OPTIONAL SIGN-IN', authTitle: 'Start faster with Google', authCopy: 'We prefill your Google name and email for the order. You can still order without logging in.', authGoogle: 'Continue with Google', authSignedIn: 'Signed in', authSignOut: 'Sign out', authSignedOut: 'Signed out. You can continue as a guest.', authUnavailable: 'Google sign-in is not available yet. Please continue as a guest.', authError: 'We could not complete that request. Please try again.'
  });

  Object.assign(en, {
    heroSub: 'Start with one photo, a short prompt, or a small idea. AVVM directs, quality-checks, and delivers the finished film.',
    inputMethodKicker: 'CHOOSE YOUR INPUT', inputMethodTitle: 'Start with a photo, typing, or your voice.', inputMethodCopy: 'A photo anchors the result; words and voice turn your intention into a clear production brief.', inputMethodPhoto: 'ADD A PHOTO', inputMethodPhotoCopy: 'Source · product · sketch', inputMethodTyping: 'TYPE IT', inputMethodTypingCopy: 'Describe the scene you want', inputMethodVoice: 'SAY IT', inputMethodVoiceCopy: 'Speak your request aloud', inputMethodNotePhoto: 'A source photo gives AVVM the most stable production direction.', inputMethodNoteTyping: 'Write the desired scene, change, or mood. You can add a reference photo at any time.', inputMethodNoteVoice: 'Listening now. Your words will be added to the production-request field.', inputMethodVoiceUnavailable: 'Voice input is not supported in this browser. Please type your request instead.', inputMethodVoiceComplete: 'Your voice request has been added. Refine it or add a photo whenever you are ready.', inputMethodVoiceRetry: 'We could not hear a request. Try speaking again, or type it instead.',
    heroSystemKicker: 'AVVM PRODUCTION SYSTEM',
    heroSignalLive: 'HUMAN-LED · AI-POWERED',
    heroSignalStep1: 'UPLOAD PHOTO', heroSignalStep1Meta: 'SOURCE CHECK',
    heroSignalStep2: 'CHOOSE DIRECTION', heroSignalStep2Meta: 'CURATED DIRECTION',
    heroSignalStep3: 'REVIEW & DELIVER', heroSignalStep3Meta: 'AVVM QUALITY REVIEW',
    proofAssuranceKicker: 'REAL INPUT · REAL DELIVERY',
    proofAssuranceTitle: 'See the source first. See the result. See the standard behind it.',
    proofAssuranceCopy: 'AVVM is not a button-only generation screen. We assess the source, set a direction for its purpose, and review the result once more before delivery.',
    proofStandardInput: 'REAL INPUT', proofStandardInputMeta: 'Source-photo based',
    proofStandardDirection: 'ART DIRECTION', proofStandardDirectionMeta: 'Industry-ready directions',
    proofStandardReview: 'QUALITY REVIEW', proofStandardReviewMeta: 'Face · product · type checked',
    proofStandardDelivery: 'FINAL DELIVERY', proofStandardDeliveryMeta: 'Plan-specific delivery specs',
    proofSpecInput: 'INPUT', proofSpecInputValue: '1 IMAGE',
    proofSpecOutput: 'SAMPLE OUTPUT', proofSpecOutputValue: 'CINEMATIC RESULT',
    proofSpecReview: 'FINAL CHECK', proofSpecReviewValue: 'AVVM REVIEWED',
    commerceEyebrow: 'AVVM COMMERCE LAB',
    commerceTitle: 'A small-business ad studio<br/>that starts from a photo.',
    commerceCopy: 'Start with menu, product, or space photography—no crew required. Choose a direction tested for your business and make short-form films for launch and sales.',
    commerceSpotlightKicker: 'LOCAL LAUNCH / RESTAURANT',
    commerceSpotlightTitle: 'Opening a restaurant?<br/>Make the first ad feel worth the visit.',
    commerceSpotlightCopy: 'With one hero menu photo and a store image, we shape steam, texture, light, and a camera move into a concise launch film for Instagram, Kakao channels, or your store screen.',
    commerceSpotlightPoint1: 'Menu photo → tactile, appetite-led short-form',
    commerceSpotlightPoint2: 'Store photo → a reel that creates a reason to visit',
    commerceSpotlightPoint3: 'Opening and offer copy applied only after confirmation',
    commerceStart: 'START A SMART LAUNCH AD',
    commerceRouteKicker: 'CHOOSE YOUR BUSINESS ROUTE', commerceRouteMeta: 'PHOTO → DIRECTION → SHORT-FORM',
    commerceFoodTitle: 'Food reels that make the menu sell', commerceFoodCopy: 'Compress a signature dish, new menu, or dessert into its most irresistible second.',
    commerceProductTitle: 'A sales reel from one product photo', commerceProductCopy: 'Turn product imagery for your store into a film that stops the scroll.',
    commerceBeautyTitle: 'Beauty ads persuaded by material', commerceBeautyCopy: 'Keep packaging and labels intact; build the premium feeling with light and texture.',
    commerceSpaceTitle: 'Booking reels from space photography', commerceSpaceCopy: 'Show cafés, stays, showrooms, and listings as places people genuinely want to enter.',
    commerceFashionTitle: 'Lookbook motion from one outfit', commerceFashionCopy: 'Keep the silhouette and identity intact and turn one look into a moving editorial.',
    commerceBrandTitle: 'The first brand film for your local business', commerceBrandCopy: 'Bring together owner, space, and product photos to explain why this place exists.',
    commerceRouteStart: 'START WITH STARTER ↗', commerceRouteStartPro: 'START WITH PRO ↗',
    commerceNote: 'Sales copy, pricing, and efficacy claims are checked against the material you provide. We avoid direction that makes the product, menu, or space look unlike reality.',
    commerceBaKicker: 'AI BEFORE / AFTER REEL',
    commerceBaTitle: 'Start with one BEFORE.<br/>Create the AFTER you have in mind.',
    commerceBaCopy: 'Describe the moment you want to see and AVVM creates an AI AFTER concept from your original. Confirm the concept, then turn both moments into one restrained transformation reel.',
    commerceBaProcess1: 'BEFORE', commerceBaProcess2: 'AI AFTER', commerceBaProcess3: 'AUTO REEL', commerceBaProcess4: 'QUALITY REVIEW',
    commerceBaBeautyTitle: 'Beauty styling reel', commerceBaBeautyCopy: 'Preview a makeup, hair, or nail mood from one photograph before the reel is made.', commerceBaBeautyRule: 'Styling concept only — no efficacy or skin-improvement claims',
    commerceBaFitnessTitle: 'Style & confidence reel', commerceBaFitnessCopy: 'Build a fashion, posture, lighting, and confidence concept from a single original.', commerceBaFitnessRule: 'No body, face, health, or fitness-result alteration',
    commerceBaInteriorTitle: 'Space styling reel', commerceBaInteriorCopy: 'Preview furniture, light, and material direction while retaining your room’s existing structure.', commerceBaInteriorRule: 'Preserves actual windows, walls, and circulation',
    commerceBaPetTitle: 'Pet styling reel', commerceBaPetCopy: 'Create a grooming, portrait, or memory concept while keeping your pet recognisable.', commerceBaPetRule: 'Preserves coat markings, proportions, and traits',
    commerceBaStart: 'CREATE AN AI AFTER CONCEPT',
    commerceBaNote: 'Your BEFORE photo and direction are processed to create an AI concept image. The concept does not guarantee a real treatment, construction, health, or product outcome; identity and misleading claims are reviewed again before delivery.',
    baPlanKicker: 'AI BEFORE / AFTER REEL', baPlanName: 'Before / After Auto Reel', baPlanCopy: '1 original photo / AI AFTER concept / 5-second transition reel / Full HD / review included',
    baUploadTitle: 'Describe the AFTER you want, then preview an AI concept.', baUploadCopy: 'We create one AFTER concept based on your BEFORE photo. If you approve it, the two moments become the source for your transformation reel.',
    baBeforeUploadTitle: '1. UPLOAD BEFORE PHOTO', baBeforeUploadCopy: 'Attach the original photo first. Then write the AFTER scene you would like to see and create a concept.', baBeforeAttach: 'ATTACH BEFORE PHOTO', baBeforeAttachHint: 'The original photo to use as the visual reference', baBeforeAttached: 'BEFORE ATTACHED ✓',
    baDirectionLabel: 'DESCRIBE THE AFTER YOU WANT <span>(OPTIONAL)</span>', baDirectionPlaceholder: 'e.g. soft natural light, polished wedding hair, a satin dress', baSample1: 'IDENTITY LUMINOUS', baSample2: 'CLEAN CAMPAIGN', baSample3: 'CINEMA FRAME', baGenerateAfter: 'CREATE AI AFTER CONCEPT', baGeneratingAfter: 'CREATING AI AFTER CONCEPT…', baAfterReady: 'AI AFTER CONCEPT READY ✓', baAfterNeeded: 'Create the AI AFTER concept before continuing.', baComposing: 'PREPARING BEFORE / AFTER…',
    baSimulationNotice: 'The AI concept does not promise an actual efficacy, body, health, or construction result. It is generated while preserving the supplied person, space, or pet within the allowed direction.', baAiConsent: 'I confirm I have the right to use this photo and agree that the photo and direction are sent to an external AI processing service to create an AI AFTER concept.',
    baPreviewTitle: 'CHECK BEFORE + AI AFTER', baPreviewCopy: 'Before payment, this is a watermarked low-resolution concept preview only. After payment, AVVM creates the transformation reel from the clean AFTER source.', baPreviewWatermark: 'AVVM · AI CONCEPT PREVIEW · PAYMENT UNLOCKS CLEAN SOURCE', baPreviewPlay: 'PREVIEW TRANSITION ▶',
    afterPromptTitle: 'Search for the AFTER you want', afterPromptHint: 'e.g. natural wedding editorial, hair change, atmospheric café, bright profile', afterPromptSearchPlaceholder: 'Describe the change, style, or scene you have in mind', afterPromptCreate: 'BUILD PROMPT', afterPromptModeLabel: 'DIRECTION', afterPromptModeCinematic: 'CINEMATIC', afterPromptModeCommercial: 'COMMERCIAL', afterPromptModeEmotional: 'EMOTIONAL', afterPromptQuickWedding: 'Wedding editorial', afterPromptQuickProfile: 'Profile upgrade', afterPromptQuickInterior: 'Space styling', afterPromptQuickPet: 'Pet portrait', afterPromptResultTitle: 'Generated production prompts', afterPromptImage: 'IMAGE PROMPT', afterPromptVideo: 'AUTO REEL PROMPT', afterPromptNegative: 'NEGATIVE / GUARDRAILS', afterPromptCopy: 'COPY', afterPromptApply: 'APPLY TO AI AFTER', afterPromptNeedIntent: 'Describe the change or scene you want first.', afterPromptApplied: 'Generated prompt applied to your AFTER request.', afterPromptCopied: 'COPIED ✓'
  });

  Object.assign(en, {
    inputMethodVoiceTranscript: 'VOICE TRANSCRIPT',
    inputMethodVoicePreparing: 'Your voice request is ready to start.',
    inputMethodVoiceListening: 'Listening to your request now.',
    inputMethodVoiceTranscriptPlaceholder: 'What you say will appear here in real time.',
    inputMethodVoiceRecognized: 'Recognised request',
    inputMethodVoiceAdded: 'Added to your production request',
    inputMethodVoiceSync: 'The same words are also added to the production-request field below.',
    inputMethodVoiceEdit: 'EDIT REQUEST ↓'
  });

  const ko = {
    footerService: '서비스', footerTerms: '이용약관', footerPrivacy: '개인정보처리방침', footerRefund: '환불정책', footerDelivery: '디지털 제공 안내', footerBusiness: '사업자 정보',
    paymentOpening: '결제창을 여는 중...', optimizingImage: '사진 최적화 중...', attachPhoto: '사진 첨부하기', acceptedImageTypes: 'JPG, PNG, WEBP 등 이미지 파일', imageRequired: '영상 제작에 사용할 사진을 첨부해주세요.', imageType: 'JPG, PNG 또는 WEBP 형식의 사진만 사용할 수 있습니다.', imageSize: '사진 원본은 15MB 이하로 선택해주세요.',
    planContact: 'Custom 플랜은 상담 후 견적으로 진행됩니다.', amountError: '결제 금액을 확인할 수 없습니다.', paymentClosed: '결제창이 닫혔습니다. 다시 시도해주세요.', paymentFailed: '결제가 취소되었거나 실패했습니다.', paymentComplete: '결제가 완료되었습니다. 주문을 접수합니다.',
    orderStarting: '주문 접수 시작 ✓', orderComplete: '주문 접수 완료 ✓', uploadingImage: '서버 연결 및 이미지 업로드 중...', uploadingImageHint: 'Fal.ai CDN으로 사진 데이터를 전송하고 있습니다.', requestFailed: '영상 제작 요청 실패', retryGeneration: '재시도', retrying: '영상을 다시 요청하는 중...', statusQueued: '대기열 진입 중', statusProcessing: '영상 프레임 렌더링 중...', statusCompleted: '영상 제작 완료!', statusFailed: '영상 제작에 실패했습니다.',
    orderReceived: '주문 접수 완료', orderProcessing: '영상 제작 중', orderCompleteStatus: '제작 완료', orderFailed: '제작 실패', backHome: '홈페이지로 돌아가기',
    authGoogleNav: 'GOOGLE 로그인', authOptional: '선택 로그인', authTitle: 'Google로 빠르게 시작하기', authCopy: '로그인하면 Google 계정의 이름과 이메일을 주문 정보에 미리 입력합니다. 로그인 없이도 그대로 주문할 수 있습니다.', authGoogle: 'Google로 계속하기', authSignedIn: '로그인됨', authSignOut: '로그아웃', authSignedOut: '로그아웃되었습니다. 비회원으로 계속 주문할 수 있습니다.', authUnavailable: 'Google 로그인이 아직 준비되지 않았습니다. 비회원으로 계속 주문해주세요.', authError: '요청을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.',
    styleStepTitle: '2. 원하는 비디오 스타일 선택', styleStepCopy: '먼저 제작 분야를 고르고, 이어서 세부 무드와 움직임을 선택하세요.', styleDetailTitle: '세부 무드 선택', styleDetailCopy: '선택한 분야에 맞는 연출만 보여드립니다.', motionTitle: '움직임의 밀도', motionCopy: '한 가지 카메라 동작만 골라 결과를 안정적으로 만듭니다.', styleDirectionLabel: '선택한 연출 방향', promptLibraryKicker: 'AVVM 검수 레시피', promptLibraryTitle: '원하는 장면을 검색하세요', promptLibraryCopy: '검수 기준에 맞춘 연출 레시피를 불러온 뒤, 원하는 내용을 덧붙일 수 있습니다.', promptSearchPlaceholder: '예: 시계, 런웨이, 고전 사진, 여행, 반려동물', promptLibraryNote: '레시피는 원본 보존과 자연스러운 움직임을 우선합니다. 결과는 원본 사진과 최종 검수에 따라 달라질 수 있습니다.', promptEditLabel: '연출 요청 추가하기 <span>(선택)</span>', moodPlaceholder: '선택한 방향에 추가하고 싶은 장면·색감·무드가 있다면 적어주세요.', resolutionTitle: '최종 제공 해상도', resolutionIncluded: '플랜 포함', resolutionHelper: '해상도는 플랜에 포함되어 있으며 원본 사진 검수 후 최종 안내됩니다.',
    heroSub: '사진 한 장, 짧은 문장, 작은 아이디어에서 시작하세요. AVVM이 연출하고 검수해 완성본을 전달합니다.', heroSystemKicker: 'AVVM PRODUCTION SYSTEM', heroSignalLive: 'HUMAN-LED · AI-POWERED',
    inputMethodKicker: 'CHOOSE YOUR INPUT', inputMethodTitle: '사진·타이핑·음성 중 편한 방식으로 시작하세요.', inputMethodCopy: '사진은 결과의 기준이 되고, 글과 음성은 원하는 장면을 정확한 제작 요청으로 바꿉니다.', inputMethodPhoto: '사진 첨부', inputMethodPhotoCopy: '원본 · 상품 · 스케치', inputMethodTyping: '타이핑', inputMethodTypingCopy: '원하는 장면을 적기', inputMethodVoice: '음성으로 말하기', inputMethodVoiceCopy: '말하면 요청 내용으로', inputMethodNotePhoto: '사진을 먼저 첨부하면 가장 안정적으로 제작 방향을 잡을 수 있습니다.', inputMethodNoteTyping: '원하는 장면·변화·무드를 적어주세요. 참고 사진은 언제든 함께 첨부할 수 있습니다.', inputMethodNoteVoice: '듣고 있습니다. 말한 내용이 제작 요청 칸에 입력됩니다.', inputMethodVoiceUnavailable: '이 브라우저는 음성 입력을 지원하지 않습니다. 요청 내용을 직접 입력해 주세요.', inputMethodVoiceComplete: '음성 요청이 입력되었습니다. 내용을 다듬거나 사진을 추가해 주세요.', inputMethodVoiceRetry: '음성 요청을 듣지 못했습니다. 다시 말하거나 직접 입력해 주세요.',
    heroSignalStep1: '사진 업로드', heroSignalStep1Meta: 'SOURCE CHECK', heroSignalStep2: '연출 선택', heroSignalStep2Meta: 'CURATED DIRECTION', heroSignalStep3: '검수 후 전달', heroSignalStep3Meta: 'AVVM QUALITY REVIEW',
    proofAssuranceKicker: 'REAL INPUT · REAL DELIVERY', proofAssuranceTitle: '사진을 먼저 보고, 결과를 확인하고, 검수 기준까지 확인하세요.', proofAssuranceCopy: 'AVVM은 버튼만 누르면 끝나는 자동 생성 화면이 아닙니다. 원본의 가능성을 확인하고, 목적에 맞는 연출을 정한 뒤, 전달 전 결과물을 한 번 더 살핍니다.',
    proofStandardInput: 'REAL INPUT', proofStandardInputMeta: '원본 사진 기반', proofStandardDirection: 'ART DIRECTION', proofStandardDirectionMeta: '산업별 연출 레시피', proofStandardReview: 'QUALITY REVIEW', proofStandardReviewMeta: '인물·제품·텍스트 확인', proofStandardDelivery: 'FINAL DELIVERY', proofStandardDeliveryMeta: '플랜별 규격 적용',
    proofSpecInput: 'INPUT', proofSpecInputValue: '사진 1장', proofSpecOutput: 'SAMPLE OUTPUT', proofSpecOutputValue: '시네마틱 결과', proofSpecReview: 'FINAL CHECK', proofSpecReviewValue: 'AVVM 검수 완료',
    commerceEyebrow: 'AVVM COMMERCE LAB',
    commerceTitle: '사진으로 시작하는<br/>소상공인 광고 스튜디오.',
    commerceCopy: '촬영팀 없이도 메뉴·상품·공간 사진으로 시작하세요. 업종별로 검증한 연출을 골라, 오픈 홍보부터 판매 전환용 숏폼까지 부담 없이 제작합니다.',
    commerceSpotlightKicker: 'LOCAL LAUNCH / RESTAURANT', commerceSpotlightTitle: '식당 개업, 사진 몇 장으로<br/>‘지금 가고 싶은’ 첫 광고.',
    commerceSpotlightCopy: '대표 메뉴 한 장과 매장 사진만으로 김·질감·조명·카메라 무브를 설계해, 인스타그램·카카오채널·매장 화면에 바로 쓸 수 있는 짧은 오픈 홍보 영상을 만듭니다.',
    commerceSpotlightPoint1: '메뉴 사진 → 식감이 살아나는 숏폼', commerceSpotlightPoint2: '매장 사진 → 방문을 부르는 분위기 릴', commerceSpotlightPoint3: '오픈 문구·할인 문구는 직접 확인 후 적용', commerceStart: '가성비 오픈 광고 시작하기',
    commerceRouteKicker: 'CHOOSE YOUR BUSINESS ROUTE', commerceRouteMeta: 'PHOTO → DIRECTION → SHORTFORM',
    commerceFoodTitle: '메뉴가 팔리는 푸드 릴', commerceFoodCopy: '대표 메뉴·신메뉴·디저트를 가장 맛있어 보이는 한 순간으로 압축합니다.',
    commerceProductTitle: '상품사진 한 장의 판매 숏폼', commerceProductCopy: '스마트스토어·자사몰의 제품 사진을 시선을 멈추는 제품 필름으로 바꿉니다.',
    commerceBeautyTitle: '물성으로 설득하는 뷰티 광고', commerceBeautyCopy: '패키지·라벨은 지키고, 빛과 질감으로 프리미엄 인상을 만듭니다.',
    commerceSpaceTitle: '공간 사진의 예약 유도 릴', commerceSpaceCopy: '카페·숙소·쇼룸·부동산 공간을 과장 없이 걷고 싶은 장면으로 보여줍니다.',
    commerceFashionTitle: '착장 사진의 룩북 모션', commerceFashionCopy: '옷의 실루엣과 인물의 정체성을 지키며, 한 장의 착장을 움직이는 룩북으로 만듭니다.',
    commerceBrandTitle: '우리 가게의 첫 브랜드 필름', commerceBrandCopy: '사장님·매장·상품 사진을 묶어, ‘왜 이곳인가’를 전하는 브랜드 오프닝을 제작합니다.',
    commerceRouteStart: 'STARTER로 시작 ↗', commerceRouteStartPro: 'PRO로 시작 ↗', commerceNote: '판매 문구와 가격·효능 표현은 제공 자료를 기준으로 확인합니다. 실제 제품·메뉴·공간과 다르게 보이게 만드는 과장 연출은 지양합니다.',
    commerceBaKicker: 'AI BEFORE / AFTER REEL', commerceBaTitle: '한 장의 BEFORE에서, 원하는<br/>AFTER 시안을 먼저 만듭니다.',
    commerceBaCopy: 'BEFORE 사진 한 장에 바라는 장면을 적으면 AI가 원본을 기준으로 AFTER 시안을 만듭니다. 시안을 확인한 뒤 두 장면을 하나의 절제된 전환 릴로 제작합니다.',
    commerceBaProcess1: 'BEFORE', commerceBaProcess2: 'AI AFTER', commerceBaProcess3: 'AUTO REEL', commerceBaProcess4: 'QUALITY REVIEW',
    commerceBaBeautyTitle: '뷰티 스타일 릴', commerceBaBeautyCopy: '한 장의 사진에 원하는 메이크업·헤어·네일 무드를 더한 AI AFTER 시안부터 확인합니다.', commerceBaBeautyRule: '효능·피부 개선을 주장하지 않는 스타일 시안',
    commerceBaFitnessTitle: '스타일·자신감 릴', commerceBaFitnessCopy: '포즈·착장·빛의 변화를 디자인해, 한 사람의 스타일 무드를 전환합니다.', commerceBaFitnessRule: '신체·얼굴·건강 결과를 바꾸거나 주장하지 않음',
    commerceBaInteriorTitle: '공간 스타일링 릴', commerceBaInteriorCopy: '현재 공간의 구조를 지키면서 원하는 가구·조명·톤의 AFTER 스타일링 시안을 만듭니다.', commerceBaInteriorRule: '창문·벽·동선 등 실제 구조를 유지',
    commerceBaPetTitle: '펫 스타일 릴', commerceBaPetCopy: '반려동물의 특징을 유지한 채 그루밍·포트레이트·추억 무드의 AFTER 시안을 만듭니다.', commerceBaPetRule: '털 무늬·체형·특징과 안전을 지킴',
    commerceBaStart: 'AI AFTER 시안 만들기', commerceBaNote: 'BEFORE 사진과 입력한 바람은 AI AFTER 시안을 만들기 위해 처리됩니다. 시안은 실제 효능·공사·건강 결과를 보장하지 않으며, 원본의 정체성과 과장 표현을 다시 확인한 뒤 제공합니다.',
    baPlanKicker: 'AI 전후 변화 릴', baPlanName: 'Before / After Auto Reel', baPlanCopy: '원본 1장 / AI AFTER 시안 / 5초 전환 릴 / Full HD / 검수 포함',
    baUploadTitle: '원하는 AFTER를 적고, AI 시안을 먼저 확인하세요.', baUploadCopy: 'BEFORE 사진을 기준으로 AFTER 시안을 한 장 만듭니다. 시안이 마음에 들면 그 두 장면으로 전환 릴을 제작합니다.',
    baBeforeUploadTitle: '1. BEFORE 사진 업로드', baBeforeUploadCopy: '원본 사진을 먼저 첨부한 뒤, 보고 싶은 AFTER 장면을 적고 시안을 만드세요.', baBeforeAttach: 'BEFORE 사진 첨부하기', baBeforeAttachHint: 'AI AFTER 시안의 기준이 될 원본 사진', baBeforeAttached: 'BEFORE 첨부 완료 ✓',
    baDirectionLabel: 'AFTER에 바라는 장면 <span>(선택)</span>', baDirectionPlaceholder: '예: 부드러운 자연광 아래, 고급스러운 웨딩 헤어와 새틴 드레스', baSample1: '아이덴티티 루미너스', baSample2: '클린 캠페인', baSample3: '시네마 프레임', baGenerateAfter: 'AI AFTER 시안 만들기', baGeneratingAfter: 'AI AFTER 시안 생성 중…', baAfterReady: 'AI AFTER 시안 완료 ✓', baAfterNeeded: '전환 영상을 만들기 전 AI AFTER 시안을 먼저 만들어 주세요.', baComposing: 'BEFORE / AFTER 준비 중...',
    baSimulationNotice: 'AI 시안은 실제 효능·체형·건강·공사 결과를 보장하지 않습니다. 원본의 인물·공간·반려동물 특징을 지키는 범위에서 생성합니다.', baAiConsent: '본인은 사진 사용 권한이 있으며, AI AFTER 시안 생성을 위해 사진과 입력한 바람이 외부 AI 처리 서비스로 전송되는 것에 동의합니다.',
    baPreviewTitle: 'BEFORE와 AI AFTER 시안 확인', baPreviewCopy: '결제 전에는 워터마크가 포함된 저해상도 시안만 확인할 수 있습니다. 결제 후 워터마크 없는 AFTER 소스로 전환 영상을 제작합니다.', baPreviewWatermark: 'AVVM · AI CONCEPT PREVIEW · 결제 후 클린 소스 제공', baPreviewPlay: '전환 미리보기 ▶',
    afterPromptTitle: '원하는 애프터를 검색하세요', afterPromptHint: '예: 자연스러운 웨딩 화보, 헤어 변신, 분위기 있는 카페, 밝은 프로필', afterPromptSearchPlaceholder: '생각하는 변화·스타일·장면을 입력하세요', afterPromptCreate: '프롬프트 만들기', afterPromptModeLabel: '연출 톤', afterPromptModeCinematic: '시네마틱', afterPromptModeCommercial: '커머셜', afterPromptModeEmotional: '감성', afterPromptQuickWedding: '웨딩 화보', afterPromptQuickProfile: '프로필 업그레이드', afterPromptQuickInterior: '공간 스타일링', afterPromptQuickPet: '반려동물 포트레이트', afterPromptResultTitle: '생성된 제작 프롬프트', afterPromptImage: '이미지 프롬프트', afterPromptVideo: 'AUTO REEL 프롬프트', afterPromptNegative: '제한 / 가드레일', afterPromptCopy: '복사', afterPromptApply: 'AI AFTER에 적용', afterPromptNeedIntent: '원하는 변화나 장면을 먼저 입력해주세요.', afterPromptApplied: '생성된 프롬프트를 AFTER 요청에 적용했습니다.', afterPromptCopied: '복사 완료 ✓'
  };

  Object.assign(ko, {
    inputMethodVoiceTranscript: '음성 인식',
    inputMethodVoicePreparing: '말씀하신 내용을 들을 준비가 되었습니다.',
    inputMethodVoiceListening: '말씀하신 내용을 듣고 있습니다.',
    inputMethodVoiceTranscriptPlaceholder: '말한 내용이 여기에 실시간으로 표시됩니다.',
    inputMethodVoiceRecognized: '인식된 요청',
    inputMethodVoiceAdded: '제작 요청에 반영했습니다.',
    inputMethodVoiceSync: '같은 내용이 아래 제작 요청에도 자동 입력됩니다.',
    inputMethodVoiceEdit: '제작 요청에서 수정하기 ↓'
  });

  /* Korean must not fall back to the source-language label. These entries are
     intentionally short so the same hierarchy works on mobile as well. */
  Object.assign(ko, {
    heroEyebrow: 'AI 비디오 자판기', navWorks: '작업물', navTransform: '변신', navBusiness: '비즈니스', navMemorial: '메모리얼', navProfile: '프로필', navFaq: '자주 묻는 질문', startProject: '프로젝트 시작 ↗',
    memorialLaunchNotice: '[신규] <b>소중한 추억 복원</b> 런칭! 오래된 사진과 반려동물 사진을 다시 움직이게 하세요 ↗', scrollExplore: '스크롤하여 보기', memorialNavTag: '추억 복원', beforeAfterCopy: '사진 한 장을 업로드하면, AVVM이 광고급 시네마틱 결과물로 전환합니다.',
    baInputLabel: '입력 · 30년 전 사진', baProcessTop: 'AI 메모리얼 리마스터', baProcessBottom: '정지된 과거 → 다시 달리는 기억', baOutputLabel: '결과 · 깜순이가 다시 달려옵니다', viewShowreel: '쇼릴 보기', baCaseNote: '멈춘 한 장의 사진, 다시 달려오는 기억.',
    proofLabEyebrow: '결과 미리보기 라이브러리', proofLabTitle: '내 사진으로,<br/>결과를 먼저 확인하세요.', proofLabCopy: '어떤 결과를 기대할 수 있는지 먼저 확인하세요. 모든 예시는 실제 입력 이미지와 AVVM 제작 결과를 나란히 보여줍니다.',
    proofPortraitName: '인물 에디토리얼', proofPortraitCopy: '평범한 인물 사진을 고급 패션 캠페인 무드의 짧은 영상으로 전환합니다.', proofPortraitInput: '평범한 인물 사진', proofPortraitOutput: '패션 에디토리얼 영상',
    proofMemorialName: '메모리얼 복원', proofMemorialCopy: '오래된 사진 속 존재가 다시 움직이는 기억으로 이어집니다.', proofMemorialInput: '오래된 흑백 사진', proofMemorialOutput: '다시 움직이는 기억',
    proofProductName: '제품 광고', proofProductCopy: '평범한 제품 사진을 빛과 카메라 움직임이 있는 광고 영상으로 제작합니다.', proofProductInput: '제품 사진', proofProductOutput: '럭셔리 광고 영상',
    proofProfileName: '프로필 보정', proofProfileCopy: '신뢰가 필요한 프로필 사진을 자연스럽고 선명한 이미지로 정리합니다.', proofProfileInput: '원본 프로필 사진', proofProfileOutput: '정돈된 프로필 사진',
    proofBeautyName: '뷰티 광고', proofBeautyCopy: '제품의 질감과 빛을 살린 짧은 뷰티 광고 영상을 제작합니다.', proofBeautyInput: '뷰티 제품 사진', proofBeautyOutput: '뷰티 광고 영상',
    proofFoodName: '푸드 광고', proofFoodCopy: '음식의 김과 질감을 살려 더 맛있어 보이는 장면으로 만듭니다.', proofFoodInput: '메뉴 사진', proofFoodOutput: '푸드 광고 영상',
    proofTravelName: '여행 변신', proofTravelCopy: '인물의 정체성을 지키며 장소와 분위기를 자연스럽게 전환합니다.', proofTravelInput: '여행 인물 사진', proofTravelOutput: '여행 변신 영상',
    proofWeddingName: '웨딩 필름', proofWeddingCopy: '자연광과 표정을 살린 조용하고 고급스러운 웨딩 필름입니다.', proofWeddingInput: '웨딩 인물 사진', proofWeddingOutput: '웨딩 필름 영상',
    proofClassicName: '고전 배우 복원', proofClassicCopy: '고전 사진의 시대감은 유지하고 아주 작은 시선과 숨만 되살립니다.', proofClassicInput: '고전 인물 사진', proofClassicOutput: '고전 사진 복원 영상',
    proofJewelryName: '스케치 → 주얼리', proofJewelryCopy: '스케치를 실제 제품 사진으로 확인하고, 매크로 제품 영상까지 이어갑니다.', proofJewelryDrag: '좌우로 움직여 비교', proofJewelryOutput: '다이아몬드 반지 영상', proofLabNotice: '원본 사진의 품질과 구도, 선택한 연출에 따라 실제 결과는 달라질 수 있습니다.',
    heroSystemKicker: 'AVVM 제작 시스템', heroSignalLive: '사람의 연출 · AI의 속도', inputMethodKicker: '입력 방식 선택', heroSignalStep1Meta: '원본 확인', heroSignalStep2Meta: '검수된 연출', heroSignalStep3Meta: 'AVVM 품질 검수',
    proofAssuranceKicker: '실제 원본 · 실제 납품', proofStandardInput: '실제 원본', proofStandardDirection: '연출 설계', proofStandardReview: '품질 검수', proofStandardDelivery: '최종 납품', proofSpecInput: '입력', proofSpecOutput: '결과 예시', proofSpecReview: '최종 확인',
    commerceEyebrow: 'AVVM 소상공인 광고 스튜디오', commerceSpotlightKicker: '동네 가게 오픈 · 식당', commerceRouteKicker: '업종별 제작 방식 선택', commerceRouteMeta: '사진 → 연출 → 숏폼', commerceRouteStart: '스타터로 시작 ↗', commerceRouteStartPro: '프로로 시작 ↗',
    commerceBaKicker: 'AI 전후 전환 릴', commerceBaTitle: '한 장의 원본에서, 원하는<br/>결과 시안을 먼저 만듭니다.', commerceBaCopy: '원본 사진 한 장에 바라는 장면을 적으면 AI가 원본을 기준으로 결과 시안을 만듭니다. 시안을 확인한 뒤 두 장면을 하나의 절제된 전환 릴로 제작합니다.', commerceBaProcess1: '원본', commerceBaProcess2: 'AI 결과 시안', commerceBaProcess3: '자동 전환 릴', commerceBaProcess4: '품질 검수',
    commerceBaBeautyCopy: '한 장의 사진에 원하는 메이크업·헤어·네일 무드를 더한 AI 결과 시안부터 확인합니다.', commerceBaInteriorCopy: '현재 공간의 구조를 지키면서 원하는 가구·조명·톤의 결과 시안을 만듭니다.', commerceBaPetCopy: '반려동물의 특징을 유지한 채 그루밍·포트레이트·추억 무드의 결과 시안을 만듭니다.', commerceBaStart: 'AI 결과 시안 만들기', commerceBaNote: '원본 사진과 입력한 바람은 AI 결과 시안을 만들기 위해 처리됩니다. 시안은 실제 효능·공사·건강 결과를 보장하지 않으며, 원본의 정체성과 과장 표현을 다시 확인한 뒤 제공합니다.',
    baPlanKicker: 'AI 전후 변화 릴', baPlanName: '전후 자동 전환 릴', baPlanCopy: '원본 1장 / AI 결과 시안 / 5초 전환 릴 / 풀 HD / 검수 포함', baUploadTitle: '원하는 결과를 적고, AI 시안을 먼저 확인하세요.', baUploadCopy: '원본 사진을 기준으로 AI 결과 시안을 한 장 만듭니다. 시안이 마음에 들면 그 두 장면으로 전환 릴을 제작합니다.', baBeforeUploadTitle: '1. 원본 사진 업로드', baBeforeUploadCopy: '원본 사진을 먼저 첨부한 뒤, 보고 싶은 결과 장면을 적고 시안을 만드세요.', baBeforeAttach: '원본 사진 첨부하기', baBeforeAttachHint: 'AI 결과 시안의 기준이 될 원본 사진', baBeforeAttached: '원본 첨부 완료 ✓',
    baDirectionLabel: '원하는 결과 장면 <span>(선택)</span>', baGenerateAfter: 'AI 결과 시안 만들기', baGeneratingAfter: 'AI 결과 시안 생성 중…', baAfterReady: 'AI 결과 시안 완료 ✓', baAfterNeeded: '전환 영상을 만들기 전 AI 결과 시안을 먼저 만들어 주세요.', baComposing: '원본 / 결과 시안 준비 중...', baAiConsent: '본인은 사진 사용 권한이 있으며, AI 결과 시안 생성을 위해 사진과 입력한 바람이 외부 AI 처리 서비스로 전송되는 것에 동의합니다.', baPreviewTitle: '원본과 AI 결과 시안 확인', baPreviewCopy: '결제 전에는 워터마크가 포함된 저해상도 시안만 확인할 수 있습니다. 결제 후 워터마크 없는 결과 소스로 전환 영상을 제작합니다.', baPreviewWatermark: 'AVVM · AI 시안 미리보기 · 결제 후 워터마크 없는 소스 제공', baPreviewPlay: '전환 미리보기 ▶',
    afterPromptTitle: '원하는 결과를 검색하세요', afterPromptImage: '이미지 제작 프롬프트', afterPromptVideo: '전환 영상 프롬프트', afterPromptApply: '결과 시안에 적용', afterPromptApplied: '생성된 프롬프트를 결과 요청에 적용했습니다.',
    authGoogleNav: '구글 로그인', authTitle: '구글로 빠르게 시작하기', authCopy: '로그인하면 구글 계정의 이름과 이메일을 주문 정보에 미리 입력합니다. 로그인 없이도 그대로 주문할 수 있습니다.', authGoogle: '구글로 계속하기', styleStepTitle: '2. 원하는 영상 스타일 선택'
  });

  Object.assign(en, {
    autoRecipeTitle: 'ONE IMAGE, THE OPENING SCENE OF A FILM.',
    autoRecipeCopy: 'Copy a direction proven in the examples, or apply it in the order window and begin with your own photo. Every recipe is designed to preserve the original person, product, and composition first.',
    autoRecipeProduct: 'The product remains completely still while the surrounding time and light pause for one beat. It is a product hook that preserves its form and stops the eye from the first frame.',
    autoRecipeBeauty: 'A single line of light moving over the product refracts the space around it. It creates a tactile beauty mood without flooding the frame with liquid.',
    autoRecipeMemorial: 'Rather than exaggerated movement, a gaze, breath, and subtle head motion safely revive the feeling of an old photograph.',
    autoRecipeEditorial: 'In a single camera pass across the shoulder, the same person feels as though they are already entering an entirely new editorial world.',
    autoRecipeTravel: 'A travel transition where changes in place and atmosphere flow naturally while preserving the person’s identity.',
    autoRecipeMusic: 'We compress a strong beat and movement into one moment while keeping the face and clothing silhouette stable.',
    autoRecipeFood: 'Show one texture—steam, bubbles, or a crisp surface—in an extreme close-up, then return to the whole plate. The food looks more appetizing and the film feels less exaggerated.',
    autoRecipeWedding: 'Natural light brushing a veil or shoulder briefly covers the frame, then reveals a deeper expression and space. It lingers more quietly than forced slow motion.',
    autoRecipeClassic: 'Preserve the grain and period feeling of a classic photograph, letting only a tiny gaze and breath move as if a film gate has opened. No modern filter covers the image.',
    autoRecipeProfile: 'For photos that need trust more than transformation, movement stays minimal. The gaze, skin, and silhouette remain stable for a short profile motion.',
    autoRecipeNote: 'Recipes are a starting point. Please upload only photos you have permission to use. Actual results may vary depending on source quality, selected options, and final review.'
  });

  Object.assign(en, {
    ariaHeroPromise: 'One click. Cinematic results.',
    ariaPortraitVideo: 'Portrait editorial result video', ariaMemorialVideo: 'Kkamsooni memorial restoration result video',
    ariaProductVideo: 'Watch product advertising result video', ariaBeautyVideo: 'Beauty advertising result video',
    ariaFoodVideo: 'Food advertising result video', ariaTravelVideo: 'Travel transformation result video',
    ariaWeddingVideo: 'Wedding film result video', ariaClassicVideo: 'Classic portrait restoration result video',
    ariaJewelryComparison: 'Sketch and ring photo comparison slider', ariaJewelryVideo: 'Jewelry design macro video',
    ariaRestaurantVideo: 'Restaurant opening promotion video sample', ariaBeautyFlow: 'Beauty advertising direction flow',
    ariaPlanChooser: 'Plan selection', ariaDesignType: 'Design type selection', ariaMoodSelection: 'Detailed mood selection', ariaMotionIntensity: 'Motion intensity'
  });

  /* Runtime copy is used by UI that is created or refreshed after page load
     (plan state, prompt library, and the paid AFTER-concept flow). Keeping it
     in the same locale source prevents those live controls falling back to
     English while the rest of a selected language is already translated. */
  const runtimeUiCopy = {
    ko: {
      photoAttached: '첨부 완료 ✓', customDeliverySpec: '상담 후 납품 사양 확정', planIncluded: '{plan} 플랜에 포함', customScopeNote: '추가 장면·특수 연출·제작 범위는 상담 견적으로 확정합니다.', resolutionPlanNote: '해상도는 플랜에 포함되어 있으며, 원본 사진 품질에 따라 최종 검수 시 안내드립니다.', promptLibraryUse: '이 레시피 불러오기', promptLibraryEmpty: '검색 결과가 없습니다. 원하는 장면을 직접 적어주세요.', promptLibraryLoaded: '연출 레시피를 불러왔습니다. 원하는 내용을 덧붙여주세요.', testPayment: '테스트 결제하기', baConceptRemaining: '결제 전 AI AFTER 시안은 최대 <b>{limit}회</b> 만들 수 있습니다. <strong>남은 {remaining}회</strong>', baConceptExhausted: '결제 전 AI AFTER 시안 <b>{limit}회</b>를 모두 사용했습니다. 현재 시안으로 영상 제작을 진행해 주세요.'
    },
    en: {
      photoAttached: 'ATTACHED ✓', customDeliverySpec: 'Delivery specification confirmed after consultation', planIncluded: 'Included with {plan}', customScopeNote: 'Extra scenes, special direction, and production scope are confirmed by custom quote.', resolutionPlanNote: 'Delivery quality is included with your plan; final guidance depends on the source-photo review.', promptLibraryUse: 'USE THIS RECIPE', promptLibraryEmpty: 'No recipe matched. Describe the scene in your own words.', promptLibraryLoaded: 'Recipe loaded. Add any detail you want.', testPayment: 'TEST PAYMENT', baConceptRemaining: 'Create up to <b>{limit} AI AFTER concepts</b> before payment. <strong>{remaining} left</strong>', baConceptExhausted: 'You have used all <b>{limit}</b> pre-payment AI AFTER concepts. Continue with the current concept.'
    },
    ja: {
      photoAttached: '添付完了 ✓', customDeliverySpec: '納品仕様はご相談後に確定', planIncluded: '{plan} プランに含む', customScopeNote: '追加シーン・特殊演出・制作範囲は個別見積もりで確定します。', resolutionPlanNote: '納品品質はプランに含まれ、元画像の確認後に最終案内します。', promptLibraryUse: 'このレシピを使う', promptLibraryEmpty: '一致するレシピがありません。希望のシーンを直接入力してください。', promptLibraryLoaded: '演出レシピを読み込みました。詳細を追加してください。', testPayment: 'テスト決済', baConceptRemaining: '決済前にAI AFTER案を最大<b>{limit}回</b>作成できます。<strong>残り{remaining}回</strong>', baConceptExhausted: '決済前のAI AFTER案を<b>{limit}回</b>すべて使いました。現在の案で映像制作を進めてください。'
    },
    zh: {
      photoAttached: '已添加 ✓', customDeliverySpec: '咨询后确认交付规格', planIncluded: '已包含在 {plan} 方案中', customScopeNote: '额外场景、特殊创意和制作范围将通过定制报价确认。', resolutionPlanNote: '交付质量已包含在方案内，将在审核原始照片后最终确认。', promptLibraryUse: '使用此配方', promptLibraryEmpty: '没有匹配的配方。请直接描述您想要的画面。', promptLibraryLoaded: '已载入创意配方。请补充任何细节。', testPayment: '测试付款', baConceptRemaining: '付款前最多可创建 <b>{limit} 个 AI AFTER 方案</b>。<strong>还剩 {remaining} 个</strong>', baConceptExhausted: '您已用完付款前的 <b>{limit} 个 AI AFTER 方案</b>。请使用当前方案继续制作视频。'
    },
    es: {
      photoAttached: 'ADJUNTADO ✓', customDeliverySpec: 'La especificación de entrega se confirma tras la consulta', planIncluded: 'Incluido con el plan {plan}', customScopeNote: 'Las escenas extra, la dirección especial y el alcance se confirman mediante presupuesto personalizado.', resolutionPlanNote: 'La calidad de entrega está incluida en tu plan y se confirma tras revisar la foto original.', promptLibraryUse: 'USAR ESTA RECETA', promptLibraryEmpty: 'No hay recetas coincidentes. Describe la escena con tus propias palabras.', promptLibraryLoaded: 'Receta cargada. Añade cualquier detalle que quieras.', testPayment: 'PAGO DE PRUEBA', baConceptRemaining: 'Antes del pago puedes crear hasta <b>{limit} conceptos AI AFTER</b>. <strong>Quedan {remaining}</strong>', baConceptExhausted: 'Ya has usado los <b>{limit}</b> conceptos AI AFTER previos al pago. Continúa con el concepto actual.'
    },
    fr: {
      photoAttached: 'AJOUTÉ ✓', customDeliverySpec: 'Les spécifications de livraison sont confirmées après consultation', planIncluded: 'Inclus dans le plan {plan}', customScopeNote: 'Les scènes supplémentaires, la direction spéciale et le périmètre sont confirmés par devis personnalisé.', resolutionPlanNote: 'La qualité de livraison est incluse dans votre plan et confirmée après examen de la photo source.', promptLibraryUse: 'UTILISER CETTE RECETTE', promptLibraryEmpty: 'Aucune recette correspondante. Décrivez directement la scène souhaitée.', promptLibraryLoaded: 'Recette chargée. Ajoutez les détails souhaités.', testPayment: 'PAIEMENT TEST', baConceptRemaining: 'Avant le paiement, créez jusqu’à <b>{limit} concepts AI AFTER</b>. <strong>Il en reste {remaining}</strong>', baConceptExhausted: 'Vous avez utilisé les <b>{limit}</b> concepts AI AFTER avant paiement. Continuez avec le concept actuel.'
    },
    de: {
      photoAttached: 'ANGEHÄNGT ✓', customDeliverySpec: 'Lieferspezifikation wird nach Beratung bestätigt', planIncluded: 'Im Plan {plan} enthalten', customScopeNote: 'Zusatzszenen, Spezialregie und Produktionsumfang werden per individuellem Angebot bestätigt.', resolutionPlanNote: 'Die Lieferqualität ist im Plan enthalten und wird nach Prüfung des Quellfotos bestätigt.', promptLibraryUse: 'DIESES REZEPT NUTZEN', promptLibraryEmpty: 'Kein passendes Rezept gefunden. Beschreiben Sie die gewünschte Szene direkt.', promptLibraryLoaded: 'Regie-Rezept geladen. Ergänzen Sie die gewünschten Details.', testPayment: 'TESTZAHLUNG', baConceptRemaining: 'Vor der Zahlung können Sie bis zu <b>{limit} AI-AFTER-Konzepte</b> erstellen. <strong>Noch {remaining} verfügbar</strong>', baConceptExhausted: 'Sie haben alle <b>{limit}</b> AI-AFTER-Konzepte vor der Zahlung verwendet. Fahren Sie mit dem aktuellen Konzept fort.'
    },
    pt: {
      photoAttached: 'ANEXADO ✓', customDeliverySpec: 'A especificação de entrega é confirmada após a consulta', planIncluded: 'Incluído no plano {plan}', customScopeNote: 'Cenas extras, direção especial e escopo de produção são confirmados por orçamento personalizado.', resolutionPlanNote: 'A qualidade de entrega está incluída no plano e é confirmada após a revisão da foto de origem.', promptLibraryUse: 'USAR ESTA RECEITA', promptLibraryEmpty: 'Nenhuma receita encontrada. Descreva a cena desejada com suas palavras.', promptLibraryLoaded: 'Receita carregada. Adicione os detalhes que quiser.', testPayment: 'PAGAMENTO DE TESTE', baConceptRemaining: 'Antes do pagamento, crie até <b>{limit} conceitos AI AFTER</b>. <strong>Restam {remaining}</strong>', baConceptExhausted: 'Você usou todos os <b>{limit}</b> conceitos AI AFTER pré-pagamento. Continue com o conceito atual.'
    },
    hi: {
      photoAttached: 'संलग्न ✓', customDeliverySpec: 'डिलीवरी विनिर्देश परामर्श के बाद तय होंगे', planIncluded: '{plan} प्लान में शामिल', customScopeNote: 'अतिरिक्त दृश्य, विशेष निर्देशन और उत्पादन दायरा कस्टम कोटेशन से तय होगा।', resolutionPlanNote: 'डिलीवरी गुणवत्ता आपके प्लान में शामिल है और स्रोत फोटो समीक्षा के बाद तय होगी।', promptLibraryUse: 'यह रेसिपी इस्तेमाल करें', promptLibraryEmpty: 'कोई मिलती-जुलती रेसिपी नहीं मिली। अपनी पसंद का दृश्य सीधे लिखें।', promptLibraryLoaded: 'निर्देशन रेसिपी लोड हो गई। अपनी पसंद का विवरण जोड़ें।', testPayment: 'टेस्ट भुगतान', baConceptRemaining: 'भुगतान से पहले अधिकतम <b>{limit} AI AFTER कॉन्सेप्ट</b> बनाए जा सकते हैं। <strong>{remaining} शेष</strong>', baConceptExhausted: 'आपने भुगतान से पहले के सभी <b>{limit}</b> AI AFTER कॉन्सेप्ट इस्तेमाल कर लिए हैं। मौजूदा कॉन्सेप्ट से आगे बढ़ें।'
    },
    ar: {
      photoAttached: 'تم الإرفاق ✓', customDeliverySpec: 'تُؤكَّد مواصفات التسليم بعد الاستشارة', planIncluded: 'مشمول في خطة {plan}', customScopeNote: 'تُؤكَّد المشاهد الإضافية والإخراج الخاص ونطاق الإنتاج عبر عرض سعر مخصص.', resolutionPlanNote: 'جودة التسليم مشمولة في خطتك وتُؤكَّد بعد مراجعة الصورة الأصلية.', promptLibraryUse: 'استخدم هذه الوصفة', promptLibraryEmpty: 'لا توجد وصفة مطابقة. صف المشهد الذي تريده بكلماتك.', promptLibraryLoaded: 'تم تحميل وصفة الإخراج. أضف أي تفاصيل تريدها.', testPayment: 'دفع تجريبي', baConceptRemaining: 'يمكن إنشاء ما يصل إلى <b>{limit} تصوّرات AI AFTER</b> قبل الدفع. <strong>المتبقي {remaining}</strong>', baConceptExhausted: 'استخدمت كل تصوّرات AI AFTER قبل الدفع وعددها <b>{limit}</b>. تابع بالتصوّر الحالي.'
    }
  };
  Object.entries(runtimeUiCopy).forEach(([locale, copy]) => {
    if (locale === 'ko') Object.assign(ko, copy);
    else if (locale === 'en') Object.assign(en, copy);
    else Object.assign(((window.AVVM_LOCALES || {})[locale] || {}), copy);
  });

  function isKorean() { return language === 'ko'; }

  function t(key, fallback) {
    if (isKorean()) return ko[key] || fallback || key;
    const locale = (window.AVVM_LOCALES || {})[language] || {};
    if (locale[key]) return locale[key];
    // Most of the long-form page copy is kept in the Korean source markup and
    // is translated by the locale-specific text map. Prefer that map for the
    // eight non-English languages before falling back to the English UI copy.
    // This prevents a missing hand-written key from quietly leaving Japanese,
    // Chinese, Spanish, etc. in English.
    if (language !== 'en' && fallback) {
      const translated = autoText(fallback, '');
      if (translated && translated !== fallback) return translated;
    }
    return en[key] || fallback || key;
  }

  function setText(node, value) { if (node && value != null) node.textContent = value; }
  function setHtml(node, value) { if (node && value != null) node.innerHTML = value; }

  const autoTextNodes = [];
  const autoAttributes = [];
  const englishAttributeFallbacks = Object.freeze({
    '한번의 클릭. 시네마틱 결과.': 'One click. Cinematic results.',
    '인물 에디토리얼 입력 사진': 'Portrait editorial input photo',
    '깜순이 메모리얼 입력 사진': 'Kkamsooni memorial input photo',
    '시계 제품 광고 입력 사진': 'Watch product-ad input photo',
    '프로필 입력 사진': 'Profile input photo',
    '프로필 보정 결과 사진': 'Refined profile result photo',
    '뷰티 광고 입력 사진': 'Beauty-ad input photo',
    '푸드 광고 입력 사진': 'Food-ad input photo',
    '트래블 변신 입력 사진': 'Travel-transform input photo',
    '웨딩 필름 입력 사진': 'Wedding-film input photo',
    '고전 배우 복원 입력 사진': 'Classic-portrait restoration input photo',
    '실제 솔리테어 반지 사진': 'Real solitaire ring photo',
    '솔리테어 반지 스케치': 'Solitaire ring sketch',
    '업로드한 원본 사진 미리보기': 'Uploaded source photo preview',
    '스케치와 반지 사진 비교 슬라이더': 'Sketch and ring-photo comparison slider',
    '예: 부드러운 자연광 아래, 고급스러운 웨딩 헤어와 새틴 드레스': 'e.g. elegant wedding hair and a satin dress in soft natural light',
    '생각하는 변화·스타일·장면을 입력하세요': 'Describe the change, style, or scene you want',
    '예: AVVM, LUMI, MY STUDIO': 'e.g. AVVM, LUMI, MY STUDIO',
    '선택한 방향에 추가하고 싶은 장면·색감·무드가 있다면 적어주세요.': 'Add any scene, colour, or mood you want to layer onto this direction.',
    '성함 또는 브랜드명을 입력하세요': 'Enter your name or brand',
    '이메일로 영상 다운로드 링크 수령': 'Email for the video download link',
    '휴대폰 번호 (카톡/문자로 영상 다운로드 링크 수령)': 'Mobile number for KakaoTalk/SMS delivery',
    '카톡/문자 알림용 휴대폰 번호': 'Mobile number for KakaoTalk/SMS notifications'
  });

  /* Customer-facing labels which are deliberately written as compact English
     in the source receive a Korean surface label when Korean is selected.
     Prompt code itself remains English: it is sent to the video model and is
     not marketing/UI copy. */
  const koreanTextFallbacks = Object.freeze({
    'AVVM.studio — ONE CLICK. CINEMATIC RESULTS.': 'AVVM.studio — 원 클릭. 시네마틱 결과.',
    'ONE CLICK. CINEMATIC RESULTS.': '원 클릭. 시네마틱 결과.',
    'THE AI VIDEO VENDING MACHINE': 'AI 비디오 자판기',
    'Works': '작업물', 'Transform': '변신', 'Business': '비즈니스', 'Memorial': '메모리얼', 'ID·Profile': '프로필', 'FAQ': '자주 묻는 질문',
    'GOOGLE LOGIN': '구글 로그인', 'START PROJECT ↗': '프로젝트 시작 ↗', 'START PROJECT': '프로젝트 시작', 'START': '시작',
    'AVVM PRODUCTION SYSTEM': 'AVVM 제작 시스템', 'HUMAN-LED · AI-POWERED': '사람의 연출 · AI의 속도', 'SOURCE CHECK': '원본 확인', 'CURATED DIRECTION': '검수된 연출', 'AVVM QUALITY REVIEW': 'AVVM 품질 검수', 'SCROLL TO EXPLORE': '스크롤하여 보기',
    '⚡️ Transform': '⚡️ 변신', '💼 Business': '💼 비즈니스', '🐶 Memorial': '🐶 메모리얼', '🪪 ID·Profile': '🪪 프로필',
    'Before / After': '전후 변화', 'FROM STILL TO': '멈춘 사진에서', 'STUNNING.': '눈을 뗄 수 없는 결과로.', 'VIEW SHOWREEL': '쇼릴 보기',
    'RESULT PREVIEW LIBRARY': '결과 미리보기 라이브러리', 'YOUR PHOTO,': '내 사진으로,', 'WITH PROOF.': '결과를 먼저 확인하세요.',
    'REAL INPUT · REAL DELIVERY': '실제 원본 · 실제 납품', 'REAL INPUT': '실제 원본', 'ART DIRECTION': '연출 설계', 'QUALITY REVIEW': '품질 검수', 'FINAL DELIVERY': '최종 납품',
    'INPUT': '입력', 'OUTPUT': '결과', '1 IMAGE': '사진 1장', 'SAMPLE OUTPUT': '결과 예시', 'CINEMATIC RESULT': '시네마틱 결과', 'FINAL CHECK': '최종 확인', 'AVVM REVIEWED': 'AVVM 검수 완료',
    'PREMIUM MASTER · WEB OPTIMIZED': '프리미엄 마스터 · 웹 최적화', 'SKETCH': '스케치', 'PHOTO': '사진', 'SKETCH ↔ PHOTO': '스케치 ↔ 사진', 'RING MOTION': '반지 모션',
    'AVVM COMMERCE LAB': 'AVVM 소상공인 광고 스튜디오', 'LIVE DEMO · 01': '실시간 예시 · 01', 'LOCAL LAUNCH / RESTAURANT': '동네 가게 오픈 · 식당', 'CHOOSE YOUR BUSINESS ROUTE': '업종별 제작 방식 선택', 'PHOTO → DIRECTION → SHORTFORM': '사진 → 연출 → 숏폼',
    'FOOD · CAFE · BAKERY': '푸드 · 카페 · 베이커리', 'SHOP · PRODUCT · RETAIL': '상점 · 상품 · 리테일', 'BEAUTY · WELLNESS': '뷰티 · 웰니스', 'SPACE · STAY · INTERIOR': '공간 · 숙소 · 인테리어', 'FASHION · LOOKBOOK': '패션 · 룩북', 'LOCAL BRAND · FOUNDER': '로컬 브랜드 · 대표',
    'PRODUCT PHOTO → SALES PAGE → AD VIDEO': '제품 사진 → 상세페이지 → 광고 영상', 'YOUR PRODUCT': '내 상품', 'PRODUCT STORY': '상품 이야기',
    'BEFORE / AFTER AUTO REEL': '전후 자동 전환 릴', 'BEFORE': '원본', 'AFTER': '결과', 'AI AFTER': 'AI 결과 시안', 'AUTO REEL': '자동 전환 릴',
    'BEAUTY · HAIR · NAIL': '뷰티 · 헤어 · 네일', 'FITNESS · STYLE CHANGE': '스타일 · 분위기 전환', 'INTERIOR · SPACE': '인테리어 · 공간', 'PET · MEMORY · GROOMING': '반려동물 · 추억 · 그루밍',
    "DIRECTOR'S PROMPT RECIPES": '디렉터의 프롬프트 레시피', 'PRODUCT · PREMIUM': '제품 · 프리미엄', 'PHYSICS PAUSE': '순간 정지', 'COPY PROMPT': '프롬프트 복사', 'APPLY TO MY PHOTO ↗': '내 사진에 적용 ↗',
    'BEAUTY · MACRO': '뷰티 · 매크로', 'REFRACTION NOTE': '빛의 굴절', 'MEMORIAL · GENTLE': '메모리얼 · 섬세한 움직임', 'ARCHIVE BREATH': '기억의 숨결', 'EDITORIAL · PORTRAIT': '에디토리얼 · 인물', 'FRAME PASS': '프레임 전환',
    'TRAVEL · TRANSFORM': '여행 · 변신', 'EDGE CUT': '장면 전환', 'MUSIC VIDEO · PULSE': '뮤직비디오 · 비트', 'BEAT FOLD': '비트 폴드', 'FOOD · TACTILE': '푸드 · 질감', 'HEAT INDEX': '열감 지수',
    'WEDDING · FILM': '웨딩 · 필름', 'BORROWED LIGHT': '스치는 빛', 'CLASSIC · RESTORATION': '고전 사진 · 복원', 'FILM GATE': '필름 게이트', 'ID · PROFILE': '프로필 · 신원 보존', 'IDENTITY LOCK': '정체성 유지',
    'AI Draft + Human Polish': 'AI 초안 · 전문가 보정', 'Product Consistency Check': '제품 일관성 검수', 'KRW Payment': '원화 결제', 'Launch Ready': '오픈 준비 완료',
    'IMAGE TO CINEMA': '이미지에서 시네마로', 'FROM ONE IMAGE': '한 장의 사진에서', 'TO A COMMERCIAL VIDEO.': '상업용 영상으로.', 'IMAGE BASED': '사진 기반', 'CINEMATIC MOTION': '시네마틱 모션', 'COMMERCIAL READY': '상업용 준비', 'WATCH TRANSFORMATION ↗': '변환 결과 보기 ↗',
    'Sample Work 02 · Beauty': '작업 예시 02 · 뷰티', 'CLEAN': '클린', 'WATER FILM.': '워터 필름.', '15s Beauty Ad': '15초 뷰티 광고', 'Water Texture': '물의 질감', 'Clean Premium': '클린 프리미엄', 'Product Film': '제품 필름', 'WATCH SAMPLE ↗': '예시 보기 ↗',
    'DIRECTION FLOW': '연출 흐름', 'TIME 00:00–00:05': '시간 00:00–00:05', 'SCENE / CONTENT': '장면 / 내용', 'VIDEO PROMPT': '영상 프롬프트', 'TIME 00:05–00:10': '시간 00:05–00:10', 'TIME 00:10–00:15': '시간 00:10–00:15', 'Beauty Cleansing Oil': '뷰티 클렌징 오일', 'Water, skin, product and clean premium mood.': '물, 피부, 제품, 클린 프리미엄 무드.',
    'Our Services': '서비스', '4 CORE AI STUDIOS': '4가지 핵심 AI 스튜디오', 'Commercial Video': '상업용 영상', 'Starter / Pro / Signature': '스타터 / 프로 / 시그니처', 'Personal Transform': '개인 변신', 'Travel / Fashion / Walking': '여행 / 패션 / 워킹', 'Memory Video': '추억 영상', 'Memorial Basic / Duo': '메모리얼 베이직 / 듀오', 'ID / Profile File': '프로필 파일', 'Profile Mini / Set / Profile Pro': '프로필 미니 / 세트 / 프로',
    'CHOOSE A PRODUCTION TYPE': '제작 유형 선택', 'VIEW VERIFIED RESULTS ↗': '실제 결과 보기 ↗', '01 · PRODUCT AD': '01 · 제품 광고', '15 SEC · PRO': '15초 · 프로', '02 · AUTOMOTIVE': '02 · 자동차', '30 SEC · SIGNATURE': '30초 · 시그니처', '03 · BEAUTY': '03 · 뷰티', '04 · TRAVEL': '04 · 여행', '9 SEC · TRANSFORM': '9초 · 변신', '05 · WEDDING': '05 · 웨딩', '06 · PET MEMORIAL': '06 · 펫 메모리얼', '1 PHOTO · MEMORIAL': '사진 1장 · 메모리얼', '07 · SKETCH + LOGO LAB': '07 · 스케치 + 로고 연구소', 'FROM ₩59,900 · DESIGN MOTION': '₩59,900부터 · 디자인 모션',
    'AI VIDEO VENDING MACHINE': 'AI 비디오 자판기', 'AS EASY AS': '이토록 쉬운', 'ONE CLICK': '원 클릭', 'Insert your image, choose the mood, and get a cinematic video. It’s that simple.': '사진을 넣고, 무드를 고르면, 시네마틱 영상으로 완성됩니다.', 'HOW IT WORKS ↗': '이용 방법 ↗', 'Insert Image': '사진 넣기', 'Upload the image you want to bring to life.': '움직이고 싶은 사진을 올리세요.', 'Choose Mood': '무드 선택', 'Select a mood and style that fits your story.': '이야기에 맞는 무드와 스타일을 고르세요.', 'Press Start': '시작 누르기', 'One click is all it takes. We handle the rest.': '한 번의 클릭이면 충분합니다. 나머지는 AVVM이 합니다.', 'Get Cinematic Film': '시네마틱 영상 받기', 'Your premium video is ready.': '프리미엄 영상이 준비됩니다.',
    'Beta Service Open': '베타 서비스 오픈', 'BETA OPEN': '베타 오픈', '1-Click': '원 클릭', 'Simple Video Order': '간편 영상 주문', 'AI Engine': 'AI 엔진', 'Cinematic Video Generation': '시네마틱 영상 생성', 'Quality': '품질', 'Expert Final Review': '전문가 최종 검수',
    'Not instant automation. Better than that.': '단순 자동 생성이 아닙니다. 더 완성도 있게.', 'AI SPEED.': 'AI의 속도.', 'HUMAN FINISH.': '사람의 완성도.', 'Why “Vending Machine”?': '왜 “비디오 자판기”인가요?', 'Delivery Guide': '제공 안내', 'Realistic Expectation': '현실적인 기대 기준', 'Commerce owners care about this most': '소상공인이 가장 중요하게 보는 기준', 'KEEP THE': '지키는 것', 'PRODUCT RIGHT.': '제품의 정확성.', 'Logo & Label Check': '로고 · 라벨 확인', 'Shape Preservation': '형태 보존', 'Commerce First': '상업용 우선', 'LIVE PRE-FLIGHT': '실시간 사전 점검', 'YOUR SOURCE.': '내 원본을', 'CHECKED FIRST.': '먼저 확인하세요.', 'CHECK MY PHOTO ↗': '내 사진 확인 ↗', 'Show before payment': '결제 전 미리보기', 'TRY BEFORE': '주문 전', 'FULL ORDER.': '먼저 확인.',
    'Portfolio expansion': '포트폴리오 확장', '9 SECTORS.': '9개 분야.', 'ONE ENGINE.': '하나의 엔진.', 'AUTOMOTIVE': '자동차', 'F1 AERIAL DRIVE': 'F1 공중 추적 드라이브', 'CULTURE': '문화', 'HERITAGE TO FUTURE': '전통에서 미래로', 'BUSINESS': '비즈니스', 'CORPORATE FILM': '기업 필름', 'BEAUTY': '뷰티', 'BEAUTY PERFORMANCE': '뷰티 퍼포먼스', 'EVENT': '이벤트', 'FESTIVAL FILM': '축제 필름', 'STORY': '스토리', 'LIFESTYLE STORY': '라이프스타일 스토리', 'METAVERSE': '메타버스', 'CULTURE NETWORK': '문화 네트워크', 'MUSIC VIDEO': '뮤직비디오', 'DANCE PERFORMANCE': '댄스 퍼포먼스', 'ACTION': '액션', 'EXPERIMENTAL ACTION': '실험적 액션',
    'Pricing details': '가격 안내', 'WHAT IS': '포함', 'INCLUDED?': '내용', 'Feature': '항목', 'Starter': '스타터', 'Pro': '프로', 'Signature': '시그니처', 'Length': '길이', 'approx. 10s (9s)': '약 10초 (9초)', '15s': '15초', '30s': '30초', 'Commercial use': '상업적 사용', 'Included': '포함', 'BGM / SFX': '배경음 / 효과음', 'Basic': '기본', 'Premium': '프리미엄', 'Caption / Copy': '자막 / 문구', 'AI Voiceover': 'AI 보이스오버', 'Option': '선택', 'Consult': '상담', 'Revision': '수정', 'None': '없음', '1 round': '1회', '2 rounds': '2회', 'Aspect Ratio': '화면 비율', 'Resolution': '해상도',
    'For everyone · sticker-photo price': '누구나 · 스티커 사진 가격부터', 'ONE PHOTO,': '사진 한 장,', 'NEW WORLD.': '새로운 세계.', '01 · Travel Jump': '01 · 여행 점프', '02 · Fashion Switch': '02 · 패션 전환', '03 · Walk Transform': '03 · 워킹 변신', 'TRY': '체험', 'Mini': '미니', 'TRY NOW': '지금 체험', 'BEST': '추천', 'START TRANSFORM': '변신 시작', 'PLUS': '플러스', 'Best': '베스트', 'CHOOSE BEST': '베스트 선택', 'SET': '세트', '3 Style Set': '3가지 스타일 세트', 'GET SET': '세트 선택', 'Hot Transform Styles': '인기 변신 스타일', 'PRICING': '가격', 'KRW / USD / JPY READY': 'KRW / USD / JPY 지원',
    'SISTER BRAND · WEB-STUDIO': '자매 브랜드 · WEB-STUDIO', 'WATCH. JEWELRY.': '시계. 주얼리.', 'LIFESTYLE.': '라이프스타일.', 'The AI Video Vending Machine': 'AI 비디오 자판기', 'Service': '서비스', 'Terms': '이용약관', 'Privacy': '개인정보처리방침', 'Refund': '환불정책', 'Delivery': '디지털 제공 안내',
    'INSERT IMAGE.': '사진을 넣으세요.', 'PRESS START.': '시작을 누르세요.', 'CHOOSE YOUR START': '시작 방식 선택', 'Mini Transform': '미니 변신', 'Basic Transform': '베이직 변신', 'Best Transform': '베스트 변신', 'RECOMMENDED': '추천', 'PREMIUM': '프리미엄', 'CUSTOM': '맞춤', 'Custom Project': '맞춤 프로젝트', 'DUO': '듀오', 'MINI': '미니', 'PRO': '프로', 'SKETCH → JEWEL': '스케치 → 주얼리', 'Jewelry Motion': '주얼리 모션', 'WORD → LOGO': '단어 → 로고', 'Logo Lab': '로고 연구소', 'AI AFTER PREVIEW': 'AI 결과 시안 미리보기', 'Before / After Auto Reel': '전후 자동 전환 릴', 'Selected plan: Pro · ₩39,900': '선택 플랜: 프로 · ₩39,900',
    'CHOOSE YOUR INPUT': '입력 방식 선택', 'AI AFTER / AUTO REEL': 'AI 결과 시안 / 자동 전환 릴', '01 · BEFORE': '01 · 원본', '02 · AI AFTER': '02 · AI 결과 시안', '03 · AUTO REEL': '03 · 자동 전환 릴', 'AVVM PROMPT FINDER': 'AVVM 프롬프트 찾기', 'AVVM DIRECTION': 'AVVM 연출', 'IMAGE PROMPT': '이미지 프롬프트', 'AUTO REEL PROMPT': '자동 전환 릴 프롬프트', 'NEGATIVE / GUARDRAILS': '제한 사항 / 가드레일', 'AI AFTER READY · PREVIEW': 'AI 결과 시안 완료 · 미리보기', 'AVVM PRE-FLIGHT': 'AVVM 사전 점검', 'YOUR SOURCE': '내 원본', 'ANALYZING': '분석 중', 'PIXELS': '화소', 'LIGHT': '빛', 'DETAIL': '디테일', 'BEAUTY · 9:16 · 1080P': '뷰티 · 9:16 · 1080P', 'Beauty': '뷰티', 'Product': '제품', 'Food': '푸드', 'Travel': '여행', 'Wedding': '웨딩', 'Design Lab': '디자인 연구소', 'Custom': '맞춤', 'AVVM DESIGN LAB': 'AVVM 디자인 연구소', 'SELECTED DIRECTION': '선택한 연출', 'LIQUID REFRACTION': '액체 굴절', 'AVVM CURATED RECIPES': 'AVVM 검수 레시피', 'OPTIONAL': '선택', 'PLAN INCLUDED': '플랜 포함', 'FULL HD · 1080P': '풀 HD · 1080P', 'PROJECT': '프로젝트', 'STARTED.': '시작됨.', 'ORDER #AVVM-DEMO': '주문 #AVVM-DEMO', 'DOWNLOAD ORDER': '주문 다운로드', 'CREATE ANOTHER': '새로 만들기', 'AVVM SHOWREEL': 'AVVM 쇼릴', 'Ready': '준비 완료'
  });

  function koreanText(source) {
    return koreanTextFallbacks[normalizeTranslationKey(source)] || source;
  }

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
      const leading = (original.match(/^\s*/) || [''])[0];
      const trailing = (original.match(/\s*$/) || [''])[0];
      const value = original.slice(leading.length, original.length - trailing.length);
      if (isKorean()) { node.nodeValue = `${leading}${koreanText(value)}${trailing}`; return; }
      node.nodeValue = `${leading}${autoText(value, value)}${trailing}`;
    });
  }

  function captureAutoAttributes() {
    if (autoAttributes.length || !document.body) return;
    document.querySelectorAll('img, video, input, textarea, [aria-label], [title]').forEach(node => {
      ['alt', 'aria-label', 'placeholder', 'title'].forEach(attribute => {
        // Dedicated i18n attributes remain the source of truth.
        if ((attribute === 'aria-label' && node.dataset.i18nAria) ||
            (attribute === 'placeholder' && node.dataset.i18nPlaceholder)) return;
        const original = node.getAttribute(attribute);
        if (!normalizeTranslationKey(original)) return;
        autoAttributes.push({ node, attribute, original });
      });
    });
  }

  function applyAutoAttributes() {
    autoAttributes.forEach(({ node, attribute, original }) => {
      if (!node.isConnected) return;
      if (isKorean()) {
        node.setAttribute(attribute, original);
        return;
      }
      // If a native string exists in the generated language map, use it. The
      // English fallback also makes every remaining label understandable rather
      // than exposing Korean accessibility or form copy in another locale.
      node.setAttribute(attribute, autoText(original, englishAttributeFallbacks[original] || original));
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
    localizedKey('.service-card:nth-of-type(4) p', 'serviceIdCopy', 'High-quality digital profile files for employment, social, and staff use without a studio visit.');
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
      // Korean is a locale too. Previously it always restored the source HTML,
      // which left source-language (mostly English) labels scattered through
      // the Korean experience even when a Korean UI value existed.
      if (!isKorean()) node.innerHTML = locale[key] || autoHtml(node.dataset.avvmKoHtml, en[key] || node.dataset.avvmKoHtml);
      else node.innerHTML = ko[key] || node.dataset.avvmKoHtml;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(node => {
      const key = node.dataset.i18nPlaceholder;
      if (!node.dataset.avvmKoPlaceholder) node.dataset.avvmKoPlaceholder = node.getAttribute('placeholder') || '';
      node.setAttribute('placeholder', isKorean() ? node.dataset.avvmKoPlaceholder : t(key, node.dataset.avvmKoPlaceholder));
    });
  }

  function applyAriaLabels() {
    document.querySelectorAll('[data-i18n-aria]').forEach(node => {
      const key = node.dataset.i18nAria;
      if (!node.dataset.avvmKoAria) node.dataset.avvmKoAria = node.getAttribute('aria-label') || '';
      node.setAttribute('aria-label', isKorean() ? node.dataset.avvmKoAria : t(key, node.dataset.avvmKoAria));
    });
  }

  function applyFooterAndCheckout() {
    const labels = footerLabels[language] || footerLabels.en;
    document.querySelectorAll('.footer-links a').forEach((node, index) => {
      if (!node.dataset.avvmKoText) node.dataset.avvmKoText = node.textContent;
      setText(node, labels[index] || node.dataset.avvmKoText);
    });
    localized('.business-info', `
      <b>AVVM.studio business information</b><br>
      Business name: Lalaland Mom · Brand: AVVM.studio · Representative: Dongkuk Yoon<br>
      Business registration no.: 347-37-01807 · Mail-order sales registration: 2026-Gyeonggi Paju-2862<br>
      Contact: 0505-007-5221 · Email: airyoon72@naver.com · Domain: avvm.studio<br>
      Business address: 2F, Unit 02, Building B, 182-37 Miraero 310beon-gil, Dongpae-dong, Botanic, Paju-si, Gyeonggi-do, Republic of Korea<br>
      This is a made-to-order digital-content service with no physical delivery. Payments are processed in KRW.<br>
      Delivery begins after payment and production materials are received. Transform products take 1–3 business days; 3 Style Set takes 3–7 business days; Starter 24–48 hours; Pro 2–3 business days; Signature 3–5 business days. Memorial and ID/Profile products follow the 24–48 hour period shown on their cards.<br>
      Payment processing and personal-information handling are entrusted to PortOne Co., Ltd. for payment processing, payment-result confirmation, and settlement.<br>
      <a href="#" data-legal="service">Service / product information</a> · <a href="#" data-legal="delivery">Digital-delivery guide</a> · <a href="#" data-legal="terms">Terms</a> · <a href="#" data-legal="privacy">Privacy policy</a> · <a href="#" data-legal="refund">Refund policy</a> · <a href="#" data-legal="pg">PG review information</a>`, true);
    localizedKey('.business-address', 'businessAddress', 'Business address: 2F, Unit 02, Building B, 182-37 Miraero 310beon-gil, Dongpae-dong, Botanic, Paju-si, Gyeonggi-do, Republic of Korea');

    localized('.plan-chooser-head .mini-eyebrow', 'CHOOSE YOUR START');
    localized('.plan-chooser-head h3', 'Choose the type of production you want first.');
    localized('.plan-chooser-head p', 'After pressing Start, choose the product you want before entering payment information.');
    ['Personal / SNS', 'Business / advertising', 'Memorial restoration', 'ID / profile'].forEach((value, index) => localized(`.plan-choice-section:nth-child(${index + 1}) .plan-choice-kicker`, value));
    const planCopy = {
      'Mini Transform': '5 seconds / 1 style / easy first try', 'Basic Transform': '9 seconds / basic SNS transformation', 'Best Transform': 'About 10 seconds (9 seconds) / travel + fashion mood',
      '3 Style Set': 'Travel, fashion, and walking transformation set', 'Starter': 'About 10 seconds (9 seconds) / fast short-form ad', 'Pro': '15 seconds / brand-product ad / one revision',
      'Signature': '30 seconds / showreel-brand film / two revisions', 'Custom': 'Contest, film-festival, and large-brand videos', 'Memorial Basic': 'Restore one photo / one regeneration',
      'Memorial Duo': 'Two-photo video set / one regeneration', 'ID Mini': 'One employment, staff, social, or official-spec profile file', 'ID Set': 'Three practical profile crops for different uses', 'Profile Pro': 'Premium retouching for employment, staff, social, and business profiles'
    };
    Object.entries(planCopy).forEach(([plan, value]) => localized(`[data-plan-choice="${plan}"] small`, value));

    localized('#photoUploadVisibleBlock .order-form-section-title', '2. Add a reference photo (optional)');
    localized('#photoUploadVisibleBlock .order-form-helper', 'Attach a photo, product image, or sketch when you have one. For photo-guided production, upload the source before payment.');
    localized('.photo-upload-drop b', 'Attach photo'); localized('.photo-upload-drop small', 'JPG, PNG, or WEBP image file');
    localized('#uploadGuideBox', '💡 <b>Profile and official-submission guide:</b> Upload a clear front-facing photo of yourself. Official-submission files preserve facial contours and features; we only adjust the required crop, dimensions, and file size.', true);
    localized('#idSpecGroup .order-option-title', 'Choose file use');
    [['취업 프로필', 'Employment profile'], ['사원 프로필', 'Staff profile'], ['SNS 프로필', 'Social profile'], ['공식 제출용 규격', 'Official-submission specification']].forEach(([value, copy]) => localized(`#idSpecGroup [data-value="${value}"]`, copy));
    localized('.style-select-block .order-form-section-title', '2. Choose a video style'); localized('.style-select-block .order-form-helper', 'Choose the AI direction and style to apply to your photo.');
    localized('.delivery-info-block .order-form-section-title', '3. Enter delivery contact details'); localized('.delivery-info-block .order-form-helper', 'We will send the completed-video download link by email, KakaoTalk, or SMS.');
    localized('label[for="brandInput"]', 'Name / brand <span>*</span>', true); localized('label[for="emailInput"]', 'Email address'); localized('label[for="phoneInput"]', 'Mobile number <span>*</span>', true);
    [['#brandInput', 'Enter your name or brand'], ['#emailInput', 'Email for the video download link'], ['#phoneInput', 'Mobile number for KakaoTalk/SMS delivery'], ['#moodInput', 'Additional requests or video description (optional)']].forEach(([selector, value]) => {
      const node = document.querySelector(selector); if (!node) return;
      if (!node.dataset.avvmKoPlaceholder) node.dataset.avvmKoPlaceholder = node.placeholder;
      node.placeholder = !isKorean() ? value : node.dataset.avvmKoPlaceholder;
    });
    localized('.checkout-notice', `<p class="test-mode-note"><b>PG review test mode is currently active.</b><br>This button opens the KPN test payment window. Live payment completion is enabled only after PG approval and server verification are connected.</p><b>Before payment</b><p>This product is made-to-order digital content based on your image. Cancellation or refund for a change of mind may be limited after production starts.</p><p><b>Profile-file notice:</b> AVVM focuses on employment, staff, social, and business profiles. Official-submission files only match crop, size, and file requirements from the original image; an institution may reject the file, and AVVM does not guarantee acceptance. Facial contours and features are not changed.</p><p>You must have rights to use every uploaded photo, logo, product image, and portrait. Uploading another person’s photo is prohibited; a minor or another person requires confirmed authority from the individual or legal guardian. Production files are retained for up to 30 days after delivery for re-download support, then deleted.</p>`, true);
    const consentCopy = [
      '<b>[Required] Consent to collect and use personal information</b><br>I consent to the collection and use of my name, phone number, email, uploaded image, and order information for order handling and delivery.',
      '<b>[Required] Consent to receive order updates</b><br>I consent to receive transaction-related notices, including order receipt, production updates, and completion notices, by KakaoTalk, SMS, or email.',
      '<b>[Required] Custom digital-content and refund-limit acknowledgement</b><br>I understand this is made-to-order digital content based on my image and request, and cancellation or refund for a change of mind may be limited once production starts.',
      '<b>[Required] Image-use rights and portrait/copyright confirmation</b><br>I confirm that I have rights to use all uploaded photos, logos, product images, and portraits. I will not upload another person’s photo without authority, and I am not requesting impersonation, identity deception, or unauthorized commercial use.',
      '<b>[Optional] Marketing consent</b><br>I agree to receive events, discounts, new samples, and other marketing information by KakaoTalk, SMS, or email.'
    ];
    document.querySelectorAll('#consentGroup .consent-row span').forEach((node, index) => {
      if (!node.dataset.avvmKoHtml) node.dataset.avvmKoHtml = node.innerHTML;
      node.innerHTML = !isKorean() ? consentCopy[index] : node.dataset.avvmKoHtml;
    });
    localized('#resolutionGroup .order-form-helper', 'Delivery quality is included with the selected plan.');
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

    localized('#id-profile .section-bar .view-all', 'Employment, social, and staff profile files');
    localized('#id-profile .id-copy', 'Start with an employment, staff, social, or business profile from an existing photograph.<br>For official submission, we provide only crop, dimension, and file-size matching while preserving original facial contours and features.', true);
    localized('#id-profile [data-plan="ID Mini"] > h3', 'Profile Mini');
    localized('#id-profile [data-plan="ID Mini"] > p', 'One employment or social profile file');
    [
      'A source-based file tailored to the selected specification',
      'Choose employment, staff, social, or official-submission use',
      'Delivery: <b>within 24 hours</b>'
    ].forEach((copy, index) => localized(`#id-profile [data-plan="ID Mini"] li:nth-child(${index + 1})`, copy, true));
    localized('#id-profile [data-plan="ID Set"] > .badge', 'Recommended');
    localized('#id-profile [data-plan="ID Set"] > h3', 'Profile Set');
    localized('#id-profile [data-plan="ID Set"] > p', 'Three practical profile crops for different uses');
    [
      'A source-based file tailored to each specification',
      'Complete set of three practical profile crops',
      'Delivery: <b>within 24 hours</b>'
    ].forEach((copy, index) => localized(`#id-profile [data-plan="ID Set"] li:nth-child(${index + 1})`, copy, true));
    localized('#id-profile [data-plan="Profile Pro"] > p', 'Premium retouching for employment, staff, social, and business profiles');
    [
      'A source-based file tailored to the selected specification',
      'Detail refinement for skin, lighting, and background — no facial-feature changes',
      'Delivery: <b>within 48 hours</b>'
    ].forEach((copy, index) => localized(`#id-profile [data-plan="Profile Pro"] li:nth-child(${index + 1})`, copy, true));
    localized('.id-bottom-notice', '💡 AVVM focuses on employment, social, staff, and business profiles. Official-submission files only match the original image to required crop, dimensions, and file size; individual institutions may reject a file, and AVVM does not guarantee acceptance.<br>We do not change facial contours or features, replace faces, alter age, or process impersonation. Uploading another person’s photo is prohibited; for a minor or another person, the individual or legal guardian must confirm authority.<br>Production files are retained for up to 30 days after delivery for re-download and production support, then deleted. Payment and transaction records may be retained separately as required by law.', true);

    localized('.commerce-page-machine-head > span', 'PRODUCT PHOTO → SALES PAGE → AD VIDEO');
    localized('#commercePageTitle', 'Turn one product photo into a sales page and advertising video.');
    localized('.commerce-page-machine-head > p', 'Enter a hero product photo and its key benefit. AVVM organises the sales flow, opening line, detail points, and advertising-video scenes in one place.');
    const commerceSteps = ['Product photo', 'Sales point', 'Sales-page draft', 'Advertising video'];
    document.querySelectorAll('.commerce-page-process span').forEach((node, index) => {
      const number = String(index + 1).padStart(2, '0');
      localized(`.commerce-page-process span:nth-of-type(${index + 1})`, `${number} ${commerceSteps[index]}`);
    });
    localized('#commercePageForm label[for="commerceProductImage"] > span', '01 · Hero product photo');
    localized('#commerceProductImageLabel', 'Choose a photo');
    localized('#commercePageForm label[for="commerceProductImage"] small', 'Start with one hero photo · we confirm the extra detail shots needed before final production.');
    localized('#commercePageForm label[for="commerceProductName"] > span', '02 · Product or menu name');
    localized('#commercePageForm label[for="commerceProductBenefit"] > span', '03 · The benefit customers should feel');
    localized('.commerce-page-type button:nth-child(1)', 'Product');
    localized('.commerce-page-type button:nth-child(2)', 'Food');
    localized('.commerce-page-type button:nth-child(3)', 'Space');
    localized('.commerce-page-generate', 'CREATE SALES-PAGE DRAFT ↗');
    localized('#commercePagePreviewTitle', 'Upload a hero photo to reveal the sales structure.');
    localized('#commercePagePreviewLead', 'Even one photo can reveal an opening line and sales-page flow that makes customers pause.');
    ['First-screen purchase hook', 'Core benefit that creates trust', 'A scene that continues into an advertising video'].forEach((copy, index) => localized(`#commercePagePreviewPoints li:nth-child(${index + 1})`, copy));
    localized('#commercePageVideoLine', 'VIDEO CUT · Product hero → detail → use moment → call to action');
    localized('#commercePageOrder', 'MAKE THE SALES PAGE + AD VIDEO FROM THIS DRAFT ↗');
    localized('#commercePageOutput > small', 'The draft is free to view in this browser. The final sales page and video are produced after confirmation.');
    const productName = document.getElementById('commerceProductName');
    const productBenefit = document.getElementById('commerceProductBenefit');
    if (productName) productName.placeholder = !isKorean() ? 'e.g. Fresh basil cream-cheese bagel' : '예: 수제 바질 크림치즈 베이글';
    if (productBenefit) productBenefit.placeholder = !isKorean() ? 'e.g. Fresh-baked chew, same-day delivery, and gift-ready packaging' : '예: 매일 아침 구운 쫄깃한 식감, 당일 배송, 선물용 패키지';
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
    applyAriaLabels();
    applyAutoAttributes();
    applyStaticPageCopy();
    applyFooterAndCheckout();
    applyLowerPageSections();
    applyOrderPage();
    applyAutoTextNodes();
    applyHelpText();
    document.querySelectorAll('[data-avvm-language-select], #nativeLangSelect, #heroNativeLangSelect').forEach(select => { select.value = language; });
    document.dispatchEvent(new CustomEvent('avvm:languagechange', { detail: { language } }));
    // Text reflow happens after a language switch. Reset any stale horizontal
    // iPhone Safari offset once the new Japanese/Chinese copy is applied.
    requestAnimationFrame(() => window.scrollTo({ left: 0, top: window.scrollY, behavior: 'auto' }));
  }

  function init() {
    captureAutoTextNodes();
    captureAutoAttributes();
    document.querySelectorAll('[data-avvm-language-select], #nativeLangSelect, #heroNativeLangSelect').forEach(select => {
      select.addEventListener('change', event => apply(event.target.value));
    });
    apply(language);
  }

  window.AVVM_I18N = { t, apply, status, localize: autoText, languages: LANGUAGE_META, get language() { return language; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
