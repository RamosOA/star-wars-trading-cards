import { useEffect } from 'react';
import type { Card, Movie, Character, Starship } from '../types';

interface CardModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CardModal({ card, isOpen, onClose }: CardModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  const renderMovieDetails = (movie: Movie) => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-2xl font-star-wars text-yellow-400 mb-6">DATOS DE ARCHIVO</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Episodio:</span>
              <span className="font-star-wars text-white">{movie.episode_id}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Director:</span>
              <span className="font-body text-white">{movie.director}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Productor:</span>
              <span className="font-body text-white">{movie.producer}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Fecha de lanzamiento:</span>
              <span className="font-body text-white">{movie.release_date}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h5 className="text-2xl font-star-wars text-[#FFD23F] mb-6">REGISTRO DE LA EXPLOSIÓN</h5>
          <div className="bg-black/30 rounded-lg p-6 border border-[#FF6B35]/30">
            <p className="font-body text-gray-300 leading-relaxed text-justify">
              {movie.opening_crawl}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCharacterDetails = (character: Character) => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-2xl font-star-wars text-yellow-400 mb-6">PERFIL BIOLÓGICO</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Altura:</span>
              <span className="font-body text-white">{character.height} cm</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Peso:</span>
              <span className="font-body text-white">{character.mass} kg</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Color de cabello:</span>
              <span className="font-body text-white capitalize">{character.hair_color}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Color de piel:</span>
              <span className="font-body text-white capitalize">{character.skin_color}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-2xl font-star-wars text-yellow-400 mb-6">DATOS PERSONALES</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Color de ojos:</span>
              <span className="font-body text-white capitalize">{character.eye_color}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Año de nacimiento:</span>
              <span className="font-body text-white">{character.birth_year}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Género:</span>
              <span className="font-body text-white capitalize">{character.gender}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStarshipDetails = (starship: Starship) => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h4 className="text-2xl font-star-wars text-yellow-400 mb-6">ESPECIFICACIONES TÉCNICAS</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Modelo:</span>
              <span className="font-body text-white">{starship.model}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Fabricante:</span>
              <span className="font-body text-white">{starship.manufacturer}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Costo:</span>
              <span className="font-body text-white">{starship.cost_in_credits} créditos</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Longitud:</span>
              <span className="font-body text-white">{starship.length} metros</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Velocidad máxima:</span>
              <span className="font-body text-white">{starship.max_atmosphering_speed}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Clase de nave:</span>
              <span className="font-body text-white">{starship.starship_class}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-2xl font-star-wars text-yellow-400 mb-6">CAPACIDADES OPERACIONALES</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Tripulación:</span>
              <span className="font-body text-white">{starship.crew}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
              <span className="font-body text-blue-400">Pasajeros:</span>
              <span className="font-body text-white">{starship.passengers}</span>
            </div>
            {starship.cargo_capacity && (
              <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                <span className="font-body text-blue-400">Capacidad de carga:</span>
                <span className="font-body text-white">{starship.cargo_capacity}</span>
              </div>
            )}
            {starship.consumables && (
              <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                <span className="font-body text-blue-400">Consumibles:</span>
                <span className="font-body text-white">{starship.consumables}</span>
              </div>
            )}
            {starship.hyperdrive_rating && (
              <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                <span className="font-body text-blue-400">Hiperimpulsor:</span>
                <span className="font-body text-white">Clase {starship.hyperdrive_rating}</span>
              </div>
            )}
            {starship.MGLT && (
              <div className="flex justify-between items-center border-b border-gray-700/50 pb-2">
                <span className="font-body text-blue-400">MGLT:</span>
                <span className="font-body text-white">{starship.MGLT}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => {
    switch (card.section) {
      case 'movies':
        return renderMovieDetails(card.data as Movie);
      case 'characters':
        return renderCharacterDetails(card.data as Character);
      case 'starships':
        return renderStarshipDetails(card.data as Starship);
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center p-4 z-50">
      <div className="modal-content max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl">
        <div className="sticky top-0 modal-content border-b border-yellow-400/30 p-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {/* Imagen de la carta en el modal */}
            {card.data && 'image' in card.data && card.data.image ? (
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-yellow-400 flex-shrink-0">
                <img 
                  src={card.data.image as string} 
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-800 border-3 border-gray-600 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">
                  {card.section === 'movies' ? '🎬' : card.section === 'characters' ? '👤' : '🚀'}
                </span>
              </div>
            )}
            
            <div>
              <h3 className="text-3xl font-star-wars text-yellow-400 text-glow mb-3">
                {card.name}
              </h3>
              <div className="flex items-center space-x-6">
                <span className={`px-4 py-2 rounded-full text-sm font-star-wars ${
                  card.category === 'special' 
                    ? 'bg-yellow-400 text-black font-bold' 
                    : 'bg-gray-700 text-white'
                }`}>
                  {card.category === 'special' ? 'ARCHIVO ESPECIAL' : 'ARCHIVO REGULAR'}
                </span>
                <span className="text-lg text-blue-400 font-star-wars">ID: #{card.id}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-yellow-400 text-3xl font-bold transition-colors duration-300 hover:scale-110"
          >
            ✕
          </button>
        </div>
        
        <div className="p-8">
          {renderDetails()}
        </div>
      </div>
    </div>
  );
}