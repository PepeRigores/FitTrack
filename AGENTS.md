# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

FitTrack is a fitness tracking web application with a decoupled client-server architecture. Users can register, log workouts (entrenamientos), and track exercises (ejercicios) with sets, reps, weight, and duration.

## Development Commands

### Backend (Django)

```bash
# Navigate to backend directory and activate virtual environment
cd backend
source venv/bin/activate  # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Database migrations
python3 manage.py makemigrations
python3 manage.py migrate

# Run development server (http://127.0.0.1:8000/)
python3 manage.py runserver

# Run tests
python3 manage.py test api

# Run a single test
python3 manage.py test api.tests.TestClassName.test_method_name

# Create superuser for admin access
python3 manage.py createsuperuser
```

### Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Run development server (http://localhost:5173/)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# TypeScript check (included in build)
npx tsc --noEmit
```

## Architecture

### Backend (`backend/`)

Django REST Framework API with JWT authentication.

- `fitness_tracker/` - Django project settings and root URL configuration
- `api/` - Main application module:
  - `models.py` - Three models: `Ejercicio` (exercise definitions), `Entrenamiento` (workout sessions per user), `RegistroEjercicio` (exercise records within a workout)
  - `views.py` - ViewSets for CRUD operations + `estadisticas` endpoint for dashboard stats
  - `serializers.py` - DRF serializers with nested `registros` in `EntrenamientoSerializer`
  - `urls.py` - Router configuration and auth endpoints

**API Endpoints:**
- Auth: `/api/auth/register/`, `/api/auth/login/`, `/api/auth/refresh/`
- Resources: `/api/ejercicios/`, `/api/entrenamientos/`, `/api/registros/`
- Stats: `/api/estadisticas/`

**Key configuration:**
- JWT tokens: 60-minute access, 1-day refresh (`settings.py` SIMPLE_JWT)
- CORS: Currently allows all origins (development mode)
- Database: Configured via `DATABASE_URL` env var (uses dj-database-url)

### Frontend (`frontend/`)

React 19 + TypeScript + Vite SPA.

- `src/context/AuthContext.tsx` - Global auth state, stores JWT in localStorage, handles token decode
- `src/services/api.ts` - Axios instance with JWT interceptor and auto-refresh on 401
- `src/types/index.ts` - TypeScript interfaces matching backend models
- `src/pages/` - Route components: LandingPage, Login, Register, Dashboard, Exercises, Workouts, WorkoutDetail
- `src/components/` - Reusable UI components (Layout, Navbar, ui/Button, ui/Card, ui/Input, ui/Modal)

**Auth Flow:**
1. Login/Register stores `token` and `refreshToken` in localStorage
2. API interceptor attaches `Authorization: Bearer <token>` to requests
3. On 401, interceptor attempts refresh before redirecting to login

**Protected Routes:** Dashboard, Exercises (`/ejercicios`), Workouts (`/entrenamientos`), WorkoutDetail use `ProtectedRoute` component that checks `AuthContext.isAuthenticated`

## Environment Variables

### Backend
- `SECRET_KEY` - Django secret key
- `DEBUG` - Set to "True" for debug mode
- `DATABASE_URL` - PostgreSQL connection string for production

### Frontend
- API URL is hardcoded in `src/services/api.ts` - change for local development if needed

## Domain Language

The codebase uses Spanish naming for domain entities:
- Ejercicio = Exercise
- Entrenamiento = Workout
- RegistroEjercicio = Exercise Record (exercise instance within a workout)
- Series = Sets
- Repeticiones = Reps
- Peso = Weight
- Duracion = Duration
- Descanso = Rest time
