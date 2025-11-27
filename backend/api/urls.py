from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    # Speech-to-Text
    path("transcribe/", views.transcribe, name="transcribe"),

    # Lyrics Generation
    path("generate-lyrics/", views.generate_lyrics, name="generate_lyrics"),

    # Music Generation
    path("generate-instrumental/", views.generate_instrumental, name="generate_instrumental"),
    path("generate-vocals/", views.generate_vocals, name="generate_vocals"),
    path("mix-audio/", views.mix_audio, name="mix_audio"),

    # Auth
    path("auth/register/", views.register, name="register"),
    path("auth/me/", views.me, name="me"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Songs
    path("songs/", views.list_create_songs, name="songs"),

    # Utilities
    path("health/", views.health_check, name="health_check"),
]
