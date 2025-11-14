'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, Download, Share2, RotateCcw, Volume2, Eye, EyeOff } from 'lucide-react'
import AudioPlayer from './audio-player'
import MixingControls from './mixing-controls'

interface PreviewPageProps {
  lyrics: string
  genre: string
  instrumentalUrl: string
  vocalsUrl: string
  finalMixUrl: string
  onRestart: () => void
}

export default function PreviewPage({
  lyrics,
  genre,
  instrumentalUrl,
  vocalsUrl,
  finalMixUrl,
  onRestart,
}: PreviewPageProps) {
  const [showVocals, setShowVocals] = useState(true)
  const [showInstrumental, setShowInstrumental] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLyrics, setShowLyrics] = useState(true)

  const handleDownload = (format: 'mp3' | 'wav') => {
    // In production, this would download the actual file
    const link = document.createElement('a')
    link.href = finalMixUrl
    link.download = `song.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Generated Song',
        text: `Check out the song I created with AuraLynx! 🎵`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Your Song</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="text-slate-300 border-slate-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          {['input', 'lyrics', 'generation', 'preview'].map((step, idx) => (
            <div
              key={step}
              className={`flex-1 h-1 rounded-full ${
                idx <= 3 ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Player */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Player */}
            <Card className="bg-slate-800/50 border-slate-700 p-8">
              <AudioPlayer
                url={finalMixUrl}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
              />
            </Card>

            {/* Mixing Controls */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Mix Controls
              </h2>
              <MixingControls
                showVocals={showVocals}
                showInstrumental={showInstrumental}
                onVocalsToggle={() => setShowVocals(!showVocals)}
                onInstrumentalToggle={() =>
                  setShowInstrumental(!showInstrumental)
                }
              />
            </Card>

            {/* Lyrics Display */}
            {showLyrics && (
              <Card className="bg-slate-800/50 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Lyrics</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLyrics(false)}
                    className="text-slate-400"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 text-white text-sm leading-relaxed font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {lyrics}
                </div>
              </Card>
            )}

            {!showLyrics && (
              <Button
                variant="outline"
                onClick={() => setShowLyrics(true)}
                className="w-full text-slate-300 border-slate-600"
              >
                <EyeOff className="w-4 h-4 mr-2" />
                Show Lyrics
              </Button>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Song Info */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Song Details
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400">Genre</p>
                  <p className="text-white font-medium capitalize">
                    {genre}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Duration</p>
                  <p className="text-white font-medium">~3:45</p>
                </div>
                <div>
                  <p className="text-slate-400">Format</p>
                  <p className="text-white font-medium">Stereo WAV</p>
                </div>
              </div>
            </Card>

            {/* Download & Share */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Export</h2>
              <div className="space-y-3">
                <Button
                  onClick={() => handleDownload('mp3')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download MP3
                </Button>
                <Button
                  onClick={() => handleDownload('wav')}
                  variant="outline"
                  className="w-full text-slate-300 border-slate-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download WAV
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full text-slate-300 border-slate-600"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </Card>

            {/* License Info */}
            <Card className="bg-slate-800/50 border-slate-700 p-4">
              <p className="text-xs text-slate-400">
                This song was created using open-source AI models. The content
                is generated and meant for personal use.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
