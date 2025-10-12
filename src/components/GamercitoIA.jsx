/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Minimize2,
  Send,
  Bot,
  Gamepad2,
  Zap,
  Target,
  TrendingUp,
  Users,
  Monitor,
  Cpu,
  Trash2,
} from "lucide-react";
import chatService, { getChatHistory, clearChatHistory } from "../services/chatService";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import formatChatbotResponse from "../utils/formatChatbotResponse";

const GamercitoIA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([]);

  // Cargar historial desde localStorage al montar el componente
  useEffect(() => {
    const savedHistory = getChatHistory();
    if (savedHistory.length > 0) {
      // Convertir el formato del historial a formato de mensajes del componente
      const convertedMessages = savedHistory.map((msg, index) => ({
        id: msg.id || index + 1,
        text: msg.text,
        sender: msg.isUser ? "user" : "bot",
        isTyping: false,
      }));
      setMessages(convertedMessages);
    } else {
      // Si no hay historial, mostrar mensaje de bienvenida
      setMessages([
        {
          id: 1,
          text: "¡Hola! Soy Gamercito IA de Gamer Once Gamer Always, tu asistente especializado en gaming y tecnología. ¿En qué puedo ayudarte hoy? 🎮",
          sender: "bot",
          isTyping: false,
        },
      ]);
    }
  }, []);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const chatbotRef = useRef(null);
  const dragRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMouseDown = (e) => {
    if (dragRef.current && dragRef.current.contains(e.target)) {
      setIsDragging(true);
      const rect = chatbotRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Limitar dentro de la ventana
      const maxX = window.innerWidth - 400;
      const maxY = window.innerHeight - 500;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Efecto de escritura progresiva
  const typeText = (text, messageId, speed = 20) => {
    let i = 0;
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const timer = setInterval(() => {
      if (i < text.length) {
        const newMessages = [...messages];
        newMessages[messageIndex].text = text.substring(0, i + 1);
        newMessages[messageIndex].isTyping = true;
        setMessages(newMessages);
        i++;
      } else {
        const newMessages = [...messages];
        newMessages[messageIndex].isTyping = false;
        setMessages(newMessages);
        clearInterval(timer);
      }
    }, speed);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isLoading) {
      const userMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: "user",
        isTyping: false,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsLoading(true);

      // Crear mensaje de carga
      const loadingMessage = {
        id: Date.now() + 1,
        text: "",
        sender: "bot",
        isTyping: true,
      };
      setMessages((prev) => [...prev, loadingMessage]);

      try {
        const response = await chatService(userMessage.text);

        // Reemplazar el mensaje de carga con la respuesta real
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessage.id
              ? { ...msg, text: response, isTyping: true }
              : msg
          )
        );

        // Iniciar efecto de escritura
        typeText(response, loadingMessage.id);
      } catch (err) {
        console.log(err.message);
        const errorMessage = err.message || "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMessage.id
              ? { ...msg, text: errorMessage, isTyping: false }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClearHistory = () => {
    clearChatHistory();
    setMessages([
      {
        id: 1,
        text: "¡Hola! Soy Gamercito IA de Gamer Once Gamer Always, tu asistente especializado en gaming y tecnología. ¿En qué puedo ayudarte hoy? 🎮",
        sender: "bot",
        isTyping: false,
      },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón Flotante */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 300);
          }}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 z-50 animate-pulse"
          style={{ zIndex: 9998 }}
        >
          <MessageCircle size={28} />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
            IA
          </div>
        </button>
      )}

      {/* Ventana de Chat */}
      {isOpen && (
        <div
          ref={chatbotRef}
          className={`fixed bg-gray-800 rounded-xl shadow-2xl border border-gray-600 transition-all duration-300 overflow-hidden ${
            isMinimized ? "w-80 h-12" : "w-96 h-[500px]"
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? "grabbing" : "default",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            ref={dragRef}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-xl cursor-grab active:cursor-grabbing flex items-center justify-between"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bot size={20} />
                <div className="absolute -top-1 -right-1 bg-green-400 rounded-full h-3 w-3"></div>
              </div>
              <span className="font-semibold">Gamercito IA</span>
              <div className="text-xs bg-blue-500 px-2 py-1 rounded-full">Gaming Expert</div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearHistory}
                className="hover:bg-blue-700 p-1 rounded transition-colors"
                title="Limpiar historial"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-blue-700 p-1 rounded transition-colors"
              >
                <Minimize2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-purple-700 p-1 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Área de Mensajes */}
              <div className="h-[calc(100%-112px)] overflow-y-auto bg-gray-900 p-4 chat-scroll">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                            : "bg-gray-700 text-gray-100 border border-gray-600 rounded-bl-none shadow-sm"
                        }`}
                      >
                        {message.sender === "bot" && message.isTyping && (
                          <div className="flex space-x-1 mb-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        )}
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                            {formatChatbotResponse(
                              message.text.replace(/\\n/g, "\n")
                            )}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-600 bg-gray-800 rounded-b-xl">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Pregúntame sobre gaming y tecnología..."
                    className="flex-1 px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-700 text-white placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default GamercitoIA;
