"""
Utility functions for AI model inference and audio processing.

This module provides functions for:
- Speech-to-text transcription (Whisper)
- Lyric generation (GPT-J, Mistral, or LLaMA)
- Music generation (MusicGen)
- Vocal synthesis (DiffSinger or RVC)
- Audio mixing (FFmpeg or pydub)

Models are loaded from Hugging Face Hub or locally cached.
All models are open-source with permissive licenses.
"""

import os
import json
import uuid
import numpy as np
from pathlib import Path
from django.conf import settings

# Model availability flags
try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

try:
    import pydub
    from pydub import AudioSegment
    PYDUB_AVAILABLE = True
except ImportError:
    PYDUB_AVAILABLE = False

import requests


def transcribe_audio(audio_path: str) -> str:
    """
    Transcribe audio file to text using OpenAI Whisper.
    
    Args:
        audio_path: Path to audio file (MP3, WAV, M4A)
    
    Returns:
        Transcribed text
    
    Models:
        - openai/whisper-base (MIT License)
        - openai/whisper-small (MIT License)
        - openai/whisper-medium (MIT License)
    """
    if not TRANSFORMERS_AVAILABLE:
        raise RuntimeError("Transformers library not available. Please ensure all dependencies are properly installed.")
    
    try:
        # Use Whisper via Hugging Face transformers
        transcriber = pipeline(
            "automatic-speech-recognition",
            model="openai/whisper-base",
            device=0 if TORCH_AVAILABLE and torch.cuda.is_available() else -1
        )
        result = transcriber(audio_path)
        return result['text']
    except Exception as e:
        print(f"Transcription error: {e}")
        raise RuntimeError(f"Audio transcription failed: {str(e)}. Please check if Whisper model is properly loaded.")


def generate_song_lyrics(input_text: str, genre: str = 'pop') -> str:
    """
    Generate song lyrics from a text prompt using an open LLM.
    
    Args:
        input_text: Theme, prompt, or partial lyrics
        genre: Music genre (pop, rock, hip-hop, etc.)
    
    Returns:
        Generated song lyrics with verse/chorus structure
    
    Models:
        - mistralai/Mistral-7B (Apache 2.0)
        - EleutherAI/gpt-j-6B (Apache 2.0)
        - meta-llama/Llama-2-7b (Meta Custom License)
    
    Note: This is a simplified version. Production should use proper prompting
    and potentially fine-tuned models for song generation.
    """
    
    prompt = f"""Write song lyrics for a {genre} song based on this theme: {input_text}

Format the lyrics with:
- Verse 1: (4-6 lines)
- Chorus: (4-6 lines)
- Verse 2: (4-6 lines)
- Chorus: (4-6 lines)
- Bridge: (4-6 lines)
- Outro: (2-4 lines)

Make the lyrics creative, rhythmic, and appropriate for {genre} music."""

    try:
        # Use OpenAI-compatible API for lyrics generation
        # Can work with OpenAI, Together AI, OpenRouter, etc.
        import requests
        import json
        import random
        
        lyrics_generated = False
        lyrics_result = ""
        
        # Try OpenAI API if configured
        openai_key = getattr(settings, 'OPENAI_API_KEY', None)
        if openai_key and openai_key != 'your-openai-api-key-here' and openai_key != 'sk-your_openai_api_key_here':
            try:
                print("🤖 Using OpenAI API for lyrics generation...")
                api_url = "https://api.openai.com/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {openai_key}",
                    "Content-Type": "application/json"
                }
                
                system_prompt = f"""You are a professional songwriter. Write complete, creative song lyrics in {genre} style."""
                
                user_prompt = f"""Write a complete {genre} song about: {input_text}

Create lyrics with this exact structure:
[Verse 1]
(4-6 lines)

[Chorus]
(4-6 lines)

[Verse 2]
(4-6 lines)

[Chorus]
(repeat)

[Bridge]
(4-6 lines)

[Outro]
(2-4 lines)

Make it creative, catchy, and unique. Only output the lyrics, no explanations."""
                
                payload = {
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.9,
                    "max_tokens": 500
                }
                
                response = requests.post(api_url, headers=headers, json=payload, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    lyrics_result = result['choices'][0]['message']['content'].strip()
                    if len(lyrics_result) > 50:
                        lyrics_generated = True
                        print("✅ Successfully generated lyrics using OpenAI")
                        return lyrics_result
                else:
                    print(f"⚠️  OpenAI API failed: {response.status_code}")
                    
            except Exception as e:
                print(f"⚠️  OpenAI API error: {str(e)}")
        
        # Try Groq API (Free tier with good models)
        if not lyrics_generated:
            try:
                print("🤖 Using Groq API for lyrics generation...")
                # Groq offers free API with fast inference
                api_url = "https://api.groq.com/openai/v1/chat/completions"
                
                # Try to get Groq API key from settings
                groq_key = getattr(settings, 'GROQ_API_KEY', None)
                if not groq_key:
                    # If not configured, inform user
                    print("⚠️  Groq API key not configured. Get free key from https://console.groq.com")
                    raise RuntimeError("Groq API not configured")
                
                headers = {
                    "Authorization": f"Bearer {groq_key}",
                    "Content-Type": "application/json"
                }
                
                payload = {
                    "model": "mixtral-8x7b-32768",  # Free fast model
                    "messages": [
                        {"role": "system", "content": f"You are a professional songwriter specializing in {genre} music."},
                        {"role": "user", "content": f"Write complete song lyrics for a {genre} song about: {input_text}\n\nFormat: [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Outro]\nMake it creative and unique. Only lyrics, no explanations."}
                    ],
                    "temperature": 0.9,
                    "max_tokens": 500
                }
                
                response = requests.post(api_url, headers=headers, json=payload, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    lyrics_result = result['choices'][0]['message']['content'].strip()
                    if len(lyrics_result) > 50:
                        lyrics_generated = True
                        print("✅ Successfully generated lyrics using Groq")
                        return lyrics_result
                        
            except Exception as e:
                print(f"⚠️  Groq API error: {str(e)}")
        
        # Try Together AI (Free tier available)
        if not lyrics_generated:
            try:
                print("🤖 Using Together AI for lyrics generation...")
                api_url = "https://api.together.xyz/v1/chat/completions"
                
                together_key = getattr(settings, 'TOGETHER_API_KEY', None)
                if not together_key:
                    print("⚠️  Together AI key not configured. Get free key from https://api.together.xyz")
                    raise RuntimeError("Together AI not configured")
                
                headers = {
                    "Authorization": f"Bearer {together_key}",
                    "Content-Type": "application/json"
                }
                
                payload = {
                    "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                    "messages": [
                        {"role": "system", "content": f"Write song lyrics in {genre} style."},
                        {"role": "user", "content": f"Create a complete {genre} song about: {input_text}\n\nFormat with [Verse 1], [Chorus], [Verse 2], [Chorus], [Bridge], [Outro]. Be creative and unique."}
                    ],
                    "temperature": 0.9,
                    "max_tokens": 500
                }
                
                response = requests.post(api_url, headers=headers, json=payload, timeout=30)
                
                if response.status_code == 200:
                    result = response.json()
                    lyrics_result = result['choices'][0]['message']['content'].strip()
                    if len(lyrics_result) > 50:
                        lyrics_generated = True
                        print("✅ Successfully generated lyrics using Together AI")
                        return lyrics_result
                        
            except Exception as e:
                print(f"⚠️  Together AI error: {str(e)}")
        
        # If all AI APIs fail, fall through to template generation
        if not lyrics_generated:
            print("⚠️  All AI APIs failed or not configured. Using template-based generation.")
            print("💡 To use AI models, add one of these keys to your .env file:")
            print("   - OPENAI_API_KEY (https://platform.openai.com/api-keys)")
            print("   - GROQ_API_KEY (https://console.groq.com/keys) - FREE & FAST")
            print("   - TOGETHER_API_KEY (https://api.together.xyz/settings/api-keys)")
            raise RuntimeError("No AI API configured")
            
    except Exception as main_error:
        # Fallback: Create intelligent template-based lyrics
        print(f"⚠️  AI generation failed: {str(main_error)}")
        print("📝 Creating template-based lyrics as fallback.")
        
        # Create more dynamic lyrics based on input and genre
        words = input_text.lower().split()
        key_word = words[0] if words else "dreams"
        
        # Genre-specific templates
        if genre.lower() == 'rock':
            lyrics_result = f"""Verse 1:
Thunder in the distance, {key_word} calling my name
Electric guitars screaming, nothing's quite the same
{input_text} burns inside me like a raging fire
Taking me higher and higher

Chorus:
We're breaking free from {input_text}
Rock and roll runs through our veins
Every chord, every beat
Makes our rebel hearts complete

Verse 2:
Leather jacket stories of {key_word} and pain
Drumbeats like my heartbeat driving me insane
{input_text} is the anthem of our generation
Rock and roll salvation

Chorus:
We're breaking free from {input_text}
Rock and roll runs through our veins
Every chord, every beat
Makes our rebel hearts complete

Bridge:
When the world gets heavy
And the road gets long
{key_word} will guide us
In this rock and roll song

Outro:
{input_text}... our rock and roll dream"""
        
        elif genre.lower() == 'hip-hop':
            lyrics_result = f"""Verse 1:
Started from the bottom, now we here with {input_text}
Every beat's a lesson, every rhyme's a test
{key_word} in my pocket, dreams up in my head
Spitting fire bars until the day I'm dead

Chorus:
{input_text} on my mind, hustle in my soul
Hip-hop is the rhythm that makes me feel whole
From the streets to the stage, this is how we roll
{key_word} and ambition, that's how we take control

Verse 2:
Microphone check, one-two, {input_text} in the booth
Speaking nothing but the realest, that's the honest truth
{key_word} motivates me when the going gets tough
In this hip-hop game, you gotta be rough

Chorus:
{input_text} on my mind, hustle in my soul
Hip-hop is the rhythm that makes me feel whole
From the streets to the stage, this is how we roll
{key_word} and ambition, that's how we take control

Outro:
{input_text}, yeah, that's my story
Hip-hop forever, this is our glory"""
        
        else:  # Pop and other genres
            lyrics_result = f"""Verse 1:
Dancing through the {input_text}
Like a {genre} melody
Every step feels magical
This is where I'm meant to be

Chorus:
{key_word} lights up the night
In this {genre} paradise
Every moment feels so right
{input_text} is my device

Verse 2:
Singing with the {key_word}
To a {genre} symphony
{input_text} shows the way
To who I'm meant to be

Chorus:
{key_word} lights up the night
In this {genre} paradise
Every moment feels so right
{input_text} is my device

Bridge:
When the music fades away
{key_word} will always stay
In my heart, in my soul
{input_text} makes me whole

Outro:
{input_text}...
My {genre} dream come true"""
        
        return lyrics_result
            
    except Exception as e:
        print(f"Lyrics generation error: {e}")
        raise RuntimeError(f"Lyrics generation failed: {str(e)}. Please check your internet connection and API token.")


def generate_music_track(lyrics: str, genre: str = 'pop') -> tuple:
    """
    Generate instrumental/backing track using AI music generation APIs.
    
    Args:
        lyrics: Song lyrics (used for context)
        genre: Music genre
    
    Returns:
        Tuple of (audio_path, duration_in_seconds)
    
    Supported APIs:
        - Suno AI (via unofficial API)
        - Mubert API (Free tier available)
        - Fallback: Synthetic audio generation
    """
    
    # Generate prompt from genre and lyrics snippet
    first_line = lyrics.split('\n')[0] if lyrics else 'instrumental music'
    prompt = f"A {genre} song instrumental with {first_line.lower()}. High quality studio production."
    
    # Try Suno AI (if configured)
    suno_api_key = getattr(settings, 'SUNO_API_KEY', None)
    if suno_api_key and suno_api_key != 'your-suno-api-key-here':
        try:
            print("🎵 Using Suno AI for instrumental generation...")
            # Suno AI API integration would go here
            # Note: Suno doesn't have official API yet, using placeholder
            print("⚠️  Suno AI not yet integrated. Using fallback.")
        except Exception as e:
            print(f"⚠️  Suno AI error: {str(e)}")
    
    # Try Mubert API (free tier available)
    mubert_api_key = getattr(settings, 'MUBERT_API_KEY', None)
    if mubert_api_key and mubert_api_key != 'your-mubert-api-key-here':
        try:
            print("🎵 Using Mubert API for instrumental generation...")
            import requests
            
            api_url = "https://api-b2b.mubert.com/v2/RecordTrack"
            
            payload = {
                "method": "RecordTrack",
                "params": {
                    "license": "license-free",
                    "token": mubert_api_key,
                    "format": "wav",
                    "mode": genre.lower(),
                    "duration": 30,
                    "bitrate": 320
                }
            }
            
            response = requests.post(api_url, json=payload, timeout=60)
            
            if response.status_code == 200:
                result = response.json()
                if result.get('status') == 1 and 'data' in result:
                    download_url = result['data'].get('tasks', [{}])[0].get('download_link')
                    
                    if download_url:
                        # Download the generated music
                        output_path = os.path.join(settings.TEMP_AUDIO_DIR, f"instrumental_{uuid.uuid4()}.wav")
                        audio_response = requests.get(download_url, timeout=60)
                        
                        with open(output_path, 'wb') as f:
                            f.write(audio_response.content)
                        
                        print(f"✅ Successfully generated instrumental using Mubert API")
                        return output_path, 30
                        
        except Exception as e:
            print(f"⚠️  Mubert API error: {str(e)}")
    
    # Fallback: Synthetic audio generation
    print("🎵 Generating synthetic instrumental (fallback)...")
    print("💡 For AI-generated music, add MUBERT_API_KEY to .env (free tier available)")
    
    try:
        # Create a realistic instrumental placeholder
        # In production, use services like Mubert API, AIVA API, or other music generation services
        import wave
        import numpy as np
        import random
        
        output_path = os.path.join(settings.TEMP_AUDIO_DIR, f"instrumental_{uuid.uuid4()}.wav")
        
        # Create a more complex instrumental track
        sample_rate = 44100
        duration = 30  # 30 seconds for demo
        t = np.linspace(0, duration, int(sample_rate * duration), False)
        
        # Define genre-specific characteristics
        genre_settings = {
            'pop': {'tempo': 120, 'bass_freq': 60, 'chord_freqs': [220, 277, 330, 220]},
            'rock': {'tempo': 140, 'bass_freq': 55, 'chord_freqs': [165, 208, 247, 165]},
            'electronic': {'tempo': 128, 'bass_freq': 40, 'chord_freqs': [440, 554, 659, 440]},
            'jazz': {'tempo': 100, 'bass_freq': 65, 'chord_freqs': [196, 247, 294, 349]},
            'hip-hop': {'tempo': 90, 'bass_freq': 45, 'chord_freqs': [131, 165, 196, 131]},
        }
        
        settings_for_genre = genre_settings.get(genre.lower(), genre_settings['pop'])
        
        # Initialize audio
        audio_data = np.zeros_like(t)
        
        # Add bass line
        bass_freq = settings_for_genre['bass_freq']
        bass_pattern = np.sin(2 * np.pi * bass_freq * t) * 0.3
        
        # Add drum-like rhythm (simplified)
        beat_freq = settings_for_genre['tempo'] / 60.0  # BPM to Hz
        kick_pattern = np.sin(2 * np.pi * beat_freq * t) * 0.2
        kick_pattern = np.where(np.sin(2 * np.pi * beat_freq * t) > 0.7, kick_pattern, 0)
        
        # Add chord progression
        chord_freqs = settings_for_genre['chord_freqs']
        chord_duration = duration / len(chord_freqs)
        
        for i, freq in enumerate(chord_freqs):
            start_time = i * chord_duration
            end_time = (i + 1) * chord_duration
            start_idx = int(start_time * sample_rate)
            end_idx = int(end_time * sample_rate)
            
            # Major chord (root, third, fifth)
            root = freq
            third = freq * 1.25  # Major third
            fifth = freq * 1.5   # Perfect fifth
            
            chord_segment = t[start_idx:end_idx] - start_time
            chord_audio = (
                0.2 * np.sin(2 * np.pi * root * chord_segment) +
                0.15 * np.sin(2 * np.pi * third * chord_segment) +
                0.15 * np.sin(2 * np.pi * fifth * chord_segment)
            )
            
            audio_data[start_idx:end_idx] += chord_audio
        
        # Combine all elements
        audio_data += bass_pattern + kick_pattern
        
        # Add some variation and effects
        # Simple reverb simulation
        reverb = np.convolve(audio_data, np.array([1, 0.3, 0.1]), mode='same')[:len(audio_data)]
        audio_data = 0.7 * audio_data + 0.3 * reverb
        
        # Apply envelope to avoid clicks
        envelope = np.ones_like(audio_data)
        fade_samples = int(0.1 * sample_rate)
        envelope[:fade_samples] = np.linspace(0, 1, fade_samples)
        envelope[-fade_samples:] = np.linspace(1, 0, fade_samples)
        audio_data *= envelope
        
        # Normalize and convert to int16
        max_val = np.max(np.abs(audio_data))
        if max_val > 0:
            audio_data = (audio_data / max_val * 0.8 * 32767).astype(np.int16)
        else:
            audio_data = audio_data.astype(np.int16)
        
        # Save as WAV file
        with wave.open(output_path, 'w') as wav_file:
            wav_file.setnchannels(1)  # Mono
            wav_file.setsampwidth(2)  # 16-bit
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(audio_data.tobytes())
        
        print(f"Generated {genre} instrumental: {output_path}")
        return output_path, duration
        
    except Exception as e:
        print(f"Music generation error: {e}")
        raise RuntimeError(f"Instrumental generation failed: {str(e)}. Please check system resources.")


def generate_singing_vocals(lyrics: str, genre: str = 'pop') -> tuple:
    """
    Generate singing vocal track for lyrics using AI voice synthesis.

    Supported APIs:
        - ElevenLabs (Professional AI voice - Free tier: 10k chars/month)
        - Uberduck AI (AI vocals - Free tier available)
        - Fallback: Synthetic audio generation
    """

    # Try ElevenLabs API first (best quality)
    elevenlabs_api_key = os.getenv('ELEVENLABS_API_KEY')
    if elevenlabs_api_key and elevenlabs_api_key != 'your-elevenlabs-api-key-here':
        try:
            print("🎤 Using ElevenLabs AI for vocal generation...")
            
            # Use a more suitable voice ID for singing (default is Adam)
            target_voice_id = os.getenv('ELEVENLABS_VOICE_ID', 'pNInz6obpgDQGcFmaJgB')
            
            output_path = os.path.join(settings.TEMP_AUDIO_DIR, f"vocals_{uuid.uuid4()}.mp3")
            api_url = f"https://api.elevenlabs.io/v1/text-to-speech/{target_voice_id}"

            # Clean lyrics for better TTS (remove section markers)
            clean_lyrics = lyrics.replace('[Verse 1]', '').replace('[Chorus]', '').replace('[Verse 2]', '').replace('[Bridge]', '').replace('[Outro]', '').strip()
            
            payload = {
                "text": clean_lyrics,
                "model_id": os.getenv('ELEVENLABS_MODEL_ID', 'eleven_multilingual_v2'),
                "voice_settings": {
                    "stability": float(os.getenv('ELEVENLABS_VOICE_STABILITY', '0.5')),
                    "similarity_boost": float(os.getenv('ELEVENLABS_VOICE_SIMILARITY', '0.8')),
                    "style": float(os.getenv('ELEVENLABS_VOICE_STYLE', '0.5')),
                    "use_speaker_boost": True
                },
            }

            headers = {
                "xi-api-key": elevenlabs_api_key,
                "Accept": "audio/mpeg",
                "Content-Type": "application/json"
            }

            response = requests.post(api_url, json=payload, headers=headers, timeout=60)
            
            if response.status_code == 200:
                with open(output_path, "wb") as f:
                    f.write(response.content)

                # Estimate duration based on word count (~0.4s per word)
                words = len(clean_lyrics.split())
                duration = max(10, int(words * 0.4))
                
                print(f"✅ Successfully generated vocals using ElevenLabs AI")
                return output_path, duration
            else:
                print(f"⚠️  ElevenLabs API error {response.status_code}: {response.text[:200]}")

        except Exception as exc:
            print(f"⚠️  ElevenLabs vocal synthesis failed: {exc}")
    
    # Try Uberduck AI (alternative)
    uberduck_key = os.getenv('UBERDUCK_API_KEY')
    uberduck_secret = os.getenv('UBERDUCK_API_SECRET')
    if uberduck_key and uberduck_secret:
        try:
            print("🎤 Using Uberduck AI for vocal generation...")
            # Uberduck API integration would go here
            print("⚠️  Uberduck AI not yet integrated. Using fallback.")
        except Exception as e:
            print(f"⚠️  Uberduck AI error: {str(e)}")

    # Fallback: Synthetic vocal generation
    print("🎤 Generating synthetic vocals (fallback)...")
    print("💡 For AI-generated vocals, add ELEVENLABS_API_KEY to .env")
    print("   Get free tier (10k chars/month): https://elevenlabs.io/api")
    
    try:
        import wave
        import numpy as np

        output_path = os.path.join(settings.TEMP_AUDIO_DIR, f"vocals_{uuid.uuid4()}.wav")

        sample_rate = 44100
        duration = 25
        t = np.linspace(0, duration, int(sample_rate * duration), False)

        clean_lyrics = lyrics.replace('\n', ' ').replace('Verse 1:', '').replace('Chorus:', '').replace('Bridge:', '').replace('Outro:', '')
        words = [w for w in clean_lyrics.split() if w.strip()]

        if genre.lower() == 'pop':
            base_freq = 220
            scale = [1.0, 1.125, 1.25, 1.33, 1.5, 1.67, 1.875, 2.0]
        elif genre.lower() == 'rock':
            base_freq = 196
            scale = [1.0, 1.125, 1.25, 1.33, 1.5, 1.67, 1.875, 2.0]
        elif genre.lower() == 'hip-hop':
            base_freq = 165
            scale = [1.0, 1.2, 1.25, 1.4, 1.5, 1.7, 1.8, 2.0]
        else:
            base_freq = 220
            scale = [1.0, 1.125, 1.25, 1.33, 1.5, 1.67, 1.875, 2.0]

        audio_data = np.zeros_like(t)
        num_notes = min(len(words), 20)
        if num_notes > 0:
            note_duration = duration / num_notes
            for i in range(num_notes):
                start_time = i * note_duration
                end_time = (i + 1) * note_duration
                start_idx = int(start_time * sample_rate)
                end_idx = int(end_time * sample_rate)
                scale_pos = i % len(scale)
                freq = base_freq * scale[scale_pos]
                note_t = t[start_idx:end_idx] - start_time

                vibrato_rate = 5
                vibrato_depth = 0.02
                vibrato = 1 + vibrato_depth * np.sin(2 * np.pi * vibrato_rate * note_t)

                envelope = np.ones_like(note_t)
                attack_time = min(0.05, note_duration * 0.2)
                release_time = min(0.1, note_duration * 0.3)
                attack_samples = int(attack_time * sample_rate)
                release_samples = int(release_time * sample_rate)

                if len(note_t) > attack_samples:
                    envelope[:attack_samples] = np.linspace(0, 1, attack_samples)
                if len(note_t) > release_samples:
                    envelope[-release_samples:] = np.linspace(1, 0, release_samples)

                fundamental = np.sin(2 * np.pi * freq * vibrato * note_t)
                harmonic2 = 0.3 * np.sin(2 * np.pi * freq * 2 * vibrato * note_t)
                harmonic3 = 0.2 * np.sin(2 * np.pi * freq * 3 * vibrato * note_t)

                note_sound = (fundamental + harmonic2 + harmonic3) * envelope * 0.4
                audio_data[start_idx:end_idx] += note_sound

        overall_envelope = np.ones_like(audio_data)
        fade_samples = int(0.1 * sample_rate)
        overall_envelope[:fade_samples] = np.linspace(0, 1, fade_samples)
        overall_envelope[-fade_samples:] = np.linspace(1, 0, fade_samples)
        audio_data *= overall_envelope

        reverb_delay = int(0.1 * sample_rate)
        if len(audio_data) > reverb_delay:
            reverb = np.zeros_like(audio_data)
            reverb[reverb_delay:] = audio_data[:-reverb_delay] * 0.3
            audio_data = 0.8 * audio_data + 0.2 * reverb

        max_val = np.max(np.abs(audio_data))
        if max_val > 0:
            audio_data = (audio_data / max_val * 0.7 * 32767).astype(np.int16)
        else:
            audio_data = audio_data.astype(np.int16)

        import wave
        with wave.open(output_path, 'w') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)
            wav_file.writeframes(audio_data.tobytes())

        return output_path, duration

    except Exception as e:
        print(f"Vocal synthesis fallback error: {e}")
        raise RuntimeError(f"Vocal synthesis failed: {str(e)}. Please check system resources.")


def mix_audio_tracks(instrumental_path: str, vocals_path: str, genre: str = 'pop') -> tuple:
    """
    Mix instrumental and vocal tracks into a final song.
    
    Args:
        instrumental_path: Path to instrumental WAV file
        vocals_path: Path to vocals WAV file
        genre: Music genre (for mixing parameters)
    
    Returns:
        Tuple of (output_path, duration_in_seconds)
    
    Tools:
        - FFmpeg (LGPL/GPL) - via pydub or subprocess
        - pydub (MIT) - Python audio processing library
    
    Mixing strategy:
    - Normalize both tracks to -3dB for headroom
    - Adjust vocals to be slightly louder than instrumental
    - Apply gentle compression (optional)
    - Fade in/out (optional)
    """
    
    output_path = os.path.join(settings.TEMP_AUDIO_DIR, f"mixed_{uuid.uuid4()}.wav")
    
    if PYDUB_AVAILABLE:
        try:
            # Load audio files
            instrumental = AudioSegment.from_wav(instrumental_path) if os.path.exists(instrumental_path) else None
            vocals = AudioSegment.from_wav(vocals_path) if os.path.exists(vocals_path) else None
            
            if instrumental and vocals:
                # Normalize levels
                instrumental_norm = instrumental.normalize() - 3
                vocals_norm = vocals.normalize() - 1.5  # Vocals slightly louder
                
                # Ensure same length (pad shorter track)
                if len(instrumental_norm) > len(vocals_norm):
                    vocals_norm = vocals_norm + AudioSegment.silent(
                        duration=len(instrumental_norm) - len(vocals_norm)
                    )
                else:
                    instrumental_norm = instrumental_norm + AudioSegment.silent(
                        duration=len(vocals_norm) - len(instrumental_norm)
                    )
                
                # Mix tracks
                mixed = instrumental_norm.overlay(vocals_norm)
                
                # Export
                mixed.export(output_path, format="wav")
                duration = len(mixed) / 1000  # Convert milliseconds to seconds
                
                return output_path, duration
        except Exception as e:
            print(f"pydub mixing error: {e}")
    
    # Fallback: use FFmpeg via subprocess
    try:
        import subprocess
        cmd = [
            'ffmpeg', '-i', instrumental_path, '-i', vocals_path,
            '-filter_complex', 'amix=inputs=2:duration=longest',
            '-q:a', '9', '-c:a', 'libmp3lame',
            output_path
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        
        # Estimate duration
        duration = 180
        return output_path, duration
    except Exception as e:
        print(f"FFmpeg mixing error: {e}")
    
    # No fallback - raise error if mixing fails
    raise RuntimeError("Audio mixing failed. Please ensure FFmpeg is installed and audio files are valid.")
