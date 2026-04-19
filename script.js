/* ================================================
   DAVID CRIS WILL COSTALES — Portfolio Script
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- PAGE LOADER: remove after render ---- */
  setTimeout(() => document.body.classList.remove('loading'), 600);

  /* ---- BACK TO TOP (declared early to avoid ReferenceError in onScroll) ---- */
  const backToTopBtn = document.getElementById('backToTop');
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- NAVBAR: scroll effect ---- */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  const onScroll = () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 40);
    navbar.classList.toggle('hide-nav', scrollY > lastScroll + 10 && scrollY > 200);
    if (scrollY < lastScroll || scrollY < 80) navbar.classList.remove('hide-nav');
    lastScroll = scrollY;
    backToTopBtn.classList.toggle('visible', scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- HAMBURGER / MOBILE NAV ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---- TYPEWRITER ---- */
  const roles = [
    'Software Developer',
    'Electronics Engineer',
    'Problem Solver',
    'System Builder',
    'Creative Thinker',
    'AI/ML'
  ];
  const el     = document.getElementById('typewriter');
  let rIdx     = 0;
  let cIdx     = 0;
  let deleting = false;

  function typeLoop() {
    const current = roles[rIdx];
    if (deleting) {
      cIdx--;
      el.textContent = current.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 45);
    } else {
      cIdx++;
      el.textContent = current.slice(0, cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 2200);
        return;
      }
      setTimeout(typeLoop, 80);
    }
  }
  setTimeout(typeLoop, 800);

  /* ---- SCROLL REVEAL (Intersection Observer) ---- */
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-up'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- GALLERY LIGHTBOX ---- */
  const galleryImages = [
    'IMG_0299.jpeg',
    'IMG_0222.jpeg',
    'IMG_0553.jpeg',
    'IMG_0554.jpeg',
    'IMG_1111.jpeg',
    'IMG_2420.jpeg',
    'IMG_8175.jpeg'
  ];

  const lightbox         = document.getElementById('lightbox');
  const lightboxImg      = document.getElementById('lightboxImg');
  const lightboxClose    = document.getElementById('lightboxClose');
  const lightboxPrev     = document.getElementById('lightboxPrev');
  const lightboxNext     = document.getElementById('lightboxNext');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxCounter  = document.getElementById('lightboxCounter');
  let currentIndex = 0;

  function openLightbox(idx) {
    currentIndex = idx;
    lightboxImg.src = galleryImages[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = galleryImages[currentIndex];
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = galleryImages[currentIndex];
      lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
      lightboxImg.style.opacity = '1';
    }, 150);
  }

  lightboxImg.style.transition = 'opacity 0.15s';

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(parseInt(item.dataset.index, 10));
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  // Touch/swipe on lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { dx < 0 ? showNext() : showPrev(); }
  }, { passive: true });

  /* ---- PROJECT CARD MOBILE TAP-TO-FLIP ---- */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('tapped'));
  });

  /* ---- ACTIVE NAV LINK (scroll spy) ---- */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => spyObserver.observe(s));

});

