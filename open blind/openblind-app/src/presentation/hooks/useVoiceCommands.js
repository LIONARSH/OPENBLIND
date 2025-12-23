// ARCHIVO 4 - JavaScript (REEMPLAZA tu archivo actual)
import { useState, useCallback, useEffect, useRef } from 'react';
import { WebSpeechRecognitionAdapter, WebSpeechSynthesisAdapter } from '../../infrastructure/voice/speech.adapter.js';
import { voiceService } from '../../application/services/voice.service.js';

const useVoiceCommands = (onCommand) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(false);

    const recognitionAdapterRef = useRef(null);
    const synthesisAdapterRef = useRef(null);

    useEffect(() => {
        const adapter = new WebSpeechRecognitionAdapter();
        recognitionAdapterRef.current = adapter;
        synthesisAdapterRef.current = new WebSpeechSynthesisAdapter();

        setIsSupported(adapter !== null);

        if (adapter) {
            adapter.onResult((newTranscript) => {
                setTranscript(newTranscript);
                const command = voiceService.processTranscript(newTranscript);
                if (onCommand) onCommand(command);
                synthesisAdapterRef.current?.speak(voiceService.getActionResponseMessage(command.action));
            });

            adapter.onError((error) => {
                console.error('Error en reconocimiento de voz:', error);
                if (error === 'network') {
                    synthesisAdapterRef.current?.speak('Error de conexión. Revisa tu red.');
                }
                setIsListening(false);
            });
        }

        return () => {
            if (recognitionAdapterRef.current?.stopListening) {
                recognitionAdapterRef.current.stopListening();
            }
            if (synthesisAdapterRef.current?.cancel) {
                synthesisAdapterRef.current.cancel();
            }
        };
    }, [onCommand]);

    const startListening = useCallback(async () => {
        if (!recognitionAdapterRef.current || isListening) return;

        try {
            setTranscript('');
            await recognitionAdapterRef.current.startListening();
            setIsListening(true);
            if (synthesisAdapterRef.current?.speak) {
                synthesisAdapterRef.current.speak('Escuchando');
            }
        } catch (error) {
            console.error('Error al iniciar escucha:', error);
            setIsListening(false);
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionAdapterRef.current?.stopListening) {
            recognitionAdapterRef.current.stopListening();
        }
        setIsListening(false);
    }, []);

    const speak = useCallback((text) => {
        if (synthesisAdapterRef.current?.speak) {
            synthesisAdapterRef.current.speak(text);
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