import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  prevX: number;
  prevY: number;
  size: number;
  speed: number;
  opacity: number;
  twinkle: number;
  twinkleSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  endX: number;
  endY: number;
  progress: number;
  speed: number;
  size: number;
  opacity: number;
  trail: { x: number; y: number; opacity: number }[];
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const lastShootingStarRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Inicializar estrellas (optimizado)
    const initStars = () => {
      const stars: Star[] = [];
      const numStars = Math.min(200, Math.floor((canvas.width * canvas.height) / 12000)); // Menos estrellas pero más optimizadas

      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          prevX: 0,
          prevY: 0,
          size: Math.random() * 1.5 + 0.5, // Tamaños más pequeños
          speed: Math.random() * 0.1 + 0.05, // Movimiento más sutil
          opacity: Math.random() * 0.6 + 0.3,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.015 + 0.005, // Parpadeo más lento
        });
      }
      starsRef.current = stars;
    };

    // Crear estrella fugaz
    const createShootingStar = () => {
      const startSide = Math.random();
      let x, y, endX, endY;

      if (startSide < 0.5) {
        // Desde arriba
        x = Math.random() * canvas.width;
        y = -50;
        endX = x + (Math.random() * 400 - 200);
        endY = canvas.height + 50;
      } else {
        // Desde la izquierda
        x = -50;
        y = Math.random() * canvas.height * 0.7; // Más arriba para mejor efecto
        endX = canvas.width + 50;
        endY = y + (Math.random() * 200 - 100);
      }

      shootingStarsRef.current.push({
        x,
        y,
        endX,
        endY,
        progress: 0,
        speed: Math.random() * 0.008 + 0.012,
        size: Math.random() * 3 + 2,
        opacity: 1,
        trail: [],
      });
    };

    // Variables para optimización
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;
    
    // Crear gradiente negro completo
    const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    backgroundGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    backgroundGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    backgroundGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');

    // Animar estrellas
    const animate = (currentTime: number) => {
      // Control de FPS
      if (currentTime - lastTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime;

      // Fondo semi-transparente para efecto de trail
      ctx.fillStyle = backgroundGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animar estrellas normales (optimizado)
      starsRef.current.forEach((star) => {
        // Movimiento más sutil y menos cálculos
        const time = currentTime * 0.0005;
        star.x += Math.sin(time + star.z * 0.001) * star.speed;
        star.y += Math.cos(time + star.z * 0.001) * star.speed;

        // Mantener en pantalla
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Efecto de parpadeo optimizado
        star.twinkle += star.twinkleSpeed;
        const twinkleOpacity = star.opacity + Math.sin(star.twinkle) * 0.2;

        // Dibujar estrella simplificado
        ctx.beginPath();
        const radius = star.size;
        
        // Colores más sobrios para el fondo - tonos azules y blancos suaves
        const colorVariation = star.z % 300;
        
        if (colorVariation < 100) {
          // Azul suave
          ctx.fillStyle = `rgba(135, 206, 250, ${twinkleOpacity * 0.6})`;
        } else if (colorVariation < 200) {
          // Blanco suave
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity * 0.4})`;
        } else {
          // Azul claro muy sutil
          ctx.fillStyle = `rgba(173, 216, 230, ${twinkleOpacity * 0.5})`;
        }
        
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Crear nuevas estrellas fugaces (menos frecuentes para mejor rendimiento)
      if (currentTime - lastShootingStarRef.current > 4000 + Math.random() * 6000) {
        createShootingStar();
        lastShootingStarRef.current = currentTime;
      }

      // Animar estrellas fugaces
      shootingStarsRef.current = shootingStarsRef.current.filter((shootingStar) => {
        shootingStar.progress += shootingStar.speed;
        
        const currentX = shootingStar.x + (shootingStar.endX - shootingStar.x) * shootingStar.progress;
        const currentY = shootingStar.y + (shootingStar.endY - shootingStar.y) * shootingStar.progress;

        // Agregar punto al trail (más corto para mejor rendimiento)
        shootingStar.trail.push({ 
          x: currentX, 
          y: currentY, 
          opacity: shootingStar.opacity 
        });
        
        // Mantener solo 8 puntos del trail
        if (shootingStar.trail.length > 8) {
          shootingStar.trail.shift();
        }

        // Trail más sutil - azul claro
        if (shootingStar.trail.length > 3) {
          const lastPoint = shootingStar.trail[shootingStar.trail.length - 4];
          ctx.beginPath();
          ctx.strokeStyle = `rgba(135, 206, 250, ${shootingStar.opacity * 0.7})`;
          ctx.lineWidth = shootingStar.size;
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(currentX, currentY);
          ctx.stroke();
        }

        // Cabeza blanca suave
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
        ctx.arc(currentX, currentY, shootingStar.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow azul muy sutil
        ctx.beginPath();
        ctx.fillStyle = `rgba(173, 216, 230, ${shootingStar.opacity * 0.3})`;
        ctx.arc(currentX, currentY, shootingStar.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Reducir opacidad al final
        if (shootingStar.progress > 0.7) {
          shootingStar.opacity *= 0.98;
        }

        return shootingStar.progress < 1 && shootingStar.opacity > 0.01;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initStars();
    animate(0);

    const handleResize = () => {
      resizeCanvas();
      initStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 starfield-canvas"
    />
  );
}