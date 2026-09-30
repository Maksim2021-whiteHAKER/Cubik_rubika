// Scripts/platform/settingsStorage.js
import { getJSON, setJSON } from './storage.js';

const KEY_SAFE = 'gameSettings';

const DEFAULT = {
    stateSounds: 3,
    musicVolume: 0.5,
    soundVolume: 0.5,
    controlMode: null,
    textureTheme: 'default',
    colorTheme: 'classic',
};

let current = null;

export function getSettings() {
    if (!current) {
        const saved = getJSON(KEY_SAFE);
        current = {...DEFAULT, ...(saved || {})}
    }
    return {...current};
}

export function saveSettings(partial) {
    if (!current) getSettings();
    Object.assign(current, partial);
    setJSON(KEY_SAFE, current);
    return {...current}
}

export function resetSettings() {
    current = {...DEFAULT};
    setJSON(KEY_SAFE, current);
    return {...current}
}