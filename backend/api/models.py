from django.conf import settings
from django.db import models


class Song(models.Model):
    """
    Generated song with metadata and links to audio assets.

    A Song belongs to a user (optional in case of anonymous generation)
    and stores the lyrics, genre, and URLs returned by the generation API.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="songs",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=255)
    genre = models.CharField(max_length=50, default="pop")
    lyrics = models.TextField()

    instrumental_url = models.URLField(max_length=500, blank=True)
    vocals_url = models.URLField(max_length=500, blank=True)
    mix_url = models.URLField(max_length=500, blank=True)

    duration_seconds = models.PositiveIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


