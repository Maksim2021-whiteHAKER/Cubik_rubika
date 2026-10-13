// Scripts/utils/shif.js
import { cWarn } from "./logger";

export function e8c$32(text, lang = "ru") {
  const result = [];
  const upperText = text.toUpperCase();

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const upper = upperText[i];

    // Цифры — всегда оставляем как числа 0–9
    if (char >= "0" && char <= "9") {
      result.push(Number(char));
      continue;
    }

    if (lang === "ru") {
      // Обработка «Ё» отдельно
      if (upper === "Ё") {
        result.push(33);
        continue;
      }

      // Русские буквы А–Я
      if (upper >= "А" && upper <= "Я") {
        const code = upper.charCodeAt(0) - 1040 + 1; // А=1 … Я=32
        result.push(code);
        continue;
      }
    } else if (lang === "en") {
      // Английские буквы A–Z
      if (upper >= "A" && upper <= "Z") {
        const code = upper.charCodeAt(0) - 65 + 1; // A=1 … Z=26
        result.push(code);
        continue;
      }
    }

    // Всё, что не подошло — пропускаем
    cWarn(`Символ "${char}" при lang="${lang}" не поддерживается и пропущен`);
  }

  return result;
}

export function d8a$31(numbers, lang = "ru") {
  let result = "";

  for (const num of numbers) {
    if (typeof num !== "number") {
      cWarn(`Пропущено некорректное значение: ${num}`);
      continue;
    }

    // Если это цифра (0–9) — просто добавляем как символ
    if (num >= 0 && num <= 9) {
      result += String(num);
      continue;
    }

    let charCode;

    if (lang === "ru") {
      if (num === 33) {
        // «Ё»
        charCode = "Ё".charCodeAt(0);
      } else if (num >= 1 && num <= 32) {
        charCode = 1040 + (num - 1); // А–Я
      } else {
        cWarn(`Неизвестный код для ru: ${num}, пропущен`);
        continue;
      }
    } else if (lang === "en") {
      if (num >= 1 && num <= 26) {
        charCode = 65 + (num - 1); // A–Z
      } else if (num > 26 && num <= 33) {
        if (num === 27) charCode = 58
        if (num === 28) charCode = 35
        if (num === 29) charCode = 60
        if (num === 30) charCode = 63
        if (num === 31) charCode = 59
        if (num === 32) charCode = 38
        if (num === 33) charCode = 41
      } else {
        cWarn(`Неизвестный код для en: ${num}, пропущен`);
        continue;
      }
    } else {
      cWarn(`Неподдерживаемый lang="${lang}" для числа ${num}`);
      continue;
    }

    result += String.fromCharCode(charCode);
  }

  return result;
}


const okj1 = '5QT8<&?SORTP6Q'

export function b$932() {
    return okj1
}