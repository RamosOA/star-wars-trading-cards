import type { Album, Card } from '../types';
import { VALID_IDS } from '../services/swapi';

const STORAGE_KEYS = {
  album: 'starwars-album',
  envelopes: 'starwars-envelopes-cooldown'
} as const;

/**
 * Convierte un ID de la API a un índice de array del álbum
 * Para películas y personajes: ID directo - 1 (consecutivos)
 * Para naves: mapea el ID a su posición en la lista de IDs válidos
 */
function getAlbumIndex(section: 'movies' | 'characters' | 'starships', id: number): number {
  switch (section) {
    case 'movies':
    case 'characters':
      return id - 1; // IDs consecutivos empezando en 1
    case 'starships': {
      // Las naves tienen IDs no consecutivos, mapear a índice secuencial
      const starshipIndex = VALID_IDS.starships.indexOf(id);
      return starshipIndex; // Retorna -1 si no se encuentra (ID inválido)
    }
    default:
      return -1;
  }
}

// Inicializar álbum vacío
export function createEmptyAlbum(): Album {
  return {
    movies: new Array(6).fill(null),
    characters: new Array(82).fill(null),
    starships: new Array(36).fill(null)
  };
}

// Guardar álbum en localStorage
export function saveAlbum(album: Album): void {
  try {
    localStorage.setItem(STORAGE_KEYS.album, JSON.stringify(album));
  } catch (error) {
    console.error('Error saving album to localStorage:', error);
  }
}

// Cargar álbum desde localStorage
export function loadAlbum(): Album {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.album);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading album from localStorage:', error);
  }
  return createEmptyAlbum();
}

// Verificar si una carta ya existe en el álbum
export function hasCard(album: Album, card: Card): boolean {
  const section = album[card.section];
  const index = getAlbumIndex(card.section, card.id);
  
  if (index >= 0 && index < section.length) {
    return section[index] !== null;
  }
  
  return false;
}

// Agregar carta al álbum
export function addCardToAlbum(album: Album, card: Card): Album {
  const newAlbum = { ...album };
  const section = [...newAlbum[card.section]];
  const index = getAlbumIndex(card.section, card.id);
  
  if (index >= 0 && index < section.length && !section[index]) {
    section[index] = card;
    newAlbum[card.section] = section;
  }
  
  return newAlbum;
}

// Remover carta del álbum
export function removeCardFromAlbum(album: Album, card: Card): Album {
  const newAlbum = { ...album };
  const section = [...newAlbum[card.section]];
  const index = getAlbumIndex(card.section, card.id);
  
  if (index >= 0 && index < section.length && section[index]) {
    section[index] = null;
    newAlbum[card.section] = section;
  }
  
  return newAlbum;
}

// Obtener estadísticas del álbum
export function getAlbumStats(album: Album) {
  const moviesCount = album.movies.filter(card => card !== null).length;
  const charactersCount = album.characters.filter(card => card !== null).length;
  const starshipsCount = album.starships.filter(card => card !== null).length;
  const totalCards = moviesCount + charactersCount + starshipsCount;
  const totalPossible = 6 + 82 + 36; // Total de cartas posibles
  
  return {
    movies: { collected: moviesCount, total: 6 },
    characters: { collected: charactersCount, total: 82 },
    starships: { collected: starshipsCount, total: 36 },
    overall: { collected: totalCards, total: totalPossible, percentage: Math.round((totalCards / totalPossible) * 100) }
  };
}

// Guardar cooldowns de sobres
export function saveEnvelopeCooldowns(cooldowns: Record<string, number>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.envelopes, JSON.stringify(cooldowns));
  } catch (error) {
    console.error('Error saving envelope cooldowns:', error);
  }
}

// Cargar cooldowns de sobres
export function loadEnvelopeCooldowns(): Record<string, number> {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.envelopes);
    if (saved) {
      const cooldowns = JSON.parse(saved);
      const now = Date.now();
      
      // Filtrar cooldowns expirados
      const activeCooldowns: Record<string, number> = {};
      for (const [id, endTime] of Object.entries(cooldowns)) {
        if ((endTime as number) > now) {
          activeCooldowns[id] = endTime as number;
        }
      }
      
      return activeCooldowns;
    }
  } catch (error) {
    console.error('Error loading envelope cooldowns:', error);
  }
  return {};
}

// Limpiar todos los cooldowns
export function clearEnvelopeCooldowns(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.envelopes);
  } catch (error) {
    console.error('Error clearing envelope cooldowns:', error);
  }
}