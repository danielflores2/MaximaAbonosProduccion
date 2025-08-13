# Guía de Despliegue del Chatbot

## Problema
El chatbot está configurado para conectarse a `http://localhost:3001/api/chat`, pero cuando subes la página a Vercel, esa URL local no existe. Necesitas desplegar el backend por separado.

## Solución: Desplegar el Backend en Railway

### Paso 1: Preparar el proyecto
1. Asegúrate de tener un archivo `.env` en la raíz del proyecto con tu API key de OpenAI:
```
OPENAI_API_KEY=tu_api_key_aqui
```

### Paso 2: Desplegar en Railway
1. Ve a [Railway.app](https://railway.app) y crea una cuenta
2. Haz clic en "New Project" → "Deploy from GitHub repo"
3. Conecta tu repositorio de GitHub
4. Railway detectará automáticamente que es un proyecto Node.js
5. En la configuración del proyecto, añade la variable de entorno:
   - **Variable**: `OPENAI_API_KEY`
   - **Value**: Tu API key de OpenAI

### Paso 3: Obtener la URL del backend
1. Una vez desplegado, Railway te dará una URL como: `https://tu-proyecto.railway.app`
2. Copia esa URL

### Paso 4: Actualizar la configuración del chatbot
1. Abre el archivo `assets/js/chatbot-config.js`
2. Cambia la línea:
```javascript
API_URL: 'https://tu-backend-url.railway.app/api/chat',
```
Por tu URL real:
```javascript
API_URL: 'https://tu-proyecto.railway.app/api/chat',
```

### Paso 5: Volver a desplegar en Vercel
1. Haz commit y push de los cambios
2. Vercel se desplegará automáticamente

## Alternativa: Desplegar en Render

Si prefieres usar Render:

1. Ve a [Render.com](https://render.com)
2. Crea una cuenta y haz clic en "New Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: maxima-chatbot-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Añade la variable de entorno `OPENAI_API_KEY`
6. Despliega y copia la URL generada
7. Actualiza `chatbot-config.js` con la nueva URL

## Verificar que funciona

1. Abre tu sitio web en Vercel
2. Abre el chatbot
3. Escribe un mensaje de prueba
4. Deberías recibir una respuesta del asistente

## Estructura de archivos importante

```
maxima/
├── assets/
│   └── js/
│       ├── server.js          # Backend del chatbot
│       └── chatbot-config.js  # Configuración del chatbot
├── package.json               # Dependencias del backend
├── .env                       # Variables de entorno (NO subir a GitHub)
└── index.html                 # Frontend con el chatbot
```

## Notas importantes

- **NO subas el archivo `.env` a GitHub** - contiene tu API key
- El backend debe estar desplegado antes de que el chatbot funcione
- Railway y Render ofrecen planes gratuitos que son suficientes para este proyecto
- Si cambias la URL del backend, recuerda actualizar `chatbot-config.js` 