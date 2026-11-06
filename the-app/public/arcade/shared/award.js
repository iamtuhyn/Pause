/*
 * Mini Arcade awards.
 * Award.unlock({ gameId, gameName, tier, title, line, stats, accent, glyph, onClose })
 *   tier: 'bronze' | 'silver' | 'gold'
 *   stats: up to 3 [label, value] pairs shown on the share image
 * Shows a modal with a 1200x630 share card the player can download as PNG.
 */
(function () {
  // Inside a host app's frame, the host owns navigation: base.css hides the back link.
  if (window.top !== window.self) document.documentElement.classList.add('embedded');

  const TIERS = {
    bronze: { label: 'Bronze', c1: '#f3b98a', c2: '#9a5b2c', ink: '#3b1f0b' },
    silver: { label: 'Silver', c1: '#f4f7fb', c2: '#8e9aab', ink: '#2a313c' },
    gold:   { label: 'Gold',   c1: '#ffe9a3', c2: '#c98d10', ink: '#4a3204' },
  };
  const ORDER = ['bronze', 'silver', 'gold'];
  const KEY = 'miniArcade.awards.v1';
  const FONT = 'ui-rounded, "SF Pro Rounded", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* private mode */ }
  }
  function earned(gameId) { return load()[gameId] || {}; }

  function fitText(ctx, text, maxWidth, size, weight) {
    let s = size;
    do {
      ctx.font = `${weight} ${s}px ${FONT}`;
      if (ctx.measureText(text).width <= maxWidth) break;
      s -= 2;
    } while (s > 18);
    return s;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function render(o) {
    const W = 1200, H = 630;
    const tier = TIERS[o.tier] || TIERS.bronze;
    const accent = o.accent || '#7cc8ff';
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    // Background
    ctx.fillStyle = '#0b0d14';
    ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(300, 315, 20, 300, 315, 620);
    glow.addColorStop(0, accent + '55');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Dot grid
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let y = 30; y < H; y += 30) for (let x = 30; x < W; x += 30) ctx.fillRect(x, y, 2, 2);

    // Ribbon
    const mx = 300, my = 330, R = 150;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(mx - 95, 40); ctx.lineTo(mx - 25, 40); ctx.lineTo(mx + 30, my - 110); ctx.lineTo(mx - 40, my - 110);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = shade(accent, -0.25);
    ctx.beginPath();
    ctx.moveTo(mx + 95, 40); ctx.lineTo(mx + 25, 40); ctx.lineTo(mx - 30, my - 110); ctx.lineTo(mx + 40, my - 110);
    ctx.closePath(); ctx.fill();

    // Medal
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 14;
    const mg = ctx.createLinearGradient(mx - R, my - R, mx + R, my + R);
    mg.addColorStop(0, tier.c1);
    mg.addColorStop(1, tier.c2);
    ctx.fillStyle = mg;
    ctx.beginPath(); ctx.arc(mx, my, R, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(mx, my, R - 18, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(mx, my, R - 26, 0, Math.PI * 2); ctx.stroke();

    ctx.fillStyle = tier.ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `800 104px ${FONT}`;
    ctx.fillText(o.glyph || '★', mx, my + 4);
    ctx.font = `800 20px ${FONT}`;
    ctx.fillText(tier.label.toUpperCase(), mx, my + 88);

    // Text block
    const tx = 540, tw = 600;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = accent;
    ctx.font = `700 22px ${FONT}`;
    ctx.fillText(('Mini Arcade  ·  ' + (o.gameName || '')).toUpperCase(), tx, 150);

    ctx.fillStyle = '#ffffff';
    const ts = fitText(ctx, o.title || 'Award', tw, 72, 800);
    ctx.font = `800 ${ts}px ${FONT}`;
    ctx.fillText(o.title || 'Award', tx, 232);

    ctx.fillStyle = '#aab1c4';
    const ls = fitText(ctx, o.line || '', tw, 30, 500);
    ctx.font = `500 ${ls}px ${FONT}`;
    ctx.fillText(o.line || '', tx, 284);

    // Stats
    const stats = (o.stats || []).slice(0, 3);
    const gap = 16;
    const bw = stats.length ? (tw - gap * (stats.length - 1)) / stats.length : 0;
    stats.forEach(([label, value], i) => {
      const bx = tx + i * (bw + gap), by = 330;
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      roundRect(ctx, bx, by, bw, 130, 18); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.09)';
      ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#ffffff';
      const vs = fitText(ctx, String(value), bw - 36, 52, 800);
      ctx.font = `800 ${vs}px ${FONT}`;
      ctx.fillText(String(value), bx + 18, by + 72);
      ctx.fillStyle = '#8d94a8';
      ctx.font = `600 18px ${FONT}`;
      ctx.fillText(String(label).toUpperCase(), bx + 18, by + 108);
    });

    // Footer
    ctx.fillStyle = '#5d6478';
    ctx.font = `600 18px ${FONT}`;
    const date = new Date(o.date || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    ctx.fillText(`${tier.label} award  ·  ${date}`, tx, 540);

    return c;
  }

  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + (amt < 0 ? v * amt : (255 - v) * amt))));
    const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  // ---------- Modal ----------
  let styleAdded = false;
  let openModal = null;

  function addStyle() {
    if (styleAdded) return;
    styleAdded = true;
    const s = document.createElement('style');
    s.textContent = `
      .aw-overlay{position:fixed;inset:0;background:rgba(5,6,10,.78);backdrop-filter:blur(6px);
        display:flex;align-items:center;justify-content:center;padding:16px;z-index:1000;animation:aw-in .25s ease}
      .aw-card{background:#141824;border:1px solid #262c3d;border-radius:18px;max-width:640px;width:100%;
        padding:20px;color:#e9ecf5;font-family:${FONT};box-shadow:0 30px 80px rgba(0,0,0,.5);animation:aw-pop .35s cubic-bezier(.2,1.4,.4,1)}
      .aw-kicker{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8d94a8;margin:0 0 4px}
      .aw-card h2{margin:0 0 14px;font-size:22px}
      .aw-card img{width:100%;border-radius:12px;display:block;border:1px solid #262c3d}
      .aw-actions{display:flex;gap:10px;margin-top:16px;flex-wrap:wrap}
      .aw-actions button{font:inherit;font-size:14px;font-weight:600;border-radius:10px;padding:10px 16px;cursor:pointer;
        border:1px solid #262c3d;background:#1b2030;color:#e9ecf5}
      .aw-actions button.aw-primary{background:var(--aw-accent);border-color:var(--aw-accent);color:#0b0d14}
      .aw-actions .aw-sp{flex:1}
      @keyframes aw-in{from{opacity:0}to{opacity:1}}
      @keyframes aw-pop{from{transform:scale(.9);opacity:0}to{transform:none;opacity:1}}
    `;
    document.head.appendChild(s);
  }

  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

  function show(o, isNew) {
    addStyle();
    close();
    const canvas = render(o);
    const tier = TIERS[o.tier] || TIERS.bronze;
    const overlay = document.createElement('div');
    overlay.className = 'aw-overlay';
    overlay.style.setProperty('--aw-accent', o.accent || '#7cc8ff');
    overlay.innerHTML = `
      <div class="aw-card" role="dialog" aria-modal="true" aria-label="Award">
        <p class="aw-kicker">${isNew === false ? 'Award' : 'Award unlocked'} · ${tier.label}</p>
        <h2></h2>
        <img alt="Share card for this award">
        <div class="aw-actions">
          <button class="aw-primary" data-a="dl">Download image</button>
          <button data-a="share" hidden>Share…</button>
          <span class="aw-sp"></span>
          <button data-a="close">Keep playing</button>
        </div>
      </div>`;
    overlay.querySelector('h2').textContent = o.title;
    overlay.querySelector('img').src = canvas.toDataURL('image/png');
    const filename = `${slug(o.gameName)}-${o.tier}-award.png`;

    const shareBtn = overlay.querySelector('[data-a="share"]');
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        shareBtn.hidden = false;
        shareBtn.onclick = () => navigator.share({ files: [file], title: o.title }).catch(() => {});
      }
    });

    overlay.querySelector('[data-a="dl"]').onclick = () => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      });
    };
    const done = () => { close(); if (o.onClose) o.onClose(); };
    overlay.querySelector('[data-a="close"]').onclick = done;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) done(); });
    overlay._key = (e) => { if (e.key === 'Escape') { e.stopPropagation(); done(); } };
    window.addEventListener('keydown', overlay._key, true);
    document.body.appendChild(overlay);
    openModal = overlay;
    overlay.querySelector('.aw-primary').focus();
  }

  function close() {
    if (!openModal) return;
    window.removeEventListener('keydown', openModal._key, true);
    openModal.remove();
    openModal = null;
  }

  function unlock(o) {
    const all = load();
    const g = all[o.gameId] || (all[o.gameId] = {});
    const isNew = !g[o.tier];
    const record = { ...o, date: Date.now() };
    delete record.onClose;
    g[o.tier] = record;
    save(all);
    show(record.date ? { ...o, date: record.date } : o, isNew);
  }

  window.Award = { unlock, show, render, earned, isOpen: () => !!openModal, TIERS, ORDER };
})();
