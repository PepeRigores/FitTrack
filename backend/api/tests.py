from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from .models import Ejercicio, Entrenamiento, RegistroEjercicio


class FitTrackAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='tester',
            email='tester@example.com',
            password='testpassword123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpassword123'
        )
        self.ejercicio = Ejercicio.objects.create(
            nombre='Press banca',
            categoria='Pecho',
            tipo='Fuerza',
            unidad='reps'
        )

    # ---------------------------------------------------
    # Auth Tests
    # ---------------------------------------------------
    def test_user_registration(self):
        url = '/api/auth/register/'
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], 'newuser')
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_user_login_success(self):
        url = '/api/auth/login/'
        data = {
            'username': 'tester',
            'password': 'testpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_user_login_invalid_credentials(self):
        url = '/api/auth/login/'
        data = {
            'username': 'tester',
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        login_response = self.client.post('/api/auth/login/', {
            'username': 'tester',
            'password': 'testpassword123'
        }, format='json')
        refresh_token = login_response.data['refresh']

        response = self.client.post('/api/auth/refresh/', {
            'refresh': refresh_token
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    # ---------------------------------------------------
    # Ejercicios Tests
    # ---------------------------------------------------
    def test_get_ejercicios_unauthenticated(self):
        # Ejercicios are public read-only
        response = self.client.get('/api/ejercicios/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nombre'], 'Press banca')

    # ---------------------------------------------------
    # Entrenamientos & Registros Tests
    # ---------------------------------------------------
    def test_entrenamientos_requires_auth(self):
        response = self.client.get('/api/entrenamientos/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_and_list_entrenamiento_isolation(self):
        # Authenticate as tester
        self.client.force_authenticate(user=self.user)

        # Create entrenamiento
        data = {
            'fecha': timezone.now().isoformat(),
            'lugar': 'Gimnasio Central',
            'notas': 'Entrenamiento de pecho'
        }
        response = self.client.post('/api/entrenamientos/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        workout_id = response.data['id']

        # Add a registro to it
        registro_data = {
            'entrenamiento': workout_id,
            'ejercicio': self.ejercicio.id,
            'series': 4,
            'cantidad': 10,
            'peso': 80,
            'descanso': 90
        }
        reg_response = self.client.post('/api/registros/', registro_data, format='json')
        self.assertEqual(reg_response.status_code, status.HTTP_201_CREATED)

        # Check detail includes nested registros
        detail_response = self.client.get(f'/api/entrenamientos/{workout_id}/')
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(detail_response.data['registros']), 1)
        self.assertEqual(detail_response.data['registros'][0]['ejercicio_nombre'], 'Press banca')

        # Now authenticate as other_user: should NOT see tester's workout
        self.client.force_authenticate(user=self.other_user)
        other_response = self.client.get('/api/entrenamientos/')
        self.assertEqual(other_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(other_response.data), 0)

    # ---------------------------------------------------
    # Estadisticas Tests
    # ---------------------------------------------------
    def test_estadisticas_endpoint(self):
        self.client.force_authenticate(user=self.user)
        # Create an entrenamiento with a registro
        entrenamiento = Entrenamiento.objects.create(
            usuario=self.user,
            fecha=timezone.now(),
            lugar='Gimnasio'
        )
        RegistroEjercicio.objects.create(
            entrenamiento=entrenamiento,
            ejercicio=self.ejercicio,
            series=3,
            cantidad=12,
            peso=60,
            descanso=60
        )

        response = self.client.get('/api/estadisticas/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_entrenamientos'], 1)
        self.assertEqual(response.data['total_ejercicios_registrados'], 1)
        self.assertTrue(len(response.data['entrenamientos_chart']) >= 1)
        self.assertEqual(response.data['ejercicios_frecuentes'][0]['ejercicio__nombre'], 'Press banca')
