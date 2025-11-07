import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50">
      {/* Fondo con efecto Star Wars */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-yellow-400">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent"></div>
        {/* Efecto de estrellas sutiles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-20 w-1 h-1 bg-yellow-300 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-6 left-32 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-6 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        </div>
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Izquierda */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z" />
                </svg>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-blue-400/20 rounded-full blur animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                STAR WARS
              </h1>
              <p className="text-blue-300 text-sm font-medium tracking-wider">
                Trading Cards Collection
              </p>
            </div>
          </div>

          {/* Navegación Desktop - Derecha */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/album"
              className={({ isActive }) => `
                relative group px-6 py-3 rounded-xl font-medium text-sm
                transition-all duration-300 transform hover:scale-105
                ${isActive 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' 
                  : 'text-gray-300 hover:text-yellow-400 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-yellow-400/50'
                }
              `}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
                </svg>
                <span>MI ÁLBUM</span>
              </span>
              {/* Efecto hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </NavLink>

            <NavLink
              to="/envelopes"
              className={({ isActive }) => `
                relative group px-6 py-3 rounded-xl font-medium text-sm
                transition-all duration-300 transform hover:scale-105
                ${isActive 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' 
                  : 'text-gray-300 hover:text-yellow-400 bg-white/5 hover:bg-white/10 border border-gray-700 hover:border-yellow-400/50'
                }
              `}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                </svg>
                <span>OBTENER LÁMINAS</span>
              </span>
              {/* Efecto hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </NavLink>
          </div>

          {/* Botón Mobile - Derecha */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative p-3 rounded-xl bg-white/10 border border-gray-700 hover:border-yellow-400/50 hover:bg-white/20 transition-all duration-300"
            aria-label="Menú de navegación"
          >
            <div className="flex flex-col space-y-1.5 w-6">
              <div className={`h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Menú Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-black/95 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 space-y-4">
              <NavLink
                to="/album"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center space-x-4 p-4 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-white/10'
                  }
                `}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
                </svg>
                <span className="font-medium">MI ÁLBUM</span>
              </NavLink>

              <NavLink
                to="/envelopes"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center space-x-4 p-4 rounded-xl transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' 
                    : 'text-gray-300 hover:text-yellow-400 hover:bg-white/10'
                  }
                `}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                </svg>
                <span className="font-medium">OBTENER LÁMINAS</span>
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}