import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const StarBackground = () => {
  const stars = new Array(30).fill(0).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${Math.random() * 3 + 2}s`,
    delay: `${Math.random() * 5}s`
  }));
  return (
    <div className="star-container">
      {stars.map((star) => (
        <div key={star.id} className="star" style={{ left: star.left, animationDuration: star.duration, animationDelay: star.delay }} />
      ))}
    </div>
  );
};

export const Header = ({ title, onBack }) => (
  <div className="navbar">
    <button onClick={onBack} style={{background:'none', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer', display:'flex', alignItems:'center'}}>
      <span className="material-icons-round">arrow_back_ios</span>
    </button>
    <span className="navbar-title">{title}</span>
    <div style={{width: 24}}></div>
  </div>
);

export const AnimatedButton = ({ onClick, className, children, style }) => (
  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={className} onClick={onClick} style={style}>
    {children}
  </motion.button>
);

export const Modal = ({ isOpen, onClose, title, children, type }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
        <motion.div 
            className="modal-content" 
            initial={{ scale: 0.8, opacity: 0, y: 50 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
        >
          <div className={`modal-header ${type}`}><h3>{title}</h3></div>
          <div className="modal-body">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);