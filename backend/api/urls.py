from django.urls import path
from . import views

urlpatterns = [
    # Speech-to-Text
    path('transcribe/', views.transcribe, name='transcribe'),
    
    # Lyrics Generation
    path('generate-lyrics/', views.generate_lyrics, name='generate_lyrics'),
    
    # Music Generation
    path('generate-instrumental/', views.generate_instrumental, name='generate_instrumental'),
    path('generate-vocals/', views.generate_vocals, name='generate_vocals'),
    path('mix-audio/', views.mix_audio, name='mix_audio'),
    
    # Utilities
    path('health/', views.health_check, name='health_check'),
]
