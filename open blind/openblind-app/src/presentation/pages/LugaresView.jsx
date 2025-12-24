import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"; 
import { API_URL } from "../../application/utils/constants"; 
import { Header, AnimatedButton, Modal } from "../components/features/SharedComponents"; 

const LugaresView = ({ onBack }) => {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState({ id: null, title: '', subtitle: '', icon: 'place' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadLugares();
  }, []);

  const loadLugares = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/lugares-favoritos`);
      const data = await response.json();
      if (data.success && data.data) {
        const mappedLugares = data.data.map(l => ({
          id: l.id_lugar,
          title: l.nombre,
          subtitle: l.direccion,
          icon: l.icono
        }));
        setLugares(mappedLugares);
      } else {
        setError('Error al cargar lugares favoritos');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (item = null) => {
    setCurrentItem(item || { id: null, title: '', subtitle: '', icon: 'place' });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (!currentItem.title || !currentItem.subtitle) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setSaving(true);
      if (currentItem.id) {
        const response = await fetch(`${API_URL}/lugares-favoritos/${currentItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: currentItem.title,
            direccion: currentItem.subtitle,
            icono: currentItem.icon
          }),
        });
        const data = await response.json();
        if (data.success) {
          setLugares(lugares.map(l => l.id === currentItem.id ? currentItem : l));
          setIsEditOpen(false);
        } else {
          alert('Error al actualizar lugar');
        }
      } else {
        const response = await fetch(`${API_URL}/lugares-favoritos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: currentItem.title,
            direccion: currentItem.subtitle,
            icono: currentItem.icon
          }),
        });
        const data = await response.json();
        if (data.success && data.data) {
          const newLugar = {
            id: data.data.id_lugar,
            title: data.data.nombre,
            subtitle: data.data.direccion,
            icon: data.data.icono
          };
          setLugares([...lugares, newLugar]);
          setIsEditOpen(false);
        } else {
          alert('Error al crear lugar');
        }
      }
    } catch (err) {
      console.error(err);
      alert('No se pudo guardar el lugar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/lugares-favoritos/${currentItem.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        setLugares(lugares.filter(l => l.id !== currentItem.id));
        setIsDeleteOpen(false);
      } else {
        alert('Error al eliminar lugar');
      }
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar el lugar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mobile-container">
      <Header title="Mis Lugares" onBack={onBack} />
      <div className="view-content">
        {loading ? (
          <div style={{textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.7)'}}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{display:'inline-block'}}>
              <span className="material-icons-round" style={{fontSize:'3rem'}}>sync</span>
            </motion.div>
            <p style={{marginTop:'1rem'}}>Cargando lugares...</p>
          </div>
        ) : error ? (
          <div style={{textAlign:'center', padding:'2rem', color:'#ff007f'}}>
            <span className="material-icons-round" style={{fontSize:'3rem'}}>error_outline</span>
            <p style={{marginTop:'1rem'}}>{error}</p>
            <button className="btn-modal btn-confirm" onClick={loadLugares} style={{marginTop:'1rem'}}>Reintentar</button>
          </div>
        ) : lugares.length === 0 ?
        (
          <div style={{textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.5)'}}>
            <span className="material-icons-round" style={{fontSize:'3rem'}}>bookmark</span>
            <p style={{marginTop:'1rem'}}>No hay lugares guardados</p>
            <p style={{fontSize:'0.9rem', marginTop:'0.5rem'}}>Presiona + para agregar uno</p>
          </div>
        ) : (
          <AnimatePresence>
            {lugares.map((lugar, i) => (
              <motion.div key={lugar.id} className="premium-card" layout initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.1 }}>
                <div className="avatar-circle"><span className="material-icons-round">{lugar.icon}</span></div>
                <div className="info-container">
                  <h4 className="info-title">{lugar.title}</h4>
                  <p className="info-subtitle"><span className="material-icons-round" style={{fontSize:14}}>place</span> {lugar.subtitle}</p>
                </div>
                <div className="action-buttons">
                  <AnimatedButton className="action-btn-mini" onClick={() => openEditModal(lugar)}><span className="material-icons-round">edit</span></AnimatedButton>
                  <AnimatedButton className="action-btn-mini delete" 
onClick={() => { setCurrentItem(lugar); setIsDeleteOpen(true); }}><span className="material-icons-round">delete_outline</span></AnimatedButton>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div className="fab-container"><AnimatedButton className="btn-fab" onClick={() => openEditModal()}><span className="material-icons-round">add</span> Nuevo</AnimatedButton></div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => !saving && setIsEditOpen(false)} title={currentItem.id ? "Editar Lugar" : "Nuevo Lugar"}>
        <div className="form-group"><label className="form-label">Nombre</label><input className="form-input" value={currentItem.title} onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})} placeholder="Ej. Casa" disabled={saving} /></div>
        <div className="form-group"><label className="form-label">Dirección</label><input className="form-input" value={currentItem.subtitle} onChange={(e) => setCurrentItem({...currentItem, subtitle: e.target.value})} placeholder="Ej. Av. Amazonas" disabled={saving} /></div>
        <div className="modal-actions"><button className="btn-modal btn-cancel" onClick={() => setIsEditOpen(false)} disabled={saving}>Cancelar</button><button className="btn-modal btn-confirm" onClick={handleSave} disabled={saving}>{saving ?
'Guardando...' : 'Guardar'}</button></div>
      </Modal>
      <Modal isOpen={isDeleteOpen} onClose={() => !saving && setIsDeleteOpen(false)} title="Eliminar" type="danger">
        <div style={{textAlign:'center', padding: '1rem'}}>¿Borrar <strong>{currentItem.title}</strong>?</div>
        <div className="modal-actions"><button className="btn-modal btn-cancel" onClick={() => setIsDeleteOpen(false)} disabled={saving}>Cancelar</button><button className="btn-modal btn-delete" onClick={handleDelete} disabled={saving}>{saving ?
'Eliminando...' : 'Borrar'}</button></div>
      </Modal>
    </div>
  );
};

export default LugaresView;