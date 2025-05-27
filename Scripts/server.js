if (window.location.protocol === 'file'){
    let errorMes = document.createElement('div')
    errorMes.id = 'eMessage'
    document.body.appendChild(errorMes)
    let getErrMes = document.getElementById(errorMes)
    getErrMes.textContent = 'Пожалуйста, запустите локальный сервер (например, FiveServer), чтобы приложение работало корректно. Это необходимо для безопасности CORS и загрузки ресурсов.'
}