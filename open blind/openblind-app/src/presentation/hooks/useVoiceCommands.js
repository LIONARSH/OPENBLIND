// ============================================================
// CUSTOM HOOK: useVoiceCommands (FIX NETWORK ERROR)
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';

const useVoiceCommands = (onCommand) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  // 👉 useRef evita recrear la instancia (CLAVE)
  const recognitionRef = useRef(null);

  // ============================================================
  // INICIALIZACIÓN
  // ============================================================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API no soportada');
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';
    recognition.maxAlternatives = 1;

    // ---- RESULTADO ----
    recognition.onresult = (event) => {
      const speechResult =
        event.results[0][0].transcript.toLowerCase();
      setTranscript(speechResult);
      processCommand(speechResult);
    };

    // ---- CUANDO TERMINA ----
    recognition.onend = () => {
      setIsListening(false);
    };

    // ---- ERRORES (FIX NETWORK) ----
    recognition.onerror = (event) => {
      console.error('🎤 Speech error:', event.error);
      setIsListening(false);

      if (event.error === 'network') {
        speak('Error de conexión con el servicio de voz. Intenta de nuevo.');
      }

      if (event.error === 'not-allowed') {
        alert('Permite el acceso al micrófono en el navegador');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  // ============================================================
  // PROCESAR COMANDOS
  // ============================================================
  const processCommand = (command) => {
    console.log('🎤 Comando:', command);

    const commands = {
      'inicio': 'dashboard',
      'volver': 'dashboard',
      'menu principal': 'dashboard',

      'lugares': 'lugares',
      'lugares favoritos': 'lugares',

      'contactos': 'contactos',

      'rutas': 'rutas',

      'ubicación': 'ubicacion',
      'dónde estoy': 'ubicacion',

      'ayuda': 'help',
      'comandos': 'help'
    };

    for (const [key, action] of Object.entries(commands)) {
      if (command.includes(key)) {
        onCommand?.(action);
        speak(`Abriendo ${action}`);
        return;
      }
    }

    speak('Comando no reconocido. Di ayuda para conocer los comandos.');
  };

  // ============================================================
  // TEXT TO SPEECH
  // ============================================================
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  // ============================================================
  // INICIAR ESCUCHA (PROTEGIDO)
  // ============================================================
  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;

    if (!recognition || !isSupported || isListening) return;

    try {
      setTranscript('');
      setIsListening(true);
      recognition.start();
      speak('Escuchando');
    } catch (err) {
      console.error('Error startListening:', err);
      setIsListening(false);
    }
  }, [isListening, isSupported]);

  // ============================================================
  // DETENER ESCUCHA
  // ============================================================
  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak
  };
};

export default useVoiceCommands;
