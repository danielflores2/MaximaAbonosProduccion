# Despliegue en Vercel con Serverless Functions

## ✅ Ventajas de usar Vercel Serverless Functions

- **Gratuito**: Hasta 100GB-Hrs de ejecución por mes
- **Sin servidor separado**: Todo en un solo proyecto
- **Despliegue automático**: Con cada push a GitHub
- **Escalabilidad automática**: Se activa solo cuando se necesita

## 📁 Estructura del proyecto

```
maxima/
├── api/
│   └── chat.js          # Serverless function para el chatbot
├── assets/
│   └── js/
│       └── chatbot-config.js  # Configuración del chatbot
├── package.json         # Dependencias (solo openai)
├── vercel.json          # Configuración de Vercel
└── index.html           # Frontend
```

## 🚀 Pasos para desplegar

### 1. Instalar Vercel CLI (opcional)
```bash
npm i -g vercel
```

### 2. Configurar variables de entorno en Vercel

**Opción A: Desde el dashboard de Vercel**
1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Ve a Settings → Environment Variables
3. Añade:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Tu API key de OpenAI
   - **Environment**: Production, Preview, Development

**Opción B: Desde la línea de comandos**
```bash
vercel env add OPENAI_API_KEY
```

### 3. Desplegar
```bash
vercel --prod
```

O simplemente haz push a GitHub y Vercel se desplegará automáticamente.

## 🔧 Configuración local para desarrollo

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno local
Crea un archivo `.env.local`:
```
OPENAI_API_KEY=tu_api_key_aqui
```

### 3. Ejecutar en desarrollo
```bash
vercel dev
```

## 📊 Límites gratuitos de Vercel

- **Serverless Function Execution**: 100GB-Hrs/mes
- **Bandwidth**: 100GB/mes
- **Build Time**: 6000 minutos/mes
- **Function Size**: 50MB por función

## ⚠️ Consideraciones importantes

### Timeout de funciones
- **Límite**: 60 segundos (configurado en `vercel.json`)
- **Tu chatbot**: Usa polling que puede tardar varios segundos
- **Solución**: Si necesitas más tiempo, considera Railway/Render

### Cold starts
- La primera petición puede tardar 1-2 segundos
- Las siguientes peticiones son más rápidas
- Normal para serverless functions

## 🧪 Probar el chatbot

1. Despliega en Vercel
2. Abre tu sitio web
3. Haz clic en el chatbot
4. Escribe un mensaje de prueba
5. Deberías recibir respuesta del asistente

## 🔍 Debugging

### Ver logs en Vercel
1. Ve a tu proyecto en Vercel
2. Haz clic en "Functions"
3. Selecciona `api/chat.js`
4. Ve a "Logs" para ver errores

### Errores comunes
- **"OPENAI_API_KEY no está definida"**: Configura la variable de entorno
- **"Método no permitido"**: Asegúrate de usar POST
- **Timeout**: El assistant tardó más de 60 segundos

## 🆚 Comparación: Vercel vs Railway/Render

| Característica | Vercel | Railway/Render |
|----------------|--------|----------------|
| **Costo** | Gratis (100GB-Hrs) | Gratis (limitado) |
| **Configuración** | Más simple | Más compleja |
| **Timeout** | 60s máximo | Sin límite |
| **Cold starts** | Sí | No |
| **Escalabilidad** | Automática | Manual |

## 🎯 Recomendación

**Usa Vercel** si:
- Quieres simplicidad
- Tu chatbot no necesita más de 60 segundos
- Quieres todo en un solo proyecto

**Usa Railway/Render** si:
- Necesitas más de 60 segundos de timeout
- Quieres control total del servidor
- Prefieres una aplicación Express completa 