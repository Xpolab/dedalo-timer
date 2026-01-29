---
description: Cómo desplegar Dédalo en la web usando Vercel y GitHub
---

Para que tus compañeros puedan usar **Dédalo**, sigue estos pasos para poner la aplicación en línea:

### Paso 1: Crear un repositorio en GitHub
1. Entra en [github.com](https://github.com) y crea un nuevo repositorio llamado `dedalo-timer`.
2. No marques ninguna opción de "Initialize this repository with..." (déjalo vacío).

### Paso 2: Vincular tu código local con GitHub
Abre tu terminal en la carpeta del proyecto y ejecuta estos comandos:

```bash
# Inicializar Git
git init

# Agregar todos los archivos e ignorar node_modules
git add .

# Primer commit
git commit -m "Initial commit: Dédalo Timer"

# Vincular con tu repo (reemplaza 'TU_USUARIO' por tu nombre en GitHub)
git remote add origin https://github.com/TU_USUARIO/dedalo-timer.git

# Subir el código
git branch -M main
git push -u origin main
```

### Paso 3: Desplegar en Vercel
1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New"** > **"Project"**.
3. Busca el repositorio `dedalo-timer` y haz clic en **"Import"**.
4. Vercel detectará automáticamente que es un proyecto de **Vite**. No cambies ninguna configuración.
5. Haz clic en **"Deploy"**.

### Paso 4: ¡Listo!
En un par de minutos, Vercel te dará una URL (ej: `dedalo-timer.vercel.app`). ¡Compártela con tus compañeros!

---
> [!TIP]
> Cada vez que hagas un cambio y hagas `git push`, la web se actualizará automáticamente.
