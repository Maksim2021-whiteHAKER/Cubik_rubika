// Scripts/state.js
export const three = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    controlsPointer: null,
    observerCamera: null,
    cameraPlayer: null, 
};

export const app = {
    CurrentActiveCam: 'observer',
    isMouseDown: false,
    isTouchDevice: false,
    speedSet: 300,
};

export const game = {
    active: false,
    mode: null,
    startTime: 0,
    solved: false,
    exitMenu: false,
    selector_theme: null,
    state_sounds: 3,
};

export const ui = {
    orbitControlSet: null,
    congratsModal: null,
};