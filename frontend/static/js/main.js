/**
 * Hubgroup Systems - Main JavaScript
 */

function getCsrfToken() {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : '';
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    nav.style.boxShadow = window.scrollY > 50 ? '0 2px 20px rgba(0,0,0,0.3)' : 'none';
});

// Quick Contact Form
const quickForm = document.getElementById('quickContactForm');
if (quickForm) {
    quickForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(this).entries());
        const btn = this.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
        try {
            const res = await fetch('/api/contact/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken() },
                body: JSON.stringify({ name: data.name, email: data.email, message: data.message })
            });
            if (res.ok || res.status === 201) {
                document.getElementById('formSuccess').classList.remove('d-none');
                this.reset();
            }
        } catch (err) { console.error(err); }
        finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-send me-2"></i>Send Message';
        }
    });
}

// Animate on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .testimonial-card, .why-card, .printing-card, .team-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// ---- Promo Popup ----
let currentSlide = 0;
const totalSlides = 5;
let autoSlideInterval;

function showPromo() {
    const lastShown = localStorage.getItem('promoLastShown');
    const today = new Date().toDateString();
    if (lastShown === today) return;
    setTimeout(() => {
        const popup = document.getElementById('promoPopup');
        if (popup) {
            popup.classList.add('show');
            startAutoSlide();
        }
    }, 2500);
}

function closePromo() {
    const popup = document.getElementById('promoPopup');
    if (popup) popup.classList.remove('show');
    clearInterval(autoSlideInterval);
}

function dontShowAgain() {
    localStorage.setItem('promoLastShown', new Date().toDateString());
    closePromo();
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.promo-slide');
    const dots = document.querySelectorAll('.promo-dot');
    if (!slides.length) return;
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        goToSlide((currentSlide + 1) % totalSlides);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', showPromo);
