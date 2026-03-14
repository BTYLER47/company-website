/**
 * Home page - Load featured products
 */

const API_BASE = '/api';

async function loadFeaturedProducts() {
    const grid = document.getElementById('featuredProductsGrid');
    if (!grid) return;

    try {
        const res = await fetch(`${API_BASE}/products/featured/`);
        const products = await res.json();

        if (!products.length) {
            grid.innerHTML = '<div class="col-12 text-center text-muted">No featured products yet.</div>';
            return;
        }

        grid.innerHTML = products.map(p => `
            <div class="col-md-3 col-sm-6">
                <div class="product-card">
                    <div class="product-img">
                        ${p.image ? `<img src="${p.image}" alt="${p.product_name}" loading="lazy">` : '<i class="bi bi-pc-display"></i>'}
                    </div>
                    <div class="product-body">
                        <div class="product-category mb-1">${p.category?.name || ''}</div>
                        <h6 class="fw-bold mb-1">${p.product_name}</h6>
                        <div class="product-price mb-2">KES ${parseFloat(p.price).toLocaleString()}</div>
                        <div class="mt-auto d-flex gap-2">
                            <a href="/products/#${p.slug}" class="btn btn-outline-secondary btn-sm flex-fill">View</a>
                            <button class="btn btn-accent btn-sm" onclick="addToCart(${p.id}, '${p.product_name}', ${p.price})">
                                <i class="bi bi-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        grid.innerHTML = '<div class="col-12 text-center text-muted">Could not load products.</div>';
    }
}

// Cart (localStorage-based)
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function addToCart(id, name, price) {
    const existing = cart.find(i => i.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, name, price: parseFloat(price), qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${name} added to cart!`);
}

function updateCartBadge() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('#cartBadge, #cartCount').forEach(el => el.textContent = total);
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 start-50 translate-middle-x mb-5 bg-dark text-white px-4 py-2 rounded-pill';
    toast.style.zIndex = '9999';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    updateCartBadge();
});
