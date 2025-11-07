import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { EnvelopesPage } from './pages/EnvelopesPage';
import { AlbumPage } from './pages/AlbumPage';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { CursorFollower } from './components/CursorFollowerOptimized';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Canvas de fondo con partículas animadas */}
        <StarfieldCanvas />
        
        {/* Cursor personalizado */}
        <CursorFollower />
        
        <div className="relative z-10">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Navigate to="/envelopes" replace />} />
              <Route path="/envelopes" element={<EnvelopesPage />} />
              <Route path="/album" element={<AlbumPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App
