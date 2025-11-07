import type { Movie, Character, Starship } from '../types';

/**
 * Configuración de URLs para obtener datos e imágenes de Star Wars
 */
const SWAPI_BASE_URL = 'https://swapi.dev/api';
const TIMEOUT_MS = 5000;

/**
 * Lista de IDs válidos que realmente existen en la API de SWAPI
 * Esto previene errores 404 al generar cartas aleatorias
 */
const VALID_IDS = {
  films: [1, 2, 3, 4, 5, 6],
  people: Array.from({ length: 82 }, (_, i) => i + 1),
  starships: [2, 3, 5, 9, 10, 11, 12, 13, 15, 17, 21, 22, 23, 27, 28, 29, 31, 39, 40, 41, 43, 47, 48, 49, 52, 58, 59, 61, 63, 64, 65, 66, 68, 74, 75, 77]
};

/**
 * Realiza peticiones HTTP a la API de SWAPI con control de timeout
 * Utiliza AbortController para cancelar peticiones que demoren demasiado
 */
async function fetchSWAPI<T>(endpoint: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  try {
    const response = await fetch(`${SWAPI_BASE_URL}${endpoint}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudieron obtener los datos`);
    }
    
    return response.json();
    
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La conexión tardó demasiado en responder');
    }
    throw error;
  }
}

/**
 * Genera la URL de imagen correcta según el tipo de contenido, ID y nombre
 * Usa fuentes reales cuando están disponibles y genera imágenes temáticas para el resto
 */
function getImageUrl(section: 'films' | 'people' | 'starships', id: number, name?: string): string {
  switch (section) {
    case 'people': {
      // Para personajes, usamos la fuente real que sabemos funciona
      return `https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${id}.jpg`;
    }
    
    case 'films': {
      // Para películas, generamos imágenes temáticas con colores dorados de Star Wars
      const filmText = name ? 
        name.replace(/\s+/g, '+').substring(0, 20) : 
        `Episode+${id}`;
      return `https://dummyimage.com/300x400/000000/FFD700.png&text=STAR+WARS%0A${filmText}`;
    }
    
    case 'starships': {
      // Para naves, usamos colores azules espaciales con el nombre real
      const shipText = name ? 
        name.replace(/\s+/g, '+').substring(0, 18) : 
        `Starship+${id}`;
      return `https://dummyimage.com/300x400/1E3A8A/FFFFFF.png&text=STARSHIP%0A${shipText}`;
    }
    
    default:
      return '';
  }
}

/**
 * Verifica si un ID específico existe en SWAPI para evitar errores 404
 * Esencial para la generación aleatoria de cartas válidas
 */
export function isValidId(section: 'films' | 'people' | 'starships', id: number): boolean {
  return VALID_IDS[section].includes(id);
}

/**
 * Obtiene datos completos de una película incluyendo su imagen promocional
 * Las películas usan imágenes temáticas generadas con el título real
 */
export async function getMovie(id: number): Promise<Movie & { image: string }> {
  const movieData = await fetchSWAPI<Movie>(`/films/${id}/`);
  return {
    ...movieData,
    image: getImageUrl('films', id, movieData.title)
  };
}

/**
 * Obtiene datos completos de un personaje incluyendo su imagen de perfil
 * Los personajes usan retratos reales del Visual Guide
 */
export async function getCharacter(id: number): Promise<Character & { image: string }> {
  const characterData = await fetchSWAPI<Character>(`/people/${id}/`);
  return {
    ...characterData,
    image: getImageUrl('people', id, characterData.name)
  };
}

/**
 * Obtiene datos completos de una nave espacial incluyendo su imagen técnica
 * Las naves usan imágenes temáticas generadas con el nombre real
 */
export async function getStarship(id: number): Promise<Starship & { image: string }> {
  const starshipData = await fetchSWAPI<Starship>(`/starships/${id}/`);
  return {
    ...starshipData,
    image: getImageUrl('starships', id, starshipData.name)
  };
}

/**
 * Obtiene la lista completa de películas de Star Wars
 * Útil para llenar el catálogo inicial o hacer búsquedas
 */
export async function getAllMovies(): Promise<Movie[]> {
  const response = await fetchSWAPI<{ results: Movie[] }>('/films/');
  return response.results;
}

/**
 * Obtiene todos los personajes disponibles usando paginación automática
 * SWAPI devuelve los datos en páginas, esta función las recorre todas
 */
export async function getAllCharacters(): Promise<Character[]> {
  const characters: Character[] = [];
  let nextUrl = '/people/';
  
  while (nextUrl) {
    const response = await fetchSWAPI<{ 
      results: Character[], 
      next: string | null 
    }>(nextUrl.replace(SWAPI_BASE_URL, ''));
    
    characters.push(...response.results);
    nextUrl = response.next ? response.next.replace(SWAPI_BASE_URL, '') : '';
  }
  
  return characters;
}

/**
 * Obtiene todas las naves espaciales disponibles usando paginación automática
 * Similar a getAllCharacters pero para vehículos espaciales
 */
export async function getAllStarships(): Promise<Starship[]> {
  const starships: Starship[] = [];
  let nextUrl = '/starships/';
  
  while (nextUrl) {
    const response = await fetchSWAPI<{ 
      results: Starship[], 
      next: string | null 
    }>(nextUrl.replace(SWAPI_BASE_URL, ''));
    
    starships.push(...response.results);
    nextUrl = response.next ? response.next.replace(SWAPI_BASE_URL, '') : '';
  }
  
  return starships;
}

/**
 * Extrae el ID numérico de una URL de SWAPI
 * Ejemplo: "https://swapi.dev/api/people/1/" devuelve 1
 */
export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/$/);
  return match ? parseInt(match[1], 10) : 0;
}

export { VALID_IDS };