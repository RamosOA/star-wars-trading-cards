import type { AlbumSection, CardCategory, EnvelopeConfig } from '../types';
import { VALID_IDS } from '../services/swapi';

// Usar los IDs válidos de SWAPI
export const VALID_CARD_IDS = {
  movies: VALID_IDS.films,
  characters: VALID_IDS.people,
  starships: VALID_IDS.starships
} as const;

// Determinar si una lámina es especial
export function isSpecialCard(section: AlbumSection, id: number): CardCategory {
  switch (section) {
    case 'movies':
      // Todas las 6 películas son especiales
      return 'special';
    case 'characters':
      // Los primeros 20 personajes son especiales
      return id <= 20 ? 'special' : 'regular';
    case 'starships':
      // Las primeras 10 naves son especiales
      return id <= 10 ? 'special' : 'regular';
    default:
      return 'regular';
  }
}

// Generar ID aleatorio válido para una sección
export function getRandomId(section: AlbumSection): number {
  const validIds = VALID_CARD_IDS[section];
  return validIds[Math.floor(Math.random() * validIds.length)];
}

// Generar múltiples IDs únicos para una sección (evitar duplicados)
export function getRandomUniqueIds(section: AlbumSection, count: number): number[] {
  const validIds = [...VALID_CARD_IDS[section]]; // Crear copia
  const selectedIds: number[] = [];
  
  for (let i = 0; i < Math.min(count, validIds.length); i++) {
    const randomIndex = Math.floor(Math.random() * validIds.length);
    const selectedId = validIds.splice(randomIndex, 1)[0];
    selectedIds.push(selectedId);
  }
  
  return selectedIds;
}

// Configuraciones posibles para los sobres
const ENVELOPE_CONFIGS: EnvelopeConfig[] = [
  { movies: 1, characters: 3, starships: 1 }, // Configuración 1
  { movies: 0, characters: 3, starships: 2 }  // Configuración 2
];

// Obtener configuración aleatoria para sobre
export function getRandomEnvelopeConfig(): EnvelopeConfig {
  return ENVELOPE_CONFIGS[Math.floor(Math.random() * ENVELOPE_CONFIGS.length)];
}

// Generar IDs aleatorios para las cartas de un sobre (sin duplicados)
export function generateEnvelopeCards(config: EnvelopeConfig): Array<{ section: AlbumSection, id: number }> {
  const cards: Array<{ section: AlbumSection, id: number }> = [];

  // Agregar películas (sin duplicados)
  if (config.movies > 0) {
    const movieIds = getRandomUniqueIds('movies', config.movies);
    movieIds.forEach(id => cards.push({ section: 'movies', id }));
  }

  // Agregar personajes (sin duplicados)
  if (config.characters > 0) {
    const characterIds = getRandomUniqueIds('characters', config.characters);
    characterIds.forEach(id => cards.push({ section: 'characters', id }));
  }

  // Agregar naves (sin duplicados)
  if (config.starships > 0) {
    const starshipIds = getRandomUniqueIds('starships', config.starships);
    starshipIds.forEach(id => cards.push({ section: 'starships', id }));
  }

  // Mezclar las cartas aleatoriamente
  return shuffleArray(cards);
}

// Función para mezclar un array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Formatear tiempo restante para el cooldown
export function formatCooldownTime(milliseconds: number): string {
  const seconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `0:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Obtener el nombre de la sección en español
export function getSectionName(section: AlbumSection): string {
  switch (section) {
    case 'movies':
      return 'Películas';
    case 'characters':
      return 'Personajes';
    case 'starships':
      return 'Naves';
    default:
      return section;
  }
}

// Obtener el nombre de la categoría en español
export function getCategoryName(category: CardCategory): string {
  return category === 'special' ? 'Especial' : 'Regular';
}