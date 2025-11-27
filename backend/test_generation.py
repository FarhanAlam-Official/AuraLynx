"""
Test script to diagnose song generation issues
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.utils import generate_song_lyrics, generate_music_track, generate_singing_vocals, mix_audio_tracks

def test_lyrics():
    print("\n" + "="*60)
    print("TEST 1: Lyrics Generation")
    print("="*60)
    try:
        lyrics = generate_song_lyrics("love and dreams", "pop")
        print("✅ SUCCESS: Lyrics generated")
        print(f"Length: {len(lyrics)} characters")
        print(f"Preview: {lyrics[:200]}...")
        return lyrics
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def test_instrumental(lyrics):
    print("\n" + "="*60)
    print("TEST 2: Instrumental Generation")
    print("="*60)
    if not lyrics:
        print("⚠️  SKIPPED: No lyrics available")
        return None, None
    
    try:
        audio_path, duration = generate_music_track(lyrics, "pop")
        print(f"✅ SUCCESS: Instrumental generated")
        print(f"Path: {audio_path}")
        print(f"Duration: {duration}s")
        print(f"File exists: {os.path.exists(audio_path)}")
        if os.path.exists(audio_path):
            print(f"File size: {os.path.getsize(audio_path)} bytes")
        return audio_path, duration
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return None, None

def test_vocals(lyrics):
    print("\n" + "="*60)
    print("TEST 3: Vocals Generation")
    print("="*60)
    if not lyrics:
        print("⚠️  SKIPPED: No lyrics available")
        return None, None
    
    try:
        audio_path, duration = generate_singing_vocals(lyrics, "pop")
        print(f"✅ SUCCESS: Vocals generated")
        print(f"Path: {audio_path}")
        print(f"Duration: {duration}s")
        print(f"File exists: {os.path.exists(audio_path)}")
        if os.path.exists(audio_path):
            print(f"File size: {os.path.getsize(audio_path)} bytes")
        return audio_path, duration
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return None, None

def test_mixing(instrumental_path, vocals_path):
    print("\n" + "="*60)
    print("TEST 4: Audio Mixing")
    print("="*60)
    if not instrumental_path or not vocals_path:
        print("⚠️  SKIPPED: Missing audio files")
        return None, None
    
    try:
        output_path, duration = mix_audio_tracks(instrumental_path, vocals_path, "pop")
        print(f"✅ SUCCESS: Audio mixed")
        print(f"Path: {output_path}")
        print(f"Duration: {duration}s")
        print(f"File exists: {os.path.exists(output_path)}")
        if os.path.exists(output_path):
            print(f"File size: {os.path.getsize(output_path)} bytes")
        return output_path, duration
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        import traceback
        traceback.print_exc()
        return None, None

def check_dependencies():
    print("\n" + "="*60)
    print("CHECKING DEPENDENCIES")
    print("="*60)
    
    # Check FFmpeg
    import subprocess
    try:
        result = subprocess.run(['ffmpeg', '-version'], capture_output=True, timeout=5)
        if result.returncode == 0:
            version_line = result.stdout.decode().split('\n')[0]
            print(f"✅ FFmpeg: {version_line}")
        else:
            print("❌ FFmpeg: Not working properly")
    except FileNotFoundError:
        print("❌ FFmpeg: Not found in PATH")
    except Exception as e:
        print(f"❌ FFmpeg: Error checking - {e}")
    
    # Check pydub
    try:
        import pydub
        print(f"✅ pydub: Version {pydub.__version__ if hasattr(pydub, '__version__') else 'installed'}")
    except ImportError:
        print("❌ pydub: Not installed")
    
    # Check torch
    try:
        import torch
        print(f"✅ torch: Version {torch.__version__}")
        print(f"   CUDA available: {torch.cuda.is_available()}")
    except ImportError:
        print("❌ torch: Not installed")
    
    # Check transformers
    try:
        import transformers
        print(f"✅ transformers: Version {transformers.__version__}")
    except ImportError:
        print("❌ transformers: Not installed")
    
    # Check numpy
    try:
        import numpy
        print(f"✅ numpy: Version {numpy.__version__}")
    except ImportError:
        print("❌ numpy: Not installed")
    
    # Check wave
    try:
        import wave
        print(f"✅ wave: Built-in module available")
    except ImportError:
        print("❌ wave: Not available")

if __name__ == "__main__":
    print("\n🎵 AuraLynx Song Generation Diagnostics 🎵")
    
    check_dependencies()
    
    # Run tests
    lyrics = test_lyrics()
    instrumental_path, _ = test_instrumental(lyrics)
    vocals_path, _ = test_vocals(lyrics)
    mixed_path, _ = test_mixing(instrumental_path, vocals_path)
    
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    print(f"Lyrics: {'✅ PASS' if lyrics else '❌ FAIL'}")
    print(f"Instrumental: {'✅ PASS' if instrumental_path and os.path.exists(instrumental_path) else '❌ FAIL'}")
    print(f"Vocals: {'✅ PASS' if vocals_path and os.path.exists(vocals_path) else '❌ FAIL'}")
    print(f"Mixing: {'✅ PASS' if mixed_path and os.path.exists(mixed_path) else '❌ FAIL'}")
    print("="*60)
