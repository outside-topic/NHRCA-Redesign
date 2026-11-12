/* ==========================================
   HERO SECTION - SWIPER INIT + TEXT ANIMATION
   Requires: Swiper.js (swiper-bundle.min.js)
========================================== */
(function () {
  'use strict';

  const heroEl = document.querySelector('.nh-hero-swiper');
  if (!heroEl || typeof window.Swiper === 'undefined') {
    return;
  }

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mark the hero as JS-ready. This triggers the CSS rule that hides
     text until the animation class is applied, preventing a flash of
     un-animated content on first paint. */
  heroEl.classList.add('nh-hero-js-ready');

  /**
   * Trigger a text animation on a slide's content block.
   * Removes any existing animation class, forces a reflow so the
   * animation restarts cleanly, then applies the new class.
   *
   * @param {HTMLElement} slide     - the swiper-slide element
   * @param {'in'|'out'}  direction - enter or leave animation
   */
  function animateHeroText(slide, direction) {
    if (!slide) return;
    const content = slide.querySelector('.nh-hero-content');
    if (!content) return;

    content.classList.remove('nh-hero-text-in', 'nh-hero-text-out');

    if (prefersReducedMotion) return;

    // Force reflow so re-adding the same class restarts the keyframes.
    // Without this, the browser skips the animation when the class is
    // re-applied to the same element (e.g. when looping back to a slide).
    void content.offsetWidth;

    content.classList.add(direction === 'in' ? 'nh-hero-text-in' : 'nh-hero-text-out');
  }

  /* Initialize Swiper with the Fade effect (crossFade enabled) for
     smooth background image transitions. Text animations are wired
     via Swiper events so they run on every slide change, including
     loop wrap-around and manual navigation. */
  const heroSwiper = new Swiper(heroEl, {
    loop: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 1100, // background fade duration (ms) - smooth, no flashing

    autoplay: {
      delay: 3500, // 5.5s per slide (within the 5000-6000ms spec)
      disableOnInteraction: false, // resume autoplay after user interaction
      pauseOnMouseEnter: false,     // pause on hover
    },

    pagination: {
      el: '.nh-hero-pagination',
      clickable: true,
    },

    navigation: {
      nextEl: '.nh-hero-next',
      prevEl: '.nh-hero-prev',
    },

    // Keyboard + touch/swipe are enabled by default in Swiper 11.
    keyboard: { enabled: true, onlyInViewport: true },
    a11y: { enabled: true },

    on: {
      /* Animate the first slide's text in as soon as Swiper is ready. */
      init: function () {
        animateHeroText(this.slides[this.activeIndex], 'in');
      },

      /* On every slide change: fade out the previous slide's text
         (moving slightly left) and fade in the new slide's text
         from the left. Runs independently of the background fade. */
      slideChangeTransitionStart: function () {
        animateHeroText(this.slides[this.previousIndex], 'out');
        animateHeroText(this.slides[this.activeIndex], 'in');
      },
    },
  });

  /* Stop autoplay when the tab is hidden to save resources and
     avoid accumulated transitions firing all at once on return. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      heroSwiper.autoplay.stop();
    } else {
      heroSwiper.autoplay.start();
    }
  });
})();
