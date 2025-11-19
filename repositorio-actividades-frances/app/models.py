from django.db import models
from django.contrib.auth.models import User

class Actividad(models.Model):

    class Curso(models.TextChoices):
        INFANTIL = 'infantil', 'Infantil'
        PRIMARIA = 'primaria', 'Primaria'

    class Tag(models.TextChoices):
        VERBOS = 'verbos', 'Verbos'
        VOCABULARIO = 'vocabulario', 'Vocabulario'
        COMPRENSION = 'comprension', 'Comprensión'

    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='actividades')
    titulo = models.CharField(max_length=255)
    curso = models.CharField(max_length=20, choices=Curso.choices)
    tags = models.CharField(max_length=200)
    json = models.CharField(max_length=2000)
    imagen = models.ImageField(upload_to='actividades/', null=True, blank=True)

    def __str__(self):
        return self.titulo
