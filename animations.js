// ============================================================
//  NUMEROLOG — Premium Animations Module
// ============================================================

/* ---- 1. Star / Particle Canvas ----------------------------- */
(function createStarfield() {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, stars = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = document.body.scrollHeight;
    }

    function Star() {
        this.reset();
    }
    Star.prototype.reset = function () {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.r = Math.random() * 1.4 + 0.2;
        this.a = Math.random();
        this.da = (Math.random() - 0.5) * 0.004;
        this.dx = (Math.random() - 0.5) * 0.12;
        this.dy = (Math.random() - 0.5) * 0.12;
        this.hue = Math.random() > 0.7 ? 270 : 190; // purple or cyan
    };

    function initStars(n) {
        stars = [];
        for (let i = 0; i < n; i++) stars.push(new Star());
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        stars.forEach(s => {
            s.a += s.da;
            if (s.a <= 0 || s.a >= 1) s.da *= -1;
            s.x += s.dx;
            s.y += s.dy;
            if (s.x < 0 || s.x > W || s.y < 0 || s.y > H) s.reset();

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${s.hue}, 90%, 80%, ${s.a})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    resize();
    initStars(200);
    draw();
    window.addEventListener('resize', () => { resize(); initStars(200); });
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
