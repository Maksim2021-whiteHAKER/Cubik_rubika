// texturing.js
import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import { getObjects, originalMaterials, applyColorTheme } from './cube.js';

class CubeTextureManager {
    constructor() {
        this.textures = new Map();
        this.currentTheme = 'default';
    }
   
    // Загрузка текстуры
    loadTexture(TexturePath){
        return new Promise((resolve) => {
            const texture = new THREE.TextureLoader().load(TexturePath, () => {
                resolve(texture);
            });
        });
    }

    // Применение текстур по теме
    async applyTextures(theme) {
        this.currentTheme = theme;
        
        const configTheme = {
            'default': {
                clear: true
            }, 
            'girls': {
                'front': 'textures/cube/anime_green_side512.jpg',
                'back': 'textures/cube/anime_blue_side512.jpg',
                'right': 'textures/cube/anime_red_side512.jpg',
                'left': 'textures/cube/anime_orange_side512.jpg',
                'top': 'textures/cube/anime_white_side512.jpg',
                'bottom': 'textures/cube/anime_yellow_side512.jpg'
            },
            'cars': {
                'front': 'textures/cube/car_green_side512.jpg',
                'back': 'textures/cube/car_blue_side512.jpg',
                'right': 'textures/cube/car_red_side512.jpg',
                'left': 'textures/cube/car_orange_side512.jpg',
                'top': 'textures/cube/car_white_side512.jpg',
                'bottom': 'textures/cube/car_yellow_side512.jpg'
            },
            'gems': {
                'front': 'textures/cube/emerald512.jpg',
                'back': 'textures/cube/sapphire512.jpg',
                'right': 'textures/cube/ruby512.jpg',
                'left': 'textures/cube/citrine512.jpg',
                'top': 'textures/cube/amber512.jpg',
                'bottom': 'textures/cube/rock_crystal512.jpg'
            }
        };

        const config = configTheme[theme];
        if (!config){
            console.warn(`Тема текстур "${theme}" не найдена`)
            return;
        }

        if (config.clear){
            await this.clearAllTextures();
            return;
        }

        // применяем текстуры для каждой стороны
        for (const [side, TexturePath] of Object.entries(config)){
            await this.applyTexturesToSide(side, TexturePath);
        }
    }

    // Применение текстуры к конкретной стороне
    async applyTexturesToSide(side, TexturePath){
        const texture = await this.loadTexture(TexturePath);
        this.textures.set(side, texture);

        const objects = getObjects();

        objects.forEach(cube => {
            cube.traverse(mesh => {
                if (mesh.isMesh){
                    const materialName = mesh.material.name?.toLowerCase() || '';
                    const colorMatches = this.doesMaterialMatchSide(materialName, side);
                    if (colorMatches){
                        const newMaterial = mesh.material.clone();

                        newMaterial.map = null;
                        newMaterial.needsUpdate = true;

                        newMaterial.map = texture;
                        newMaterial.needsUpdate = true;

                        const originalMat = originalMaterials.get(mesh.uuid);
                        if (originalMat){
                            
                            originalMat.map = null;
                            originalMat.needsUpdate = true;

                            originalMat.map = texture;
                            originalMat.needsUpdate = true;
                        }
                        mesh.material = newMaterial;
                    }
                }
            });
        });
    }

    // Проверка соответсвия материала сторне
    doesMaterialMatchSide(materialName, side){
        const sideColors = {
            'right': ['red', 'красн', 'red.001'],
            'left': ['orange', 'оранж', 'orange.007'],
            'front': ['green', 'зелен', 'green.003'],
            'back': ['blue', 'син', 'blue.006'],
            'top': ['white', 'бел', 'white.005'],
            'bottom': ['yellow', 'желт', 'yellow.002'],
        };

        const colors = sideColors[side] || [];
        return colors.some(color => 
            materialName.includes(color.toLowerCase()) || materialName.includes(color)
        );
    }

    // Удаление всех текстур
    async clearAllTextures() {
        const objects = getObjects();

        objects.forEach(cube => {
            cube.traverse(mesh => {
                if (mesh.isMesh){
                    const originalMat = originalMaterials.get(mesh.uuid);
                    if (originalMat){
                        const cleanMaterial = originalMat.clone();

                        cleanMaterial.map = null;
                        cleanMaterial.needsUpdate = true;
                        mesh.material = cleanMaterial;

                        originalMat.map = null;
                        originalMat.needsUpdate = true;
                    } else {
                        mesh.material.map = null;
                        mesh.material.needsUpdate = true; // Сообщаем Three.js об изменении
                    }
                }
            });
        });

        this.textures.clear();
    }
}

const textureManager = new CubeTextureManager();

export async function applyTextures(theme, texture_select, selector){
    await textureManager.applyTextures(theme);    
    if (texture_select) {

        // Получаем элемент texture_select
        const textureSelect = typeof texture_select === 'string'
        ? document.querySelector(texture_select) : texture_select;

        if (!textureSelect){
            console.warn('Элемент texture_select не найден');
            return;
        }

        const textureValue = textureSelect.value;
        const isDefaultSelected = textureValue === 'default';
        let nonCassatOptionIndex = -1; // = selector.querySelector('option[value="non_cassat"]');
        for (let i = 0; i < selector.options.length; i++){
            if (selector.options[i].value === 'non_cassat'){
                nonCassatOptionIndex = i;
                break;
            }
        }
        const nonCassatOptionExists = nonCassatOptionIndex !== -1;

        if (!isDefaultSelected){
            if (!nonCassatOptionExists) {
                console.log('applyTextures: Добавляем опцию "без наложения цвета"');
                const option = new Option("без наложения цвета", "non_cassat");               
                // Добавляем опцию в конец списка
                if (selector.options.length > 0) {
                    selector.add(option, selector.options.length);
                } else {
                    selector.add(option);
                }
            } else {
                console.log('без наложения уже есть')
            }
        } else {
            if (nonCassatOptionExists) {
                console.log('applyTextures: Удаляем опцию "без наложения цвета"');
                if (selector.value === "non_cassat") {
                    selector.value = 'default';
                    applyColorTheme('classic');
                    console.log('applyTextures: Цветовая тема "classic" принудительно применена после удаления "non_cassat".')                    
                }
                selector.remove(nonCassatOptionIndex);
            }
        }
    }
}