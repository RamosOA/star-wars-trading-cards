import { useState, useEffect, useRef } from 'react';
import type { Card, AlbumSection } from '../types';
import { CardModal } from '../components/CardModal';
import { useAlbum } from '../hooks/useAlbum';
import { getSectionName } from '../utils/gameLogic';
import { VALID_IDS } from '../services/swapi';

export function AlbumPage() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeSection, setActiveSection] = useState<AlbumSection>('movies');
  const [announcementText, setAnnouncementText] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showSectionResetModal, setShowSectionResetModal] = useState<AlbumSection | null>(null);
  const sectionRefs = useRef<{ [key in AlbumSection]: HTMLDivElement | null }>({
    movies: null,
    characters: null,
    starships: null,
  });
  
  const { album, getStats, resetAlbum, resetSection } = useAlbum();
  const stats = getStats();

  // Anunciar cambios de sección para lectores de pantalla
  useEffect(() => {
    const sectionName = getSectionName(activeSection);
    const sectionStats = stats[activeSection];
    setAnnouncementText(
      `Sección ${sectionName} seleccionada. ${sectionStats.collected} de ${sectionStats.total} cartas recolectadas, ${Math.round((sectionStats.collected / sectionStats.total) * 100)}% completado.`
    );
  }, [activeSection, stats]);

  const sections: { key: AlbumSection; name: string; total: number }[] = [
    { key: 'movies', name: 'Películas', total: 6 },
    { key: 'characters', name: 'Personajes', total: 82 },
    { key: 'starships', name: 'Naves', total: 36 }
  ];

  const handleCardClick = (card: Card | null) => {
    if (card) {
      setSelectedCard(card);
    }
  };

  const handleCardKeyDown = (event: React.KeyboardEvent, card: Card | null) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(card);
    }
  };

  const handleSectionChange = (section: AlbumSection) => {
    setActiveSection(section);
    // Enfocar el contenido de la nueva sección
    const sectionElement = sectionRefs.current[section];
    if (sectionElement) {
      sectionElement.focus();
    }
  };

  const handleResetConfirm = () => {
    resetAlbum();
    setShowResetModal(false);
    setAnnouncementText('Álbum reiniciado completamente. Todas las cartas han sido eliminadas.');
  };

  const handleResetCancel = () => {
    setShowResetModal(false);
  };

  const handleSectionResetConfirm = () => {
    if (showSectionResetModal) {
      resetSection(showSectionResetModal);
      setShowSectionResetModal(null);
      setAnnouncementText(`Sección ${getSectionName(showSectionResetModal)} reiniciada completamente.`);
    }
  };

  const handleSectionResetCancel = () => {
    setShowSectionResetModal(null);
  };

  const renderSection = (section: AlbumSection) => {
    const sectionData = album[section];
    const sectionStats = stats[section];
    
    return (
      <section 
        id={`section-${section}`}
        className="space-y-6"
        ref={(el) => {
          if (el) sectionRefs.current[section] = el as HTMLDivElement;
        }}
        tabIndex={-1}
        aria-labelledby={`section-title-${section}`}
        role="tabpanel"
        aria-describedby={`tab-${section}`}
      >
        {/* Header de la sección */}
        <div className="text-center mb-8">
          <h3 
            id={`section-title-${section}`}
            className="text-4xl font-star-wars text-yellow-400 mb-4"
          >
            ARCHIVO: {getSectionName(section).toUpperCase()}
          </h3>
          <div 
            className="flex justify-center items-center space-x-8 mb-6"
            role="group" 
            aria-label={`Progreso de la sección ${getSectionName(section)}`}
          >
            <div className="text-center">
              <div 
                className="text-3xl font-bold text-white"
                aria-label={`${sectionStats.collected} cartas recolectadas`}
              >
                {sectionStats.collected}
              </div>
              <div className="text-sm text-blue-400 font-body">Registrados</div>
            </div>
            <div className="text-yellow-400 text-2xl" aria-hidden="true">/</div>
            <div className="text-center">
              <div 
                className="text-3xl font-bold text-gray-400"
                aria-label={`${sectionStats.total} cartas totales`}
              >
                {sectionStats.total}
              </div>
              <div className="text-sm text-blue-400 font-body">Totales</div>
            </div>
          </div>
          
          {/* Barra de progreso mejorada */}
          <div className="max-w-md mx-auto">
            <div 
              className="w-full bg-gray-800/50 rounded-full h-4 relative overflow-hidden"
              role="progressbar"
              aria-label={`Progreso de ${getSectionName(section)}: ${sectionStats.collected} de ${sectionStats.total} cartas recolectadas, ${Math.round((sectionStats.collected / sectionStats.total) * 100)} por ciento completo`}
            >
              <div 
                className="progress-bar h-4 rounded-full transition-all duration-1000 progress-fill"
                style={{ '--fill-width': `${(sectionStats.collected / sectionStats.total) * 100}%` } as React.CSSProperties}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="text-xs font-star-wars text-black mix-blend-difference"
                  aria-hidden="true"
                >
                  {Math.round((sectionStats.collected / sectionStats.total) * 100)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Botón de reinicio de sección */}
          {sectionStats.collected > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowSectionResetModal(section)}
                className="mx-auto flex items-center space-x-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 hover:border-red-400/50 rounded-lg text-red-400 hover:text-red-300 font-star-wars text-xs transition-all duration-300"
                aria-label={`Reiniciar sección ${getSectionName(section)}`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
                </svg>
                <span>Reiniciar {getSectionName(section)}</span>
                <span className="opacity-75">({sectionStats.collected})</span>
              </button>
            </div>
          )}
        </div>

        {/* Grid de cartas con diseño mejorado */}
        <div 
          className="album-grid grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3"
          role="group"
          aria-label={`Cartas de ${getSectionName(section)}`}
        >
          {sectionData.map((card, index) => {
            // Para starships usar el ID real de SWAPI, para otras secciones usar índice + 1
            const cardId = card ? card.id : (
              section === 'starships' 
                ? VALID_IDS.starships[index] || index + 1
                : index + 1
            );
            
            return (
              <div
                key={index}
                onClick={() => handleCardClick(card)}
                onKeyDown={(e) => handleCardKeyDown(e, card)}
                tabIndex={0}
                role="button"
                aria-label={
                  card 
                    ? `Carta ID ${cardId}: ${card.name}, ${card.category === 'special' ? 'especial' : 'regular'}. Presiona Enter para ver detalles.`
                    : `Posición ${index + 1}, ID esperado ${cardId}: Sin carta recolectada`
                }
                className={`
                  album-card aspect-card rounded-xl flex flex-col items-center justify-center
                  album-card-hover cursor-pointer relative overflow-hidden border
                  focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900
                  ${card 
                    ? `border-yellow-400 ${
                        card.category === 'special' 
                          ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg shadow-yellow-400/30' 
                          : 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 shadow-lg'
                      }`
                    : 'border-gray-700 bg-gradient-to-br from-gray-900 to-black hover:border-gray-600'
                  }
                `}
              >
                {/* Número de carta */}
                <div className="absolute top-1 left-1 right-1 flex justify-center">
                  <span className={`
                    text-xs font-star-wars px-2 py-1 rounded-full
                    ${card 
                      ? card.category === 'special'
                        ? 'bg-black/20 text-black font-bold'
                        : 'bg-black/30 text-white'
                      : 'bg-gray-800/80 text-gray-400'
                    }
                  `}>
                    #{cardId}
                  </span>
                </div>
                
                <div className="text-center p-2 flex-1 flex flex-col justify-center">
                  {card ? (
                    <div>
                      {/* Imagen pequeña de la carta */}
                      {card.data && 'image' in card.data && card.data.image ? (
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full overflow-hidden border-2 border-current">
                          <img 
                            src={card.data.image as string} 
                            alt={card.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        /* Icono de la sección como fallback */
                        <div className={`w-8 h-8 mx-auto mb-2 ${
                          card.category === 'special' ? 'text-black/80' : 'text-white/80'
                        }`}>
                          {section === 'movies' && (
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Película">
                              <path d="M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V4H18Z"/>
                            </svg>
                          )}
                          {section === 'characters' && (
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Personaje">
                              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                            </svg>
                          )}
                          {section === 'starships' && (
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Nave estelar">
                              <path d="M6,2L4,6V8H2V10H4L6,14V16H8V14L10,10H12L14,14V16H16V14L18,10H20V8H18V6L16,2H14L12,6L10,2H6Z"/>
                            </svg>
                          )}
                        </div>
                      )}
                      
                      <div className={`text-xs font-body font-medium mb-1 ${
                        card.category === 'special' ? 'text-black' : 'text-white'
                      }`}>
                        {card.name.length > 10 
                          ? `${card.name.substring(0, 10)}...` 
                          : card.name
                        }
                      </div>
                      
                      <div className={`text-xs font-star-wars ${
                        card.category === 'special' ? 'text-black/70' : 'text-gray-300'
                      }`}>
                        {card.category === 'special' ? 'ESP' : 'REG'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <div className="w-8 h-8 mx-auto mb-2 opacity-30">
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-label="Carta no recolectada">
                          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M13,17H11V15H13V17M13,13H11V7H13V13Z"/>
                        </svg>
                      </div>
                      <div className="text-xs font-star-wars">
                        SIN DATOS
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Efecto de brillo para cartas especiales */}
                {card && card.category === 'special' && (
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Anuncio para lectores de pantalla */}
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
        >
          {announcementText}
        </div>

        {/* Header principal */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-star-wars text-glow text-yellow-400 mb-6">
            ARCHIVO PERSONAL
          </h1>
          <div className="w-32 h-1 panini-progress mx-auto mb-8 opacity-60" aria-hidden="true"></div>
          
          {/* Estadísticas generales con efecto holográfico */}
          <div className="modal-content max-w-4xl mx-auto rounded-2xl p-8 mb-12" role="region" aria-labelledby="overall-stats">
            <div 
              id="overall-stats"
              className="text-5xl font-star-wars text-yellow-400 mb-3"
              aria-label={`Progreso total: ${stats.overall.collected} de ${stats.overall.total} cartas recolectadas`}
            >
              {stats.overall.collected} / {stats.overall.total}
            </div>
            <div className="text-xl font-body text-blue-400 mb-6">
              Registros Archivados • {stats.overall.percentage}% Base de Datos Completa
            </div>
            
            <div className="w-full bg-gray-800/50 rounded-full h-6 mb-8 relative overflow-hidden">
              <div 
                className="progress-bar h-6 rounded-full transition-all duration-1000 relative progress-fill"
                style={{ '--fill-width': `${stats.overall.percentage}%` } as React.CSSProperties}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              {sections.map(({ key, name }) => {
                const sectionStats = stats[key];
                return (
                  <div key={key} className="text-center">
                    <div className="font-star-wars text-lg text-yellow-400 mb-2">{name}</div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {sectionStats.collected} / {sectionStats.total}
                    </div>
                    <div className="text-sm text-blue-400 font-body">
                      {Math.round((sectionStats.collected / sectionStats.total) * 100)}% completo
                    </div>
                    
                    {/* Mini barra de progreso */}
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                      <div 
                        className="panini-progress h-1 transition-all duration-500 progress-fill"
                        style={{ '--fill-width': `${(sectionStats.collected / sectionStats.total) * 100}%` } as React.CSSProperties}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Botón de reinicio del álbum */}
            {stats.overall.collected > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <button
                  onClick={() => setShowResetModal(true)}
                  className="mx-auto flex items-center space-x-3 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 hover:border-red-400 rounded-xl text-red-400 hover:text-red-300 font-star-wars text-sm transition-all duration-300 hover:scale-105"
                  aria-label="Reiniciar álbum completo"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                  </svg>
                  <span>REINICIAR ÁLBUM</span>
                  <span className="text-xs opacity-75">({stats.overall.collected} cartas)</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Navegación de secciones */}
        <nav 
          className="flex justify-center mb-12"
          role="tablist"
          aria-label="Secciones del álbum"
        >
          <div className="nav-star-wars rounded-2xl smooth-transition">
            {sections.map(({ key, name }) => (
              <button
                key={key}
                onClick={() => handleSectionChange(key)}
                role="tab"
                aria-selected={activeSection === key ? 'true' : 'false'}
                aria-controls={`section-${key}`}
                id={`tab-${key}`}
                tabIndex={activeSection === key ? 0 : -1}
                className={`px-4 py-3 md:px-8 md:py-4 rounded-xl font-star-wars text-xs md:text-sm smooth-transform relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                  activeSection === key
                    ? 'btn-primary transform -translate-y-1'
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-white/5 smooth-hover'
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  {key === 'movies' && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18,4L20,8H17L15,4H13L15,8H12L10,4H8L10,8H7L5,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V4H18Z"/>
                    </svg>
                  )}
                  {key === 'characters' && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                    </svg>
                  )}
                  {key === 'starships' && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M6,2L4,6V8H2V10H4L6,14V16H8V14L10,10H12L14,14V16H16V14L18,10H20V8H18V6L16,2H14L12,6L10,2H6Z"/>
                    </svg>
                  )}
                  <span>{name}</span>
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* Contenido de la sección activa */}
        {renderSection(activeSection)}

        {/* Modal de detalles de carta */}
        <CardModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />

        {/* Modal de confirmación de reinicio */}
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={handleResetCancel}
            ></div>
            
            {/* Modal content */}
            <div className="relative modal-content rounded-2xl p-8 max-w-md w-full mx-4 border border-red-500/30">
              <div className="text-center">
                {/* Icono de advertencia */}
                <div className="w-16 h-16 mx-auto mb-6 bg-red-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
                  </svg>
                </div>
                
                {/* Título */}
                <h3 className="text-2xl font-star-wars text-red-400 mb-4">
                  CONFIRMAR REINICIO
                </h3>
                
                {/* Mensaje */}
                <p className="text-gray-300 font-body mb-2">
                  ¿Estás seguro de que deseas reiniciar tu álbum completo?
                </p>
                <p className="text-red-300 font-body text-sm mb-6">
                  <strong>Se eliminarán {stats.overall.collected} cartas recolectadas.</strong><br />
                  Esta acción no se puede deshacer.
                </p>
                
                {/* Botones */}
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={handleResetCancel}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-star-wars text-sm transition-colors duration-300"
                  >
                    CANCELAR
                  </button>
                  <button
                    onClick={handleResetConfirm}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-star-wars text-sm transition-colors duration-300"
                  >
                    SÍ, REINICIAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación de reinicio de sección */}
        {showSectionResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={handleSectionResetCancel}
            ></div>
            
            {/* Modal content */}
            <div className="relative modal-content rounded-2xl p-8 max-w-md w-full mx-4 border border-orange-500/30">
              <div className="text-center">
                {/* Icono de advertencia */}
                <div className="w-16 h-16 mx-auto mb-6 bg-orange-600/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
                  </svg>
                </div>
                
                {/* Título */}
                <h3 className="text-2xl font-star-wars text-orange-400 mb-4">
                  REINICIAR SECCIÓN
                </h3>
                
                {/* Mensaje */}
                <p className="text-gray-300 font-body mb-2">
                  ¿Deseas reiniciar la sección <strong>{getSectionName(showSectionResetModal)}</strong>?
                </p>
                <p className="text-orange-300 font-body text-sm mb-6">
                  Se eliminarán <strong>{stats[showSectionResetModal].collected} cartas</strong> de esta sección.<br />
                  Esta acción no se puede deshacer.
                </p>
                
                {/* Botones */}
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={handleSectionResetCancel}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-star-wars text-sm transition-colors duration-300"
                  >
                    CANCELAR
                  </button>
                  <button
                    onClick={handleSectionResetConfirm}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-star-wars text-sm transition-colors duration-300"
                  >
                    SÍ, REINICIAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}