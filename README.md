# 🌟 Star Wars Trading Cards Collection

> **Aplicación SPA de colección de láminas digitales del universo Star Wars**

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.5-38B2AC.svg)](https://tailwindcss.com/)

## 🚀 Demo en Vivo

**🔗 URL del Deploy:** [Será actualizada tras el deploy]  
**📁 Repositorio:** [GitHub Repository Link]

## 📋 Descripción

Esta es una **Single Page Application (SPA)** desarrollada como prueba técnica para un puesto de desarrollador frontend. La aplicación permite a los usuarios coleccionar láminas digitales del universo Star Wars consumiendo datos de la API pública SWAPI.

## 🌟 Características

### Sistema de Álbum Digital
- **3 secciones principales**: Películas (6), Personajes (82), Naves (36)
- **Categorías de láminas**: Especiales y Regulares
- **Persistencia local**: Progreso guardado automáticamente
- **Estadísticas detalladas**: Progreso por sección y general

### Mecánica de Sobres
- **4 sobres disponibles** con sistema de cooldown de 1 minuto
- **2 configuraciones aleatorias**:
  - Configuración 1: 1 película + 3 personajes + 1 nave
  - Configuración 2: 3 personajes + 2 naves
- **Cartas aleatorias** generadas dinámicamente desde SWAPI

### Clasificación de Láminas Especiales
- **Películas**: Todas las 6 películas son especiales
- **Personajes**: Los primeros 20 personajes son especiales
- **Naves**: Las primeras 10 naves son especiales

## 🛠 Tecnologías Utilizadas

- **React 18** con TypeScript
- **Vite** para el bundling y desarrollo
- **React Router** para la navegación
- **Tailwind CSS** para el styling
- **SWAPI** (Star Wars API) para los datos
- **Local Storage** para la persistencia

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Instalación
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173 (o 5174 si 5173 está ocupado)
```

### Scripts Disponibles
```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Genera build de producción
npm run preview      # Vista previa del build de producción

# Linting
npm run lint         # Ejecuta ESLint para revisar el código
```

## 📱 Uso de la Aplicación

### Navegación Principal
1. **Obtener Láminas**: Página para abrir sobres y obtener cartas
2. **Mi Álbum**: Visualizar las cartas coleccionadas

### Sistema de Sobres
1. Selecciona uno de los 4 sobres disponibles
2. El sobre se abre mostrando 5 cartas aleatorias
3. Los demás sobres entran en cooldown de 1 minuto
4. Decide si agregar cada carta al álbum o descartarla
5. Cierra el sobre para seleccionar otro

### Álbum de Colección
- Navega entre las 3 secciones (Películas, Personajes, Naves)
- Visualiza el progreso de colección con barras de progreso
- Haz clic en cartas coleccionadas para ver detalles completos
- Las posiciones vacías muestran el número de la carta faltante

## 🎨 Diseño y UX

### Temática Star Wars
- Esquema de colores inspirado en la saga (negro, amarillo, azul)
- Gradientes especiales para cartas especiales vs regulares
- Animaciones y efectos hover para mejor experiencia

### Responsive Design
- Adaptado para dispositivos móviles, tablets y escritorio
- Grid system flexible para diferentes tamaños de pantalla
- Interfaz táctil amigable

## 📊 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navigation.tsx   # Barra de navegación
│   ├── CardComponent.tsx # Componente de carta
│   ├── EnvelopeComponent.tsx # Componente de sobre
│   └── CardModal.tsx    # Modal para detalles de carta
├── pages/              # Páginas principales
│   ├── EnvelopesPage.tsx # Página de sobres
│   └── AlbumPage.tsx    # Página del álbum
├── hooks/              # Custom hooks
│   ├── useAlbum.ts     # Hook para manejo del álbum
│   └── useEnvelopeCooldown.ts # Hook para cooldowns
├── services/           # Servicios externos
│   └── swapi.ts        # Integración con Star Wars API
├── utils/              # Utilidades
│   ├── gameLogic.ts    # Lógica del juego
│   └── storage.ts      # Manejo de localStorage
├── types/              # Definiciones de tipos TypeScript
│   └── index.ts        # Tipos principales
└── App.tsx             # Componente principal
```

## 🔧 API y Datos

### Star Wars API (SWAPI)
- **Base URL**: https://swapi.dev/api
- **Endpoints utilizados**:
  - `/films/` - Películas
  - `/people/` - Personajes  
  - `/starships/` - Naves espaciales

### Manejo de Errores
- Reintentos automáticos para peticiones fallidas
- Estados de carga y error en la UI
- Fallbacks para datos no disponibles

## 💾 Persistencia de Datos

### Local Storage
- **Álbum de usuario**: Cartas coleccionadas por sección
- **Cooldowns de sobres**: Tiempos de enfriamiento activos
- **Sincronización automática**: Guardado en tiempo real

## 📈 Requerimientos Técnicos Cumplidos

### ✅ Funcionalidades Implementadas
- [x] SPA con React.js y TypeScript
- [x] Consumo de SWAPI para datos dinámicos
- [x] Álbum digital con 3 secciones (6 películas, 82 personajes, 36 naves)
- [x] Sistema de láminas especiales vs regulares
- [x] Menú de navegación con 2 opciones principales
- [x] Sistema de 4 sobres con cooldown de 1 minuto
- [x] 2 configuraciones aleatorias de sobres (5 cartas cada uno)
- [x] Consultas dinámicas a la API según configuración
- [x] Botones "Agregar al álbum" / "Descartar" según estado
- [x] Información completa de cartas (categoría, sección, número, nombre)
- [x] Visualización de álbum por secciones con posiciones numeradas
- [x] Modal de detalles completos al hacer clic en cartas coleccionadas
- [x] Persistencia en localStorage
- [x] Contador visual de cooldown que persiste entre navegación

### 🛠 Tecnologías y Herramientas
- [x] React.js con hooks y context
- [x] TypeScript para type safety
- [x] Vite para desarrollo y build
- [x] Tailwind CSS para styling responsivo
- [x] React Router para navegación SPA
- [x] Control de versiones con Git
- [x] Estructura modular y escalable

## 👨‍💻 Desarrollo

Este proyecto fue desarrollado como prueba técnica siguiendo estrictamente las especificaciones proporcionadas, implementando todas las funcionalidades requeridas con las mejores prácticas de desarrollo frontend moderno.

---

**Desarrollado con ❤️ para la saga de Star Wars**