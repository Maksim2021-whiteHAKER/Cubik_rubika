// Scripts/menu/sound.js
import { game } from '../state.js';
import { getSettings, saveSettings } from '../platform/settingsStorage.js';

let music, musicBtn;

const sounds = { PAUSED: 0, ONLY_MUSIC: 1, ONLY_SOUND: 2, BOTH_ON: 3 };
const sound_pic = { PAUSED: '🔇', ONLY_MUSIC: '🎼', ONLY_SOUND: '🔊', BOTH_ON: '🎶' }


export function initSound() {
    music = document.getElementById('background_music');
    musicBtn = document.getElementById('sound_setting');
    if (!music || !musicBtn) return;

    const s = getSettings();

    // 1. Восстанавливаем состояние
    game.state_sounds = s.stateSounds ?? sounds.BOTH_ON;
    musicBtn.innerHTML = sound_pic[game.state_sounds];
    music.volume = s.musicVolume ?? 0.5;

    // 2. Синхронизируем слайдеры
    const musicRange = document.getElementById('music_range');
    const soundRange = document.getElementById('sound_range');
    if (musicRange) {
        musicRange.value = Math.round((s.musicVolume ?? 0.5) * 100);
        document.getElementById('prog_music').textContent = musicRange.value + '%';
    }
    if (soundRange) {
        soundRange.value = Math.round((s.soundVolume ?? 0.5) * 100);
        document.getElementById('prog_sound').textContent = soundRange.value + '%';
    }

    // 3. Автозапуск музыки, если включена
    if (game.state_sounds === sounds.ONLY_MUSIC || game.state_sounds === sounds.BOTH_ON) {
        music.play().catch(() => {});  // браузер может заблокировать — это ок
    }

    musicBtn.addEventListener('click', toggleSoundState);
    updateSliderValue('music_range', 'prog_music');
    updateSliderValue('sound_range', 'prog_sound');
    initSoundPresets();
}

export function toggleSoundState() {
    if (!music || !musicBtn) return;
    game.state_sounds = (game.state_sounds + 1) % 4;
    musicBtn.innerHTML = sound_pic[game.state_sounds];

    switch (game.state_sounds) {
        case sounds.PAUSED:     music.pause(); break;
        case sounds.ONLY_MUSIC: music.play().catch(e => console.error(e)); break;
        case sounds.ONLY_SOUND: music.pause(); break;
        case sounds.BOTH_ON:    music.play().catch(e => console.error(e)); break;
    }

    // ← сохраняем
    saveSettings({ stateSounds: game.state_sounds });
}

export function updateSliderValue(rangeId, labelId) {
    const range = document.getElementById(rangeId);
    const label = document.getElementById(labelId);
    if (!range || !label) return;

    range.addEventListener('input', function () {
        const volume = this.value / 100;
        label.textContent = this.value + '%';

        if (rangeId === 'music_range') {
            music.volume = volume;
            saveSettings({ musicVolume: volume });
        } else if (rangeId === 'sound_range') {
            // у тебя нет объекта для звуков — если появится, тут сохранять
            saveSettings({ soundVolume: volume });
        }
    });
}

export function initSoundPresets() {
    document.querySelectorAll('.sound-preset').forEach(preset => {
        preset.addEventListener('click', () => {
            const volume = parseInt(preset.getAttribute('data-volume'));
            
            // Устанавливаем громкость музыки
            document.getElementById('music_range').value = volume;
            music.volume = volume / 100;
            document.getElementById('prog_music').textContent = `${volume}%`;
            
            // Устанавливаем громкость звуков
            document.getElementById('sound_range').value = volume;
            document.getElementById('prog_sound').textContent = `${volume}%`;
            
            // Визуальная обратная связь
            preset.style.background = 'rgba(52, 152, 219, 0.6)';
            setTimeout(() => {
                preset.style.background = '';
            }, 300);
        });
    });
}

export function getMusic() { return music}