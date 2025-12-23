import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children, type = 'normal' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro borroso */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* La ventana en sí */}
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={`modal-header ${type}`}>
              <h3>{title}</h3>
              <button onClick={onClose} className="btn-close">
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;