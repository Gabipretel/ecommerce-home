import axios from "axios";

// Configuración del endpoint del backend
const API_BASE_URL = "http://localhost:3000";

// Clave para localStorage
const CHAT_HISTORY_KEY = "gamercito_chat_history";

// Funciones para manejar el historial en localStorage
export const getChatHistory = () => {
  try {
    const history = localStorage.getItem(CHAT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error al obtener historial del chat:', error);
    return [];
  }
};

export const saveChatHistory = (history) => {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error al guardar historial del chat:', error);
  }
};

export const addMessageToHistory = (message, isUser = true) => {
  const history = getChatHistory();
  const newMessage = {
    id: Date.now(),
    text: message,
    isUser,
    timestamp: new Date().toISOString()
  };
  
  history.push(newMessage);
  
  // Limitar el historial a los últimos 50 mensajes para evitar que crezca demasiado
  if (history.length > 50) {
    history.splice(0, history.length - 50);
  }
  
  saveChatHistory(history);
  return newMessage;
};

export const clearChatHistory = () => {
  try {
    localStorage.removeItem(CHAT_HISTORY_KEY);
  } catch (error) {
    console.error('Error al limpiar historial del chat:', error);
  }
};

// Función para formatear el historial para enviar a la API
const formatHistoryForAPI = (history) => {
  // Tomar los últimos 10 mensajes para contexto (5 intercambios)
  const recentHistory = history.slice(-10);
  return recentHistory.map(msg => ({
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.text
  }));
};

const chatService = async (mensaje) => {
  try {
    console.log('URL:', `${API_BASE_URL}/api/chatbot/mensaje`);
    console.log('Pregunta:', mensaje);
    
    // Obtener historial para contexto
    const history = getChatHistory();
    const historialParaAPI = formatHistoryForAPI(history);
    
    // Agregar el mensaje del usuario al historial
    addMessageToHistory(mensaje, true);
    
    // Enviar mensaje con historial para contexto
    const payload = {
      mensaje,
      historial: historialParaAPI
    };
    
    const respuesta = await axios.post(
      `${API_BASE_URL}/api/chatbot/mensaje`,
      payload,
      { 
        headers: { "Content-Type": "application/json" },
        timeout: 30000 // 30 segundos timeout
      }
    );
    
    console.log('Respuesta completa de la API:', respuesta.data);
    
    // Manejar la estructura anidada de la respuesta
    let respuestaTexto;
    if (respuesta.data.success && respuesta.data.data && respuesta.data.data.respuesta) {
      respuestaTexto = respuesta.data.data.respuesta;
    } else if (respuesta.data.respuesta) {
      respuestaTexto = respuesta.data.respuesta;
    } else if (respuesta.data.data) {
      respuestaTexto = respuesta.data.data;
    } else {
      respuestaTexto = respuesta.data;
    }
    
    console.log('Respuesta de Gamercito IA:', respuestaTexto);
    
    // Agregar la respuesta de la IA al historial
    addMessageToHistory(respuestaTexto, false);
    
    return respuestaTexto;
  } catch (err) {
    console.error('Error en chat service:', err);
    
    if (err.code === 'ECONNABORTED') {
      throw new Error('Tiempo de espera agotado. Intenta con una pregunta más corta.');
    }
    
    if (err.response?.status === 429) {
      throw new Error('Demasiadas consultas. Espera un momento antes de preguntar de nuevo.');
    }
    
    if (err.response?.status >= 500) {
      throw new Error('Error del servidor. Intenta de nuevo en unos momentos.');
    }
    
    throw new Error(err.response?.data?.error || 'Error de conexión con Gamercito IA');
  }
};

export default chatService;
