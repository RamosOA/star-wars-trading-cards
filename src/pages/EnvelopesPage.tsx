import { useState } from 'react';
import type { Card, AlbumSection } from '../types';
import { EnvelopeComponent } from '../components/EnvelopeComponent';
import { CardComponent } from '../components/CardComponent';
import { useEnvelopeCooldown } from '../hooks/useEnvelopeCooldown';
import { useAlbum } from '../hooks/useAlbum';

import { 
  getRandomEnvelopeConfig, 
  generateEnvelopeCards, 
  isSpecialCard 
} from '../utils/gameLogic';
import { getMovie, getCharacter, getStarship } from '../services/swapi';

interface OpenedCard {
  section: AlbumSection;
  id: number;
  card?: Card;
  loading: boolean;
  error?: string;
  retryCount?: number;
}

export function EnvelopesPage() {
  const [openedCards, setOpenedCards] = useState<OpenedCard[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [currentEnvelope, setCurrentEnvelope] = useState<string | null>(null);
  const [cardActions, setCardActions] = useState<Record<number, 'added' | 'discarded'>>({});
  
  const { startCooldown, isOnCooldown, getRemainingTime } = useEnvelopeCooldown();
  const { checkHasCard, addCard, removeCard } = useAlbum();

  const envelopeIds = ['1', '2', '3', '4'];

  const openEnvelope = async (envelopeId: string) => {
    if (isOnCooldown(envelopeId) || isOpening) return;

    setIsOpening(true);
    setCurrentEnvelope(envelopeId);

    // Iniciar cooldown para TODOS los sobres incluyendo el que se acaba de abrir
    envelopeIds.forEach(id => {
      startCooldown(id);
    });

    // Generar configuración y cartas del sobre
    const config = getRandomEnvelopeConfig();
    const cardIds = generateEnvelopeCards(config);
    
    // Inicializar estado de cartas
    const initialCards: OpenedCard[] = cardIds.map(({ section, id }) => ({
      section,
      id,
      loading: true
    }));
    
    setOpenedCards(initialCards);

    // Cargar datos de cada carta en paralelo
    Promise.all(cardIds.map(async ({ section, id }, index) => {
      await loadCard(section, id, index);
    })).finally(() => {
      setIsOpening(false);
    });
  };

  const loadCard = async (section: AlbumSection, id: number, index: number) => {
    try {
      let data;
      let name: string;

      switch (section) {
        case 'movies':
          data = await getMovie(id);
          name = data.title;
          break;
        case 'characters':
          data = await getCharacter(id);
          name = data.name;
          break;
        case 'starships':
          data = await getStarship(id);
          name = data.name;
          break;
        default:
          throw new Error(`Sección no válida: ${section}`);
      }

      const card: Card = {
        id,
        name,
        section,
        category: isSpecialCard(section, id),
        data
      };

      // Actualizar estado con carta cargada exitosamente
      setOpenedCards(prev => 
        prev.map((openedCard, i) => 
          i === index 
            ? { ...openedCard, card, loading: false, error: undefined }
            : openedCard
        )
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar';
      
      // Marcar como error
      setOpenedCards(prev => 
        prev.map((openedCard, i) => 
          i === index 
            ? { 
                ...openedCard, 
                loading: false, 
                error: errorMessage
              }
            : openedCard
        )
      );
    }
  };

  const handleAddCard = (card: Card) => {
    console.log('🔄 Intentando agregar carta:', {
      id: card.id,
      name: card.name,
      section: card.section,
      category: card.category,
      data: card.data
    });
    
    // Verificación adicional para asegurar que la carta tiene una sección válida
    if (!card.section || !['movies', 'characters', 'starships'].includes(card.section)) {
      console.error('❌ Error: Carta con sección inválida:', card.section);
      return;
    }
    
    const success = addCard(card);
    
    // Registrar acción realizada
    setCardActions(prev => ({
      ...prev,
      [card.id]: 'added'
    }));
    
    const cardElement = document.querySelector(`[data-card-id="${card.id}"]`) as HTMLElement;
    
    if (success) {
      console.log('✅ Carta agregada exitosamente al álbum:', card.name);
      
      // Animación uniforme para todas las cartas agregadas
      if (cardElement) {
        cardElement.classList.remove('card-discarded-animation', 'card-added-animation');
        // Forzar reflow para reiniciar la animación
        void cardElement.offsetHeight;
        cardElement.classList.add('card-added-animation');
        
        setTimeout(() => {
          cardElement.classList.remove('card-added-animation');
        }, 800);
      }
    } else {
      console.log('ℹ️ La carta ya existe en el álbum:', card.name);
      
      // Mostrar feedback visual aunque ya exista
      if (cardElement) {
        cardElement.style.filter = 'brightness(1.2)';
        setTimeout(() => {
          cardElement.style.filter = '';
        }, 300);
      }
    }
  };

  const handleDiscardCard = (card: Card) => {
    console.log('🗑️ Carta descartada:', card.name);
    
    // Registrar acción realizada
    setCardActions(prev => ({
      ...prev,
      [card.id]: 'discarded'
    }));
    
    // Si la carta está en el álbum, la removemos
    if (checkHasCard(card)) {
      const success = removeCard(card);
      if (success) {
        console.log('✅ Carta removida del álbum:', card.name);
      }
    }
    
    // Animación uniforme para todas las cartas descartadas
    const cardElement = document.querySelector(`[data-card-id="${card.id}"]`) as HTMLElement;
    if (cardElement) {
      cardElement.classList.remove('card-added-animation', 'card-discarded-animation');
      // Forzar reflow para reiniciar la animación
      void cardElement.offsetHeight;
      cardElement.classList.add('card-discarded-animation');
      
      setTimeout(() => {
        cardElement.classList.remove('card-discarded-animation');
      }, 600);
    }
  };

  const retryFailedCard = async (cardIndex: number) => {
    const failedCard = openedCards[cardIndex];
    if (!failedCard || !failedCard.error) return;

    // Marcar como cargando
    setOpenedCards(prev => 
      prev.map((card, i) => 
        i === cardIndex 
          ? { ...card, loading: true, error: undefined }
          : card
      )
    );

    await loadCard(failedCard.section, failedCard.id, cardIndex);
  };

  const closeEnvelope = () => {
    setOpenedCards([]);
    setCurrentEnvelope(null);
    setCardActions({}); // Limpiar acciones
  };

  const allCardsProcessed = openedCards.length > 0 && 
    openedCards.every(card => !card.loading && (card.card || card.error));
    
  // Verificar si se han tomado acciones sobre todas las cartas
  const allActionsComplete = openedCards.length > 0 && 
    openedCards.every(openedCard => {
      if (!openedCard.card) return false; // Carta no cargada
      return cardActions[openedCard.card.id] !== undefined; // Acción registrada
    });

  const canDiscardEnvelope = allCardsProcessed && allActionsComplete;

  return (
    <div className="min-h-screen p-8 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          {/* Título principal épico */}
          <div className="relative mb-8">
            <h2 className="text-7xl font-star-wars text-yellow-400 mb-6 relative">
              <span className="relative z-10">ARCHIVOS IMPERIALES</span>
              <div className="absolute inset-0 text-yellow-400 opacity-20 blur-sm animate-pulse">
                ARCHIVOS IMPERIALES
              </div>
            </h2>
            
            {/* Líneas decorativas estilo Panini */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="w-20 h-1 panini-progress rounded-full animate-pulse"></div>
              <div className="w-8 h-8 rotating-element-1"></div>
              <div className="w-40 h-2 panini-progress rounded-full animate-pulse"></div>
              <div className="w-8 h-8 rotating-element-2"></div>
              <div className="w-20 h-1 panini-progress rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <p className="text-2xl panini-title font-body mb-8 font-bold">
            🎯 Selecciona tu pack de trading cards espaciales 🚀
          </p>
          
          {/* Panel de advertencia mejorado */}
          <div className="relative panini-container rounded-xl p-4 sm:p-6 lg:p-8 border-2 max-w-3xl mx-auto overflow-hidden mb-8 lg:mb-12 dynamic-border-container">
            <div className="absolute inset-0 info-container-gradient"></div>
            <div className="absolute top-0 left-0 w-full h-1 panini-progress animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-6 h-6 border-2 border-yellow-400 rotate-45 animate-pulse"></div>
                <p className="text-yellow-400 font-star-wars text-xl">ADVERTENCIA IMPERIAL</p>
                <div className="w-6 h-6 border-2 border-yellow-400 rotate-45 animate-pulse"></div>
              </div>
              <p className="text-gray-300 font-body leading-relaxed text-lg">
                Cada contenedor requiere tiempo de recarga entre extracciones.<br />
                Los datos pueden contener información sensible sobre la Rebelión.<br />
                <span className="text-blue-400 font-semibold">Proceda con máxima precaución.</span>
              </p>
            </div>
          </div>
        </div>

        {openedCards.length === 0 ? (
          // Vista de sobres
          <div>            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 justify-items-center mb-12">
              {envelopeIds.map(id => (
                <EnvelopeComponent
                  key={id}
                  id={id}
                  isAvailable={!isOnCooldown(id) && !isOpening}
                  remainingTime={getRemainingTime(id)}
                  onOpen={() => openEnvelope(id)}
                />
              ))}
            </div>

            {isOpening && (
              <div className="text-center mt-16">
                <div className="relative">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-yellow-400 border-r-blue-400"></div>
                  <div className="absolute inset-0 inline-block animate-ping rounded-full h-16 w-16 border-4 border-yellow-400 opacity-30"></div>
                </div>
                <p className="text-yellow-400 mt-6 font-star-wars text-lg">
                  INICIALIZANDO TRANSMISIÓN DE DATOS...
                </p>
                <p className="text-blue-400 mt-2 font-body text-sm">
                  Conectando con los archivos del Imperio Galáctico
                </p>
              </div>
            )}
          </div>
        ) : (
          // Vista de cartas del sobre abierto
          <div>
            <div className="text-center mb-12">
              <h3 className="text-4xl font-star-wars text-yellow-400 mb-4">
                CONTENEDOR #{currentEnvelope}
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent mx-auto mb-4"></div>
              <p className="text-blue-400 font-body text-lg mb-8">
                Datos extraídos de los archivos imperiales
              </p>
              
              {allCardsProcessed && (
                <div className="text-center space-y-4">
                  {!allActionsComplete ? (
                    <div className="text-yellow-300 font-medium mb-4">
                      ⚠️ Debes tomar una acción sobre todas las cartas antes de continuar
                    </div>
                  ) : (
                    <div className="text-green-400 font-medium mb-4">
                      ✅ Todas las acciones completadas - Puedes descartar el sobre
                    </div>
                  )}
                  <button
                    onClick={closeEnvelope}
                    disabled={!canDiscardEnvelope}
                    className={`px-8 py-3 text-lg font-star-wars transition-all duration-300 ${
                      canDiscardEnvelope 
                        ? 'btn-primary hover:scale-105' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {canDiscardEnvelope ? 'DESCARTAR SOBRE' : 'ACCIONES PENDIENTES'}
                  </button>
                </div>
              )}
            </div>

            <div className="cards-grid-responsive">
              {openedCards.map((openedCard, index) => (
                <div 
                  key={index} 
                  className="w-full card-reveal-animation staggered-animation"
                  data-animation-delay={index * 100}
                >
                  {openedCard.loading ? (
                    <div className="card-loading-container">
                      <div className="text-center">
                        <div className="relative mb-4">
                          <div className="loading-spinner-primary"></div>
                          <div className="loading-spinner-secondary"></div>
                        </div>
                        <p className="loading-text-primary">🎯 DESCARGANDO CARTA...</p>
                        <p className="loading-text-secondary">Archivo {index + 1}/{openedCards.length}</p>
                        <div className="loading-progress-bar">
                          <div 
                            className={`loading-progress-fill progress-fill progress-${Math.round(((index + 1) / openedCards.length) * 100)}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ) : openedCard.error ? (
                    <div className="card-error-container">
                      <div className="text-center text-red-400">
                        <div className="error-icon-container">
                          <svg className="w-12 h-12 mx-auto mb-4 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
                          </svg>
                        </div>
                        <p className="font-star-wars text-sm mb-2">ERROR DE TRANSMISIÓN</p>
                        <p className="font-body text-xs mt-2 mb-4 text-gray-300">{openedCard.error}</p>
                        <button
                          onClick={() => retryFailedCard(index)}
                          className="error-retry-button"
                          disabled={isOpening}
                        >
                          <svg className="w-4 h-4 inline mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19,12L16,9V11H4V13H16V15L19,12Z"/>
                          </svg>
                          REINTENTAR
                        </button>
                      </div>
                    </div>
                  ) : openedCard.card ? (
                    <div className="relative">
                      <CardComponent
                        card={openedCard.card}
                        isInAlbum={checkHasCard(openedCard.card)}
                        onAdd={() => handleAddCard(openedCard.card!)}
                        onDiscard={() => handleDiscardCard(openedCard.card!)}
                      />
                      {cardActions[openedCard.card.id] && (
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                          cardActions[openedCard.card.id] === 'added' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {cardActions[openedCard.card.id] === 'added' ? '✅ AGREGADA' : '🗑️ DESCARTADA'}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {!allCardsProcessed && (
              <div className="text-center mt-16">
                <div className="inline-flex items-center space-x-4">
                  <div className="w-3 h-3 rounded-full animate-bounce loading-element-primary"></div>
                  <div className="w-3 h-3 rounded-full animate-bounce delay-200 loading-element-accent"></div>
                  <div className="w-3 h-3 rounded-full animate-bounce delay-400 loading-element-secondary"></div>
                </div>
                <p className="text-blue-400 font-star-wars mt-4">
                  PROCESANDO DATOS GALÁCTICOS...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}