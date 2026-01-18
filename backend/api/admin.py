from django.contrib import admin

# Register your models here.

from .models import Ejercicio, Entrenamiento, RegistroEjercicio

admin.site.register(Ejercicio)
admin.site.register(Entrenamiento)
admin.site.register(RegistroEjercicio)
