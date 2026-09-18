export function conversionVer(version) {
    // 1. Убираем все не‑цифровые символы (в первую очередь точки)
    const digits = version.replace(/[^0-9]/g, ''); 
    // 2. Удаляем ведущие нули. Если после этого ничего не осталось — возвращаем "0"
    const result = digits.replace(/^0+/, '') || '0';
    return result;
} 