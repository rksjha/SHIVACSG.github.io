/* ============================================================
   SCG × OpenClaw AI Assistant Widget
   Floating AI helper — powered by OpenClaw (openclaw.ai)
   Works on any static page. No backend required.
   ============================================================ */

(function () {
  'use strict';

  var WIDGET_ID   = 'scg-oc-widget';
  var PANEL_ID    = 'scg-oc-panel';
  var OC_BASE_URL = 'https://openclaw.ai';
  var SCG_CONTEXT = 'I am visiting the Shiva Consultancy Group website. ';

  /* ---------- Inject CSS ---------- */
  var css = `
    #scg-oc-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9998;
      width: 60px; height: 60px; border-radius: 50%;
      background: linear-gradient(135deg, #0d2b5e 0%, #1a4a9e 100%);
      border: 2px solid #c9900c; cursor: pointer;
      box-shadow: 0 4px 20px rgba(13,43,94,0.45);
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; transition: transform .2s, box-shadow .2s;
      animation: scg-oc-pop .5s ease-out;
    }
    #scg-oc-btn:hover { transform: scale(1.1); box-shadow: 0 8px 30px rgba(13,43,94,0.55); }
    #scg-oc-btn .scg-oc-badge {
      position: absolute; top: -4px; right: -4px;
      background: #c9900c; color: #fff; font-size: 9px; font-weight: 700;
      border-radius: 10px; padding: 2px 5px; letter-spacing: .3px;
      text-transform: uppercase;
    }
    #scg-oc-panel {
      position: fixed; bottom: 100px; right: 24px; z-index: 9999;
      width: 340px; max-width: calc(100vw - 32px);
      background: #fff; border-radius: 16px;
      box-shadow: 0 12px 48px rgba(13,43,94,0.22);
      border: 1px solid #dde3ee; overflow: hidden;
      display: none; flex-direction: column;
      animation: scg-oc-slide .28s ease-out;
      font-family: 'Segoe UI','Helvetica Neue',Arial,sans-serif;
    }
    #scg-oc-panel.open { display: flex; }
    .scg-oc-head {
      background: linear-gradient(135deg, #0d2b5e 0%, #1a4a9e 100%);
      padding: 16px 18px; display: flex; align-items: center; gap: 12px;
    }
    .scg-oc-head-icon {
      width: 40px; height: 40px; border-radius: 50%;
      background: rgba(201,144,12,0.2); border: 1.5px solid #c9900c;
      display: flex; align-items: center; justify-content: center; font-size: 20px;
    }
    .scg-oc-head-title { color: #fff; font-size: 14px; font-weight: 700; line-height: 1.2; }
    .scg-oc-head-sub { color: rgba(255,255,255,.65); font-size: 11px; margin-top: 2px; }
    .scg-oc-close {
      margin-left: auto; background: rgba(255,255,255,.12); border: none;
      color: #fff; width: 28px; height: 28px; border-radius: 50%;
      cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;
      transition: background .15s;
    }
    .scg-oc-close:hover { background: rgba(255,255,255,.25); }
    .scg-oc-body { padding: 16px 18px; }
    .scg-oc-label {
      font-size: 11px; font-weight: 700; color: #5a6a7e;
      text-transform: uppercase; letter-spacing: .6px; margin-bottom: 8px;
    }
    #scg-oc-input {
      width: 100%; border: 1.5px solid #dde3ee; border-radius: 10px;
      padding: 10px 14px; font-size: 13px; resize: none; height: 76px;
      font-family: inherit; color: #1a1a2e; outline: none;
      transition: border-color .15s;
    }
    #scg-oc-input:focus { border-color: #0d2b5e; }
    #scg-oc-ask {
      margin-top: 10px; width: 100%;
      background: linear-gradient(135deg, #0d2b5e 0%, #1a4a9e 100%);
      color: #fff; border: none; border-radius: 10px; padding: 11px;
      font-size: 13px; font-weight: 700; cursor: pointer; letter-spacing: .3px;
      transition: opacity .15s;
    }
    #scg-oc-ask:hover { opacity: .88; }
    .scg-oc-divider { border: none; border-top: 1px solid #eef0f5; margin: 14px 0 10px; }
    .scg-oc-quicklinks { display: flex; flex-direction: column; gap: 6px; }
    .scg-oc-quick {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 12px; border-radius: 9px;
      background: #f4f6fb; text-decoration: none;
      color: #1a1a2e; font-size: 12.5px; font-weight: 500;
      transition: background .15s, color .15s;
    }
    .scg-oc-quick:hover { background: #0d2b5e; color: #fff; }
    .scg-oc-quick .qi { font-size: 16px; flex-shrink: 0; }
    .scg-oc-footer {
      padding: 10px 18px; background: #f4f6fb;
      border-top: 1px solid #eef0f5; text-align: center;
      font-size: 10.5px; color: #8a9ab0;
    }
    .scg-oc-footer a { color: #0d2b5e; text-decoration: none; font-weight: 600; }
    @keyframes scg-oc-pop { from { transform: scale(0) rotate(-15deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }
    @keyframes scg-oc-slide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @media (max-width: 400px) {
      #scg-oc-btn { bottom: 16px; right: 16px; width: 52px; height: 52px; font-size: 22px; }
      #scg-oc-panel { bottom: 80px; right: 8px; width: calc(100vw - 16px); }
    }
  `;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Inject HTML ---------- */
  var btn = document.createElement('button');
  btn.id = 'scg-oc-btn';
  btn.setAttribute('aria-label', 'Open AI Assistant');
  btn.innerHTML = '🤖<span class="scg-oc-badge">AI</span>';

  var panel = document.createElement('div');
  panel.id = PANEL_ID;
  panel.innerHTML = `
    <div class="scg-oc-head">
      <div class="scg-oc-head-icon">🦞</div>
      <div>
        <div class="scg-oc-head-title">SCG AI Assistant</div>
        <div class="scg-oc-head-sub">Powered by OpenClaw · Always available</div>
      </div>
      <button class="scg-oc-close" id="scg-oc-close-btn" aria-label="Close">✕</button>
    </div>
    <div class="scg-oc-body">
      <div class="scg-oc-label">Ask anything about SCG</div>
      <textarea id="scg-oc-input" placeholder="e.g. How can SCG help with MSME funding? What services do you offer?"></textarea>
      <button id="scg-oc-ask">Ask AI Assistant ›</button>
      <hr class="scg-oc-divider">
      <div class="scg-oc-label">Quick links</div>
      <div class="scg-oc-quicklinks">
        <a class="scg-oc-quick" href="https://rksjha.github.io/SHIVACSG/contact/" target="_self">
          <span class="qi">📩</span> Contact Shiva Consultancy Group
        </a>
        <a class="scg-oc-quick" href="https://rksjha.github.io/shiva-financial-solutions/" target="_blank">
          <span class="qi">💰</span> Shiva Financial Solutions
        </a>
        <a class="scg-oc-quick" href="https://wa.me/919979021275?text=Hello+SCG+Team%2C+I+have+a+query." target="_blank">
          <span class="qi">💬</span> WhatsApp SCG Now
        </a>
        <a class="scg-oc-quick" href="https://openclaw.ai" target="_blank">
          <span class="qi">🦞</span> Get OpenClaw AI Assistant
        </a>
      </div>
    </div>
    <div class="scg-oc-footer">
      AI assistant powered by <a href="https://openclaw.ai" target="_blank">OpenClaw</a> &nbsp;·&nbsp;
      <a href="https://github.com/rksjha/openclaw" target="_blank">GitHub</a>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  /* ---------- Toggle ---------- */
  btn.addEventListener('click', function () {
    panel.classList.toggle('open');
  });

  document.getElementById('scg-oc-close-btn').addEventListener('click', function () {
    panel.classList.remove('open');
  });

  /* ---------- Ask AI ---------- */
  document.getElementById('scg-oc-ask').addEventListener('click', function () {
    var q = (document.getElementById('scg-oc-input').value || '').trim();
    if (!q) { document.getElementById('scg-oc-input').focus(); return; }
    var encoded = encodeURIComponent(SCG_CONTEXT + q);
    window.open(OC_BASE_URL + '/?message=' + encoded, '_blank');
  });

  document.getElementById('scg-oc-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('scg-oc-ask').click();
    }
  });

  /* ---------- Close on outside click ---------- */
  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && e.target !== btn) {
      panel.classList.remove('open');
    }
  });

})();
