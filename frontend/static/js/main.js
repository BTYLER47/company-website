/**
 * TechSolutions Pro - Main JavaScript
 */

// ---- CSRF Token Helper ----
function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) return meta.getAttribute('content');
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : '';
}

// ---- Navbar scroll effect ----
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (!nav) return;
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

// ---- Quick Contact Form (Home) ----
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
        } catch (err) {
            console.error('Contact form error:', err);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-send me-2"></i>Send Message';
        }
    });
}

// ---- Animate on scroll ----
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .testimonial-card, .why-card, .printing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});
