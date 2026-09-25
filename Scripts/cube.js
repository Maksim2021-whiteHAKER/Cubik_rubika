// Scripts/cube.js
import { cube } from './state.js';

export { initCube, initCannon } from './cube/loader.js';
export { getCubesInLayer, checkFpsHit } from './cube/raycaster.js';
export { rotateLayer, rotateWholeCube } from './cube/rotation.js';
export { isCubeSolved, checkCubeSolved, debugCheckCube } from './cube/solved.js';
export { scrambleCube, solveCube } from './cube/action.js';
export { applyColorTheme } from './cube/colors.js';

export const getObjects = () => cube.objects;
export const getstaticObjects = () => cube.staticObjects;
export const getReferenceDynamicObjects = () => cube.referenceDynamicObjects;