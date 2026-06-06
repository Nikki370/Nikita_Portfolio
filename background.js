(function () {

  /* ── 1. CANVAS ── */
  const canvas = document.createElement('canvas');
  canvas.id = 'bgCanvas';
  Object.assign(canvas.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    width:         '100vw',
    height:        '100vh',
    zIndex:        '0',
    pointerEvents: 'none',
    display:       'block',
  });
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  /* ── 2. FLOATING-CODE CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    body {
      overflow-x: hidden;
      min-height: 100vh;
    }
    .main-container {
      position: relative;
      z-index: 1;
    }
    .sidebar {
      animation: bgjs-slideL 0.9s cubic-bezier(.22,.68,0,1.2) both;
    }
    .main {
      animation: bgjs-slideR 0.9s cubic-bezier(.22,.68,0,1.2) both;
    }
    .profile img {
      animation: bgjs-pulse 2.5s ease-in-out infinite;
    }
    .floating-code {
      position: fixed;
      font-size: 11px;
      color: rgba(254,190,16,0.35);
      font-family: 'Courier New', monospace;
      pointer-events: none;
      z-index: 0;
      animation: bgjs-floatUp linear infinite;
    }
    @keyframes bgjs-slideL {
      from { opacity:0; transform:translateX(-40px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes bgjs-slideR {
      from { opacity:0; transform:translateX(40px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes bgjs-pulse {
      0%,100% { box-shadow: 0 0 0 0   rgba(255,215,0,0.4); }
      50%      { box-shadow: 0 0 0 10px rgba(255,215,0,0);   }
    }
    @keyframes bgjs-floatUp {
      0%   { opacity:0;   transform:translateY(0);       }
      10%  { opacity:1;                                  }
      90%  { opacity:0.3;                                }
      100% { opacity:0;   transform:translateY(-100vh);  }
    }
  `;
  document.head.appendChild(style);

  /* ── 3. DOT-NETWORK ── */
  let W, H, dots = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initDots() {
    dots = [];
    for (let i = 0; i < 70; i++) {
      dots.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r:  Math.random() * 1.8 + 0.5,
        a:  Math.random() * 0.5 + 0.15,
      });
    }
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(254,190,16,0.045)';
    ctx.lineWidth   = 0.5;
    for (let x = 0; x < W; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();

    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    });

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx   = dots[i].x - dots[j].x;
        const dy   = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(254,190,16,${0.14 * (1 - dist / 120)})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(254,190,16,${d.a})`;
      ctx.fill();
    });

    requestAnimationFrame(tick);
  }

  /* ── 4. FLOATING CODE WORDS ── */
  const words = [
    'const', 'def', 'import', 'SELECT', 'df.merge()', '.fit()',
    'numpy', 'pandas', 'return', 'model', 'SQL', '{ }',
    '=>', 'ML', 'API', 'JOIN', 'predict()', 'sklearn', 'seaborn',
  ];

  function spawnWord() {
    const el  = document.createElement('span');
    el.className   = 'floating-code';
    el.textContent = words[Math.floor(Math.random() * words.length)];
    el.style.left  = (Math.random() * 90 + 4) + '%';
    el.style.bottom = '-24px';
    const dur = (Math.random() * 10 + 9).toFixed(1) + 's';
    el.style.animationDuration = dur;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), parseFloat(dur) * 1000);
  }

  /* ── 5. BOOT ── */
  resize();
  initDots();
  tick();
  setInterval(spawnWord, 1400);
  window.addEventListener('resize', () => { resize(); initDots(); });

})();