// ============================================================
// COMPONENTE: UbicacionView - Vista de Ubicación Actual
// ============================================================
// Este componente muestra la ubicación GPS actual del usuario
// usando la API de Geolocalización del navegador
// ============================================================

const UbicacionView = ({ onBack }) => {
  // Estados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Obteniendo dirección...');
  const [watchId, setWatchId] = useState(null);

  // ============================================================
  // EFECTO: Obtener ubicación al montar el componente
  // ============================================================
  useEffect(() => {
    getLocation();
    
    // Cleanup: detener el seguimiento al desmontar
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // ============================================================
  // FUNCIÓN: Obtener ubicación actual
  // ============================================================
  const getLocation = () => {
    setLoading(true);
    setError(null);

    // Verificar si el navegador soporta Geolocalización
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      setLoading(false);
      return;
    }

    // Opciones de geolocalización
    const options = {
      enableHighAccuracy: true, // Usar GPS de alta precisión
      timeout: 10000, // Timeout de 10 segundos
      maximumAge: 0 // No usar caché
    };

    // Obtener posición actual (una sola vez)
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy), // Precisión en metros
          timestamp: new Date(position.timestamp)
        });
        
        // Obtener dirección mediante geocodificación inversa
        getAddressFromCoords(latitude, longitude);
        
        setLoading(false);
        
        // Iniciar seguimiento continuo (opcional)
        startWatchingPosition(options);
      },
      // Error callback
      (err) => {
        console.error('Error de geolocalización:', err);
        
        // Mensajes de error personalizados
        switch(err.code) {
          case err.PERMISSION_DENIED:
            setError('Permiso denegado. Por favor, permite el acceso a tu ubicación.');
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
      options
    );
  };

  // ============================================================
  // FUNCIÓN: Seguimiento continuo de ubicación
  // ============================================================
  const startWatchingPosition = (options) => {
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          timestamp: new Date(position.timestamp)
        });
      },
      (err) => {
        console.error('Error en watchPosition:', err);
      },
      options
    );
    
    setWatchId(id);
  };

  // ============================================================
  // FUNCIÓN: Geocodificación inversa (coordenadas → dirección)
  // ============================================================
  const getAddressFromCoords = async (lat, lng) => {
    try {
      // Usando Nominatim de OpenStreetMap (GRATIS, sin API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'OpenBlind-App' // Requerido por Nominatim
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress('No se pudo obtener la dirección');
      }
    } catch (err) {
      console.error('Error en geocodificación:', err);
      setAddress('Error al obtener dirección');
    }
  };

  // ============================================================
  // FUNCIÓN: Abrir en Google Maps
  // ============================================================
  const openInMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
      window.open(url, '_blank');
    }
  };

  // ============================================================
  // FUNCIÓN: Copiar coordenadas al portapapeles
  // ============================================================
  const copyCoordinates = () => {
    if (location) {
      const coords = `${location.lat}, ${location.lng}`;
      navigator.clipboard.writeText(coords);
      alert('Coordenadas copiadas al portapapeles');
    }
  };

  // ============================================================
  // RENDERIZADO
  // ============================================================
  return (
    <div className="mobile-container">
      <Header title="Mi Ubicación" onBack={onBack} />
      
      <div className="view-content">
        {/* ---- ESTADO DE CARGA ---- */}
        {loading ? (
          <div style={{textAlign:'center', padding:'2rem', color:'rgba(255,255,255,0.7)'}}>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{display:'inline-block'}}
            >
              <span className="material-icons-round" style={{fontSize:'3rem'}}>my_location</span>
            </motion.div>
            <p style={{marginTop:'1rem'}}>Obteniendo ubicación...</p>
            <p style={{fontSize:'0.8rem', marginTop:'0.5rem', opacity:0.7}}>
              Asegúrate de permitir el acceso a tu ubicación
            </p>
          </div>
        ) : error ? (
          /* ---- ESTADO DE ERROR ---- */
          <div style={{textAlign:'center', padding:'2rem', color:'#ff007f'}}>
            <span className="material-icons-round" style={{fontSize:'3rem'}}>location_off</span>
            <p style={{marginTop:'1rem'}}>{error}</p>
            <button className="btn-modal btn-confirm" onClick={getLocation} style={{marginTop:'1rem'}}>
              Reintentar
            </button>
          </div>
        ) : location ? (
          /* ---- UBICACIÓN OBTENIDA ---- */
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            style={{padding:'1rem'}}
          >
            {/* Mapa visual (simulado) */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="material-icons-round" style={{fontSize:'4rem', color:'white'}}>
                  location_on
                </span>
              </motion.div>
              <h3 style={{color:'white', marginTop:'1rem'}}>Ubicación Actual</h3>
            </div>

            {/* Tarjeta de información */}
            <div className="premium-card" style={{marginBottom:'1rem'}}>
              <div style={{width:'100%'}}>
                <h4 className="info-title" style={{marginBottom:'0.5rem'}}>
                  <span className="material-icons-round" style={{fontSize:20, verticalAlign:'middle', marginRight:'0.5rem'}}>
                    place
                  </span>
                  Dirección
                </h4>
                <p style={{fontSize:'0.9rem', opacity:0.8, lineHeight:'1.5'}}>
                  {address}
                </p>
              </div>
            </div>

            {/* Coordenadas */}
            <div className="premium-card" style={{marginBottom:'1rem'}}>
              <div style={{width:'100%'}}>
                <h4 className="info-title" style={{marginBottom:'0.5rem'}}>
                  <span className="material-icons-round" style={{fontSize:20, verticalAlign:'middle', marginRight:'0.5rem'}}>
                    gps_fixed
                  </span>
                  Coordenadas GPS
                </h4>
                <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', marginTop:'0.5rem'}}>
                  <div>
                    <p style={{fontSize:'0.75rem', opacity:0.6}}>Latitud</p>
                    <p style={{fontSize:'1rem', fontWeight:'bold', color:'#00d4ff'}}>
                      {location.lat.toFixed(6)}°
                    </p>
                  </div>
                  <div>
                    <p style={{fontSize:'0.75rem', opacity:0.6}}>Longitud</p>
                    <p style={{fontSize:'1rem', fontWeight:'bold', color:'#ff007f'}}>
                      {location.lng.toFixed(6)}°
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Precisión */}
            <div className="premium-card" style={{marginBottom:'1.5rem'}}>
              <div style={{width:'100%'}}>
                <h4 className="info-title" style={{marginBottom:'0.5rem'}}>
                  <span className="material-icons-round" style={{fontSize:20, verticalAlign:'middle', marginRight:'0.5rem'}}>
                    adjust
                  </span>
                  Precisión
                </h4>
                <p style={{fontSize:'1.2rem', fontWeight:'bold', color:'#b026ff'}}>
                  ±{location.accuracy} metros
                </p>
                <p style={{fontSize:'0.75rem', opacity:0.6, marginTop:'0.25rem'}}>
                  Última actualización: {location.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
              <AnimatedButton 
                className="btn-fab" 
                onClick={openInMaps}
                style={{flex:1, minWidth:'45%'}}
              >
                <span className="material-icons-round">map</span> Ver en Mapa
              </AnimatedButton>
              
              <AnimatedButton 
                className="btn-fab" 
                onClick={copyCoordinates}
                style={{flex:1, minWidth:'45%', background:'linear-gradient(90deg, #00d4ff, #b026ff)'}}
              >
                <span className="material-icons-round">content_copy</span> Copiar
              </AnimatedButton>
            </div>

            {/* Botón de actualizar */}
            <div style={{marginTop:'1rem'}}>
              <AnimatedButton 
                className="btn-fab" 
                onClick={getLocation}
                style={{width:'100%', background:'linear-gradient(90deg, #667eea, #764ba2)'}}
              >
                <span className="material-icons-round">refresh</span> Actualizar Ubicación
              </AnimatedButton>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

// ============================================================
// NOTAS IMPORTANTES:
// ============================================================
// 1. Requiere HTTPS en producción (o localhost en desarrollo)
// 2. El usuario debe dar permiso explícito
// 3. Nominatim es gratuito pero tiene límites de uso
// 4. Alternativa: Google Maps Geocoding API (requiere API key)
// ============================================================