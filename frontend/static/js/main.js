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

// ---- Back to Top Button ----
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---- Active Nav Link ----
(function() {
    const path = window.location.pathname;
    document.querySelectorAll('#navMenu .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '/' && path.startsWith(href)) {
            link.classList.add('active');
        } else if (href === '/' && path === '/') {
            link.classList.add('active');
        }
    });
})();

// ---- Search placeholder toggle on mobile ----
const searchInput = document.getElementById('siteSearchInput');
if (searchInput) {
    if (window.innerWidth < 992) {
        searchInput.setAttribute('placeholder', 'Search...');
    }
}

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
