# Personas Desaparecidas Bolivia

Plataforma React/Vite y API REST para la consulta y administración de personas desaparecidas. La API usa Express, TypeScript, MongoDB/Mongoose, Passport Local/JWT y bcrypt. Los archivos `Backend/data/*.json` se conservan solo como referencia histórica y **no se leen en tiempo de ejecución**.

## Configuración

```bash
cd Backend
cp .env.example .env
# Configure MONGODB_URI for the desaparecidos_db database and set a strong JWT_SECRET
npm install
npm run create-admin -- "Nombre" "1234567" "admin@example.com" "una-clave-segura" ADMIN
npm run dev
```

El proceso del backend no inicia si no puede conectarse a MongoDB. Para producción:

```bash
npm run build
npm start
```

En otra terminal:

```bash
cd Frontend
npm install
npm run dev
```

Vite reenvía `/api` a `http://localhost:3000`. Para una API externa, defina `VITE_API_URL` en `Frontend/.env.local`.

## API

- `GET /api/health`
- `GET /api/personas` con filtros `nombre`, `departamento`, `edad`, `edadMin`, `edadMax`, `genero` y `estado`
- `GET /api/personas/:id`
- `POST`, `PATCH`, `DELETE /api/personas/:id` (JWT de administrador)
- `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`

El logout es stateless: invalida la sesión local del cliente; el JWT deja de ser aceptable al expirar, o antes si el administrador se desactiva. Nunca se persisten contraseñas en el navegador ni se devuelven hashes.
