/**
 * Blog Page JavaScript
 */

const API_BASE = '/api';

async function loadBlogPosts(page = 1, search = '') {
    const grid = document.getElementById('blogPostsGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="col-12 text-center py-4"><div class="spinner-border text-accent"></div></div>';

    let url = `${API_BASE}/blog/?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const posts = data.results || data;

        if (!posts.length) {
            grid.innerHTML = '<div class="col-12 text-center py-4 text-muted">No posts found.</div>';
            return;
        }

        grid.innerHTML = posts.map(p => `
            <div class="col-md-6">
                <div class="blog-card">
                    <div class="blog-img">
                        ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : '<div class="bg-light d-flex align-items-center justify-content-center h-100"><i class="bi bi-newspaper fs-1 text-muted"></i></div>'}
                    </div>
                    <div class="blog-body">
                        ${p.category ? `<span class="badge bg-accent mb-2">${p.category.name}</span>` : ''}
                        <h5 class="fw-bold mb-2">${p.title}</h5>
                        <p class="text-muted small mb-3">${p.excerpt || p.content?.substring(0, 120)}...</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="small text-muted">
                                <i class="bi bi-person me-1"></i>${p.author_name || 'TechSolutions Team'}
                                &nbsp;·&nbsp;
                                <i class="bi bi-calendar me-1"></i>${new Date(p.created_at).toLocaleDateString('en-KE')}
                            </div>
                            <a href="/blog/${p.slug}/" class="btn btn-outline-accent btn-sm">Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        grid.innerHTML = '<div class="col-12 text-center py-4 text-danger">Error loading posts.</div>';
    }
}

async function loadBlogCategories() {
    const container = document.getElementById('blogCategories');
    if (!container) return;
    try {
        const res = await fetch(`${API_BASE}/blog-categories/`);
        const data = await res.json();
        const cats = data.results || data;
        container.innerHTML = cats.map(c => `
            <a href="#" class="d-block py-1 border-bottom text-decoration-none hover-accent"
               onclick="loadBlogPosts(1, ''); return false;">${c.name}</a>
        `).join('') || '<p class="text-muted small">No categories yet.</p>';
    } catch (err) { console.error(err); }
}

document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    loadBlogCategories();

    let searchTimeout;
    document.getElementById('blogSearch')?.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => loadBlogPosts(1, this.value), 400);
    });
});
