// ARCHIVO 3 - JavaScript
import { VoiceAction } from '../../domain/models/voice.model.js';

export class VoiceService {
    constructor() {
        this.commandMap = new Map([
            ['inicio', VoiceAction.DASHBOARD],
            ['volver', VoiceAction.DASHBOARD],
            ['menu principal', VoiceAction.DASHBOARD],
            ['lugares', VoiceAction.LUGARES],
            ['lugares favoritos', VoiceAction.LUGARES],
            ['contactos', VoiceAction.CONTACTOS],
            ['rutas', VoiceAction.RUTAS],
            ['ubicación', VoiceAction.UBICACION],
            ['dónde estoy', VoiceAction.UBICACION],
            ['ayuda', VoiceAction.HELP],
            ['comandos', VoiceAction.HELP]
        ]);
    }

    processTranscript(rawTranscript) {
        const lowerTranscript = rawTranscript.toLowerCase();
        let detectedAction = VoiceAction.HELP;

        for (const [key, action] of this.commandMap.entries()) {
            if (lowerTranscript.includes(key)) {
                detectedAction = action;
                break;
            }
        }

        return {
            rawTranscript,
            action: detectedAction,
            timestamp: new Date()
        };
    }

    getActionResponseMessage(action) {
        const messages = {
            [VoiceAction.DASHBOARD]: 'Navegando al inicio',
            [VoiceAction.LUGARES]: 'Abriendo tus lugares favoritos',
            [VoiceAction.CONTACTOS]: 'Accediendo a contactos',
            [VoiceAction.RUTAS]: 'Calculando rutas',
            [VoiceAction.UBICACION]: 'Buscando tu ubicación',
            [VoiceAction.HELP]: 'Mostrando ayuda'
        };
        return messages[action] || 'Acción completada';
    }
}

export const voiceService = new VoiceService();