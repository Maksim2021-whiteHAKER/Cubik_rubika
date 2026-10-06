// Scripts/utils/logger.js (исправь опечатку в папке на utils, если хочешь)
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { app } from '../state.js';

export const cLog = import.meta.env.DEV ? console.log : () => {};
export const cWarn = import.meta.env.DEV ? console.warn : () => {};
export let isDev = import.meta.env.DEV;
export let stats = new Stats();

export function defActions009antHack(ambientLight, directionalLight ) {   
    import('../platform/storage.js').then(({ addPlayerCoins, spendPlayerCoins }) => {
        
        document.body.appendChild(stats.dom);

        const ambientRange = document.getElementById('ambientRange');
        const directionalRange = document.getElementById('directionalRange');
        const ambientValueLabel = document.getElementById('ambientValue');
        const directionalValueLabel = document.getElementById('directionalValue');
        const speedNumber = document.getElementById('speedNumber');
        const speedRotateControls = document.getElementById("speedRotateControls");
        const devElements = document.getElementById("devElements");
        const testBtnWindowCongrats = document.getElementById("testBtnWindowCongrats");
        const RPT = document.getElementById('k8h6p');
        const RMT = document.getElementById('k7h6p');
        
        let RPT_val = parseInt(RPT.value, 10);
        let RMT_val = parseInt(RMT.value, 10);
        
        if (devElements) devElements.style.display = 'block';

        if (ambientRange) {
            ambientRange.addEventListener('input', (e) => {
                ambientLight.intensity = Number(e.target.value);
                if (ambientValueLabel) ambientValueLabel.textContent = Number(e.target.value).toFixed(2);
            });
        }

        if (directionalRange) {
            directionalRange.addEventListener('input', (e) => {
                directionalLight.intensity = Number(e.target.value);
                if (directionalValueLabel) directionalValueLabel.textContent = Number(e.target.value).toFixed(2);
            });
        }

        if (speedNumber) {
            if (speedRotateControls) speedRotateControls.style.display = "block";
            speedNumber.addEventListener('input', (e) => {
                app.speedSet = Number(e.target.value);
            });
        }

        if (devElements && testBtnWindowCongrats) {
            testBtnWindowCongrats.addEventListener('click', () => {
                document.getElementById("congratsModal").style.display = 'block';
            });
        }

        console.log(`RPT: ${RPT_val}, RMT: ${RMT_val} true= ${RPT && RMT}`);
        if (RMT && RPT) {
            RPT.addEventListener('click', () => addPlayerCoins(RPT_val));
            RMT.addEventListener('click', () => spendPlayerCoins(RMT_val));
        }
    });
}