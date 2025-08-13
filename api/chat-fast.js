// api/chat-fast.js - Faster version using Chat Completions API
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { message, conversation_history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY no está definida');
    return res.status(500).json({ error: 'Error de configuración del servidor' });
  }

  try {
    // Construir el historial de conversación
    const messages = [
      {
        role: 'system',
        content: `Eres un asistente de Maxima Abonos (fertilizantes agrícolas). Ayuda con productos, usos y dosificaciones. Responde de forma profesional y técnica.`
      },
      ...conversation_history,
      {
        role: 'user',
        content: message
      }
    ];

    // Llamada optimizada - modelo más rápido y configuración optimizada
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 300, // Reducido para respuestas más rápidas
      temperature: 0.7,
      stream: false, // Asegurar no streaming para esta versión
      presence_penalty: 0.1, // Evitar repetición
      frequency_penalty: 0.1
    });

    const response = completion.choices[0].message.content;

    // Historial optimizado - mantener solo las últimas 6 interacciones para velocidad
    const updated_history = [
      ...conversation_history,
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    ].slice(-6); // Menos contexto = respuestas más rápidas

    res.json({ 
      response, 
      conversation_history: updated_history 
    });

  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ 
      error: 'Error al procesar la solicitud',
      details: error.message
    });
  }
}