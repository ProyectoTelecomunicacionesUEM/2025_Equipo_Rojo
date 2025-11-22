# Guía rápida para desplegar y usar la template del proyecto

## 1. Preparar el proyecto
1. `git clone <repo>` y entra en la carpeta.
2. Instala dependencias: `npm install`.
    2.1 En caso de que de error (`node no se reconoce como un comando`) comprueba si tienes instalado Node.js. Si no lo tienes descargalo en: https://nodejs.org/en/download 
    2.2 En caso de que de error `"No se puede cargar el archivo C:\Program Files\nodejs\npm.ps1 porque la ejecución de scripts está deshabilitada en este sistema."` hay que escribir en la terminal de VSC (Powershell) lo siguiente:
         `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

3. Ten a mano Node 18+, una cuenta en Vercel y cuenta de Neon (está asociado a Vercel).

## 2. Configurar Vercel y Neon
1. Importa el repo en Vercel (la primera build fallará por falta de variables).
2. En **Storage**, crea/conecta una base de datos de Neon y copia el snippet completo.
3. Ve a **Settings > Environment Variables**, pega todas las variables del snippet. (Control+V valdrá)
4. Genera `AUTH_SECRET` ejecutando `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Para esto usa la Terminal de Visual Studio Code.
5. Ve a **Settings > Environment Variables**, añade `AUTH_SECRET` y la clave hexadecimal generada.
6. Guarda los cambios y haz un redeploy.
7. Ya tenemos lista la aplicación web.

## 3. Variables locales
1. Crea `.env.local` (no se comitea) con las mismas variables que en Vercel (Neon y AUTH_SECRET). Puedes hacer lo mismo que pasos 2 y 4 de antes. Importante que sea el mismo AUTH_SECRET y la misma DATABASE_URL.
2. Puedes incluir también `POSTGRES_URL`, etc. Next.js lee `.env.local` automáticamente.

## 4. Migraciones y seed
En cada terminal que toques la base de datos, exporta la URL antes de correr los scripts:

$env:DATABASE_URL="postgresql://neondb_owner:...@ep-xxxx-pooler.../neondb?sslmode=require"  #Tendrás que poner la URL de la base de datos que quieras usar
npm run db:migrate   # crea tablas (migrations/001_init.sql)
npm run db:seed      # inserta/actualiza demo@finwise.dev / Demo123! (migrations/002_seed.sql)

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

