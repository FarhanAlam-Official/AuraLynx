'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/components/auth-context'
import { buildApiUrl } from '@/lib/utils'
import {
  ArrowLeft,
  Music,
  Download,
  ExternalLink,
  Timer,
  Disc3,
} from 'lucide-react'
import AudioPlayer from '@/components/audio-player'

interface MySongsPageProps {
  onBack: () => void
}

interface Song {
  id: number
  title: string
  genre: string
  lyrics: string
  instrumental_url: string
  vocals_url: string
  mix_url: string
  duration_seconds?: number
  created_at: string
}

export default function MySongsPage({ onBack }: MySongsPageProps) {
  const { user, accessToken } = useAuth()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSongId, setActiveSongId] = useState<number | null>(null)

  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      setSongs([])
      return
    }

    const fetchSongs = async () => {
      try {
        setLoading(true)
        const response = await fetch(buildApiUrl('/songs/'), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch songs')
        }
        const data = await response.json()
        setSongs(data)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Failed to load songs')
      } finally {
        setLoading(false)
      }
    }

    fetchSongs()
  }, [accessToken])

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'n/a'
    const minutes = Math.floor(seconds / 60)
    const remaining = seconds % 60
    return `${minutes}:${remaining.toString().padStart(2, '0')}`
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 flex items-center justify-center">
        <Card className="bg-slate-900/80 border-slate-700 p-8 max-w-md text-center">
          <Music className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Sign in required</h2>
          <p className="text-slate-400 text-sm">
            Create an account or sign in to save and view your generated songs.
          </p>
          <Button className="mt-4" onClick={onBack}>
            Back to home
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-white">My Songs</h1>
          <div className="text-sm text-slate-400">
            Signed in as <span className="text-white">{user.username}</span>
          </div>
        </div>

        {loading ? (
          <Card className="bg-slate-900/60 border-slate-800 p-8 text-center text-slate-400">
            Loading your songs...
          </Card>
        ) : error ? (
          <Card className="bg-red-900/30 border border-red-700 p-6 text-red-200">
            {error}
          </Card>
        ) : songs.length === 0 ? (
          <Card className="bg-slate-900/60 border-slate-800 p-8 text-center text-slate-400">
            You haven’t saved any songs yet. Generate one and hit “Save to your account” on the preview screen.
          </Card>
        ) : (
          <div className="space-y-6">
            {songs.map(song => (
              <Card key={song.id} className="bg-slate-900/60 border-slate-800 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{song.title}</h2>
                    <p className="text-slate-400 text-sm capitalize">{song.genre}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {formatDuration(song.duration_seconds)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Disc3 className="w-3 h-3" />
                      {new Date(song.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <AudioPlayer
                      url={song.mix_url}
                      isPlaying={activeSongId === song.id}
                      onPlayPause={() =>
                        setActiveSongId(prev =>
                          prev === song.id ? null : song.id
                        )
                      }
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-300 border-slate-600"
                        onClick={() => window.open(song.mix_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open mix
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-300 border-slate-600"
                        onClick={() =>
                          handleDownload(song.mix_url, `${song.title}.wav`)
                        }
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-2">
                      Lyrics
                    </h3>
                    <p className="text-xs text-slate-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {song.lyrics}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


