document.addEventListener('DOMContentLoaded', () => {
    if (window.location.protocol === 'file:') {
        document.body.classList.add('page-error');
        document.body.style.backgroundImage = "url('textures/pixel.jpg')";
        const menu = document.getElementById('menu_info');
        const setting = document.getElementById('menu_settings');
        const orbitCon = document.getElementById('OrbitCon');
        if (menu) menu.style.display = 'none';
        if (setting) setting.style.display = 'none';
        if (orbitCon) orbitCon.style.display = 'none';
        const errorMes = document.createElement('div');
        errorMes.id = 'eMessage';
        errorMes.textContent = 'Пожалуйста, запустите локальный сервер (например, FiveServer), чтобы приложение работало корректно. Это необходимо для безопасности CORS и загрузки ресурсов.';
        document.body.appendChild(errorMes);
        throw new Error('Приложение не может работать через file:// из-за ограничений CORS.');
    }
});