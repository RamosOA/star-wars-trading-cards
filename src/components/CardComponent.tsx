import { useState } from 'react';
import type { Card } from '../types';
import { getSectionName, getCategoryName } from '../utils/gameLogic';

interface CardComponentProps {
  card: Card;
  isInAlbum: boolean;
  onAdd?: () => void;
  onDiscard?: () => void;
  onClick?: () => void;
  showActions?: boolean;
}

export function CardComponent({ 
  card, 
  isInAlbum, 
  onAdd, 
  onDiscard, 
  onClick, 
  showActions = true 
}: CardComponentProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  /**
   * Genera el diseño visual específico para cada tipo de carta
   * Define colores, iconos y efectos únicos por sección
   */
  const getCardDesign = () => {
    const designs = {
      movies: {
        gradient: 'from-amber-500/30 via-orange-500/20 to-red-600/30',
        accent: 'amber-400',
        icon: '🎬',
        glowColor: 'rgba(251, 191, 36, 0.6)',
        title: 'EPISODIO'
      },
      characters: {
        gradient: 'from-blue-500/30 via-cyan-500/20 to-teal-600/30',
        accent: 'blue-400',
        icon: '👤',
        glowColor: 'rgba(59, 130, 246, 0.6)',
        title: 'PERSONAJE'
      },
      starships: {
        gradient: 'from-slate-500/30 via-gray-500/20 to-zinc-600/30',
        accent: 'slate-400',
        icon: '🚀',
        glowColor: 'rgba(148, 163, 184, 0.6)',
        title: 'NAVE ESTELAR'
      }
    };
    
    return designs[card.section] || designs.characters;
  };

  /**
   * Determina las clases de animación según la rareza de la carta
   * Las cartas especiales tienen animaciones más llamativas
   */
  const getAnimationClasses = () => {
    const baseAnimation = 'transform transition-all duration-500 hover:scale-105';
    
    if (card.category === 'special') {
      return `${baseAnimation} hover:rotate-1 animate-pulse-slow special-glow`;
    }
    
    return `${baseAnimation} hover:-rotate-1`;
  };

  /**
   * Obtiene la URL de imagen con fallback en caso de error
   */
  const getImageUrl = () => {
    if (card.data && 'image' in card.data) {
      return card.data.image as string;
    }
    return '';
  };
  
  const design = getCardDesign();
  const animationClasses = getAnimationClasses();
  const imageUrl = getImageUrl();
  
  return (
    <div 
      className={`
        ${card.category === 'special' ? 'card-special' : 'card-regular'}
        ${animationClasses}
        rounded-xl overflow-hidden shadow-2xl card-entrance smooth-transform
        ${onClick ? 'cursor-pointer' : ''}
        relative group aspect-card w-full max-w-xs mx-auto flex flex-col
      `}
      onClick={onClick}
      data-card-id={card.id}
    >
      {/* Contenedor de imagen principal */}
      <div className={`relative flex-1 min-h-0 overflow-hidden bg-gradient-to-br ${design.gradient}`}>
        
        {/* Imagen de la carta */}
        {imageUrl && !imageError ? (
          <>
            <img
              src={imageUrl}
              alt={card.name}
              className={`
                w-full h-full object-cover object-center transition-all duration-700
                ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                group-hover:scale-110 group-hover:brightness-110
              `}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            
            {/* Overlay de gradiente para mejor legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
          </>
        ) : (
          /* Fallback cuando no hay imagen disponible */
          <>
            {/* Patrón geométrico de fondo */}
            <div className="absolute inset-0 opacity-30">
              <div className="w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent geometric-pattern" />
            </div>
            
            {/* Icono central grande como respaldo visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-8xl opacity-20 text-${design.accent} group-hover:opacity-30 group-hover:scale-110 transition-all duration-500`}>
                {design.icon}
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
          </>
        )}

        {/* Efectos especiales para cartas raras */}
        {card.category === 'special' && (
          <>
            {/* Brillo dorado animado para cartas especiales */}
            <div className="absolute inset-0 opacity-40 animate-pulse special-card-glow" />
            
            {/* Partículas flotantes para cartas especiales */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-300 rounded-full animate-twinkle" />
              <div className="absolute top-8 right-4 w-1 h-1 bg-yellow-300 rounded-full animate-twinkle delay-300" />
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-yellow-300 rounded-full animate-twinkle delay-700" />
            </div>
          </>
        )}
        {/* Información de cabecera flotante sobre la imagen */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          {/* Número identificador de la carta */}
          <span className={`
            text-xs font-star-wars px-3 py-1 rounded-full backdrop-blur-sm
            ${card.category === 'special' 
              ? 'bg-yellow-400/90 text-black font-bold shadow-lg' 
              : 'bg-gray-900/80 text-white border border-gray-600/50'
            }
          `}>
            #{card.id}
          </span>
          
          {/* Indicador de rareza de la carta */}
          <span className={`
            text-xs font-star-wars px-3 py-1 rounded-full backdrop-blur-sm
            ${card.category === 'special' 
              ? 'bg-yellow-400/90 text-black font-bold shadow-lg animate-pulse' 
              : 'bg-gray-900/80 text-white border border-gray-600/50'
            }
          `}>
            {getCategoryName(card.category)}
          </span>
        </div>

        {/* Líneas decorativas para mejorar la estética */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${design.accent} to-transparent opacity-60`} />
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${design.accent} to-transparent opacity-60`} />
      </div>
      
      {/* Sección de información de la carta */}
      <div className="p-3 relative flex flex-col bg-gray-900/90 min-h-0">
        {/* Título principal de la carta */}
        <h3 className={`
          text-base font-bold mb-2 line-clamp-2 font-star-wars text-center
          ${card.category === 'special' 
            ? 'text-yellow-300 drop-shadow-lg' 
            : 'text-gray-100'
          }
        `}>
          {card.name}
        </h3>
        
        {/* Indicador del tipo de contenido */}
        <div className={`
          text-xs font-star-wars mb-3 px-3 py-1 rounded-full text-center border
          ${card.category === 'special' 
            ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50 shadow-md' 
            : `bg-gray-800/50 text-${design.accent} border-${design.accent}/30`
          }
        `}>
          {design.title}
        </div>
        
        {/* Categoría de la sección */}
        <p className={`
          text-xs font-body mb-2 text-center font-medium
          ${card.category === 'special' 
            ? 'text-yellow-200' 
            : 'text-gray-300'
          }
        `}>
          {getSectionName(card.section)}
        </p>
        
        {/* Datos técnicos específicos según el tipo de carta */}
        <div className={`
          text-xs mb-2 font-body text-center flex-shrink-0
          ${card.category === 'special' 
            ? 'text-yellow-100/90' 
            : 'text-gray-400'
          }
        `}>
          {/* Información específica para películas */}
          {card.section === 'movies' && 'episode_id' in card.data && (
            <div className="flex justify-center items-center space-x-2">
              <span>⭐</span>
              <span>EPISODIO {card.data.episode_id}</span>
              <span>⭐</span>
            </div>
          )}
          
          {/* Información específica para personajes */}
          {card.section === 'characters' && 'height' in card.data && (
            <div className="flex justify-center items-center space-x-2">
              <span>👤</span>
              <span>Altura: {card.data.height}</span>
            </div>
          )}
          
          {/* Información específica para naves espaciales */}
          {card.section === 'starships' && 'starship_class' in card.data && (
            <div className="flex justify-center items-center space-x-2">
              <span>🚀</span>
              <span className="capitalize">{card.data.starship_class}</span>
            </div>
          )}
        </div>
        
        {/* Botones de acción en la parte inferior */}
        {showActions && (
          <div className="mt-auto pt-3 flex-shrink-0">
            {isInAlbum ? (
              /* Botón para descartar carta ya poseída */
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDiscard?.();
                }}
                className={`
                  w-full py-2 px-4 rounded-lg text-sm font-star-wars
                  btn-smooth
                  ${card.category === 'special' 
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/25' 
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg hover:shadow-red-500/25'
                  }
                `}
              >
                DESCARTAR
              </button>
            ) : (
              /* Botón para agregar nueva carta al álbum */
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd?.();
                }}
                className={`
                  w-full py-2 px-4 rounded-lg text-sm font-star-wars
                  btn-smooth
                  ${card.category === 'special' 
                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black font-bold shadow-lg hover:shadow-yellow-500/25' 
                    : 'bg-green-600 hover:bg-green-500 text-white shadow-lg hover:shadow-green-500/25'
                  }
                `}
              >
                AGREGAR
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Efectos visuales adicionales en hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {/* Efecto de barrido luminoso */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {/* Brillo adicional para cartas especiales */}
        {card.category === 'special' && (
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/10 via-transparent to-yellow-400/10 rounded-xl" />
        )}
      </div>

      {/* Borde brillante animado para cartas especiales */}
      {card.category === 'special' && (
        <div className="absolute inset-0 rounded-xl border-2 border-yellow-400/50 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}