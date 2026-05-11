var CONFIG = {
  formSubmitUrl: '',
  socialLinks: {
    email: 'mailto:info@rendercraftinteractive.com'
  }
};

function initializeMenu() {
  var button = document.querySelector('.menu-button');
  var nav = document.getElementById('siteNav');
  if (!button || !nav) return;

  button.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    });
  });
}

function initializeFaqs() {
  document.querySelectorAll('.faq-item button').forEach(function (button) {
    button.addEventListener('click', function () {
      var item = button.closest('.faq-item');
      var isOpen = item.classList.toggle('active');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

function initializeContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = document.getElementById('contact-name').value.trim();
    var email = document.getElementById('contact-email').value.trim();
    var phone = document.getElementById('contact-phone').value.trim();
    var message = document.getElementById('contact-message').value.trim();
    var errorEl = form.querySelector('.form-error');
    var submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !email || !message) {
      errorEl.textContent = 'Please enter your name, email, and message.';
      errorEl.style.display = 'block';
      return;
    }

    errorEl.style.display = 'none';
    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    var payload = new URLSearchParams({
      name: name,
      email: email,
      phone: phone,
      message: message,
      timestamp: new Date().toISOString()
    });

    function done() {
      alert('Thank you. Your message has been sent.');
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }

    function fail() {
      errorEl.textContent = 'Something went wrong. Please try again or email us directly.';
      errorEl.style.display = 'block';
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }

    if (!CONFIG.formSubmitUrl) {
      errorEl.textContent = 'Email endpoint is not configured yet. Add your Google Apps Script Web app URL in script.js.';
      errorEl.style.display = 'block';
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      return;
    }

    fetch(CONFIG.formSubmitUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: payload.toString()
    }).then(function () {
      done();
    }).catch(fail);
  });
}

function initializeBackToTop() {
  var button = document.getElementById('backToTop');
  if (!button) return;

  window.addEventListener('scroll', function () {
    button.classList.toggle('show', window.scrollY > 520);
  }, { passive: true });

  button.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initializeHoverText() {
  document.querySelectorAll('.text-hover-slide, .text-hover-scramble').forEach(function (el) {
    if (el.dataset.hoverReady) return;
    var text = el.textContent.trim();
    el.dataset.hover = text;
    el.dataset.hoverReady = 'true';
    el.innerHTML = '<span>' + text + '</span>';
  });
}

function initializeSmoothScroll() {
  if (!window.Lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  var lenis = new Lenis({
    duration: 1.18,
    smoothWheel: true,
    wheelMultiplier: 0.86,
    touchMultiplier: 1.2
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
  }

  return lenis;
}

function splitHeroText() {
  var heading = document.querySelector('.hero h1');
  if (!heading || heading.dataset.splitReady) return;

  var words = heading.textContent.trim().split(/\s+/);
  heading.innerHTML = words.map(function (word) {
    return '<span class="split-word"><span>' + word + '</span></span>';
  }).join(' ');
  heading.dataset.splitReady = 'true';
}

function initializeScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  splitHeroText();

  gsap.to('.split-word span', {
    y: 0,
    duration: 1.08,
    ease: 'power4.out',
    stagger: 0.035,
    delay: 0.18
  });

  var revealTargets = [
    '.mission-section h2',
    '.mission-subtitle',
    '.audience-grid article',
    '.section-kicker',
    '.section h2',
    '.section-head p',
    '.about-grid p',
    '.stats-grid article',
    '.work-card',
    '.testimonial-grid article',
    '.faq-item',
    '.contact-form',
    '.contact-details'
  ].join(',');

  document.querySelectorAll(revealTargets).forEach(function (el) {
    el.classList.add('reveal');
    gsap.from(el, {
      autoAlpha: 0,
      y: 44,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  document.querySelectorAll('.about-images img, .work-card img').forEach(function (img) {
    img.classList.add('parallax-image');
    if (img.parentElement) img.parentElement.classList.add('parallax-media');
    gsap.fromTo(img, { yPercent: -8, scale: 1.08 }, {
      yPercent: 8,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  document.querySelectorAll('.card-image-wrap img').forEach(function (img) {
    img.classList.add('parallax-image');
    img.parentElement.classList.add('parallax-media');
    gsap.fromTo(img, { yPercent: -8, scale: 1.08 }, {
      yPercent: 8,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  gsap.to('.hero-image img', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

/* ── SERVICES CAROUSEL ── */
function initializeServicesCarousel() {
  var track = document.getElementById('servicesTrack');
  var dotsContainer = document.getElementById('carouselDots');
  var prevBtn = document.querySelector('.carousel-prev');
  var nextBtn = document.querySelector('.carousel-next');
  if (!track || !prevBtn || !nextBtn) return;

  /* Grab original cards */
  var origCards = Array.from(track.querySelectorAll('.service-card'));
  var total = origCards.length;
  if (total === 0) return;

  /* Clone a full set before and after for seamless infinite loop */
  origCards.forEach(function (card) {
    var before = card.cloneNode(true);
    var after  = card.cloneNode(true);
    before.setAttribute('aria-hidden', 'true');
    after.setAttribute('aria-hidden', 'true');
    track.insertBefore(before, track.firstChild);
    track.appendChild(after);
  });

  /* Current index counts over ALL cards in the track */
  /* We start positioned at the first REAL card (index = total, after the clones prepended) */
  var allCards = Array.from(track.querySelectorAll('.service-card'));
  var current = total; /* start at first real card */

  /* Disable transition temporarily */
  function noTransition() {
    track.style.transition = 'none';
  }
  function withTransition() {
    track.style.transition = 'transform 0.48s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  /* How many cards visible at current width */
  function visibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1000) return 2;
    return 3;
  }

  /* Width of one card + gap */
  function cardStep() {
    var card = allCards[0];
    if (!card) return 0;
    var gap = parseInt(getComputedStyle(track).gap) || 16;
    return card.offsetWidth + gap;
  }

  /* Apply transform to current position (no transition) */
  function jumpTo(index) {
    noTransition();
    track.style.transform = 'translateX(-' + (index * cardStep()) + 'px)';
    /* Force reflow so transition removal takes effect before re-enabling */
    track.offsetHeight;
    withTransition();
  }

  /* Slide to a position with transition */
  function slideTo(index) {
    withTransition();
    track.style.transform = 'translateX(-' + (index * cardStep()) + 'px)';
  }

  /* After a transition ends, silently jump if we've gone into a clone zone */
  track.addEventListener('transitionend', function () {
    /* If we slid into the trailing clone zone (index >= total*2), jump back to real zone */
    if (current >= total * 2) {
      current = current - total;
      jumpTo(current);
    }
    /* If we slid into the leading clone zone (index < total), jump forward to real zone */
    if (current < total) {
      current = current + total;
      jumpTo(current);
    }
    updateDots();
  });

  /* Which dot should be active (maps any index back to 0..total-1) */
  function realIndex() {
    return ((current - total) % total + total) % total;
  }

  /* Build dot indicators */
  function buildDots() {
    dotsContainer.innerHTML = '';
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Go to service ' + (i + 1));
      dot.dataset.index = i;
      dot.addEventListener('click', function () {
        goTo(total + parseInt(this.dataset.index));
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    var ri = realIndex();
    var dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === ri);
    });
  }

  /* Navigate to any absolute index */
  function goTo(index) {
    current = index;
    slideTo(current);
    /* Dots update handled in transitionend, but also update immediately for dot clicks */
    updateDots();
  }

  /* Arrow buttons */
  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });

  /* Touch / swipe */
  var touchStartX = 0;
  var touchDeltaX = 0;

  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
  }, { passive: true });

  track.addEventListener('touchmove', function (e) {
    touchDeltaX = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  track.addEventListener('touchend', function () {
    if (Math.abs(touchDeltaX) > 40) {
      goTo(touchDeltaX < 0 ? current + 1 : current - 1);
    }
  });

  /* Keyboard support when services section is visible */
  document.addEventListener('keydown', function (e) {
    var section = document.getElementById('services');
    if (!section) return;
    var rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  /* Recalculate on resize */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      jumpTo(current);
    }, 80);
  });

  /* Init */
  buildDots();
  jumpTo(current);
  updateDots();
}

async function initializeThreeScene() {
  var canvas = document.getElementById('webglScene');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var THREE;
  try {
    THREE = window.THREE || await import('https://cdn.jsdelivr.net/npm/three@0.181.2/build/three.module.js');
  } catch (error) {
    console.warn('Three.js scene skipped:', error);
    return;
  }

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 7;

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var group = new THREE.Group();
  scene.add(group);

  var geometry = new THREE.IcosahedronGeometry(1.32, 0);
  var material = new THREE.MeshPhysicalMaterial({
    color: 0xf3f0e9,
    metalness: 0.18,
    roughness: 0.12,
    transmission: 0.38,
    thickness: 1.3,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    iridescence: 1,
    iridescenceIOR: 1.8,
    iridescenceThicknessRange: [120, 620],
    transparent: true,
    opacity: 0.58
  });

  for (var i = 0; i < 8; i += 1) {
    var shard = new THREE.Mesh(geometry, material.clone());
    var angle = (i / 8) * Math.PI * 2;
    shard.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 1.15, -i * 0.04);
    shard.rotation.set(i * 0.4, i * 0.7, i * 0.2);
    shard.scale.setScalar(0.26 + i * 0.035);
    group.add(shard);
  }

  var key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(3, 4, 5);
  scene.add(key);
  scene.add(new THREE.AmbientLight(0xffd8ef, 1.2));

  var pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', function (event) {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate(time) {
    var t = time * 0.001;
    group.position.x += (pointer.x * 0.65 - group.position.x) * 0.055;
    group.position.y += (-pointer.y * 0.45 - group.position.y) * 0.055;
    group.rotation.y = t * 0.18 + pointer.x * 0.18;
    group.rotation.x = Math.sin(t * 0.7) * 0.12 + pointer.y * 0.08;

    group.children.forEach(function (mesh, index) {
      mesh.rotation.x += 0.003 + index * 0.0006;
      mesh.rotation.y += 0.004 + index * 0.0004;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', function () {
  initializeMenu();
  initializeFaqs();
  initializeContactForm();
  initializeBackToTop();
  initializeHoverText();
  initializeSmoothScroll();
  initializeScrollAnimations();
  initializeServicesCarousel();
  initializeThreeScene();
});