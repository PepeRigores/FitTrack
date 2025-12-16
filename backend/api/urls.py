from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    UserViewSet, EjercicioViewSet, 
    EntrenamientoViewSet, RegistroEjercicioViewSet,
    estadisticas
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'ejercicios', EjercicioViewSet)
router.register(r'entrenamientos', EntrenamientoViewSet, basename='entrenamiento')
router.register(r'registros', RegistroEjercicioViewSet, basename='registro')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', UserViewSet.as_view({'post': 'create'}), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('estadisticas/', estadisticas, name='estadisticas'),
]
