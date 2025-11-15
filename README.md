# 🎵 AuraLynx - AI-Powered Music Creation Platform

<div align="center">

![AuraLynx Logo](frontend/public/logo.png)

**Transform your ideas into complete songs with AI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Django-4.2+-green.svg)](https://www.djangoproject.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)

[🚀 Demo](#demo) • [📖 Documentation](#documentation) • [🛠️ Installation](#installation) • [🎯 Features](#features) • [🤝 Contributing](#contributing)

</div>

## ✨ Overview

**AuraLynx** is an open-source AI-powered music creation platform that transforms text descriptions or voice recordings into complete songs. Using cutting-edge AI models, it generates lyrics, creates instrumental tracks, synthesizes vocals, and mixes everything into professional-quality songs.

### 🎯 What makes AuraLynx special?

- 🎤 **Voice-to-Song**: Record your idea and get a complete song
- 📝 **Text-to-Song**: Describe your vision and AI creates the music
- 🎼 **Complete Pipeline**: Lyrics → Instrumentals → Vocals → Mixed Song
- 🆓 **100% Free**: No sign-ups, subscriptions, or hidden costs
- 🔓 **Open Source**: All AI models use permissive licenses
- 🎨 **Commercial Use**: Create songs for your projects freely
- 🔒 **Privacy First**: Your data stays on your device

## 🚀 Demo

### Live Demo

🌐 **[Try AuraLynx Live](https://auralynx-demo.vercel.app)** *(Coming Soon)*

### Quick Start Video

📺 **[Watch Demo Video](https://youtube.com/watch?v=demo)** *(Coming Soon)*

### Example Generation

```
Input: "Create an upbeat pop song about chasing dreams"
Output: Complete 3-minute song with lyrics, melody, and vocals
Time: ~2-5 minutes on GPU, ~15-30 minutes on CPU
```

## 🎯 Features

### 🎵 **Complete Music Production Suite**

| Feature | Description | AI Model |
|---------|-------------|----------|
| **🎤 Speech-to-Text** | Convert voice recordings to text | OpenAI Whisper |
| **📝 Smart Lyrics** | Generate genre-specific lyrics | Hugging Face GPT-2 |
| **🎼 Melody Creation** | Create backing tracks and instrumentals | Custom Audio Synthesis |
| **🎙️ Vocal Synthesis** | Transform lyrics into singing vocals | Advanced TTS |
| **🎧 Audio Mixing** | Professional mixing and mastering | FFmpeg + pydub |

### 🛠️ **Technical Features**

- ⚡ **Real-time Processing**: Efficient AI pipeline
- 🎚️ **Advanced Mixing**: EQ, compression, and effects
- 🎵 **Multiple Genres**: Pop, Rock, Jazz, Hip-hop, Electronic, and more
- 📱 **Responsive Design**: Works on desktop and mobile
- 🔄 **Batch Processing**: Generate multiple songs simultaneously
- 💾 **Export Options**: WAV, MP3, stems, and project files

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Models     │
│   (Next.js)     │◄──►│   (Django)      │◄──►│  (HuggingFace)  │
│                 │    │                 │    │                 │
│ • Landing Page  │    │ • REST API      │    │ • Whisper ASR   │
│ • Audio Player  │    │ • File Handling │    │ • GPT-2 Lyrics  │
│ • Generation UI │    │ • AI Pipeline   │    │ • Audio Synth   │
│ • Progress UI   │    │ • Audio Mixing  │    │ • TTS Vocals    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Installation

### Prerequisites

- **Python 3.9+** (Backend)
- **Node.js 18+** (Frontend)
- **FFmpeg** (Audio processing)
- **Git** (Version control)
- **8GB+ RAM** (16GB recommended for GPU)

### 🚀 Quick Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/auralynx.git
   cd auralynx
   ```

2. **Backend Setup**

   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   # or
   pnpm install
   
   npm run dev
   # or
   pnpm run dev
   ```

4. **Access the Application**
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:8000/api>

### 🐳 Docker Setup (Alternative)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

### ☁️ Environment Variables

Create `.env` files in both directories:

**Backend (.env)**

```env
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
HUGGINGFACE_API_KEY=your-hf-token-here
```

**Frontend (.env.local)**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🎮 Usage

### 1. **Text-to-Song Generation**

```typescript
// Example API call
const response = await fetch('/api/generate-lyrics/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input_text: 'Create a happy song about friendship',
    genre: 'pop'
  })
});
```

### 2. **Voice-to-Song Generation**

```typescript
// Upload audio file
const formData = new FormData();
formData.append('audio_file', audioFile);

const response = await fetch('/api/transcribe/', {
  method: 'POST',
  body: formData
});
```

### 3. **Complete Pipeline**

```bash
Input → Transcription → Lyrics → Instrumentals → Vocals → Mixed Song
```

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/transcribe/` | Convert audio to text |
| `POST` | `/api/generate-lyrics/` | Generate song lyrics |
| `POST` | `/api/generate-instrumental/` | Create backing track |
| `POST` | `/api/generate-vocals/` | Generate singing vocals |
| `POST` | `/api/mix-audio/` | Mix final song |

### Example Response

```json
{
  "success": true,
  "lyrics": "Verse 1:\nChasing dreams...",
  "instrumental_url": "http://localhost:8000/media/track_123.wav",
  "vocals_url": "http://localhost:8000/media/vocals_123.wav",
  "mixed_url": "http://localhost:8000/media/song_123.wav",
  "duration": 180
}
```

## 🧠 AI Models Used

### Core Models

| Component | Model | License | Commercial Use |
|-----------|-------|---------|----------------|
| **Speech Recognition** | OpenAI Whisper | MIT | ✅ Yes |
| **Lyrics Generation** | Hugging Face GPT-2 | Apache 2.0 | ✅ Yes |
| **Audio Synthesis** | Custom Models | MIT | ✅ Yes |
| **Text-to-Speech** | Advanced TTS | MIT | ✅ Yes |

### Model Performance

| Hardware | Processing Time | Quality |
|----------|----------------|---------|
| **CPU Only** | 15-30 minutes | Good |
| **GPU (6GB+)** | 2-5 minutes | Excellent |
| **Multi-GPU** | 1-2 minutes | Excellent |

## 🎨 Technology Stack

### Frontend

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS + Custom Animations
- **UI Components**: Custom component library
- **Audio**: Web Audio API + Visualization
- **State Management**: React Hooks + Context

### Backend

- **Framework**: Django 4.2 + Django REST Framework
- **AI/ML**: Hugging Face Transformers, PyTorch
- **Audio Processing**: FFmpeg, pydub, librosa
- **Storage**: Local filesystem + Media serving
- **APIs**: RESTful API with JSON responses

### AI & Audio

- **Speech Recognition**: OpenAI Whisper
- **Text Generation**: GPT-2, Custom models
- **Audio Synthesis**: Custom neural audio generation
- **Audio Processing**: NumPy, SciPy, librosa

## 🚀 Deployment

### Production Deployment

1. **Using Vercel + Railway**

   ```bash
   # Frontend on Vercel
   vercel --prod
   
   # Backend on Railway
   railway login
   railway deploy
   ```

2. **Using Docker**

   ```bash
   docker build -t auralynx-frontend ./frontend
   docker build -t auralynx-backend ./backend
   ```

3. **Environment Setup**
   - Configure production environment variables
   - Set up media file storage (AWS S3, etc.)
   - Configure domain and SSL certificates

### Performance Optimization

- **Model Caching**: Pre-download models for faster startup
- **CDN**: Serve static assets via CDN
- **Database**: Use PostgreSQL for production
- **Monitoring**: Set up logging and performance monitoring

## 🤝 Contributing

We love contributions! Here's how to get started:

### 🐛 Bug Reports

- Use GitHub Issues with the "bug" label
- Include steps to reproduce
- Provide system information

### ✨ Feature Requests

- Use GitHub Issues with the "enhancement" label
- Describe the feature and use case
- Include mockups if applicable

### 💻 Development Setup

```bash
# Fork the repository
git clone https://github.com/yourusername/auralynx.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m 'Add amazing feature'

# Push and create PR
git push origin feature/amazing-feature
```

### 📋 Guidelines

- Follow code style (ESLint + Prettier)
- Add tests for new features
- Update documentation
- Keep commits atomic and well-described

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Model Licenses

- **Generated Content**: Your generated songs are your property
- **AI Models**: All models use permissive licenses (MIT, Apache 2.0)
- **Commercial Use**: ✅ Fully allowed for all components

## 🌟 Roadmap

### 🎯 Version 2.0

- [ ] **Real-time Generation**: Streaming audio generation
- [ ] **Voice Cloning**: Clone any voice for vocals
- [ ] **Advanced Mixing**: Professional DAW-level mixing
- [ ] **Collaboration**: Multi-user song creation
- [ ] **Mobile App**: Native iOS/Android apps

### 🎯 Version 3.0

- [ ] **Live Performance**: Real-time song generation for live shows
- [ ] **AI Mastering**: Automatic professional mastering
- [ ] **Marketplace**: Share and sell generated songs
- [ ] **Plugin System**: VST/AU plugin for DAWs

## 🙏 Acknowledgments

- **OpenAI** for Whisper speech recognition
- **Hugging Face** for transformer models and API
- **Meta** for audio processing research
- **Vercel** for Next.js framework
- **Django** team for the robust backend framework

## 📞 Support & Community

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/auralynx/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/auralynx/discussions)
- 📧 **Email**: <support@auralynx.dev>
- 🐦 **Twitter**: [@AuraLynxAI](https://twitter.com/AuraLynxAI)
- 💬 **Discord**: [Join Community](https://discord.gg/auralynx)

## 🎵 Made with AuraLynx

Share your creations using **#MadeWithAuraLynx**!

---

<div align="center">

**[⭐ Star this repository](https://github.com/yourusername/auralynx)** if you find AuraLynx helpful!

Made with ❤️ by the AuraLynx Community

</div>
