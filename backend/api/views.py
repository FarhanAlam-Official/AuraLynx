from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.core.files.storage import default_storage
from django.contrib.auth import get_user_model
import os
import json
import uuid

from .utils import (
    transcribe_audio,
    generate_song_lyrics,
    generate_music_track,
    generate_singing_vocals,
    mix_audio_tracks,
)
from .models import Song
from .serializers import RegisterSerializer, UserSerializer, SongSerializer

@api_view(['GET'])
def health_check(request):
    """Health check endpoint for deployment monitoring."""
    return Response({
        'status': 'healthy',
        'message': 'AuraLynx backend is running',
        'version': '1.0.0'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def register(request):
    """
    Register a new user with username, email, and password.
    """
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """
    Return the currently authenticated user.
    """
    return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


@api_view(['POST'])
def transcribe(request):
    """
    Transcribe audio file to text using Whisper.
    
    Expected POST data:
    - audio_file: Audio file (MP3, WAV, M4A)
    
    Returns:
    - transcribed_text: String of transcribed text
    """
    try:
        if 'audio_file' not in request.FILES:
            return Response(
                {'error': 'No audio file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )

        audio_file = request.FILES['audio_file']
        
        # Save temporary file
        temp_path = os.path.join(settings.TEMP_AUDIO_DIR, f"{uuid.uuid4()}_{audio_file.name}")
        with open(temp_path, 'wb+') as destination:
            for chunk in audio_file.chunks():
                destination.write(chunk)

        # Transcribe
        transcribed_text = transcribe_audio(temp_path)
        
        # Cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)

        return Response({
            'success': True,
            'transcribed_text': transcribed_text,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def generate_lyrics(request):
    """
    Generate song lyrics from a text prompt using LLM.
    
    Expected POST data:
    - input_text: String (theme, description, or partial lyrics)
    - genre: String (optional, e.g., 'pop', 'rock', 'hip-hop')
    
    Returns:
    - lyrics: Full song lyrics (verse/chorus structure)
    """
    try:
        input_text = request.data.get('input_text', '')
        genre = request.data.get('genre', 'pop')

        if not input_text:
            return Response(
                {'error': 'input_text is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate lyrics
        lyrics = generate_song_lyrics(input_text, genre)

        return Response({
            'success': True,
            'lyrics': lyrics,
            'genre': genre,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def generate_instrumental(request):
    """
    Generate instrumental/backing track using MusicGen.
    
    Expected POST data:
    - lyrics: String (song lyrics for context)
    - genre: String (e.g., 'pop', 'rock', 'hip-hop')
    
    Returns:
    - url: Path to generated WAV file
    - duration: Duration of generated audio in seconds
    """
    try:
        lyrics = request.data.get('lyrics', '')
        genre = request.data.get('genre', 'pop')

        if not lyrics:
            return Response(
                {'error': 'lyrics is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate music
        audio_path, duration = generate_music_track(lyrics, genre)
        
        # Convert file path to full URL with backend server
        filename = os.path.basename(audio_path)
        audio_url = request.build_absolute_uri(f'{settings.TEMP_AUDIO_URL}{filename}')

        return Response({
            'success': True,
            'url': audio_url,
            'duration': duration,
            'format': 'wav',
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def generate_vocals(request):
    """
    Generate singing vocals for lyrics using DiffSinger or voice synthesis.
    
    Expected POST data:
    - lyrics: String (lyrics to sing)
    - genre: String (genre/style)
    
    Returns:
    - url: Path to generated vocal WAV file
    - duration: Duration of generated audio in seconds
    """
    try:
        lyrics = request.data.get('lyrics', '')
        genre = request.data.get('genre', 'pop')

        if not lyrics:
            return Response(
                {'error': 'lyrics is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate vocals
        audio_path, duration = generate_singing_vocals(lyrics, genre)
        
        # Convert file path to full URL with backend server
        filename = os.path.basename(audio_path)
        audio_url = request.build_absolute_uri(f'{settings.TEMP_AUDIO_URL}{filename}')

        return Response({
            'success': True,
            'url': audio_url,
            'duration': duration,
            'format': 'wav',
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def mix_audio(request):
    """
    Mix instrumental and vocal tracks into final song.
    
    Expected POST data:
    - instrumental_url: Path to instrumental WAV
    - vocals_url: Path to vocals WAV
    - genre: String (genre)
    
    Returns:
    - url: Path to final mixed WAV/MP3 file
    - duration: Duration in seconds
    """
    try:
        instrumental_url = request.data.get('instrumental_url')
        vocals_url = request.data.get('vocals_url')
        genre = request.data.get('genre', 'pop')

        if not instrumental_url or not vocals_url:
            return Response(
                {'error': 'instrumental_url and vocals_url are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Mix audio
        # Extract filenames from URLs (instrumental_url/vocals_url may be
        # absolute or relative) and convert to local paths
        instrumental_filename = instrumental_url.rstrip('/').split('/')[-1]
        vocals_filename = vocals_url.rstrip('/').split('/')[-1]
        instrumental_path = os.path.join(settings.TEMP_AUDIO_DIR, instrumental_filename)
        vocals_path = os.path.join(settings.TEMP_AUDIO_DIR, vocals_filename)
        
        output_path, duration = mix_audio_tracks(instrumental_path, vocals_path, genre)
        
        # Convert file path to full URL with backend server
        filename = os.path.basename(output_path)
        audio_url = request.build_absolute_uri(f'{settings.TEMP_AUDIO_URL}{filename}')

        return Response({
            'success': True,
            'url': audio_url,
            'duration': duration,
            'format': 'wav',
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def list_create_songs(request):
    """
    List or create songs for the authenticated user.

    GET: return the current user's songs.
    POST: create a new Song record after a successful generation.
    """
    if request.method == 'GET':
        songs = Song.objects.filter(user=request.user)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST
    serializer = SongSerializer(data=request.data)
    if serializer.is_valid():
        song = serializer.save(user=request.user)
        return Response(SongSerializer(song).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
