# TechSolutions Pro - Company Website

Full-stack Django + HTML/CSS/JS company website with REST API.

## Project Structure
```
company_website/
├── backend/
│   ├── manage.py
│   ├── config/          # Django settings, urls, wsgi, asgi
│   └── apps/
│       ├── users/       # Custom User model, JWT auth
│       ├── services/    # Services + ServiceRequests
│       ├── products/    # Products + Categories
│       ├── orders/      # Orders + OrderItems
│       ├── blog/        # Blog posts + Comments
│       └── contact/     # Contact messages
├── frontend/
│   ├── templates/       # HTML pages (base, home, about, etc.)
│   └── static/
│       ├── css/main.css
│       └── js/          # main.js, home.js, products.js, etc.
├── api/                 # REST API URL router
├── deployment/          # Nginx + Gunicorn configs
├── requirements.txt
└── .env.example
```

## Setup Instructions

### 1. Clone & Environment
```bash
git clone <repo>
cd company_website
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your values
```

### 2. Database
```bash
# Create PostgreSQL database
createdb company_website_db

# Run migrations (from backend/)
cd backend
python manage.py makemigrations users services products orders blog contact
python manage.py migrate
python manage.py createsuperuser
```

### 3. Static Files
```bash
python manage.py collectstatic
```

### 4. Run Development Server
```bash
python manage.py runserver
```

Visit: http://localhost:8000

### 5. Production Deployment

**Gunicorn:**
```bash
gunicorn -c deployment/gunicorn.conf.py config.wsgi:application
```

**Nginx:**
```bash
sudo cp deployment/nginx.conf /etc/nginx/sites-available/company_website
sudo ln -s /etc/nginx/sites-available/company_website /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products/ | List products |
| GET | /api/products/featured/ | Featured products |
| GET | /api/services/ | List services |
| POST | /api/service-request/ | Submit service request |
| GET | /api/orders/ | User orders (auth required) |
| GET | /api/blog/ | Blog posts |
| POST | /api/contact/ | Send contact message |
| POST | /api/auth/register/ | Register user |
| POST | /api/auth/login/ | Login + get JWT |
| POST | /api/auth/logout/ | Logout |

## Admin Panel
Visit: http://yourdomain.com/admin/

Manage: Products, Services, Orders, Blog, Service Requests, Contact Messages, Users

## Pages
- `/` - Home
- `/about/` - About Us
- `/services/` - Services
- `/products/` - Products
- `/printing-branding/` - Printing & Branding
- `/blog/` - Blog & News
- `/service-request/` - Request Service
- `/contact/` - Contact Us
