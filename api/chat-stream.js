// api/chat-stream.js - Ultra fast streaming version
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
    return res.status(500).json({ error: 'Error de configuración del servidor' });
  }

  // Configurar para streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const messages = [
      {
        role: 'system',
        content: `Eres un asistente de Maxima Abonos (fertilizantes agrícolas). Ayuda con productos, usos y dosificaciones. Responde de forma profesional y técnica.`
      },
      ...conversation_history.slice(-4), // Solo últimas 4 interacciones
      {
        role: 'user',
        content: message
      }
    ];

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
      stream: true,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Enviar evento de finalización
    const updated_history = [
      ...conversation_history,
      { role: 'user', content: message },
      { role: 'assistant', content: fullResponse }
    ].slice(-4);

    res.write(`data: ${JSON.stringify({ 
      type: 'complete', 
      conversation_history: updated_history 
    })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Error detallado:', error);
    res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      error: 'Error al procesar la solicitud' 
    })}\n\n`);
    res.end();
  }
}