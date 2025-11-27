## Environment & API Keys

This document explains which environment variables AuraLynx uses, how to obtain
the required API keys, and which (free) models are used by default.

### 1. Backend environment variables (`backend`)

Set these as environment variables in your process manager, Docker Compose, or
cloud provider. Do not commit real values to source control.

- `DEBUG`  
  - `True` for local development, `False` for production.

- `SECRET_KEY`  
  - Django secret key used for signing cookies and CSRF tokens.  
  - Generate a strong value (e.g. `python -c "import secrets; print(secrets.token_urlsafe(50))"`).

- `ALLOWED_HOSTS`  
  - Comma-separated list of hostnames that can serve the site.  
  - Example: `ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com`.

- `CORS_ALLOWED_ORIGINS`  
  - Comma-separated list of frontend origins that can call the API.  
  - Local dev: `http://localhost:3000,http://127.0.0.1:3000`.

- `DATABASE_URL` (optional but recommended in production)  
  - URL-style database configuration (Postgres, etc.).  
  - Example: `postgresql://user:password@db:5432/auralynx_db`.  
  - If not set, the project falls back to SQLite for local development.

- `HUGGINGFACE_API_TOKEN` (required for lyrics + optional models)  
  - Free access token from Hugging Face.  
  - Obtain from: `https://huggingface.co/settings/tokens`.  
  - Grant at least `read` access to use hosted inference models.

- `ELEVENLABS_API_KEY` (optional, only if you enable ElevenLabs voices)  
  - Obtain from: `https://elevenlabs.io/app/settings/api-keys`.  
  - Required for high-quality AI vocals when using the ElevenLabs backend.

- `OPENAI_API_KEY` (optional)  
  - Only needed if you later add any OpenAI-hosted models.  
  - Obtain from: `https://platform.openai.com/api-keys`.

- `MODEL_CACHE_DIR`  
  - Directory where local models are cached (if you use local models).  
  - Default: `./models`.

- `TEMP_AUDIO_DIR`  
  - Directory where generated/intermediate audio files are stored.  
  - Default: `./temp_audio`.

- `MAX_AUDIO_SIZE_MB`  
  - Maximum request size for uploaded audio files, in megabytes.  
  - Default: `100`.

- `DEFAULT_AUDIO_DURATION_SECONDS`  
  - Target/expected duration for generated audio.  
  - Default: `180` (3 minutes).

- `FFMPEG_PATH`  
  - Path or executable name for FFmpeg.  
  - Default: `ffmpeg` (must be on `PATH`).

- `TORCH_DEVICE`  
  - Hardware target for PyTorch (`auto`, `cpu`, or `cuda`).  
  - In many cases `auto` is fine (project will pick GPU if available).

- `USE_GPU`  
  - `True` or `False`. Allows you to explicitly disable GPU usage even if
    available (useful for constrained environments).

- `MODEL_PRECISION`  
  - Numeric precision for models, such as `float32` or `float16`.  
  - Use `float16` cautiously and only on GPUs that support it.

- `LOG_LEVEL`  
  - Logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`).  
  - For production, `INFO` or higher is recommended.

### 2. Frontend environment variables (`frontend`)

These variables are read by Next.js at build time and must be prefixed with
`NEXT_PUBLIC_` to be visible in the browser.

- `NEXT_PUBLIC_API_URL`  
  - Base URL for the backend API.  
  - Local dev: `http://localhost:8000/api`.  
  - Production (behind nginx): `https://yourdomain.com/api`.

- `NEXT_PUBLIC_BASE_URL`  
  - Public base URL of the frontend itself (used in share links, etc.).  
  - Example: `https://yourdomain.com`.

### 3. Default free models

The codebase is designed to work with **free, permissively licensed models**
where possible. You can change these via environment variables or settings
later, but the baseline is:

- **Transcription (speech → text)**  
  - Model: a Whisper variant via Hugging Face or local `transformers`.  
  - License: MIT (OpenAI Whisper).

- **Lyrics generation (text → lyrics)**  
  - Model: GPT‑2–style model via Hugging Face Inference API  
    (e.g. `gpt2-large` or similar).  
  - License: typically Apache 2.0 or MIT depending on model choice.

- **Instrumental generation (text/lyrics → music)**  
  - Initial implementation uses a **procedural audio generator** (no external
    APIs, no cost).  
  - The plan includes adding support for free MusicGen‑like models through
    Hugging Face or local inference. If you enable these, be sure to review
    each model’s license (some MusicGen weights are non‑commercial).

- **Vocal synthesis (lyrics → singing)**  
  - Initial implementation uses a **procedural vocal-like synth** to avoid
    heavy GPU use and external APIs.  
  - The plan includes optional integration with free singing voice models
    (e.g. DiffSinger/OpenVoice variants). Check each model’s license before
    enabling it in production.

For concrete model names and licensing details, see `docs/MODELS.md` (once
added) and the comments inside `backend/api/utils.py`.

### 4. Where to configure models

Model choices are centralized in the Django settings and utility functions:

- `backend/config/settings.py`  
  - Controls tokens, cache directories, and performance flags.

- `backend/api/utils.py`  
  - Contains the actual calls to Hugging Face and the placeholder generators.  
  - When you swap in real MusicGen / vocal models, you will add configuration
    there and reference the environment variables listed above.

Always make sure your environment variables are set in your deployment platform
before starting the app, and never commit real secrets to the repository.
