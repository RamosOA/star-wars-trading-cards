import { useState, useEffect } from 'react';
import type { Album, Card } from '../types';
import { 
  loadAlbum, 
  saveAlbum, 
  hasCard, 
  addCardToAlbum,
  removeCardFromAlbum,
  getAlbumStats,
  createEmptyAlbum,
  clearEnvelopeCooldowns
} from '../utils/storage';

export function useAlbum() {
  const [album, setAlbum] = useState<Album>(loadAlbum);

  // Guardar álbum cuando cambie
  useEffect(() => {
    saveAlbum(album);
  }, [album]);

  const addCard = (card: Card) => {
    if (!hasCard(album, card)) {
      const newAlbum = addCardToAlbum(album, card);
      setAlbum(newAlbum);
      return true; // Carta agregada exitosamente
    }
    return false; // Carta ya existe
  };

  const removeCard = (card: Card) => {
    if (hasCard(album, card)) {
      const newAlbum = removeCardFromAlbum(album, card);
      setAlbum(newAlbum);
      return true; // Carta removida exitosamente
    }
    return false; // Carta no existe
  };

  const checkHasCard = (card: Card) => {
    return hasCard(album, card);
  };

  const getStats = () => {
    return getAlbumStats(album);
  };

  const resetAlbum = () => {
    const emptyAlbum = createEmptyAlbum();
    setAlbum(emptyAlbum);
    // También limpiar los cooldowns de los sobres
    clearEnvelopeCooldowns();
    return true; // Álbum reiniciado exitosamente
  };

  const resetSection = (section: 'movies' | 'characters' | 'starships') => {
    const newAlbum = { ...album };
    const emptySection = createEmptyAlbum()[section];
    newAlbum[section] = emptySection;
    setAlbum(newAlbum);
    return true; // Sección reiniciada exitosamente
  };

  return {
    album,
    addCard,
    removeCard,
    checkHasCard,
    getStats,
    resetAlbum,
    resetSection
  };
}