# Proyecto desaparecidos

Aplicación con frontend React/Vite y API Node.js. El frontend inicia sesión mediante `POST /api/auth/login`; las credenciales se validan en el backend, no en el navegador.

## Ejecutar en Visual Studio Code

Abra dos terminales integradas:

```bash
cd Backend
npm run dev
```

```bash
cd Frontend
npm install
npm run dev
```

Abra la URL de Vite (normalmente `http://localhost:5173`). Vite reenvía `/api` a `http://localhost:3000`.

Para un backend externo, cree `Frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
```

El backend admite `PORT`, `HOST` y `CORS_ORIGIN`, y expone `GET /api/health` y `GET /api/personas`.
