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
})();
