/* ==============================================
   animations.js — Portfólio André
   Regras:
   - Zero alterações no HTML/CSS/style original
   - Canvas injetado DENTRO do .bg-grid (herda z-index 0, fixed, inset 0)
   - Seções e textos ficam exatamente onde estão (z-index 1)
   - Cursor só em desktop (pointer: fine)
   - Scroll reveal sem mover elementos fora do fluxo
   ============================================== */

(function () {
  'use strict';

  /* ────────────────────────────────────────────
     1. CANVAS DE PARTÍCULAS — dentro do .bg-grid
     O .bg-grid já é fixed/inset:0/z-index:0.
     O canvas herda tudo isso sem precisar de CSS extra.
  ──────────────────────────────────────────── */
  const bgGrid = document.querySelector('.bg-grid');
  if (bgGrid) {
    const canvas = document.createElement('canvas');

    // Canvas preenche o mesmo espaço do bg-grid
    canvas.style.cssText = [
      'position:absolute',
      'inset:0',
      'width:100%',
      'height:100%',
      'pointer-events:none',
      'display:block',
    ].join(';');

    bgGrid.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const R   = (min, max) => Math.random() * (max - min) + min;
    const ACCENT = ['99,179,237', '159,122,234', '104,211,145'];

    /* Partículas pequenas (estrelas) */
    const STARS = Array.from({ length: 60 }, () => ({
      x: R(0, window.innerWidth),
      y: R(0, window.innerHeight),
      r: R(0.5, 2),
      vx: R(-0.12, 0.12),
      vy: R(-0.18, -0.05),
      a: R(0.1, 0.5),
      da: R(0.005, 0.018) * (Math.random() > .5 ? 1 : -1),
      c: ACCENT[Math.floor(Math.random() * 3)],
    }));

    /* Manchas de brilho difuso */
    const GLOWS = Array.from({ length: 6 }, () => ({
      x: R(0, window.innerWidth),
      y: R(0, window.innerHeight),
      r: R(80, 180),
      vx: R(-0.03, 0.03),
      vy: R(-0.03, 0.03),
      a: R(0.012, 0.032),
      c: ACCENT[Math.floor(Math.random() * 3)],
    }));

    function tick() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* Brilhos difusos */
      GLOWS.forEach(g => {
        g.x += g.vx; g.y += g.vy;
        if (g.x < -g.r) g.x = W + g.r;
        if (g.x > W + g.r) g.x = -g.r;
        if (g.y < -g.r) g.y = H + g.r;
        if (g.y > H + g.r) g.y = -g.r;

        const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
        grad.addColorStop(0, `rgba(${g.c},${g.a})`);
        grad.addColorStop(1, `rgba(${g.c},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fill();
      });

      /* Estrelas */
      STARS.forEach(s => {
        s.x += s.vx; s.y += s.vy;
        s.a += s.da;
        if (s.a > 0.55 || s.a < 0.06) s.da *= -1;
        if (s.y < -4) { s.y = H + 4; s.x = R(0, W); }
        if (s.x < -4) s.x = W + 4;
        if (s.x > W + 4) s.x = -4;

        ctx.globalAlpha = s.a;
        ctx.fillStyle = `rgb(${s.c})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }

    tick();

    window.addEventListener('resize', () => {
      GLOWS.forEach(g => { g.x = R(0, canvas.width); g.y = R(0, canvas.height); });
    });
  }

  /* ────────────────────────────────────────────
     2. CURSOR CUSTOMIZADO — só desktop (pointer:fine)
     Dois elementos absolutos, zero CSS externo.
  ──────────────────────────────────────────── */
  if (window.matchMedia('(pointer:fine)').matches && !('ontouchstart' in window) && navigator.maxTouchPoints === 0) {

    const S = (props) => {
      const el = document.createElement('div');
      el.style.cssText = [
        'position:fixed',
        'border-radius:50%',
        'pointer-events:none',
        'z-index:9999',
        'transform:translate(-50%,-50%)',
        'will-change:left,top',
        ...props,
      ].join(';');
      document.body.appendChild(el);
      return el;
    };

    const dot  = S(['width:6px','height:6px','background:rgb(99,179,237)','transition:transform .1s']);
    const ring = S([
      'width:30px','height:30px',
      'border:1px solid rgba(99,179,237,.5)',
      'transition:width .2s,height .2s,border-color .2s',
    ]);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    // Oculta quando sai da janela
    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });

    // Expande o ring em elementos clicáveis
    const hoverEls = 'a,button,.card,.skill-card,.contact-btn,.project-card,.tag,.subject-item,.btn,.edu-card';
    document.querySelectorAll(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width  = '44px';
        ring.style.height = '44px';
        ring.style.borderColor = 'rgba(99,179,237,.9)';
        ring.style.background  = 'rgba(99,179,237,.05)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width  = '30px';
        ring.style.height = '30px';
        ring.style.borderColor = 'rgba(99,179,237,.5)';
        ring.style.background  = 'transparent';
      });
    });

    // Esconde cursor nativo apenas em desktop
    document.documentElement.style.cursor = 'none';
    document.querySelectorAll('a,button').forEach(el => el.style.cursor = 'none');

    function cursorLoop() {
      // dot: exato; ring: leve lag
      rx += (mx - rx) * 0.5;
      ry += (my - ry) * 0.5;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(cursorLoop);
    }
    cursorLoop();
  }

  /* ────────────────────────────────────────────
     3. SCROLL REVEAL
     Usa IntersectionObserver. Injeta apenas
     opacity e translateY via style inline —
     não altera layout nem z-indexes.
  ──────────────────────────────────────────── */
  const revealTargets = [
    '#sobre .card',
    '#educacao .edu-card',
    '#tecnologias .skill-card',
    '#projetos .project-card',
    '#projetos .empty-state',
    '#contato .contact-btn',
    '.gh-link',
    '.status-badge',
  ];

  const revealItems = [];

  revealTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      // Só aplica se o elemento não tem animação já definida pelo CSS original
      if (!el.style.animation && !el.style.opacity) {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity .65s ease ${i * 0.07}s, transform .65s ease ${i * 0.07}s`;
        revealItems.push(el);
      }
    });
  });

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity   = '1';
        e.target.style.transform = 'translateY(0)';
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealItems.forEach(el => revealObs.observe(el));

  /* ────────────────────────────────────────────
     4. SKILL BARS — anima de 0 até o valor real
     ao entrar na viewport
  ──────────────────────────────────────────── */
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const original = bar.style.width || '0%';
    bar.dataset.targetWidth = original;
    bar.style.width = '0%';
    bar.style.transition = 'width 1.1s cubic-bezier(.4,0,.2,1)';

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => { bar.style.width = bar.dataset.targetWidth; }, 150);
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    obs.observe(bar);
  });

  /* ────────────────────────────────────────────
     5. HOVER — melhora cards sem tocar no CSS
     Adiciona box-shadow e transform via evento,
     respeitando o transition original do CSS.
  ──────────────────────────────────────────── */
  const hoverCards = '.card,.skill-card,.project-card,.contact-btn';
  document.querySelectorAll(hoverCards).forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.boxShadow = '0 8px 28px rgba(99,179,237,.13)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = '';
    });
  });

  document.querySelectorAll('.edu-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.background = 'rgba(99,179,237,.03)';
      el.style.boxShadow  = '-3px 0 20px rgba(99,179,237,.1)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.background = '';
      el.style.boxShadow  = '';
    });
  });

  /* ────────────────────────────────────────────
     6. EFEITO DE DIGITAÇÃO no hero-greeting
     Só roda se o elemento existir e não tiver
     animação CSS ativa conflitante.
  ──────────────────────────────────────────── */
  const greeting = document.querySelector('.hero-greeting');
  if (greeting) {
    const fullText = greeting.textContent.trim();
    greeting.textContent = '';
    // Remove a animação fadeUp do CSS para não conflitar
    greeting.style.animation = 'none';
    greeting.style.opacity   = '1';

    // Cria cursor piscante
    const cur = document.createElement('span');
    cur.style.cssText = 'display:inline-block;width:2px;height:.85em;background:rgb(99,179,237);margin-left:2px;vertical-align:text-bottom;animation:none';
    let curVis = true;
    setInterval(() => { cur.style.opacity = (curVis = !curVis) ? '1' : '0'; }, 530);

    greeting.appendChild(cur);

    let i = 0;
    function type() {
      if (i <= fullText.length) {
        cur.insertAdjacentText('beforebegin', fullText[i - 1] || '');
        i++;
        setTimeout(type, 52);
      }
    }
    setTimeout(type, 400);
  }

})();
