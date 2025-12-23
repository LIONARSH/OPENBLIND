// ARCHIVO 2 - JavaScript
export class WebSpeechRecognitionAdapter {
    constructor(language = 'es-ES') {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Web Speech API no soportada en este navegador.');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = language;
        this.recognition.maxAlternatives = 1;
        this.listening = false;
        this.onResultCallback = null;
        this.onErrorCallback = null;

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (this.onResultCallback) this.onResultCallback(transcript);
        };

        this.recognition.onend = () => {
            this.listening = false;
        };

        this.recognition.onerror = (event) => {
            this.listening = false;
            if (this.onErrorCallback) this.onErrorCallback(event.error);
        };
    }

    startListening() {
        return new Promise((resolve, reject) => {
            if (!this.recognition) {
                reject(new Error('Reconocimiento de voz no disponible'));
                return;
            }
            if (this.listening) {
                reject(new Error('Ya se está escuchando'));
                return;
            }
            try {
                this.recognition.start();
                this.listening = true;
                resolve();
            } catch (err) {
                this.listening = false;
                reject(err);
            }
        });
    }

    stopListening() {
        if (this.recognition && this.listening) {
            this.recognition.stop();
        }
    }

    isListening() {
        return this.listening;
    }

    onResult(callback) {
        this.onResultCallback = callback;
    }

    onError(callback) {
        this.onErrorCallback = callback;
    }
}

export class WebSpeechSynthesisAdapter {
    speak(text, language = 'es-ES') {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language;
            window.speechSynthesis.speak(utterance);
        }
    }

    cancel() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
}