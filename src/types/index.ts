/**
 * Estructura base para todos los recursos de la API de Star Wars
 */
export interface SWAPIResource {
  name: string;
  title?: string;
  url: string;
}

/**
 * Datos completos de una película de Star Wars
 * Incluye información narrativa y técnica de cada episodio
 */
export interface Movie extends SWAPIResource {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  image?: string;
}

/**
 * Datos completos de un personaje de Star Wars
 * Incluye características físicas y relaciones con otros elementos
 */
export interface Character extends SWAPIResource {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  image?: string;
}

/**
 * Datos completos de una nave espacial de Star Wars
 * Incluye especificaciones técnicas y capacidades operativas
 */
export interface Starship extends SWAPIResource {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: string[];
  films: string[];
  image?: string;
}

// Tipos específicos de la aplicación
export type CardCategory = 'special' | 'regular';
export type AlbumSection = 'movies' | 'characters' | 'starships';

export interface Card {
  id: number;
  name: string;
  section: AlbumSection;
  category: CardCategory;
  data: Movie | Character | Starship;
}

export interface Album {
  movies: (Card | null)[];
  characters: (Card | null)[];
  starships: (Card | null)[];
}

export interface EnvelopeConfig {
  movies: number;
  characters: number;
  starships: number;
}

export interface Envelope {
  id: string;
  cards: Card[];
  config: EnvelopeConfig;
  isAvailable: boolean;
  cooldownEndTime?: number;
}

export interface AlbumProgress {
  movies: number;
  characters: number;
  starships: number;
  total: number;
}