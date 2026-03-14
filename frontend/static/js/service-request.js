/**
 * Service Request Page JavaScript
 */

const API_BASE = '/api';

// Load services for dropdown
async function loadServices() {
    const select = document.getElementById('serviceSelect');
    if (!select) return;
    try {
        const res = await fetch(`${API_BASE}/services/`);
        const data = await res.json();
        const services = data.results || data;
        services.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.service_name;
            select.appendChild(opt);
        });
        // Pre-select from URL param
        const params = new URLSearchParams(window.location.search);
        const preselect = params.get('service');
        if (preselect) {
            const found = [...select.options].find(o => o.textContent.toLowerCase().includes(preselect));
            if (found) found.selected = true;
        }
    } catch (err) { console.error('Services load error:', err); }
}

// Submit service request
document.addEventListener('DOMContentLoaded', () => {
    loadServices();

    const form = document.getElementById('serviceRequestForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

        const formData = new FormData(this);
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';

        try {
            const res = await fetch(`${API_BASE}/service-request/`, {
                method: 'POST',
                headers: { 'X-CSRFToken': csrfToken },
                body: formData
            });

            const data = await res.json();

            if (res.ok || res.status === 201) {
                document.getElementById('requestSuccess').classList.remove('d-none');
                document.getElementById('requestError').classList.add('d-none');
                form.reset();
                form.style.display = 'none';
            } else {
                document.getElementById('requestError').classList.remove('d-none');
                console.error('Submission error:', data);
            }
        } catch (err) {
            document.getElementById('requestError').classList.remove('d-none');
            console.error('Network error:', err);
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-send me-2"></i>Submit Request';
        }
    });
});
