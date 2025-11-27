# 🎵 AuraLynx Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Required API Keys & Credentials

- [ ] **Hugging Face Token** - Get from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
- [ ] **OpenAI API Key** (Optional) - Get from [platform.openai.com](https://platform.openai.com)
- [ ] **Production Secret Key** - Generate using `python -c 'import secrets; print(secrets.token_urlsafe(50))'`

### ✅ Infrastructure Requirements

#### **Minimum System Requirements:**

- **RAM:** 16GB (32GB+ recommended)
- **Storage:** 100GB SSD (for models and audio files)
- **CPU:** 8 cores (16+ recommended)
- **GPU:** Optional but highly recommended (NVIDIA GTX 1060+ or Tesla T4+)

#### **Production Environment:**

- [ ] Docker & Docker Compose installed
- [ ] Domain name configured
- [ ] SSL certificates (Let's Encrypt or commercial)
- [ ] Load balancer (if scaling)
- [ ] Monitoring setup (Prometheus, Grafana)

### ✅ Security Configuration

- [ ] Change all default passwords
- [ ] Set strong SECRET_KEY
- [ ] Configure HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Enable fail2ban or similar
- [ ] Configure CORS properly
- [ ] Set up rate limiting

## 🚀 Deployment Steps

### 1. **Clone and Setup**

```bash
git clone <repository>
cd AuraLynx
```

### 2. **Set Environment Variables**

Environment variables are described in detail in `docs/ENVIRONMENT.md`. At a
high level you will need to provide:

- Backend: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`,
  `DATABASE_URL` (for Postgres), `HUGGINGFACE_API_TOKEN`, and optional
  `OPENAI_API_KEY`, along with model/cache and logging settings.
- Frontend: `NEXT_PUBLIC_API_URL` (pointing to your backend `/api` route) and
  `NEXT_PUBLIC_BASE_URL` (public URL of the frontend).

In most hosting platforms you set these directly in the environment. If you are
running with Docker Compose, you can use an `.env` file or pass them via the
`environment` section in `docker-compose.yml`.

For an end-to-end example (Vercel frontend + Docker backend), see
`docs/DEPLOYMENT.md`.

### 4. **Deploy with Docker**

```bash
# Make deployment script executable (Linux/Mac)
chmod +x deploy.sh
./deploy.sh

# Or on Windows
deploy.bat
```

### 5. **Configure SSL (Production)**

```bash
# Generate SSL certificates (Let's Encrypt example)
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates to ssl directory
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/

# Generate DH parameters
openssl dhparam -out ./ssl/dhparam.pem 2048

# Update nginx.conf with SSL configuration
```

## 📊 Performance Optimization

### **AI Model Optimization**

- [ ] Use GPU for inference (`TORCH_DEVICE=cuda`)
- [ ] Enable half-precision (`MODEL_PRECISION=float16`)
- [ ] Pre-download models to avoid cold starts
- [ ] Set up model caching properly

### **Database Optimization**

- [ ] Use PostgreSQL instead of SQLite for production
- [ ] Set up database connection pooling
- [ ] Configure database backups
- [ ] Optimize database queries

### **Caching & CDN**

- [ ] Set up Redis for caching
- [ ] Configure CDN for static assets
- [ ] Enable browser caching
- [ ] Set up file compression

## 🔧 Scaling Configuration

### **Horizontal Scaling**

```yaml
# docker-compose.override.yml
version: '3.8'
services:
  backend:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2.0'
          memory: 8G
        reservations:
          cpus: '1.0'
          memory: 4G
```

### **Load Balancing**

- Configure multiple backend instances
- Use Nginx upstream configuration
- Set up health checks
- Configure session persistence

## 📈 Monitoring & Maintenance

### **Health Monitoring**

- [ ] Set up uptime monitoring
- [ ] Configure error tracking (Sentry)
- [ ] Monitor system resources
- [ ] Set up log aggregation

### **Backup Strategy**

- [ ] Database backups (daily)
- [ ] Model cache backups (weekly)
- [ ] Configuration backups
- [ ] Test restore procedures

### **Update Process**

```bash
# Regular updates
git pull origin main
docker-compose build --no-cache
docker-compose up -d
docker-compose exec backend python manage.py migrate
```

## 🛠️ Troubleshooting

### **Common Issues**

#### **"Out of Memory" errors:**

```bash
# Check available memory
free -h
# Reduce concurrent workers
docker-compose exec backend ps aux | grep gunicorn
```

#### **Model download failures:**

```bash
# Check HuggingFace token
docker-compose exec backend python -c "from huggingface_hub import login; login()"
# Clear model cache
rm -rf ./models/*
```

#### **Audio processing errors:**

```bash
# Check FFmpeg installation
docker-compose exec backend ffmpeg -version
# Check audio file permissions
docker-compose exec backend ls -la temp_audio/
```

## 📞 Support & Resources

### **Documentation:**

- [Django Deployment](https://docs.djangoproject.com/en/4.2/howto/deployment/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)

### **Monitoring Tools:**

- **Uptime:** UptimeRobot, Pingdom
- **Performance:** New Relic, DataDog
- **Errors:** Sentry, Rollbar
- **Logs:** ELK Stack, Splunk

### **Support Channels:**

- GitHub Issues: Create detailed bug reports
- Community Discord: Join for real-time help
- Documentation: Check online docs first

## 🔄 Maintenance Schedule

### **Daily:**

- [ ] Check system health
- [ ] Review error logs
- [ ] Monitor disk space

### **Weekly:**

- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Test backup restoration

### **Monthly:**

- [ ] Security updates
- [ ] Performance optimization
- [ ] Capacity planning review

---

**🎉 Congratulations!** Your AuraLynx instance should now be running in production.

Remember to keep your API keys secure and monitor your usage to avoid unexpected costs.
