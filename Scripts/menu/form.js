// Scripts/menu/form.js
import { cLog } from "../utils/logger.js";

const STYLE_NEON = 'neon';
const STYLE_MONOCHROME = 'monochrome';
const STYLE_NONCASSAT = 'noncassat';

const FORM_STYLE = {
    default: {
        classic: 'textures/form_style/default.webp',
        neon: `textures/form_style/def_${STYLE_NEON}.webp`,
        monochrome: `textures/form_style/def_${STYLE_MONOCHROME}.webp`,
    }, 
    cars: {
        classic: 'textures/form_style/cars.webp',
        neon: `textures/form_style/cars_${STYLE_NEON}.webp`,
        monochrome: `textures/form_style/cars_${STYLE_MONOCHROME}.webp`,
        non_cassat: `textures/form_style/cars_${STYLE_NONCASSAT}.webp`,
    },
    gems: {
        classic: `textures/form_style/gems.webp`,
        neon: `textures/form_style/gems_${STYLE_NEON}.webp`,
        monochrome: `textures/form_style/gems_${STYLE_MONOCHROME}.webp`,
        non_cassat: `textures/form_style/gems_${STYLE_NONCASSAT}.webp`,
    },
    girls: {
        classic: `textures/form_style/girls.webp`,
        neon: `textures/form_style/girls_${STYLE_NEON}.webp`,
        monochrome: `textures/form_style/girls_${STYLE_MONOCHROME}.webp`,
        non_cassat: `textures/form_style/girls_${STYLE_NONCASSAT}.webp`,
    },
};

const DEFAULT_FALLBACK = 'textures/form_style/default.webp'
const CUSTOM_FALLBACK = 'textures/form_style/custom.webp';

export function updateFormStyle(textureValue, themeValue){
    const formStyle = document.getElementById('form_style');
    if (!formStyle) { cLog('[updateFormStyle] #form_style not found'); return; }

    cLog('[updateFormStyle]', { textureValue, themeValue });
    if (textureValue?.startsWith('custom_')) { formStyle.src = CUSTOM_FALLBACK; return; }

    const themeMap = FORM_STYLE[textureValue];
    if (!themeMap) {
        cLog('Неизвестная текстура:', textureValue);
        formStyle.src = DEFAULT_FALLBACK;
        return;
    }

    formStyle.src = themeMap[themeValue] || DEFAULT_FALLBACK;
}
