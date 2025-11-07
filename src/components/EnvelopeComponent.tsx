import { formatCooldownTime } from '../utils/gameLogic';

interface EnvelopeComponentProps {
  id: string;
  isAvailable: boolean;
  remainingTime: number;
  onOpen: () => void;
}

export function EnvelopeComponent({ 
  id, 
  isAvailable, 
  remainingTime, 
  onOpen 
}: EnvelopeComponentProps) {
  const handleClick = () => {
    if (isAvailable) {
      onOpen();
    }
  };

  return (
    <div className="flex flex-col items-center group">
      <div
        className={`
          w-40 h-60 rounded-2xl shadow-2xl flex flex-col items-center justify-center
          text-white font-star-wars cursor-pointer transform transition-all duration-500
          relative overflow-hidden border-2
          ${isAvailable 
            ? 'envelope-available hover:scale-110 hover:rotate-3 border-blue-400' 
            : 'envelope-cooldown border-gray-600'
          }
        `}
        onClick={handleClick}
      >
        {/* Efecto de partículas más sutil */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-2 left-2 w-1 h-1 rounded-full animate-ping loading-element-secondary"></div>
          <div className="absolute top-8 right-4 w-1 h-1 rounded-full animate-ping delay-500 loading-element-accent"></div>
          <div className="absolute bottom-6 left-6 w-1 h-1 rounded-full animate-ping delay-1000 loading-element-primary"></div>
          <div className="absolute bottom-12 right-2 w-1 h-1 rounded-full animate-ping delay-1500 loading-element-secondary"></div>
        </div>
        
        {/* Contenido del sobre */}
        <div className="text-center relative z-10 p-4">
          {/* Icono del sobre */}
          <div className="mb-4">
            <svg 
              className={`w-16 h-16 mx-auto transition-all duration-300 ${
                isAvailable 
                  ? 'text-yellow-400 group-hover:text-yellow-300 group-hover:scale-110' 
                  : 'text-gray-500'
              }`}
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
            </svg>
          </div>
          
          {/* Título del sobre */}
          <div className={`text-lg mb-2 ${
            isAvailable ? 'text-yellow-400' : 'text-gray-400'
          }`}>
            SOBRE #{id}
          </div>
          
          {/* Estado del sobre */}
          {!isAvailable ? (
            <div className="mt-4 text-center">
              <div className="text-xs opacity-75 mb-2 font-body">RECARGANDO...</div>
              <div className="text-2xl font-mono mb-2 text-red-400">
                {formatCooldownTime(remainingTime)}
              </div>
              
              {/* Barra de progreso del cooldown */}
              <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
                <div 
                  className="panini-progress h-1 transition-all duration-1000 progress-bar"
                  style={{ 
                    '--progress-width': `${Math.max(0, 100 - (remainingTime / 60000) * 100)}%` 
                  } as React.CSSProperties}
                ></div>
              </div>
              
              <div className="text-xs text-gray-400 font-body">
                Sistema de energía recargando...
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="text-xs opacity-90 mb-2 font-body">SISTEMA LISTO</div>
              <div className="text-sm animate-pulse text-green-400 mb-2">
                ¡TOCA PARA ACTIVAR!
              </div>
              
              {/* Indicador de disponibilidad */}
              <div className="flex justify-center items-center space-x-1">
                <div className="w-2 h-2 bg-[#FFD23F] rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-[#FF6B35] rounded-full animate-ping delay-200"></div>
                <div className="w-2 h-2 bg-[#FF2D00] rounded-full animate-ping delay-400"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Efecto de energía al hacer hover */}
        {isAvailable && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-t from-[#FF2D00]/20 via-transparent to-[#FF6B35]/20"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Texto descriptivo debajo */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400 font-body">
          {isAvailable ? 'Contenido: 5 cartas místicas' : 'Esperando recarga de energía'}
        </p>
      </div>
    </div>
  );
}