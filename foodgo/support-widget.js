(() => {
  const SUPPORT = {
    phoneDisplay: "+966 56 025 9410",
    phoneHref: "tel:+966500000000",
    whatsappHref: "https://wa.me/966560259410?text=Hi%20FoodGo%20Support",
    emailHref: "mailto:support@foodgo.example?subject=FoodGo%20Support",
    faqHref: "faq.html",
    fabColor: "#111827" 
  };

  const host = document.createElement("div");
  host.id = "fg-support-host";
  document.body.appendChild(host);
  const root = host.attachShadow({ mode: "open" });

  const css = `
:host{all:initial}
*,*::before,*::after{box-sizing:border-box;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial}
.fab{position:fixed;right:20px;bottom:20px;width:56px;height:56px;border:0;border-radius:999px;
  display:grid;place-items:center;color:#fff;background:${SUPPORT.fabColor};box-shadow:0 8px 24px rgba(0,0,0,.25);
  cursor:pointer;z-index:100000}
.fab:focus{outline:3px solid #22c55e;outline-offset:2px}
.backdrop{position:fixed;inset:0;background:rgba(0,0,0,.35);display:none;z-index:99998}
.backdrop.show{display:block}
.sheet{position:fixed;left:0;right:0;bottom:0;margin:0 auto;max-width:520px;background:#fff;border-radius:20px 20px 0 0;
  box-shadow:0 -10px 30px rgba(0,0,0,.18);transform:translateY(100%);transition:transform .25s ease;z-index:99999}
.sheet.open{transform:translateY(0)}
.head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #e5e7eb}
.title{margin:0;font-size:16px;font-weight:700;color:#111827}
.close{border:0;background:transparent;color:#6b7280;font-size:26px;cursor:pointer}
.body{display:grid;gap:10px;padding:12px 16px 16px}
.item{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:14px;background:#f9fafb;
  border:1px solid #e5e7eb;color:#111827;text-decoration:none;font-weight:700}
.item small{color:#6b7280;font-weight:500}
.item:hover{background:#f3f4f6}
.row{display:flex;align-items:center;gap:10px}
.icon{width:24px;height:24px;display:inline-grid;place-items:center}
  `;

  const html = `
<button class="fab" id="fgFab" aria-expanded="false" aria-controls="fgSheet" aria-label="Open customer support">
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M12 3a7 7 0 00-7 7v2a3 3 0 003 3h1v-6H8a5 5 0 0110 0h-1v6h1a3 3 0 003-3v-2a7 7 0 00-7-7zM7 16v2a3 3 0 003 3h2v-2h-2a1 1 0 01-1-1v-2H7zm10 0v2a1 1 0 01-1 1h-2v2h2a3 3 0 003-3v-2h-2z"></path>
  </svg>
</button>

<div class="backdrop" id="fgBackdrop"></div>

<section class="sheet" id="fgSheet" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="head">
    <h3 class="title">Customer Support</h3>
    <button class="close" id="fgClose" aria-label="Close support">&times;</button>
  </div>
  <div class="body">
    <a class="item" href="${SUPPORT.phoneHref}">
      <span class="row"><span class="icon">📞</span> Call us</span>
      <small>(${SUPPORT.phoneDisplay})</small>
    </a>
    <a class="item" target="_blank" rel="noopener" href="${SUPPORT.whatsappHref}">
      <span class="row"><span class="icon">💬</span> WhatsApp</span>
      <small>Chat now</small>
    </a>
    <a class="item" href="${SUPPORT.emailHref}">
      <span class="row"><span class="icon">✉️</span> Email Support</span>
      <small>We reply ASAP</small>
    </a>
    <a class="item" href="${SUPPORT.faqHref}">
      <span class="row"><span class="icon">❓</span> FAQs</span>
      <small>Common questions</small>
    </a>
  </div>
</section>
  `;

  const s = document.createElement("style"); s.textContent = css; root.appendChild(s);
  const box = document.createElement("div"); box.innerHTML = html; root.appendChild(box);

  const fab = root.getElementById("fgFab");
  const sheet = root.getElementById("fgSheet");
  const closeBtn = root.getElementById("fgClose");
  const backdrop = root.getElementById("fgBackdrop");
  let lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    fab.setAttribute("aria-expanded", "true");
    backdrop.classList.add("show");
    closeBtn.focus();
  }
  function close() {
    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden", "true");
    fab.setAttribute("aria-expanded", "false");
    backdrop.classList.remove("show");
    if (lastFocus) try { lastFocus.focus(); } catch(_) {}
  }

  fab.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", e => { if (e.target === backdrop) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && sheet.classList.contains("open")) close(); });
})();
