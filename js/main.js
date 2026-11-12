/* ==========================================
   GLOBAL JAVASCRIPT
=========================================== */

/* ===== NAVBAR JAVASCRIPT ===== */
// Navbar scroll shadow effect
(function () {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;
    const onScroll = () => {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ===== DROPDOWN ACCESSIBILITY JAVASCRIPT ===== */
// Close dropdown when an item is clicked (useful on mobile)
document.querySelectorAll('.nh-navbar .dropdown-item').forEach(function (item) {
    item.addEventListener('click', function () {
        const collapse = document.getElementById('mainNav');
        if (collapse && collapse.classList.contains('show') && window.innerWidth < 992) {
            const bsCollapse = bootstrap.Collapse.getInstance(collapse) || new bootstrap.Collapse(collapse, { toggle: false });
            bsCollapse.hide();
        }
    });
});

/* ===== HERO SECTION JAVASCRIPT ===== */
// Hero interactions - smooth fade-in on load
(function () {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(12px)';
    hero.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    window.addEventListener('load', function () {
        setTimeout(function () {
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    });
})();

/* ===== STATISTICS SECTION JAVASCRIPT ===== */
// Lightweight counting animation using IntersectionObserver
(function () {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    // Respect reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animateCounter = function (el) {
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        if (prefersReduced) {
            el.textContent = target + (suffix ? '<span class="stat-suffix">' + suffix + '</span>' : '');
            return;
        }
        const duration = 1800;
        const startTime = performance.now();
        const step = function (now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.innerHTML = current.toLocaleString() + (suffix ? '<span class="stat-suffix">' + suffix + '</span>' : '');
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.innerHTML = target.toLocaleString() + (suffix ? '<span class="stat-suffix">' + suffix + '</span>' : '');
            }
        };
        requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(function (c) { observer.observe(c); });
    } else {
        counters.forEach(function (c) { animateCounter(c); });
    }
})();

/* ===== ACTIVE NAVIGATION JAVASCRIPT ===== */
// Highlight active nav based on current URL (basic)
(function () {
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('.nh-navbar .nav-link');
    if (path === '/' || path === '' || path === '/index.html') return; // Home stays active
    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href && href !== '#' && path.includes(href.replace('https://nhrca.uk', ''))) {
            navLinks.forEach(function (l) { l.classList.remove('active'); });
            link.classList.add('active');
        }
    });
})();

