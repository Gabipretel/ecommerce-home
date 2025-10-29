# 🎮 Gamer Once, Gamer Always - Ecommerce

**Alumno:** Alan Gabriel Pretel

## 📋 Descripción del Proyecto

**Gamer Once, Gamer Always** es una plataforma de ecommerce especializada en productos gaming y tecnología. Este proyecto ofrece una experiencia completa de compra online con funcionalidades avanzadas tanto para usuarios como para administradores.

## 🚀 ¿Qué ofrece el proyecto?

### Para los Usuarios:
- **Catálogo de Productos Gaming**: Navegación por categorías especializadas (Procesadores, Placas de Video, Memorias RAM, Mothers, Fuentes, Gabinetes, Monitores, Notebooks)
- **Sistema de Carrito Inteligente**: Gestión completa del carrito con validación de stock en tiempo real
- **Búsqueda y Filtros Avanzados**: Filtrado por precio, marca, categoría y búsqueda por texto
- **Proceso de Checkout**: Sistema de reserva con confirmación por email
- **Chatbot IA Integrado**: "Gamercito IA" - Asistente virtual especializado en gaming y tecnología
- **Autenticación de Usuarios**: Registro y login seguro con Firebase
- **Interfaz Responsive**: Diseño moderno y adaptable a todos los dispositivos

### Para los Administradores:
- **Panel de Administración Completo**: Dashboard con estadísticas en tiempo real
- **Gestión de Productos**: CRUD completo con subida de imágenes y galerías
- **Gestión de Categorías**: Administración de categorías con iconos personalizados
- **Gestión de Usuarios**: Control total sobre usuarios registrados
- **Sistema de Filtros**: Herramientas avanzadas para administrar el inventario

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + Vite
- **Routing**: React Router v7
- **Styling**: TailwindCSS + Material-UI
- **Base de Datos**: Firebase Firestore
- **Autenticación**: Firebase Auth
- **Iconografía**: Lucide React + Material Icons
- **Carrusel**: Swiper.js
- **HTTP Client**: Axios
- **Markdown**: React Markdown

## ✨ Funcionalidades Principales

### 🛒 Sistema de Ecommerce
- Catálogo de productos con imágenes y descripciones detalladas
- Carrito de compras persistente (localStorage)
- Validación de stock en tiempo real
- Sistema de reservas con notificación por email
- Filtros por precio, categoría y marca
- Búsqueda inteligente de productos

### 🤖 Inteligencia Artificial
- **Gamercito IA**: Chatbot especializado en gaming
- Historial de conversaciones persistente
- Respuestas contextuales sobre productos y tecnología
- Interfaz de chat moderna y arrastrable

### 👨‍💼 Panel Administrativo
- Dashboard con métricas en tiempo real
- Gestión completa de productos (CRUD)
- Administración de categorías e iconos
- Control de usuarios y permisos
- Subida de imágenes con preview
- Filtros avanzados para administración

### 🔐 Seguridad y Autenticación
- Autenticación con Firebase
- Rutas protegidas por roles (usuario/admin)
- Validación de permisos en tiempo real
- Gestión segura de sesiones

### 📱 Experiencia de Usuario
- Diseño responsive y moderno
- Animaciones y transiciones suaves
- Notificaciones toast informativas
- Modales de confirmación
- Loading states y feedback visual

## 🎯 Casos de Uso

1. **Comprador Gaming**: Busca componentes para armar su PC, utiliza filtros para encontrar productos compatibles, consulta al chatbot sobre especificaciones técnicas y realiza reservas.

2. **Administrador de Tienda**: Gestiona el inventario, actualiza precios, agrega nuevos productos con imágenes, monitorea estadísticas de ventas y usuarios.

3. **Usuario Casual**: Navega el catálogo, compara productos, utiliza el carrito para planificar compras futuras y recibe asesoramiento del chatbot IA.

## 🚀 Instalación y Uso

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Instalar dependencias
npm install

# Configurar Firebase (crear archivo de configuración)
# src/firebase/config.js

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── admin/          # Componentes del panel admin
│   └── ui/             # Componentes de interfaz
├── pages/              # Páginas principales
│   └── admin/          # Páginas administrativas
├── context/            # Contextos de React (Auth, Cart, etc.)
├── services/           # Servicios de API y Firebase
├── hooks/              # Hooks personalizados
├── utils/              # Utilidades y helpers
└── styles/             # Estilos globales
```

## 🎮 Demo y Características Destacadas

- **Interfaz Gaming**: Diseño inspirado en la estética gamer con gradientes y efectos visuales
- **Performance Optimizada**: Carga rápida y navegación fluida
- **Escalabilidad**: Arquitectura preparada para crecimiento
- **Mantenibilidad**: Código limpio y bien documentado

---

*Desarrollado con ❤️ para la comunidad gaming por Alan Gabriel Pretel*
