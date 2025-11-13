'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Music, Headphones } from 'lucide-react'
import LoadingSpinner from './loading-spinner'

interface GenerationPageProps {
  lyrics: string
  genre: string
  onComplete: (instrumental: string, vocals: string, mix: string) => void
  onBack: () => void
}

type GenerationStep = 'instrumental' | 'vocals' | 'mixing' | 'complete'

export default function GenerationPage({
  lyrics,
  genre,
  onComplete,
  onBack,
}: GenerationPageProps) {
  const [currentStep, setCurrentStep] = useState<GenerationStep>('instrumental')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Start the real generation process
    generateAudio()
  }, [])

  const generateAudio = async () => {
    try {
      // Step 1: Generate Instrumental
      console.log('🎵 Generating instrumental...')
      setCurrentStep('instrumental')
      setProgress(20)
      
      const instrumentalResponse = await fetch('http://localhost:8000/api/generate-instrumental/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics, genre })
      })
      
      if (!instrumentalResponse.ok) {
        throw new Error(`Instrumental generation failed: ${instrumentalResponse.status}`)
      }
      
      const instrumentalData = await instrumentalResponse.json()
      console.log('✅ Instrumental generated:', instrumentalData)
      setProgress(50)
      
      // Step 2: Generate Vocals
      console.log('🎤 Generating vocals...')
      setCurrentStep('vocals')
      
      const vocalsResponse = await fetch('http://localhost:8000/api/generate-vocals/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics, genre })
      })
      
      if (!vocalsResponse.ok) {
        throw new Error(`Vocals generation failed: ${vocalsResponse.status}`)
      }
      
      const vocalsData = await vocalsResponse.json()
      console.log('✅ Vocals generated:', vocalsData)
      setProgress(80)
      
      // Step 3: Mix Audio
      console.log('🔄 Mixing audio tracks...')
      setCurrentStep('mixing')
      
      const mixResponse = await fetch('http://localhost:8000/api/mix-audio/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          instrumental_url: instrumentalData.url,
          vocals_url: vocalsData.url,
          genre 
        })
      })
      
      if (!mixResponse.ok) {
        throw new Error(`Audio mixing failed: ${mixResponse.status}`)
      }
      
      const mixData = await mixResponse.json()
      console.log('✅ Final mix created:', mixData)
      setProgress(100)
      
      // Complete
      setCurrentStep('complete')
      
      // Pass the URLs to parent component
      onComplete(
        instrumentalData.url,
        vocalsData.url,
        mixData.url
      )
      
    } catch (error) {
      console.error('❌ Generation failed:', error)
      // Handle error - could show error state
    }
  }



  const getStepTitle = (step: GenerationStep) => {
    switch (step) {
      case 'instrumental':
        return 'Generating Instrumental Track'
      case 'vocals':
        return 'Generating Singing Vocals'
      case 'mixing':
        return 'Mixing Audio Tracks'
      case 'complete':
        return 'Generation Complete!'
    }
  }

  const getStepDescription = (step: GenerationStep) => {
    switch (step) {
      case 'instrumental':
        return `Creating a ${genre} backing track based on your theme...`
      case 'vocals':
        return 'Synthesizing singing vocals for your lyrics...'
      case 'mixing':
        return 'Combining instrumental and vocals...'
      case 'complete':
        return 'Your song is ready to preview!'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={currentStep !== 'instrumental'}
            className="text-slate-400 hover:text-white disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">Creating Your Song</h1>
          <div className="w-12" />
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          {['input', 'lyrics', 'generation', 'preview'].map((step, idx) => (
            <div
              key={step}
              className={`flex-1 h-1 rounded-full ${
                idx <= 2 ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Main generation card */}
        <Card className="bg-slate-800/50 border-slate-700 p-12">
          <div className="text-center space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              {currentStep === 'instrumental' && (
                <LoadingSpinner>
                  <Music className="w-12 h-12 text-blue-400" />
                </LoadingSpinner>
              )}
              {currentStep === 'vocals' && (
                <LoadingSpinner>
                  <Headphones className="w-12 h-12 text-purple-400" />
                </LoadingSpinner>
              )}
              {currentStep === 'mixing' && (
                <LoadingSpinner>
                  <Music className="w-12 h-12 text-cyan-400" />
                </LoadingSpinner>
              )}
              {currentStep === 'complete' && (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {getStepTitle(currentStep)}
              </h2>
              <p className="text-slate-400">
                {getStepDescription(currentStep)}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  currentStep === 'complete'
                    ? 'bg-green-500 w-full'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Details */}
            <div className="bg-slate-900/50 rounded-lg p-4 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Genre:</span>
                  <span className="text-white capitalize font-medium">
                    {genre}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Lyrics lines:</span>
                  <span className="text-white font-medium">
                    {lyrics.split('\n').filter(l => l.trim()).length}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="text-white font-medium capitalize">
                    {currentStep.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>

            {currentStep === 'complete' && (
              <p className="text-sm text-green-400">
                ✓ All generation steps completed successfully
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
