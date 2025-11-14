'use client'

import { Button } from '@/components/ui/button'
import { Volume2, Music, Headphones } from 'lucide-react'

interface MixingControlsProps {
  showVocals: boolean
  showInstrumental: boolean
  onVocalsToggle: () => void
  onInstrumentalToggle: () => void
}

export default function MixingControls({
  showVocals,
  showInstrumental,
  onVocalsToggle,
  onInstrumentalToggle,
}: MixingControlsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onVocalsToggle}
          className={`transition-all ${
            showVocals
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
          }`}
        >
          <Headphones className="w-4 h-4 mr-2" />
          Vocals
          {showVocals ? ' ✓' : ''}
        </Button>
        <Button
          onClick={onInstrumentalToggle}
          className={`transition-all ${
            showInstrumental
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
          }`}
        >
          <Music className="w-4 h-4 mr-2" />
          Instrument
          {showInstrumental ? ' ✓' : ''}
        </Button>
      </div>
      <p className="text-xs text-slate-400 text-center">
        Toggle tracks to hear them separately
      </p>
    </div>
  )
}
