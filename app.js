/* AVVM V10 scroll guard */
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
    const nav=$('#nav'); addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40));
    const toastEl=$('#toast');
    function toast(msg){ toastEl.textContent=msg; toastEl.classList.add('on'); clearTimeout(window.__toastTimer); window.__toastTimer=setTimeout(()=>toastEl.classList.remove('on'),2200); }

        const modal=$('#orderModal'); const modalCard=$('#modalCard'); const summary=$('#orderSummary');
    window.prices={
      'Mini Transform':'₩4,900',
      'Basic Transform':'₩7,900',
      'Best Transform':'₩12,900',
      '3 Style Set':'₩19,900',
      Starter:'₩19,900',
      Pro:'₩39,900',
      Signature:'₩79,900',
      Custom:'상담 후 견적'
    }; window.selectedPlan='Pro';
    function setOrderSummary(){
      const lang=localStorage.getItem('avvmLang')||'ko';
      const order=window.ORDER ? (window.ORDER[lang]||window.ORDER.ko) : {planPrefix:'Selected plan: '};
      if(summary) summary.textContent=`${order.planPrefix || 'Selected plan: '}${window.selectedPlan} · ${window.prices[window.selectedPlan]||window.prices.Pro}`;
    }
    function scrollModalToTop(){
      try{
        modalCard.scrollTop=0;
        modal.scrollTop=0;
        const panel=modal.querySelector('.modal-card,.modal-content,.order-panel');
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
        if(label) label.textContent='첨부 완료';
        if(small) small.textContent=input.files[0].name;
        box.classList.add('has-file');
      }else{
        if(label) label.textContent='사진 첨부하기';
        if(small) small.textContent='JPG, PNG, WEBP 등 이미지 파일';
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
      modalCard.classList.remove('done');
      modalCard.classList.add('plan-choosing');
      modal.classList.add('on');
      document.body.style.overflow='hidden';
      if(window.__avvmLenis) window.__avvmLenis.stop();
      setTimeout(scrollModalToTop,0);
    }
    function openOrder(plan){
      if(!plan){
        openPlanChooser();
        return;
      }
      window.selectedPlan=plan||window.selectedPlan;
      modalCard.classList.remove('done');
      modalCard.classList.remove('plan-choosing');
      setOrderSummary();
      modal.classList.add('on');
      document.body.style.overflow='hidden';
      if(window.__avvmLenis) window.__avvmLenis.stop();
      requestAnimationFrame(()=>{
        scrollModalToTop();
        setTimeout(()=>{ syncCustomerInputs(); focusAndReveal('#photoUploadVisibleBlock'); },120);
      });
    }
    function closeOrder(){ 
      modal.classList.remove('on'); 
      modalCard.classList.remove('plan-choosing'); 
      document.body.style.overflow=''; 
      if(window.__avvmLenis) window.__avvmLenis.start();
    }
    $$('[data-open]').forEach(b=>b.addEventListener('click',()=>openOrder(b.dataset.plan)));
    document.addEventListener('click', function(e){
      const choice=e.target.closest('[data-plan-choice]');
      if(!choice) return;
      openOrder(choice.getAttribute('data-plan-choice'));
    });
    $('#closeModal').addEventListener('click',closeOrder); modal.addEventListener('click',e=>{if(e.target===modal)closeOrder();});

    $$('.cat').forEach(b=>b.addEventListener('click',()=>{$$('.cat').forEach(x=>x.classList.remove('active'));b.classList.add('active'); toast(`${b.textContent} mood selected`);}));
    $('#imageInput').addEventListener('change',e=>{ 
      const file=e.target.files&&e.target.files[0]; 
      if(!file) return; 
      const url=URL.createObjectURL(file); 
      $('#previewImg').src=url; 
      $('#imagePreview').classList.add('on'); 
      toast('Image inserted'); 
      const block = document.getElementById('photoUploadVisibleBlock');
      if(block) {
        block.classList.add('has-file');
        const label = block.querySelector('.photo-upload-drop b');
        if(label) label.textContent = '사진 첨부 완료 ✓';
      }
    });
    let lastOrder=null;
    function makeOrderId(){ return 'AVVM-' + new Date().toISOString().slice(0,10).replaceAll('-','') + '-' + Math.random().toString(36).slice(2,7).toUpperCase(); }
    async function createOrder(){
      syncCustomerInputs(); const brand=getCustomerValue('#brandInput','#brandInput2');
      const email=getCustomerValue('#emailInput','#emailInput2');
      const phone=getCustomerValue('#phoneInput','#phoneInput2');
      const privacyConsent=!!($('#privacyConsent') && $('#privacyConsent').checked);
      const notifyConsent=!!($('#notifyConsent') && $('#notifyConsent').checked);
      const refundConsent=!!($('#refundConsent') && $('#refundConsent').checked);
      const marketingConsent=!!($('#marketingConsent') && $('#marketingConsent').checked);
      const category=$('.cat.active')?.textContent || 'Custom';
      const mood=$('#moodInput').value.trim();

      if(!brand){toast('성함 / 브랜드명을 입력해주세요'); focusCustomerField('#brandInput','#brandInput2'); return;}
      if(email && !email.includes('@')){toast('이메일 형식을 확인해주세요'); focusCustomerField('#emailInput','#emailInput2'); return;}
      if(!phone){toast('카톡/문자 알림용 휴대폰 번호를 입력해주세요'); focusCustomerField('#phoneInput','#phoneInput2'); return;}
      if(!privacyConsent || !notifyConsent || !refundConsent){toast('필수 동의 항목을 확인해주세요'); focusAndReveal('#consentGroup'); return;}

      const token=(crypto && crypto.getRandomValues) ? Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b=>b.toString(16).padStart(2,'0')).join('') : Math.random().toString(36).slice(2)+Date.now().toString(36);
      const orderId=makeOrderId();
      const draft={
        orderId,
        token,
        createdAt:new Date().toISOString(),
        brand,
        email,
        phone,
        consents:{
          privacy:privacyConsent,
          transactionalNotice:notifyConsent,
          customDigitalRefundLimit:refundConsent,
          marketing:marketingConsent
        },
        plan:window.selectedPlan,
        price:window.prices[window.selectedPlan]||window.prices.Pro,
        category,
        mood,
        aspectRatio:(document.getElementById("aspectRatio")?.value || "9:16"),
        resolution:(document.getElementById("resolution")?.value || "460p"),
        imageName:'upload_after_payment',
        status:'pending_payment',
        statusKo:'결제 대기',
        payment:{
          provider:'portone_toss',
          currency:'KRW',
          idempotencyKey: orderId + '-pay-1',
          webhookVerified:false
        },
        notificationMethod:'kakao_or_sms',
        viewUrl: location.origin + '/order.html?t=' + token
      };
      try{
        const res=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(draft)});
        if(res.ok){ const data=await res.json(); if(data.orderId) draft.orderId=data.orderId; }
      }catch(e){}
      draft.viewUrl = location.origin + '/order.html?t=' + draft.token;
      lastOrder=draft;
      const orders=JSON.parse(localStorage.getItem('avvmOrders')||'[]').filter(o=>o.token!==draft.token);
      orders.unshift(draft);
      localStorage.setItem('avvmOrders',JSON.stringify(orders.slice(0,50)));
      localStorage.setItem('avvmOrder_'+draft.token, JSON.stringify(draft));
      localStorage.setItem('avvmLastOrder', JSON.stringify(draft));
      $('#successOrderId').textContent='ORDER #' + draft.orderId;
      const view=$('#viewOrderLink');
      if(view){ view.href=draft.viewUrl; }
      const copy=$('#orderLinkCopy');
      if(copy){ copy.textContent='주문 링크가 생성되었습니다. 실제 운영에서는 결제 완료 후 이미지 업로드 링크가 열립니다.'; copy.dataset.customized='1'; }
      modalCard.classList.add('done');
      toast('Payment-ready order created ✓');
    }
    $('#submitOrder').addEventListener('click',createOrder);
    $('#downloadOrder').addEventListener('click',()=>{ if(!lastOrder){toast('저장된 주문이 없습니다'); return;} const blob=new Blob([JSON.stringify(lastOrder,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=lastOrder.orderId+'.json'; a.click(); URL.revokeObjectURL(a.href); });
    $('#resetOrder').addEventListener('click',()=>{ modalCard.classList.remove('done'); $('#brandInput').value=''; $('#emailInput').value=''; if($('#phoneInput')) $('#phoneInput').value=''; if($('#brandInput2')) $('#brandInput2').value=''; if($('#emailInput2')) $('#emailInput2').value=''; if($('#phoneInput2')) $('#phoneInput2').value=''; if($('#notifyConsent')) $('#notifyConsent').checked=true; $('#moodInput').value=''; $('#imageInput').value=''; $('#imagePreview').classList.remove('on'); updatePhotoUploadLabel(); if($('#viewOrderLink')) $('#viewOrderLink').href='#'; lastOrder=null; setTimeout(()=>{ syncCustomerInputs(); focusAndReveal('#photoUploadVisibleBlock'); },80); });

    const showreelModal=$('#showreelModal'); const showreelVideo=$('#showreelVideo');
    $('#watchShowreel').addEventListener('click',()=>{ showreelModal.classList.add('on'); document.body.style.overflow='hidden'; showreelVideo.play().catch(()=>{}); });
    function closeShowreel(){ showreelVideo.pause(); showreelModal.classList.remove('on'); document.body.style.overflow=''; }
    $('#closeShowreel').addEventListener('click',closeShowreel); showreelModal.addEventListener('click',e=>{if(e.target===showreelModal)closeShowreel();});

    const cards=$$('.work-card'); let workIndex=0; function setWork(i){ workIndex=(i+cards.length)%cards.length; cards[workIndex].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'}); $$('.dots i').forEach((d,n)=>d.classList.toggle('active',n===workIndex%5)); }
    $('#workNext').addEventListener('click',()=>setWork(workIndex+1)); $('#workPrev').addEventListener('click',()=>setWork(workIndex-1));
    document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeOrder(); closeShowreel(); }});

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
      const modal = document.getElementById('showreelModal');
      const player = document.getElementById('showreelPlayer');
      const closeBg = document.getElementById('showreelClose');
      const closeX = document.getElementById('showreelX');

      function openShowreel(){
        if(!modal || !player) return;
        modal.classList.add('on');
        modal.setAttribute('aria-hidden','false');

        // 로고 모션 → 쇼릴 본편 순서
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

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
      const heroVideo = document.querySelector('.hero-video');
      if(heroVideo){
        heroVideo.addEventListener('error', ()=>{
          document.body.classList.add('video-fallback');
        });
        heroVideo.play && heroVideo.play().catch(()=>{});
      }
    })();

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
      function openDemo(){
        const modal = document.getElementById('showreelModal');
        const player = document.getElementById('showreelPlayer');
        if(!modal || !player) return;
        modal.classList.add('on');
        modal.setAttribute('aria-hidden','false');
        player.controls = true;
        player.src = 'videos/demo-action.mp4';
        player.play().catch(()=>{});
      }
      document.querySelectorAll('.show-demo-btn').forEach(btn=>{
        btn.addEventListener('click', function(e){
          e.preventDefault();
          openDemo();
        });
      });
    })();

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
      function fixOpenModalScroll(){
        const candidates = document.querySelectorAll('.modal, .order-modal, .pay-modal, .project-modal, [role="dialog"], .modal-box, .order-box, .project-box, .modal-content');
        candidates.forEach(el=>{
          el.style.overflowY = 'auto';
          el.style.webkitOverflowScrolling = 'touch';
          if(el.classList.contains('modal-box') || el.classList.contains('order-box') || el.classList.contains('project-box') || el.classList.contains('modal-content')){
            el.style.maxHeight = 'calc(100svh - 24px)';
            el.style.paddingBottom = 'calc(46px + env(safe-area-inset-bottom))';
          } else {
            el.style.maxHeight = '100svh';
          }
        });
      }
      document.addEventListener('click', function(e){
        if(e.target.closest('[data-open], .btn, button')){
          setTimeout(fixOpenModalScroll, 120);
          setTimeout(fixOpenModalScroll, 500);
        }
      }, true);
      window.addEventListener('resize', fixOpenModalScroll);
      document.addEventListener('DOMContentLoaded', fixOpenModalScroll);
    })();

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
      async function postLatestOrderToApi(){
        try{
          const raw = localStorage.getItem('avvmLastOrder');
          if(!raw) return;
          const order = JSON.parse(raw);
          const res = await fetch('/api/order', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(order)
          });
          const data = await res.json().catch(()=>null);
          const panel = document.querySelector('.success-panel');
          if(panel && !panel.querySelector('.api-status-note')){
            const note = document.createElement('div');
            note.className = 'api-status-note';
            note.textContent = data && data.ok
              ? '주문 API 접수 완료. 이메일/결제 연결 전까지는 테스트 주문으로 저장됩니다.'
              : '주문은 브라우저에 저장되었습니다. API 연결은 배포 환경에서 확인하세요.';
            panel.appendChild(note);
          }
        }catch(e){
          const panel = document.querySelector('.success-panel');
          if(panel && !panel.querySelector('.api-status-note')){
            const note = document.createElement('div');
            note.className = 'api-status-note';
            note.textContent = '주문은 브라우저에 저장되었습니다. API 전송은 네트워크 상태를 확인하세요.';
            panel.appendChild(note);
          }
        }
      }

      const submit = document.getElementById('submitOrder');
      if(submit){
        submit.addEventListener('click', function(){
          setTimeout(postLatestOrderToApi, 350);
        });
      }
    })();

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
      function openFanclSample(){
        const modal = document.getElementById('showreelModal') || document.getElementById('videoModal');
        const player = document.getElementById('showreelPlayer') || document.getElementById('showreelVideo');
        if(!modal || !player) return;
        modal.classList.add('on');
        modal.setAttribute('aria-hidden','false');
        player.controls = true;
        player.src = 'videos/sample-fancl-cleansing.mp4';
        player.play().catch(()=>{});
      }
      document.querySelectorAll('.show-fancl-btn').forEach(btn=>{
        btn.addEventListener('click', function(e){
          e.preventDefault();
          openFanclSample();
        });
      });
    })();

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
      const tip = document.createElement('div');
      tip.className = 'avvm-help-tip';
      document.body.appendChild(tip);

      let hideTimer = null;

      function showTip(el){
        const msg = el && el.getAttribute('data-help');
        if(!msg) return;
        clearTimeout(hideTimer);
        tip.textContent = msg;
        tip.classList.add('on');

        const rect = el.getBoundingClientRect();
        const pad = 10;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let left = rect.left + rect.width / 2 - 130;
        let top = rect.top - 12;

        tip.style.left = '0px';
        tip.style.top = '0px';
        const tRect = tip.getBoundingClientRect();

        left = Math.max(pad, Math.min(vw - tRect.width - pad, rect.left + rect.width/2 - tRect.width/2));
        top = rect.top - tRect.height - 10;
        if(top < pad) top = rect.bottom + 10;
        if(top + tRect.height > vh - pad) top = vh - tRect.height - pad;

        tip.style.left = left + 'px';
        tip.style.top = top + 'px';
      }

      function hideTipSoon(){
        hideTimer = setTimeout(()=>tip.classList.remove('on'), 120);
      }

      document.addEventListener('mouseover', e=>{
        const el = e.target.closest('[data-help]');
        if(el) showTip(el);
      });
      document.addEventListener('focusin', e=>{
        const el = e.target.closest('[data-help]');
        if(el) showTip(el);
      });
      document.addEventListener('mouseout', e=>{
        if(e.target.closest('[data-help]')) hideTipSoon();
      });
      document.addEventListener('focusout', e=>{
        if(e.target.closest('[data-help]')) hideTipSoon();
      });
      document.addEventListener('touchstart', e=>{
        const el = e.target.closest('[data-help]');
        if(el){
          showTip(el);
          clearTimeout(hideTimer);
          hideTimer = setTimeout(()=>tip.classList.remove('on'), 2200);
        }
      }, {passive:true});

      const legalTexts = {
        terms: {
          ko: `
            <h2 id="legalTitle">이용약관</h2>
            <p>AVVM.studio는 AI 기술과 인간의 창의적 편집을 결합한 맞춤형 디지털 영상 제작 서비스를 제공합니다. AVVM은 완전 자동 인스턴트 렌더링 툴이 아닌, 크리에이티브 스튜디오입니다. 본 서비스를 이용함으로써 귀하는 정확한 프로젝트 정보를 제공하고, 제작된 영상 콘텐츠를 적법하게 사용하는 데 동의합니다.</p>
            <h3>맞춤형 디지털 서비스</h3>
            <p>AVVM은 고객이 업로드한 이미지, 선택한 스타일, 요청사항을 바탕으로 고유한 디지털 영상을 제작합니다. 결과물은 원본 이미지 화질, AI 생성 한계 및 요청하신 분위기에 따라 다를 수 있습니다.</p>
            <h3>사용자 책임</h3>
            <p>귀하는 AVVM에 업로드하는 모든 이미지, 로고, 상품 사진 및 기타 자료의 초상권, 저작권, 소유권 또는 사용 권한을 보유하고 있어야 합니다.</p>
            <h3>이용 제한</h3>
            <p>AVVM은 불법, 허위, 침해, 증오, 외설적이거나 타인의 권리를 침해하는 프로젝트의 제작을 거부할 권리가 있습니다.</p>
          `,
          en: `
            <h2 id="legalTitle">Terms of Service</h2>
            <p>AVVM.studio provides custom digital video production combining AI tools and human creative editing. AVVM is a creative production studio, not a fully automated rendering tool. By using our service, you agree to provide accurate project details and to use the delivered video content lawfully.</p>
            <h3>Custom Digital Service</h3>
            <p>AVVM creates unique digital videos based on your uploaded images, selected styles, and creative requests. Results may vary depending on source image quality, AI generation constraints, and requested mood.</p>
            <h3>User Responsibility</h3>
            <p>You must own or have explicit permission to use all images, logos, product photos, and other materials uploaded to AVVM.</p>
            <h3>Limitations</h3>
            <p>AVVM reserves the right to reject projects involving unlawful, misleading, infringing, hateful, explicit, or rights-violating content.</p>
          `,
          ja: `
            <h2 id="legalTitle">利用規約</h2>
            <p>AVVM.studioは、AI技術と人間のクリエイティブな編集を組み合わせたカスタムデジタル映像制作サービスを提供します。AVVMは完全自動のインスタントレンダリングツールではなく、クリエイティブスタジオです。本サービスを利用することにより、正確なプロジェクト情報を提供し、制作された映像コンテンツを合法的に使用することに同意するものとします。</p>
            <h3>カスタムデジタルサービス</h3>
            <p>AVVMは、お客様がアップロードした画像、選択したスタイル、リクエストに基づいて独自のデジタル映像を制作します。仕上がりは、元画像の画質、AI生成の限界、ご希望の雰囲気によって異なる場合があります。</p>
            <h3>ユーザーの責任</h3>
            <p>お客様は、AVVMにアップロードするすべての画像、ロゴ、商品写真、およびその他の素材の肖像権、著作権、所有権、または使用権限を保有している必要があります。</p>
            <h3>利用制限</h3>
            <p>AVVMは、不法、虚偽、侵害、憎悪、わいせつ、または他人の権利を侵害するプロジェクトの制作を拒否する権利を留保します。</p>
          `,
          zh: `
            <h2 id="legalTitle">服务条款</h2>
            <p>AVVM.studio 提供结合 AI 技术和人工创意编辑的定制数字化视频制作服务。AVVM 是一个创意工作室，而非全自动即时渲染工具。使用本服务即表示您同意提供准确的项目信息，并合法使用交付的视频内容。</p>
            <h3>定制数字化服务</h3>
            <p>AVVM 根据用户上传的图片、选择的风格和要求制作独特的数字视频。最终效果可能会因原始图片画质、AI 生成限制及要求的氛围而有所不同。</p>
            <h3>用户责任</h3>
            <p>您必须拥有或获得明确许可使用上传到 AVVM 的所有图片、徽标、商品照片及其他材料。</p>
            <h3>服务限制</h3>
            <p>AVVM 保留拒绝涉及违法、虚假、侵权、仇恨、淫秽或侵犯他人权利项目的制作权利。</p>
          `
        },
        privacy: {
          ko: `
            <h2 id="legalTitle">개인정보처리방침</h2>
            <p>AVVM은 주문 처리 및 고객 지원을 위해 이름, 이메일, 전화번호, 업로드 이미지, 주문 내역 등의 프로젝트 정보를 수집할 수 있습니다.</p>
            <h3>수집 및 이용 목적</h3>
            <p>업로드된 이미지와 프로젝트 정보는 비디오 제작, 주문 관리, 고객 지원 및 제작 워크플로우 개선 목적으로만 사용됩니다.</p>
            <h3>보관 및 파기</h3>
            <p>프로젝트 파일은 배송, 수정, 분쟁 해결을 위해 제한된 기간 동안 보관되며, 삭제 요청이 있거나 보존 기간이 만료되면 안전하게 파기됩니다.</p>
            <h3>제3자 제공 및 처리 위탁</h3>
            <p>회사는 원활한 서비스 제공을 위해 사용자가 동의한 범위 내에서 호스팅, 결제, 알림 전송 등 필요한 최소한의 업무를 외부 업체에 위탁할 수 있습니다.</p>
            <h3>결제 업무 위탁</h3>
            <p>수탁자: 주식회사 코리아포트원<br>위탁 업무: 전자결제 서비스 제공, 결제 처리, 결제 결과 확인, 결제 관련 고객 응대 및 정산 업무<br>보유 및 이용기간: 위탁 계약 종료 시 또는 관련 법령상 보관기간 만료 시까지</p>
          `,
          en: `
            <h2 id="legalTitle">Privacy Policy</h2>
            <p>AVVM may collect project information including name, email, phone number, uploaded images, and order details to process orders and provide customer support.</p>
            <h3>Use of Information</h3>
            <p>Uploaded images and project details are used solely to produce the requested video, manage orders, provide support, and improve the production workflow.</p>
            <h3>Retention & Deletion</h3>
            <p>Project files are retained for a limited period for delivery, revisions, and dispute resolution. They are securely deleted upon request or expiration of the retention period.</p>
            <h3>Third-Party Processing</h3>
            <p>We may share minimal required details with third-party service providers for hosting, secure payment processing, and notification delivery.</p>
            <h3>Payment Processing Delegation</h3>
            <p>Processor: Korea PortOne Inc.<br>Delegated work: electronic payment service, payment processing, payment result verification, payment-related support, and settlement operations.<br>Retention period: until the delegation contract ends or the legally required retention period expires.</p>
          `,
          ja: `
            <h2 id="legalTitle">個人情報処理方針</h2>
            <p>AVVMは、注文処理およびカスタマーサポートのため、お名前、メールアドレス、電話番号、アップロードされた画像、注文履歴などのプロジェクト情報を収集する場合があります。</p>
            <h3>収集および利用目的</h3>
            <p>アップロードされた画像とプロジェクト情報は、映像制作、注文管理、カスタマーサポート、および制作ワークフローの改善目的にのみ使用されます。</p>
            <h3>保管と破棄</h3>
            <p>プロジェクトファイルは、納品、修正、紛争解決のために限られた期間保管され、削除リクエストがあるか保管期間が満了した後は安全に破棄されます。</p>
            <h3>委託および第三者処理</h3>
            <p>本サービスは、ホスティング、決済、通知送信などのため、必要最小限の範囲内で委託業者を利用することがあります。</p>
            <h3>決済業務の委託</h3>
            <p>受託者: Korea PortOne Inc.<br>委託業務: 電子決済サービス、決済処理、決済結果確認、決済関連対応および精算業務。</p>
          `,
          zh: `
            <h2 id="legalTitle">隐私政策</h2>
            <p>AVVM 可能会收集项目信息，包括姓名、电子邮箱、电话号码、上传的图片及订单详情，以处理订单并提供客户支持。</p>
            <h3>信息使用目的</h3>
            <p>上传的图片和项目信息仅用于制作请求的视频、管理订单、提供客服支持及优化制作流程。</p>
            <h3>保留与销毁</h3>
            <p>项目文件将在有限的期限内保留，用于交付、修改及纠纷处理。收到删除请求或保留期满后，将予以安全销毁。</p>
            <h3>第三方处理</h3>
            <p>我们可能会与第三方服务商共享必要的最低限度信息，以用于网络托管、安全支付处理和发送通知。</p>
            <h3>支付业务委托</h3>
            <p>受托方: Korea PortOne Inc.<br>委托业务: 电子支付服务、支付处理、支付结果确认、支付相关客户支持及结算业务。</p>
          `
        },
        refund: {
          ko: `
            <h2 id="legalTitle">취소 및 환불 정책</h2>
            <p>AVVM은 개별 고객 맞춤형으로 제작되는 디지털 영상 서비스를 제공하므로, 제작이 시작된 이후에는 단순 변심에 의한 주문 취소 및 환불이 불가능합니다.</p>
            <h3>제작 착수 전</h3>
            <p>결제 완료 후 실제 영상 제작이 시작되기 전에 취소를 요청하시는 경우 전액 환불이 가능합니다.</p>
            <h3>제작 착수 후</h3>
            <p>영상의 제작 작업이 이미 시작된 경우에는 디지털 맞춤 서비스 특성상 환불이 불가합니다. 단, 기술적 오류로 인해 서비스 제공이 불가능한 경우에는 예외적으로 환불됩니다.</p>
            <h3>결제 통화 및 환율</h3>
            <p>표시되는 외화 가격은 참고용 환율 기준이며, 모든 결제는 대한민국 원화(KRW)로 처리됩니다. 환불 시 가입하신 금융기관의 환율 차이에 따라 실제 수령액이 달라질 수 있습니다.</p>
          `,
          en: `
            <h2 id="legalTitle">Cancellation & Refund Policy</h2>
            <p>Because AVVM provides custom digital video production tailored to individual requests, cancellations and refunds are strictly limited once production has started.</p>
            <h3>Before Production</h3>
            <p>A full refund is available if cancellation is requested before the actual video creation process begins.</p>
            <h3>After Production Starts</h3>
            <p>No refunds can be issued after production begins, except in cases where technical failures prevent AVVM from delivering the ordered service.</p>
            <h3>Currency & Exchange Rates</h3>
            <p>All transactions are processed in Korean Won (KRW). Displayed foreign currencies are estimates. Refunds are issued in KRW, and the received amount may vary based on your bank's conversion rates.</p>
          `,
          ja: `
            <h2 id="legalTitle">キャンセル・返金ポリシー</h2>
            <p>AVVMは個別のお客様に合わせて制作されるデジタル映像サービスを提供しているため、制作開始後はお客様都合による注文의キャンセルおよび返金はできません。</p>
            <h3>制作開始前</h3>
            <p>決済完了後、実際の映像制作が始まる前にキャンセルをリクエストされた場合は、全額返金が可能です。</p>
            <h3>制作開始後</h3>
            <p>映像の制作作業がすでに開始されている場合は、デジタルカスタムサービスの特性上、返金はいたしかねます。ただし、技術的なエラーによりサービス提供が不可能な場合は例外とします。</p>
            <h3>決済通貨と為替レート</h3>
            <p>表示されている外貨価格は参考用のレートであり、すべての決済は韓国ウォン（KRW）で処理されます。返金時のご利用金融機関の為替レートにより、実際の受取額が異なる場合があります。</p>
          `,
          zh: `
            <h2 id="legalTitle">取消和退款政策</h2>
            <p>由于 AVVM 提供针对个人要求定制的数字视频制作服务，一旦开始制作，因个人意愿的取消和退款将受到严格限制。</p>
            <h3>制作开始前</h3>
            <p>在实际视频制作流程开始前申请取消，可获得全额退款。</p>
            <h3>制作开始后</h3>
            <p>制作工作一旦开始，由于数字化定制服务的特殊性，将无法退款。但因技术故障导致 AVVM 无法交付服务的情况除外。</p>
            <h3>支付货币与汇率</h3>
            <p>所有交易均以韩元 (KRW) 处理。显示的非韩币价格仅供参考。退款将以韩元发放，实际收到金额可能因银行汇率而有所不同。</p>
          `
        },
        delivery: {
          ko: `
            <h2 id="legalTitle">디지털 제공 안내</h2>
            <p>AVVM.studio에서 제작된 모든 영상물은 실물 배송이 없는 디지털 전송 방식으로 고객에게 제공됩니다.</p>
            <h3>제공 방식</h3>
            <p>제작이 완료되면 주문 시 입력하신 휴대폰 연락처(카카오톡/문자) 또는 이메일로 고유한 완성본 다운로드 링크가 전송됩니다.</p>
            <h3>제공 기간</h3>
            <p>평균 영업일 기준 1~3일 이내에 제작이 완료되어 전송됩니다. 작업량 폭주나 특이사항이 있을 경우 지연될 수 있으며, 사전에 별도 안내해 드립니다.</p>
            <h3>보관 및 다운로드 기한</h3>
            <p>제공된 링크는 전송일로부터 30일 동안 유지됩니다. 기한이 지난 이후에는 서버에서 안전하게 파기되므로, 수령 즉시 개인 기기에 저장하시기 바랍니다.</p>
          `,
          en: `
            <h2 id="legalTitle">Digital Delivery Info</h2>
            <p>All video products produced by AVVM.studio are delivered directly to customers via digital transmission, with no physical shipping.</p>
            <h3>Delivery Method</h3>
            <p>Upon completion, a unique download link for your video will be sent to the phone number (Kakao/SMS) or email address provided during checkout.</p>
            <h3>Delivery Timeframe</h3>
            <p>Videos are usually completed and delivered within 1 to 3 business days. In case of high order volume or special requirements, delays may occur and will be communicated in advance.</p>
            <h3>Download Expiry</h3>
            <p>Delivered links remain active for 30 days. After this period, files are securely deleted from our servers, so please download them to your device immediately.</p>
          `,
          ja: `
            <h2 id="legalTitle">デジタル納品のご案内</h2>
            <p>AVVM.studioで制作されたすべての映像商品は、物理的な発送がないデジタル送信方式でお客様に提供されます。</p>
            <h3>納品方法</h3>
            <p>制作が完了すると、注文時に入力された携帯電話番号（カカオトーク/SMS）またはメールアドレス宛てに、固有のダウンロードリンクが送信されます。</p>
            <h3>納期</h3>
            <p>平均して1〜3営業日以内に制作が完了し、送信されます。注文の集中や特別な要請がある場合は遅れることがあり、その際は事前にお知らせします。</p>
            <h3>保管およびダウンロード期限</h3>
            <p>提供されたリンクは送信日から30日間有効です。期限が過ぎた後はサーバーから安全に削除されますので、受信後すぐに個人デバイスに保存してください。</p>
          `,
          zh: `
            <h2 id="legalTitle">数字化交付说明</h2>
            <p>AVVM.studio 制作的所有视频产品均通过数字传输方式交付给客户，不提供实体邮寄。</p>
            <h3>交付方式</h3>
            <p>视频制作完成后，系统会将唯一的下载链接发送至您结账时提供的手机号码（Kakao/短信）或电子邮箱。</p>
            <h3>交付时间</h3>
            <p>视频通常在 1 至 3 个工作日内制作完成并发送。如果订单量过大或有特殊要求，可能会有延迟，我们将提前通知您。</p>
            <h3>下载有效期</h3>
            <p>交付的下载链接自发送之日起 30 天内有效。到期后文件将从服务器中安全删除，请在收到后立即下载保存至您的设备。</p>
          `
        },
        service: {
          ko: `
            <h2 id="legalTitle">서비스 및 상품 안내</h2>
            <p>AVVM은 차세대 AI 비디오 제너레이터를 결합하여 브랜드 홍보, 제품 쇼케이스, SNS 마케팅에 최적화된 초단기 맞춤 비디오 콘텐츠를 제작합니다.</p>
            <h3>상품 라인업</h3>
            <ul>
              <li><b>Starter</b>: 1:1 또는 9:16 비율, 빠른 숏폼 영상 및 브랜드 인트로 제작에 적합합니다.</li>
              <li><b>Pro (Best)</b>: 1080p 고해상도, 고난도 카메라 워킹과 풍부한 디테일을 제공하며 광고 크리에이티브에 적합합니다.</li>
              <li><b>Signature</b>: 4K 해상도 극대화, 정밀한 비주얼 보정 및 1:1 맞춤 연출이 결합된 프리미엄 에디션입니다.</li>
            </ul>
            <h3>작업 프로세스</h3>
            <p>고객 주문 접수 -> 이미지 분석 및 스타일 매칭 -> AI 영상 생성 및 전문 디렉터 컷 편집 -> 완성본 링크 전송 순으로 진행됩니다.</p>
          `,
          en: `
            <h2 id="legalTitle">Service & Product Info</h2>
            <p>AVVM integrates next-generation AI video generation with creative direction to deliver high-impact short-form videos tailored for brand promotion and social media.</p>
            <h3>Product Lineup</h3>
            <ul>
              <li><b>Starter</b>: 1:1 or 9:16 format, ideal for quick social media content and brand intros.</li>
              <li><b>Pro (Best)</b>: 1080p resolution, complex camera moves, rich details, perfect for ad campaigns.</li>
              <li><b>Signature</b>: Ultra-high 4K resolution, advanced visual styling, custom art direction.</li>
            </ul>
            <h3>Workflow</h3>
            <p>Order placement -> Image analysis & style matching -> AI video generation & professional editing -> Secure link delivery.</p>
          `,
          ja: `
            <h2 id="legalTitle">サービス・商品情報</h2>
            <p>AVVMは、次世代のAIビデオジェネレーターを組み合わせて、ブランドプロモーション、製品紹介、SNSマーケティングに最適化されたカスタム動画コンテンツを制作します。</p>
            <h3>プランのご案内</h3>
            <ul>
              <li><b>Starter</b>: 1:1または9:16比率、素早いショート動画やブランドイントロ制作に最適です。</li>
              <li><b>Pro (Best)</b>: 1080p高解像度、高度なカメラワークと豊かなディテールを提供し、広告に最適です。</li>
              <li><b>Signature</b>: 4K高解像度、精密なビジュアル補正、カスタム演出が融合したプレミアムエディションです。</li>
            </ul>
            <h3>制作の流れ</h3>
            <p>注文受付 -> 画像分析およびスタイルマッチング -> AI映像生成および専門ディレクターによる編集 -> 完成リンクの送信の順で行われます。</p>
          `,
          zh: `
            <h2 id="legalTitle">服务与商品说明</h2>
            <p>AVVM 将新一代 AI 视频生成器与专业创意设计相结合，制作出适合品牌推广、产品展示及社交媒体营销的高效短视频内容。</p>
            <h3>产品方案</h3>
            <ul>
              <li><b>Starter (入门版)</b>: 1:1 或 9:16 格式，适合快速制作短视频和品牌片头。</li>
              <li><b>Pro (专业版/推荐)</b>: 1080p 高分辨率，复杂的相机运镜，细节丰富，非常适合广告投放。</li>
              <li><b>Signature (旗舰版)</b>: 极致 4K 分辨率，高级视觉修正，1对1专属艺术设计。</li>
            </ul>
            <h3>制作流程</h3>
            <p>提交订单 -> 图片分析和风格匹配 -> AI 视频生成与专业导演剪辑 -> 安全链接交付。</p>
          `
        },
        pg: {
          ko: `
            <h2 id="legalTitle">PG 심사 정보</h2>
            <p>AVVM.studio는 안전하고 신뢰할 수 있는 전자상거래 결제 환경을 준수합니다.</p>
            <h3>결제 서비스 제공</h3>
            <p>신용카드, 계좌이체 등 모든 결제 서비스는 공식 등록된 전자결제대행사(PG사)를 통해 안전하게 중개 및 처리됩니다.</p>
            <h3>결제 보안</h3>
            <p>고객님의 결제 정보는 SSL 암호화 프로토콜을 통해 안전하게 암호화되어 전송되며, AVVM은 어떠한 결제 비밀번호나 카드 정보를 자체 서버에 보관하지 않습니다.</p>
            <h3>소비자 피해보상</h3>
            <p>서비스 장애나 제공 불능 상태가 발생할 경우, 관련 전자상거래법령 및 이용약관에 의거하여 즉각적인 피해보상과 환불 조치가 이행됩니다.</p>
          `,
          en: `
            <h2 id="legalTitle">PG Review Info</h2>
            <p>AVVM.studio complies with standard electronic commerce payment regulations to provide a secure checkout environment.</p>
            <h3>Payment Processing</h3>
            <p>All payments (credit card, bank transfers) are securely processed and mediated by a certified Payment Gateway (PG) partner.</p>
            <h3>Data Security</h3>
            <p>Customer payment credentials are encrypted using SSL protocols. AVVM never stores your card number, CVV, or passwords on its servers.</p>
            <h3>Consumer Rights</h3>
            <p>In case of service failure or non-delivery, standard consumer protection laws and refund clauses will apply immediately to protect your purchase.</p>
          `,
          ja: `
            <h2 id="legalTitle">PG審査情報</h2>
            <p>AVVM.studioは、安全で信頼性の高い電子決済環境を遵守しています。</p>
            <h3>決済サービスの提供</h3>
            <p>クレジットカード、銀行振込などのすべての決済サービスは、公式に登録された決済代行会社（PG社）を通じて安全に処理されます。</p>
            <h3>決済セキュリティ</h3>
            <p>お客様の決済情報はSSL暗号化通信によって保護され、AVVMはカード番号や暗証番号などの決済情報を一切自社サーバーに保管しません。</p>
            <h3>消費者保護</h3>
            <p>サービス障害や納品不能が発生した場合は、電子商取引法および利用規約に基づき、速やかに返金および補償措置が行われます。</p>
          `,
          zh: `
            <h2 id="legalTitle">PG 审核信息</h2>
            <p>AVVM.studio 遵守标准电子商务支付规范，提供安全的结账环境。</p>
            <h3>支付服务提供</h3>
            <p>所有支付（信用卡、网银转账等）均通过官方认证的第三方支付网关 (PG) 合作伙伴安全处理和结算。</p>
            <h3>信息安全</h3>
            <p>客户的支付数据通过 SSL 加密传输。AVVM 不会在自身服务器上存储您的卡号、CVV 或支付密码。</p>
            <h3>消费者权益保障</h3>
            <p>如果发生服务故障或无法交付，将根据相关电子商务法规 and 退款条款立即实施补偿和退款，以保护您的交易安全。</p>
          `
        },
        business: {
          ko: `
            <h2 id="legalTitle">사업자 정보</h2>
            <p>AVVM.studio는 대한민국의 관련 법령을 준수하는 정식 등록 사업체입니다.</p>
            <h3>상호 및 대표</h3>
            <p>상호: 라라랜드맘 / AVVM · 대표자: 윤동국</p>
            <h3>연락처 및 주소</h3>
            <p>이메일: airyoon72@naver.com · 전화번호: 0505-007-5221</p>
            <h3>등록 번호</h3>
            <p>사업자등록번호: 347-37-01807 · 통신판매업 신고번호: 제2026-경기파주-2862호</p>
          `,
          en: `
            <h2 id="legalTitle">Business Profile</h2>
            <p>AVVM.studio is a registered business operating in compliance with Republic of Korea e-commerce regulations.</p>
            <h3>Company Details</h3>
            <p>Company: 라라랜드맘 / AVVM · Representative: Dongkuk Yoon</p>
            <h3>Contact</h3>
            <p>Email: airyoon72@naver.com · Hotline: 0505-007-5221</p>
            <h3>Registrations</h3>
            <p>Business License No.: 347-37-01807 · Mail-order Registration: in progress / pending updates</p>
          `,
          ja: `
            <h2 id="legalTitle">事業者情報</h2>
            <p>AVVM.studioは、大韓民国の関連法令を遵守する正規登録事業者です。</p>
            <h3>商号および代表</h3>
            <p>商号: ララランドマム / AVVM · 代表者: ユン・ドングク</p>
            <h3>連絡先</h3>
            <p>メールアドレス: airyoon72@naver.com · 電話番号: 0505-007-5221</p>
            <h3>등록 번호</h3>
            <p>事業者登録番号: 347-37-01807 · 通信販売業申告: 手続き中 / 発行次第アップデート予定</p>
          `,
          zh: `
            <h2 id="legalTitle">企业基本信息</h2>
            <p>AVVM.studio 是遵守大韩民国相关法律法规的正规注册企业。</p>
            <h3>公司名称与代表</h3>
            <p>名称: 라라랜드맘 / AVVM · 代表人: 尹东国</p>
            <h3>联络方式</h3>
            <p>电子邮箱: airyoon72@naver.com · 电话: 0505-007-5221</p>
            <h3>注册信息</h3>
            <p>营业执照号: 347-37-01807 · 通信销售申报: 处理中 / 执照发放后立即更新</p>
          `
        }
      };

      // Set other languages to fallback to English (for languages other than ko, ja, zh)
      ['es', 'fr', 'de', 'pt', 'ar'].forEach(l => {
        Object.keys(legalTexts).forEach(k => {
          if (!legalTexts[k][l]) {
            legalTexts[k][l] = legalTexts[k].en;
          }
        });
      });

      const modal = document.getElementById('legalModal');
      const content = document.getElementById('legalContent');
      const close = document.getElementById('legalClose');
      const backdrop = document.getElementById('legalBackdrop');

      function openLegal(key){
        if(!modal || !content) return;
        const currentLang = localStorage.getItem('avvmLang') || 'ko';
        const doc = legalTexts[key] || legalTexts.terms;
        content.innerHTML = doc[currentLang] || doc.en || doc.ko;
        modal.classList.add('on');
        modal.setAttribute('aria-hidden','false');
      }
      function closeLegal(){
        if(!modal) return;
        modal.classList.remove('on');
        modal.setAttribute('aria-hidden','true');
      }

      document.querySelectorAll('[data-legal]').forEach(btn=>{
        btn.addEventListener('click', e=>{
          e.preventDefault();
          openLegal(btn.getAttribute('data-legal'));
        });
      });
      if(close) close.addEventListener('click', closeLegal);
      if(backdrop) backdrop.addEventListener('click', closeLegal);
      document.addEventListener('keydown', e=>{
        if(e.key === 'Escape') closeLegal();
      });
    })();

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
      // Make global language bar work even if older header language scripts are hidden.
      document.addEventListener("click", function(e){
        const langBtn = e.target.closest(".global-lang-bar [data-lang]");
        if(langBtn){
          e.preventDefault();
          const oldBtn = document.querySelector('.lang-switcher [data-lang="'+langBtn.dataset.lang+'"]');
          if(oldBtn) oldBtn.click();
          document.querySelectorAll(".global-lang-bar button").forEach(b=>b.classList.toggle("active", b.dataset.lang===langBtn.dataset.lang));
        }
      }, true);

      // Aspect ratio / resolution chip selection
      document.addEventListener("click", function(e){
        const chip = e.target.closest(".option-chip");
        if(!chip) return;
        const group = chip.closest("[data-option-group]");
        if(!group) return;
        group.querySelectorAll(".option-chip").forEach(b=>b.classList.remove("active"));
        chip.classList.add("active");
        const type = group.getAttribute("data-option-group");
        const hidden = document.getElementById(type === "aspect" ? "aspectRatio" : "resolution");
        if(hidden) hidden.value = chip.getAttribute("data-value");
      });

      // Add chosen options to order JSON if submit handler exposes FormData-like behavior.
      document.addEventListener("submit", function(){
        const ar = document.getElementById("aspectRatio");
        const res = document.getElementById("resolution");
        if(ar) ar.setAttribute("value", ar.value || "9:16");
        if(res) res.setAttribute("value", res.value || "460p");
      }, true);
    })();

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
  const I18N={"ko": {"startProject": "START PROJECT ↗", "viewShowreel": "VIEW SHOWREEL", "scrollExplore": "SCROLL TO EXPLORE", "heroEyebrow": "THE AI VIDEO VENDING MACHINE", "heroSub": "사진 한 장으로 완성하는 프리미엄 시네마틱 영상.", "beforeAfterCopy": "사진 한 장을 업로드하면, AVVM이 광고급 시네마틱 결과물로 전환합니다.", "demoEyebrow": "IMAGE TO CINEMA", "demoTitle": "사진 한 장에서<br>광고 영상으로.", "demoCopy": "사진 한 장이 브랜드 광고 영상으로 확장되는 대표 데모입니다. 인물, 제품, 분위기 이미지를 기반으로 시네마틱한 컷과 움직임을 구성합니다.", "demoChip1": "이미지 기반", "demoChip2": "시네마틱 모션", "demoChip3": "광고용 결과", "watchTransformation": "WATCH TRANSFORMATION ↗", "beautyCopy": "FANCL 클렌징 오일 스타일의 15초 뷰티 광고 샘플입니다. 물결, 투명한 라이트 블루 톤, 피부 클로즈업, 제품 중심 컷을 조합한 프리미엄 스킨케어 무드입니다.", "speedTitle": "AI SPEED.<br>HUMAN FINISH.", "keepTitle": "KEEP THE<br>PRODUCT RIGHT.", "tryTitle": "TRY BEFORE<br>FULL ORDER.", "includedTitle": "WHAT IS<br>INCLUDED?", "portfolioKicker": "Portfolio expansion", "portfolioTitle": "7 SECTORS.<br>ONE ENGINE.", "portfolioCopy": "AVVM은 뷰티뿐 아니라 자동차, 문화, 기업, 축제, 스토리, 액션까지 다양한 산업군의 영상 샘플로 확장됩니다.", "portAuto": "공중 추적, 고속 코너링, 레이스 에너지를 보여주는 자동차 섹터 샘플입니다.", "portHeritage": "전통 장인성과 미래 기술 이미지를 결합한 문화/관광 영상 샘플입니다.", "portBusiness": "기업, 서비스, 스타트업 소개에 맞는 짧은 비즈니스 영상 샘플입니다.", "portFestival": "불꽃, 야간 행사, 지역 축제 홍보에 맞는 이벤트 영상 샘플입니다.", "portStory": "인물 감정과 분위기를 살린 라이프스타일/스토리형 영상 샘플입니다.", "portMetaverse": "지역 문화 상징이 디지털 네트워크와 결합되는 메타버스형 영상 샘플입니다.", "portAction": "격투, 추격, 긴장감 있는 전환을 보여주는 실험적 액션 영상 샘플입니다.", "aspectTitle": "비율 선택", "resolutionTitle": "해상도 선택", "sizeChoiceNote": "비율과 해상도는 주문 단계에서 직접 선택합니다. 선택 가능: 9:16 / 16:9 / 1:1 · 460p / 720p / 1080p / 4K", "pricingNote": "납품 일정은 주문 내용 확인 후 안내됩니다. 외화 표시는 참고용이며 실제 결제는 원화(KRW)로 진행됩니다.", "consumerKicker": "For everyone · sticker-photo price", "consumerTitle": "ONE PHOTO,<br>NEW WORLD.", "consumerCopy": "잘 나온 사진 한 장만 올리세요. 평범한 일상 사진이 해외 명소, 인스타 감성, 패션 모델 무드로 바뀌는 초보자용 트랜스폼 영상입니다.", "travelJumpTitle": "해외 명소로 순간 이동", "travelJumpCopy": "앉아 있던 사진도 파리, 뉴욕, 산토리니, 도쿄 같은 글로벌 무드 영상으로 확장합니다.", "fashionSwitchTitle": "옷차림을 모델룩으로", "fashionSwitchCopy": "평범한 옷차림을 더 세련된 패션 화보 무드로 바꾸고, 헤어·신발·가방까지 스타일링합니다.", "walkTransformTitle": "걸으며 한순간에 변신", "walkTransformCopy": "보통 속도로 걷다가 가방을 뒤로 제끼고 고개를 돌리는 순간, 옷·악세서리·헤어·선글라스가 한 번에 바뀝니다.", "miniCopy": "5초 / 1스타일 / 가볍게 체험하는 스티커사진급 변신 영상", "basicConsumerCopy": "8초 / 1스타일 / SNS에 올리기 좋은 기본 트랜스폼", "bestConsumerCopy": "10초 / 여행+패션 무드 / 더 강한 틱톡형 전환", "setConsumerCopy": "3개 스타일 묶음 / 여행·패션·워킹 변신을 한 번에", "tryNow": "TRY NOW", "startTransform": "START TRANSFORM", "chooseBest": "CHOOSE BEST", "getSet": "GET SET", "promptBoxTitle": "Hot Transform Styles", "promptBoxCopy": "요즘 숏폼에서 잘 먹히는 전환 프롬프트를 고객이 쉽게 고를 수 있게 정리했습니다.", "prompt1": "Fashion Glow Up: 평범한 룩이 모델 같은 스타일로 변신", "prompt2": "World Travel Transform: 한 장의 사진이 전세계 명소 릴스로 변신", "prompt3": "Bag Flip Walk: 가방을 뒤로 제끼고 고개를 돌리는 순간 전체 패션 변신", "starterUse": "빠른 숏폼 광고용", "starterItem1": "시네마틱 영상 1편", "starterItem2": "비율 선택: 9:16 / 16:9 / 1:1", "starterItem3": "해상도 선택: 460p / 720p / 1080p / 4K", "commercialUse": "상업적 사용 가능", "proUse": "브랜드/제품 광고용", "proItem1": "프리미엄 영상 1편", "proItem2": "비율 선택: 9:16 / 16:9 / 1:1", "proItem3": "1회 수정 포함", "proItem4": "해상도 선택: 460p / 720p / 1080p / 4K", "priorityWork": "우선 작업", "signatureUse": "광고/쇼릴/브랜드 필름용", "signatureItem1": "시그니처 영상 1편", "signatureItem2": "비율 선택: 9:16 / 16:9 / 1:1", "signatureItem3": "2회 수정 포함", "signatureItem4": "해상도 선택: 460p / 720p / 1080p / 4K", "signatureItem5": "디렉터 스타일 감수", "bestSeller": "Best Seller", "start": "Start", "catPersonal": "Personal Transform", "catBeauty": "Beauty", "catProduct": "Product", "catFood": "Food", "catTravel": "Travel", "catWedding": "Wedding", "catCustom": "Custom", "includedCopy": "영상 길이와 화질 외에도 커머스 영상에 필요한 BGM, 효과음, 자막, 카피, 보이스 여부를 명확히 안내합니다."}, "en": {"startProject": "START PROJECT ↗", "viewShowreel": "VIEW SHOWREEL", "scrollExplore": "SCROLL TO EXPLORE", "heroEyebrow": "THE AI VIDEO VENDING MACHINE", "heroSub": "Premium commercial videos from a single image.", "beforeAfterCopy": "Upload one image and AVVM transforms it into a premium cinematic result.", "demoEyebrow": "IMAGE TO CINEMA", "demoTitle": "FROM ONE IMAGE<br>TO A COMMERCIAL VIDEO.", "demoCopy": "One image expands into a brand-ready commercial video with cinematic cuts, motion, and atmosphere.", "demoChip1": "IMAGE BASED", "demoChip2": "CINEMATIC MOTION", "demoChip3": "COMMERCIAL READY", "watchTransformation": "WATCH TRANSFORMATION ↗", "beautyCopy": "A 15-second beauty ad sample with water texture, light-blue tone, skin close-ups, and product-focused premium skincare mood.", "speedTitle": "AI SPEED.<br>HUMAN FINISH.", "keepTitle": "KEEP THE<br>PRODUCT RIGHT.", "tryTitle": "TRY BEFORE<br>FULL ORDER.", "includedTitle": "WHAT IS<br>INCLUDED?", "portfolioKicker": "Portfolio expansion", "portfolioTitle": "7 SECTORS.<br>ONE ENGINE.", "portfolioCopy": "AVVM expands beyond beauty into automotive, culture, business, events, story, metaverse, and action samples.", "portAuto": "Automotive sample with aerial pursuit, high-speed cornering, and racing energy.", "portHeritage": "Culture and tourism sample combining traditional craftsmanship with futuristic technology.", "portBusiness": "Short business film sample for companies, services, and startups.", "portFestival": "Event sample for fireworks, night events, and regional festivals.", "portStory": "Lifestyle story sample with emotional character and atmosphere.", "portMetaverse": "Metaverse-style sample where local culture connects to a digital network.", "portAction": "Experimental action sample with fight, chase, and high-tension transitions.", "aspectTitle": "Aspect Ratio", "resolutionTitle": "Resolution", "sizeChoiceNote": "Aspect ratio and resolution are selected during order: 9:16 / 16:9 / 1:1 · 460p / 720p / 1080p / 4K", "pricingNote": "Delivery schedule is confirmed after project review. Foreign currency values are estimates only; final payment is processed in KRW.", "consumerKicker": "For everyone · sticker-photo price", "consumerTitle": "ONE PHOTO,<br>NEW WORLD.", "consumerCopy": "Upload one great photo. AVVM turns an ordinary image into a beginner-friendly transformation video with travel, Instagram, and fashion model vibes.", "travelJumpTitle": "Jump to global places", "travelJumpCopy": "Even a seated everyday photo can become a Paris, New York, Santorini, or Tokyo-style travel reel.", "fashionSwitchTitle": "From casual to model look", "fashionSwitchCopy": "Upgrade everyday clothing into a stylish editorial look, including hair, shoes, bag, and accessories.", "walkTransformTitle": "Transform while walking", "walkTransformCopy": "Walk naturally, flip the bag back, turn the head, and the outfit, accessories, hair, and sunglasses change instantly.", "miniCopy": "5s / 1 style / sticker-photo priced trial transform", "basicConsumerCopy": "8s / 1 style / easy SNS-ready transform", "bestConsumerCopy": "10s / travel + fashion mood / stronger TikTok transition", "setConsumerCopy": "3-style set / travel, fashion, and walking transform together", "tryNow": "TRY NOW", "startTransform": "START TRANSFORM", "chooseBest": "CHOOSE BEST", "getSet": "GET SET", "promptBoxTitle": "Hot Transform Styles", "promptBoxCopy": "Easy-to-choose short-form transformation styles inspired by current social video formats.", "prompt1": "Fashion Glow Up: ordinary outfit becomes model-style fashion", "prompt2": "World Travel Transform: one photo becomes a global destination reel", "prompt3": "Bag Flip Walk: flip the bag, turn the head, and the entire look transforms", "starterUse": "For quick short-form ads", "starterItem1": "cinematic video", "starterItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "starterItem3": "Resolution: choose 460p / 720p / 1080p / 4K", "commercialUse": "Commercial use included", "proUse": "For brand and product ads", "proItem1": "premium video", "proItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "proItem3": "1 revision included", "proItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "priorityWork": "Priority production", "signatureUse": "For commercials, showreels and brand films", "signatureItem1": "signature video", "signatureItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "signatureItem3": "2 revisions included", "signatureItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "signatureItem5": "Director-style review", "bestSeller": "Best Seller", "start": "Start", "catPersonal": "Personal Transform", "catBeauty": "Beauty", "catProduct": "Product", "catFood": "Food", "catTravel": "Travel", "catWedding": "Wedding", "catCustom": "Custom", "includedCopy": "Beyond duration and resolution, AVVM clearly shows BGM, SFX, captions, copywriting, voiceover, and revisions."}, "ja": {"heroSub": "1枚の画像からプレミアムなシネマティック動画を制作します。", "beforeAfterCopy": "1枚の画像をアップロードすると、AVVMが広告品質のシネマティックな結果へ変換します。", "demoTitle": "1枚の画像から<br>広告動画へ。", "demoCopy": "One image expands into a brand-ready commercial video with cinematic cuts, motion, and atmosphere.", "beautyCopy": "A 15-second beauty ad sample with water texture, light-blue tone, skin close-ups, and product-focused premium skincare mood.", "consumerCopy": "お気に入りの写真を1枚アップロードするだけ。日常写真が旅行・インスタ感・モデル風動画に変わります。", "travelJumpTitle": "海外名所へジャンプ", "travelJumpCopy": "Even a seated everyday photo can become a Paris, New York, Santorini, or Tokyo-style travel reel.", "fashionSwitchTitle": "日常服からモデルルックへ", "fashionSwitchCopy": "Upgrade everyday clothing into a stylish editorial look, including hair, shoes, bag, and accessories.", "walkTransformTitle": "歩きながら変身", "walkTransformCopy": "Walk naturally, flip the bag back, turn the head, and the outfit, accessories, hair, and sunglasses change instantly.", "aspectTitle": "比率を選択", "resolutionTitle": "解像度を選択", "pricingNote": "Delivery schedule is confirmed after project review. Foreign currency values are estimates only; final payment is processed in KRW.", "sizeChoiceNote": "Aspect ratio and resolution are selected during order: 9:16 / 16:9 / 1:1 · 460p / 720p / 1080p / 4K", "startProject": "START PROJECT ↗", "demoChip1": "IMAGE BASED", "tryTitle": "TRY BEFORE<br>FULL ORDER.", "bestConsumerCopy": "10s / travel + fashion mood / stronger TikTok transition", "signatureUse": "For commercials, showreels and brand films", "portBusiness": "Short business film sample for companies, services, and startups.", "demoChip2": "CINEMATIC MOTION", "proItem3": "1 revision included", "portfolioKicker": "Portfolio expansion", "catWedding": "Wedding", "starterItem1": "cinematic video", "catBeauty": "Beauty", "starterItem3": "Resolution: choose 460p / 720p / 1080p / 4K", "signatureItem1": "signature video", "portFestival": "Event sample for fireworks, night events, and regional festivals.", "watchTransformation": "WATCH TRANSFORMATION ↗", "setConsumerCopy": "3-style set / travel, fashion, and walking transform together", "miniCopy": "5s / 1 style / sticker-photo priced trial transform", "signatureItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "starterItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "getSet": "GET SET", "catCustom": "Custom", "consumerTitle": "ONE PHOTO,<br>NEW WORLD.", "viewShowreel": "VIEW SHOWREEL", "promptBoxCopy": "Easy-to-choose short-form transformation styles inspired by current social video formats.", "demoEyebrow": "IMAGE TO CINEMA", "signatureItem3": "2 revisions included", "starterUse": "For quick short-form ads", "portfolioTitle": "7 SECTORS.<br>ONE ENGINE.", "proUse": "For brand and product ads", "catFood": "Food", "demoChip3": "COMMERCIAL READY", "proItem1": "premium video", "portStory": "Lifestyle story sample with emotional character and atmosphere.", "signatureItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "prompt3": "Bag Flip Walk: flip the bag, turn the head, and the entire look transforms", "consumerKicker": "For everyone · sticker-photo price", "heroEyebrow": "THE AI VIDEO VENDING MACHINE", "proItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "portfolioCopy": "AVVM expands beyond beauty into automotive, culture, business, events, story, metaverse, and action samples.", "prompt1": "Fashion Glow Up: ordinary outfit becomes model-style fashion", "includedTitle": "WHAT IS<br>INCLUDED?", "priorityWork": "Priority production", "keepTitle": "KEEP THE<br>PRODUCT RIGHT.", "scrollExplore": "SCROLL TO EXPLORE", "portHeritage": "Culture and tourism sample combining traditional craftsmanship with futuristic technology.", "catPersonal": "Personal Transform", "tryNow": "TRY NOW", "proItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "startTransform": "START TRANSFORM", "portAction": "Experimental action sample with fight, chase, and high-tension transitions.", "prompt2": "World Travel Transform: one photo becomes a global destination reel", "promptBoxTitle": "Hot Transform Styles", "catProduct": "Product", "speedTitle": "AI SPEED.<br>HUMAN FINISH.", "portAuto": "Automotive sample with aerial pursuit, high-speed cornering, and racing energy.", "chooseBest": "CHOOSE BEST", "bestSeller": "Best Seller", "catTravel": "Travel", "portMetaverse": "Metaverse-style sample where local culture connects to a digital network.", "basicConsumerCopy": "8s / 1 style / easy SNS-ready transform", "signatureItem5": "Director-style review", "commercialUse": "Commercial use included", "start": "Start", "includedCopy": "Beyond duration and resolution, AVVM clearly shows BGM, SFX, captions, copywriting, voiceover, and revisions."}, "zh": {"heroSub": "只需一张图片，即可制作高级电影感商业视频。", "beforeAfterCopy": "上传一张图片，AVVM会将其转换为广告级电影感结果。", "demoTitle": "从一张图片<br>到商业视频。", "demoCopy": "One image expands into a brand-ready commercial video with cinematic cuts, motion, and atmosphere.", "beautyCopy": "A 15-second beauty ad sample with water texture, light-blue tone, skin close-ups, and product-focused premium skincare mood.", "consumerCopy": "只需上传一张好看的照片。普通日常照也能变成旅行、Instagram感和时尚模特氛围的视频。", "travelJumpTitle": "瞬间跳转全球名所", "travelJumpCopy": "Even a seated everyday photo can become a Paris, New York, Santorini, or Tokyo-style travel reel.", "fashionSwitchTitle": "日常穿搭变模特造型", "fashionSwitchCopy": "Upgrade everyday clothing into a stylish editorial look, including hair, shoes, bag, and accessories.", "walkTransformTitle": "边走边瞬间变身", "walkTransformCopy": "Walk naturally, flip the bag back, turn the head, and the outfit, accessories, hair, and sunglasses change instantly.", "aspectTitle": "选择比例", "resolutionTitle": "选择分辨率", "pricingNote": "Delivery schedule is confirmed after project review. Foreign currency values are estimates only; final payment is processed in KRW.", "sizeChoiceNote": "Aspect ratio and resolution are selected during order: 9:16 / 16:9 / 1:1 · 460p / 720p / 1080p / 4K", "startProject": "START PROJECT ↗", "demoChip1": "IMAGE BASED", "tryTitle": "TRY BEFORE<br>FULL ORDER.", "bestConsumerCopy": "10s / travel + fashion mood / stronger TikTok transition", "signatureUse": "For commercials, showreels and brand films", "portBusiness": "Short business film sample for companies, services, and startups.", "demoChip2": "CINEMATIC MOTION", "proItem3": "1 revision included", "portfolioKicker": "Portfolio expansion", "catWedding": "Wedding", "starterItem1": "cinematic video", "catBeauty": "Beauty", "starterItem3": "Resolution: choose 460p / 720p / 1080p / 4K", "signatureItem1": "signature video", "portFestival": "Event sample for fireworks, night events, and regional festivals.", "watchTransformation": "WATCH TRANSFORMATION ↗", "setConsumerCopy": "3-style set / travel, fashion, and walking transform together", "miniCopy": "5s / 1 style / sticker-photo priced trial transform", "signatureItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "starterItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "getSet": "GET SET", "catCustom": "Custom", "consumerTitle": "ONE PHOTO,<br>NEW WORLD.", "viewShowreel": "VIEW SHOWREEL", "promptBoxCopy": "Easy-to-choose short-form transformation styles inspired by current social video formats.", "demoEyebrow": "IMAGE TO CINEMA", "signatureItem3": "2 revisions included", "starterUse": "For quick short-form ads", "portfolioTitle": "7 SECTORS.<br>ONE ENGINE.", "proUse": "For brand and product ads", "catFood": "Food", "demoChip3": "COMMERCIAL READY", "proItem1": "premium video", "portStory": "Lifestyle story sample with emotional character and atmosphere.", "signatureItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "prompt3": "Bag Flip Walk: flip the bag, turn the head, and the entire look transforms", "consumerKicker": "For everyone · sticker-photo price", "heroEyebrow": "THE AI VIDEO VENDING MACHINE", "proItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "portfolioCopy": "AVVM expands beyond beauty into automotive, culture, business, events, story, metaverse, and action samples.", "prompt1": "Fashion Glow Up: ordinary outfit becomes model-style fashion", "includedTitle": "WHAT IS<br>INCLUDED?", "priorityWork": "Priority production", "keepTitle": "KEEP THE<br>PRODUCT RIGHT.", "scrollExplore": "SCROLL TO EXPLORE", "portHeritage": "Culture and tourism sample combining traditional craftsmanship with futuristic technology.", "catPersonal": "Personal Transform", "tryNow": "TRY NOW", "proItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "startTransform": "START TRANSFORM", "portAction": "Experimental action sample with fight, chase, and high-tension transitions.", "prompt2": "World Travel Transform: one photo becomes a global destination reel", "promptBoxTitle": "Hot Transform Styles", "catProduct": "Product", "speedTitle": "AI SPEED.<br>HUMAN FINISH.", "portAuto": "Automotive sample with aerial pursuit, high-speed cornering, and racing energy.", "chooseBest": "CHOOSE BEST", "bestSeller": "Best Seller", "catTravel": "Travel", "portMetaverse": "Metaverse-style sample where local culture connects to a digital network.", "basicConsumerCopy": "8s / 1 style / easy SNS-ready transform", "signatureItem5": "Director-style review", "commercialUse": "Commercial use included", "start": "Start", "includedCopy": "Beyond duration and resolution, AVVM clearly shows BGM, SFX, captions, copywriting, voiceover, and revisions."}, "es": {"startProject": "START PROJECT ↗", "viewShowreel": "VIEW SHOWREEL", "scrollExplore": "SCROLL TO EXPLORE", "heroEyebrow": "THE AI VIDEO VENDING MACHINE", "heroSub": "Videos comerciales premium a partir de una sola imagen.", "beforeAfterCopy": "Upload one image and AVVM transforms it into a premium cinematic result.", "demoEyebrow": "IMAGE TO CINEMA", "demoTitle": "FROM ONE IMAGE<br>TO A COMMERCIAL VIDEO.", "demoCopy": "One image expands into a brand-ready commercial video with cinematic cuts, motion, and atmosphere.", "demoChip1": "IMAGE BASED", "demoChip2": "CINEMATIC MOTION", "demoChip3": "COMMERCIAL READY", "watchTransformation": "WATCH TRANSFORMATION ↗", "beautyCopy": "A 15-second beauty ad sample with water texture, light-blue tone, skin close-ups, and product-focused premium skincare mood.", "speedTitle": "AI SPEED.<br>HUMAN FINISH.", "keepTitle": "KEEP THE<br>PRODUCT RIGHT.", "tryTitle": "TRY BEFORE<br>FULL ORDER.", "includedTitle": "WHAT IS<br>INCLUDED?", "portfolioKicker": "Portfolio expansion", "portfolioTitle": "7 SECTORS.<br>ONE ENGINE.", "portfolioCopy": "AVVM expands beyond beauty into automotive, culture, business, events, story, metaverse, and action samples.", "portAuto": "Automotive sample with aerial pursuit, high-speed cornering, and racing energy.", "portHeritage": "Culture and tourism sample combining traditional craftsmanship with futuristic technology.", "portBusiness": "Short business film sample for companies, services, and startups.", "portFestival": "Event sample for fireworks, night events, and regional festivals.", "portStory": "Lifestyle story sample with emotional character and atmosphere.", "portMetaverse": "Metaverse-style sample where local culture connects to a digital network.", "portAction": "Experimental action sample with fight, chase, and high-tension transitions.", "aspectTitle": "Formato", "resolutionTitle": "Resolución", "sizeChoiceNote": "Aspect ratio and resolution are selected during order: 9:16 / 16:9 / 1:1 · 460p / 720p / 1080p / 4K", "pricingNote": "Delivery schedule is confirmed after project review. Foreign currency values are estimates only; final payment is processed in KRW.", "consumerKicker": "For everyone · sticker-photo price", "consumerTitle": "ONE PHOTO,<br>NEW WORLD.", "consumerCopy": "Upload one great photo. AVVM turns an ordinary image into a beginner-friendly transformation video with travel, Instagram, and fashion model vibes.", "travelJumpTitle": "Jump to global places", "travelJumpCopy": "Even a seated everyday photo can become a Paris, New York, Santorini, or Tokyo-style travel reel.", "fashionSwitchTitle": "From casual to model look", "fashionSwitchCopy": "Upgrade everyday clothing into a stylish editorial look, including hair, shoes, bag, and accessories.", "walkTransformTitle": "Transform while walking", "walkTransformCopy": "Walk naturally, flip the bag back, turn the head, and the outfit, accessories, hair, and sunglasses change instantly.", "miniCopy": "5s / 1 style / sticker-photo priced trial transform", "basicConsumerCopy": "8s / 1 style / easy SNS-ready transform", "bestConsumerCopy": "10s / travel + fashion mood / stronger TikTok transition", "setConsumerCopy": "3-style set / travel, fashion, and walking transform together", "tryNow": "TRY NOW", "startTransform": "START TRANSFORM", "chooseBest": "CHOOSE BEST", "getSet": "GET SET", "promptBoxTitle": "Hot Transform Styles", "promptBoxCopy": "Easy-to-choose short-form transformation styles inspired by current social video formats.", "prompt1": "Fashion Glow Up: ordinary outfit becomes model-style fashion", "prompt2": "World Travel Transform: one photo becomes a global destination reel", "prompt3": "Bag Flip Walk: flip the bag, turn the head, and the entire look transforms", "starterUse": "For quick short-form ads", "starterItem1": "cinematic video", "starterItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "starterItem3": "Resolution: choose 460p / 720p / 1080p / 4K", "commercialUse": "Commercial use included", "proUse": "For brand and product ads", "proItem1": "premium video", "proItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "proItem3": "1 revision included", "proItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "priorityWork": "Priority production", "signatureUse": "For commercials, showreels and brand films", "signatureItem1": "signature video", "signatureItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "signatureItem3": "2 revisions included", "signatureItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "signatureItem5": "Director-style review", "bestSeller": "Best Seller", "start": "Start", "catPersonal": "Personal Transform", "catBeauty": "Beauty", "catProduct": "Product", "catFood": "Food", "catTravel": "Travel", "catWedding": "Wedding", "catCustom": "Custom", "includedCopy": "Beyond duration and resolution, AVVM clearly shows BGM, SFX, captions, copywriting, voiceover, and revisions."}, "fr": {"startProject": "START PROJECT ↗", "viewShowreel": "VIEW SHOWREEL", "scrollExplore": "SCROLL TO EXPLORE", "heroEyebrow": "THE AI VIDEO VENDING MACHINE", "heroSub": "Vidéos commerciales premium à partir d’une seule image.", "beforeAfterCopy": "Upload one image and AVVM transforms it into a premium cinematic result.", "demoEyebrow": "IMAGE TO CINEMA", "demoTitle": "FROM ONE IMAGE<br>TO A COMMERCIAL VIDEO.", "demoCopy": "One image expands into a brand-ready commercial video with cinematic cuts, motion, and atmosphere.", "demoChip1": "IMAGE BASED", "demoChip2": "CINEMATIC MOTION", "demoChip3": "COMMERCIAL READY", "watchTransformation": "WATCH TRANSFORMATION ↗", "beautyCopy": "A 15-second beauty ad sample with water texture, light-blue tone, skin close-ups, and product-focused premium skincare mood.", "speedTitle": "AI SPEED.<br>HUMAN FINISH.", "keepTitle": "KEEP THE<br>PRODUCT RIGHT.", "tryTitle": "TRY BEFORE<br>FULL ORDER.", "includedTitle": "WHAT IS<br>INCLUDED?", "portfolioKicker": "Portfolio expansion", "portfolioTitle": "7 SECTORS.<br>ONE ENGINE.", "portfolioCopy": "AVVM expands beyond beauty into automotive, culture, business, events, story, metaverse, and action samples.", "portAuto": "Automotive sample with aerial pursuit, high-speed cornering, and racing energy.", "portHeritage": "Culture and tourism sample combining traditional craftsmanship with futuristic technology.", "portBusiness": "Short business film sample for companies, services, and startups.", "portFestival": "Event sample for fireworks, night events, and regional festivals.", "portStory": "Lifestyle story sample with emotional character and atmosphere.", "portMetaverse": "Metaverse-style sample where local culture connects to a digital network.", "portAction": "Experimental action sample with fight, chase, and high-tension transitions.", "aspectTitle": "Format", "resolutionTitle": "Résolution", "sizeChoiceNote": "Aspect ratio and resolution are selected during order: 9:16 / 16:9 / 1:1 · 460p / 720p / 1080p / 4K", "pricingNote": "Delivery schedule is confirmed after project review. Foreign currency values are estimates only; final payment is processed in KRW.", "consumerKicker": "For everyone · sticker-photo price", "consumerTitle": "ONE PHOTO,<br>NEW WORLD.", "consumerCopy": "Upload one great photo. AVVM turns an ordinary image into a beginner-friendly transformation video with travel, Instagram, and fashion model vibes.", "travelJumpTitle": "Jump to global places", "travelJumpCopy": "Even a seated everyday photo can become a Paris, New York, Santorini, or Tokyo-style travel reel.", "fashionSwitchTitle": "From casual to model look", "fashionSwitchCopy": "Upgrade everyday clothing into a stylish editorial look, including hair, shoes, bag, and accessories.", "walkTransformTitle": "Transform while walking", "walkTransformCopy": "Walk naturally, flip the bag back, turn the head, and the outfit, accessories, hair, and sunglasses change instantly.", "miniCopy": "5s / 1 style / sticker-photo priced trial transform", "basicConsumerCopy": "8s / 1 style / easy SNS-ready transform", "bestConsumerCopy": "10s / travel + fashion mood / stronger TikTok transition", "setConsumerCopy": "3-style set / travel, fashion, and walking transform together", "tryNow": "TRY NOW", "startTransform": "START TRANSFORM", "chooseBest": "CHOOSE BEST", "getSet": "GET SET", "promptBoxTitle": "Hot Transform Styles", "promptBoxCopy": "Easy-to-choose short-form transformation styles inspired by current social video formats.", "prompt1": "Fashion Glow Up: ordinary outfit becomes model-style fashion", "prompt2": "World Travel Transform: one photo becomes a global destination reel", "prompt3": "Bag Flip Walk: flip the bag, turn the head, and the entire look transforms", "starterUse": "For quick short-form ads", "starterItem1": "cinematic video", "starterItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "starterItem3": "Resolution: choose 460p / 720p / 1080p / 4K", "commercialUse": "Commercial use included", "proUse": "For brand and product ads", "proItem1": "premium video", "proItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "proItem3": "1 revision included", "proItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "priorityWork": "Priority production", "signatureUse": "For commercials, showreels and brand films", "signatureItem1": "signature video", "signatureItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "signatureItem3": "2 revisions included", "signatureItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "signatureItem5": "Director-style review", "bestSeller": "Best Seller", "start": "Start", "catPersonal": "Personal Transform", "catBeauty": "Beauty", "catProduct": "Product", "catFood": "Food", "catTravel": "Travel", "catWedding": "Wedding", "catCustom": "Custom", "includedCopy": "Beyond duration and resolution, AVVM clearly shows BGM, SFX, captions, copywriting, voiceover, and revisions."}, "de": {"startProject": "START PROJECT ↗", "viewShowreel": "VIEW SHOWREEL", "scrollExplore": "SCROLL TO EXPLORE", "heroEyebrow": "THE AI VIDEO VENDING MACHINE", "heroSub": "Premium-Werbevideos aus einem einzigen Bild.", "beforeAfterCopy": "Upload one image and AVVM transforms it into a premium cinematic result.", "demoEyebrow": "IMAGE TO CINEMA", "demoTitle": "FROM ONE IMAGE<br>TO A COMMERCIAL VIDEO.", "demoCopy": "One image expands into a brand-ready commercial video with cinematic cuts, motion, and atmosphere.", "demoChip1": "IMAGE BASED", "demoChip2": "CINEMATIC MOTION", "demoChip3": "COMMERCIAL READY", "watchTransformation": "WATCH TRANSFORMATION ↗", "beautyCopy": "A 15-second beauty ad sample with water texture, light-blue tone, skin close-ups, and product-focused premium skincare mood.", "speedTitle": "AI SPEED.<br>HUMAN FINISH.", "keepTitle": "KEEP THE<br>PRODUCT RIGHT.", "tryTitle": "TRY BEFORE<br>FULL ORDER.", "includedTitle": "WHAT IS<br>INCLUDED?", "portfolioKicker": "Portfolio expansion", "portfolioTitle": "7 SECTORS.<br>ONE ENGINE.", "portfolioCopy": "AVVM expands beyond beauty into automotive, culture, business, events, story, metaverse, and action samples.", "portAuto": "Automotive sample with aerial pursuit, high-speed cornering, and racing energy.", "portHeritage": "Culture and tourism sample combining traditional craftsmanship with futuristic technology.", "portBusiness": "Short business film sample for companies, services, and startups.", "portFestival": "Event sample for fireworks, night events, and regional festivals.", "portStory": "Lifestyle story sample with emotional character and atmosphere.", "portMetaverse": "Metaverse-style sample where local culture connects to a digital network.", "portAction": "Experimental action sample with fight, chase, and high-tension transitions.", "aspectTitle": "Format", "resolutionTitle": "Auflösung", "sizeChoiceNote": "Aspect ratio and resolution are selected during order: 9:16 / 16:9 / 1:1 · 460p / 720p / 1080p / 4K", "pricingNote": "Delivery schedule is confirmed after project review. Foreign currency values are estimates only; final payment is processed in KRW.", "consumerKicker": "For everyone · sticker-photo price", "consumerTitle": "ONE PHOTO,<br>NEW WORLD.", "consumerCopy": "Upload one great photo. AVVM turns an ordinary image into a beginner-friendly transformation video with travel, Instagram, and fashion model vibes.", "travelJumpTitle": "Jump to global places", "travelJumpCopy": "Even a seated everyday photo can become a Paris, New York, Santorini, or Tokyo-style travel reel.", "fashionSwitchTitle": "From casual to model look", "fashionSwitchCopy": "Upgrade everyday clothing into a stylish editorial look, including hair, shoes, bag, and accessories.", "walkTransformTitle": "Transform while walking", "walkTransformCopy": "Walk naturally, flip the bag back, turn the head, and the outfit, accessories, hair, and sunglasses change instantly.", "miniCopy": "5s / 1 style / sticker-photo priced trial transform", "basicConsumerCopy": "8s / 1 style / easy SNS-ready transform", "bestConsumerCopy": "10s / travel + fashion mood / stronger TikTok transition", "setConsumerCopy": "3-style set / travel, fashion, and walking transform together", "tryNow": "TRY NOW", "startTransform": "START TRANSFORM", "chooseBest": "CHOOSE BEST", "getSet": "GET SET", "promptBoxTitle": "Hot Transform Styles", "promptBoxCopy": "Easy-to-choose short-form transformation styles inspired by current social video formats.", "prompt1": "Fashion Glow Up: ordinary outfit becomes model-style fashion", "prompt2": "World Travel Transform: one photo becomes a global destination reel", "prompt3": "Bag Flip Walk: flip the bag, turn the head, and the entire look transforms", "starterUse": "For quick short-form ads", "starterItem1": "cinematic video", "starterItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "starterItem3": "Resolution: choose 460p / 720p / 1080p / 4K", "commercialUse": "Commercial use included", "proUse": "For brand and product ads", "proItem1": "premium video", "proItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "proItem3": "1 revision included", "proItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "priorityWork": "Priority production", "signatureUse": "For commercials, showreels and brand films", "signatureItem1": "signature video", "signatureItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "signatureItem3": "2 revisions included", "signatureItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "signatureItem5": "Director-style review", "bestSeller": "Best Seller", "start": "Start", "catPersonal": "Personal Transform", "catBeauty": "Beauty", "catProduct": "Product", "catFood": "Food", "catTravel": "Travel", "catWedding": "Wedding", "catCustom": "Custom", "includedCopy": "Beyond duration and resolution, AVVM clearly shows BGM, SFX, captions, copywriting, voiceover, and revisions."}, "pt": {"startProject": "START PROJECT ↗", "viewShowreel": "VIEW SHOWREEL", "scrollExplore": "SCROLL TO EXPLORE", "heroEyebrow": "THE AI VIDEO VENDING MACHINE", "heroSub": "Vídeos comerciais premium a partir de uma única imagem.", "beforeAfterCopy": "Upload one image and AVVM transforms it into a premium cinematic result.", "demoEyebrow": "IMAGE TO CINEMA", "demoTitle": "FROM ONE IMAGE<br>TO A COMMERCIAL VIDEO.", "demoCopy": "One image expands into a brand-ready commercial video with cinematic cuts, motion, and atmosphere.", "demoChip1": "IMAGE BASED", "demoChip2": "CINEMATIC MOTION", "demoChip3": "COMMERCIAL READY", "watchTransformation": "WATCH TRANSFORMATION ↗", "beautyCopy": "A 15-second beauty ad sample with water texture, light-blue tone, skin close-ups, and product-focused premium skincare mood.", "speedTitle": "AI SPEED.<br>HUMAN FINISH.", "keepTitle": "KEEP THE<br>PRODUCT RIGHT.", "tryTitle": "TRY BEFORE<br>FULL ORDER.", "includedTitle": "WHAT IS<br>INCLUDED?", "portfolioKicker": "Portfolio expansion", "portfolioTitle": "7 SECTORS.<br>ONE ENGINE.", "portfolioCopy": "AVVM expands beyond beauty into automotive, culture, business, events, story, metaverse, and action samples.", "portAuto": "Automotive sample with aerial pursuit, high-speed cornering, and racing energy.", "portHeritage": "Culture and tourism sample combining traditional craftsmanship with futuristic technology.", "portBusiness": "Short business film sample for companies, services, and startups.", "portFestival": "Event sample for fireworks, night events, and regional festivals.", "portStory": "Lifestyle story sample with emotional character and atmosphere.", "portMetaverse": "Metaverse-style sample where local culture connects to a digital network.", "portAction": "Experimental action sample with fight, chase, and high-tension transitions.", "aspectTitle": "Formato", "resolutionTitle": "Resolução", "sizeChoiceNote": "Aspect ratio and resolution are selected during order: 9:16 / 16:9 / 1:1 · 460p / 720p / 1080p / 4K", "pricingNote": "Delivery schedule is confirmed after project review. Foreign currency values are estimates only; final payment is processed in KRW.", "consumerKicker": "For everyone · sticker-photo price", "consumerTitle": "ONE PHOTO,<br>NEW WORLD.", "consumerCopy": "Upload one great photo. AVVM turns an ordinary image into a beginner-friendly transformation video with travel, Instagram, and fashion model vibes.", "travelJumpTitle": "Jump to global places", "travelJumpCopy": "Even a seated everyday photo can become a Paris, New York, Santorini, or Tokyo-style travel reel.", "fashionSwitchTitle": "From casual to model look", "fashionSwitchCopy": "Upgrade everyday clothing into a stylish editorial look, including hair, shoes, bag, and accessories.", "walkTransformTitle": "Transform while walking", "walkTransformCopy": "Walk naturally, flip the bag back, turn the head, and the outfit, accessories, hair, and sunglasses change instantly.", "miniCopy": "5s / 1 style / sticker-photo priced trial transform", "basicConsumerCopy": "8s / 1 style / easy SNS-ready transform", "bestConsumerCopy": "10s / travel + fashion mood / stronger TikTok transition", "setConsumerCopy": "3-style set / travel, fashion, and walking transform together", "tryNow": "TRY NOW", "startTransform": "START TRANSFORM", "chooseBest": "CHOOSE BEST", "getSet": "GET SET", "promptBoxTitle": "Hot Transform Styles", "promptBoxCopy": "Easy-to-choose short-form transformation styles inspired by current social video formats.", "prompt1": "Fashion Glow Up: ordinary outfit becomes model-style fashion", "prompt2": "World Travel Transform: one photo becomes a global destination reel", "prompt3": "Bag Flip Walk: flip the bag, turn the head, and the entire look transforms", "starterUse": "For quick short-form ads", "starterItem1": "cinematic video", "starterItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "starterItem3": "Resolution: choose 460p / 720p / 1080p / 4K", "commercialUse": "Commercial use included", "proUse": "For brand and product ads", "proItem1": "premium video", "proItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "proItem3": "1 revision included", "proItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "priorityWork": "Priority production", "signatureUse": "For commercials, showreels and brand films", "signatureItem1": "signature video", "signatureItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "signatureItem3": "2 revisions included", "signatureItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "signatureItem5": "Director-style review", "bestSeller": "Best Seller", "start": "Start", "catPersonal": "Personal Transform", "catBeauty": "Beauty", "catProduct": "Product", "catFood": "Food", "catTravel": "Travel", "catWedding": "Wedding", "catCustom": "Custom", "includedCopy": "Beyond duration and resolution, AVVM clearly shows BGM, SFX, captions, copywriting, voiceover, and revisions."}, "ar": {"startProject": "START PROJECT ↗", "viewShowreel": "VIEW SHOWREEL", "scrollExplore": "SCROLL TO EXPLORE", "heroEyebrow": "THE AI VIDEO VENDING MACHINE", "heroSub": "فيديوهات تجارية سينمائية من صورة واحدة.", "beforeAfterCopy": "Upload one image and AVVM transforms it into a premium cinematic result.", "demoEyebrow": "IMAGE TO CINEMA", "demoTitle": "FROM ONE IMAGE<br>TO A COMMERCIAL VIDEO.", "demoCopy": "One image expands into a brand-ready commercial video with cinematic cuts, motion, and atmosphere.", "demoChip1": "IMAGE BASED", "demoChip2": "CINEMATIC MOTION", "demoChip3": "COMMERCIAL READY", "watchTransformation": "WATCH TRANSFORMATION ↗", "beautyCopy": "A 15-second beauty ad sample with water texture, light-blue tone, skin close-ups, and product-focused premium skincare mood.", "speedTitle": "AI SPEED.<br>HUMAN FINISH.", "keepTitle": "KEEP THE<br>PRODUCT RIGHT.", "tryTitle": "TRY BEFORE<br>FULL ORDER.", "includedTitle": "WHAT IS<br>INCLUDED?", "portfolioKicker": "Portfolio expansion", "portfolioTitle": "7 SECTORS.<br>ONE ENGINE.", "portfolioCopy": "AVVM expands beyond beauty into automotive, culture, business, events, story, metaverse, and action samples.", "portAuto": "Automotive sample with aerial pursuit, high-speed cornering, and racing energy.", "portHeritage": "Culture and tourism sample combining traditional craftsmanship with futuristic technology.", "portBusiness": "Short business film sample for companies, services, and startups.", "portFestival": "Event sample for fireworks, night events, and regional festivals.", "portStory": "Lifestyle story sample with emotional character and atmosphere.", "portMetaverse": "Metaverse-style sample where local culture connects to a digital network.", "portAction": "Experimental action sample with fight, chase, and high-tension transitions.", "aspectTitle": "نسبة العرض", "resolutionTitle": "الدقة", "sizeChoiceNote": "Aspect ratio and resolution are selected during order: 9:16 / 16:9 / 1:1 · 460p / 720p / 1080p / 4K", "pricingNote": "Delivery schedule is confirmed after project review. Foreign currency values are estimates only; final payment is processed in KRW.", "consumerKicker": "For everyone · sticker-photo price", "consumerTitle": "ONE PHOTO,<br>NEW WORLD.", "consumerCopy": "Upload one great photo. AVVM turns an ordinary image into a beginner-friendly transformation video with travel, Instagram, and fashion model vibes.", "travelJumpTitle": "Jump to global places", "travelJumpCopy": "Even a seated everyday photo can become a Paris, New York, Santorini, or Tokyo-style travel reel.", "fashionSwitchTitle": "From casual to model look", "fashionSwitchCopy": "Upgrade everyday clothing into a stylish editorial look, including hair, shoes, bag, and accessories.", "walkTransformTitle": "Transform while walking", "walkTransformCopy": "Walk naturally, flip the bag back, turn the head, and the outfit, accessories, hair, and sunglasses change instantly.", "miniCopy": "5s / 1 style / sticker-photo priced trial transform", "basicConsumerCopy": "8s / 1 style / easy SNS-ready transform", "bestConsumerCopy": "10s / travel + fashion mood / stronger TikTok transition", "setConsumerCopy": "3-style set / travel, fashion, and walking transform together", "tryNow": "TRY NOW", "startTransform": "START TRANSFORM", "chooseBest": "CHOOSE BEST", "getSet": "GET SET", "promptBoxTitle": "Hot Transform Styles", "promptBoxCopy": "Easy-to-choose short-form transformation styles inspired by current social video formats.", "prompt1": "Fashion Glow Up: ordinary outfit becomes model-style fashion", "prompt2": "World Travel Transform: one photo becomes a global destination reel", "prompt3": "Bag Flip Walk: flip the bag, turn the head, and the entire look transforms", "starterUse": "For quick short-form ads", "starterItem1": "cinematic video", "starterItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "starterItem3": "Resolution: choose 460p / 720p / 1080p / 4K", "commercialUse": "Commercial use included", "proUse": "For brand and product ads", "proItem1": "premium video", "proItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "proItem3": "1 revision included", "proItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "priorityWork": "Priority production", "signatureUse": "For commercials, showreels and brand films", "signatureItem1": "signature video", "signatureItem2": "Aspect ratio: choose 9:16 / 16:9 / 1:1", "signatureItem3": "2 revisions included", "signatureItem4": "Resolution: choose 460p / 720p / 1080p / 4K", "signatureItem5": "Director-style review", "bestSeller": "Best Seller", "start": "Start", "catPersonal": "Personal Transform", "catBeauty": "Beauty", "catProduct": "Product", "catFood": "Food", "catTravel": "Travel", "catWedding": "Wedding", "catCustom": "Custom", "includedCopy": "Beyond duration and resolution, AVVM clearly shows BGM, SFX, captions, copywriting, voiceover, and revisions."}};
  const AUTO={"ko": {"autoKo1": "AI가 초안을 만들고, 전문가가 상업용 품질로 보정합니다.", "autoKo2": "상품 형태, 로고, 라벨 왜곡을 줄이기 위한 검수 포함.", "autoKo3": "외화는 참고 환산, 실제 결제는 원화(KRW) 기준.", "autoKo4": "avvm.studio 도메인과 사업자 정보 영역 준비.", "autoKo5": "AVVM은 “버튼을 누르자마자 무작위 결과가 나오는 자동툴”이 아닙니다. AI가 빠르게 영상 초안을 만들고, 사람이 상품성·브랜드감·시각적 오류를 확인해 주문 내용 확인 후 상업용 결과물로 납품하는 초고속 AI 제작 스튜디오입니다.", "autoKo6": "주문 방식은 자판기처럼 쉽고 빠르게. 결과물은 전문가 검수 후 납품합니다.", "autoKo7": "AI 렌더링, 스타일 보정, 상품/로고 일관성 체크를 포함한 기본 납품 기준입니다.", "autoKo8": "AI 결과는 이미지 품질과 스타일에 따라 달라질 수 있으며, 상업용 사용 전 최종 확인을 권장합니다.", "autoKo9": "AI 영상에서 가장 큰 불안은 상품 로고, 라벨, 패키지 형태가 무너지는 문제입니다. AVVM은 제품 중심 광고에 맞게 상품 형태, 색감, 브랜드 인상, 라벨 가독성을 우선 검수합니다.", "autoKo10": "라벨·로고가 심하게 왜곡되면 재생성 또는 대체 컷으로 보정합니다.", "autoKo11": "화장품 병, 패키지, 음식, 제품 실루엣이 원본과 다르게 보이지 않도록 확인합니다.", "autoKo12": "예쁜 AI 영상보다 “팔리는 상품 영상”에 필요한 선명도와 신뢰감을 우선합니다.", "autoKo13": "추후에는 자신의 상품 이미지를 올리면 저화질 워터마크 프리뷰를 빠르게 확인하고, 마음에 들 때 본 제작으로 이어지는 체험 공간을 제공할 예정입니다.", "autoKo14": "MVP 단계에서는 샘플 쇼릴과 주문 상담 기반으로 시작하고, 다음 단계에서는 무료 프리뷰 기능을 추가해 결제 전 확신을 높입니다.", "autoKo15": "영상 길이와 화질 외에도 커머스 영상에 필요한 BGM, 효과음, 자막, 카피, 보이스 여부를 명확히 안내합니다.", "autoKo16": "9:16 / 16:9 / 1:1 선택", "autoKo17": "9:16 / 16:9 / 1:1 선택", "autoKo18": "9:16 / 16:9 / 1:1 선택", "autoKo19": "460p / 720p / 1080p / 4K 선택", "autoKo20": "460p / 720p / 1080p / 4K 선택", "autoKo21": "460p / 720p / 1080p / 4K 선택", "autoKo22": "10초", "autoKo23": "10초", "autoKo24": "15초", "autoKo25": "15초", "autoKo26": "30초", "autoKo27": "30초", "autoKo28": "브랜드: AVVM.studio · 서비스 제공: 라라랜드맘 / AVVM", "autoKo29": "사업자등록번호: 347-37-01807 · 통신판매업 신고번호: 제2026-경기파주-2862호", "autoKo30": "주문 흐름이 정상 작동합니다. 실제 결제 연결 전까지는 주문 초안이 브라우저에 저장되고, 주문 파일을 내려받을 수 있습니다.", "autoFinal1": "완성 알림을 카톡/문자로 받고, 링크에서 바로 확인하겠습니다.", "autoFinal2": "완성되면 카톡/문자로 알려드리고, 링크에서 바로 확인할 수 있습니다.", "autoFinal3": "주문 링크 열기", "autoFinal4": "접수됨", "autoFinal5": "제작 대기", "autoFinal6": "검수 중", "autoFinal7": "완성"}, "en": {"autoKo1": "AI creates the draft; a specialist polishes it for commercial quality.", "autoKo2": "Review included to reduce product, logo, and label distortion.", "autoKo3": "Foreign currency is an estimate; final payment is based on KRW.", "autoKo4": "avvm.studio domain and business information area are prepared.", "autoKo5": "AVVM is not a random instant generator. AI creates a draft quickly, and a human reviews product value, brand mood, and visual errors before delivering a commercial-ready result after project review.", "autoKo6": "Ordering is simple and fast like a vending machine. Results are delivered after expert review.", "autoKo7": "The basic workflow includes AI rendering, style polishing, and product/logo consistency checks.", "autoKo8": "AI results may vary by image quality and style. Please review before commercial use.", "autoKo9": "The biggest concern in AI video is distortion of logos, labels, or packaging. AVVM prioritizes product shape, color, brand impression, and label readability.", "autoKo10": "If labels or logos are heavily distorted, we regenerate or replace the shot.", "autoKo11": "We check that bottles, packages, food, and product silhouettes do not drift too far from the original.", "autoKo12": "We prioritize clarity and trust for product videos that sell, not just pretty AI visuals.", "autoKo13": "Later, customers will be able to upload a product image and preview a low-resolution watermarked version before full production.", "autoKo14": "At the MVP stage, we start with sample reels and order consultation; a free preview feature will come next.", "autoKo15": "Beyond duration and resolution, we clearly show BGM, SFX, captions, copy, voiceover, and revision options.", "autoKo16": "Choose 9:16 / 16:9 / 1:1", "autoKo17": "Choose 9:16 / 16:9 / 1:1", "autoKo18": "Choose 9:16 / 16:9 / 1:1", "autoKo19": "Choose 460p / 720p / 1080p / 4K", "autoKo20": "Choose 460p / 720p / 1080p / 4K", "autoKo21": "Choose 460p / 720p / 1080p / 4K", "autoKo22": "Content translated in this section.", "autoKo23": "Content translated in this section.", "autoKo24": "Content translated in this section.", "autoKo25": "Content translated in this section.", "autoKo26": "Content translated in this section.", "autoKo27": "Content translated in this section.", "autoKo28": "Brand: AVVM.studio · Service Provider: 라라랜드맘 / AVVM", "autoKo29": "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호", "autoKo30": "The order flow is working. Until real payment is connected, the order draft is saved in the browser and can be downloaded as a file.", "autoFinal1": "Content translated.", "autoFinal2": "Content translated.", "autoFinal3": "Content translated.", "autoFinal4": "Content translated.", "autoFinal5": "Content translated.", "autoFinal6": "Content translated.", "autoFinal7": "Content translated."}, "ja": {"autoKo1": "AI creates the draft; a specialist polishes it for commercial quality.", "autoKo2": "Review included to reduce product, logo, and label distortion.", "autoKo3": "Foreign currency is an estimate; final payment is based on KRW.", "autoKo4": "avvm.studio domain and business information area are prepared.", "autoKo5": "AVVM is not a random instant generator. AI creates a draft quickly, and a human reviews product value, brand mood, and visual errors before delivering a commercial-ready result after project review.", "autoKo6": "Ordering is simple and fast like a vending machine. Results are delivered after expert review.", "autoKo7": "The basic workflow includes AI rendering, style polishing, and product/logo consistency checks.", "autoKo8": "AI results may vary by image quality and style. Please review before commercial use.", "autoKo9": "The biggest concern in AI video is distortion of logos, labels, or packaging. AVVM prioritizes product shape, color, brand impression, and label readability.", "autoKo10": "If labels or logos are heavily distorted, we regenerate or replace the shot.", "autoKo11": "We check that bottles, packages, food, and product silhouettes do not drift too far from the original.", "autoKo12": "We prioritize clarity and trust for product videos that sell, not just pretty AI visuals.", "autoKo13": "Later, customers will be able to upload a product image and preview a low-resolution watermarked version before full production.", "autoKo14": "At the MVP stage, we start with sample reels and order consultation; a free preview feature will come next.", "autoKo15": "Beyond duration and resolution, we clearly show BGM, SFX, captions, copy, voiceover, and revision options.", "autoKo16": "Choose 9:16 / 16:9 / 1:1", "autoKo17": "Choose 9:16 / 16:9 / 1:1", "autoKo18": "Choose 9:16 / 16:9 / 1:1", "autoKo19": "Choose 460p / 720p / 1080p / 4K", "autoKo20": "Choose 460p / 720p / 1080p / 4K", "autoKo21": "Choose 460p / 720p / 1080p / 4K", "autoKo22": "Content translated in this section.", "autoKo23": "Content translated in this section.", "autoKo24": "Content translated in this section.", "autoKo25": "Content translated in this section.", "autoKo26": "Content translated in this section.", "autoKo27": "Content translated in this section.", "autoKo28": "Brand: AVVM.studio · Service Provider: 라라랜드맘 / AVVM", "autoKo29": "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호", "autoKo30": "The order flow is working. Until real payment is connected, the order draft is saved in the browser and can be downloaded as a file.", "autoFinal1": "Content translated.", "autoFinal2": "Content translated.", "autoFinal3": "Content translated.", "autoFinal4": "Content translated.", "autoFinal5": "Content translated.", "autoFinal6": "Content translated.", "autoFinal7": "Content translated."}, "zh": {"autoKo1": "AI creates the draft; a specialist polishes it for commercial quality.", "autoKo2": "Review included to reduce product, logo, and label distortion.", "autoKo3": "Foreign currency is an estimate; final payment is based on KRW.", "autoKo4": "avvm.studio domain and business information area are prepared.", "autoKo5": "AVVM is not a random instant generator. AI creates a draft quickly, and a human reviews product value, brand mood, and visual errors before delivering a commercial-ready result after project review.", "autoKo6": "Ordering is simple and fast like a vending machine. Results are delivered after expert review.", "autoKo7": "The basic workflow includes AI rendering, style polishing, and product/logo consistency checks.", "autoKo8": "AI results may vary by image quality and style. Please review before commercial use.", "autoKo9": "The biggest concern in AI video is distortion of logos, labels, or packaging. AVVM prioritizes product shape, color, brand impression, and label readability.", "autoKo10": "If labels or logos are heavily distorted, we regenerate or replace the shot.", "autoKo11": "We check that bottles, packages, food, and product silhouettes do not drift too far from the original.", "autoKo12": "We prioritize clarity and trust for product videos that sell, not just pretty AI visuals.", "autoKo13": "Later, customers will be able to upload a product image and preview a low-resolution watermarked version before full production.", "autoKo14": "At the MVP stage, we start with sample reels and order consultation; a free preview feature will come next.", "autoKo15": "Beyond duration and resolution, we clearly show BGM, SFX, captions, copy, voiceover, and revision options.", "autoKo16": "Choose 9:16 / 16:9 / 1:1", "autoKo17": "Choose 9:16 / 16:9 / 1:1", "autoKo18": "Choose 9:16 / 16:9 / 1:1", "autoKo19": "Choose 460p / 720p / 1080p / 4K", "autoKo20": "Choose 460p / 720p / 1080p / 4K", "autoKo21": "Choose 460p / 720p / 1080p / 4K", "autoKo22": "Content translated in this section.", "autoKo23": "Content translated in this section.", "autoKo24": "Content translated in this section.", "autoKo25": "Content translated in this section.", "autoKo26": "Content translated in this section.", "autoKo27": "Content translated in this section.", "autoKo28": "Brand: AVVM.studio · Service Provider: 라라랜드맘 / AVVM", "autoKo29": "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호", "autoKo30": "The order flow is working. Until real payment is connected, the order draft is saved in the browser and can be downloaded as a file.", "autoFinal1": "Content translated.", "autoFinal2": "Content translated.", "autoFinal3": "Content translated.", "autoFinal4": "Content translated.", "autoFinal5": "Content translated.", "autoFinal6": "Content translated.", "autoFinal7": "Content translated."}, "es": {"autoKo1": "AI creates the draft; a specialist polishes it for commercial quality.", "autoKo2": "Review included to reduce product, logo, and label distortion.", "autoKo3": "Foreign currency is an estimate; final payment is based on KRW.", "autoKo4": "avvm.studio domain and business information area are prepared.", "autoKo5": "AVVM is not a random instant generator. AI creates a draft quickly, and a human reviews product value, brand mood, and visual errors before delivering a commercial-ready result after project review.", "autoKo6": "Ordering is simple and fast like a vending machine. Results are delivered after expert review.", "autoKo7": "The basic workflow includes AI rendering, style polishing, and product/logo consistency checks.", "autoKo8": "AI results may vary by image quality and style. Please review before commercial use.", "autoKo9": "The biggest concern in AI video is distortion of logos, labels, or packaging. AVVM prioritizes product shape, color, brand impression, and label readability.", "autoKo10": "If labels or logos are heavily distorted, we regenerate or replace the shot.", "autoKo11": "We check that bottles, packages, food, and product silhouettes do not drift too far from the original.", "autoKo12": "We prioritize clarity and trust for product videos that sell, not just pretty AI visuals.", "autoKo13": "Later, customers will be able to upload a product image and preview a low-resolution watermarked version before full production.", "autoKo14": "At the MVP stage, we start with sample reels and order consultation; a free preview feature will come next.", "autoKo15": "Beyond duration and resolution, we clearly show BGM, SFX, captions, copy, voiceover, and revision options.", "autoKo16": "Choose 9:16 / 16:9 / 1:1", "autoKo17": "Choose 9:16 / 16:9 / 1:1", "autoKo18": "Choose 9:16 / 16:9 / 1:1", "autoKo19": "Choose 460p / 720p / 1080p / 4K", "autoKo20": "Choose 460p / 720p / 1080p / 4K", "autoKo21": "Choose 460p / 720p / 1080p / 4K", "autoKo22": "Content translated in this section.", "autoKo23": "Content translated in this section.", "autoKo24": "Content translated in this section.", "autoKo25": "Content translated in this section.", "autoKo26": "Content translated in this section.", "autoKo27": "Content translated in this section.", "autoKo28": "Brand: AVVM.studio · Service Provider: 라라랜드맘 / AVVM", "autoKo29": "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호", "autoKo30": "The order flow is working. Until real payment is connected, the order draft is saved in the browser and can be downloaded as a file.", "autoFinal1": "Content translated.", "autoFinal2": "Content translated.", "autoFinal3": "Content translated.", "autoFinal4": "Content translated.", "autoFinal5": "Content translated.", "autoFinal6": "Content translated.", "autoFinal7": "Content translated."}, "fr": {"autoKo1": "AI creates the draft; a specialist polishes it for commercial quality.", "autoKo2": "Review included to reduce product, logo, and label distortion.", "autoKo3": "Foreign currency is an estimate; final payment is based on KRW.", "autoKo4": "avvm.studio domain and business information area are prepared.", "autoKo5": "AVVM is not a random instant generator. AI creates a draft quickly, and a human reviews product value, brand mood, and visual errors before delivering a commercial-ready result after project review.", "autoKo6": "Ordering is simple and fast like a vending machine. Results are delivered after expert review.", "autoKo7": "The basic workflow includes AI rendering, style polishing, and product/logo consistency checks.", "autoKo8": "AI results may vary by image quality and style. Please review before commercial use.", "autoKo9": "The biggest concern in AI video is distortion of logos, labels, or packaging. AVVM prioritizes product shape, color, brand impression, and label readability.", "autoKo10": "If labels or logos are heavily distorted, we regenerate or replace the shot.", "autoKo11": "We check that bottles, packages, food, and product silhouettes do not drift too far from the original.", "autoKo12": "We prioritize clarity and trust for product videos that sell, not just pretty AI visuals.", "autoKo13": "Later, customers will be able to upload a product image and preview a low-resolution watermarked version before full production.", "autoKo14": "At the MVP stage, we start with sample reels and order consultation; a free preview feature will come next.", "autoKo15": "Beyond duration and resolution, we clearly show BGM, SFX, captions, copy, voiceover, and revision options.", "autoKo16": "Choose 9:16 / 16:9 / 1:1", "autoKo17": "Choose 9:16 / 16:9 / 1:1", "autoKo18": "Choose 9:16 / 16:9 / 1:1", "autoKo19": "Choose 460p / 720p / 1080p / 4K", "autoKo20": "Choose 460p / 720p / 1080p / 4K", "autoKo21": "Choose 460p / 720p / 1080p / 4K", "autoKo22": "Content translated in this section.", "autoKo23": "Content translated in this section.", "autoKo24": "Content translated in this section.", "autoKo25": "Content translated in this section.", "autoKo26": "Content translated in this section.", "autoKo27": "Content translated in this section.", "autoKo28": "Brand: AVVM.studio · Service Provider: 라라랜드맘 / AVVM", "autoKo29": "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호", "autoKo30": "The order flow is working. Until real payment is connected, the order draft is saved in the browser and can be downloaded as a file.", "autoFinal1": "Content translated.", "autoFinal2": "Content translated.", "autoFinal3": "Content translated.", "autoFinal4": "Content translated.", "autoFinal5": "Content translated.", "autoFinal6": "Content translated.", "autoFinal7": "Content translated."}, "de": {"autoKo1": "AI creates the draft; a specialist polishes it for commercial quality.", "autoKo2": "Review included to reduce product, logo, and label distortion.", "autoKo3": "Foreign currency is an estimate; final payment is based on KRW.", "autoKo4": "avvm.studio domain and business information area are prepared.", "autoKo5": "AVVM is not a random instant generator. AI creates a draft quickly, and a human reviews product value, brand mood, and visual errors before delivering a commercial-ready result after project review.", "autoKo6": "Ordering is simple and fast like a vending machine. Results are delivered after expert review.", "autoKo7": "The basic workflow includes AI rendering, style polishing, and product/logo consistency checks.", "autoKo8": "AI results may vary by image quality and style. Please review before commercial use.", "autoKo9": "The biggest concern in AI video is distortion of logos, labels, or packaging. AVVM prioritizes product shape, color, brand impression, and label readability.", "autoKo10": "If labels or logos are heavily distorted, we regenerate or replace the shot.", "autoKo11": "We check that bottles, packages, food, and product silhouettes do not drift too far from the original.", "autoKo12": "We prioritize clarity and trust for product videos that sell, not just pretty AI visuals.", "autoKo13": "Later, customers will be able to upload a product image and preview a low-resolution watermarked version before full production.", "autoKo14": "At the MVP stage, we start with sample reels and order consultation; a free preview feature will come next.", "autoKo15": "Beyond duration and resolution, we clearly show BGM, SFX, captions, copy, voiceover, and revision options.", "autoKo16": "Choose 9:16 / 16:9 / 1:1", "autoKo17": "Choose 9:16 / 16:9 / 1:1", "autoKo18": "Choose 9:16 / 16:9 / 1:1", "autoKo19": "Choose 460p / 720p / 1080p / 4K", "autoKo20": "Choose 460p / 720p / 1080p / 4K", "autoKo21": "Choose 460p / 720p / 1080p / 4K", "autoKo22": "Content translated in this section.", "autoKo23": "Content translated in this section.", "autoKo24": "Content translated in this section.", "autoKo25": "Content translated in this section.", "autoKo26": "Content translated in this section.", "autoKo27": "Content translated in this section.", "autoKo28": "Brand: AVVM.studio · Service Provider: 라라랜드맘 / AVVM", "autoKo29": "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호", "autoKo30": "The order flow is working. Until real payment is connected, the order draft is saved in the browser and can be downloaded as a file.", "autoFinal1": "Content translated.", "autoFinal2": "Content translated.", "autoFinal3": "Content translated.", "autoFinal4": "Content translated.", "autoFinal5": "Content translated.", "autoFinal6": "Content translated.", "autoFinal7": "Content translated."}, "pt": {"autoKo1": "AI creates the draft; a specialist polishes it for commercial quality.", "autoKo2": "Review included to reduce product, logo, and label distortion.", "autoKo3": "Foreign currency is an estimate; final payment is based on KRW.", "autoKo4": "avvm.studio domain and business information area are prepared.", "autoKo5": "AVVM is not a random instant generator. AI creates a draft quickly, and a human reviews product value, brand mood, and visual errors before delivering a commercial-ready result after project review.", "autoKo6": "Ordering is simple and fast like a vending machine. Results are delivered after expert review.", "autoKo7": "The basic workflow includes AI rendering, style polishing, and product/logo consistency checks.", "autoKo8": "AI results may vary by image quality and style. Please review before commercial use.", "autoKo9": "The biggest concern in AI video is distortion of logos, labels, or packaging. AVVM prioritizes product shape, color, brand impression, and label readability.", "autoKo10": "If labels or logos are heavily distorted, we regenerate or replace the shot.", "autoKo11": "We check that bottles, packages, food, and product silhouettes do not drift too far from the original.", "autoKo12": "We prioritize clarity and trust for product videos that sell, not just pretty AI visuals.", "autoKo13": "Later, customers will be able to upload a product image and preview a low-resolution watermarked version before full production.", "autoKo14": "At the MVP stage, we start with sample reels and order consultation; a free preview feature will come next.", "autoKo15": "Beyond duration and resolution, we clearly show BGM, SFX, captions, copy, voiceover, and revision options.", "autoKo16": "Choose 9:16 / 16:9 / 1:1", "autoKo17": "Choose 9:16 / 16:9 / 1:1", "autoKo18": "Choose 9:16 / 16:9 / 1:1", "autoKo19": "Choose 460p / 720p / 1080p / 4K", "autoKo20": "Choose 460p / 720p / 1080p / 4K", "autoKo21": "Choose 460p / 720p / 1080p / 4K", "autoKo22": "Content translated in this section.", "autoKo23": "Content translated in this section.", "autoKo24": "Content translated in this section.", "autoKo25": "Content translated in this section.", "autoKo26": "Content translated in this section.", "autoKo27": "Content translated in this section.", "autoKo28": "Brand: AVVM.studio · Service Provider: 라라랜드맘 / AVVM", "autoKo29": "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호", "autoKo30": "The order flow is working. Until real payment is connected, the order draft is saved in the browser and can be downloaded as a file.", "autoFinal1": "Content translated.", "autoFinal2": "Content translated.", "autoFinal3": "Content translated.", "autoFinal4": "Content translated.", "autoFinal5": "Content translated.", "autoFinal6": "Content translated.", "autoFinal7": "Content translated."}, "ar": {"autoKo1": "AI creates the draft; a specialist polishes it for commercial quality.", "autoKo2": "Review included to reduce product, logo, and label distortion.", "autoKo3": "Foreign currency is an estimate; final payment is based on KRW.", "autoKo4": "avvm.studio domain and business information area are prepared.", "autoKo5": "AVVM is not a random instant generator. AI creates a draft quickly, and a human reviews product value, brand mood, and visual errors before delivering a commercial-ready result after project review.", "autoKo6": "Ordering is simple and fast like a vending machine. Results are delivered after expert review.", "autoKo7": "The basic workflow includes AI rendering, style polishing, and product/logo consistency checks.", "autoKo8": "AI results may vary by image quality and style. Please review before commercial use.", "autoKo9": "The biggest concern in AI video is distortion of logos, labels, or packaging. AVVM prioritizes product shape, color, brand impression, and label readability.", "autoKo10": "If labels or logos are heavily distorted, we regenerate or replace the shot.", "autoKo11": "We check that bottles, packages, food, and product silhouettes do not drift too far from the original.", "autoKo12": "We prioritize clarity and trust for product videos that sell, not just pretty AI visuals.", "autoKo13": "Later, customers will be able to upload a product image and preview a low-resolution watermarked version before full production.", "autoKo14": "At the MVP stage, we start with sample reels and order consultation; a free preview feature will come next.", "autoKo15": "Beyond duration and resolution, we clearly show BGM, SFX, captions, copy, voiceover, and revision options.", "autoKo16": "Choose 9:16 / 16:9 / 1:1", "autoKo17": "Choose 9:16 / 16:9 / 1:1", "autoKo18": "Choose 9:16 / 16:9 / 1:1", "autoKo19": "Choose 460p / 720p / 1080p / 4K", "autoKo20": "Choose 460p / 720p / 1080p / 4K", "autoKo21": "Choose 460p / 720p / 1080p / 4K", "autoKo22": "Content translated in this section.", "autoKo23": "Content translated in this section.", "autoKo24": "Content translated in this section.", "autoKo25": "Content translated in this section.", "autoKo26": "Content translated in this section.", "autoKo27": "Content translated in this section.", "autoKo28": "Brand: AVVM.studio · Service Provider: 라라랜드맘 / AVVM", "autoKo29": "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호", "autoKo30": "The order flow is working. Until real payment is connected, the order draft is saved in the browser and can be downloaded as a file.", "autoFinal1": "Content translated.", "autoFinal2": "Content translated.", "autoFinal3": "Content translated.", "autoFinal4": "Content translated.", "autoFinal5": "Content translated.", "autoFinal6": "Content translated.", "autoFinal7": "Content translated."}};
  const HELP={"ko": {"help1": "프로젝트 시작: 이미지 업로드와 주문 정보를 입력합니다.", "help2": "사진을 올리고 원하는 스타일을 선택하면 주문 흐름이 시작됩니다.", "help3": "AVVM 샘플 영상을 크게 확인합니다.", "help4": "왼쪽은 입력 이미지, 오른쪽은 시네마틱 결과 예시입니다.", "help5": "사진을 올리고 원하는 스타일을 선택하면 주문 흐름이 시작됩니다.", "help6": "즉시 완성형 자동툴이 아니라, AI 초안 생성 후 사람이 품질을 확인하는 제작 서비스입니다.", "help7": "제품 로고와 형태가 무너지는 AI 특유의 오류를 줄이기 위해 최종 검수 과정을 둡니다.", "help8": "외화 표시는 참고용이며 실제 결제와 환불 기준은 원화입니다.", "help9": "정식 도메인과 사업자 정보 공개로 결제 신뢰도를 높입니다.", "help10": "사진 한 장이 영화 장면으로 변환되는 데모를 재생합니다.", "help11": "입력 이미지가 영화 장면으로 변환되는 대표 데모입니다.", "help12": "액션 변환 샘플을 크게 봅니다.", "help13": "뷰티/스킨케어 광고 샘플 영상을 재생합니다.", "help14": "15초 뷰티 광고 샘플입니다. 물결, 제품, 피부 클로즈업 흐름을 확인하세요.", "help15": "뷰티 샘플 영상을 크게 봅니다.", "help16": "자판기라는 이름은 주문이 쉽다는 뜻입니다. 결과물은 검수 후 전달됩니다.", "help17": "AI가 만든 결과에서 어색한 손, 글자 깨짐, 상품 왜곡 같은 문제를 확인합니다.", "help18": "고객이 올린 이미지를 기반으로 하지만, AI 특성상 100% 동일 복제는 보장하지 않습니다.", "help19": "정식 자동 프리뷰 기능은 추후 개발 예정입니다. 현재는 주문 후 검수 방식입니다.", "help20": "F1 레이싱과 공중 추적 드라이브 샘플입니다. 자동차/스포츠 브랜드용입니다.", "help21": "전통 장인 이미지가 미래 도시 무드로 확장되는 문화/관광용 샘플입니다.", "help22": "기업 홍보, 스타트업 소개, 서비스 소개 영상으로 활용할 수 있습니다.", "help23": "축제, 지역행사, 이벤트 프로모션 샘플입니다.", "help24": "감성 드라마, 라이프스타일, 브랜드 스토리용 영상 샘플입니다.", "help25": "경북/첨성대/한반도 네트워크 같은 문화 메타버스 확장 샘플입니다.", "help26": "강한 액션감과 실험적인 장면 전환 테스트입니다. 하단 확장 포트폴리오용입니다.", "help27": "10초 숏폼 영상. 빠른 테스트와 SNS 광고에 적합합니다.", "help28": "15초 프리미엄 영상. 브랜드와 제품 광고에 가장 추천합니다.", "help29": "30초 시그니처 영상. 쇼릴, 브랜드 필름, 고급 광고용입니다.", "help30": "입력한 주문 정보를 확인하고 테스트 주문을 접수합니다. 실제 결제 연결 전까지는 테스트 접수입니다."}, "en": {"help1": "Tap this item to see how the feature works.", "help2": "Tap this item to see how the feature works.", "help3": "Tap this item to see how the feature works.", "help4": "Tap this item to see how the feature works.", "help5": "Tap this item to see how the feature works.", "help6": "Tap this item to see how the feature works.", "help7": "Tap this item to see how the feature works.", "help8": "Tap this item to see how the feature works.", "help9": "Tap this item to see how the feature works.", "help10": "Tap this item to see how the feature works.", "help11": "Tap this item to see how the feature works.", "help12": "Tap this item to see how the feature works.", "help13": "Tap this item to see how the feature works.", "help14": "Tap this item to see how the feature works.", "help15": "Tap this item to see how the feature works.", "help16": "Tap this item to see how the feature works.", "help17": "Tap this item to see how the feature works.", "help18": "Tap this item to see how the feature works.", "help19": "Tap this item to see how the feature works.", "help20": "Tap this item to see how the feature works.", "help21": "Tap this item to see how the feature works.", "help22": "Tap this item to see how the feature works.", "help23": "Tap this item to see how the feature works.", "help24": "Tap this item to see how the feature works.", "help25": "Tap this item to see how the feature works.", "help26": "Tap this item to see how the feature works.", "help27": "Tap this item to see how the feature works.", "help28": "Tap this item to see how the feature works.", "help29": "Tap this item to see how the feature works.", "help30": "Tap this item to see how the feature works."}, "ja": {"help1": "Tap this item to see how the feature works.", "help2": "Tap this item to see how the feature works.", "help3": "Tap this item to see how the feature works.", "help4": "Tap this item to see how the feature works.", "help5": "Tap this item to see how the feature works.", "help6": "Tap this item to see how the feature works.", "help7": "Tap this item to see how the feature works.", "help8": "Tap this item to see how the feature works.", "help9": "Tap this item to see how the feature works.", "help10": "Tap this item to see how the feature works.", "help11": "Tap this item to see how the feature works.", "help12": "Tap this item to see how the feature works.", "help13": "Tap this item to see how the feature works.", "help14": "Tap this item to see how the feature works.", "help15": "Tap this item to see how the feature works.", "help16": "Tap this item to see how the feature works.", "help17": "Tap this item to see how the feature works.", "help18": "Tap this item to see how the feature works.", "help19": "Tap this item to see how the feature works.", "help20": "Tap this item to see how the feature works.", "help21": "Tap this item to see how the feature works.", "help22": "Tap this item to see how the feature works.", "help23": "Tap this item to see how the feature works.", "help24": "Tap this item to see how the feature works.", "help25": "Tap this item to see how the feature works.", "help26": "Tap this item to see how the feature works.", "help27": "Tap this item to see how the feature works.", "help28": "Tap this item to see how the feature works.", "help29": "Tap this item to see how the feature works.", "help30": "Tap this item to see how the feature works."}, "zh": {"help1": "Tap this item to see how the feature works.", "help2": "Tap this item to see how the feature works.", "help3": "Tap this item to see how the feature works.", "help4": "Tap this item to see how the feature works.", "help5": "Tap this item to see how the feature works.", "help6": "Tap this item to see how the feature works.", "help7": "Tap this item to see how the feature works.", "help8": "Tap this item to see how the feature works.", "help9": "Tap this item to see how the feature works.", "help10": "Tap this item to see how the feature works.", "help11": "Tap this item to see how the feature works.", "help12": "Tap this item to see how the feature works.", "help13": "Tap this item to see how the feature works.", "help14": "Tap this item to see how the feature works.", "help15": "Tap this item to see how the feature works.", "help16": "Tap this item to see how the feature works.", "help17": "Tap this item to see how the feature works.", "help18": "Tap this item to see how the feature works.", "help19": "Tap this item to see how the feature works.", "help20": "Tap this item to see how the feature works.", "help21": "Tap this item to see how the feature works.", "help22": "Tap this item to see how the feature works.", "help23": "Tap this item to see how the feature works.", "help24": "Tap this item to see how the feature works.", "help25": "Tap this item to see how the feature works.", "help26": "Tap this item to see how the feature works.", "help27": "Tap this item to see how the feature works.", "help28": "Tap this item to see how the feature works.", "help29": "Tap this item to see how the feature works.", "help30": "Tap this item to see how the feature works."}, "es": {"help1": "Tap this item to see how the feature works.", "help2": "Tap this item to see how the feature works.", "help3": "Tap this item to see how the feature works.", "help4": "Tap this item to see how the feature works.", "help5": "Tap this item to see how the feature works.", "help6": "Tap this item to see how the feature works.", "help7": "Tap this item to see how the feature works.", "help8": "Tap this item to see how the feature works.", "help9": "Tap this item to see how the feature works.", "help10": "Tap this item to see how the feature works.", "help11": "Tap this item to see how the feature works.", "help12": "Tap this item to see how the feature works.", "help13": "Tap this item to see how the feature works.", "help14": "Tap this item to see how the feature works.", "help15": "Tap this item to see how the feature works.", "help16": "Tap this item to see how the feature works.", "help17": "Tap this item to see how the feature works.", "help18": "Tap this item to see how the feature works.", "help19": "Tap this item to see how the feature works.", "help20": "Tap this item to see how the feature works.", "help21": "Tap this item to see how the feature works.", "help22": "Tap this item to see how the feature works.", "help23": "Tap this item to see how the feature works.", "help24": "Tap this item to see how the feature works.", "help25": "Tap this item to see how the feature works.", "help26": "Tap this item to see how the feature works.", "help27": "Tap this item to see how the feature works.", "help28": "Tap this item to see how the feature works.", "help29": "Tap this item to see how the feature works.", "help30": "Tap this item to see how the feature works."}, "fr": {"help1": "Tap this item to see how the feature works.", "help2": "Tap this item to see how the feature works.", "help3": "Tap this item to see how the feature works.", "help4": "Tap this item to see how the feature works.", "help5": "Tap this item to see how the feature works.", "help6": "Tap this item to see how the feature works.", "help7": "Tap this item to see how the feature works.", "help8": "Tap this item to see how the feature works.", "help9": "Tap this item to see how the feature works.", "help10": "Tap this item to see how the feature works.", "help11": "Tap this item to see how the feature works.", "help12": "Tap this item to see how the feature works.", "help13": "Tap this item to see how the feature works.", "help14": "Tap this item to see how the feature works.", "help15": "Tap this item to see how the feature works.", "help16": "Tap this item to see how the feature works.", "help17": "Tap this item to see how the feature works.", "help18": "Tap this item to see how the feature works.", "help19": "Tap this item to see how the feature works.", "help20": "Tap this item to see how the feature works.", "help21": "Tap this item to see how the feature works.", "help22": "Tap this item to see how the feature works.", "help23": "Tap this item to see how the feature works.", "help24": "Tap this item to see how the feature works.", "help25": "Tap this item to see how the feature works.", "help26": "Tap this item to see how the feature works.", "help27": "Tap this item to see how the feature works.", "help28": "Tap this item to see how the feature works.", "help29": "Tap this item to see how the feature works.", "help30": "Tap this item to see how the feature works."}, "de": {"help1": "Tap this item to see how the feature works.", "help2": "Tap this item to see how the feature works.", "help3": "Tap this item to see how the feature works.", "help4": "Tap this item to see how the feature works.", "help5": "Tap this item to see how the feature works.", "help6": "Tap this item to see how the feature works.", "help7": "Tap this item to see how the feature works.", "help8": "Tap this item to see how the feature works.", "help9": "Tap this item to see how the feature works.", "help10": "Tap this item to see how the feature works.", "help11": "Tap this item to see how the feature works.", "help12": "Tap this item to see how the feature works.", "help13": "Tap this item to see how the feature works.", "help14": "Tap this item to see how the feature works.", "help15": "Tap this item to see how the feature works.", "help16": "Tap this item to see how the feature works.", "help17": "Tap this item to see how the feature works.", "help18": "Tap this item to see how the feature works.", "help19": "Tap this item to see how the feature works.", "help20": "Tap this item to see how the feature works.", "help21": "Tap this item to see how the feature works.", "help22": "Tap this item to see how the feature works.", "help23": "Tap this item to see how the feature works.", "help24": "Tap this item to see how the feature works.", "help25": "Tap this item to see how the feature works.", "help26": "Tap this item to see how the feature works.", "help27": "Tap this item to see how the feature works.", "help28": "Tap this item to see how the feature works.", "help29": "Tap this item to see how the feature works.", "help30": "Tap this item to see how the feature works."}, "pt": {"help1": "Tap this item to see how the feature works.", "help2": "Tap this item to see how the feature works.", "help3": "Tap this item to see how the feature works.", "help4": "Tap this item to see how the feature works.", "help5": "Tap this item to see how the feature works.", "help6": "Tap this item to see how the feature works.", "help7": "Tap this item to see how the feature works.", "help8": "Tap this item to see how the feature works.", "help9": "Tap this item to see how the feature works.", "help10": "Tap this item to see how the feature works.", "help11": "Tap this item to see how the feature works.", "help12": "Tap this item to see how the feature works.", "help13": "Tap this item to see how the feature works.", "help14": "Tap this item to see how the feature works.", "help15": "Tap this item to see how the feature works.", "help16": "Tap this item to see how the feature works.", "help17": "Tap this item to see how the feature works.", "help18": "Tap this item to see how the feature works.", "help19": "Tap this item to see how the feature works.", "help20": "Tap this item to see how the feature works.", "help21": "Tap this item to see how the feature works.", "help22": "Tap this item to see how the feature works.", "help23": "Tap this item to see how the feature works.", "help24": "Tap this item to see how the feature works.", "help25": "Tap this item to see how the feature works.", "help26": "Tap this item to see how the feature works.", "help27": "Tap this item to see how the feature works.", "help28": "Tap this item to see how the feature works.", "help29": "Tap this item to see how the feature works.", "help30": "Tap this item to see how the feature works."}, "ar": {"help1": "Tap this item to see how the feature works.", "help2": "Tap this item to see how the feature works.", "help3": "Tap this item to see how the feature works.", "help4": "Tap this item to see how the feature works.", "help5": "Tap this item to see how the feature works.", "help6": "Tap this item to see how the feature works.", "help7": "Tap this item to see how the feature works.", "help8": "Tap this item to see how the feature works.", "help9": "Tap this item to see how the feature works.", "help10": "Tap this item to see how the feature works.", "help11": "Tap this item to see how the feature works.", "help12": "Tap this item to see how the feature works.", "help13": "Tap this item to see how the feature works.", "help14": "Tap this item to see how the feature works.", "help15": "Tap this item to see how the feature works.", "help16": "Tap this item to see how the feature works.", "help17": "Tap this item to see how the feature works.", "help18": "Tap this item to see how the feature works.", "help19": "Tap this item to see how the feature works.", "help20": "Tap this item to see how the feature works.", "help21": "Tap this item to see how the feature works.", "help22": "Tap this item to see how the feature works.", "help23": "Tap this item to see how the feature works.", "help24": "Tap this item to see how the feature works.", "help25": "Tap this item to see how the feature works.", "help26": "Tap this item to see how the feature works.", "help27": "Tap this item to see how the feature works.", "help28": "Tap this item to see how the feature works.", "help29": "Tap this item to see how the feature works.", "help30": "Tap this item to see how the feature works."}};
  const ORDER={"ko": {"phone": "휴대폰 번호 / 카톡·문자 알림", "notify": "완성 알림을 카톡/문자로 받고, 링크에서 바로 확인하겠습니다.", "orderCopy": "완성되면 카톡/문자로 알려드리고, 링크에서 바로 확인할 수 있습니다.", "orderLink": "주문 링크 열기"}, "en": {"phone": "Mobile number / Kakao or SMS alert", "notify": "I agree to receive order and delivery alerts by Kakao/SMS and view the video by link.", "orderCopy": "When it is ready, we will send a Kakao/SMS alert so you can view it by link.", "orderLink": "Open order link"}, "ja": {"phone": "Mobile number / Kakao or SMS alert", "notify": "I agree to receive order and delivery alerts by Kakao/SMS and view the video by link.", "orderCopy": "When it is ready, we will send a Kakao/SMS alert so you can view it by link.", "orderLink": "Open order link"}, "zh": {"phone": "Mobile number / Kakao or SMS alert", "notify": "I agree to receive order and delivery alerts by Kakao/SMS and view the video by link.", "orderCopy": "When it is ready, we will send a Kakao/SMS alert so you can view it by link.", "orderLink": "Open order link"}, "es": {"phone": "Mobile number / Kakao or SMS alert", "notify": "I agree to receive order and delivery alerts by Kakao/SMS and view the video by link.", "orderCopy": "When it is ready, we will send a Kakao/SMS alert so you can view it by link.", "orderLink": "Open order link"}, "fr": {"phone": "Mobile number / Kakao or SMS alert", "notify": "I agree to receive order and delivery alerts by Kakao/SMS and view the video by link.", "orderCopy": "When it is ready, we will send a Kakao/SMS alert so you can view it by link.", "orderLink": "Open order link"}, "de": {"phone": "Mobile number / Kakao or SMS alert", "notify": "I agree to receive order and delivery alerts by Kakao/SMS and view the video by link.", "orderCopy": "When it is ready, we will send a Kakao/SMS alert so you can view it by link.", "orderLink": "Open order link"}, "pt": {"phone": "Mobile number / Kakao or SMS alert", "notify": "I agree to receive order and delivery alerts by Kakao/SMS and view the video by link.", "orderCopy": "When it is ready, we will send a Kakao/SMS alert so you can view it by link.", "orderLink": "Open order link"}, "ar": {"phone": "Mobile number / Kakao or SMS alert", "notify": "I agree to receive order and delivery alerts by Kakao/SMS and view the video by link.", "orderCopy": "When it is ready, we will send a Kakao/SMS alert so you can view it by link.", "orderLink": "Open order link"}};
  const SECONDS={ko:"초",en:"s",ja:"秒",zh:"秒",es:"s",fr:"s",de:"Sek.",pt:"s",ar:"ث"};

  // Programmatic additions to I18N for the order modal headers
  I18N.ko.modalEyebrow = "프로젝트 시작";
  I18N.ko.modalTitle = "이미지 등록.<br>스타트 클릭.";
  I18N.en.modalEyebrow = "START PROJECT";
  I18N.en.modalTitle = "INSERT IMAGE.<br>PRESS START.";
  I18N.ja.modalEyebrow = "プロジェクト開始";
  I18N.ja.modalTitle = "画像を挿入。<br>スタートを押す。";
  I18N.zh.modalEyebrow = "开始项目";
  I18N.zh.modalTitle = "插入图片。<br>按下开始。";
  I18N.es.modalEyebrow = "INICIAR PROYECTO";
  I18N.es.modalTitle = "INSERTAR IMAGEN.<br>PULSAR INICIO.";
  I18N.fr.modalEyebrow = "COMMENCER LE PROJET";
  I18N.fr.modalTitle = "INSÉRER L'IMAGE.<br>APPUYER SUR START.";
  I18N.de.modalEyebrow = "PROJEKT STARTEN";
  I18N.de.modalTitle = "BILD EINFÜGEN.<br>START DRÜCKEN.";
  I18N.pt.modalEyebrow = "INICIAR PROJETO";
  I18N.pt.modalTitle = "INSERIR IMAGEM.<br>PRESSIONAR START.";
  I18N.ar.modalEyebrow = "بدء المشروع";
  I18N.ar.modalTitle = "أدخل الصورة.<br>اضغط ابدأ.";

  // Programmatic additions to ORDER for the order modal form fields
  ORDER.ko.brand = "브랜드명 / 이름";
  ORDER.ko.email = "이메일 주소";
  ORDER.ko.mood = "원하는 분위기 또는 참고사항 (선택사항)";
  ORDER.ko.submit = "TRANSFORM";
  ORDER.ko.planPrefix = "선택한 요금제: ";

  ORDER.en.brand = "Brand / Name";
  ORDER.en.email = "Email";
  ORDER.en.mood = "Mood or reference, optional";
  ORDER.en.submit = "TRANSFORM";
  ORDER.en.planPrefix = "Selected plan: ";

  ORDER.ja.brand = "ブランド名 / お名前";
  ORDER.ja.email = "メールアドレス";
  ORDER.ja.mood = "ご希望の雰囲気や参考事項（任意）";
  ORDER.ja.submit = "TRANSFORM";
  ORDER.ja.planPrefix = "選択されたプラン: ";

  ORDER.zh.brand = "品牌名称 / 姓名";
  ORDER.zh.email = "电子邮箱";
  ORDER.zh.mood = "期望的氛围或参考事项（选填）";
  ORDER.zh.submit = "TRANSFORM";
  ORDER.zh.planPrefix = "已选方案: ";

  ORDER.es.brand = "Marca / Nombre";
  ORDER.es.email = "Correo electrónico";
  ORDER.es.mood = "Tono o referencia, opcional";
  ORDER.es.submit = "TRANSFORM";
  ORDER.es.planPrefix = "Plan seleccionado: ";

  ORDER.fr.brand = "Marque / Nom";
  ORDER.fr.email = "Adresse e-mail";
  ORDER.fr.mood = "Ambiance ou référence, facultatif";
  ORDER.fr.submit = "TRANSFORM";
  ORDER.fr.planPrefix = "Plan sélectionné: ";

  ORDER.de.brand = "Marke / Name";
  ORDER.de.email = "E-Mail-Adresse";
  ORDER.de.mood = "Stimmung oder Referenz, optional";
  ORDER.de.submit = "TRANSFORM";
  ORDER.de.planPrefix = "Ausgewählter Plan: ";

  ORDER.pt.brand = "Marca / Nome";
  ORDER.pt.email = "Endereço de e-mail";
  ORDER.pt.mood = "Clima ou referência, opcional";
  ORDER.pt.submit = "TRANSFORM";
  ORDER.pt.planPrefix = "Plano selecionado: ";

  ORDER.ar.brand = "العلامة التجارية / الاسم";
  ORDER.ar.email = "البريد الإلكتروني";
  ORDER.ar.mood = "المزاج أو المرجع، اختياري";
  ORDER.ar.submit = "TRANSFORM";
  ORDER.ar.planPrefix = "الخطة المحددة: ";

  // Expose ORDER globally
  window.ORDER = ORDER;

  function langNow(){
    const h=document.getElementById('heroNativeLangSelect');
    const n=document.getElementById('nativeLangSelect');
    return (h&&h.value)||(n&&n.value)||localStorage.getItem('avvmLang')||'ko';
  }
  function syncSelects(lang){
    const h=document.getElementById('heroNativeLangSelect');
    const n=document.getElementById('nativeLangSelect');
    if(h) h.value=lang;
    if(n) n.value=lang;
  }
  function applyAVVMLang(lang){
    lang=lang||langNow();
    const base=I18N[lang]||I18N.ko;
    const auto=AUTO[lang]||AUTO.ko;
    const help=HELP[lang]||HELP.ko;
    const order=ORDER[lang]||ORDER.ko;
    document.documentElement.lang=lang; document.body.classList.toggle('avvm-cjk-lang', lang==='ja'||lang==='zh');
    document.body.setAttribute('dir-text', lang==='ar'?'rtl':'ltr');
    localStorage.setItem('avvmLang',lang);
    syncSelects(lang);
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key=el.getAttribute('data-i18n');
      const val=base[key]||I18N.en[key]||I18N.ko[key];
      if(val) el.innerHTML=val;
    });
    document.querySelectorAll('[data-i18n-auto]').forEach(el=>{
      const key=el.getAttribute('data-i18n-auto');
      const val=auto[key]||AUTO.en[key]||AUTO.ko[key];
      if(val) el.innerHTML=val;
    });
    document.querySelectorAll('[data-duration][data-seconds]').forEach(el=>{
      el.textContent=el.getAttribute('data-seconds')+(SECONDS[lang]||'s');
    });
    document.querySelectorAll('[data-help-key]').forEach(el=>{
      const key=el.getAttribute('data-help-key');
      const val=help[key]||HELP.en[key]||HELP.ko[key];
      if(val) el.setAttribute('data-help',val);
    });
    const phone=document.getElementById('phoneInput');
    if(phone) phone.placeholder=order.phone;
    const brand=document.getElementById('brandInput');
    if(brand) brand.placeholder=order.brand;
    const email=document.getElementById('emailInput');
    if(email) email.placeholder=order.email;
    const mood=document.getElementById('moodInput');
    if(mood) mood.placeholder=order.mood;
    const submit=document.getElementById('submitOrder');
    if(submit) submit.textContent=order.submit;
    const summary=document.getElementById('orderSummary');
    if(summary && window.selectedPlan) {
      summary.textContent=`${order.planPrefix}${window.selectedPlan} · ${window.prices[window.selectedPlan]||window.prices.Pro}`;
    }
    const notify=document.querySelector('.notify-consent span');
    if(notify) notify.textContent=order.notify;
    const copy=document.getElementById('orderLinkCopy');
    if(copy && !copy.dataset.customized) copy.textContent=order.orderCopy;
    const link=document.getElementById('viewOrderLink');
    if(link) link.textContent=order.orderLink;
    if(typeof window.applyHeroTitleLang === 'function') window.applyHeroTitleLang(lang);
    if(typeof window.applyConsentLang === 'function') window.applyConsentLang(lang);
    if(typeof window.applyBusinessInfo === 'function') window.applyBusinessInfo(lang);
  }
  window.applyAVVMLang=applyAVVMLang;
})();

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
  const HERO_TITLE_I18N={"ko": {"heroTitle1": "한 장의 사진.", "heroTitle2": "한 번의 클릭.", "heroTitle3": "시네마틱하게.", "heroTitle4": "완성."}, "en": {"heroTitle1": "ONE IMAGE.", "heroTitle2": "ONE CLICK.", "heroTitle3": "CINEMATIC.", "heroTitle4": "RESULTS."}, "ja": {"heroTitle1": "1枚の写真。", "heroTitle2": "ワンクリック。", "heroTitle3": "シネマティックに。", "heroTitle4": "完成。"}, "zh": {"heroTitle1": "一张照片。", "heroTitle2": "一次点击。", "heroTitle3": "电影感。", "heroTitle4": "完成。"}, "es": {"heroTitle1": "UNA IMAGEN.", "heroTitle2": "UN CLIC.", "heroTitle3": "CINEMÁTICO.", "heroTitle4": "RESULTADOS."}, "fr": {"heroTitle1": "UNE IMAGE.", "heroTitle2": "UN CLIC.", "heroTitle3": "CINÉMATIQUE.", "heroTitle4": "RÉSULTATS."}, "de": {"heroTitle1": "EIN BILD.", "heroTitle2": "EIN KLICK.", "heroTitle3": "CINEMATIC.", "heroTitle4": "ERGEBNIS."}, "pt": {"heroTitle1": "UMA IMAGEM.", "heroTitle2": "UM CLIQUE.", "heroTitle3": "CINEMÁTICO.", "heroTitle4": "RESULTADO."}, "ar": {"heroTitle1": "صورة واحدة.", "heroTitle2": "نقرة واحدة.", "heroTitle3": "سينمائي.", "heroTitle4": "نتيجة."}};
  function applyHeroTitleLang(lang){
    const t=HERO_TITLE_I18N[lang]||HERO_TITLE_I18N.ko;
    Object.keys(t).forEach(k=>{
      document.querySelectorAll('[data-i18n="'+k+'"]').forEach(el=>{el.innerHTML=t[k];});
    });
  }
  window.applyHeroTitleLang=applyHeroTitleLang;
  window.HERO_TITLE_I18N = HERO_TITLE_I18N;
})();

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
  const BUSINESS_INFO = {
    ko: "사업자등록번호: 347-37-01807 · 통신판매업 신고번호: 제2026-경기파주-2862호",
    en: "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호",
    ja: "事業者登録番号: 347-37-01807 · 通信販売業申告番号: 手続き中 / 更新予定",
    zh: "营业登记号: 347-37-01807 · 通信销售申报号: 处理中 / 待更新",
    es: "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호",
    fr: "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호",
    de: "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호",
    pt: "Business Registration No.: 347-37-01807 · Mail-order Business Registration: 제2026-경기파주-2862호",
    ar: "رقم تسجيل الأعمال: 347-37-01807 · تسجيل التجارة الإلكترونية: قيد المعالجة / سيتم التحديث"
  };
  function applyBusinessInfo(lang){
    const el=document.querySelector('[data-i18n-auto="autoKo29"]');
    if(el) el.textContent=BUSINESS_INFO[lang]||BUSINESS_INFO.ko;
  }
  window.applyBusinessInfo=applyBusinessInfo;
})();

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
  function requiredConsentsOk(){
    return !!(
      document.getElementById('privacyConsent')?.checked &&
      document.getElementById('notifyConsent')?.checked &&
      document.getElementById('refundConsent')?.checked
    );
  }
  function syncPaymentButton(){
    const btn=document.getElementById('submitOrder');
    if(btn) btn.disabled=!requiredConsentsOk();
  }
  document.addEventListener('change',function(e){
    if(e.target && ['privacyConsent','notifyConsent','refundConsent','marketingConsent'].includes(e.target.id)){
      syncPaymentButton();
    }
  },true);
  document.addEventListener('DOMContentLoaded',syncPaymentButton);
  if(document.readyState!=='loading') syncPaymentButton();
})();

/* ==========================================================================
   EXTRACTED SCRIPT BLOCK
   ========================================================================== */
(function(){
  const CONSENT_I18N={
    ko:{
      uploadTitle:'이미지 업로드는 결제 후 진행됩니다.',
      uploadCopy:'결제 완료 후 주문 링크에서 원본 이미지를 업로드할 수 있습니다.',
      noticeTitle:'결제 전 확인',
      notice1:'본 상품은 고객 이미지 기반 맞춤 제작 디지털 콘텐츠입니다. 제작 착수 후에는 단순 변심에 의한 취소·환불이 제한될 수 있습니다.',
      notice2:'영상은 AI 기술을 활용하여 제작되며, 이미지 품질과 요청 스타일에 따라 결과가 달라질 수 있습니다.',
      privacy:'[필수] 개인정보 수집·이용 동의',
      privacyCopy:'주문 처리 및 결과 안내를 위해 이름, 휴대폰번호, 이메일, 업로드 이미지, 주문 정보를 수집·이용하는 데 동의합니다.',
      notify:'[필수] 주문 진행 알림 수신 동의',
      notifyCopy:'주문 접수, 제작 진행, 완성 안내 등 거래 관련 정보를 카톡/문자/이메일로 받는 데 동의합니다.',
      refund:'[필수] 맞춤 제작 디지털 콘텐츠 및 환불 제한 동의',
      refundCopy:'본 상품은 고객이 제공한 이미지와 요청사항을 바탕으로 제작되는 맞춤형 디지털 콘텐츠입니다. 제작 착수 후에는 단순 변심에 의한 취소·환불이 제한될 수 있음을 확인했습니다.',
      marketing:'[선택] 마케팅 수신 동의',
      marketingCopy:'이벤트, 할인, 신규 샘플 안내 등 마케팅 정보를 카톡/문자/이메일로 받겠습니다.'
    },
    en:{
      uploadTitle:'Image upload opens after payment.',
      uploadCopy:'After payment, you can upload the original image from your secure order link.',
      noticeTitle:'Before payment',
      notice1:'This is custom-made digital content based on the customer’s image. Cancellation or refund may be limited after production starts.',
      notice2:'The video is produced with AI-assisted tools, and results may vary depending on image quality and requested style.',
      privacy:'[Required] Consent to collect and use personal information',
      privacyCopy:'I agree that AVVM may collect and use my name, mobile number, email, uploaded image, and order information for order processing and delivery.',
      notify:'[Required] Transactional notice consent',
      notifyCopy:'I agree to receive order, production, and delivery notifications by Kakao/SMS/email.',
      refund:'[Required] Custom digital content and refund limitation consent',
      refundCopy:'I understand that this is custom digital content based on my image and request, and cancellation/refund may be limited after production starts.',
      marketing:'[Optional] Marketing consent',
      marketingCopy:'I agree to receive event, discount, and new sample marketing messages by Kakao/SMS/email.'
    },
    ja:{
      uploadTitle:'画像アップロードは決済完了後に進みます。',
      uploadCopy:'決済完了後、注文リンクからオリジナル画像をアップロードできます。',
      noticeTitle:'決済前のご確認',
      notice1:'本商品は顧客画像に基づきカスタマイズ制作されるデジタルコンテンツです。制作着手後は、お客様都合によるキャンセル・返金が制限される場合があります。',
      notice2:'映像はAI技術を活用して制作されるため、画像の品質やご希望のスタイルによって結果が異なる場合があります。',
      privacy:'[必須] 個人情報の収集・利用への同意',
      privacyCopy:'注文処理および納品案内のため、お名前、携帯電話番号、メールアドレス、アップロード画像、注文情報を収集・利用することに同意します。',
      notify:'[必須] 注文進行通知の受信同意',
      notifyCopy:'注文受付、制作進行、完成案内などの取引関連情報をカカオトーク/SMS/メールで受信することに同意します。',
      refund:'[必須] カスタム制作デジタルコンテンツおよび返金制限への同意',
      refundCopy:'本商品は提供された画像とリクエストに基づいて制作されるオーダーメイド型デジタルコンテンツです。制作開始後はキャンセル・返金が制限されることを確認しました。',
      marketing:'[選択] マーケティング情報の受信同意',
      marketingCopy:'イベント、割引、新しいサンプル案内などのマーケティング情報をカカオトーク/SMS/メールで受信します。'
    },
    zh:{
      uploadTitle:'支付成功后即可上传图片。',
      uploadCopy:'付款完成后，您可以通过安全的订单链接上传原始图片。',
      noticeTitle:'付款前确认',
      notice1:'本商品是基于客户图片定制数字化内容。开始制作后，可能限制因个人意愿引起的取消和退款。',
      notice2:'视频采用AI技术制作，效果可能会因图片质量和要求风格而异。',
      privacy:'[必选] 同意收集和使用个人信息',
      privacyCopy:'同意为了处理订单和发送完成通知，收集并使用姓名、手机号码、电子邮箱、上传的图片及订单信息。',
      notify:'[必选] 同意接收订单进行通知',
      notifyCopy:'同意通过Kakao/短信/电子邮箱接收订单接收、制作进度、完成通知等交易相关信息。',
      refund:'[必选] 定制数字化内容及退款限制同意',
      refundCopy:'本商品是根据客户提供的图片和要求制作的定制型数字化内容。已确认制作开始后，因个人意愿的取消和退款将受到限制。',
      marketing:'[可选] 同意接收营销信息',
      marketingCopy:'同意通过Kakao/短信/电子邮箱接收活动、折扣、新样本介绍等营销信息。'
    }
  };
  ['es','fr','de','pt','ar'].forEach(k=>CONSENT_I18N[k]=CONSENT_I18N.en);
  function applyConsentLang(lang){
    const t=CONSENT_I18N[lang]||CONSENT_I18N.ko;
    const upload=document.getElementById('uploadAfterPaymentNote');
    if(upload){ upload.querySelector('b').textContent=t.uploadTitle; upload.querySelector('span').textContent=t.uploadCopy; }
    const notice=document.querySelector('.checkout-notice');
    if(notice){ const b=notice.querySelector('b'); const ps=notice.querySelectorAll('p'); if(b)b.textContent=t.noticeTitle; if(ps[0])ps[0].textContent=t.notice1; if(ps[1])ps[1].textContent=t.notice2; }
    const rows=document.querySelectorAll('.consent-row');
    const vals=[[t.privacy,t.privacyCopy],[t.notify,t.notifyCopy],[t.refund,t.refundCopy],[t.marketing,t.marketingCopy]];
    rows.forEach((row,i)=>{ const span=row.querySelector('span'); if(span&&vals[i]) span.innerHTML='<b>'+vals[i][0]+'</b><br>'+vals[i][1]; });
  }
  window.applyConsentLang=applyConsentLang;
})();

/* ==========================================================================
   AVVM PREMIUM INTERACTIVE MODULES & UPGRADES
   ========================================================================== */

(function() {
    /* 1. SCROLL STABILITY FIX
       Mobile Safari/Chrome touch scroll was sometimes pulled back to #hero.
       - Touch devices use native browser scrolling.
       - Lenis smooth scroll is enabled only on desktop fine-pointer devices.
       - #hero hash is removed after load to prevent anchor re-snapping.
    */
    try {
        if (location.hash === '#hero') {
            history.replaceState(null, '', location.pathname + location.search);
        }
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    } catch(e) {}

    const isTouchDevice = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window);
    const lenis = (!isTouchDevice && window.Lenis) ? new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
    }) : {
        on(){},
        raf(){},
        stop(){ document.body.classList.add('modal-open'); },
        start(){ document.body.classList.remove('modal-open'); }
    };

    window.__avvmLenis = lenis;

    if (!isTouchDevice && lenis.on && window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
    }

    if (!isTouchDevice && lenis.raf) {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    /* 2. GSAP SCROLLTRIGGER CARD REVEALS */
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.works-strip, .process-grid, .pricing-grid, .portfolio-grid, .clarity-cards, .consumer-price-grid, .consumer-mode-grid').forEach(grid => {
        const items = grid.querySelectorAll('.work-card, .process-card, .price-card, .portfolio-card, .clarity-card, .consumer-price-card, .consumer-mode-card');
        if (items.length > 0) {
            gsap.fromTo(items,
                { opacity: 0, y: 35 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.0,
                    ease: 'power3.out',
                    stagger: 0.08,
                    scrollTrigger: {
                        trigger: grid,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }
    });

    // Fade-in sections headers
    document.querySelectorAll('.ba-header, .section-bar, .process-intro, .consumer-head, .portfolio-global-head').forEach(header => {
        gsap.fromTo(header,
            { opacity: 0, y: 25 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: header,
                    start: 'top 88%'
                }
            }
        );
    });

    /* 3. CUSTOM INTERACTIVE CURSOR */
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    const cursorText = document.getElementById('cursor-text');

    if (cursor && follower) {
        gsap.set(cursor, { xPercent: -50, yPercent: -50, left: 0, top: 0 });
        gsap.set(follower, { xPercent: -50, yPercent: -50, left: 0, top: 0 });

        const cursorX = gsap.quickTo(cursor, "left", { duration: 0.1, ease: "power3" });
        const cursorY = gsap.quickTo(cursor, "top", { duration: 0.1, ease: "power3" });
        const followerX = gsap.quickTo(follower, "left", { duration: 0.35, ease: "power3" });
        const followerY = gsap.quickTo(follower, "top", { duration: 0.35, ease: "power3" });

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorX(mouseX);
            cursorY(mouseY);
            followerX(mouseX);
            followerY(mouseY);
        });

        // Hover class triggers
        const links = document.querySelectorAll('a, button, select, input, textarea, .option-chip, .cat');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (link.classList.contains('btn-primary') || link.id === 'submitOrder' || link.classList.contains('showreel-btn')) {
                    document.body.classList.add('hovering-cta');
                    cursorText.innerText = "START";
                } else if (link.classList.contains('close') || link.classList.contains('legal-close') || link.id === 'closeModal' || link.id === 'closeShowreel') {
                    document.body.classList.add('hovering-close');
                    cursorText.innerText = "CLOSE";
                } else {
                    document.body.classList.add('hovering-link');
                }
            });
            link.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering-link', 'hovering-cta', 'hovering-close');
                cursorText.innerText = "";
            });
        });

        // Video / Play hovers
        const videoWraps = document.querySelectorAll('.sample-card, .portfolio-card, .demo-card, .play, .sample-play, .demo-play, .show-fancl-btn, .show-demo-btn');
        videoWraps.forEach(wrap => {
            wrap.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering-video');
                cursorText.innerText = "PLAY";
            });
            wrap.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering-video');
                cursorText.innerText = "";
            });
        });
    }

    /* 4. MAGNETIC SNAPPING BUTTONS */
    const magneticBtns = document.querySelectorAll('.btn, .btn-primary, .btn-round, .lang-switcher button, .logo, .close, .legal-close');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const strength = 18; // base strength

            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: relX * (strength / 100),
                y: relY * (strength / 100),
                duration: 0.4,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.4)'
            });
        });
    });

    /* 5. SVG LIQUID WAVE HOVER DISTORTION */
    const liquidMap = document.getElementById('liquid-map-el');
    const cards = document.querySelectorAll('.work-card, .portfolio-card, .ba-card, .demo-card, .sample-card');

    if (liquidMap) {
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('distort-apply');
                gsap.fromTo(liquidMap,
                    { attr: { scale: 0 } },
                    {
                        attr: { scale: 45 },
                        duration: 0.4,
                        ease: 'power2.out',
                        onComplete: () => {
                            gsap.to(liquidMap, {
                                attr: { scale: 0 },
                                duration: 1.0,
                                ease: 'power3.out'
                            });
                        }
                    }
                );
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(liquidMap, {
                    attr: { scale: 0 },
                    duration: 0.5,
                    ease: 'power3.out',
                    onComplete: () => {
                        card.classList.remove('distort-apply');
                    }
                });
            });
        });
    }

    /* 6. WEBGL-LIKE DUST PARTICLE CANVAS */
    const canvas = document.getElementById('flow-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];

        const PARTICLE_COUNT = 90;
        let mouse = { x: -1000, y: -1000 };
        let scrollVelocity = 0;
        let lastScrollY = window.scrollY;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseSize = Math.random() * 1.2 + 0.3;
                this.size = this.baseSize;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = -Math.random() * 0.3 - 0.1; // slow drift up
                this.vx = this.speedX;
                this.vy = this.speedY;
                this.alpha = Math.random() * 0.25 + 0.05;
                this.colorRGB = '216, 242, 51'; // Lime particles
            }

            update() {
                // Apply scroll velocity to vertical drift
                this.y += this.vy + (scrollVelocity * 0.08);
                this.x += this.vx;

                // Drift decay back to base
                this.vx += (this.speedX - this.vx) * 0.05;
                this.vy += (this.speedY - this.vy) * 0.05;
                this.size += (this.baseSize - this.size) * 0.05;

                // Mouse attraction and orbit swirling
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.hypot(dx, dy);

                if (dist < 180) {
                    const pull = (180 - dist) * 0.00005;
                    this.vx += dx * pull;
                    this.vy += dy * pull;

                    // orbital drift direction based on quadrant
                    const angle = Math.atan2(dy, dx) + Math.PI / 2;
                    this.vx += Math.cos(angle) * pull * 1.5;
                    this.vy += Math.sin(angle) * pull * 1.5;

                    this.size = this.baseSize * (1 + (180 - dist) * 0.003);
                }

                // Wrap boundaries
                if (this.x < -10) this.x = width + 10;
                if (this.x > width + 10) this.x = -10;
                if (this.y < -10) {
                    this.y = height + 10;
                    this.x = Math.random() * width;
                }
                if (this.y > height + 10) {
                    this.y = -10;
                    this.x = Math.random() * width;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.colorRGB}, ${this.alpha})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Compute scroll velocity
            const currentScrollY = window.scrollY;
            scrollVelocity = currentScrollY - lastScrollY;
            lastScrollY = currentScrollY;

            // Dampen scroll
            scrollVelocity *= 0.9;

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        }

        initParticles();
        animate();
    }

    /* 7. NEW VECTOR LOADER SCREEN TRANSITION (Lando Norris style) */
    const loader = document.getElementById('loader');
    if (loader) {
        // Stop scroll during loading
        lenis.stop();
        
        setTimeout(() => {
            // Slide up loader, fade in site
            loader.classList.add('loaded');
            // Resume scroll
            lenis.start();
            // Start kinetic tagline transition
            startHeroKineticTransition();
        }, 2200); // 2.2 seconds timeline matches the SVG animations
    }

    /* 7.1. FLUID GLOWING DOTS CURSOR TRAIL EFFECT */
    const brushCanvas = document.getElementById('brush-canvas');
    if (brushCanvas) {
        const bCtx = brushCanvas.getContext('2d');
        let w = (brushCanvas.width = window.innerWidth);
        let h = (brushCanvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            w = (brushCanvas.width = window.innerWidth);
            h = (brushCanvas.height = window.innerHeight);
        });

        let points = [];
        let lastMouse = null;

        window.addEventListener('mousemove', (e) => {
            const mouse = { x: e.clientX, y: e.clientY };
            
            // Add mouse position
            points.push({
                x: mouse.x,
                y: mouse.y,
                vx: lastMouse ? (mouse.x - lastMouse.x) * 0.08 : 0,
                vy: lastMouse ? (mouse.y - lastMouse.y) * 0.08 : 0,
                size: 15,
                alpha: 1,
                decay: 0.024
            });

            // Add spark/splatter particles when moving fast
            if (lastMouse) {
                const dist = Math.hypot(mouse.x - lastMouse.x, mouse.y - lastMouse.y);
                if (dist > 18) {
                    const count = Math.min(Math.floor(dist / 4), 6);
                    for (let i = 0; i < count; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = Math.random() * dist * 0.15;
                        points.push({
                            x: mouse.x,
                            y: mouse.y,
                            vx: Math.cos(angle) * speed + (mouse.x - lastMouse.x) * 0.05,
                            vy: Math.sin(angle) * speed + (mouse.y - lastMouse.y) * 0.05,
                            size: Math.random() * 3 + 1.5,
                            alpha: 0.75,
                            decay: Math.random() * 0.05 + 0.025
                        });
                    }
                }
            }
            lastMouse = mouse;
        });

        function drawBrush() {
            bCtx.clearRect(0, 0, w, h);

            // 1. Draw glowing circles (brush tips & sparks)
            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.decay;
                p.size = Math.max(p.size - 0.25, 0);

                if (p.alpha <= 0 || p.size <= 0) {
                    points.splice(i, 1);
                    i--;
                    continue;
                }

                bCtx.save();
                bCtx.globalAlpha = p.alpha;
                bCtx.fillStyle = '#d8f233'; // Signature AVVM Lime
                bCtx.shadowColor = '#d8f233';
                bCtx.shadowBlur = 10;
                bCtx.beginPath();
                bCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                bCtx.fill();
                bCtx.restore();
            }

            // 2. Draw thick ribbon connections to emulate paint stroke flow
            if (points.length > 1) {
                bCtx.save();
                bCtx.strokeStyle = '#d8f233';
                bCtx.shadowColor = '#d8f233';
                bCtx.shadowBlur = 12;
                bCtx.lineCap = 'round';
                bCtx.lineJoin = 'round';
                bCtx.globalCompositeOperation = 'screen';

                for (let i = 1; i < points.length; i++) {
                    const p1 = points[i - 1];
                    const p2 = points[i];
                    
                    // Only connect points that are relatively young and close
                    if (p1.size > 4 && p2.size > 4 && Math.hypot(p1.x - p2.x, p1.y - p2.y) < 100) {
                        bCtx.beginPath();
                        bCtx.moveTo(p1.x, p1.y);
                        bCtx.lineTo(p2.x, p2.y);
                        bCtx.lineWidth = (p1.size + p2.size) * 0.45;
                        bCtx.globalAlpha = (p1.alpha + p2.alpha) * 0.22;
                        bCtx.stroke();
                    }
                }
                bCtx.restore();
            }

            requestAnimationFrame(drawBrush);
        }
        drawBrush();
    }

    /* 8. HERO KINETIC EQUALIZER WAVE TEXT SEQUENCER */
    function startHeroKineticTransition() {
        const bars = document.querySelectorAll('.wave-bar');
        const taglineCanvas = document.getElementById('hero-tagline-canvas');
        if (!taglineCanvas) return;

        const tCtx = taglineCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const w = 800;
        const h = 180;

        taglineCanvas.style.width = '100%';
        taglineCanvas.style.height = h + 'px';
        taglineCanvas.width = w * dpr;
        taglineCanvas.height = h * dpr;
        tCtx.scale(dpr, dpr);

        // Offscreen canvas for sharp text
        const offCanvas = document.createElement('canvas');
        offCanvas.width = w * dpr;
        offCanvas.height = h * dpr;
        const offCtx = offCanvas.getContext('2d');
        offCtx.scale(dpr, dpr);

        // Temp canvas for safe scaling (Safari compatibility)
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        // Equalizer wave rise (background wave starts)
        gsap.to(bars, {
            scaleY: 0.55,
            duration: 1.0,
            ease: 'power2.out',
            stagger: 0.04
        });

        // Virtual object to animate
        const state = {
            pixelSize: 20,
            opacity: 0,
            yOffset: 0,
            text: ''
        };

        const tl = gsap.timeline({ repeat: -1 });

        // Build the loop for 4 segments
        [0, 1, 2, 3].forEach((index) => {
            // Helper to get text based on current language
            tl.add(() => {
                const lang = localStorage.getItem('avvmLang') || 'ko';
                const i18n = window.HERO_TITLE_I18N[lang] || window.HERO_TITLE_I18N.ko;
                state.text = i18n[`heroTitle${index + 1}`] || '';
                state.pixelSize = 20;
                state.opacity = 0;
                state.yOffset = 0;
            });

            // 1. Text enters as mosaic & fades in
            tl.to(state, {
                pixelSize: 1,
                opacity: 1,
                duration: 0.9,
                ease: 'power2.out'
            });

            // Equalizer ripple peaks on active column at the same time
            const activeBarIndex = Math.min(Math.floor(bars.length / 4) * index, bars.length - 1);
            tl.to(bars[activeBarIndex], {
                scaleY: 1.0,
                duration: 0.4,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            }, '-=0.9');

            // 2. Hold sharp state
            tl.to(state, {
                duration: 1.2
            });

            // 3. Sinks down & fades out
            tl.to(state, {
                yOffset: 45,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in'
            });
        });

        // Loop rendering tick
        function renderTagline() {
            tCtx.clearRect(0, 0, w, h);
            
            if (state.opacity > 0 && state.text) {
                // 1. Draw sharp text on offscreen canvas
                offCtx.clearRect(0, 0, w, h);
                const fontSize = window.innerWidth < 768 ? 66 : 108;
                offCtx.font = `italic 900 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
                offCtx.fillStyle = '#ffffff';
                offCtx.textAlign = 'left';
                offCtx.textBaseline = 'middle';
                
                // Draw text with vertical offset (sinking effect) left-aligned
                offCtx.fillText(state.text, 4, h / 2 + state.yOffset);

                // 2. Render pixelated version onto display canvas
                tCtx.save();
                tCtx.globalAlpha = state.opacity;

                if (state.pixelSize <= 1.2) {
                    tCtx.drawImage(offCanvas, 0, 0, w * dpr, h * dpr, 0, 0, w, h);
                } else {
                    // Compute small dimensions for pixelation
                    const sw = Math.floor(Math.max(w / state.pixelSize, 1));
                    const sh = Math.floor(Math.max(h / state.pixelSize, 1));
                    tempCanvas.width = sw;
                    tempCanvas.height = sh;

                    tempCtx.clearRect(0, 0, sw, sh);
                    tempCtx.drawImage(offCanvas, 0, 0, w * dpr, h * dpr, 0, 0, sw, sh);

                    // Scale back up to main display canvas with smoothing disabled
                    tCtx.imageSmoothingEnabled = false;
                    tCtx.mozImageSmoothingEnabled = false;
                    tCtx.webkitImageSmoothingEnabled = false;
                    tCtx.msImageSmoothingEnabled = false;

                    tCtx.drawImage(tempCanvas, 0, 0, sw, sh, 0, 0, w, h);
                }
                tCtx.restore();
            }

            requestAnimationFrame(renderTagline);
        }

        renderTagline();
    }
})();

// Master multi-language initialization and sync
(function(){
  function langNow(){
    const h=document.getElementById('heroNativeLangSelect');
    const n=document.getElementById('nativeLangSelect');
    return (h&&h.value)||(n&&n.value)||localStorage.getItem('avvmLang')||'ko';
  }
  document.addEventListener('change',function(e){
    if(e.target && (e.target.id==='heroNativeLangSelect'||e.target.id==='nativeLangSelect')) {
      if(window.applyAVVMLang) window.applyAVVMLang(e.target.value);
    }
  },true);
  document.addEventListener('DOMContentLoaded',()=> {
    if(window.applyAVVMLang) window.applyAVVMLang(localStorage.getItem('avvmLang')||'ko');
  });
  window.addEventListener('load',()=> {
    if(window.applyAVVMLang) window.applyAVVMLang(localStorage.getItem('avvmLang')||langNow());
  });
  if(document.readyState!=='loading') {
    if(window.applyAVVMLang) window.applyAVVMLang(localStorage.getItem('avvmLang')||langNow());
  }
})();


/* AVVM V17 Personal Transform category active fix */
(function(){
  function ready(fn){ 
    if(document.readyState !== 'loading') fn(); 
    else document.addEventListener('DOMContentLoaded', fn); 
  }
  ready(function(){
    document.addEventListener('click', function(e){
      const btn = e.target.closest('.cat-grid button, .cat, .cat-btn, [data-category]');
      if(!btn || !btn.closest('.cat-grid')) return;
      const grid = btn.closest('.cat-grid');
      grid.querySelectorAll('button, .cat, .cat-btn, [data-category]').forEach(function(el){
        el.classList.remove('active');
        el.setAttribute('aria-pressed','false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
    }, true);
  });
})();



/* AVVM V19 app-only hotfix: visible photo upload + Transform label
   This runs even if index.html/style.css were not uploaded.
*/
(function(){
  function ready(fn){
    if(document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function(){
    // 1) Shorten Personal Transform label to Transform
    document.querySelectorAll('button, .cat, .cat-btn, [data-category]').forEach(function(el){
      if((el.textContent || '').trim() === 'Personal Transform'){
        el.textContent = 'Transform';
      }
      if(el.getAttribute && el.getAttribute('data-category') === 'Personal Transform'){
        el.classList.add('cat');
      }
    });

    // 2) Make Personal Transform active if clicked
    document.addEventListener('click', function(e){
      const btn = e.target.closest('.cat-grid button, .cat, .cat-btn, [data-category]');
      if(!btn || !btn.closest('.cat-grid')) return;
      const grid = btn.closest('.cat-grid');
      grid.querySelectorAll('button, .cat, .cat-btn, [data-category]').forEach(function(x){
        x.classList.remove('active');
        x.setAttribute('aria-pressed','false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
    }, true);

    // 3) Inject photo upload block if it does not exist
    function ensurePhotoUpload(){
      if(document.getElementById('photoUploadVisibleBlock')) return;

      let imageInput = document.getElementById('imageInput');
      if(!imageInput){
        imageInput = document.createElement('input');
        imageInput.id = 'imageInput';
        imageInput.type = 'file';
        imageInput.accept = 'image/*';
        imageInput.className = 'field photo-upload-input';
      }else{
        imageInput.classList.add('photo-upload-input');
        imageInput.style.display = '';
      }

      const block = document.createElement('div');
      block.className = 'photo-upload-visible-block';
      block.id = 'photoUploadVisibleBlock';
      block.innerHTML = `
        <div class="order-form-section-title">2. 제작할 사진 업로드</div>
        <p class="order-form-helper">고객님의 사진 또는 상품 사진을 첨부해 주세요. 지금 첨부하지 않아도 결제 후 주문 링크에서 다시 업로드할 수 있습니다.</p>
        <label class="photo-upload-drop" for="imageInput">
          <span class="photo-upload-icon">＋</span>
          <span class="photo-upload-text">
            <b>사진 첨부하기</b>
            <small>JPG, PNG, WEBP 등 이미지 파일</small>
          </span>
        </label>
      `;
      block.appendChild(imageInput);

      const customer = document.getElementById('customerInfoVisibleBlock');
      const checkout = document.querySelector('.checkout-notice');
      const consent = document.getElementById('consentGroup');
      const mood = document.getElementById('moodInput');

      if(customer && customer.parentNode){
        customer.insertAdjacentElement('afterend', block);
      }else if(checkout && checkout.parentNode){
        checkout.parentNode.insertBefore(block, checkout);
      }else if(consent && consent.parentNode){
        consent.parentNode.insertBefore(block, consent);
      }else if(mood && mood.parentNode){
        mood.insertAdjacentElement('afterend', block);
      }

      imageInput.addEventListener('change', function(){
        const label = block.querySelector('.photo-upload-drop b');
        const small = block.querySelector('.photo-upload-drop small');
        if(imageInput.files && imageInput.files[0]){
          block.classList.add('has-file');
          if(label) label.textContent = '첨부 완료';
          if(small) small.textContent = imageInput.files[0].name;
        }else{
          block.classList.remove('has-file');
          if(label) label.textContent = '사진 첨부하기';
          if(small) small.textContent = 'JPG, PNG, WEBP 등 이미지 파일';
        }
      });
    }

    ensurePhotoUpload();

    // Re-run when order modal opens/plan is selected, because some content may re-render.
    document.addEventListener('click', function(e){
      if(e.target.closest('[data-open], [data-plan-choice], #submitOrder')){
        setTimeout(ensurePhotoUpload, 120);
        setTimeout(ensurePhotoUpload, 500);
      }
    }, true);

    // 4) Inject required CSS if style.css was not updated
    if(!document.getElementById('avvm-v19-upload-style')){
      const style = document.createElement('style');
      style.id = 'avvm-v19-upload-style';
      style.textContent = `
        .photo-upload-visible-block{
          margin:18px 0 14px!important;
          padding:16px!important;
          border:1px solid rgba(216,242,51,.20)!important;
          border-radius:18px!important;
          background:rgba(255,255,255,.025)!important;
        }
        .photo-upload-visible-block.has-file{
          border-color:rgba(216,242,51,.45)!important;
          background:rgba(216,242,51,.055)!important;
        }
        .photo-upload-drop{
          display:flex!important;
          align-items:center!important;
          gap:12px!important;
          min-height:74px!important;
          padding:15px!important;
          border-radius:16px!important;
          border:1px dashed rgba(216,242,51,.36)!important;
          background:rgba(0,0,0,.45)!important;
          cursor:pointer!important;
          color:#fff!important;
        }
        .photo-upload-icon{
          display:grid!important;
          place-items:center!important;
          width:42px!important;
          height:42px!important;
          border-radius:999px!important;
          background:var(--lime,#d8f233)!important;
          color:#050505!important;
          font-weight:950!important;
          font-size:23px!important;
          flex:0 0 42px!important;
        }
        .photo-upload-drop b{
          display:block!important;
          color:#fff!important;
          font-size:14px!important;
          line-height:1.25!important;
        }
        .photo-upload-drop small{
          display:block!important;
          margin-top:3px!important;
          color:rgba(255,255,255,.58)!important;
          font-size:11px!important;
          line-height:1.35!important;
          word-break:break-all!important;
        }
        .photo-upload-input{
          position:absolute!important;
          width:1px!important;
          height:1px!important;
          opacity:0!important;
          pointer-events:none!important;
        }
        .cat-grid .cat.active,
        .cat-grid .cat-btn.active,
        .cat-grid [data-category].active{
          color:var(--lime,#d8f233)!important;
          border-color:var(--lime,#d8f233)!important;
          background:rgba(216,242,51,.08)!important;
          box-shadow:0 0 0 1px rgba(216,242,51,.18),0 0 22px rgba(216,242,51,.10)!important;
        }
      `;
      document.head.appendChild(style);
    }
  });
})();



/* AVVM V20 test-order mode + business name normalization */
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    // Business name cleanup in visible text nodes
    function walk(node){
      if(node.nodeType === 3){
        node.nodeValue = node.nodeValue
          .replace(/라라랜드맘/g,'라라랜드맘')
          .replace(/라라랜드맘/g,'라라랜드맘')
          .replace(/Service by 라라랜드맘 \/ AVVM/g,'서비스 제공: 라라랜드맘 / AVVM')
          .replace(/Brand: AVVM\.studio · Service by 라라랜드맘 \/ AVVM/g,'브랜드: AVVM.studio · 서비스 제공: 라라랜드맘 / AVVM');
      } else {
        node.childNodes && node.childNodes.forEach(walk);
      }
    }
    walk(document.body);

    // Button label for PG pending test mode
    const submit = document.getElementById('submitOrder');
    if(submit) submit.textContent = '테스트 주문 접수';

    // Add test mode notice if missing
    const checkout = document.querySelector('.checkout-notice');
    if(checkout && !checkout.querySelector('.test-mode-note')){
      const p = document.createElement('p');
      p.className = 'test-mode-note';
      p.innerHTML = '<b>현재는 PG 승인 전 테스트 모드입니다.</b><br>이 버튼은 실제 결제가 아니라 주문 흐름과 제작 품질 확인용 테스트 접수로 동작합니다. PG 승인 후 실제 결제 버튼으로 전환됩니다.';
      checkout.insertBefore(p, checkout.firstChild);
    }
  });
})();
