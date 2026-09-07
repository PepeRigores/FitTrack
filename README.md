# 🏋️ Fitness TracKer

Aplicación web Full Stack para el registro, gestión y seguimiento de entrenamientos físicos, desarrollada como proyecto del ciclo formativo de **Desarrollo de Aplicaciones Web (DAW)**.

El objetivo principal del proyecto es ofrecer una herramienta sencilla, privada y estructurada que permita a los usuarios registrar sus rutinas de entrenamiento y motivarse con su progreso mediante estadísticas y visualizaciones gráficas.

---
## 📌 Enlace:

Para poder probar la aplicación mientras está en desarrollo, se ha desplegado en servicios gratuitos de la nube. Puede tardar unos minutos en cargar la primera vez. Gracias por la paciencia:

https://fitness-tracker-khaki-eight.vercel.app/

---

## 📚 Características principales

- Registro y autenticación de usuarios mediante **JWT**
- Gestión completa de entrenamientos y ejercicios (CRUD)
- Registro detallado de sesiones (series, repeticiones, peso, duración, descansos)
- Visualización del progreso mediante estadísticas y gráficas
- Arquitectura **cliente-servidor desacoplada**
- Interfaz web moderna, responsive y centrada en la usabilidad

---

## 🧱 Stack tecnológico

### Backend
- Python3
- Django
- Django REST Framework
- Autenticación JWT (`djangorestframework-simplejwt`)
- Base de datos: MySQL / MariaDB (PyMySQL)

### Frontend
- React
- TypeScript
- Vite
- React Router
- Fetch API / Axios

### Herramientas adicionales
- Git & GitHub (control de versiones)
- Trello (metodología Kanban)
- UML y wireframes (fase de diseño)

---

## 📂 Estructura principal del proyecto

```

fitTrack/
│
├── backend/              # API REST (Django)
│   ├── api/
│   ├── fitness_tracker/
│   ├── venv/
│   ├── db.sqlite3       # en desarrollo
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/             # React + TypeScript
│   ├── src/
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
└── README.md

````

---

## 🚀 Instalación y ejecución en local

### Requisitos previos
- Python3.10 o superior
- Node.js 18 o superior
- Git

---

### 🔧 Backend (Django)

1. Accede a la carpeta backend:
```bash
cd backend
````

2. Crea y activa un entorno virtual:

```bash
python3 -m venv venv
source venv/bin/activate   # Linux / macOS
#venv\Scripts\activate      # Windows
```

3. Instala dependencias:

```bash
pip install -r requirements.txt
```

4. Configura las variables de entorno (opcional si usas los valores por defecto de MySQL en local):
Copia `.env.example` a `.env` y ajusta las credenciales de tu base de datos MySQL:
```bash
cp .env.example .env
```

Asegúrate de haber creado la base de datos en MySQL:
```sql
CREATE DATABASE fittrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Aplica migraciones y carga los datos iniciales:

```bash
python3 manage.py migrate
python3 manage.py loaddata data_backup.json  # Restaura los 20 ejercicios y datos de prueba
```

6. Ejecuta el servidor:

```bash
python3 manage.py runserver
```

📍 El backend estará disponible en:
`http://127.0.0.1:8000/`

---

### ⚛️ Frontend (React)

1. Accede a la carpeta frontend:

```bash
cd frontend
```

2. Instala dependencias:

```bash
npm install
```

3. Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

📍 El frontend estará disponible en:
`http://localhost:5173/`

---

## 🔐 Autenticación

La aplicación utiliza **JSON Web Tokens (JWT)** para la autenticación:

* El token se obtiene al iniciar sesión
* Se almacena en `localStorage`
* Se envía en cada petición protegida mediante el header:

```
Authorization: Bearer <token>
```

---

## 📊 Funcionalidades en desarrollo / futuras mejoras

* Estadísticas avanzadas y gráficos comparativos
* Exportación de entrenamientos (CSV / PDF)
* Rachas de entrenamiento
* Modo oscuro
* Integración con APIs externas de ejercicios
* Despliegue en entorno de producción

---

## 👥 Equipo de desarrollo

* **Sebastián Cava** – Backend / API REST / Base de datos
* **Jose Conesa** – Frontend / UI / Integración cliente-servidor

Proyecto desarrollado como parte del ciclo formativo de **Desarrollo de Aplicaciones Web (DAW)**.

---

## 📄 Licencia

Este proyecto se desarrolla con fines **educativos**.
No está destinado a uso comercial.

---

## 📎 Enlaces de interés

* Documentación Django: [https://docs.djangoproject.com/](https://docs.djangoproject.com/)
* Documentación Django REST Framework: [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/)
* Documentación React: [https://react.dev/](https://react.dev/)

