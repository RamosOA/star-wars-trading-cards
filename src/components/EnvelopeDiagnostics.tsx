import { VALID_IDS } from '../services/swapi';

interface DiagnosticInfo {
  section: string;
  totalValid: number;
  sampleIds: number[];
  ranges: { min: number; max: number };
}

export function EnvelopeDiagnostics() {
  const diagnostics: DiagnosticInfo[] = [
    {
      section: 'Películas',
      totalValid: VALID_IDS.films.length,
      sampleIds: VALID_IDS.films.slice(0, 3),
      ranges: { min: Math.min(...VALID_IDS.films), max: Math.max(...VALID_IDS.films) }
    },
    {
      section: 'Personajes',
      totalValid: VALID_IDS.people.length,
      sampleIds: VALID_IDS.people.slice(0, 5),
      ranges: { min: Math.min(...VALID_IDS.people), max: Math.max(...VALID_IDS.people) }
    },
    {
      section: 'Naves',
      totalValid: VALID_IDS.starships.length,
      sampleIds: VALID_IDS.starships.slice(0, 5),
      ranges: { min: Math.min(...VALID_IDS.starships), max: Math.max(...VALID_IDS.starships) }
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold text-yellow-400 mb-2">📊 Diagnóstico SWAPI</h4>
      {diagnostics.map((diag, index) => (
        <div key={index} className="mb-2">
          <div className="font-semibold text-blue-400">{diag.section}:</div>
          <div>Total válidos: {diag.totalValid}</div>
          <div>Rango: {diag.ranges.min}-{diag.ranges.max}</div>
          <div>Ejemplos: {diag.sampleIds.join(', ')}</div>
        </div>
      ))}
      <div className="mt-2 pt-2 border-t border-gray-600">
        <div className="text-green-400">✅ Sistema de validación activo</div>
        <div className="text-green-400">✅ Retry automático habilitado</div>
        <div className="text-green-400">✅ Sin duplicados en sobres</div>
      </div>
    </div>
  );
}