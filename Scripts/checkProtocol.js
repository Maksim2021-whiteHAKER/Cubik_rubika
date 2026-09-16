import { initMenu } from "./menu";
import { version } from '../package.json'

function convertionVer(version) {
    // 1. Убираем все не‑цифровые символы (в первую очередь точки)
    const digits = version.replace(/[^0-9]/g, ''); 
    // 2. Удаляем ведущие нули. Если после этого ничего не осталось — возвращаем "0"
    const result = digits.replace(/^0+/, '') || '0';
    return result;
}  

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.protocol === 'file:') {
        document.body.classList.add('page-error');
        document.body.style.backgroundImage = "url('textures/pixelcompress.jpg')";
        const menu = document.getElementById('menu_info');
        const setting = document.getElementById('menu_settings');
        const orbitCon = document.getElementById('OrbitCon');
        const main_menu = document.getElementById('mainMenu');
        const uiOverlay = document.getElementById('uiOverlay')
        const debugCheckButton = document.getElementById('debugCheckButton')
        if (menu) menu.style.display = 'none';
        if (setting) setting.style.display = 'none';
        if (orbitCon) orbitCon.style.display = 'none';
        if (main_menu) main_menu.style.display = 'none';
        if (uiOverlay) uiOverlay.style.display = 'none';
        if (debugCheckButton) debugCheckButton.style.display = 'none';
        const errorMes = document.createElement('div');
        errorMes.id = 'eMessage';
        errorMes.textContent = 'Пожалуйста, запустите локальный сервер (например, FiveServer), чтобы приложение работало корректно. Это необходимо для безопасности CORS и загрузки ресурсов.';
        document.body.appendChild(errorMes);
        throw new Error('Приложение не может работать через file:// из-за ограничений CORS.');
    } else {
        const versionGame = document.getElementById('ver')
        versionGame.textContent = version + "+ beta (fix)";
        let versionConv = convertionVer(version);
        document.getElementById('titleHead').textContent = "Кубик-Рубика v" + versionConv
        initMenu()
    }
});