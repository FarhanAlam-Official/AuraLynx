'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Upload, Mic, Square } from 'lucide-react'
import Visualizer from './visualizer'

interface InputPageProps {
  inputMode: 'text' | 'voice'
  onSubmit: (text: string) => void
  onBack: () => void
}

export default function InputPage({
  inputMode,
  onSubmit,
  onBack,
}: InputPageProps) {
  const [textInput, setTextInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [isTranscribing, setIsTranscribing] = useState(false)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        })
        setRecordedAudio(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setRecordedAudio(file)
    }
  }

  const handleTranscribe = async () => {
    if (!recordedAudio) return

    setIsTranscribing(true)
    // Mock transcription - in production, this would call Whisper API
    setTimeout(() => {
      setIsTranscribing(false)
      const mockTranscript =
        'Create a song about chasing dreams under moonlight with electronic vibes'
      onSubmit(mockTranscript)
    }, 2000)
  }

  const handleSubmitText = () => {
    if (textInput.trim()) {
      onSubmit(textInput.trim())
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
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {inputMode === 'text' ? 'Enter Lyrics or Theme' : 'Record Your Voice'}
          </h1>
          <div className="w-12" />
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          {['input', 'lyrics', 'generation', 'preview'].map((step, idx) => (
            <div
              key={step}
              className={`flex-1 h-1 rounded-full ${
                idx === 0
                  ? 'bg-blue-500'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        <Card className="bg-slate-800/50 border-slate-700 p-8">
          {inputMode === 'text' ? (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">
                Write a theme, lyrics, or description
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="e.g., A upbeat pop song about summer adventures with friends..."
                className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <div className="text-xs text-slate-400">
                {textInput.length} characters
              </div>
              <Button
                onClick={handleSubmitText}
                disabled={!textInput.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {recordedAudio ? (
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-400 mb-2">Audio recorded</p>
                    <audio
                      src={URL.createObjectURL(recordedAudio)}
                      controls
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setRecordedAudio(null)}
                      className="flex-1"
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={handleTranscribe}
                      disabled={isTranscribing}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isTranscribing ? 'Transcribing...' : 'Transcribe & Continue'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={startRecording}
                      disabled={isRecording}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      {isRecording ? 'Recording...' : 'Start Recording'}
                    </Button>
                    {isRecording && (
                      <Button
                        onClick={stopRecording}
                        variant="destructive"
                        className="flex-1"
                      >
                        <Square className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                    )}
                  </div>

                  {isRecording && <Visualizer />}

                  <div className="relative flex items-center gap-4">
                    <div className="flex-1 h-px bg-slate-700" />
                    <span className="text-xs text-slate-500">OR</span>
                    <div className="flex-1 h-px bg-slate-700" />
                  </div>

                  <label className="block">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-slate-500 transition">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                      <p className="text-sm text-slate-300">
                        Click to upload an audio file
                      </p>
                      <p className="text-xs text-slate-500">
                        MP3, WAV, M4A supported
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
