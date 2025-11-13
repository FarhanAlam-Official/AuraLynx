'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

interface AudioPlayerProps {
  url: string
  isPlaying: boolean
  onPlayPause: () => void
}

export default function AudioPlayer({
  url,
  isPlaying,
  onPlayPause,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [isPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatTime = (seconds: number) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  return (
    <div className="space-y-4">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => onPlayPause()}
      />

      {/* Play Button */}
      <div className="flex items-center justify-center">
        <button
          onClick={onPlayPause}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/50 transition-all"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white fill-white" />
          ) : (
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <Volume2 className="w-4 h-4 text-slate-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value))
            if (audioRef.current) {
              audioRef.current.volume = parseFloat(e.target.value)
            }
          }}
          className="flex-1 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
        />
        <span className="text-xs text-slate-400">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  )
}
