/* Dental Era Tech JS */
'use strict';

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar glass effect
    if (scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
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
    '.service-card, .tech-card, .gallery-item, .why-card, .team-card, .about-feature, .about-grid, .tech-info, .contact-item, .tourism-perk, .tourism-visual, .tourism-gallery'
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

// ===== CONTACT FORM (EmailJS) =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

// ── EmailJS Configuration ──
// To activate email delivery:
// 1. Go to https://www.emailjs.com and create a free account
// 2. Add an Email Service (Gmail) and note the Service ID
// 3. Create an Email Template with variables: {{firstName}}, {{lastName}}, {{phone}}, {{email}}, {{service}}, {{message}}
// 4. Replace the three values below with your own IDs
const EMAILJS_PUBLIC_KEY = 'YXbdqPcZESj2Hwrn1';
const EMAILJS_SERVICE_ID = 'service_97nq7bm';
const EMAILJS_TEMPLATE_ID = 'template_45lg78e';
const CLINIC_EMAIL = 'jydental.era.tech@gmail.com';

// Initialize EmailJS
if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

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

        // Gather form data
        const formData = {
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            service: document.getElementById('service').value,
            message: document.getElementById('message').value.trim()
        };

        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        let sent = false;

        // Attempt EmailJS if configured
        if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
            try {
                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    email: formData.email,
                    service: formData.service,
                    message: formData.message || 'No additional message'
                });
                sent = true;
            } catch (err) {
                console.warn('EmailJS failed, falling back to mailto:', err);
            }
        }

        // Fallback: open user's mail client
        if (!sent) {
            const subject = encodeURIComponent(`New Appointment Request — ${formData.firstName} ${formData.lastName}`);
            const body = encodeURIComponent(
                `NEW APPOINTMENT REQUEST\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                `Name: ${formData.firstName} ${formData.lastName}\n` +
                `Phone: ${formData.phone}\n` +
                `Email: ${formData.email || 'Not provided'}\n` +
                `Service: ${formData.service || 'Not selected'}\n\n` +
                `Message:\n${formData.message || 'None'}\n`
            );
            window.open(`mailto:${CLINIC_EMAIL}?subject=${subject}&body=${body}`, '_self');
        }

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
