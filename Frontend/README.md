# Proyecto desaparecidos

Aplicación dividida en un frontend React/Vite y una API Node.js. El frontend consume la API mediante `POST /api/auth/login`; las credenciales no se cargan ni validan en el navegador.

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

Abra la URL indicada por Vite (habitualmente `http://localhost:5173`). Vite reenvía automáticamente las solicitudes `/api` al backend en `http://localhost:3000`.

Para una URL distinta del backend (por ejemplo, despliegue), cree `Frontend/.env.local` con:

```env
VITE_API_URL=http://localhost:3000/api
```

La API puede configurarse con `PORT`, `HOST` y `CORS_ORIGIN`. Incluye `GET /api/health` para comprobar su disponibilidad.
