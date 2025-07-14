// api/chat.js - Vercel Serverless Function
import OpenAI from 'openai';

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { message, thread_id } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }

  // Verificar API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY no está definida');
    return res.status(500).json({ error: 'Error de configuración del servidor' });
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

    // Esperar a que termine el run (polling optimizado)
    let runStatus = run.status;
    let runResult = run;
    let attempts = 0;
    const maxAttempts = 60; // 60 segundos máximo
    
    while (runStatus !== 'completed' && runStatus !== 'failed' && runStatus !== 'cancelled' && attempts < maxAttempts) {
      attempts++;
      // Polling más agresivo: empezar con 250ms y aumentar gradualmente
      const delay = Math.min(250 + (attempts * 50), 1000);
      await new Promise(r => setTimeout(r, delay));
      
      runResult = await openai.beta.threads.runs.retrieve(threadId, run.id);
      runStatus = runResult.status;
    }

    if (runStatus !== 'completed') {
      console.error('Error en el run:', runResult);
      if (attempts >= maxAttempts) {
        return res.status(408).json({ 
          error: 'El asistente tardó demasiado en responder. Intenta de nuevo.', 
          thread_id: threadId 
        });
      }
      return res.status(500).json({ 
        error: 'El asistente no pudo completar la solicitud.', 
        details: runResult,
        thread_id: threadId 
      });
    }

    // Obtener el último mensaje del assistant
    const messages = await openai.beta.threads.messages.list(threadId);
    const assistantMessage = messages.data.find(m => m.role === 'assistant');
    const response = assistantMessage ? assistantMessage.content[0].text.value : 'Sin respuesta del asistente.';

    res.json({ response, thread_id: threadId });

  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message,
      type: error.type
    });
  }
} 