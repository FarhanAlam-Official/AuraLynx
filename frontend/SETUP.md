# Frontend Development Setup Instructions

## Prerequisites

- Node.js 18+ installed
- pnpm or npm package manager

## Environment Variables (.env file created)

The following environment variables are now configured:

### API Configuration

- NEXT_PUBLIC_API_URL=http://localhost:8000/api (backend API endpoint)
- NEXT_PUBLIC_BASE_URL=<http://localhost:3000> (frontend URL)

### Feature Flags

- NEXT_PUBLIC_ENABLE_VOICE_RECORDING=true
- NEXT_PUBLIC_ENABLE_FILE_UPLOAD=true
- NEXT_PUBLIC_MOCK_API_RESPONSES=true (currently using mock data)

### Audio Settings

- NEXT_PUBLIC_MAX_AUDIO_SIZE_MB=50
- NEXT_PUBLIC_SUPPORTED_AUDIO_FORMATS=mp3,wav,m4a,ogg
- NEXT_PUBLIC_MAX_LYRICS_LENGTH=2000

## Setup Instructions

1. **Install Dependencies (Already Done):**

   ```bash
   cd frontend
   pnpm install
   ```

2. **Start Development Server:**

   ```bash
   pnpm dev
   ```

## Available Scripts

- `pnpm dev` - Start development server (port 3000)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Current Status

✅ Environment configured
✅ Dependencies installed
✅ Mock UI implemented
⚠️  API integration pending (using mock data)

## Application Flow

1. Landing Page - Choose text or voice input
2. Input Page - Enter text or record audio
3. Lyrics Page - Review/edit generated lyrics
4. Generation Page - AI generates music and vocals
5. Preview Page - Play and download final song

## UI Components Available

- Landing page with mode selection
- Text input and voice recording
- Audio visualizer for recording
- Lyrics editor with genre selection
- Generation progress with loading states
- Audio player with mixing controls
- Download and sharing options

## Next Steps

1. Connect to backend API (set NEXT_PUBLIC_MOCK_API_RESPONSES=false)
2. Implement real API calls in components
3. Add error handling for API failures
4. Implement audio file handling
5. Add user authentication if needed
