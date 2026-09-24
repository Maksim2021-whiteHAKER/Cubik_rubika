// Scripts/translations.js
import { showClearNotification } from "./menu/data.js";
import { cLog, cWarn } from "./utils/logger.js";
import { translations } from "./translationsLanguages.js";

let version_game = 'lite'

function getUserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    // Проверяем, поддерживаем ли мы этот язык, если нет - используем 'ru' по умолчанию
    return translations['title'] && translations['title'][langCode] ? langCode : 'ru';
}

let currentLanguage = getUserLanguage();

// 4. Функция для получения перевода по ключу
function t(key, params = {}) {
    const translationObj = translations[key];
    if (!translationObj) {
        cWarn(`Translation key '${key}' not found.`);
        return key;
    }

    let translatedText = translationObj[currentLanguage];
    if (translatedText === undefined) {
        cWarn(`Translation for key '${key}' not found for language '${currentLanguage}'.`);
        translatedText = translationObj['ru'] || key;
    }

    for (const [paramKey, paramValue] of Object.entries(params)) {
        const placeholder = `{{${paramKey}}}`;
        translatedText = translatedText.replace(new RegExp(placeholder, 'g'), paramValue);
    }

    return translatedText;
}

// 5. Функция для применения переводов
function applyTranslations() {
    for (const key in translations) {
        if (translations.hasOwnProperty(key)) {
            const element = document.getElementById(key);
            if (element) {
                const translatedText = t(key);

                if (translatedText.includes('<') && translatedText.includes('>')) {
                    element.innerHTML = translatedText;
                } else {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        if (element.hasAttribute('placeholder')) {
                            element.placeholder = translatedText;
                        } else {
                            element.value = translatedText;
                        }
                    } else if (element.tagName === 'IMG') {
                        element.alt = translatedText;
                    } else {
                        element.textContent = translatedText;
                    }
                }
            }
        }
    }
}

// 6. Функция для смены языка
function changeLanguage(newLang) {
    if (translations['title'] && translations['title'][newLang] !== undefined) {
        currentLanguage = newLang;
        applyTranslations();
        if (typeof window.updateHelpContent === 'function') {
            window.updateHelpContent();
        }
    } else {
        cWarn(`Language '${newLang}' is not supported.`);
    }
}

cLog(`Translation system initialized. Current language: ${currentLanguage}`);

// --- Данные для слайдера языков ---
const sliderLanguages = [
    { code: 'ru', name: 'Русский' },
    { code: 'sr', name: 'Српски' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh-CN', name: '中文' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'ar', name: 'العربية' },
    { code: 'tr', name: 'Türkçe' },
];

let flagImages = {};
let flagEmoji = {};
let flagNames = {};

const emoji = [
    { lang: 'Россия', name: 'ru', symbol: 'RU' },
    { lang: 'Србија', name: 'sr', symbol: 'RS' },
    { lang: 'USA', name: 'en', symbol: 'USA' },
    { lang: 'España', name: 'es', symbol: 'ES' },
    { lang: '中国', name: 'zh-CN', symbol: '中国' },
    { lang: 'France', name: 'fr', symbol: 'FR' },
    { lang: 'Deutschland', name: 'de', symbol: 'DE' },
    { lang: '日本', name: 'ja', symbol: '日本' },
    { lang: 'Brasil', name: 'pt-BR', symbol: 'BR' },
    { lang: 'المملكة العربية السعودية', name: 'ar', symbol: 'AE' },
    { lang: 'Türkiye', name: 'tr', symbol: 'TUR' },
];

function logicSlider() {
    setTimeout(() => {
        const sliderContainer = document.getElementById('languageSliderContainer');
        const sliderFlagsContainer = document.getElementById('sliderFlags');
        const sliderPrevBtn = document.getElementById('sliderPrev');
        const sliderNextBtn = document.getElementById('sliderNext');
        const currentLang = window.currentLanguage || 'ru';
        
        if (!window.currentLanguage) {
            showClearNotification(
                'Language not found in my library, default language is Russian, but you can choose from the suggested languages for now.',
                'Language help'
            );
        }
        
        const typeVersion = document.getElementById('typeVersion');

        if (!sliderContainer || !sliderFlagsContainer || !sliderPrevBtn || !sliderNextBtn) {
            cWarn('Элементы слайдера языка не найдены в DOM.');
            return;
        }

        let currentIndex = sliderLanguages.findIndex(lang => lang.code === currentLang);
        if (currentIndex === -1) currentIndex = 0;

        function updateSlider() {
            sliderFlagsContainer.innerHTML = '';

            const prevIndex = (currentIndex - 1 + sliderLanguages.length) % sliderLanguages.length;
            const nextIndex = (currentIndex + 1) % sliderLanguages.length;

            const flagsToDisplay = [prevIndex, currentIndex, nextIndex];
            flagsToDisplay.forEach((index, position) => {
                const langData = sliderLanguages[index];
                const flagBtn = document.createElement('button');
                flagBtn.className = 'lang-flag-btn';
                if (index === currentIndex) {
                    flagBtn.classList.add('active');
                }
                flagBtn.setAttribute('data-lang', langData.code);
                flagBtn.setAttribute('title', langData.name);

                const flagContent = document.createElement('div');
                flagContent.style.display = 'flex';
                flagContent.style.flexDirection = 'column';
                flagContent.style.alignItems = 'center';
                flagContent.style.justifyContent = 'center';
                flagContent.style.gap = '0.5px';

                let flagElement;
                // Исправлен оператор & на &&
                if (version_game === 'full' && flagImages[langData.code]) {
                    const flagImg = document.createElement('img');
                    typeVersion.textContent = 'Full';
                    flagImg.className = 'lang-flag-img';
                    flagImg.src = flagImages[langData.code];
                    flagImg.alt = langData.name || langData.code.toUpperCase();

                    flagImg.onerror = function () {
                        cLog(`[${langData.code}] Эмодзи fallback triggered`);
                        this.style.display = 'none';
                        const emojiSpan = document.createElement('span');
                        emojiSpan.className = 'lang-flag-emoji';
                        emojiSpan.textContent = flagEmoji[langData.code] || langData.code.toUpperCase();
                        flagBtn.appendChild(emojiSpan);
                    };
                    flagElement = flagImg;
                } else {
                    const emojiSpan = document.createElement('span');
                    emojiSpan.className = 'lang-flag-emoji';
                    emojiSpan.textContent = flagEmoji[langData.code] || langData.code.toUpperCase();
                    flagElement = emojiSpan;
                }

                flagContent.appendChild(flagElement);

                const nameDiv = document.createElement('div');
                nameDiv.className = 'lang-flag-name';
                nameDiv.textContent = flagNames[langData.code] || langData.name;
                nameDiv.style.fontSize = '15px';
                nameDiv.style.textAlign = 'center';
                nameDiv.style.overflow = 'hidden';
                nameDiv.style.textOverflow = 'ellipsis';
                nameDiv.style.whiteSpace = 'nowrap';
                nameDiv.title = flagNames[langData.code] || langData.name;

                flagContent.appendChild(nameDiv);
                flagBtn.appendChild(flagContent);
                sliderFlagsContainer.appendChild(flagBtn);

                flagBtn.addEventListener('click', () => {
                    if (typeof window.changeLanguage === 'function') {
                        window.changeLanguage(langData.code);
                        currentIndex = index;
                        updateSlider();
                    }
                });
            });
        }

        sliderPrevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + sliderLanguages.length) % sliderLanguages.length;
            updateSlider();
        });

        sliderNextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % sliderLanguages.length;
            updateSlider();
        });

        updateSlider();

    }, 150);
}

// Назначаем глобальные переменные СРАЗУ, чтобы они были доступны до загрузки DOM
if (typeof window !== 'undefined') {
    window.t = t;
    window.applyTranslations = applyTranslations;
    window.changeLanguage = changeLanguage;
    window.currentLanguage = currentLanguage;
}

// Инициализация перевода при загрузке DOM (вызывается ОДИН РАЗ)
function initializeTranslationsOnDOMLoad() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyTranslations();
            if (typeof logicSlider === 'function') logicSlider();
        });
    } else {
        applyTranslations();
        if (typeof logicSlider === 'function') logicSlider();
    }
}

initializeTranslationsOnDOMLoad();

export { logicSlider, sliderLanguages, emoji, changeLanguage };