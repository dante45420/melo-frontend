# Probar localmente

## 1. Backend (terminal 1)

```bash
cd melo-backend
pip install -r requirements.txt
FLASK_APP=run.py flask db upgrade   # aplicar migraciones
python scripts/seed.py              # datos iniciales (solo la primera vez)
python run.py
```

El backend queda en **http://localhost:5000**

## 2. Frontend (terminal 2)

```bash
cd melo-frontend
npm install
npm run dev
```

El frontend queda en **http://localhost:5173**

## 3. Probar

- **Sitio público**: http://localhost:5173
- **Admin**: http://localhost:5173/admin
- **Login admin**: usuario `admin`, contraseña `test123` (según tu `.env`)

## Variables de entorno

**melo-backend/.env** (ya configurado para dev):
```
ADMIN_USER=admin
ADMIN_PASSWORD=test123
SECRET_KEY=dev-secret-cambiar-en-produccion
FRONTEND_URL=http://localhost:5173
```

**melo-frontend/.env** (usa proxy en dev):
```
VITE_API_URL=
```
