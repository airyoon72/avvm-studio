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
})();
