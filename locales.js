/* AVVM core language packs. English remains the safe fallback for unlisted copy. */
(function () {
  'use strict';

  window.AVVM_LANGUAGE_META = {
    ko: { htmlLang: 'ko', label: '한국어', dir: 'ltr' },
    en: { htmlLang: 'en', label: 'English', dir: 'ltr' },
    ja: { htmlLang: 'ja', label: '日本語', dir: 'ltr' },
    zh: { htmlLang: 'zh-CN', label: '简体中文', dir: 'ltr' },
    es: { htmlLang: 'es', label: 'Español', dir: 'ltr' },
    fr: { htmlLang: 'fr', label: 'Français', dir: 'ltr' },
    de: { htmlLang: 'de', label: 'Deutsch', dir: 'ltr' },
    pt: { htmlLang: 'pt-BR', label: 'Português', dir: 'ltr' },
    hi: { htmlLang: 'hi', label: 'हिन्दी', dir: 'ltr' },
    ar: { htmlLang: 'ar', label: 'العربية', dir: 'rtl' }
  };

  window.AVVM_LOCALES = {
    ja: {
      navWorks: '作品', navTransform: '変身', navBusiness: 'ビジネス', navMemorial: 'メモリアル', navProfile: '証明写真・プロフィール', navFaq: 'よくある質問',
      heroSub: '一枚の写真から、プレミアムな商用映像を。', startProject: 'プロジェクトを始める ↗', viewShowreel: 'ショーリールを見る', scrollExplore: 'スクロールして見る',
      proofLabEyebrow: '結果プレビューライブラリ', proofLabTitle: 'あなたの写真を、<br>結果で確かめる。', demoEyebrow: 'IMAGE TO CINEMA', demoTitle: '一枚の画像から<br>商用映像へ。',
      portfolioKicker: 'ポートフォリオの拡張', portfolioTitle: '9つの領域。<br>ひとつのエンジン。', consumerKicker: 'すべての人のために', consumerTitle: '一枚の写真、<br>新しい世界。',
      webStudioPending: 'WEB-STUDIOを見る ↗', modalEyebrow: 'プロジェクトを始める', modalTitle: '画像を入れて。<br>スタートを押す。',
      worksKicker: '制作タイプを選ぶ', worksTitle: '何を<br>つくりますか？', worksResult: '実際の結果を見る ↗', worksStart: '自分の写真で作る ↗',
      attachPhoto: '写真を添付', paymentOpening: '決済画面を開いています...', optimizingImage: '画像を最適化しています...', requestFailed: '動画制作リクエストに失敗しました', retryGeneration: '再試行',
      statusQueued: 'キューに入っています', statusProcessing: '映像フレームを生成しています...', statusCompleted: '動画が完成しました！', statusFailed: '動画制作に失敗しました',
      orderReceived: '注文を受け付けました', orderProcessing: '映像を制作中', orderCompleteStatus: '制作完了', orderFailed: '制作失敗', backHome: 'ホームへ戻る'
    },
    zh: {
      navWorks: '作品', navTransform: '风格变换', navBusiness: '商业', navMemorial: '记忆修复', navProfile: '证件照·形象照', navFaq: '常见问题',
      heroSub: '一张照片，生成高品质商业视频。', startProject: '开始项目 ↗', viewShowreel: '观看作品集', scrollExplore: '向下探索',
      proofLabEyebrow: '效果预览库', proofLabTitle: '你的照片，<br>用结果说话。', demoEyebrow: 'IMAGE TO CINEMA', demoTitle: '从一张图片<br>到商业视频。',
      portfolioKicker: '作品集扩展', portfolioTitle: '九大领域。<br>一个引擎。', consumerKicker: '面向每一个人', consumerTitle: '一张照片，<br>一个新世界。',
      webStudioPending: '访问 WEB-STUDIO ↗', modalEyebrow: '开始项目', modalTitle: '放入图片。<br>按下开始。',
      worksKicker: '选择制作类型', worksTitle: '你想<br>制作什么？', worksResult: '查看真实效果 ↗', worksStart: '用我的照片制作 ↗',
      attachPhoto: '上传照片', paymentOpening: '正在打开支付窗口...', optimizingImage: '正在优化图片...', requestFailed: '视频制作请求失败', retryGeneration: '重试',
      statusQueued: '正在进入队列', statusProcessing: '正在渲染视频画面...', statusCompleted: '视频已完成！', statusFailed: '视频制作失败',
      orderReceived: '订单已受理', orderProcessing: '视频制作中', orderCompleteStatus: '制作完成', orderFailed: '制作失败', backHome: '返回首页'
    },
    es: {
      navWorks: 'Proyectos', navTransform: 'Transformación', navBusiness: 'Negocios', navMemorial: 'Memorial', navProfile: 'Documento·Perfil', navFaq: 'Preguntas frecuentes',
      heroSub: 'Vídeos comerciales premium a partir de una sola foto.', startProject: 'INICIAR PROYECTO ↗', viewShowreel: 'VER SHOWREEL', scrollExplore: 'DESPLAZAR PARA EXPLORAR',
      proofLabEyebrow: 'BIBLIOTECA DE RESULTADOS', proofLabTitle: 'TU FOTO,<br>CON PRUEBAS.', demoEyebrow: 'IMAGEN A CINE', demoTitle: 'DE UNA IMAGEN<br>A UN VÍDEO COMERCIAL.',
      portfolioKicker: 'Ampliación de portafolio', portfolioTitle: '9 SECTORES.<br>UN MOTOR.', consumerKicker: 'Para todos', consumerTitle: 'UNA FOTO,<br>UN NUEVO MUNDO.',
      webStudioPending: 'VISITAR WEB-STUDIO ↗', modalEyebrow: 'INICIAR PROYECTO', modalTitle: 'INSERTA UNA IMAGEN.<br>PULSA INICIAR.',
      worksKicker: 'ELIGE UN TIPO DE PRODUCCIÓN', worksTitle: '¿QUÉ QUIERES<br>CREAR?', worksResult: 'VER RESULTADO REAL ↗', worksStart: 'CREAR EL MÍO ↗',
      attachPhoto: 'Adjuntar foto', paymentOpening: 'Abriendo la ventana de pago...', optimizingImage: 'Optimizando imagen...', requestFailed: 'LA SOLICITUD DE VÍDEO HA FALLADO', retryGeneration: 'Reintentar',
      statusQueued: 'Entrando en la cola', statusProcessing: 'Renderizando fotogramas...', statusCompleted: '¡Vídeo terminado!', statusFailed: 'La producción de vídeo ha fallado',
      orderReceived: 'Pedido recibido', orderProcessing: 'Vídeo en producción', orderCompleteStatus: 'Producción completada', orderFailed: 'Producción fallida', backHome: 'VOLVER AL INICIO'
    },
    fr: {
      navWorks: 'Réalisations', navTransform: 'Transformation', navBusiness: 'Business', navMemorial: 'Mémoire', navProfile: 'Identité·Profil', navFaq: 'FAQ',
      heroSub: 'Des vidéos commerciales premium à partir d’une seule photo.', startProject: 'DÉMARRER LE PROJET ↗', viewShowreel: 'VOIR LE SHOWREEL', scrollExplore: 'FAIRE DÉFILER POUR EXPLORER',
      proofLabEyebrow: 'BIBLIOTHÈQUE DES RÉSULTATS', proofLabTitle: 'VOTRE PHOTO,<br>LA PREUVE À L’APPUI.', demoEyebrow: 'IMAGE VERS CINÉMA', demoTitle: 'D’UNE IMAGE<br>À UNE VIDÉO COMMERCIALE.',
      portfolioKicker: 'Extension du portfolio', portfolioTitle: '9 SECTEURS.<br>UN MOTEUR.', consumerKicker: 'Pour tous', consumerTitle: 'UNE PHOTO,<br>UN NOUVEAU MONDE.',
      webStudioPending: 'VISITER WEB-STUDIO ↗', modalEyebrow: 'DÉMARRER LE PROJET', modalTitle: 'INSÉREZ L’IMAGE.<br>APPUYEZ SUR DÉMARRER.',
      worksKicker: 'CHOISIR UN TYPE DE PRODUCTION', worksTitle: 'QUE VOULEZ-VOUS<br>CRÉER ?', worksResult: 'VOIR LE RÉSULTAT RÉEL ↗', worksStart: 'CRÉER LE MIEN ↗',
      attachPhoto: 'Joindre une photo', paymentOpening: 'Ouverture de la fenêtre de paiement...', optimizingImage: 'Optimisation de l’image...', requestFailed: 'LA DEMANDE DE VIDÉO A ÉCHOUÉ', retryGeneration: 'Réessayer',
      statusQueued: 'Entrée dans la file', statusProcessing: 'Rendu des images vidéo...', statusCompleted: 'Vidéo terminée !', statusFailed: 'La production vidéo a échoué',
      orderReceived: 'Commande reçue', orderProcessing: 'Vidéo en production', orderCompleteStatus: 'Production terminée', orderFailed: 'Échec de production', backHome: 'RETOUR À L’ACCUEIL'
    },
    de: {
      navWorks: 'Arbeiten', navTransform: 'Transformation', navBusiness: 'Business', navMemorial: 'Erinnerung', navProfile: 'Ausweis·Profil', navFaq: 'FAQ',
      heroSub: 'Hochwertige Werbevideos aus nur einem Foto.', startProject: 'PROJEKT STARTEN ↗', viewShowreel: 'SHOWREEL ANSEHEN', scrollExplore: 'SCROLLEN ZUM ENTDECKEN',
      proofLabEyebrow: 'ERGEBNISVORSCHAU', proofLabTitle: 'IHR FOTO,<br>MIT BEWEIS.', demoEyebrow: 'BILD ZU FILM', demoTitle: 'VON EINEM BILD<br>ZU EINEM WERBEVIDEO.',
      portfolioKicker: 'Portfolio-Erweiterung', portfolioTitle: '9 BEREICHE.<br>EIN MOTOR.', consumerKicker: 'Für alle', consumerTitle: 'EIN FOTO,<br>EINE NEUE WELT.',
      webStudioPending: 'WEB-STUDIO BESUCHEN ↗', modalEyebrow: 'PROJEKT STARTEN', modalTitle: 'BILD EINFÜGEN.<br>START DRÜCKEN.',
      worksKicker: 'PRODUKTIONSART WÄHLEN', worksTitle: 'WAS MÖCHTEN SIE<br>ERSTELLEN?', worksResult: 'ECHTES ERGEBNIS ANSEHEN ↗', worksStart: 'MEINS ERSTELLEN ↗',
      attachPhoto: 'Foto anhängen', paymentOpening: 'Zahlungsfenster wird geöffnet...', optimizingImage: 'Bild wird optimiert...', requestFailed: 'VIDEOANFRAGE FEHLGESCHLAGEN', retryGeneration: 'Erneut versuchen',
      statusQueued: 'Warteschlange wird betreten', statusProcessing: 'Videobilder werden gerendert...', statusCompleted: 'Video fertig!', statusFailed: 'Videoproduktion fehlgeschlagen',
      orderReceived: 'Bestellung eingegangen', orderProcessing: 'Video in Produktion', orderCompleteStatus: 'Produktion abgeschlossen', orderFailed: 'Produktion fehlgeschlagen', backHome: 'ZURÜCK ZUR STARTSEITE'
    },
    pt: {
      navWorks: 'Projetos', navTransform: 'Transformação', navBusiness: 'Negócios', navMemorial: 'Memorial', navProfile: 'Documento·Perfil', navFaq: 'FAQ',
      heroSub: 'Vídeos comerciais premium a partir de uma única foto.', startProject: 'INICIAR PROJETO ↗', viewShowreel: 'VER SHOWREEL', scrollExplore: 'ROLE PARA EXPLORAR',
      proofLabEyebrow: 'BIBLIOTECA DE RESULTADOS', proofLabTitle: 'SUA FOTO,<br>COM PROVA.', demoEyebrow: 'IMAGEM PARA CINEMA', demoTitle: 'DE UMA IMAGEM<br>PARA UM VÍDEO COMERCIAL.',
      portfolioKicker: 'Expansão do portfólio', portfolioTitle: '9 SETORES.<br>UM MOTOR.', consumerKicker: 'Para todos', consumerTitle: 'UMA FOTO,<br>UM NOVO MUNDO.',
      webStudioPending: 'VISITAR WEB-STUDIO ↗', modalEyebrow: 'INICIAR PROJETO', modalTitle: 'INSIRA A IMAGEM.<br>PRESSIONE INICIAR.',
      worksKicker: 'ESCOLHA UM TIPO DE PRODUÇÃO', worksTitle: 'O QUE VOCÊ QUER<br>CRIAR?', worksResult: 'VER RESULTADO REAL ↗', worksStart: 'CRIAR O MEU ↗',
      attachPhoto: 'Anexar foto', paymentOpening: 'Abrindo a janela de pagamento...', optimizingImage: 'Otimizando imagem...', requestFailed: 'FALHA NO PEDIDO DE VÍDEO', retryGeneration: 'Tentar novamente',
      statusQueued: 'Entrando na fila', statusProcessing: 'Renderizando quadros de vídeo...', statusCompleted: 'Vídeo concluído!', statusFailed: 'Falha na produção do vídeo',
      orderReceived: 'Pedido recebido', orderProcessing: 'Vídeo em produção', orderCompleteStatus: 'Produção concluída', orderFailed: 'Falha na produção', backHome: 'VOLTAR AO INÍCIO'
    },
    hi: {
      navWorks: 'कार्य', navTransform: 'रूपांतरण', navBusiness: 'बिज़नेस', navMemorial: 'स्मृति', navProfile: 'आईडी·प्रोफ़ाइल', navFaq: 'सहायता',
      heroSub: 'एक ही फोटो से प्रीमियम कमर्शियल वीडियो।', startProject: 'प्रोजेक्ट शुरू करें ↗', viewShowreel: 'शोरील देखें', scrollExplore: 'देखने के लिए स्क्रॉल करें',
      proofLabEyebrow: 'परिणाम पूर्वावलोकन', proofLabTitle: 'आपकी फोटो,<br>परिणाम के साथ।', demoEyebrow: 'छवि से सिनेमा', demoTitle: 'एक छवि से<br>कमर्शियल वीडियो तक।',
      portfolioKicker: 'पोर्टफोलियो विस्तार', portfolioTitle: '9 क्षेत्र।<br>एक इंजन।', consumerKicker: 'सभी के लिए', consumerTitle: 'एक फोटो,<br>एक नई दुनिया।',
      webStudioPending: 'WEB-STUDIO देखें ↗', modalEyebrow: 'प्रोजेक्ट शुरू करें', modalTitle: 'छवि डालें।<br>स्टार्ट दबाएँ।',
      worksKicker: 'प्रोडक्शन प्रकार चुनें', worksTitle: 'आप क्या<br>बनाना चाहते हैं?', worksResult: 'वास्तविक परिणाम देखें ↗', worksStart: 'मेरी फोटो से बनाएँ ↗',
      attachPhoto: 'फोटो संलग्न करें', paymentOpening: 'भुगतान विंडो खुल रही है...', optimizingImage: 'छवि अनुकूलित की जा रही है...', requestFailed: 'वीडियो अनुरोध विफल हुआ', retryGeneration: 'फिर से प्रयास करें',
      statusQueued: 'कतार में प्रवेश हो रहा है', statusProcessing: 'वीडियो फ्रेम रेंडर हो रहे हैं...', statusCompleted: 'वीडियो तैयार है!', statusFailed: 'वीडियो निर्माण विफल हुआ',
      orderReceived: 'ऑर्डर प्राप्त हुआ', orderProcessing: 'वीडियो निर्माण में है', orderCompleteStatus: 'निर्माण पूर्ण', orderFailed: 'निर्माण विफल', backHome: 'होम पर वापस जाएँ'
    },
    ar: {
      navWorks: 'الأعمال', navTransform: 'التحويل', navBusiness: 'الأعمال التجارية', navMemorial: 'الذكريات', navProfile: 'الهوية·الملف الشخصي', navFaq: 'الأسئلة الشائعة',
      heroSub: 'فيديوهات تجارية مميزة من صورة واحدة.', startProject: 'ابدأ المشروع ↗', viewShowreel: 'شاهد الشوريل', scrollExplore: 'مرّر للاستكشاف',
      proofLabEyebrow: 'مكتبة معاينة النتائج', proofLabTitle: 'صورتك،<br>مع الدليل.', demoEyebrow: 'من الصورة إلى السينما', demoTitle: 'من صورة واحدة<br>إلى فيديو تجاري.',
      portfolioKicker: 'توسيع معرض الأعمال', portfolioTitle: '9 قطاعات.<br>محرك واحد.', consumerKicker: 'للجميع', consumerTitle: 'صورة واحدة،<br>عالم جديد.',
      webStudioPending: 'زيارة WEB-STUDIO ↗', modalEyebrow: 'ابدأ المشروع', modalTitle: 'أدخل الصورة.<br>اضغط ابدأ.',
      worksKicker: 'اختر نوع الإنتاج', worksTitle: 'ماذا تريد<br>أن تصنع؟', worksResult: 'شاهد النتيجة الفعلية ↗', worksStart: 'أنشئ نسختي ↗',
      attachPhoto: 'إرفاق صورة', paymentOpening: 'جارٍ فتح نافذة الدفع...', optimizingImage: 'جارٍ تحسين الصورة...', requestFailed: 'فشل طلب إنشاء الفيديو', retryGeneration: 'إعادة المحاولة',
      statusQueued: 'جارٍ الدخول إلى قائمة الانتظار', statusProcessing: 'جارٍ إنشاء إطارات الفيديو...', statusCompleted: 'اكتمل الفيديو!', statusFailed: 'فشل إنشاء الفيديو',
      orderReceived: 'تم استلام الطلب', orderProcessing: 'الفيديو قيد الإنتاج', orderCompleteStatus: 'اكتمل الإنتاج', orderFailed: 'فشل الإنتاج', backHome: 'العودة إلى الصفحة الرئيسية'
    }
  };

  /* Copy that does not have a data-i18n marker in the original markup. Keeping
     it here prevents the lower cards and quick navigation from being left in
     Korean when a visitor switches languages. */
  const supportingCopy = {
    ja: {
      quickProfileTag: '証明写真', serviceCommercialCopy: '一枚の写真から作る高解像度ブランド広告・商品ショーリール映像', servicePersonalCopy: '日常写真を海外旅行のショート動画やトレンド感あるファッション映像へ変換', serviceMemorialCopy: '家族・両親・大切なペットの思い出をよみがえらせる映像', serviceIdCopy: '写真館に行かずに作る、パスポート・免許証・社員証・プロフィール向け高品質デジタル写真', customQuote: '個別見積もり', recommended: 'おすすめ'
    },
    zh: {
      quickProfileTag: '证件照', serviceCommercialCopy: '用一张照片制作高清品牌广告与产品展示视频', servicePersonalCopy: '将日常照片变成海外旅行短片或潮流时尚大片', serviceMemorialCopy: '修复家人、父母和珍爱宠物的回忆影像', serviceIdCopy: '无需前往照相馆，制作适用于护照、驾照、工牌和头像的高品质电子照片', customQuote: '咨询报价', recommended: '推荐'
    },
    es: {
      quickProfileTag: 'FOTO DE ID', serviceCommercialCopy: 'Vídeos publicitarios y showreels de producto en alta resolución a partir de una foto', servicePersonalCopy: 'Convierte fotos cotidianas en reels de viaje o editoriales de moda', serviceMemorialCopy: 'Vídeos que restauran recuerdos de familia, padres y mascotas queridas', serviceIdCopy: 'Fotos digitales de alta calidad para pasaporte, licencia, credencial y perfil, sin visitar un estudio', customQuote: 'Presupuesto personalizado', recommended: 'Recomendado'
    },
    fr: {
      quickProfileTag: 'PHOTO D’IDENTITÉ', serviceCommercialCopy: 'Publicités de marque et showreels produit haute définition à partir d’une photo', servicePersonalCopy: 'Transformez des photos du quotidien en reels de voyage ou éditoriaux mode', serviceMemorialCopy: 'Vidéos qui restaurent les souvenirs de famille, de parents et d’animaux chers', serviceIdCopy: 'Photos numériques haute qualité pour passeport, permis, badge et profil, sans studio photo', customQuote: 'Devis sur mesure', recommended: 'Recommandé'
    },
    de: {
      quickProfileTag: 'AUSWEISFOTO', serviceCommercialCopy: 'Hochauflösende Markenwerbung und Produkt-Showreels aus einem einzigen Foto', servicePersonalCopy: 'Verwandeln Sie Alltagsfotos in Reise-Reels oder trendige Fashion-Editorials', serviceMemorialCopy: 'Videos, die Erinnerungen an Familie, Eltern und geliebte Haustiere bewahren', serviceIdCopy: 'Hochwertige digitale Fotos für Pass, Führerschein, Ausweis und Profil – ohne Fotostudio', customQuote: 'Individuelles Angebot', recommended: 'Empfohlen'
    },
    pt: {
      quickProfileTag: 'FOTO DE ID', serviceCommercialCopy: 'Anúncios de marca e showreels de produtos em alta resolução a partir de uma foto', servicePersonalCopy: 'Transforme fotos do dia a dia em reels de viagem ou editoriais de moda', serviceMemorialCopy: 'Vídeos que restauram memórias de família, pais e animais de estimação queridos', serviceIdCopy: 'Fotos digitais de alta qualidade para passaporte, habilitação, crachá e perfil sem ir ao estúdio', customQuote: 'Orçamento sob consulta', recommended: 'Recomendado'
    },
    hi: {
      quickProfileTag: 'आईडी फोटो', serviceCommercialCopy: 'एक फोटो से हाई-रिज़ॉल्यूशन ब्रांड विज्ञापन और उत्पाद शो-रील वीडियो', servicePersonalCopy: 'रोज़मर्रा की तस्वीरों को यात्रा रील्स या ट्रेंडी फैशन एडिटोरियल में बदलें', serviceMemorialCopy: 'परिवार, माता-पिता और प्यारे पालतू जानवरों की यादों को संजोने वाले वीडियो', serviceIdCopy: 'स्टूडियो जाए बिना पासपोर्ट, लाइसेंस, आईडी और प्रोफ़ाइल के लिए उच्च-गुणवत्ता डिजिटल फोटो', customQuote: 'कस्टम कोटेशन', recommended: 'सुझावित'
    },
    ar: {
      quickProfileTag: 'صورة هوية', serviceCommercialCopy: 'إعلانات للعلامات التجارية وعروض منتجات عالية الدقة من صورة واحدة', servicePersonalCopy: 'حوّل الصور اليومية إلى مقاطع سفر قصيرة أو إطلالات أزياء عصرية', serviceMemorialCopy: 'فيديوهات تستعيد ذكريات العائلة والوالدين والحيوانات الأليفة العزيزة', serviceIdCopy: 'صور رقمية عالية الجودة للجواز والرخصة والبطاقة والملف الشخصي من دون زيارة الاستوديو', customQuote: 'عرض سعر مخصص', recommended: 'موصى به'
    }
  };

  Object.entries(supportingCopy).forEach(([language, copy]) => {
    Object.assign(window.AVVM_LOCALES[language], copy);
  });

  const socialLoginCopy = {
    ja: { authGoogleNav: 'GOOGLE ログイン', authOptional: '任意ログイン', authTitle: 'Google で素早く始める', authCopy: 'Google アカウントの名前とメールアドレスを注文情報に入力します。ログインなしでも注文できます。', authGoogle: 'Google で続ける', authSignedIn: 'ログイン済み', authSignOut: 'ログアウト', authSignedOut: 'ログアウトしました。ゲストとして続けられます。', authUnavailable: 'Google ログインはまだ利用できません。ゲストとして続けてください。', authError: '処理を完了できませんでした。もう一度お試しください。' },
    zh: { authGoogleNav: 'GOOGLE 登录', authOptional: '可选登录', authTitle: '使用 Google 快速开始', authCopy: '我们会将您的 Google 姓名和邮箱预填至订单信息。您也可以不登录直接下单。', authGoogle: '使用 Google 继续', authSignedIn: '已登录', authSignOut: '退出登录', authSignedOut: '已退出登录，您可以继续以访客身份下单。', authUnavailable: 'Google 登录暂不可用，请以访客身份继续。', authError: '无法完成请求，请稍后重试。' },
    es: { authGoogleNav: 'INICIAR CON GOOGLE', authOptional: 'INICIO OPCIONAL', authTitle: 'Empieza más rápido con Google', authCopy: 'Completamos tu nombre y correo de Google en el pedido. También puedes pedir sin iniciar sesión.', authGoogle: 'Continuar con Google', authSignedIn: 'Sesión iniciada', authSignOut: 'Cerrar sesión', authSignedOut: 'Sesión cerrada. Puedes continuar como invitado.', authUnavailable: 'El acceso con Google aún no está disponible. Continúa como invitado.', authError: 'No se pudo completar la solicitud. Inténtalo de nuevo.' },
    fr: { authGoogleNav: 'CONNEXION GOOGLE', authOptional: 'CONNEXION FACULTATIVE', authTitle: 'Commencez plus vite avec Google', authCopy: 'Nous préremplissons votre nom et votre e-mail Google dans la commande. Vous pouvez aussi commander sans vous connecter.', authGoogle: 'Continuer avec Google', authSignedIn: 'Connecté', authSignOut: 'Se déconnecter', authSignedOut: 'Vous êtes déconnecté. Vous pouvez continuer en invité.', authUnavailable: 'La connexion Google n’est pas encore disponible. Continuez en invité.', authError: 'La demande n’a pas pu être finalisée. Réessayez.' },
    de: { authGoogleNav: 'GOOGLE-ANMELDUNG', authOptional: 'OPTIONALE ANMELDUNG', authTitle: 'Schneller mit Google starten', authCopy: 'Wir übernehmen Ihren Google-Namen und Ihre E-Mail in die Bestellung. Sie können auch ohne Anmeldung bestellen.', authGoogle: 'Mit Google fortfahren', authSignedIn: 'Angemeldet', authSignOut: 'Abmelden', authSignedOut: 'Abgemeldet. Sie können als Gast fortfahren.', authUnavailable: 'Google-Anmeldung ist noch nicht verfügbar. Bitte als Gast fortfahren.', authError: 'Die Anfrage konnte nicht abgeschlossen werden. Bitte erneut versuchen.' },
    pt: { authGoogleNav: 'ENTRAR COM GOOGLE', authOptional: 'LOGIN OPCIONAL', authTitle: 'Comece mais rápido com o Google', authCopy: 'Preenchemos seu nome e e-mail do Google no pedido. Você também pode pedir sem fazer login.', authGoogle: 'Continuar com Google', authSignedIn: 'Conectado', authSignOut: 'Sair', authSignedOut: 'Você saiu. Pode continuar como visitante.', authUnavailable: 'O login do Google ainda não está disponível. Continue como visitante.', authError: 'Não foi possível concluir a solicitação. Tente novamente.' },
    hi: { authGoogleNav: 'GOOGLE से लॉगिन', authOptional: 'वैकल्पिक लॉगिन', authTitle: 'Google से जल्दी शुरू करें', authCopy: 'हम आपके Google नाम और ईमेल को ऑर्डर में पहले से भरते हैं। आप बिना लॉगिन के भी ऑर्डर कर सकते हैं।', authGoogle: 'Google से जारी रखें', authSignedIn: 'लॉगिन है', authSignOut: 'लॉग आउट', authSignedOut: 'लॉग आउट हो गया। आप अतिथि के रूप में जारी रख सकते हैं।', authUnavailable: 'Google लॉगिन अभी उपलब्ध नहीं है। अतिथि के रूप में जारी रखें।', authError: 'अनुरोध पूरा नहीं हो सका। कृपया फिर कोशिश करें।' },
    ar: { authGoogleNav: 'تسجيل الدخول عبر GOOGLE', authOptional: 'تسجيل دخول اختياري', authTitle: 'ابدأ بسرعة عبر Google', authCopy: 'نملأ اسمك وبريدك الإلكتروني من Google في الطلب. يمكنك أيضًا الطلب من دون تسجيل الدخول.', authGoogle: 'المتابعة عبر Google', authSignedIn: 'تم تسجيل الدخول', authSignOut: 'تسجيل الخروج', authSignedOut: 'تم تسجيل الخروج. يمكنك المتابعة كضيف.', authUnavailable: 'تسجيل الدخول عبر Google غير متاح بعد. تابع كضيف.', authError: 'تعذر إكمال الطلب. حاول مرة أخرى.' }
  };

  Object.entries(socialLoginCopy).forEach(([language, copy]) => {
    Object.assign(window.AVVM_LOCALES[language], copy);
  });
})();

/* Order-direction controls added after the original locale packs. Dynamic recipe
   names deliberately remain in concise production English across locales. */
(function () {
  const recipes = {
    ja: {
      styleStepTitle: '2. 動画演出を選択', styleStepCopy: '制作分野を選び、ムードと動きで絞り込んでください。', styleDetailTitle: '詳細なムードを選択', styleDetailCopy: '選んだ分野に合う演出だけを表示します。', motionTitle: '動きの密度', motionCopy: 'カメラワークを一つ選ぶと、結果を安定させられます。', styleDirectionLabel: '選択した演出', promptLibraryKicker: 'AVVM 厳選レシピ', promptLibraryTitle: '作りたいシーンを検索', promptLibraryCopy: '制作基準に合った演出レシピを読み込み、詳細を追加できます。', promptSearchPlaceholder: '例：時計、ランウェイ、クラシック写真、旅行、ペット', promptLibraryNote: 'レシピは元画像の保持と自然な動きを優先します。結果は元画像と最終確認により異なります。', promptEditLabel: '演出リクエストを追加 <span>（任意）</span>', moodPlaceholder: '選択した演出に追加したいシーン、色、ムードを入力してください。', resolutionTitle: '最終納品解像度', resolutionIncluded: 'プランに含む', resolutionHelper: '解像度はプランに含まれ、元画像確認後に最終案内します。'
    },
    zh: {
      styleStepTitle: '2. 选择视频方向', styleStepCopy: '先选择制作领域，再用氛围和运动方式逐步细化。', styleDetailTitle: '选择细分氛围', styleDetailCopy: '仅显示与所选领域匹配的创意方向。', motionTitle: '动态强度', motionCopy: '只选择一种镜头运动，让结果更稳定。', styleDirectionLabel: '已选方向', promptLibraryKicker: 'AVVM 精选配方', promptLibraryTitle: '搜索想要的画面', promptLibraryCopy: '载入符合制作标准的创意配方，再补充自己的细节。', promptSearchPlaceholder: '例如：手表、秀场、经典照片、旅行、宠物', promptLibraryNote: '配方优先保留原图与自然运动。结果会因原图和最终审核而不同。', promptEditLabel: '添加创意要求 <span>（可选）</span>', moodPlaceholder: '请输入想加入所选方向的画面、色彩或氛围。', resolutionTitle: '最终交付分辨率', resolutionIncluded: '方案已含', resolutionHelper: '分辨率已随方案锁定，并会在原图审核后最终确认。'
    },
    es: {
      styleStepTitle: '2. Elige la dirección del vídeo', styleStepCopy: 'Elige primero el sector y luego afina por ambiente y movimiento.', styleDetailTitle: 'Elige un ambiente detallado', styleDetailCopy: 'Solo mostramos direcciones que encajan con el sector elegido.', motionTitle: 'Intensidad de movimiento', motionCopy: 'Elige un solo movimiento de cámara para un resultado más estable.', styleDirectionLabel: 'DIRECCIÓN ELEGIDA', promptLibraryKicker: 'RECETAS CURADAS AVVM', promptLibraryTitle: 'Busca la escena que quieres', promptLibraryCopy: 'Carga una receta de dirección lista para producción y añade tus detalles.', promptSearchPlaceholder: 'p. ej., reloj, pasarela, foto clásica, viaje, mascota', promptLibraryNote: 'Las recetas priorizan conservar la fuente y lograr un movimiento natural. El resultado depende de la foto y de la revisión final.', promptEditLabel: 'Añade una petición de dirección <span>(opcional)</span>', moodPlaceholder: 'Añade la escena, el color o el ambiente que quieres sumar a la dirección elegida.', resolutionTitle: 'Calidad final de entrega', resolutionIncluded: 'INCLUIDO EN EL PLAN', resolutionHelper: 'La calidad de entrega está fijada por tu plan y se confirma tras revisar la foto original.'
    },
    fr: {
      styleStepTitle: '2. Choisissez la direction vidéo', styleStepCopy: 'Choisissez d’abord le domaine, puis précisez l’ambiance et le mouvement.', styleDetailTitle: 'Choisissez une ambiance précise', styleDetailCopy: 'Seules les directions adaptées au domaine choisi sont affichées.', motionTitle: 'Intensité du mouvement', motionCopy: 'Choisissez un seul mouvement de caméra pour un résultat plus stable.', styleDirectionLabel: 'DIRECTION SÉLECTIONNÉE', promptLibraryKicker: 'RECETTES AVVM SÉLECTIONNÉES', promptLibraryTitle: 'Recherchez la scène souhaitée', promptLibraryCopy: 'Chargez une recette de direction prête à produire, puis ajoutez vos détails.', promptSearchPlaceholder: 'ex. montre, défilé, photo classique, voyage, animal', promptLibraryNote: 'Les recettes privilégient la préservation de l’image source et un mouvement naturel. Le résultat dépend de la photo et de la validation finale.', promptEditLabel: 'Ajoutez une demande de direction <span>(facultatif)</span>', moodPlaceholder: 'Ajoutez la scène, la couleur ou l’ambiance à superposer à la direction choisie.', resolutionTitle: 'Qualité de livraison finale', resolutionIncluded: 'INCLUS DANS LE PLAN', resolutionHelper: 'La qualité de livraison est fixée par votre plan et confirmée après examen de la photo source.'
    },
    de: {
      styleStepTitle: '2. Videorichtung wählen', styleStepCopy: 'Wählen Sie zuerst den Produktionsbereich und verfeinern Sie dann Stimmung und Bewegung.', styleDetailTitle: 'Detaillierte Stimmung wählen', styleDetailCopy: 'Es werden nur passende Richtungen für den gewählten Bereich angezeigt.', motionTitle: 'Bewegungsintensität', motionCopy: 'Wählen Sie eine Kamerabewegung für ein stabiles Ergebnis.', styleDirectionLabel: 'AUSGEWÄHLTE RICHTUNG', promptLibraryKicker: 'AVVM KURATIERTE REZEPTE', promptLibraryTitle: 'Gewünschte Szene suchen', promptLibraryCopy: 'Laden Sie ein produktionsreifes Regie-Rezept und ergänzen Sie Ihre Details.', promptSearchPlaceholder: 'z. B. Uhr, Laufsteg, klassisches Foto, Reise, Haustier', promptLibraryNote: 'Die Rezepte priorisieren Quelltreue und natürliche Bewegung. Das Ergebnis hängt vom Foto und der Endprüfung ab.', promptEditLabel: 'Regiewunsch ergänzen <span>(optional)</span>', moodPlaceholder: 'Fügen Sie Szene, Farbe oder Stimmung hinzu, die Sie der gewählten Richtung hinzufügen möchten.', resolutionTitle: 'Endgültige Lieferqualität', resolutionIncluded: 'IM PLAN ENTHALTEN', resolutionHelper: 'Die Lieferqualität ist in Ihrem Plan festgelegt und wird nach Prüfung des Quellfotos bestätigt.'
    },
    pt: {
      styleStepTitle: '2. Escolha a direção do vídeo', styleStepCopy: 'Primeiro escolha a área de produção e depois refine por clima e movimento.', styleDetailTitle: 'Escolha um clima detalhado', styleDetailCopy: 'Mostramos apenas direções adequadas à área selecionada.', motionTitle: 'Intensidade do movimento', motionCopy: 'Escolha um único movimento de câmera para manter o resultado estável.', styleDirectionLabel: 'DIREÇÃO SELECIONADA', promptLibraryKicker: 'RECEITAS CURADAS AVVM', promptLibraryTitle: 'Pesquise a cena desejada', promptLibraryCopy: 'Carregue uma receita de direção pronta para produção e inclua seus detalhes.', promptSearchPlaceholder: 'ex.: relógio, passarela, foto clássica, viagem, pet', promptLibraryNote: 'As receitas priorizam a preservação da imagem e o movimento natural. O resultado varia conforme a foto e a revisão final.', promptEditLabel: 'Adicione um pedido de direção <span>(opcional)</span>', moodPlaceholder: 'Adicione a cena, cor ou clima que deseja aplicar à direção selecionada.', resolutionTitle: 'Qualidade final de entrega', resolutionIncluded: 'INCLUSO NO PLANO', resolutionHelper: 'A qualidade de entrega é definida pelo seu plano e confirmada após a análise da foto de origem.'
    },
    hi: {
      styleStepTitle: '2. वीडियो दिशा चुनें', styleStepCopy: 'पहले निर्माण क्षेत्र चुनें, फिर मूड और मूवमेंट के अनुसार विकल्प सीमित करें।', styleDetailTitle: 'विस्तृत मूड चुनें', styleDetailCopy: 'चुने गए क्षेत्र के अनुकूल दिशा ही दिखाई जाती है।', motionTitle: 'मूवमेंट की तीव्रता', motionCopy: 'स्थिर परिणाम के लिए एक कैमरा मूवमेंट चुनें।', styleDirectionLabel: 'चुनी गई दिशा', promptLibraryKicker: 'AVVM क्यूरेटेड रेसिपी', promptLibraryTitle: 'अपना दृश्य खोजें', promptLibraryCopy: 'निर्माण-तैयार दिशा रेसिपी लोड करें, फिर अपने विवरण जोड़ें।', promptSearchPlaceholder: 'जैसे: घड़ी, रनवे, क्लासिक फोटो, यात्रा, पालतू', promptLibraryNote: 'रेसिपी स्रोत-संरक्षण और प्राकृतिक गति को प्राथमिकता देती हैं। परिणाम फोटो और अंतिम समीक्षा पर निर्भर हैं।', promptEditLabel: 'दिशा अनुरोध जोड़ें <span>(वैकल्पिक)</span>', moodPlaceholder: 'चुनी गई दिशा में जोड़ने के लिए दृश्य, रंग या मूड लिखें।', resolutionTitle: 'अंतिम डिलीवरी गुणवत्ता', resolutionIncluded: 'प्लान में शामिल', resolutionHelper: 'डिलीवरी गुणवत्ता आपके प्लान में निश्चित है और स्रोत फोटो की समीक्षा के बाद पुष्टि होती है।'
    },
    ar: {
      styleStepTitle: '2. اختر اتجاه الفيديو', styleStepCopy: 'اختر مجال الإنتاج أولاً، ثم حدّد النتيجة بالمزاج والحركة.', styleDetailTitle: 'اختر مزاجاً تفصيلياً', styleDetailCopy: 'نعرض فقط الاتجاهات المناسبة للمجال الذي اخترته.', motionTitle: 'كثافة الحركة', motionCopy: 'اختر حركة كاميرا واحدة للحفاظ على نتيجة مستقرة.', styleDirectionLabel: 'الاتجاه المختار', promptLibraryKicker: 'وصفات AVVM المختارة', promptLibraryTitle: 'ابحث عن المشهد الذي تريده', promptLibraryCopy: 'حمّل وصفة إخراج جاهزة للإنتاج ثم أضف تفاصيلك الخاصة.', promptSearchPlaceholder: 'مثال: ساعة، منصة عرض، صورة كلاسيكية، سفر، حيوان أليف', promptLibraryNote: 'تعطي الوصفات أولوية للحفاظ على الصورة الأصلية والحركة الطبيعية. تعتمد النتيجة على الصورة والمراجعة النهائية.', promptEditLabel: 'أضف طلب إخراج <span>(اختياري)</span>', moodPlaceholder: 'أضف المشهد أو اللون أو المزاج الذي تريد تطبيقه على الاتجاه المختار.', resolutionTitle: 'جودة التسليم النهائية', resolutionIncluded: 'مضمن في الخطة', resolutionHelper: 'جودة التسليم محددة في خطتك وتؤكَّد بعد مراجعة الصورة الأصلية.'
    }
  };

  Object.entries(recipes).forEach(([language, copy]) => {
    if (window.AVVM_LOCALES && window.AVVM_LOCALES[language]) Object.assign(window.AVVM_LOCALES[language], copy);
  });

  const experienceCopy = {
    ja: {
      heroSub: '写真を一枚アップロードすると、AVVMが演出・品質確認を行い、完成作品をお届けします。', heroSystemKicker: 'AVVM 制作システム', heroSignalLive: '人の演出 · AIの推進',
      heroSignalStep1: '写真をアップロード', heroSignalStep1Meta: '素材チェック', heroSignalStep2: '演出を選択', heroSignalStep2Meta: '厳選ディレクション', heroSignalStep3: '確認して納品', heroSignalStep3Meta: 'AVVM 品質確認',
      proofAssuranceKicker: '実際の入力 · 実際の納品', proofAssuranceTitle: '元画像、結果、その裏にある基準まで確認してください。', proofAssuranceCopy: 'AVVMはボタンだけで終わる自動生成画面ではありません。元画像を確認し、目的に合う演出を定め、納品前にもう一度結果を確認します。',
      proofStandardInput: '実際の入力', proofStandardInputMeta: '元写真をベースに制作', proofStandardDirection: 'アートディレクション', proofStandardDirectionMeta: '業種別の演出レシピ', proofStandardReview: '品質確認', proofStandardReviewMeta: '人物・商品・文字を確認', proofStandardDelivery: '最終納品', proofStandardDeliveryMeta: 'プラン別の規格を適用',
      proofSpecInput: '入力', proofSpecInputValue: '写真 1枚', proofSpecOutput: 'サンプル出力', proofSpecOutputValue: 'シネマティックな結果', proofSpecReview: '最終確認', proofSpecReviewValue: 'AVVM 確認済み'
    },
    zh: {
      heroSub: '上传一张照片，AVVM 将负责创意指导、质量审核并交付成片。', heroSystemKicker: 'AVVM 制作系统', heroSignalLive: '人工主导 · AI 驱动',
      heroSignalStep1: '上传照片', heroSignalStep1Meta: '素材检查', heroSignalStep2: '选择创意方向', heroSignalStep2Meta: '精选创意指导', heroSignalStep3: '审核后交付', heroSignalStep3Meta: 'AVVM 质量审核',
      proofAssuranceKicker: '真实输入 · 真实交付', proofAssuranceTitle: '先看原图，再看结果，也看见背后的标准。', proofAssuranceCopy: 'AVVM 不是只需点击按钮的自动生成页面。我们评估原始素材，确定适合用途的创意方向，并在交付前再次检查结果。',
      proofStandardInput: '真实输入', proofStandardInputMeta: '基于原始照片', proofStandardDirection: '创意指导', proofStandardDirectionMeta: '行业创意方案', proofStandardReview: '质量审核', proofStandardReviewMeta: '检查人物、产品与文字', proofStandardDelivery: '最终交付', proofStandardDeliveryMeta: '应用方案交付规格',
      proofSpecInput: '输入', proofSpecInputValue: '1 张图片', proofSpecOutput: '样片输出', proofSpecOutputValue: '电影感结果', proofSpecReview: '最终检查', proofSpecReviewValue: 'AVVM 已审核'
    },
    es: {
      heroSub: 'Sube una foto. AVVM dirige, revisa la calidad y entrega la pieza final.', heroSystemKicker: 'SISTEMA DE PRODUCCIÓN AVVM', heroSignalLive: 'DIRECCIÓN HUMANA · IMPULSO IA',
      heroSignalStep1: 'SUBIR FOTO', heroSignalStep1Meta: 'REVISIÓN DE FUENTE', heroSignalStep2: 'ELEGIR DIRECCIÓN', heroSignalStep2Meta: 'DIRECCIÓN CURADA', heroSignalStep3: 'REVISAR Y ENTREGAR', heroSignalStep3Meta: 'REVISIÓN DE CALIDAD AVVM',
      proofAssuranceKicker: 'ENTRADA REAL · ENTREGA REAL', proofAssuranceTitle: 'Ve primero la fuente. Ve el resultado. Ve el estándar que hay detrás.', proofAssuranceCopy: 'AVVM no es una pantalla de generación de un solo botón. Evaluamos la fuente, definimos una dirección para su propósito y revisamos el resultado otra vez antes de entregarlo.',
      proofStandardInput: 'ENTRADA REAL', proofStandardInputMeta: 'Basado en foto fuente', proofStandardDirection: 'DIRECCIÓN DE ARTE', proofStandardDirectionMeta: 'Direcciones por sector', proofStandardReview: 'REVISIÓN DE CALIDAD', proofStandardReviewMeta: 'Rostro · producto · texto', proofStandardDelivery: 'ENTREGA FINAL', proofStandardDeliveryMeta: 'Especificación según plan',
      proofSpecInput: 'ENTRADA', proofSpecInputValue: '1 IMAGEN', proofSpecOutput: 'SALIDA DE MUESTRA', proofSpecOutputValue: 'RESULTADO CINEMÁTICO', proofSpecReview: 'REVISIÓN FINAL', proofSpecReviewValue: 'REVISADO POR AVVM'
    },
    fr: {
      heroSub: 'Ajoutez une photo. AVVM dirige, vérifie la qualité et livre le film final.', heroSystemKicker: 'SYSTÈME DE PRODUCTION AVVM', heroSignalLive: 'DIRECTION HUMAINE · IA AU SERVICE',
      heroSignalStep1: 'AJOUTER LA PHOTO', heroSignalStep1Meta: 'VÉRIFICATION SOURCE', heroSignalStep2: 'CHOISIR LA DIRECTION', heroSignalStep2Meta: 'DIRECTION SÉLECTIONNÉE', heroSignalStep3: 'VÉRIFIER ET LIVRER', heroSignalStep3Meta: 'CONTRÔLE QUALITÉ AVVM',
      proofAssuranceKicker: 'SOURCE RÉELLE · LIVRAISON RÉELLE', proofAssuranceTitle: 'Voyez la source, le résultat, puis le niveau d’exigence qui les relie.', proofAssuranceCopy: 'AVVM n’est pas un écran de génération à un clic. Nous évaluons la source, définissons une direction adaptée à son objectif, puis vérifions le résultat une dernière fois avant livraison.',
      proofStandardInput: 'SOURCE RÉELLE', proofStandardInputMeta: 'Fondé sur la photo source', proofStandardDirection: 'DIRECTION ARTISTIQUE', proofStandardDirectionMeta: 'Directions par secteur', proofStandardReview: 'CONTRÔLE QUALITÉ', proofStandardReviewMeta: 'Visage · produit · texte', proofStandardDelivery: 'LIVRAISON FINALE', proofStandardDeliveryMeta: 'Spécifications selon le plan',
      proofSpecInput: 'ENTRÉE', proofSpecInputValue: '1 IMAGE', proofSpecOutput: 'SORTIE EXEMPLE', proofSpecOutputValue: 'RÉSULTAT CINÉMATIQUE', proofSpecReview: 'VÉRIFICATION FINALE', proofSpecReviewValue: 'VÉRIFIÉ PAR AVVM'
    },
    de: {
      heroSub: 'Laden Sie ein Foto hoch. AVVM führt Regie, prüft die Qualität und liefert den fertigen Film.', heroSystemKicker: 'AVVM PRODUKTIONSSYSTEM', heroSignalLive: 'MENSCHLICHE REGIE · KI-ANTRIEB',
      heroSignalStep1: 'FOTO HOCHLADEN', heroSignalStep1Meta: 'QUELLENPRÜFUNG', heroSignalStep2: 'RICHTUNG WÄHLEN', heroSignalStep2Meta: 'KURATIERTE REGIE', heroSignalStep3: 'PRÜFEN & LIEFERN', heroSignalStep3Meta: 'AVVM QUALITÄTSPRÜFUNG',
      proofAssuranceKicker: 'ECHTE QUELLE · ECHTE LIEFERUNG', proofAssuranceTitle: 'Sehen Sie zuerst die Quelle, dann das Ergebnis und den Maßstab dahinter.', proofAssuranceCopy: 'AVVM ist keine Ein-Klick-Generierungsseite. Wir prüfen das Ausgangsmaterial, definieren die passende Regie und kontrollieren das Ergebnis vor der Lieferung erneut.',
      proofStandardInput: 'ECHTE QUELLE', proofStandardInputMeta: 'Auf Basis des Originalfotos', proofStandardDirection: 'ART DIRECTION', proofStandardDirectionMeta: 'Branchenfertige Regie', proofStandardReview: 'QUALITÄTSPRÜFUNG', proofStandardReviewMeta: 'Gesicht · Produkt · Text', proofStandardDelivery: 'FINALE LIEFERUNG', proofStandardDeliveryMeta: 'Spezifikation je Plan',
      proofSpecInput: 'EINGABE', proofSpecInputValue: '1 BILD', proofSpecOutput: 'BEISPIELAUSGABE', proofSpecOutputValue: 'FILMISCHES ERGEBNIS', proofSpecReview: 'ENDPRÜFUNG', proofSpecReviewValue: 'VON AVVM GEPRÜFT'
    },
    pt: {
      heroSub: 'Envie uma foto. A AVVM dirige, revisa a qualidade e entrega o filme final.', heroSystemKicker: 'SISTEMA DE PRODUÇÃO AVVM', heroSignalLive: 'DIREÇÃO HUMANA · IA POTENCIALIZADA',
      heroSignalStep1: 'ENVIAR FOTO', heroSignalStep1Meta: 'CHECAGEM DA FONTE', heroSignalStep2: 'ESCOLHER DIREÇÃO', heroSignalStep2Meta: 'DIREÇÃO CURADA', heroSignalStep3: 'REVISAR E ENTREGAR', heroSignalStep3Meta: 'REVISÃO DE QUALIDADE AVVM',
      proofAssuranceKicker: 'ENTRADA REAL · ENTREGA REAL', proofAssuranceTitle: 'Veja primeiro a fonte, o resultado e o padrão por trás dele.', proofAssuranceCopy: 'A AVVM não é uma tela de geração com um botão. Avaliamos a fonte, definimos uma direção para o objetivo e revisamos o resultado outra vez antes da entrega.',
      proofStandardInput: 'ENTRADA REAL', proofStandardInputMeta: 'Baseado na foto de origem', proofStandardDirection: 'DIREÇÃO DE ARTE', proofStandardDirectionMeta: 'Direções por setor', proofStandardReview: 'REVISÃO DE QUALIDADE', proofStandardReviewMeta: 'Rosto · produto · texto', proofStandardDelivery: 'ENTREGA FINAL', proofStandardDeliveryMeta: 'Especificação por plano',
      proofSpecInput: 'ENTRADA', proofSpecInputValue: '1 IMAGEM', proofSpecOutput: 'SAÍDA DE AMOSTRA', proofSpecOutputValue: 'RESULTADO CINEMATOGRÁFICO', proofSpecReview: 'CHECAGEM FINAL', proofSpecReviewValue: 'REVISADO PELA AVVM'
    },
    hi: {
      heroSub: 'एक फोटो अपलोड करें। AVVM निर्देशन, गुणवत्ता जाँच और तैयार फिल्म की डिलीवरी करता है।', heroSystemKicker: 'AVVM प्रोडक्शन सिस्टम', heroSignalLive: 'मानवीय निर्देशन · AI की शक्ति',
      heroSignalStep1: 'फोटो अपलोड करें', heroSignalStep1Meta: 'स्रोत जाँच', heroSignalStep2: 'दिशा चुनें', heroSignalStep2Meta: 'चुना हुआ निर्देशन', heroSignalStep3: 'जाँचें और डिलीवर करें', heroSignalStep3Meta: 'AVVM गुणवत्ता जाँच',
      proofAssuranceKicker: 'वास्तविक इनपुट · वास्तविक डिलीवरी', proofAssuranceTitle: 'पहले स्रोत देखें, फिर परिणाम और उसके पीछे का मानक।', proofAssuranceCopy: 'AVVM केवल एक बटन वाला जनरेशन स्क्रीन नहीं है। हम स्रोत का आकलन करते हैं, उद्देश्य के अनुकूल निर्देशन तय करते हैं और डिलीवरी से पहले परिणाम को फिर से जाँचते हैं।',
      proofStandardInput: 'वास्तविक इनपुट', proofStandardInputMeta: 'मूल फोटो पर आधारित', proofStandardDirection: 'आर्ट डायरेक्शन', proofStandardDirectionMeta: 'क्षेत्र-विशिष्ट निर्देशन', proofStandardReview: 'गुणवत्ता जाँच', proofStandardReviewMeta: 'चेहरा · उत्पाद · टेक्स्ट जाँच', proofStandardDelivery: 'अंतिम डिलीवरी', proofStandardDeliveryMeta: 'प्लान-विशिष्ट विनिर्देश',
      proofSpecInput: 'इनपुट', proofSpecInputValue: '1 छवि', proofSpecOutput: 'नमूना आउटपुट', proofSpecOutputValue: 'सिनेमाई परिणाम', proofSpecReview: 'अंतिम जाँच', proofSpecReviewValue: 'AVVM द्वारा जाँचा गया'
    },
    ar: {
      heroSub: 'ارفع صورة واحدة. تتولى AVVM الإخراج وفحص الجودة وتسليم الفيلم النهائي.', heroSystemKicker: 'نظام إنتاج AVVM', heroSignalLive: 'إخراج بشري · قوة الذكاء الاصطناعي',
      heroSignalStep1: 'ارفع الصورة', heroSignalStep1Meta: 'فحص المصدر', heroSignalStep2: 'اختر الاتجاه', heroSignalStep2Meta: 'إخراج منتقى', heroSignalStep3: 'راجع وسلّم', heroSignalStep3Meta: 'فحص جودة AVVM',
      proofAssuranceKicker: 'إدخال حقيقي · تسليم حقيقي', proofAssuranceTitle: 'شاهد المصدر أولاً، ثم النتيجة، ثم المعيار الذي يقف خلفها.', proofAssuranceCopy: 'AVVM ليست شاشة توليد بضغطة واحدة فقط. نقيّم المصدر ونحدد اتجاهاً يناسب غايته ونراجع النتيجة مرة أخرى قبل التسليم.',
      proofStandardInput: 'إدخال حقيقي', proofStandardInputMeta: 'مبني على الصورة الأصلية', proofStandardDirection: 'إخراج فني', proofStandardDirectionMeta: 'اتجاهات جاهزة للقطاع', proofStandardReview: 'فحص الجودة', proofStandardReviewMeta: 'فحص الوجه والمنتج والنص', proofStandardDelivery: 'التسليم النهائي', proofStandardDeliveryMeta: 'مواصفات بحسب الخطة',
      proofSpecInput: 'الإدخال', proofSpecInputValue: 'صورة واحدة', proofSpecOutput: 'مخرج نموذجي', proofSpecOutputValue: 'نتيجة سينمائية', proofSpecReview: 'الفحص النهائي', proofSpecReviewValue: 'مُراجع من AVVM'
    }
  };
  Object.entries(experienceCopy).forEach(([language, copy]) => {
    if (window.AVVM_LOCALES && window.AVVM_LOCALES[language]) Object.assign(window.AVVM_LOCALES[language], copy);
  });

  /* The universal entry point is part of the product promise, so it must not
     fall back to English when a customer changes language. */
  const universalInputCopy = {
    ja: {
      heroSub: '写真一枚、短い文章、小さなアイデアから始めましょう。AVVMが演出・品質確認し、完成版をお届けします。',
      inputMethodKicker: '入力方法を選ぶ', inputMethodTitle: '写真・入力・音声から、使いやすい方法で始めましょう。', inputMethodCopy: '写真は結果の基準となり、文章と音声は希望を明確な制作依頼にします。',
      inputMethodPhoto: '写真を添付', inputMethodPhotoCopy: '素材・商品・スケッチ', inputMethodTyping: '入力する', inputMethodTypingCopy: '希望のシーンを記入', inputMethodVoice: '話して伝える', inputMethodVoiceCopy: '話した内容を依頼へ',
      inputMethodNotePhoto: '元写真を添付すると、最も安定した制作方向を決められます。', inputMethodNoteTyping: '希望するシーン・変化・ムードを入力してください。参考写真はいつでも追加できます。', inputMethodNoteVoice: '聞き取り中です。話した内容が制作依頼欄に入力されます。', inputMethodVoiceUnavailable: 'このブラウザでは音声入力を利用できません。内容を入力してください。', inputMethodVoiceComplete: '音声の依頼内容を入力しました。必要に応じて整え、写真を追加してください。', inputMethodVoiceRetry: '音声を聞き取れませんでした。もう一度話すか、直接入力してください。'
    },
    zh: {
      heroSub: '从一张照片、一句文字或一个小想法开始。AVVM 负责创意指导、质量审核并交付成片。',
      inputMethodKicker: '选择输入方式', inputMethodTitle: '用照片、文字或语音开始。', inputMethodCopy: '照片决定结果基准；文字与语音会把您的想法变成清晰的制作需求。',
      inputMethodPhoto: '上传照片', inputMethodPhotoCopy: '原图 · 商品 · 草图', inputMethodTyping: '文字输入', inputMethodTypingCopy: '写下想要的画面', inputMethodVoice: '语音描述', inputMethodVoiceCopy: '说出您的需求',
      inputMethodNotePhoto: '先上传原图，可以获得最稳定的制作方向。', inputMethodNoteTyping: '请输入您想要的画面、变化或氛围。随时都可以添加参考图片。', inputMethodNoteVoice: '正在聆听。语音内容将写入制作需求栏。', inputMethodVoiceUnavailable: '此浏览器不支持语音输入，请直接输入需求。', inputMethodVoiceComplete: '已录入您的语音需求。您可继续调整或添加照片。', inputMethodVoiceRetry: '未能听清您的需求。请再说一次，或直接输入。'
    },
    es: {
      heroSub: 'Empieza con una foto, una frase breve o una pequeña idea. AVVM dirige, revisa la calidad y entrega la pieza final.',
      inputMethodKicker: 'ELIGE TU ENTRADA', inputMethodTitle: 'Empieza con una foto, texto o voz.', inputMethodCopy: 'La foto fija la referencia; el texto y la voz convierten tu intención en una solicitud de producción clara.',
      inputMethodPhoto: 'AÑADIR FOTO', inputMethodPhotoCopy: 'Fuente · producto · boceto', inputMethodTyping: 'ESCRIBIR', inputMethodTypingCopy: 'Describe la escena', inputMethodVoice: 'DECIRLO', inputMethodVoiceCopy: 'Habla de tu idea',
      inputMethodNotePhoto: 'Una foto de referencia da a AVVM la dirección de producción más estable.', inputMethodNoteTyping: 'Escribe la escena, el cambio o el ambiente que deseas. Puedes añadir una foto de referencia cuando quieras.', inputMethodNoteVoice: 'Escuchando. Tus palabras se añadirán al campo de solicitud de producción.', inputMethodVoiceUnavailable: 'La entrada por voz no está disponible en este navegador. Escribe tu solicitud.', inputMethodVoiceComplete: 'Tu solicitud por voz se ha añadido. Ajusta el texto o añade una foto cuando quieras.', inputMethodVoiceRetry: 'No hemos podido oír tu solicitud. Inténtalo de nuevo o escríbela.'
    },
    fr: {
      heroSub: 'Commencez par une photo, une courte phrase ou une petite idée. AVVM assure la direction, le contrôle qualité et la livraison finale.',
      inputMethodKicker: 'CHOISISSEZ VOTRE ENTRÉE', inputMethodTitle: 'Commencez avec une photo, du texte ou votre voix.', inputMethodCopy: 'La photo sert de référence ; le texte et la voix transforment votre intention en demande de production précise.',
      inputMethodPhoto: 'AJOUTER UNE PHOTO', inputMethodPhotoCopy: 'Source · produit · croquis', inputMethodTyping: 'ÉCRIRE', inputMethodTypingCopy: 'Décrivez la scène', inputMethodVoice: 'LE DIRE', inputMethodVoiceCopy: 'Exprimez votre demande',
      inputMethodNotePhoto: 'Une photo source donne à AVVM la direction de production la plus stable.', inputMethodNoteTyping: 'Écrivez la scène, la transformation ou l’ambiance souhaitée. Vous pouvez ajouter une photo de référence à tout moment.', inputMethodNoteVoice: 'Écoute en cours. Vos mots seront ajoutés au champ de demande de production.', inputMethodVoiceUnavailable: 'La saisie vocale n’est pas disponible dans ce navigateur. Veuillez écrire votre demande.', inputMethodVoiceComplete: 'Votre demande vocale a été ajoutée. Ajustez-la ou ajoutez une photo à tout moment.', inputMethodVoiceRetry: 'Nous n’avons pas entendu votre demande. Réessayez ou écrivez-la.'
    },
    de: {
      heroSub: 'Starten Sie mit einem Foto, einem kurzen Satz oder einer kleinen Idee. AVVM führt Regie, prüft die Qualität und liefert das fertige Ergebnis.',
      inputMethodKicker: 'EINGABE WÄHLEN', inputMethodTitle: 'Starten Sie mit Foto, Text oder Stimme.', inputMethodCopy: 'Das Foto gibt die Referenz vor; Text und Stimme machen aus Ihrer Idee einen klaren Produktionsauftrag.',
      inputMethodPhoto: 'FOTO HINZUFÜGEN', inputMethodPhotoCopy: 'Quelle · Produkt · Skizze', inputMethodTyping: 'EINTIPPEN', inputMethodTypingCopy: 'Szene beschreiben', inputMethodVoice: 'SPRECHEN', inputMethodVoiceCopy: 'Wunsch laut sagen',
      inputMethodNotePhoto: 'Ein Quellfoto gibt AVVM die stabilste Produktionsrichtung.', inputMethodNoteTyping: 'Beschreiben Sie die gewünschte Szene, Veränderung oder Stimmung. Sie können jederzeit ein Referenzfoto ergänzen.', inputMethodNoteVoice: 'Wir hören zu. Ihre Worte werden in das Produktionsfeld übernommen.', inputMethodVoiceUnavailable: 'Spracheingabe wird in diesem Browser nicht unterstützt. Bitte schreiben Sie Ihre Anfrage.', inputMethodVoiceComplete: 'Ihre Sprachanfrage wurde übernommen. Verfeinern Sie sie oder fügen Sie jederzeit ein Foto hinzu.', inputMethodVoiceRetry: 'Wir konnten Ihre Anfrage nicht hören. Sprechen Sie erneut oder schreiben Sie sie ein.'
    },
    pt: {
      heroSub: 'Comece com uma foto, uma frase curta ou uma pequena ideia. A AVVM dirige, revisa a qualidade e entrega o resultado final.',
      inputMethodKicker: 'ESCOLHA SUA ENTRADA', inputMethodTitle: 'Comece com uma foto, texto ou voz.', inputMethodCopy: 'A foto define a referência; texto e voz transformam sua intenção em um pedido de produção claro.',
      inputMethodPhoto: 'ADICIONAR FOTO', inputMethodPhotoCopy: 'Origem · produto · esboço', inputMethodTyping: 'DIGITAR', inputMethodTypingCopy: 'Descreva a cena', inputMethodVoice: 'FALAR', inputMethodVoiceCopy: 'Diga o que deseja',
      inputMethodNotePhoto: 'Uma foto de origem dá à AVVM a direção de produção mais estável.', inputMethodNoteTyping: 'Escreva a cena, a mudança ou o clima desejado. Você pode adicionar uma foto de referência a qualquer momento.', inputMethodNoteVoice: 'Ouvindo agora. Suas palavras serão adicionadas ao campo de pedido de produção.', inputMethodVoiceUnavailable: 'A entrada por voz não é suportada neste navegador. Digite sua solicitação.', inputMethodVoiceComplete: 'Sua solicitação por voz foi adicionada. Ajuste-a ou inclua uma foto quando quiser.', inputMethodVoiceRetry: 'Não conseguimos ouvir sua solicitação. Tente falar novamente ou digite.'
    },
    hi: {
      heroSub: 'एक फोटो, छोटा वाक्य या छोटा-सा विचार लेकर शुरुआत करें। AVVM निर्देशन, गुणवत्ता जाँच और तैयार परिणाम की डिलीवरी करता है।',
      inputMethodKicker: 'इनपुट चुनें', inputMethodTitle: 'फोटो, टाइपिंग या आवाज़ से शुरुआत करें।', inputMethodCopy: 'फोटो परिणाम का आधार बनती है; टेक्स्ट और आवाज़ आपके विचार को स्पष्ट निर्माण अनुरोध में बदलते हैं।',
      inputMethodPhoto: 'फोटो जोड़ें', inputMethodPhotoCopy: 'स्रोत · उत्पाद · स्केच', inputMethodTyping: 'टाइप करें', inputMethodTypingCopy: 'मनचाहा दृश्य लिखें', inputMethodVoice: 'बोलकर बताएँ', inputMethodVoiceCopy: 'अपना अनुरोध बोलें',
      inputMethodNotePhoto: 'स्रोत फोटो AVVM को सबसे स्थिर निर्माण दिशा देती है।', inputMethodNoteTyping: 'अपना मनचाहा दृश्य, बदलाव या मूड लिखें। आप कभी भी संदर्भ फोटो जोड़ सकते हैं।', inputMethodNoteVoice: 'सुन रहे हैं। आपके शब्द निर्माण अनुरोध क्षेत्र में जोड़े जाएंगे।', inputMethodVoiceUnavailable: 'इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया अपना अनुरोध टाइप करें।', inputMethodVoiceComplete: 'आपका वॉइस अनुरोध जोड़ दिया गया है। उसे सुधारें या कभी भी फोटो जोड़ें।', inputMethodVoiceRetry: 'हम आपका अनुरोध नहीं सुन सके। फिर से बोलें या टाइप करें।'
    },
    ar: {
      heroSub: 'ابدأ بصورة أو جملة قصيرة أو فكرة صغيرة. تتولى AVVM الإخراج وفحص الجودة وتسليم النتيجة النهائية.',
      inputMethodKicker: 'اختر طريقة الإدخال', inputMethodTitle: 'ابدأ بصورة أو كتابة أو صوت.', inputMethodCopy: 'تحدد الصورة المرجع؛ وتحول الكتابة والصوت فكرتك إلى طلب إنتاج واضح.',
      inputMethodPhoto: 'أضف صورة', inputMethodPhotoCopy: 'مصدر · منتج · رسم', inputMethodTyping: 'اكتبها', inputMethodTypingCopy: 'صف المشهد المطلوب', inputMethodVoice: 'قلها', inputMethodVoiceCopy: 'تحدث بطلبك',
      inputMethodNotePhoto: 'تمنح الصورة المصدر AVVM أكثر اتجاه إنتاج استقراراً.', inputMethodNoteTyping: 'اكتب المشهد أو التغيير أو الأجواء التي تريدها. يمكنك إضافة صورة مرجعية في أي وقت.', inputMethodNoteVoice: 'نستمع الآن. ستضاف كلماتك إلى حقل طلب الإنتاج.', inputMethodVoiceUnavailable: 'الإدخال الصوتي غير مدعوم في هذا المتصفح. يرجى كتابة طلبك.', inputMethodVoiceComplete: 'تمت إضافة طلبك الصوتي. يمكنك تنقيحه أو إضافة صورة في أي وقت.', inputMethodVoiceRetry: 'لم نتمكن من سماع طلبك. تحدث مرة أخرى أو اكتبه.'
    }
  };
  Object.entries(universalInputCopy).forEach(([language, copy]) => {
    if (window.AVVM_LOCALES && window.AVVM_LOCALES[language]) Object.assign(window.AVVM_LOCALES[language], copy);
  });

  /* Keep the live speech-result surface translated in every storefront language. */
  const voiceTranscriptCopy = {
    ja: { inputMethodVoiceTranscript: '音声認識', inputMethodVoicePreparing: '音声での依頼を開始できます。', inputMethodVoiceListening: '話した内容を聞き取っています。', inputMethodVoiceTranscriptPlaceholder: '話した内容がここにリアルタイムで表示されます。', inputMethodVoiceRecognized: '認識された依頼内容', inputMethodVoiceAdded: '制作依頼欄に反映しました。', inputMethodVoiceSync: '同じ内容が下の制作依頼欄にも自動入力されます。', inputMethodVoiceEdit: '制作依頼を編集 ↓' },
    zh: { inputMethodVoiceTranscript: '语音识别', inputMethodVoicePreparing: '已准备好开始语音需求。', inputMethodVoiceListening: '正在聆听您的需求。', inputMethodVoiceTranscriptPlaceholder: '您说的内容会实时显示在这里。', inputMethodVoiceRecognized: '已识别的需求', inputMethodVoiceAdded: '已写入制作需求。', inputMethodVoiceSync: '相同内容也会自动写入下方制作需求栏。', inputMethodVoiceEdit: '编辑制作需求 ↓' },
    es: { inputMethodVoiceTranscript: 'TRANSCRIPCIÓN DE VOZ', inputMethodVoicePreparing: 'Tu solicitud por voz está lista para comenzar.', inputMethodVoiceListening: 'Estamos escuchando tu solicitud.', inputMethodVoiceTranscriptPlaceholder: 'Lo que digas aparecerá aquí en tiempo real.', inputMethodVoiceRecognized: 'Solicitud reconocida', inputMethodVoiceAdded: 'Añadida a tu solicitud de producción.', inputMethodVoiceSync: 'Las mismas palabras también se añaden al campo de producción de abajo.', inputMethodVoiceEdit: 'EDITAR SOLICITUD ↓' },
    fr: { inputMethodVoiceTranscript: 'TRANSCRIPTION VOCALE', inputMethodVoicePreparing: 'Votre demande vocale est prête à commencer.', inputMethodVoiceListening: 'Nous écoutons votre demande.', inputMethodVoiceTranscriptPlaceholder: 'Vos paroles apparaîtront ici en temps réel.', inputMethodVoiceRecognized: 'Demande reconnue', inputMethodVoiceAdded: 'Ajoutée à votre demande de production.', inputMethodVoiceSync: 'Les mêmes mots sont aussi ajoutés au champ de production ci-dessous.', inputMethodVoiceEdit: 'MODIFIER LA DEMANDE ↓' },
    de: { inputMethodVoiceTranscript: 'SPRACHTRANSKRIPT', inputMethodVoicePreparing: 'Ihre Sprachanfrage kann jetzt starten.', inputMethodVoiceListening: 'Ihre Anfrage wird angehört.', inputMethodVoiceTranscriptPlaceholder: 'Ihre Worte erscheinen hier in Echtzeit.', inputMethodVoiceRecognized: 'Erkannte Anfrage', inputMethodVoiceAdded: 'Zum Produktionsauftrag hinzugefügt.', inputMethodVoiceSync: 'Dieselben Worte werden auch in das Produktionsfeld unten übernommen.', inputMethodVoiceEdit: 'ANFRAGE BEARBEITEN ↓' },
    pt: { inputMethodVoiceTranscript: 'TRANSCRIÇÃO DE VOZ', inputMethodVoicePreparing: 'Seu pedido por voz está pronto para começar.', inputMethodVoiceListening: 'Estamos ouvindo seu pedido.', inputMethodVoiceTranscriptPlaceholder: 'O que você disser aparecerá aqui em tempo real.', inputMethodVoiceRecognized: 'Pedido reconhecido', inputMethodVoiceAdded: 'Adicionado ao seu pedido de produção.', inputMethodVoiceSync: 'As mesmas palavras também são adicionadas ao campo de produção abaixo.', inputMethodVoiceEdit: 'EDITAR PEDIDO ↓' },
    hi: { inputMethodVoiceTranscript: 'वॉइस ट्रांसक्रिप्ट', inputMethodVoicePreparing: 'आपका वॉइस अनुरोध शुरू करने के लिए तैयार है।', inputMethodVoiceListening: 'हम आपका अनुरोध सुन रहे हैं।', inputMethodVoiceTranscriptPlaceholder: 'आप जो बोलेंगे वह यहाँ वास्तविक समय में दिखाई देगा।', inputMethodVoiceRecognized: 'पहचाना गया अनुरोध', inputMethodVoiceAdded: 'आपके प्रोडक्शन अनुरोध में जोड़ दिया गया है।', inputMethodVoiceSync: 'यही शब्द नीचे दिए गए प्रोडक्शन अनुरोध में भी जुड़ जाते हैं।', inputMethodVoiceEdit: 'अनुरोध संपादित करें ↓' },
    ar: { inputMethodVoiceTranscript: 'تفريغ صوتي', inputMethodVoicePreparing: 'طلبك الصوتي جاهز للبدء.', inputMethodVoiceListening: 'نستمع إلى طلبك الآن.', inputMethodVoiceTranscriptPlaceholder: 'ستظهر كلماتك هنا مباشرةً.', inputMethodVoiceRecognized: 'الطلب الذي تم التعرّف عليه', inputMethodVoiceAdded: 'تمت إضافته إلى طلب الإنتاج.', inputMethodVoiceSync: 'تُضاف الكلمات نفسها أيضاً إلى حقل طلب الإنتاج أدناه.', inputMethodVoiceEdit: 'تعديل الطلب ↓' }
  };
  Object.entries(voiceTranscriptCopy).forEach(([language, copy]) => {
    if (window.AVVM_LOCALES && window.AVVM_LOCALES[language]) Object.assign(window.AVVM_LOCALES[language], copy);
  });

  /* Small but complete language pack for the AI AFTER prompt finder. */
  const promptFinderCopy = {
    ja: { afterPromptTitle: '作りたい AFTER を検索', afterPromptHint: '例：自然なウェディング、ヘアチェンジ、雰囲気のあるカフェ、明るいプロフィール', afterPromptSearchPlaceholder: '見たい変化・スタイル・シーンを入力', afterPromptCreate: 'プロンプトを作成', afterPromptQuickWedding: 'ウェディング', afterPromptQuickProfile: 'プロフィール', afterPromptQuickInterior: '空間スタイリング', afterPromptQuickPet: 'ペットポートレート', afterPromptResultTitle: '生成された演出プロンプト', afterPromptCopy: 'コピー', afterPromptApply: 'このプロンプトを適用', afterPromptNeedIntent: 'まず見たい変化やシーンを入力してください。', afterPromptApplied: '生成したプロンプトを AFTER リクエストに適用しました。', afterPromptCopied: 'コピー完了 ✓' },
    zh: { afterPromptTitle: '搜索您想要的 AFTER 效果', afterPromptHint: '例如：自然婚纱大片、发型变化、氛围咖啡馆、明亮形象照', afterPromptSearchPlaceholder: '输入您想看到的变化、风格或场景', afterPromptCreate: '生成提示词', afterPromptQuickWedding: '婚纱大片', afterPromptQuickProfile: '形象照升级', afterPromptQuickInterior: '空间风格设计', afterPromptQuickPet: '宠物肖像', afterPromptResultTitle: '已生成的创意提示词', afterPromptCopy: '复制', afterPromptApply: '应用此提示词', afterPromptNeedIntent: '请先描述您想要的变化或场景。', afterPromptApplied: '已将生成的提示词应用到 AFTER 请求。', afterPromptCopied: '已复制 ✓' },
    es: { afterPromptTitle: 'Busca el AFTER que quieres', afterPromptHint: 'Ej.: editorial de boda natural, cambio de cabello, café atmosférico, perfil luminoso', afterPromptSearchPlaceholder: 'Describe el cambio, estilo o escena que imaginas', afterPromptCreate: 'CREAR PROMPT', afterPromptQuickWedding: 'Editorial de boda', afterPromptQuickProfile: 'Mejorar perfil', afterPromptQuickInterior: 'Estilismo de espacio', afterPromptQuickPet: 'Retrato de mascota', afterPromptResultTitle: 'Prompt de dirección generado', afterPromptCopy: 'COPIAR', afterPromptApply: 'APLICAR ESTE PROMPT', afterPromptNeedIntent: 'Describe primero el cambio o la escena que deseas.', afterPromptApplied: 'El prompt generado se aplicó a tu solicitud AFTER.', afterPromptCopied: 'COPIADO ✓' },
    fr: { afterPromptTitle: 'Recherchez l’AFTER souhaité', afterPromptHint: 'Ex. : éditorial de mariage naturel, changement de coiffure, café d’ambiance, profil lumineux', afterPromptSearchPlaceholder: 'Décrivez le changement, le style ou la scène imaginée', afterPromptCreate: 'CRÉER LE PROMPT', afterPromptQuickWedding: 'Éditorial mariage', afterPromptQuickProfile: 'Profil amélioré', afterPromptQuickInterior: 'Style d’espace', afterPromptQuickPet: 'Portrait animal', afterPromptResultTitle: 'Prompt de direction généré', afterPromptCopy: 'COPIER', afterPromptApply: 'APPLIQUER CE PROMPT', afterPromptNeedIntent: 'Décrivez d’abord le changement ou la scène souhaitée.', afterPromptApplied: 'Le prompt généré a été appliqué à votre demande AFTER.', afterPromptCopied: 'COPIÉ ✓' },
    de: { afterPromptTitle: 'Das gewünschte AFTER suchen', afterPromptHint: 'z. B. natürliches Hochzeitseditorial, Haarwechsel, atmosphärisches Café, helles Profil', afterPromptSearchPlaceholder: 'Beschreiben Sie die gewünschte Veränderung, den Stil oder die Szene', afterPromptCreate: 'PROMPT ERSTELLEN', afterPromptQuickWedding: 'Hochzeitseditorial', afterPromptQuickProfile: 'Profil-Upgrade', afterPromptQuickInterior: 'Raumstyling', afterPromptQuickPet: 'Haustierporträt', afterPromptResultTitle: 'Generierter Regie-Prompt', afterPromptCopy: 'KOPIEREN', afterPromptApply: 'DIESEN PROMPT ANWENDEN', afterPromptNeedIntent: 'Beschreiben Sie zuerst die gewünschte Veränderung oder Szene.', afterPromptApplied: 'Der generierte Prompt wurde für Ihre AFTER-Anfrage übernommen.', afterPromptCopied: 'KOPIERT ✓' },
    pt: { afterPromptTitle: 'Pesquise o AFTER que você quer', afterPromptHint: 'Ex.: editorial de casamento natural, mudança de cabelo, café com atmosfera, perfil claro', afterPromptSearchPlaceholder: 'Descreva a mudança, o estilo ou a cena que imagina', afterPromptCreate: 'CRIAR PROMPT', afterPromptQuickWedding: 'Editorial de casamento', afterPromptQuickProfile: 'Perfil aprimorado', afterPromptQuickInterior: 'Estilo de espaço', afterPromptQuickPet: 'Retrato de pet', afterPromptResultTitle: 'Prompt de direção gerado', afterPromptCopy: 'COPIAR', afterPromptApply: 'APLICAR ESTE PROMPT', afterPromptNeedIntent: 'Primeiro descreva a mudança ou cena desejada.', afterPromptApplied: 'O prompt gerado foi aplicado ao seu pedido AFTER.', afterPromptCopied: 'COPIADO ✓' },
    hi: { afterPromptTitle: 'अपना इच्छित AFTER खोजें', afterPromptHint: 'जैसे: प्राकृतिक वेडिंग एडिटोरियल, हेयर चेंज, माहौल वाला कैफ़े, उजला प्रोफ़ाइल', afterPromptSearchPlaceholder: 'अपनी चाही गई बदलाव, शैली या दृश्य लिखें', afterPromptCreate: 'प्रॉम्प्ट बनाएँ', afterPromptQuickWedding: 'वेडिंग एडिटोरियल', afterPromptQuickProfile: 'प्रोफ़ाइल अपग्रेड', afterPromptQuickInterior: 'स्पेस स्टाइलिंग', afterPromptQuickPet: 'पेट पोर्ट्रेट', afterPromptResultTitle: 'बना हुआ डायरेक्शन प्रॉम्प्ट', afterPromptCopy: 'कॉपी', afterPromptApply: 'यह प्रॉम्प्ट लागू करें', afterPromptNeedIntent: 'पहले इच्छित बदलाव या दृश्य लिखें।', afterPromptApplied: 'बना हुआ प्रॉम्प्ट आपके AFTER अनुरोध में लागू हो गया।', afterPromptCopied: 'कॉपी हो गया ✓' },
    ar: { afterPromptTitle: 'ابحث عن نتيجة AFTER التي تريدها', afterPromptHint: 'مثال: جلسة زفاف طبيعية، تغيير شعر، مقهى بأجواء مميزة، صورة شخصية مشرقة', afterPromptSearchPlaceholder: 'صف التغيير أو الأسلوب أو المشهد الذي تتخيله', afterPromptCreate: 'إنشاء وصف', afterPromptQuickWedding: 'جلسة زفاف', afterPromptQuickProfile: 'تحسين الصورة الشخصية', afterPromptQuickInterior: 'تنسيق المساحة', afterPromptQuickPet: 'بورتريه للحيوان الأليف', afterPromptResultTitle: 'وصف الإخراج المُنشأ', afterPromptCopy: 'نسخ', afterPromptApply: 'تطبيق هذا الوصف', afterPromptNeedIntent: 'يرجى وصف التغيير أو المشهد الذي تريده أولاً.', afterPromptApplied: 'تم تطبيق الوصف المُنشأ على طلب AFTER الخاص بك.', afterPromptCopied: 'تم النسخ ✓' }
  };
  Object.entries(promptFinderCopy).forEach(([language, copy]) => {
    if (window.AVVM_LOCALES && window.AVVM_LOCALES[language]) Object.assign(window.AVVM_LOCALES[language], copy);
  });

  const promptFinderModes = {
    ja: { afterPromptModeLabel: '演出トーン', afterPromptModeCinematic: 'シネマティック', afterPromptModeCommercial: 'コマーシャル', afterPromptModeEmotional: 'エモーショナル', afterPromptResultTitle: '生成された制作プロンプト', afterPromptImage: '画像プロンプト', afterPromptVideo: 'AUTO REEL プロンプト', afterPromptNegative: '制限 / ガードレール', afterPromptApply: 'AI AFTER に適用' },
    zh: { afterPromptModeLabel: '创意基调', afterPromptModeCinematic: '电影感', afterPromptModeCommercial: '商业广告', afterPromptModeEmotional: '情感氛围', afterPromptResultTitle: '已生成的制作提示词', afterPromptImage: '图像提示词', afterPromptVideo: 'AUTO REEL 提示词', afterPromptNegative: '限制 / 护栏', afterPromptApply: '应用到 AI AFTER' },
    es: { afterPromptModeLabel: 'DIRECCIÓN', afterPromptModeCinematic: 'CINEMÁTICO', afterPromptModeCommercial: 'COMERCIAL', afterPromptModeEmotional: 'EMOCIONAL', afterPromptResultTitle: 'Prompts de producción generados', afterPromptImage: 'PROMPT DE IMAGEN', afterPromptVideo: 'PROMPT AUTO REEL', afterPromptNegative: 'LÍMITES / GUARDARRAÍLES', afterPromptApply: 'APLICAR A AI AFTER' },
    fr: { afterPromptModeLabel: 'DIRECTION', afterPromptModeCinematic: 'CINÉMATIQUE', afterPromptModeCommercial: 'COMMERCIAL', afterPromptModeEmotional: 'ÉMOTIONNEL', afterPromptResultTitle: 'Prompts de production générés', afterPromptImage: 'PROMPT IMAGE', afterPromptVideo: 'PROMPT AUTO REEL', afterPromptNegative: 'LIMITES / GARDE-FOUS', afterPromptApply: 'APPLIQUER À AI AFTER' },
    de: { afterPromptModeLabel: 'RICHTUNG', afterPromptModeCinematic: 'CINEMATISCH', afterPromptModeCommercial: 'COMMERCIAL', afterPromptModeEmotional: 'EMOTIONAL', afterPromptResultTitle: 'Generierte Produktions-Prompts', afterPromptImage: 'BILD-PROMPT', afterPromptVideo: 'AUTO-REEL-PROMPT', afterPromptNegative: 'GRENZEN / LEITPLANKEN', afterPromptApply: 'AUF AI AFTER ANWENDEN' },
    pt: { afterPromptModeLabel: 'DIREÇÃO', afterPromptModeCinematic: 'CINEMÁTICO', afterPromptModeCommercial: 'COMERCIAL', afterPromptModeEmotional: 'EMOCIONAL', afterPromptResultTitle: 'Prompts de produção gerados', afterPromptImage: 'PROMPT DE IMAGEM', afterPromptVideo: 'PROMPT AUTO REEL', afterPromptNegative: 'LIMITES / PROTEÇÕES', afterPromptApply: 'APLICAR AO AI AFTER' },
    hi: { afterPromptModeLabel: 'दिशा', afterPromptModeCinematic: 'सिनेमैटिक', afterPromptModeCommercial: 'कमर्शियल', afterPromptModeEmotional: 'भावनात्मक', afterPromptResultTitle: 'बनाए गए प्रोडक्शन प्रॉम्प्ट', afterPromptImage: 'इमेज प्रॉम्प्ट', afterPromptVideo: 'AUTO REEL प्रॉम्प्ट', afterPromptNegative: 'सीमाएँ / गार्डरेल', afterPromptApply: 'AI AFTER पर लागू करें' },
    ar: { afterPromptModeLabel: 'اتجاه الإخراج', afterPromptModeCinematic: 'سينمائي', afterPromptModeCommercial: 'تجاري', afterPromptModeEmotional: 'عاطفي', afterPromptResultTitle: 'مطالبات الإنتاج المُنشأة', afterPromptImage: 'وصف الصورة', afterPromptVideo: 'وصف AUTO REEL', afterPromptNegative: 'القيود / الحواجز', afterPromptApply: 'تطبيق على AI AFTER' }
  };
  Object.entries(promptFinderModes).forEach(([language, copy]) => {
    if (window.AVVM_LOCALES && window.AVVM_LOCALES[language]) Object.assign(window.AVVM_LOCALES[language], copy);
  });
})();
