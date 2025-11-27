## Deployment Reference

This guide walks through a pragmatic production setup:

1. **Frontend** on Vercel (Next.js SSR with edge CDN).
2. **Backend** on a single Docker host (Railway/Render/Hetzner/VPS) running Django, Postgres, Redis, and Nginx from `docker-compose.yml`.

### 1. Frontend on Vercel

1. **Create a new Vercel project** and import the repository. Set the root to `frontend/`.
2. **Environment variables** (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api` (point to the backend's public `/api` route behind Nginx).
   - `NEXT_PUBLIC_BASE_URL=https://yourdomain.com`.
3. **Framework preset**: Vercel should auto-detect Next.js 16.
4. Trigger the first deployment. Vercel provides a `.vercel.app` preview URL. Once DNS is ready, assign your custom domain.

### 2. Backend with Docker Compose

Requirements on the host:
- Docker 24+ and Docker Compose v2.
- Ports 80/443 open.
- DNS A-records for `api.yourdomain.com` (backend) and optionally `yourdomain.com` if you proxy through this node.

Steps:

1. **Copy project** to the server (or deploy from CI via `scp`/`rsync`).
2. **Create `.env` file(s)**:

```
# backend/.env
DEBUG=False
SECRET_KEY=<strong secret>
ALLOWED_HOSTS=api.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
HUGGINGFACE_API_TOKEN=hf_xxx
DATABASE_URL=postgresql://auralynx:supersecret@db:5432/auralynx_db
TORCH_DEVICE=cpu     # set to cuda if you have a GPU
USE_GPU=False        # or True when GPU is available
MODEL_CACHE_DIR=/app/models
TEMP_AUDIO_DIR=/app/temp_audio
LOG_LEVEL=INFO
```

```
# frontend/.env (optional for local preview builds)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

3. **Start services**:

```bash
docker compose up -d --build
```

This brings up:
- `backend` (gunicorn + Django)
- `db` (Postgres)
- `redis`
- `nginx`

4. **SSL**: Use Let's Encrypt (Certbot) or upload your own certs to `./ssl/` and update `nginx.conf` to point to them. Reload Nginx container after placing certs.

5. **Health check**:

```bash
curl -f https://api.yourdomain.com/api/health/
```

### 3. Connecting Vercel → Backend

On Vercel, set `NEXT_PUBLIC_API_URL` to the backend domain (`https://api.yourdomain.com/api`). The frontend now calls the backend via HTTPS and CORS should allow your Vercel domain.

### 4. Railway/Render alternative

Instead of a VPS you can deploy the backend service + Postgres to Railway/Render:

1. Create a Railway service from the `backend/` directory. Railway builds the Dockerfile automatically.
2. Add a Railway Postgres add-on, note the `DATABASE_URL`, and set it as an env variable.
3. Add other env vars from the `.env` example above.
4. Expose the service on a custom domain (e.g., `api.yourdomain.com`) and ensure CORS/ALLOWED_HOSTS include the domain.
5. For static files and temp audio, mount persistent storage or switch to S3. The simplest path is to map `temp_audio` to the Railway persistent volume and set up a cleanup job.

### 5. Common pitfalls

- **CORS mismatch**: Ensure `CORS_ALLOWED_ORIGINS` exactly matches the frontend URL (scheme + host).
- **HTTPS only**: Vercel always uses HTTPS; your backend must have HTTPS too (Nginx or Railway-provided TLS).
- **JWT clock drift**: Ensure the server clock is accurate (install `chrony`/`ntp`).
- **Temporary audio cleanup**: Set up a cron or management command to delete stale files in `/app/temp_audio`.

With this setup the workflow is:
- Developers push to main → Vercel auto-builds the frontend.
- Backend updates are deployed by re-running `docker compose up -d` on the server (or via a CI pipeline / Railway auto deploy). Frontend communicates with the backend over the documented `/api` routes.


