'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, Download, Share2, RotateCcw, Volume2, Eye, EyeOff, User } from 'lucide-react'
import AudioPlayer from './audio-player'
import MixingControls from './mixing-controls'
import { useAuth } from '@/components/auth-context'
import { AuthDialog } from '@/components/auth-dialog'
import { buildApiUrl } from '@/lib/utils'

interface PreviewPageProps {
  lyrics: string
  genre: string
  instrumentalUrl: string
  vocalsUrl: string
  finalMixUrl: string
  onRestart: () => void
  onViewSongs: () => void
}

export default function PreviewPage({
  lyrics,
  genre,
  instrumentalUrl,
  vocalsUrl,
  finalMixUrl,
  onRestart,
  onViewSongs,
}: PreviewPageProps) {
  const [showVocals, setShowVocals] = useState(true)
  const [showInstrumental, setShowInstrumental] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLyrics, setShowLyrics] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const { user, accessToken } = useAuth()

  const handleSaveSong = async () => {
    if (!accessToken) {
      setAuthOpen(true)
      return
    }

    try {
      setSaving(true)
      setSaveError(null)
      const res = await fetch(buildApiUrl('/songs/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: `AuraLynx ${genre} song`,
          genre,
          lyrics,
          instrumental_url: instrumentalUrl,
          vocals_url: vocalsUrl,
          mix_url: finalMixUrl,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.detail || 'Failed to save song')
      }
    } catch (error) {
      console.error(error)
      setSaveError(error instanceof Error ? error.message : 'Failed to save song')
    } finally {
      setSaving(false)
    }
  }

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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">Your Song</h1>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center text-xs text-slate-300 bg-slate-800/70 rounded-full px-3 py-1">
                <User className="w-3 h-3 mr-1" />
                <span>{user.username}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onRestart}
              className="text-slate-300 border-slate-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Create New
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onViewSongs}
              className="bg-slate-800 text-slate-100 border border-slate-600"
            >
              View saved songs
            </Button>
          </div>
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

        {saveError && (
          <div className="mb-4 bg-red-900/30 border border-red-700 rounded-lg p-3 text-xs text-red-200">
            {saveError}
          </div>
        )}

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

            {/* Save, Download & Share */}
            <Card className="bg-slate-800/50 border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Save & Export</h2>
              <div className="space-y-3">
                <Button
                  onClick={handleSaveSong}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={saving}
                >
                  {saving ? 'Saving…' : user ? 'Save to your account' : 'Sign in to save'}
                </Button>
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

        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      </div>
    </div>
  )
}
