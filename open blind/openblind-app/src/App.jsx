import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// Importación de módulos
import useVoiceCommands from './hooks/useVoiceCommands';
import { StarBackground } from './components/SharedComponents';

// Vistas
import Dashboard from './views/Dashboard';
import LugaresView from './views/LugaresView';
import ContactosView from './views/ContactosView';
import UbicacionView from './views/UbicacionView';
import PlaceholderView from './views/PlaceholderView';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(true);

  // Comandos de voz
  const { isListening, startListening } = useVoiceCommands((action) => {
    if (action === 'dashboard') {
      setCurrentView('dashboard');
    } else if (['lugares', 'contactos', 'rutas', 'ubicacion'].includes(action)) {
      setCurrentView(action);
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <motion.div className="splash-screen" exit={{ opacity: 0 }}>
        <StarBackground />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5, rotate: 360 }} transition={{ duration: 0.8 }} style={{ fontSize: '4rem', zIndex: 20 }}>🪐</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ color: 'white', marginTop: '1rem', zIndex: 20, fontWeight: 800, letterSpacing: '2px' }}>OpenBlind</motion.h1>
      </motion.div>
    );
  }

  return (
    <>
      <StarBackground />
      
      {/* Indicador de voz activa */}
      {isListening && (
        <motion.div 
          className="voice-listening-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          <span className="material-icons-round" style={{fontSize:'3rem', color:'white'}}>mic</span>
        </motion.div>
      )}
      
      <AnimatePresence mode='wait'>
        {currentView === 'dashboard' && <motion.div key="dash" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><Dashboard onChangeView={setCurrentView} onVoiceCommand={startListening} /></motion.div>}
        {currentView === 'lugares' && <motion.div key="lugares" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><LugaresView onBack={() => setCurrentView('dashboard')} /></motion.div>}
        {currentView === 'contactos' && <motion.div key="contactos" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><ContactosView onBack={() => setCurrentView('dashboard')} /></motion.div>}
        {currentView === 'rutas' && <motion.div key="rutas" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><PlaceholderView title="Rutas" icon="route" color="#00d4ff" onBack={() => setCurrentView('dashboard')} /></motion.div>}
        {currentView === 'ubicacion' && <motion.div key="ubicacion" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><UbicacionView onBack={() => setCurrentView('dashboard')} /></motion.div>}
        {currentView === 'login' && <motion.div key="login" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><PlaceholderView title="Login" icon="lock" color="#b026ff" onBack={() => setCurrentView('dashboard')} /></motion.div>}
      </AnimatePresence>
    </>
  );
}

export default App;