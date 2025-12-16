from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django.contrib.auth.models import User
from .models import Ejercicio, Entrenamiento, RegistroEjercicio
from .serializers import (
    UserSerializer, EjercicioSerializer, 
    EntrenamientoSerializer, RegistroEjercicioSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class EjercicioViewSet(viewsets.ModelViewSet):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class EntrenamientoViewSet(viewsets.ModelViewSet):
    serializer_class = EntrenamientoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Entrenamiento.objects.filter(usuario=self.request.user).order_by('-fecha')

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class RegistroEjercicioViewSet(viewsets.ModelViewSet):
    serializer_class = RegistroEjercicioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RegistroEjercicio.objects.filter(entrenamiento__usuario=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def estadisticas(request):
    user = request.user
    
    # Basic Stats
    total_entrenamientos = Entrenamiento.objects.filter(usuario=user).count()
    total_ejercicios_registrados = RegistroEjercicio.objects.filter(entrenamiento__usuario=user).count()
    
    # Workouts per week (last 4 weeks)
    from django.utils import timezone
    from datetime import timedelta
    from django.db.models import Count
    
    today = timezone.now().date()
    four_weeks_ago = today - timedelta(weeks=4)
    
    entrenamientos_ultimos_mes = Entrenamiento.objects.filter(
        usuario=user, 
        fecha__date__gte=four_weeks_ago
    ).values('fecha__date').annotate(count=Count('id')).order_by('fecha__date')
    
    # Format for chart (simplification: just list of dates and counts)
    # Ideally we would fill in missing dates or group by week
    
    # Most frequent exercises
    ejercicios_frecuentes = RegistroEjercicio.objects.filter(
        entrenamiento__usuario=user
    ).values('ejercicio__nombre').annotate(
        count=Count('ejercicio')
    ).order_by('-count')[:5]
    
    return Response({
        'total_entrenamientos': total_entrenamientos,
        'total_ejercicios_registrados': total_ejercicios_registrados,
        'entrenamientos_chart': list(entrenamientos_ultimos_mes),
        'ejercicios_frecuentes': list(ejercicios_frecuentes),
    })
