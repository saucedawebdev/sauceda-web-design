(function () {
    document.body.classList.add('loaded');

    const hasHeroSequence = document.querySelector('.hero-line-inner');
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    document.querySelectorAll('[data-stagger]').forEach(container => {
        container.querySelectorAll('.reveal, .reveal-scale').forEach((el, i) => {
            el.style.setProperty('--delay', `${i * 0.1}s`);
        });
    });

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => {
        const inHeroContent = el.closest('.hero-content');
        const inPageHero = el.closest('.page-hero-content');
        const skip = inHeroContent && hasHeroSequence;
        if (!skip && !inPageHero) observer.observe(el);
    });

    document.querySelectorAll('.reveal-scale').forEach(el => observer.observe(el));

    requestAnimationFrame(() => {
        document.querySelectorAll('.page-hero-content .reveal').forEach(el => {
            el.classList.add('visible');
        });
    });
})();
