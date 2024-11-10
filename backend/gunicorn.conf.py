#!/usr/bin/env python
"""
Gunicorn configuration file for AuraLynx production deployment.
"""

import multiprocessing
import os

# Server socket
bind = "0.0.0.0:8000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
max_requests = 1000
max_requests_jitter = 100
worker_class = "sync"
worker_connections = 1000
timeout = 300  # 5 minutes for AI processing
keepalive = 2

# Restart workers after this many requests, with up to jitter variance
preload_app = True

# Logging
accesslog = "access.log"
errorlog = "error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "auralynx"

# Server mechanics
daemon = False
pidfile = "gunicorn.pid"
user = None
group = None
tmp_upload_dir = None

# SSL (uncomment for HTTPS)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"

# Performance
worker_tmp_dir = "/dev/shm"  # Use memory for better performance on Linux