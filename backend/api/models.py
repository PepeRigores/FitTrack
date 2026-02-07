from django.db import models
from django.contrib.auth.models import User

class Ejercicio(models.Model):
    CATEGORIA_CHOICES = [
        ('Pecho', 'Pecho'),
        ('Espalda', 'Espalda'),
        ('Piernas', 'Piernas'),
        ('Hombros', 'Hombros'),
        ('Brazos', 'Brazos'),
        ('Cardio', 'Cardio'),
        ('Core', 'Core'),
        ('Otro', 'Otro'),
    ]
    
    TIPO_CHOICES = [
        ('Fuerza', 'Fuerza'),
        ('Cardio', 'Cardio'),
        ('Calistenia', 'Calistenia'),
        ('Yoga', 'Yoga'),
        ('Flexibilidad', 'Flexibilidad'),
    ]

    UNIDAD_CHOICES = [
        ('reps', 'Repeticiones'),
        ('minutos', 'Minutos'),
        ('km', 'Kilómetros'),
    ]

    nombre = models.CharField(max_length=100)
    categoria = models.CharField(max_length=50, choices=CATEGORIA_CHOICES)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    unidad = models.CharField(max_length=20, choices=UNIDAD_CHOICES, default='reps')
    imagen = models.CharField(max_length=255, blank=True, null=True, help_text="Nombre del archivo en /exercises/")
    video = models.CharField(max_length=255, blank=True, null=True, help_text="Nombre del archivo en /exercises/")

    def __str__(self):
        return self.nombre

class Entrenamiento(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entrenamientos')
    fecha = models.DateTimeField()
    lugar = models.CharField(max_length=100, default='Gimnasio')
    notas = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} - {self.fecha.strftime('%Y-%m-%d')}"

class RegistroEjercicio(models.Model):
    entrenamiento = models.ForeignKey(Entrenamiento, on_delete=models.CASCADE, related_name='registros')
    ejercicio = models.ForeignKey(Ejercicio, on_delete=models.CASCADE)
    series = models.PositiveIntegerField(default=1)
    cantidad = models.FloatField(help_text="Repeticiones, minutos o km")
    peso = models.FloatField(help_text="kg", default=0)
    descanso = models.PositiveIntegerField(help_text="segundos", blank=True, null=True)

    def __str__(self):
        return f"{self.ejercicio.nombre} - {self.series}x{self.cantidad} ({self.ejercicio.unidad})"
