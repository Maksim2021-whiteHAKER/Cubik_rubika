// Scripts/menu/form.js
import { cLog } from "../utils/logger.js";

export function updateFormStyle(textureValue, themeValue){
    const formStyle = document.getElementById('form_style');
    if (!formStyle) return;

    const ALLOWED_VALUES = ['default', 'cars', 'gems', 'girls'];

    switch(textureValue){
        case 'default':
            switch (themeValue) {
                case 'classic':
                    formStyle.src = 'textures/form_style/default.webp';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/def_neon.webp';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/def_monochrome.webp';
                    break;
                default:
                    cLog('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.webp';
                    break;
            }
            break;
        case 'cars':
            switch (themeValue){
                case 'classic':
                    formStyle.src = 'textures/form_style/cars.webp';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/cars_neon.webp';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/cars_monochrome.webp';
                    break;
                case 'non_cassat':
                    formStyle.src = 'textures/form_style/cars_noncassat.webp';
                    break
                default:
                    cLog('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.webp';
                    break;
            }
            break;
        case 'gems':
            switch (themeValue){
                case 'classic':
                    formStyle.src = 'textures/form_style/gems.webp';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/gems_neon.webp';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/gems_monochrome.webp';
                    break;
                case 'non_cassat':
                    formStyle.src = 'textures/form_style/gems_noncassat.webp';
                    break;
                default:
                    cLog('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.webp';
                    break;
            }
            break;
        case 'girls':
            switch (themeValue){
                case 'classic':
                    formStyle.src = 'textures/form_style/girls.webp';
                    break;
                case 'neon':
                    formStyle.src = 'textures/form_style/girls_neon.webp';
                    break;
                case 'monochrome':
                    formStyle.src = 'textures/form_style/girls_monochrome.webp';
                    break;
                case 'non_cassat':                        
                    formStyle.src = 'textures/form_style/girls_noncassat.webp';
                    break;
                default:
                    cLog('Неизвестная тема:', themeValue);
                    formStyle.src = 'textures/form_style/default.webp';
                    break;
                }
                break;
    };

    if (!ALLOWED_VALUES.includes(textureValue)){
        formStyle.src = 'textures/form_style/custom.webp';

    }
}
