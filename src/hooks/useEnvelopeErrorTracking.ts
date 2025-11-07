import { useState, useRef, useCallback } from 'react';

interface ErrorLog {
  timestamp: number;
  section: string;
  id: number;
  error: string;
  attempt: number;
}

interface SuccessLog {
  timestamp: number;
  section: string;
  id: number;
  loadTime: number;
}

export function useEnvelopeErrorTracking() {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [successLogs, setSuccessLogs] = useState<SuccessLog[]>([]);
  const loadStartTimes = useRef<Map<string, number>>(new Map());

  const startCardLoad = useCallback((section: string, id: number) => {
    const key = `${section}-${id}`;
    loadStartTimes.current.set(key, Date.now());
  }, []);

  const logError = useCallback((section: string, id: number, error: string, attempt: number) => {
    const errorLog: ErrorLog = {
      timestamp: Date.now(),
      section,
      id,
      error,
      attempt
    };
    
    setErrorLogs(prev => [...prev, errorLog]);
    console.warn(`🚫 Card load error:`, errorLog);
  }, []);

  const logSuccess = useCallback((section: string, id: number) => {
    const key = `${section}-${id}`;
    const startTime = loadStartTimes.current.get(key);
    const loadTime = startTime ? Date.now() - startTime : 0;
    
    const successLog: SuccessLog = {
      timestamp: Date.now(),
      section,
      id,
      loadTime
    };
    
    setSuccessLogs(prev => [...prev, successLog]);
    loadStartTimes.current.delete(key);
    console.log(`✅ Card loaded successfully:`, successLog);
  }, []);

  const getStats = useCallback(() => {
    const totalErrors = errorLogs.length;
    const totalSuccess = successLogs.length;
    const avgLoadTime = successLogs.length > 0 
      ? successLogs.reduce((sum, log) => sum + log.loadTime, 0) / successLogs.length
      : 0;

    const errorsBySection = errorLogs.reduce((acc, log) => {
      acc[log.section] = (acc[log.section] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentErrors = errorLogs.filter(log => Date.now() - log.timestamp < 60000); // Últimos 60 segundos

    return {
      totalErrors,
      totalSuccess,
      avgLoadTime: Math.round(avgLoadTime),
      errorsBySection,
      recentErrors: recentErrors.length,
      successRate: totalSuccess + totalErrors > 0 
        ? Math.round((totalSuccess / (totalSuccess + totalErrors)) * 100)
        : 100
    };
  }, [errorLogs, successLogs]);

  const clearLogs = useCallback(() => {
    setErrorLogs([]);
    setSuccessLogs([]);
    loadStartTimes.current.clear();
  }, []);

  return {
    startCardLoad,
    logError,
    logSuccess,
    getStats,
    clearLogs,
    errorLogs,
    successLogs
  };
}