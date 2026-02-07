from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Ejercicio, Entrenamiento, RegistroEjercicio

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class EjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejercicio
        fields = '__all__'

class RegistroEjercicioSerializer(serializers.ModelSerializer):
    ejercicio_nombre = serializers.ReadOnlyField(source='ejercicio.nombre')
    ejercicio_imagen = serializers.ReadOnlyField(source='ejercicio.imagen')

    class Meta:
        model = RegistroEjercicio
        fields = '__all__'

class EntrenamientoSerializer(serializers.ModelSerializer):
    registros = RegistroEjercicioSerializer(many=True, read_only=True)
    usuario = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = Entrenamiento
        fields = '__all__'
