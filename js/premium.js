(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* Cursor glow */
    if (finePointer && !prefersReduced) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        glow.setAttribute('aria-hidden', 'true');
        document.body.appendChild(glow);

        let gx = window.innerWidth / 2;
        let gy = window.innerHeight / 2;
        let tx = gx;
        let ty = gy;
        let rafId = null;

        function tick() {
            gx += (tx - gx) * 0.08;
            gy += (ty - gy) * 0.08;
            glow.style.transform = `translate(${gx}px, ${gy}px)`;
            rafId = requestAnimationFrame(tick);
        }

        document.addEventListener('mousemove', (e) => {
            tx = e.clientX;
            ty = e.clientY;
            document.body.classList.add('cursor-active');
            if (!rafId) rafId = requestAnimationFrame(tick);
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active');
        });
    }

    /* Hero particles */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg && !prefersReduced) {
        const particles = document.createElement('div');
        particles.className = 'hero-particles';
        particles.setAttribute('aria-hidden', 'true');

        for (let i = 0; i < 14; i++) {
            const p = document.createElement('span');
            p.className = 'hero-particle';
            p.style.left = `${8 + Math.random() * 84}%`;
            p.style.top = `${10 + Math.random() * 80}%`;
            p.style.setProperty('--duration', `${14 + Math.random() * 12}s`);
            p.style.setProperty('--delay', `${-Math.random() * 16}s`);
            p.style.setProperty('--opacity', `${0.15 + Math.random() * 0.35}`);
            p.style.setProperty('--drift-x', `${-30 + Math.random() * 60}px`);
            p.style.setProperty('--drift-y', `${-40 + Math.random() * 50}px`);
            particles.appendChild(p);
        }

        heroBg.appendChild(particles);

        const amb1 = document.createElement('div');
        amb1.className = 'hero-ambient hero-ambient--1';
        const amb2 = document.createElement('div');
        amb2.className = 'hero-ambient hero-ambient--2';
        heroBg.appendChild(amb1);
        heroBg.appendChild(amb2);

        requestAnimationFrame(() => heroBg.classList.add('is-active'));
    }

    /* Device parallax */
    const showcase = document.querySelector('.device-showcase');
    if (showcase && finePointer && !prefersReduced) {
        showcase.addEventListener('mousemove', (e) => {
            const rect = showcase.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            showcase.style.setProperty('--mouse-x', x.toFixed(4));
            showcase.style.setProperty('--mouse-y', y.toFixed(4));
        }, { passive: true });

        showcase.addEventListener('mouseleave', () => {
            showcase.style.setProperty('--mouse-x', '0');
            showcase.style.setProperty('--mouse-y', '0');
        });
    }

    /* Card tilt */
    if (finePointer && !prefersReduced) {
        document.querySelectorAll('.glass-card, .feature-card, .benefit-card').forEach(card => {
            card.classList.add('tilt-card');
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `translateY(-5px) perspective(800px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* Hero load sequence */
    function runHeroSequence() {
        const lines = document.querySelectorAll('.hero-line-inner');
        const badges = document.querySelectorAll('.trust-badge');
        const eyebrow = document.querySelector('.hero-content > .eyebrow.reveal');
        const text = document.querySelector('.hero-text.reveal');
        const buttons = document.querySelector('.hero-buttons.reveal');

        if (eyebrow) {
            setTimeout(() => eyebrow.classList.add('visible'), 200);
        }

        lines.forEach((line, i) => {
            setTimeout(() => line.classList.add('is-visible'), 380 + i * 180);
        });

        if (text) {
            setTimeout(() => text.classList.add('visible'), 780);
        }

        if (buttons) {
            setTimeout(() => buttons.classList.add('visible'), 980);
        }

        badges.forEach((badge, i) => {
            setTimeout(() => badge.classList.add('is-visible'), 1180 + i * 90);
        });

        setTimeout(() => document.body.classList.add('hero-sequence-done'), 520);
    }

    /* Lazy image fade-in */
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (img.complete) {
            img.classList.add('is-loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
        }
    });

    /* Init */
    document.body.classList.add('is-ready');

    if (document.querySelector('.hero-line-inner')) {
        if (prefersReduced) {
            document.querySelectorAll('.hero-line-inner, .trust-badge').forEach(el => el.classList.add('is-visible'));
            document.body.classList.add('hero-sequence-done');
            document.querySelectorAll('.hero-content .reveal').forEach(el => el.classList.add('visible'));
        } else {
            runHeroSequence();
        }
    }
})();
