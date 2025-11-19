# Guía rápida para desplegar y usar Finwise

## 1. Preparar el proyecto
1. `git clone <repo>` y entra en la carpeta.
2. Instala dependencias: `npm install`.
3. Ten a mano Node 18+, una cuenta en Vercel y un proyecto Neon.

## 2. Configurar Vercel y Neon
1. Importa el repo en Vercel (la primera build fallará por falta de variables).
2. En **Storage**, crea/conecta una base Neon y copia el snippet completo (usa la URL que termina en `-pooler...?sslmode=require`).
3. Genera `AUTH_SECRET` con `node -e "console.log(require(''crypto'').randomBytes(32).toString(''hex''))"`.
4. Ve a **Settings ? Environment Variables**, pega todas las variables del snippet y añade `AUTH_SECRET`. Guarda los cambios y redeploya.

## 3. Variables locales
1. Crea `.env.local` (no se comitea) con las mismas variables que en Vercel:

   ```ini
   DATABASE_URL=postgresql://neondb_owner:...@ep-xxxx-pooler.../neondb?sslmode=require
   AUTH_SECRET=<tu hex de 64 caracteres>
   AUTH_TRUST_HOST=true
   ```

2. Puedes incluir también `POSTGRES_URL`, etc. Next.js lee `.env.local` automáticamente.

## 4. Migraciones y seed
En cada terminal que toques la base, exporta la URL antes de correr los scripts:

```powershell
$env:DATABASE_URL="postgresql://neondb_owner:...@ep-xxxx-pooler.../neondb?sslmode=require"
npm run db:migrate   # crea tablas (migrations/001_init.sql)
npm run db:seed      # inserta/actualiza demo@finwise.dev / Demo123! (migrations/002_seed.sql)
```

- Si prefieres evitar el `export`, usa `npx dotenv -e .env.local -- npm run db:migrate`.
- Repite estos comandos contra la base productiva si necesitas regenerar el usuario demo.

## 5. Desarrollo local
1. Ejecuta `npm run dev`.
2. Abre [http://localhost:3000/login](http://localhost:3000/login).
3. Inicia sesión con `demo@finwise.dev / Demo123!` y verás la página de bienvenida `/welcome`.

## 6. Despliegue en Vercel
1. Comprueba que `DATABASE_URL`, `AUTH_SECRET` y (opcional) `AUTH_TRUST_HOST=true` están configurados en Vercel.
2. Haz un redeploy; no necesitas repetir migraciones si la base Neon es la misma.
3. Prueba `/login` en tu dominio de Vercel con las credenciales demo para confirmar que todo está bien.

> Si cambias la contraseña demo, genera un hash nuevo con `node -e "const { hashSync } = require('@node-rs/bcrypt'); console.log(hashSync('NuevaClave!', 10));"`, actualiza `migrations/002_seed.sql` y vuelve a ejecutar `npm run db:seed`.

