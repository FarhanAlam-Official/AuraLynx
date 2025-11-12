'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, Type, Music, Sparkles, Headphones, Download, Zap, Heart } from 'lucide-react'
import Image from 'next/image'

interface LandingPageProps {
  onSubmit: (mode: 'text' | 'voice') => void
}

export default function LandingPage({ onSubmit }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
      
      {/* Floating Music Notes Animation */}
      <div className="absolute top-20 left-10 text-blue-300 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2s'}}>
        <Music className="w-6 h-6" />
      </div>
      <div className="absolute top-40 right-20 text-purple-300 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '2.5s'}}>
        <Music className="w-4 h-4" />
      </div>
      <div className="absolute bottom-32 left-20 text-pink-300 animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}>
        <Music className="w-5 h-5" />
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="p-6 relative z-20">
          <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="relative">
              <Image 
                src="/logo.png" 
                alt="AuraLynx Logo" 
                width={48} 
                height={48}
                className="rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:rotate-12"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-300">
              AuraLynx
            </span>
            <div className="ml-2 px-2 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full text-xs font-bold text-emerald-700 animate-pulse">
              AI
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl text-center">
            {/* Main Header */}
            <div className="mb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 via-blue-100 to-pink-100 border-2 border-purple-200/50 rounded-full px-6 py-3 mb-8 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                <Sparkles className="w-5 h-5 text-purple-600 animate-spin" style={{animationDuration: '3s'}} />
                <span className="text-sm font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                  AI-Powered Music Creation
                </span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
                <div className="hover:scale-105 transition-transform duration-500 inline-block">
                  <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent animate-pulse">
                    Create
                  </span>
                </div>
                <br />
                <div className="hover:scale-105 transition-transform duration-500 inline-block" style={{animationDelay: '0.2s'}}>
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition-all duration-500">
                    Amazing Songs
                  </span>
                </div>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed hover:text-gray-700 transition-colors duration-300">
                Transform your ideas into complete songs with AI. From lyrics to vocals, 
                create professional music in minutes.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105">
                  <Zap className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-700">Open-source AI</span>
                </span>
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-pink-100 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105">
                  <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                  <span className="text-sm font-semibold text-red-600">100% Free Forever</span>
                </span>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-3xl mx-auto">
              <Card
                onClick={() => onSubmit('text')}
                className="relative bg-white border-2 border-blue-200 hover:border-blue-400 cursor-pointer transition-all duration-500 group p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-blue-300">
                    <Type className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                    Start with Text
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
                    Write lyrics, describe a theme, or share your inspiration. 
                    Our AI will craft the perfect song.
                  </p>
                  <div className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-bold group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300 shadow-md group-hover:shadow-lg animate-pulse">
                    Most Popular ✨
                  </div>
                </div>
                
                {/* Sparkle Animation */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="w-6 h-6 text-blue-400 animate-spin" style={{animationDuration: '2s'}} />
                </div>
              </Card>

              <Card
                onClick={() => onSubmit('voice')}
                className="relative bg-white border-2 border-purple-200 hover:border-purple-400 cursor-pointer transition-all duration-500 group p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-purple-300">
                    <Mic className="w-10 h-10 text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                    Record Voice
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
                    Hum a melody, speak your ideas, or upload audio. 
                    We'll transcribe and transform it into music.
                  </p>
                  <div className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-sm font-bold group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-300 shadow-md group-hover:shadow-lg animate-pulse">
                    Voice Magic 🎤
                  </div>
                </div>
                
                {/* Sound Wave Animation */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="flex gap-1">
                    <div className="w-1 h-6 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-1 h-4 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-8 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Process Steps */}
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-emerald-300 hover:shadow-2xl">
                  <span className="text-white font-black text-xl">1</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-emerald-600 transition-colors duration-300">Input Ideas</h4>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Share your creative vision</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-blue-300 hover:shadow-2xl">
                  <Music className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-blue-600 transition-colors duration-300">AI Magic</h4>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Generate lyrics & melody</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-purple-300 hover:shadow-2xl">
                  <Headphones className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-purple-600 transition-colors duration-300">Vocal Synthesis</h4>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Create singing vocals</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-red-300 hover:shadow-2xl">
                  <Download className="w-8 h-8 text-white animate-bounce" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2 text-lg group-hover:text-red-600 transition-colors duration-300">Your Song</h4>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Download & share</p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="bg-white border-2 border-gray-200 hover:border-gray-300 rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-300">Complete Music Production Suite</h3>
                <p className="text-gray-600 text-lg">Everything you need to create professional songs</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-blue-300">
                    <Type className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-3 text-lg group-hover:text-blue-600 transition-colors duration-300">Smart Lyrics</h4>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">AI generates creative, genre-specific lyrics from your ideas</p>
                </div>
                
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-purple-300">
                    <Music className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-3 text-lg group-hover:text-purple-600 transition-colors duration-300">Melody Creation</h4>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Generate backing tracks and instrumentals in any genre</p>
                </div>
                
                <div className="text-center group cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-emerald-300">
                    <Mic className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-3 text-lg group-hover:text-emerald-600 transition-colors duration-300">Vocal Synthesis</h4>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Transform lyrics into beautiful singing vocals</p>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105 cursor-pointer">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="font-semibold">Open Source AI</span>
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105 cursor-pointer">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="font-semibold">No Sign-up Required</span>
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105 cursor-pointer">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="font-semibold">Commercial Use OK</span>
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105 cursor-pointer">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                    <span className="font-semibold">Privacy First</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-slate-500 text-sm">
            Made with ❤️ using open-source AI models • 
            <span className="text-slate-400 ml-1">Whisper • GPT-2 • MusicGen • DiffSinger</span>
          </p>
        </footer>
      </div>
    </div>
  )
}
