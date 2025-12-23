// ARCHIVO 1 - JavaScript
export const VoiceAction = {
    DASHBOARD: 'dashboard',
    LUGARES: 'lugares',
    CONTACTOS: 'contactos',
    RUTAS: 'rutas',
    UBICACION: 'ubicacion',
    HELP: 'help'
};

// No necesitamos interfaces en JS, solo documentación
/**
 * @typedef {Object} VoiceCommand
 * @property {string} rawTranscript
 * @property {string} action - Uno de: 'dashboard', 'lugares', 'contactos', 'rutas', 'ubicacion', 'help'
 * @property {Date} timestamp
 */