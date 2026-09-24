// Scripts/menu/sound.js
import { game } from '../state.js';

let music, musicBtn;

const sounds = { PAUSED: 0, ONLY_MUSIC: 1, ONLY_SOUND: 2, BOTH_ON: 3 };
const sound_pic = { PAUSED: '🔇', ONLY_MUSIC: '🎼', ONLY_SOUND: '🔊', BOTH_ON: '🎶' }

export function initSound() {
    music = document.getElementById('background_music');
    musicBtn = document.getElementById('sound_setting');
    if (!music || !musicBtn) return;

    musicBtn.innerHTML = sound_pic.BOTH_ON;
    game.state_sounds = sounds.BOTH_ON;

    musicBtn.addEventListener('click', toggleSoundState)
    updateSliderValue('music_range', 'prog_music');
    updateSliderValue('sound_range', 'prog_sound');
    initSoundPresets()
}

export function toggleSoundState() {
    if (!music || !musicBtn) return
    game.state_sounds = (game.state_sounds + 1) % 4;
    switch (game.state_sounds) {
        case sounds.PAUSED:
            if (musicBtn) musicBtn.innerHTML = sound_pic.PAUSED;
            music.pause();
            break;
        case sounds.ONLY_MUSIC:
            if (musicBtn) musicBtn.innerHTML = sound_pic.ONLY_MUSIC;
            music.play().catch(e => console.error(e));
            break;
        case sounds.ONLY_SOUND:
            if (musicBtn) musicBtn.innerHTML = sound_pic.ONLY_SOUND;
            music.pause();
            break;
        case sounds.BOTH_ON:
            if (musicBtn) musicBtn.innerHTML = sound_pic.BOTH_ON;
            music.play().catch(e => console.error(e));
            break;
    }
}

export function updateSliderValue(rangeId, labelId){
    const range = document.getElementById(rangeId);
    const label = document.getElementById(labelId);

    range.addEventListener('input', function(){
        const volume = this.value / 100;
        if (rangeId === 'music_range'){
            music.volume = volume;
            
        }        
        label.textContent = this.value + '%';
    })
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