/* ============================================================
   SCG AI Knowledge Assistant
   Self-contained floating assistant that answers queries
   using SCG's own content, services, and product knowledge.
   No external API — works entirely client-side.
   ============================================================ */

(function () {
  'use strict';

  var SITE = 'https://rksjha.github.io/SHIVACSG/';

  /* ── SCG Knowledge Base ── */
  var KB = [
    {
      keywords: ['service','what do you do','about scg','about shiva','consultancy','overview','help'],
      title: 'SCG Services Overview',
      answer: 'Shiva Consultancy Group (SCG) provides professional consultancy across 6 core domains: Agriculture & Food Infrastructure, Government Scheme Advisory, Food Processing & Agribusiness, Business Development & Strategy, IPO & Finance Advisory, and Institutional Business Services (IBS). Led by Rakesh Jha with 15+ years of pan-India experience.',
      links: [{text:'All Services',url:'services/'},{text:'Contact Us',url:'contact/'}]
    },
    {
      keywords: ['government','scheme','pmfme','pmegp','mudra','nabard','aif','subsidy','startup india','dpiit','pli','pmksy'],
      title: 'Government Scheme Advisory',
      answer: 'SCG provides end-to-end support for central & state government schemes including PMFME (35% subsidy for food processing), PMEGP (up to 35% for new enterprises), AIF (3% interest subvention for agri infra), MUDRA loans (up to ₹10 lakh), NABARD grants, Startup India/DPIIT recognition, PLI, and more. We handle eligibility assessment, DPR preparation, application filing, bank coordination, and subsidy claim settlement.',
      links: [{text:'Government Schemes',url:'services/government-schemes.html'},{text:'Enquire',url:'contact/'}]
    },
    {
      keywords: ['food processing','fssai','apeda','cold chain','farm to fork','agribusiness','food unit','processing unit'],
      title: 'Food Processing & Agribusiness',
      answer: 'SCG offers specialised consulting for food processing — unit setup, machinery selection, FSSAI & APEDA compliance, backward linkage with farmers, forward linkage with retail chains, and access to PMFME/MoFPI subsidies. We also handle cold chain infrastructure, post-harvest facilities, and export market development.',
      links: [{text:'Food Processing',url:'services/food-processing.html'},{text:'Enquire',url:'contact/'}]
    },
    {
      keywords: ['agriculture','agri','farming','cold storage','warehouse','irrigation','infra','biomagic','bio magic'],
      title: 'Agriculture & Food Infrastructure',
      answer: 'SCG provides end-to-end advisory for agri-infrastructure — cold chains, food processing units, grain storage, farm-to-fork supply chains, and irrigation. We facilitate government approvals, DPR preparation, and bank finance. We also offer BioMagic bio-fertilizer products for sustainable farming.',
      links: [{text:'Agri Services',url:'services/#agriculture-infrastructure'},{text:'Products',url:'products/'}]
    },
    {
      keywords: ['ipo','finance','loan','debt','syndication','project finance','working capital','business loan','msme loan','cfo','sme ipo','funding','credit'],
      title: 'IPO & Finance Advisory',
      answer: 'SCG\'s finance practice covers project finance (DPR & CMA), debt syndication with banks & NBFCs, MSME/SME loans, working capital, CGTMSE collateral-free loans, IPO & SME IPO advisory, trade finance, and outsourced CFO services. Visit Shiva Financial Solutions for the full portal.',
      links: [{text:'Finance Advisory',url:'services/ipo-finance.html'},{text:'Loan Calculator',url:'small-apps/loan-calculator.html'},{text:'Financial Solutions',url:'https://rksjha.github.io/shiva-financial-solutions/'}]
    },
    {
      keywords: ['institutional','ibs','tender','psu','b2b','b2g','trade','export','import','mou','liaisoning','vendor'],
      title: 'Institutional Business Services (IBS)',
      answer: 'SCG\'s IBS practice connects MSMEs and corporates with PSUs, government departments, and international buyers. Services include tender advisory & bid management, PSU/corporate vendor registration, MoU drafting, trade facilitation, government liaisoning, and strategic partnerships.',
      links: [{text:'IBS Services',url:'services/institutional-business.html'},{text:'Enquire',url:'contact/'}]
    },
    {
      keywords: ['business development','strategy','msme','growth','market entry','startup','partnership'],
      title: 'Business Development & Strategy',
      answer: 'SCG offers strategic advisory for MSMEs, corporates, and startups — market entry, growth planning, partnership facilitation, investor relations, and institutional linkages. We prepare structured business plans with execution support to scale from local to national.',
      links: [{text:'Services',url:'services/#business-development'},{text:'Contact',url:'contact/'}]
    },
    {
      keywords: ['contact','phone','email','address','whatsapp','reach','call','talk','meet','appointment','schedule'],
      title: 'Contact SCG',
      answer: 'You can reach Shiva Consultancy Group through:\n• Phone/WhatsApp: +91 99790 21275\n• Email: rakesh@shivagroup.org.in / rksjha@gmail.com\n• Location: Ahmedabad, Gujarat\n• LinkedIn: linkedin.com/in/rksjha\nOr book a 45-min meeting slot on our calendar.',
      links: [{text:'Contact Page',url:'contact/'},{text:'Schedule Meeting',url:'calendar/'},{text:'WhatsApp',url:'https://wa.me/919979021275'}]
    },
    {
      keywords: ['product','biomagic','bio-fertilizer','fertilizer','amazer','farming revolution','brochure'],
      title: 'SCG Products',
      answer: 'SCG offers BioMagic bio-fertilizer products for sustainable farming — including BioMagic (English & regional variants), BioMagic Plus, and the AMAZER Smart Growers Growth Multiplier. View product brochures and presentations in our Products section.',
      links: [{text:'Products',url:'products/'},{text:'Media Library',url:'media/'}]
    },
    {
      keywords: ['calculator','emi','loan calculator','eligibility','cgtmse','cibil','foir'],
      title: 'Loan / EMI Calculator',
      answer: 'Use our advanced Loan Calculator to compute EMI, total interest, amortisation schedule, and check eligibility for 9 loan types — CGTMSE, MUDRA, Project Finance, Working Capital, Business Loan, Personal Loan, Car Loan, Equipment Finance, and MSME Loan. Enter your financial profile for instant eligibility assessment.',
      links: [{text:'Loan Calculator',url:'small-apps/loan-calculator.html'}]
    },
    {
      keywords: ['meeting','calendar','book','appointment','schedule','slot','consultation'],
      title: 'Book a Meeting',
      answer: 'Book a 45-minute consultation with SCG. Available Monday to Saturday, 11:00 AM to 7:00 PM IST, with 15-minute breaks between sessions. Select an open slot on our calendar to schedule your meeting.',
      links: [{text:'Schedule Meeting',url:'calendar/'}]
    },
    {
      keywords: ['media','image','video','pdf','document','download','brochure','profile','presentation'],
      title: 'Media & Documents',
      answer: 'Access SCG\'s complete media library — images, PDFs, brochures, corporate profiles, service presentations, fee structures, and product documents. Available for download from our Media section.',
      links: [{text:'Media Library',url:'media/'},{text:'PDFs',url:'media/pdfs/'},{text:'Images',url:'media/images/'}]
    },
    {
      keywords: ['advertorial','corporate profile','company profile','about company','who','rakesh','jha'],
      title: 'About SCG & Rakesh Jha',
      answer: 'Shiva Consultancy Group is led by Rakesh Jha — a seasoned consultant with 15+ years of experience in business advisory, government scheme facilitation, finance, and institutional business across India. Based in Ahmedabad, Gujarat. View our corporate profiles and advertorials.',
      links: [{text:'Advertorials',url:'advertorials/'},{text:'LinkedIn',url:'https://www.linkedin.com/in/rksjha'}]
    },
    {
      keywords: ['digital','tool','app','small app','automation','proposal','prompt','social','client sourcing'],
      title: 'Digital Tools & Small Apps',
      answer: 'SCG offers technology-enabled tools: Proposal Generator, Prompt Builder, Social Post Creator, Client Sourcing System, and the Loan/EMI Calculator. All tools are free to use on our Small Apps page.',
      links: [{text:'Small Apps',url:'small-apps/'},{text:'Loan Calculator',url:'small-apps/loan-calculator.html'}]
    },
    {
      keywords: ['financial solutions','shiva financial','finance website','finance portal'],
      title: 'Shiva Financial Solutions',
      answer: 'Shiva Financial Solutions is SCG\'s dedicated finance arm handling end-to-end financial advisory — project finance, debt syndication, MSME loans, IPO readiness, and more.',
      links: [{text:'Visit Portal',url:'https://rksjha.github.io/shiva-financial-solutions/'}]
    }
  ];

  var DEFAULT_ANSWER = {
    title: 'How can SCG help you?',
    answer: 'I can help you learn about SCG\'s services, products, government schemes, finance advisory, and more. Try asking about:\n• Government schemes (PMFME, MUDRA, NABARD)\n• Finance & loans (project finance, MSME loans)\n• Food processing & agri infrastructure\n• Institutional business services\n• Booking a consultation\n• Products (BioMagic)',
    links: [{text:'All Services',url:'services/'},{text:'Contact Us',url:'contact/'},{text:'Schedule Meeting',url:'calendar/'}]
  };

  function search(query){
    var q = query.toLowerCase();
    var best = null, bestScore = 0;
    KB.forEach(function(entry){
      var score = 0;
      entry.keywords.forEach(function(kw){
        if(q.indexOf(kw) !== -1) score += kw.split(' ').length + 1;
        kw.split(' ').forEach(function(w){
          if(w.length > 2 && q.indexOf(w) !== -1) score += 0.5;
        });
      });
      if(score > bestScore){ bestScore = score; best = entry; }
    });
    return bestScore >= 1 ? best : DEFAULT_ANSWER;
  }

  /* ── Inject CSS ── */
  var css = `
    #scg-ai-btn{position:fixed;bottom:28px;right:28px;z-index:9998;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#0d2b5e,#1a4a9e);border:2px solid #c9900c;cursor:pointer;box-shadow:0 4px 20px rgba(13,43,94,.45);display:flex;align-items:center;justify-content:center;font-size:26px;transition:transform .2s,box-shadow .2s;animation:scg-ai-pop .5s ease-out}
    #scg-ai-btn:hover{transform:scale(1.1);box-shadow:0 8px 30px rgba(13,43,94,.55)}
    #scg-ai-btn .ai-badge{position:absolute;top:-4px;right:-4px;background:#c9900c;color:#fff;font-size:9px;font-weight:700;border-radius:10px;padding:2px 6px;text-transform:uppercase}
    #scg-ai-panel{position:fixed;bottom:100px;right:24px;z-index:9999;width:380px;max-width:calc(100vw - 32px);background:#fff;border-radius:16px;box-shadow:0 12px 48px rgba(13,43,94,.22);border:1px solid #dde3ee;overflow:hidden;display:none;flex-direction:column;animation:scg-ai-slide .28s ease-out;font-family:'Segoe UI','Helvetica Neue',Arial,sans-serif}
    #scg-ai-panel.open{display:flex}
    .scg-ai-head{background:linear-gradient(135deg,#0d2b5e,#1a4a9e);padding:16px 18px;display:flex;align-items:center;gap:12px}
    .scg-ai-head-icon{width:40px;height:40px;border-radius:50%;background:rgba(201,144,12,.2);border:1.5px solid #c9900c;display:flex;align-items:center;justify-content:center;font-size:20px}
    .scg-ai-head-title{color:#fff;font-size:14px;font-weight:700}
    .scg-ai-head-sub{color:rgba(255,255,255,.65);font-size:11px;margin-top:2px}
    .scg-ai-close{margin-left:auto;background:rgba(255,255,255,.12);border:none;color:#fff;width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:background .15s}
    .scg-ai-close:hover{background:rgba(255,255,255,.25)}
    .scg-ai-chat{padding:14px 18px;max-height:340px;overflow-y:auto;flex:1}
    .scg-ai-msg{margin-bottom:12px;animation:scg-ai-fade .3s ease-out}
    .scg-ai-msg.user{text-align:right}
    .scg-ai-msg.user .bubble{background:#0d2b5e;color:#fff;display:inline-block;padding:8px 14px;border-radius:12px 12px 2px 12px;font-size:13px;max-width:85%}
    .scg-ai-msg.bot .bubble{background:#f4f6fb;color:#1a1a2e;padding:12px 14px;border-radius:12px 12px 12px 2px;font-size:13px;max-width:92%;border:1px solid #eef0f5}
    .scg-ai-msg.bot .bubble h4{color:#0d2b5e;font-size:13px;margin:0 0 6px}
    .scg-ai-msg.bot .bubble p{margin:0;line-height:1.5;white-space:pre-line;font-size:12.5px}
    .scg-ai-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
    .scg-ai-link{background:#0d2b5e;color:#fff;text-decoration:none;padding:5px 12px;border-radius:16px;font-size:11px;font-weight:600;transition:background .15s}
    .scg-ai-link:hover{background:#1a4a9e}
    .scg-ai-input-area{padding:12px 18px;border-top:1px solid #eef0f5;display:flex;gap:8px;align-items:center}
    #scg-ai-input{flex:1;border:1.5px solid #dde3ee;border-radius:10px;padding:10px 14px;font-size:13px;font-family:inherit;color:#1a1a2e;outline:none;transition:border-color .15s;resize:none;height:40px}
    #scg-ai-input:focus{border-color:#0d2b5e}
    #scg-ai-send{background:linear-gradient(135deg,#0d2b5e,#1a4a9e);color:#fff;border:none;border-radius:10px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer;transition:opacity .15s;white-space:nowrap}
    #scg-ai-send:hover{opacity:.88}
    @keyframes scg-ai-pop{from{transform:scale(0) rotate(-15deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
    @keyframes scg-ai-slide{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes scg-ai-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    @media(max-width:400px){#scg-ai-btn{bottom:16px;right:16px;width:52px;height:52px;font-size:22px}#scg-ai-panel{bottom:80px;right:8px;width:calc(100vw - 16px)}}
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ── Inject HTML ── */
  var btn = document.createElement('button');
  btn.id = 'scg-ai-btn';
  btn.setAttribute('aria-label', 'Open SCG Assistant');
  btn.innerHTML = '\uD83E\uDD16<span class="ai-badge">SCG</span>';

  var panel = document.createElement('div');
  panel.id = 'scg-ai-panel';
  panel.innerHTML =
    '<div class="scg-ai-head">' +
      '<div class="scg-ai-head-icon">\uD83D\uDCAC</div>' +
      '<div><div class="scg-ai-head-title">SCG Knowledge Assistant</div>' +
      '<div class="scg-ai-head-sub">Ask about our services, schemes & products</div></div>' +
      '<button class="scg-ai-close" id="scg-ai-close">\u2715</button>' +
    '</div>' +
    '<div class="scg-ai-chat" id="scg-ai-chat"></div>' +
    '<div class="scg-ai-input-area">' +
      '<input type="text" id="scg-ai-input" placeholder="Ask about SCG services...">' +
      '<button id="scg-ai-send">Send</button>' +
    '</div>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var chat = document.getElementById('scg-ai-chat');

  function addMsg(type, html){
    var div = document.createElement('div');
    div.className = 'scg-ai-msg ' + type;
    div.innerHTML = '<div class="bubble">' + html + '</div>';
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function makeLinks(links){
    if(!links || !links.length) return '';
    var html = '<div class="scg-ai-links">';
    links.forEach(function(l){
      var href = l.url.indexOf('http') === 0 ? l.url : SITE + l.url;
      html += '<a class="scg-ai-link" href="' + href + '" target="_blank">' + l.text + '</a>';
    });
    return html + '</div>';
  }

  function handleQuery(q){
    if(!q.trim()) return;
    addMsg('user', q);
    var result = search(q);
    setTimeout(function(){
      var html = '<h4>' + result.title + '</h4><p>' + result.answer + '</p>' + makeLinks(result.links);
      addMsg('bot', html);
    }, 300);
  }

  // Welcome message
  setTimeout(function(){
    var w = DEFAULT_ANSWER;
    addMsg('bot', '<h4>Welcome to SCG!</h4><p>I\'m the SCG Knowledge Assistant. Ask me anything about our services, government schemes, finance advisory, products, or how to book a consultation.</p>' + makeLinks(w.links));
  }, 500);

  /* ── Events ── */
  btn.addEventListener('click', function(){ panel.classList.toggle('open'); });
  document.getElementById('scg-ai-close').addEventListener('click', function(){ panel.classList.remove('open'); });
  document.getElementById('scg-ai-send').addEventListener('click', function(){
    var input = document.getElementById('scg-ai-input');
    handleQuery(input.value); input.value = '';
  });
  document.getElementById('scg-ai-input').addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      e.preventDefault();
      document.getElementById('scg-ai-send').click();
    }
  });
  document.addEventListener('click', function(e){
    if(!panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)){
      panel.classList.remove('open');
    }
  });

})();
