// src/server.js

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // máximo 30 requests por minuto
});
app.use(limiter);

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint principal del chatbot
app.post('/api/chat', async (req, res) => {
  const { message, thread_id } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }
  try {
    let threadId = thread_id;
    // Si no hay thread_id, crear uno nuevo
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }
    // Añadir el mensaje del usuario al thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });
    // Ejecutar el assistant sobre el thread
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: 'asst_AA6kOqtWeZeL9I4Wy5m1zzbV',
    });
    // Esperar a que termine el run (polling)
    let runStatus = run.status;
    let runResult = run;
    while (runStatus !== 'completed' && runStatus !== 'failed' && runStatus !== 'cancelled') {
      await new Promise(r => setTimeout(r, 1000));
      runResult = await openai.beta.threads.runs.retrieve(threadId, run.id);
      runStatus = runResult.status;
    }
    if (runStatus !== 'completed') {
      return res.status(500).json({ error: 'El asistente no pudo completar la solicitud.', thread_id: threadId });
    }
    // Obtener el último mensaje del assistant
    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessage = messages.data.find(m => m.role === 'assistant');
    const response = assistantMessage ? assistantMessage.content[0].text.value : 'Sin respuesta del asistente.';
    res.json({ response, thread_id: threadId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
}); 