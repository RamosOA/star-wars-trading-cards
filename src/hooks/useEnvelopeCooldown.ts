import { useState, useEffect, useCallback } from 'react';
import { 
  loadEnvelopeCooldowns, 
  saveEnvelopeCooldowns 
} from '../utils/storage';

const COOLDOWN_DURATION = 60 * 1000; // 1 minuto en milisegundos

export function useEnvelopeCooldown() {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>(loadEnvelopeCooldowns);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Actualizar el tiempo actual cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Guardar cooldowns cuando cambien
  useEffect(() => {
    saveEnvelopeCooldowns(cooldowns);
  }, [cooldowns]);

  const startCooldown = useCallback((envelopeId: string) => {
    const endTime = Date.now() + COOLDOWN_DURATION;
    setCooldowns(prev => ({
      ...prev,
      [envelopeId]: endTime
    }));
  }, []);

  const isOnCooldown = useCallback((envelopeId: string): boolean => {
    const endTime = cooldowns[envelopeId];
    return endTime ? endTime > currentTime : false;
  }, [cooldowns, currentTime]);

  const getRemainingTime = useCallback((envelopeId: string): number => {
    const endTime = cooldowns[envelopeId];
    if (!endTime) return 0;
    
    const remaining = endTime - currentTime;
    return remaining > 0 ? remaining : 0;
  }, [cooldowns, currentTime]);

  const clearExpiredCooldowns = useCallback(() => {
    setCooldowns(prev => {
      const now = Date.now();
      const active: Record<string, number> = {};
      
      for (const [id, endTime] of Object.entries(prev)) {
        if (endTime > now) {
          active[id] = endTime;
        }
      }
      
      return active;
    });
  }, []);

  // Limpiar cooldowns expirados cada minuto
  useEffect(() => {
    const interval = setInterval(clearExpiredCooldowns, 60000);
    return () => clearInterval(interval);
  }, [clearExpiredCooldowns]);

  return {
    startCooldown,
    isOnCooldown,
    getRemainingTime
  };
}