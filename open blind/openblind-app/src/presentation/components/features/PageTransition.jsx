import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Empieza invisible y un poco abajo
      animate={{ opacity: 1, y: 0 }}  // Se vuelve visible y sube a su sitio
      exit={{ opacity: 0, y: -20 }}   // (Opcional) Al salir se va hacia arriba
      transition={{ duration: 0.5, ease: "easeOut" }} // Dura medio segundo
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;