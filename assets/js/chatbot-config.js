// Configuración del Chatbot
const CHATBOT_CONFIG = {
  // URL del backend - cambiar según el entorno
  // Para desarrollo local:
  // API_URL: 'http://localhost:3001/api/chat'
  // Para producción en Vercel:
  API_URL: '/api/chat-fast',
  
  // Configuración del bot
  botName: "Maxima Abonos",
  botDescription: "Bienvenido a tu asistente de IA! Aquí podrás resolver cualquier duda.",
  color: "#8DC63F",
  radius: 16,
  fontFamily: "Inter, sans-serif"
};

// Función para obtener la URL correcta según el entorno
function getApiUrl() {
  // Si estamos en localhost, usar el servidor local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api/chat';
  }
  // Si estamos en Vercel, usar la función serverless
  return CHATBOT_CONFIG.API_URL;
}

// Función temporal para mostrar mensaje de mantenimiento
function showMaintenanceMessage() {
  return 'El chatbot está en mantenimiento. Pronto estará disponible.';
} 