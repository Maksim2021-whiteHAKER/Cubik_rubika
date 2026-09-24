// Scripts/menu/help.js
import { getControlMode } from '../controlMode.js';
import { getInputType as getDeviceType } from '../utils/device.js';
import { cWarn } from '../utils/logger.js';

const helpTemplates = {
    'touch_move': `
        <li id="tm_text1"></li>
        <li id="tm_text2"></li>
        <li id="tm_text3"></li>
    `,
    'touch_trigger':`
        <li id="tt_text1"></li>
        <li id="tt_text2"></li>
        <li id="tt_text3"></li>
    `
    ,
    'control_arrows': `
        <li id="ca_text1"></li>
        <li id="ca_text2"></li>
        <li id="ca_text3"></li>
    `
    ,
    'control_mouse_move': `
     <li id="cmm_text1"></li>
     <li id="cmm_text2"></li>
     <li id="cmm_text3"></li>
    `
}

let mcTextPhoneEl;
let settingsInfoElement;

export function updateHelpContent(){
    const deviceType = getDeviceType(); // Не используется в этом примере, но может быть нужна для логики
    const controlMode = getControlMode();

    const list = document.getElementById('cube-control-list');
    const title = document.getElementById('cube-control-title'); // Получаем элемент заголовка
    const mcTextsId = ['mcText4', 'mcText5', 'mcText6', 'mcText7', 'mcText8', 'mcText9'];

    mcTextPhoneEl = document.getElementById('mcTextPhone');

    mcTextsId.forEach(id => {
        const elem = document.getElementById(id);
        if (elem){
            if (deviceType === 'touch'){
                elem.style.display = 'none';
            } else {
                elem.style.display = 'list-item';
            }
        }
    })

    // Получаем базовый перевод "Управление кубиком" из глобальной функции t
    // Предположим, в translations.js у вас есть ключ 'cube_control_base'
    let baseTitle = window.t('cube_control_base'); // Используем глобальную функцию
    // cWarn(`baseT: ${baseTitle}`)

    // помощь для телефона
    if (mcTextPhoneEl) {
        if (deviceType === 'touch') {
            mcTextPhoneEl.innerHTML = window.t('mcTextPhone');
            mcTextPhoneEl.style.display = 'list-item';
        } else {
            mcTextPhoneEl.style.display = 'none';
        }
    }

    let templateKey; // шаблон подсказки

    switch (controlMode){
        case 'control_arrows':
            title.textContent = '🕹' + baseTitle + window.t('control_suffix_arrows') + '🕹'; // СТАЛО
            templateKey = 'control_arrows';
            break;
        case 'control_mouse_move':
            title.textContent = '🕹' + baseTitle + window.t('control_suffix_mouse_move') + '🕹'; // СТАЛО
            templateKey = 'control_mouse_move';
            break;
        case 'control_touch_move':
            title.textContent = '🕹' + baseTitle + window.t('control_suffix_touch_move') + '🕹'; // СТАЛО
            templateKey = 'touch_move';
            break;
        case 'control_touch_trigger':
            title.textContent = '🕹' + baseTitle + window.t('control_suffix_touch_trigger') + '🕹';
            templateKey = 'touch_trigger';
            break;
        default:
            title.textContent = '🕹' + baseTitle + window.t('control_suffix_unknown') + '🕹';
    }
    
    let templateHTML = helpTemplates[templateKey] || 'Инструкции не доступны. / error';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = templateHTML;

    tempDiv.querySelectorAll('[id]').forEach(elem => {
        const id = elem.id;
        const prefixes = ['tm_', 'tt_', 'ca_', 'cmm_'];
        if (prefixes.some(prefix => id.startsWith(prefix))){
            elem.textContent = window.t(id) || `Перевод по ключу не найден: ${id}`; 
        }
    });

    list.innerHTML = tempDiv.innerHTML;
}

export function updateSettingTitle(){
    settingsInfoElement = document.getElementById('settings-info');
    if (!settingsInfoElement) {cWarn("Элемент #settings-info не найден для обновления заголовка."); return;}

    const emojiDev = getDeviceType() === "touch"  ? '📱' : '💻';
    settingsInfoElement.textContent = `${window.t('settings-info')} ${emojiDev}`
}

export function updateCursorMode(){
    document.body.classList.remove('control-mouse-move');

    if (getControlMode() === 'control_mouse_move'){
        document.body.classList.add('control-mouse-move');
    }
}