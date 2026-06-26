(function () {
    const header = document.getElementById('header');
    const menuBtn = document.getElementById('menuBtn');
    const nav = document.getElementById('nav');
    if (!header || !menuBtn || !nav) return;

    let ticking = false;

    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 24);
        updateActiveLink();
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    onScroll();

    menuBtn.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        menuBtn.classList.toggle('active', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            menuBtn.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + header.offsetHeight + 80;

        sections.forEach(section => {
            const id = section.getAttribute('id');
            const link = nav.querySelector(`a[href="#${id}"]`);
            if (!link) return;

            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (scrollPos >= top && scrollPos < bottom) {
                nav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }
})();
