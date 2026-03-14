/**
 * Products page - Filter, search, sort, cart
 */

const API_BASE = '/api';
let allProducts = [];
let currentPage = 1;
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// ---- Load categories ----
async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE}/product-categories/`);
        const data = await res.json();
        const container = document.getElementById('categoryFilters');
        if (!container) return;
        data.results?.forEach(cat => {
            const div = document.createElement('div');
            div.className = 'form-check';
            div.innerHTML = `
                <input class="form-check-input" type="radio" name="category" value="${cat.slug}" id="cat_${cat.slug}">
                <label class="form-check-label" for="cat_${cat.slug}">${cat.name}</label>
            `;
            container.appendChild(div);
        });
        // Listen for changes
        container.addEventListener('change', () => loadProducts());
    } catch (err) { console.error('Categories error:', err); }
}

// ---- Load products ----
async function loadProducts(page = 1) {
    const grid = document.getElementById('productsGrid');
    const countEl = document.getElementById('resultsCount');
    if (!grid) return;

    grid.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-accent"></div></div>';

    const search = document.getElementById('productSearch')?.value || '';
    const category = document.querySelector('input[name="category"]:checked')?.value || '';
    const sort = document.getElementById('sortBy')?.value || '-created_at';

    let url = `${API_BASE}/products/?ordering=${sort}&page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (category) url += `&category__slug=${category}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const products = data.results || data;
        const count = data.count || products.length;

        if (countEl) countEl.textContent = `${count} product${count !== 1 ? 's' : ''} found`;

        if (!products.length) {
            grid.innerHTML = '<div class="col-12 text-center py-5 text-muted"><i class="bi bi-search fs-2 d-block mb-2"></i>No products found</div>';
            return;
        }

        grid.innerHTML = products.map(p => `
            <div class="col-md-4 col-sm-6">
                <div class="product-card">
                    <div class="product-img">
                        ${p.image ? `<img src="${p.image}" alt="${p.product_name}" loading="lazy">` : '<i class="bi bi-pc-display-horizontal fs-1"></i>'}
                    </div>
                    <div class="product-body">
                        <div class="product-category mb-1">${p.category?.name || 'Equipment'}</div>
                        <h6 class="fw-bold mb-1">${p.product_name}</h6>
                        <p class="small text-muted mb-2">${p.description?.substring(0, 80)}${p.description?.length > 80 ? '...' : ''}</p>
                        <div class="product-price mb-1">KES ${parseFloat(p.price).toLocaleString()}</div>
                        <div class="small mb-3 ${p.in_stock ? 'text-success' : 'text-danger'}">
                            <i class="bi ${p.in_stock ? 'bi-check-circle' : 'bi-x-circle'} me-1"></i>
                            ${p.in_stock ? 'In Stock' : 'Out of Stock'}
                        </div>
                        <div class="mt-auto d-flex gap-2">
                            ${p.in_stock ? `<button class="btn btn-accent btn-sm flex-fill" onclick="addToCart(${p.id}, '${p.product_name.replace(/'/g, "\\'")}', ${p.price})">
                                <i class="bi bi-cart-plus me-1"></i>Add to Cart
                            </button>` : '<button class="btn btn-secondary btn-sm flex-fill" disabled>Out of Stock</button>'}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Pagination
        renderPagination(data.count, page);
    } catch (err) {
        grid.innerHTML = '<div class="col-12 text-center py-5 text-danger">Error loading products. Please refresh.</div>';
        console.error('Products error:', err);
    }
}

function renderPagination(total, current) {
    const perPage = 12;
    const pages = Math.ceil(total / perPage);
    const pag = document.getElementById('pagination');
    if (!pag || pages <= 1) return;
    pag.innerHTML = '';

    const prev = document.createElement('li');
    prev.className = `page-item ${current === 1 ? 'disabled' : ''}`;
    prev.innerHTML = `<a class="page-link" href="#" onclick="loadProducts(${current - 1})">‹</a>`;
    pag.appendChild(prev);

    for (let i = 1; i <= pages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === current ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="loadProducts(${i})">${i}</a>`;
        pag.appendChild(li);
    }

    const next = document.createElement('li');
    next.className = `page-item ${current === pages ? 'disabled' : ''}`;
    next.innerHTML = `<a class="page-link" href="#" onclick="loadProducts(${current + 1})">›</a>`;
    pag.appendChild(next);
}

// ---- Cart ----
function addToCart(id, name, price) {
    const existing = cart.find(i => i.id === id);
    if (existing) { existing.qty += 1; } else { cart.push({ id, name, price: parseFloat(price), qty: 1 }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showToast(`✓ ${name} added to cart`);
}

function updateCartUI() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('#cartBadge, #cartCount').forEach(el => el.textContent = total);

    const cartItems = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    if (!cartItems) return;

    if (!cart.length) {
        cartItems.innerHTML = '<p class="text-muted text-center mt-5">Your cart is empty</p>';
        cartTotalEl?.classList.add('d-none');
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="d-flex align-items-center gap-2 mb-3 p-2 border rounded">
            <div class="flex-fill">
                <div class="fw-semibold small">${item.name}</div>
                <div class="text-accent small">KES ${item.price.toLocaleString()}</div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-outline-secondary btn-sm py-0" onclick="changeQty(${item.id}, -1)">−</button>
                <span class="fw-bold">${item.qty}</span>
                <button class="btn btn-outline-secondary btn-sm py-0" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <button class="btn btn-sm text-danger" onclick="removeFromCart(${item.id})"><i class="bi bi-trash"></i></button>
        </div>
    `).join('');

    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('totalAmount').textContent = 'KES ' + total.toLocaleString();
    cartTotalEl?.classList.remove('d-none');
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else { localStorage.setItem('cart', JSON.stringify(cart)); updateCartUI(); }
}
function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 start-50 translate-middle-x mb-5 bg-dark text-white px-4 py-2 rounded-pill shadow';
    toast.style.zIndex = '9999';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

// ---- Event listeners ----
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadProducts();
    updateCartUI();

    let searchTimeout;
    document.getElementById('productSearch')?.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => loadProducts(), 400);
    });
    document.getElementById('sortBy')?.addEventListener('change', () => loadProducts());
    document.getElementById('clearFilters')?.addEventListener('click', () => {
        document.getElementById('productSearch').value = '';
        document.getElementById('sortBy').value = '-created_at';
        document.querySelector('input[name="category"][value=""]').checked = true;
        loadProducts();
    });
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        window.location.href = '/checkout/';
    });
});
