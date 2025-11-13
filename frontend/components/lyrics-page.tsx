'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Edit2, Check, Loader2 } from 'lucide-react'

interface LyricsPageProps {
  inputText: string
  onSubmit: (lyrics: string, genre: string) => void
  onBack: () => void
}

const GENRES = [
  'pop',
  'rock',
  'hip-hop',
  'indie',
  'electronic',
  'folk',
  'jazz',
  'r&b',
]

export default function LyricsPage({
  inputText,
  onSubmit,
  onBack,
}: LyricsPageProps) {
  const [selectedGenre, setSelectedGenre] = useState('pop')
  const [isEditingLyrics, setIsEditingLyrics] = useState(false)
  const [generatedLyrics, setGeneratedLyrics] = useState('')
  const [editingLyrics, setEditingLyrics] = useState('')
  const [isGenerating, setIsGenerating] = useState(true)
  const [error, setError] = useState('')

  // Generate lyrics when component mounts
  useEffect(() => {
    generateLyrics()
  }, [inputText])

  const generateLyrics = async () => {
    if (!inputText) return
    
    setIsGenerating(true)
    setError('')
    
    try {
      console.log('Generating lyrics for:', inputText)
      const response = await fetch('http://localhost:8000/api/generate-lyrics/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_text: inputText,
          genre: selectedGenre
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Generated lyrics response:', data)
      
      if (data.success && data.lyrics) {
        setGeneratedLyrics(data.lyrics)
        setEditingLyrics(data.lyrics)
      } else {
        throw new Error(data.error || 'Failed to generate lyrics')
      }
    } catch (error) {
      console.error('Error generating lyrics:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate lyrics')
      // Fallback lyrics based on input
      const fallbackLyrics = `Verse 1:
${inputText} is calling me
Through the night, I can see
Dreams are dancing in my mind
Leaving all my fears behind

Chorus:
This is my story, this is my song
About ${inputText}, where I belong
Every beat, every rhyme
Captures this moment in time

Verse 2:
In the world of ${inputText}
I find my way, I find my truth
Music guides me through the day
In this ${selectedGenre} way

Chorus:
This is my story, this is my song
About ${inputText}, where I belong
Every beat, every rhyme
Captures this moment in time

Bridge:
When the music fades away
These words will always stay

Outro:
This is my song about ${inputText}...`
      
      setGeneratedLyrics(fallbackLyrics)
      setEditingLyrics(fallbackLyrics)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveLyrics = () => {
    setGeneratedLyrics(editingLyrics)
    setIsEditingLyrics(false)
  }

  const handleGenreChange = (newGenre: string) => {
    setSelectedGenre(newGenre)
    // Regenerate lyrics with new genre if we have input text
    if (inputText && !isEditingLyrics) {
      setIsGenerating(true)
      // Small delay to show loading state
      setTimeout(() => {
        generateLyrics()
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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
          <h1 className="text-2xl font-bold text-white">Generated Lyrics</h1>
          <div className="w-12" />
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          {['input', 'lyrics', 'generation', 'preview'].map((step, idx) => (
            <div
              key={step}
              className={`flex-1 h-1 rounded-full ${
                idx <= 1 ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Input confirmation */}
        <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
          <p className="text-sm text-slate-400 mb-2">Your input:</p>
          <p className="text-white italic">&quot;{inputText}&quot;</p>
        </Card>

        {/* Lyrics Display */}
        <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Lyrics
              {isGenerating && (
                <Loader2 className="w-4 h-4 ml-2 animate-spin inline" />
              )}
            </h2>
            <div className="flex gap-2">
              {!isGenerating && generatedLyrics && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateLyrics}
                  className="text-slate-300 border-slate-600 hover:bg-slate-700"
                >
                  Regenerate
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={isGenerating || !generatedLyrics}
                onClick={() => {
                  if (isEditingLyrics) {
                    handleSaveLyrics()
                  } else {
                    setEditingLyrics(generatedLyrics)
                    setIsEditingLyrics(true)
                  }
                }}
                className="text-slate-300 border-slate-600 hover:bg-slate-700"
              >
                {isEditingLyrics ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">⚠️ {error}</p>
            </div>
          )}

          {isGenerating ? (
            <div className="bg-slate-900/50 rounded-lg p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-slate-400">Generating lyrics with AI...</p>
              <p className="text-slate-500 text-sm mt-2">
                Using: {inputText} ({selectedGenre})
              </p>
            </div>
          ) : isEditingLyrics ? (
            <textarea
              value={editingLyrics}
              onChange={(e) => setEditingLyrics(e.target.value)}
              className="w-full h-64 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm leading-relaxed"
              placeholder="Enter your lyrics here..."
            />
          ) : (
            <div className="bg-slate-900/50 rounded-lg p-4 text-white whitespace-pre-wrap text-sm leading-relaxed font-mono">
              {generatedLyrics || 'No lyrics generated yet...'}
            </div>
          )}
        </Card>

        {/* Genre Selection */}
        <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Choose Genre
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreChange(genre)}
                disabled={isGenerating}
                className={`py-2 px-4 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedGenre === genre
                    ? 'bg-blue-600 text-white border border-blue-500'
                    : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 text-slate-300 border-slate-600"
          >
            Previous
          </Button>
          <Button
            onClick={() => onSubmit(generatedLyrics, selectedGenre)}
            disabled={isGenerating || !generatedLyrics.trim()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Continue to Generation'}
          </Button>
        </div>
      </div>
    </div>
  )
}
