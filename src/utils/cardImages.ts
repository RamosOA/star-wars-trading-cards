import type { AlbumSection, Card } from '../types';

// Función para generar colores hexadecimales determinísticos basados en un string
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash) % 360;
  const saturation = 65 + (Math.abs(hash >> 8) % 35); // 65-100%
  const lightness = 45 + (Math.abs(hash >> 16) % 20); // 45-65%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Generar gradiente único para cada carta
function generateCardGradient(name: string, section: AlbumSection): string {
  const color1 = stringToColor(name);
  const color2 = stringToColor(name + section);
  
  return `linear-gradient(135deg, ${color1}, ${color2})`;
}

// Iconos SVG temáticos para cada sección
const SECTION_ICONS = {
  movies: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
    <path d="M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V4H18M4,18L13.5,9.5L17.5,13.5L20.5,10.5L22,12V18H4Z"/>
  </svg>`,
  
  characters: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
  </svg>`,
  
  starships: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
    <path d="M6,2L4,6V8H2V10H4L6,14V16H8V14L10,10H12L14,14V16H16V14L18,10H20V8H18V6L16,2H14L12,6L10,2H6Z"/>
  </svg>`
};

// Generar patrón geométrico único para cada carta
function generatePattern(id: number): string {
  const patterns = [
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="transparent"/><circle cx="50" cy="50" r="20" fill="rgba(255,255,255,0.1)"/></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="transparent"/><rect x="25" y="25" width="50" height="50" fill="rgba(255,255,255,0.1)" transform="rotate(45 50 50)"/></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="transparent"/><polygon points="50,10 90,90 10,90" fill="rgba(255,255,255,0.1)"/></svg>',
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="transparent"/><path d="M50,20 L80,50 L50,80 L20,50 Z" fill="rgba(255,255,255,0.1)"/></svg>'
  ];
  
  return patterns[id % patterns.length];
}

// Generar avatar estilo Star Wars para las cartas
export function generateCardAvatar(card: Card): {
  backgroundImage: string;
  iconSvg: string;
  pattern: string;
} {
  const gradient = generateCardGradient(card.name, card.section);
  const icon = SECTION_ICONS[card.section];
  const pattern = generatePattern(card.id);
  
  return {
    backgroundImage: gradient,
    iconSvg: icon,
    pattern
  };
}

// URLs de imágenes placeholder de alta calidad temáticas
export const PLACEHOLDER_IMAGES = {
  movies: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop', // Espacio
    'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop', // Galaxia
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=600&fit=crop', // Nebulosa
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', // Estrellas
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop', // Planeta
    'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&h=600&fit=crop'  // Cosmos
  ],
  
  characters: [
    'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400&h=600&fit=crop', // Silueta humana
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', // Figura en espacio
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=600&fit=crop', // Astronauta
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=400&h=600&fit=crop'  // Robot/Android
  ],
  
  starships: [
    'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop', // Nave espacial
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&h=600&fit=crop', // Tecnología
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', // Futurista
    'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&h=600&fit=crop'  // Nave
  ]
};

// Obtener imagen placeholder para una carta específica
export function getCardPlaceholderImage(card: Card): string {
  const sectionImages = PLACEHOLDER_IMAGES[card.section];
  const imageIndex = (card.id - 1) % sectionImages.length;
  return sectionImages[imageIndex];
}

// Generar datos completos de imagen para una carta
export function generateCardImageData(card: Card) {
  const avatar = generateCardAvatar(card);
  const placeholder = getCardPlaceholderImage(card);
  
  return {
    ...avatar,
    placeholderUrl: placeholder,
    hasImage: true // Siempre tenemos algún tipo de imagen
  };
}