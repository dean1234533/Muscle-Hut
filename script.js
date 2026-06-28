// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ---- HAMBURGER ----
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ---- SCROLL ANIMATIONS (fade-up) ----
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach((el, i) => {
  // Stagger siblings within same parent
  const siblings = el.parentElement.querySelectorAll('.fade-up');
  const idx = Array.from(siblings).indexOf(el);
  el.style.transitionDelay = `${idx * 80}ms`;
  fadeObserver.observe(el);
});

// ---- DIAGONAL IMAGE SLIDE-OVER EFFECT ----
// When the section scrolls into view, the background image zooms into natural size,
// creating a smooth slide/reveal as clip-path and scale work together.
const slideObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      slideObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.slide-over-section').forEach(section => {
  slideObserver.observe(section);
});

// ---- FAQ ACCORDION ----
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- TESTIMONIALS AUTO-SLIDER (mobile only) ----
(function () {
  const slider = document.getElementById('testimonialsSlider');
  const dots   = document.querySelectorAll('#testimonialsDots .t-dot');
  if (!slider || !dots.length) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    const cards = slider.querySelectorAll('.testimonial-card');
    if (!cards.length) return;
    current = (idx + cards.length) % cards.length;
    slider.scrollTo({ left: cards[current].offsetLeft - slider.offsetLeft, behavior: 'smooth' });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // Only run auto-advance on mobile
  const mq = window.matchMedia('(max-width: 768px)');
  if (mq.matches) startAuto();
  mq.addEventListener('change', e => { e.matches ? startAuto() : clearInterval(timer); });

  // Sync dots when user swipes manually
  slider.addEventListener('scrollend', () => {
    const cards = slider.querySelectorAll('.testimonial-card');
    let closest = 0;
    let minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - slider.getBoundingClientRect().left);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    current = closest;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    startAuto();
  });
})();

// ---- STICKY CTA: show only after scrolling past hero, hide near footer ----
const stickyCta = document.querySelector('.sticky-cta');
if (stickyCta) {
  let heroGone = false;
  let footerVisible = false;

  function updateStickyCta() {
    stickyCta.classList.toggle('sticky-cta--hidden', !heroGone || footerVisible);
  }

  // Watch the hero (or page top) — hide bar while it's in view
  const heroEl = document.getElementById('home-hero') || document.querySelector('.page-hero');
  if (heroEl) {
    new IntersectionObserver(([e]) => {
      heroGone = !e.isIntersecting;
      updateStickyCta();
    }, { threshold: 0 }).observe(heroEl);
  } else {
    // Non-hero pages: show after 200px scroll
    window.addEventListener('scroll', () => {
      heroGone = window.scrollY > 200;
      updateStickyCta();
    }, { passive: true });
  }

  // Also hide when footer is in view (avoids double CTA at bottom)
  const siteFooter = document.querySelector('.site-footer');
  if (siteFooter) {
    new IntersectionObserver(([e]) => {
      footerVisible = e.isIntersecting;
      updateStickyCta();
    }, { threshold: 0 }).observe(siteFooter);
  }
}

// ---- ACTIVE NAV LINK ----
// Highlight current page nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ---- FORM HANDLERS ----
function handleForm(formId, successLabel) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    // Replace with real backend / Formspree / EmailJS integration
    setTimeout(() => {
      btn.innerHTML = '✓ ' + successLabel;
      btn.style.background = '#22c55e';
      btn.style.borderColor = '#22c55e';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 5000);
    }, 1000);
  });
}

handleForm('trialForm',   "We'll call you soon!");
handleForm('contactForm', 'Message sent!');
