import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config/constants';
import { Header, AnimatedButton, Modal } from '../components/SharedComponents';

const ContactosView = ({ onBack }) => {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({ id: null, name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContactos();
  }, []);

  const loadContactos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/contactos`);
      const data = await response.json();
      if (data.success && data.data) {
        const mappedContactos = data.data.map(c => ({
          id: c.id_contacto,
          name: c.nombre,
          phone: c.telefono
        }));
        setContactos(mappedContactos);
      } else {
        setError('Error al cargar contactos');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (c = null) => {
    setCurrentContact(c || { id: null, name: '', phone: '' });
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (!currentContact.name || !currentContact.phone) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setSaving(true);
      if (currentContact.id) {
        const response = await fetch(`${API_URL}/contactos/${currentContact.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: currentContact.name,
            telefono: currentContact.phone
          }),
        });
        const data = await response.json();
        if (data.success) {
          setContactos(contactos.map(c => c.id === currentContact.id ? currentContact : c));
          setIsEditOpen(false);
        } else {
          alert('Error al actualizar contacto');
        }
      } else {
        const response = await fetch(`${API_URL}/contactos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: currentContact.name,
            telefono: currentContact.phone
          }),
        });
        const data = await response.json();
        if (data.success && data.data) {
          const newContact = {
            id: data.data.id_contacto,
            name: data.data.nombre,
            phone: data.data.telefono
          };
          setContactos([...contactos, newContact]);
          setIsEditOpen(false);
        } else {
          alert('Error al crear contacto');
        }
      }
    } catch (err) {
      console.error(err);
      alert('No se pudo guardar el contacto');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/contactos/${currentContact.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        setContactos(contactos.filter(c => c.id !== currentContact.id));
        setIsDeleteOpen(false);
      } else {
        alert('Error al eliminar contacto');
      }
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar el contacto');
    } finally {
      setSaving(false);
    }
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="mobile-container">
      <Header title="Contactos" onBack={onBack} />
      <div className="view-content">
        {loading ? (
          <div style={{textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.7)'}}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{display:'inline-block'}}>
              <span className="material-icons-round" style={{fontSize:'3rem'}}>sync</span>
            </motion.div>
            <p style={{marginTop:'1rem'}}>Cargando contactos...</p>
          </div>
        ) : error ? (
          <div style={{textAlign:'center', padding:'2rem', color:'#ff007f'}}>
            <span className="material-icons-round" style={{fontSize:'3rem'}}>error_outline</span>
            <p style={{marginTop:'1rem'}}>{error}</p>
            <button className="btn-modal btn-confirm" onClick={loadContactos} style={{marginTop:'1rem'}}>Reintentar</button>
          </div>
        ) : contactos.length === 0 ?
        (
          <div style={{textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.5)'}}>
            <span className="material-icons-round" style={{fontSize:'3rem'}}>contact_phone</span>
            <p style={{marginTop:'1rem'}}>No hay contactos guardados</p>
            <p style={{fontSize:'0.9rem', marginTop:'0.5rem'}}>Presiona + para agregar uno</p>
          </div>
        ) : (
          <AnimatePresence>
            {contactos.map((contact, i) => (
              <motion.div key={contact.id} className="premium-card" layout initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ delay: i * 0.1 }}>
                <div className="avatar-circle" style={{background:'linear-gradient(135deg, #ffae00, #ff007f)'}}>{contact.name.charAt(0).toUpperCase()}</div>
                <div className="info-container">
                  <h4 className="info-title">{contact.name}</h4>
                  <p className="info-subtitle"><span className="material-icons-round" style={{fontSize:14}}>phone</span> {contact.phone}</p>
                </div>
                <div className="action-buttons">
                  <motion.button className="action-btn-mini call" onClick={() => handleCall(contact.phone)} animate={{scale:[1,1.1,1]}} transition={{repeat:Infinity, duration:1.5}}><span className="material-icons-round">call</span></motion.button>
                  <AnimatedButton className="action-btn-mini" onClick={() => openEditModal(contact)}><span className="material-icons-round">edit</span></AnimatedButton>
                  <AnimatedButton className="action-btn-mini delete" onClick={() => { setCurrentContact(contact);
setIsDeleteOpen(true); }}><span className="material-icons-round">delete_outline</span></AnimatedButton>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div className="fab-container"><AnimatedButton className="btn-fab" onClick={() => openEditModal()}><span className="material-icons-round">person_add</span> Nuevo</AnimatedButton></div>
      </div>

      <Modal isOpen={isEditOpen} onClose={() => !saving && setIsEditOpen(false)} title={currentContact.id ?
"Editar Contacto" : "Nuevo Contacto"}>
        <div className="form-group"><label className="form-label">Nombre</label><input className="form-input" value={currentContact.name} onChange={(e) => setCurrentContact({...currentContact, name: e.target.value})} placeholder="Ej. Juan Pérez" disabled={saving} /></div>
        <div className="form-group"><label className="form-label">Teléfono</label><input className="form-input" type="tel" value={currentContact.phone} onChange={(e) => setCurrentContact({...currentContact, phone: e.target.value})} placeholder="099 123 4567" disabled={saving} /></div>
        <div className="modal-actions"><button className="btn-modal btn-cancel" onClick={() => setIsEditOpen(false)} disabled={saving}>Cancelar</button><button className="btn-modal btn-confirm" onClick={handleSave} disabled={saving}>{saving ?
'Guardando...' : 'Guardar'}</button></div>
      </Modal>
      <Modal isOpen={isDeleteOpen} onClose={() => !saving && setIsDeleteOpen(false)} title="Eliminar Contacto" type="danger">
        <div style={{textAlign:'center', padding: '1rem'}}>¿Estás seguro de eliminar a <strong>{currentContact.name}</strong>?</div>
        <div className="modal-actions"><button className="btn-modal btn-cancel" onClick={() => setIsDeleteOpen(false)} disabled={saving}>Cancelar</button><button className="btn-modal btn-delete" onClick={handleDelete} disabled={saving}>{saving ?
'Eliminando...' : 'Eliminar'}</button></div>
      </Modal>
    </div>
  );
};

export default ContactosView;