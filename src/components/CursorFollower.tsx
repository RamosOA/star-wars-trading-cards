import { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

export function CursorFollower() {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<CursorPosition[]>([]);

  useEffect(() => {
    let animationFrame: number | undefined;

    // Interpolación suave del cursor
    const smoothUpdate = () => {
      setPosition(current => {
        const lerp = 0.15; // Factor de suavizado
        const newX = current.x + (targetPosition.x - current.x) * lerp;
        const newY = current.y + (targetPosition.y - current.y) * lerp;
        
        const newPosition = { x: newX, y: newY };
        
        // Actualizar trail menos frecuentemente
        const distance = Math.abs(newX - current.x) + Math.abs(newY - current.y);
        if (distance > 5) {
          setTrail(prev => {
            const newTrail = [newPosition, ...prev.slice(0, 5)]; // Trail más corto
            return newTrail;
          });
        }
        
        return newPosition;
      });
      
      animationFrame = requestAnimationFrame(smoothUpdate);
    };

    const updateMousePosition = (e: MouseEvent) => {
      setTargetPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Iniciar animación suave
    smoothUpdate();

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetPosition]);

  if (!isVisible) return null;

  return (
    <>
      {/* Trail del cursor */}
      {trail.map((pos, index) => (
        <div
          key={index}
          className={`fixed pointer-events-none z-50 rounded-full cursor-trail transition-all duration-100 ease-out`}
          style={{
            left: pos.x,
            top: pos.y,
            width: Math.max(1, 4 - (index * 0.4)),
            height: Math.max(1, 4 - (index * 0.4)),
            opacity: Math.max(0.1, (1 - index * 0.15) * 0.5),
          }}
        />
      ))}

      {/* Cursor principal */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-100 ${
          isClicking ? 'scale-75' : 'scale-100'
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Anillo exterior */}
        <div
          className={`absolute rounded-full border-2 border-yellow-400 transition-all duration-200 ${
            isClicking 
              ? 'w-8 h-8 border-opacity-100' 
              : 'w-6 h-6 border-opacity-60 hover:w-8 hover:h-8 hover:border-opacity-80'
          }`}
          style={{
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 15px rgba(255, 232, 31, 0.4)',
          }}
        />

        {/* Punto central */}
        <div
          className={`absolute w-1 h-1 bg-yellow-400 rounded-full transition-all duration-200 ${
            isClicking ? 'scale-150' : 'scale-100'
          }`}
          style={{
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 8px rgba(255, 232, 31, 0.8)',
          }}
        />

        {/* Rayos de energía (aparecen al hacer click) */}
        {isClicking && (
          <>
            <div
              className="absolute w-8 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-70"
              style={{
                transform: 'translate(-50%, -50%) rotate(0deg)',
                animation: 'pulse 0.3s ease-out',
              }}
            />
            <div
              className="absolute w-8 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-70"
              style={{
                transform: 'translate(-50%, -50%) rotate(90deg)',
                animation: 'pulse 0.3s ease-out',
              }}
            />
            <div
              className="absolute w-8 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"
              style={{
                transform: 'translate(-50%, -50%) rotate(45deg)',
                animation: 'pulse 0.3s ease-out',
              }}
            />
            <div
              className="absolute w-8 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"
              style={{
                transform: 'translate(-50%, -50%) rotate(135deg)',
                animation: 'pulse 0.3s ease-out',
              }}
            />
          </>
        )}
      </div>
    </>
  );
}