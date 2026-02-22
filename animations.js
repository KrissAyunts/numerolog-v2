// ============================================================
//  NUMEROLOG — Premium Animations Module
// ============================================================

/* ---- 1. Star / Particle Canvas ----------------------------- */
(function createStarfield() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Canvas фиксирован на весь viewport
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';

    let W, H, stars = [], shooters = [];
    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    // ---- Обычные звёзды ----
    function Star() { this.reset(true); }
    Star.prototype.reset = function (initial) {
        this.x = Math.random() * W;
        this.y = initial ? Math.random() * H : Math.random() * H;
        this.r = Math.random() * 1.6 + 0.2;
        // Мигание через синусоиду
        this.phase = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.018 + 0.006;   // скорость мигания
        this.base = Math.random() * 0.4 + 0.2;        // минимальная яркость
        this.amp = Math.random() * 0.5 + 0.2;        // амплитуда
        // Очень медленный дрейф
        this.vx = (Math.random() - 0.5) * 0.06;
        this.vy = (Math.random() - 0.5) * 0.06;
        this.hue = Math.random() > 0.65 ? 270 : Math.random() > 0.5 ? 190 : 220;
        this.sat = Math.random() > 0.5 ? 80 : 0;  // часть звёзд белые
    };

    function initStars(n) {
        stars = [];
        for (let i = 0; i < n; i++) stars.push(new Star());
    }

    // ---- Падающие звёзды ----
    function Shooter() { this.init(); }
    Shooter.prototype.init = function () {
        this.x = Math.random() * W * 1.2 - W * 0.1;
        this.y = Math.random() * H * 0.4;
        const angle = Math.PI / 5 + Math.random() * 0.3;  // ~36-53°
        const spd = 6 + Math.random() * 6;
        this.vx = Math.cos(angle) * spd;
        this.vy = Math.sin(angle) * spd;
        this.len = 80 + Math.random() * 120;
        this.life = 1;
        this.decay = 0.018 + Math.random() * 0.012;
    };

    let lastShooterTime = 0;

    function spawnShooter(now) {
        if (now - lastShooterTime > 3500 + Math.random() * 4000) {
            shooters.push(new Shooter());
            lastShooterTime = now;
        }
    }

    // ---- Рендер ----
    let t = 0;
    function draw(now) {
        ctx.clearRect(0, 0, W, H);

        // Параллакс: сдвигаем звёзды чуть-чуть при скролле
        const parallaxOffset = scrollY * 0.04;

        // Обычные звёзды
        stars.forEach(s => {
            s.phase += s.speed;
            const alpha = s.base + s.amp * Math.sin(s.phase);

            s.x += s.vx;
            s.y += s.vy;
            if (s.x < -2 || s.x > W + 2 || s.y < -2 || s.y > H + 2) s.reset(false);

            const drawY = (s.y - parallaxOffset % H + H) % H;

            ctx.beginPath();
            ctx.arc(s.x, drawY, s.r, 0, Math.PI * 2);

            if (s.r > 1.2) {
                // Яркие звёзды — с лёгким свечением
                const grd = ctx.createRadialGradient(s.x, drawY, 0, s.x, drawY, s.r * 3);
                grd.addColorStop(0, `hsla(${s.hue}, ${s.sat}%, 95%, ${alpha})`);
                grd.addColorStop(1, `hsla(${s.hue}, ${s.sat}%, 80%, 0)`);
                ctx.fillStyle = grd;
                ctx.arc(s.x, drawY, s.r * 3, 0, Math.PI * 2);
            } else {
                ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 90%, ${alpha})`;
            }
            ctx.fill();
        });

        // Падающие звёзды
        spawnShooter(now);
        shooters = shooters.filter(sh => sh.life > 0);
        shooters.forEach(sh => {
            sh.x += sh.vx;
            sh.y += sh.vy;
            sh.life -= sh.decay;

            const tailX = sh.x - sh.vx * (sh.len / 8);
            const tailY = sh.y - sh.vy * (sh.len / 8);

            const grad = ctx.createLinearGradient(tailX, tailY, sh.x, sh.y);
            grad.addColorStop(0, `rgba(255,255,255,0)`);
            grad.addColorStop(1, `rgba(200,180,255,${sh.life * 0.9})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(sh.x, sh.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Голова звезды
            ctx.beginPath();
            ctx.arc(sh.x, sh.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${sh.life})`;
            ctx.fill();
        });

        t++;
        requestAnimationFrame(draw);
    }

    resize();
    initStars(220);
    requestAnimationFrame(draw);
    window.addEventListener('resize', () => { resize(); initStars(220); });
})();




/* ---- 2. Scroll-Reveal (Intersection Observer) -------------- */
(function scrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('revealed');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
})();


/* ---- 3. Animated Number Counters --------------------------- */
(function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const duration = 1800;
            let start = null;

            function step(ts) {
                if (!start) start = ts;
                const progress = Math.min((ts - start) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                const current = Math.floor(easedProgress * target);
                el.textContent = current + suffix;
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target + suffix;
            }
            requestAnimationFrame(step);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
})();


/* ---- 4. Typing Effect for Hero Title ----------------------- */
(function typingEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    el.style.visibility = 'visible';
    let i = 0;
    const speed = 45;
    function type() {
        if (i < text.length) {
            el.textContent += text[i++];
            setTimeout(type, speed);
        }
    }
    setTimeout(type, 500);
})();


/* ---- 5. Ripple Effect on Buttons --------------------------- */
document.querySelectorAll('.hero-cta, .form-toggle-btn, .cta-button').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple-wave';
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
});


/* ---- 6. Navbar active section highlight -------------------- */
(function navHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        links.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) a.classList.add('active');
        });
    }, { passive: true });
})();


/* ---- 7. Parallax on Hero Image ----------------------------- */
(function heroParallax() {
    const img = document.querySelector('.hero-image');
    if (!img) return;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        img.style.transform = `translateY(${y * 0.07}px)`;
    }, { passive: true });
})();


/* ---- 8. Glow-follow cursor for glass panels ---------------- */
(function cursorGlow() {
    document.querySelectorAll('.glass-panel').forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            panel.style.background = `
        radial-gradient(200px circle at ${x}px ${y}px,
          rgba(139,92,246,0.13), transparent 65%),
        rgba(30, 41, 59, 0.7)
      `;
        });
        panel.addEventListener('mouseleave', () => {
            panel.style.background = '';
        });
    });
})();
