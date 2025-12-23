import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header, AnimatedButton } from '../components/SharedComponents';

const UbicacionView = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Obteniendo dirección...');

  useEffect(() => {
    getLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          timestamp: new Date(position.timestamp)
        });
        getAddressFromCoords(latitude, longitude);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        switch(err.code) {
          case err.PERMISSION_DENIED:
            setError('Permiso denegado. Permite el acceso a tu ubicación.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Ubicación no disponible. Verifica tu GPS.');
            break;
          case err.TIMEOUT:
            setError('Tiempo de espera agotado. Intenta de nuevo.');
            break;
          default:
            setError('Error desconocido al obtener ubicación.');
        }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
        { headers: { 'User-Agent': 'OpenBlind-App' } }
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('No se pudo obtener la dirección');
      }
    } catch (err) {
      console.error(err);
      setAddress('Error al obtener dirección');
    }
  };

  const openInMaps = () => {
    if (location) {
      window.open(`https://www.google.com/maps?q=${location.lat},${location.lng}`, '_blank');
    }
  };

  const copyCoordinates = () => {
    if (location) {
      navigator.clipboard.writeText(`${location.lat}, ${location.lng}`);
      alert('Coordenadas copiadas');
    }
  };

  return (
    <div className="mobile-container">
      <Header title="Mi Ubicación" onBack={onBack} />
      <div className="view-content">
        {loading ? (
          <div style={{textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.7)'}}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{display:'inline-block'}}>
              <span className="material-icons-round" style={{fontSize:'3rem'}}>my_location</span>
            </motion.div>
            <p style={{marginTop:'1rem'}}>Obteniendo ubicación...</p>
          </div>
        ) : error ? (
          <div style={{textAlign:'center', padding:'2rem', color:'#ff007f'}}>
            <span className="material-icons-round" style={{fontSize:'3rem'}}>location_off</span>
            <p style={{marginTop:'1rem'}}>{error}</p>
            <button className="btn-modal btn-confirm" onClick={getLocation} style={{marginTop:'1rem'}}>Reintentar</button>
          </div>
        ) : location ?
        (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{padding:'1rem'}}>
            <div style={{background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius:'20px', padding:'2rem', textAlign:'center', marginBottom:'1.5rem', boxShadow:'0 10px 40px rgba(0,0,0,0.3)'}}>
              <motion.div animate={{scale:[1,1.1,1]}} transition={{duration:2, repeat:Infinity}}>
                <span className="material-icons-round" style={{fontSize:'4rem', color:'white'}}>location_on</span>
              </motion.div>
              <h3 style={{color:'white', marginTop:'1rem'}}>Ubicación Actual</h3>
            </div>

            <div className="premium-card" style={{marginBottom:'1rem'}}>
              <div style={{width:'100%'}}>
                <h4 className="info-title" style={{marginBottom:'0.5rem'}}>
                  <span className="material-icons-round" style={{fontSize:20, verticalAlign:'middle', marginRight:'0.5rem'}}>place</span>
                  Dirección
                </h4>
                <p style={{fontSize:'0.9rem', opacity:0.8, lineHeight:'1.5'}}>{address}</p>
              </div>
            </div>

            <div className="premium-card" style={{marginBottom:'1rem'}}>
              <div style={{width:'100%'}}>
                <h4 className="info-title" style={{marginBottom:'0.5rem'}}>
                  <span className="material-icons-round" style={{fontSize:20, verticalAlign:'middle', marginRight:'0.5rem'}}>gps_fixed</span>
                  Coordenadas GPS
                </h4>
                <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', marginTop:'0.5rem'}}>
                  <div>
                    <p style={{fontSize:'0.75rem', opacity:0.6}}>Latitud</p>
                    <p style={{fontSize:'1rem', fontWeight:'bold', color:'#00d4ff'}}>{location.lat.toFixed(6)}°</p>
                  </div>
                  <div>
                    <p style={{fontSize:'0.75rem', opacity:0.6}}>Longitud</p>
                    <p style={{fontSize:'1rem', fontWeight:'bold', color:'#ff007f'}}>{location.lng.toFixed(6)}°</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="premium-card" style={{marginBottom:'1.5rem'}}>
              <div style={{width:'100%'}}>
                <h4 className="info-title" style={{marginBottom:'0.5rem'}}>
                  <span className="material-icons-round" style={{fontSize:20, verticalAlign:'middle', marginRight:'0.5rem'}}>adjust</span>
                  Precisión
                </h4>
                <p style={{fontSize:'1.2rem', fontWeight:'bold', color:'#b026ff'}}>±{location.accuracy} metros</p>
                <p style={{fontSize:'0.75rem', opacity:0.6, marginTop:'0.25rem'}}>Última actualización: {location.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>

            <div style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
              <AnimatedButton className="btn-fab" onClick={openInMaps} style={{flex:1, minWidth:'45%'}}>
                <span className="material-icons-round">map</span> Ver en Mapa
              </AnimatedButton>
              <AnimatedButton className="btn-fab" onClick={copyCoordinates} style={{flex:1, minWidth:'45%', background:'linear-gradient(90deg, #00d4ff, #b026ff)'}}>
                <span className="material-icons-round">content_copy</span> Copiar
              </AnimatedButton>
            </div>

            <div style={{marginTop:'1rem'}}>
              <AnimatedButton className="btn-fab" onClick={getLocation} style={{width:'100%', background:'linear-gradient(90deg, #667eea, #764ba2)'}}>
                <span className="material-icons-round">refresh</span> Actualizar
              </AnimatedButton>
            </div>
          </motion.div>
        
) : null}
      </div>
    </div>
  );
};

export default UbicacionView;