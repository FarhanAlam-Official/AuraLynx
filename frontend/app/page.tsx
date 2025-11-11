'use client'

import { useState } from 'react'
import LandingPage from '@/components/landing-page'
import InputPage from '@/components/input-page'
import LyricsPage from '@/components/lyrics-page'
import GenerationPage from '@/components/generation-page'
import PreviewPage from '@/components/preview-page'

type Stage = 'landing' | 'input' | 'lyrics' | 'generation' | 'preview'

interface AppState {
  inputText: string
  inputMode: 'text' | 'voice'
  transcribedText: string
  generatedLyrics: string
  genre: string
  generatedInstrumental: string
  generatedVocals: string
  finalMix: string
}

export default function Home() {
  const [stage, setStage] = useState<Stage>('landing')
  const [appState, setAppState] = useState<AppState>({
    inputText: '',
    inputMode: 'text',
    transcribedText: '',
    generatedLyrics: '',
    genre: 'pop',
    generatedInstrumental: '',
    generatedVocals: '',
    finalMix: '',
  })

  const updateState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }))
  }

  const handleLandingSubmit = (mode: 'text' | 'voice') => {
    updateState({ inputMode: mode })
    setStage('input')
  }

  const handleInputSubmit = (text: string) => {
    updateState({ inputText: text, transcribedText: text })
    setStage('lyrics')
  }

  const handleLyricsSubmit = (lyrics: string, genre: string) => {
    updateState({ generatedLyrics: lyrics, genre })
    setStage('generation')
  }

  const handleGenerationComplete = (instrumental: string, vocals: string, mix: string) => {
    updateState({
      generatedInstrumental: instrumental,
      generatedVocals: vocals,
      finalMix: mix,
    })
    setStage('preview')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {stage === 'landing' && <LandingPage onSubmit={handleLandingSubmit} />}
      {stage === 'input' && (
        <InputPage
          inputMode={appState.inputMode}
          onSubmit={handleInputSubmit}
          onBack={() => setStage('landing')}
        />
      )}
      {stage === 'lyrics' && (
        <LyricsPage
          inputText={appState.inputText}
          onSubmit={handleLyricsSubmit}
          onBack={() => setStage('input')}
        />
      )}
      {stage === 'generation' && (
        <GenerationPage
          lyrics={appState.generatedLyrics}
          genre={appState.genre}
          onComplete={handleGenerationComplete}
          onBack={() => setStage('lyrics')}
        />
      )}
      {stage === 'preview' && (
        <PreviewPage
          lyrics={appState.generatedLyrics}
          genre={appState.genre}
          instrumentalUrl={appState.generatedInstrumental}
          vocalsUrl={appState.generatedVocals}
          finalMixUrl={appState.finalMix}
          onRestart={() => setStage('landing')}
        />
      )}
    </div>
  )
}
