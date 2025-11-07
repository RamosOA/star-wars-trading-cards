import { useEffect, useState, useRef } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

export function CursorFollower() {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const targetRef = useRef<CursorPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Animación suave optimizada
    const animate = () => {
      setPosition(current => {
        const lerp = 0.12; // Suavizado
        const newX = current.x + (targetRef.current.x - current.x) * lerp;
        const newY = current.y + (targetRef.current.y - current.y) * lerp;
        return { x: newX, y: newY };
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed pointer-events-none z-50 cursor-main ${
        isClicking ? 'cursor-clicking' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Anillo exterior */}
      <div className="cursor-ring" />
      
      {/* Punto central */}
      <div className="cursor-dot" />
    </div>
  );
}