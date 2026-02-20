/* Dental Era Tech JS */
'use strict';

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar glass effect
    if (scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link highlight
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        const sTop = section.offsetTop - 120;
        if (scrollY >= sTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, { passive: true });

// Back to top click
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksContainer.classList.toggle('mobile-open');
});

navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksContainer.classList.remove('mobile-open');
    });
});

// ===== HERO PARTICLES =====
const heroParticles = document.getElementById('heroParticles');
const particleCount = 18;

for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = Math.random() * 10 + 12;

    p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    bottom: -10px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: ${Math.random() * 0.5 + 0.1};
  `;
    heroParticles.appendChild(p);
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
    '.service-card, .tech-card, .gallery-item, .why-card, .team-card, .about-feature, .about-grid, .tech-info, .contact-item'
);

revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 4 === 1) el.classList.add('reveal-delay-1');
    else if (i % 4 === 2) el.classList.add('reveal-delay-2');
    else if (i % 4 === 3) el.classList.add('reveal-delay-3');
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString();
        if (current >= target) clearInterval(timer);
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== TESTIMONIALS SLIDER =====
const track = document.getElementById('testimonialTrack');
const dotsContainer = document.getElementById('sliderDots');
const cards = track ? track.querySelectorAll('.testimonial-card') : [];
let currentSlide = 0;
let autoSlideTimer;

function createDots() {
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
}

function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
    resetAutoSlide();
}

function nextSlide() {
    goToSlide((currentSlide + 1) % cards.length);
}

function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, 5000);
}

if (cards.length > 0) {
    createDots();
    resetAutoSlide();

    // Touch/drag support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else goToSlide((currentSlide - 1 + cards.length) % cards.length);
        }
    });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Simple validation
        const required = contactForm.querySelectorAll('[required]');
        let valid = true;
        required.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ef4444';
                valid = false;
            } else {
                field.style.borderColor = '';
            }
        });

        if (!valid) return;

        // Simulate submission
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 1500));

        contactForm.querySelectorAll('input, select, textarea').forEach(f => f.value = '');
        submitBtn.textContent = 'Confirm Appointment Request';
        submitBtn.disabled = false;
        formSuccess.classList.add('show');

        setTimeout(() => formSuccess.classList.remove('show'), 6000);
    });

    // Clear error border on input
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => { field.style.borderColor = ''; });
    });
}

// ===== SMOOTH ANCHOR SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ===== GALLERY LIGHTBOX (simple) =====
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        const overlay = document.createElement('div');
        overlay.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:9999;
      display:flex; align-items:center; justify-content:center; cursor:pointer;
      animation: fade-in-down 0.3s ease;
    `;
        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.cssText = 'max-width:90vw; max-height:90vh; border-radius:12px; box-shadow:0 20px 80px rgba(0,0,0,0.6);';
        overlay.appendChild(img);
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => overlay.remove());
    });
});

console.log('%c🦷 Dental Era Tech Website Loaded', 'color:#14b8a6; font-size:14px; font-weight:bold;');
