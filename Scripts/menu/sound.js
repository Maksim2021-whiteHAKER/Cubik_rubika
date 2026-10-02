// Scripts/menu/sound.js
import { game } from '../state.js';
import { getSettings, saveSettings } from '../platform/settingsStorage.js';
import { cLog, cWarn } from '../utils/logger.js';

let music, musicBtn;

const sounds = { PAUSED: 0, ONLY_MUSIC: 1, ONLY_SOUND: 2, BOTH_ON: 3 };
const sound_pic = { PAUSED: '🔇', ONLY_MUSIC: '🎼', ONLY_SOUND: '🔊', BOTH_ON: '🎶', };

const stateToPic = {
  [sounds.PAUSED]: sound_pic.PAUSED,
  [sounds.ONLY_MUSIC]: sound_pic.ONLY_MUSIC,
  [sounds.ONLY_SOUND]: sound_pic.ONLY_SOUND,
  [sounds.BOTH_ON]: sound_pic.BOTH_ON,
};

function updateSoundBtn() {
  if (!musicBtn) return;

  const state = game.state_sounds;
  const pic = stateToPic[state];

  cLog('state:', state, 'pic:', pic);

  if (pic !== undefined) {
    musicBtn.innerHTML = pic;
  } else {
    cWarn('Предупреждение: неизвестное состояние звука:', state);
  }
}

function applySliderValue(rangeId, labelId, volume) {
  const range = document.getElementById(rangeId);
  const label = document.getElementById(labelId);
  if (!range || !label) return;

  range.value = volume;
  label.textContent = `${volume}%`;
}

export function initSound() {
  music = document.getElementById('background_music');
  musicBtn = document.getElementById('sound_setting');

  if (!music || !musicBtn) {
    cWarn('Элементы звука не найдены');
    return;
  }

  const s = getSettings();

  // Безопасное восстановление состояния
  let savedState = Number(s.stateSounds);
  if (savedState < 0 || savedState > 3 || Number.isNaN(savedState)) {
    savedState = sounds.BOTH_ON;
  }
  game.state_sounds = savedState;

  updateSoundBtn();
  music.volume = Number(s.musicVolume) ?? 0.5;

  // Инициализация слайдеров (только установка значений)
  applySliderValue('music_range', 'prog_music', Math.round((music.volume ?? 0.5) * 100));
  applySliderValue('sound_range', 'prog_sound', Math.round((s.soundVolume ?? 0.5) * 100));

  // Навешиваем слушатели ОДИН РАЗ
  const musicRange = document.getElementById('music_range');
  if (musicRange) {
    musicRange.addEventListener('input', () => {
      const volume = musicRange.value / 100;
      document.getElementById('prog_music').textContent = `${musicRange.value}%`;
      if (music) music.volume = volume;
      saveSettings({ musicVolume: volume });
    });
  }

  const soundRange = document.getElementById('sound_range');
  if (soundRange) {
    soundRange.addEventListener('input', () => {
      const volume = soundRange.value / 100;
      document.getElementById('prog_sound').textContent = `${soundRange.value}%`;
      saveSettings({ soundVolume: volume });
    });
  }

  // Автозапуск музыки
  if (
    game.state_sounds === sounds.ONLY_MUSIC ||
    game.state_sounds === sounds.BOTH_ON
  ) {
    music.play().catch(() => {});
  }

  musicBtn.addEventListener('click', toggleSoundState);
  initSoundPresets();
}

export function toggleSoundState() {
  if (!music || !musicBtn) return;

  game.state_sounds = (game.state_sounds + 1) % 4;
  updateSoundBtn();

  switch (game.state_sounds) {
    case sounds.PAUSED:
      music.pause();
      break;
    case sounds.ONLY_MUSIC:
      music.play().catch(e => cLog('Ошибка воспроизведения музыки', e));
      break;
    case sounds.ONLY_SOUND:
      music.pause();
      break;
    case sounds.BOTH_ON:
      music.play().catch(e => cLog('Ошибка воспроизведения музыки', e));
      break;
  }

  saveSettings({ stateSounds: game.state_sounds });
}

export function initSoundPresets() {
  document.querySelectorAll('.sound-preset').forEach(preset => {
    preset.addEventListener('click', () => {
      const volume = parseInt(preset.getAttribute('data-volume'), 10);
      if (Number.isNaN(volume)) return;

      const musicRange = document.getElementById('music_range');
      const soundRange = document.getElementById('sound_range');

      if (musicRange) {
        musicRange.value = volume;
        if (music) music.volume = volume / 100;
        document.getElementById('prog_music').textContent = `${volume}%`;
      }

      if (soundRange) {
        soundRange.value = volume;
        document.getElementById('prog_sound').textContent = `${volume}%`;
      }

      // Визуальная обратная связь
      const originalBg = preset.style.background;
      preset.style.background = 'rgba(52, 152, 219, 0.6)';
      setTimeout(() => {
        preset.style.background = originalBg;
      }, 300);
    });
  });
}

export function getMusic() {
  return music;
}
