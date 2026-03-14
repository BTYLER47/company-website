# Gunicorn configuration file
# Usage: gunicorn -c deployment/gunicorn.conf.py config.wsgi:application

import multiprocessing

# Server socket
bind = "127.0.0.1:8000"
backlog = 2048

# Workers
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2

# Process naming
proc_name = "company_website"

# Logging
errorlog = "/var/log/gunicorn/error.log"
accesslog = "/var/log/gunicorn/access.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Server mechanics
daemon = False
pidfile = "/var/run/gunicorn/company_website.pid"
