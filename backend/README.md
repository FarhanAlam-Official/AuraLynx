# SongForge Django Backend

Open-source backend for the SongForge text/voice-to-song generator application.

## Overview

This Django REST API provides endpoints for:

- **Speech-to-Text**: Transcribe audio files using OpenAI Whisper
- **Lyric Generation**: Generate song lyrics using open LLMs (Mistral 7B, GPT-J)
- **Music Generation**: Create instrumental tracks using MusicGen
- **Vocal Synthesis**: Generate singing vocals using DiffSinger/TTS
- **Audio Mixing**: Mix instrumental and vocal tracks using FFmpeg/pydub

All models are open-source with permissive licenses (MIT, Apache 2.0, CC-BY-NC).

## Installation

### Prerequisites

- Python 3.9+
- pip or conda
- FFmpeg (for audio processing)
- GPU recommended for faster inference (CUDA 11.8+)

### Setup

1. Clone the repository
\`\`\`bash
git clone <repository>
cd django_backend
\`\`\`

2. Create virtual environment
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
\`\`\`

3. Install dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

4. Run migrations
\`\`\`bash
python manage.py migrate
\`\`\`

5. Start the server
\`\`\`bash
python manage.py runserver 0.0.0.0:8000
\`\`\`

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Health Check
\`\`\`
GET /api/health/
\`\`\`

### Transcribe Audio
\`\`\`
POST /api/transcribe/
Content-Type: multipart/form-data

audio_file: <audio_file>
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "transcribed_text": "Create a song about chasing dreams..."
}
\`\`\`

### Generate Lyrics
\`\`\`
POST /api/generate-lyrics/
Content-Type: application/json

{
  "input_text": "Song theme or description",
  "genre": "pop"
}
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "lyrics": "Verse 1:\n...",
  "genre": "pop"
}
\`\`\`

### Generate Instrumental
\`\`\`
POST /api/generate-instrumental/
Content-Type: application/json

{
  "lyrics": "Song lyrics",
  "genre": "pop"
}
\`\`\`

Response:
\`\`\`json
{
  "success": true,
  "url": "/media/instrumental_xxx.wav",
  "duration": 180,
  "format": "wav"
}
\`\`\`

### Generate Vocals
\`\`\`
POST /api/generate-vocals/
Content-Type: application/json

{
  "lyrics": "Song lyrics",
  "genre": "pop"
}
\`\`\`

### Mix Audio
\`\`\`
POST /api/mix-audio/
Content-Type: application/json

{
  "instrumental_url": "/media/instrumental_xxx.wav",
  "vocals_url": "/media/vocals_xxx.wav",
  "genre": "pop"
}
\`\`\`

## Model Selection

### Speech-to-Text (Whisper)
- **Model**: openai/whisper-base (MIT)
- **Language**: Multilingual
- **Accuracy**: ~95% on clean audio

### Lyric Generation
- **Default**: mistralai/Mistral-7B (Apache 2.0)
- **Alternatives**: 
  - EleutherAI/gpt-j-6B (Apache 2.0)
  - meta-llama/Llama-2-7b (Meta Custom License)

### Music Generation
- **Model**: facebook/musicgen-small (CC-BY-NC-4.0)
- **Note**: Non-commercial use only (for this model)
- **Alternative**: Custom models for commercial use

### Vocal Synthesis
- **Primary**: DiffSinger (MIT) - Specialized for singing
- **Fallback**: espnet/eng_US_ljspeech_glow_tts

### Audio Processing
- **Mixer**: pydub (MIT) with FFmpeg (LGPL/GPL)

## Licensing

This backend is MIT-licensed. However, note the licenses of the models used:

- **Whisper**: MIT License (Commercial use allowed)
- **Mistral 7B**: Apache 2.0 (Commercial use allowed)
- **MusicGen**: CC-BY-NC-4.0 (Non-commercial use only)
- **DiffSinger**: MIT License (Commercial use allowed)

Generated song outputs are user content and not encumbered by model licenses.

## Performance

### Hardware Requirements

**Minimum** (CPU only):
- 8GB RAM
- ~30 min for full pipeline per song

**Recommended** (GPU):
- NVIDIA GPU with 6GB+ VRAM
- ~2-5 min for full pipeline per song

**Optimal** (Multi-GPU):
- 2x NVIDIA GPUs (24GB+ VRAM)
- Parallel inference for lyrics + music

### Optimization Tips

1. **Model Caching**: Models are cached after first download
2. **Batch Processing**: Queue multiple requests for efficiency
3. **GPU Allocation**: Use `CUDA_VISIBLE_DEVICES` to control GPU usage
4. **Memory Management**: Monitor `/temp_audio` for cleanup

## Troubleshooting

### Out of Memory
\`\`\`bash
# Reduce model size
TRANSFORMERS_CACHE=./models python manage.py runserver
\`\`\`

### CUDA Errors
\`\`\`bash
# Disable GPU
export CUDA_VISIBLE_DEVICES=""
python manage.py runserver
\`\`\`

### Audio File Issues
- Ensure FFmpeg is installed: `ffmpeg -version`
- Supported formats: MP3, WAV, M4A, FLAC

## Integration with Next.js Frontend

The frontend connects to this API at `http://localhost:8000/api/`. 

Example fetch call:
\`\`\`typescript
const response = await fetch('http://localhost:8000/api/generate-lyrics/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input_text: 'Song theme',
    genre: 'pop'
  })
})
\`\`\`

## Deployment

### Docker
\`\`\`dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi"]
\`\`\`

### Cloud Platforms
- **AWS EC2**: Use GPU instance type (g4dn.xlarge or larger)
- **Google Cloud**: Use TPU or GPU instances
- **Azure**: Use GPU compute instances
- **Hugging Face Spaces**: Limited free tier for inference

### Environment Variables
\`\`\`
DJANGO_SECRET_KEY=<production-secret>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
MODEL_CACHE_DIR=/var/models
TEMP_AUDIO_DIR=/var/temp_audio
\`\`\`

## Future Enhancements

- [ ] Voice cloning with user's voice sample
- [ ] Real-time generation streaming
- [ ] Multi-language support
- [ ] Batch API for multiple songs
- [ ] Advanced mixing with EQ/compression
- [ ] DAW export (stems)
- [ ] Caching layer for common requests
- [ ] Rate limiting and authentication
- [ ] Webhook notifications for long jobs

## Contributing

Contributions welcome! Please follow:
- PEP 8 code style
- Add tests for new features
- Update documentation
- Submit PRs against main branch

## License

MIT License - See LICENSE file

## Support

For issues, questions, or contributions, please open an issue on GitHub or visit our documentation at https://songforge.dev
