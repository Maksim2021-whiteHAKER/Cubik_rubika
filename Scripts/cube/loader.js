// Scripts/cube/loader.js
import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import DRACOLoader from '../lib/DRACOLoader.js';
import { cube } from '../state.js'
import { cLog } from '../utils/logger.js';

const loaderGLTF = new GLTFLoader();
const LoaderDraco = new DRACOLoader();

LoaderDraco.setDecoderPath('draco/');
loaderGLTF.setDRACOLoader(LoaderDraco);

const validGroups = [
    'R1_GWR001', 'R2_WR002', 'R3_RWB003', 'R4_GR004', 'R5_CENTER_R005', 'R6_RB006', 'R7_GRY007', 'R8_RY008', 'R9_RBY009',
    'Mid1_GW001', 'Mid2_CENTER_W002', 'Mid3_WB003', 'Mid4_CENTER_G004', 'Mid5_CENTER_Black005', 'Mid6_CENTER_B006', 'Mid7_YG007', 'Mid8_CENTER_Y008', 'Mid9_YB009',
    'O1_GOW001', 'O2_OW002', 'O3_OBW003', 'O4_GO004', 'O5_CENTER_O005', 'O6_OB006', 'O7_GYO007', 'O8_YO008', 'O9_OYB009'
]

export function initCube(sceneArg, worldArg, onLoadCallback) {
    cube.scene = sceneArg;
    cube.world = worldArg;

    initCannon();

    loaderGLTF.load("models/Cubuk-rubic_UltraLITE_withoutCamera_rounded250FixPos_grbowy_fullFixCompress.glb",
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1);
            // model.position.set(0, 5 ,0)
            cube.scene.add(model);

            loaderGLTF.load("models/Cubik-Rubik_LITE_without_camera_fixCenterPosition.glb", (refgltf) => {
                cube.referenceCube = refgltf.scene;
                cube.referenceCube.scale.set(1, 1, 1)
                cube.referenceCube.position.set(0, 5, 0)
                cube.referenceCube.visible = false;
                cube.scene.add(cube.referenceCube)
            
                cube.staticObjects.length = 0;
                cube.referenceDynamicObjects.length = 0
                cube.referenceCube.traverse(child => {
                    if (child.isGroup && validGroups.includes(child.name)) {
                        child.userData.index = cube.staticObjects.length;
                        cube.staticObjects.push(child);
                        cube.referenceDynamicObjects.push(child);
                    }
                });

                cube.staticObjects.sort((a, b) => a.name.localeCompare(b.name))
                cube.referenceDynamicObjects.sort((a, b) => a.name.localeCompare(b.name));

                model.updateMatrixWorld(true)
                cube.referenceCube.updateMatrixWorld(true)
            })

            // Модель - динамика
            // cLog('***Структура модели***');
            model.traverse(child => {
                if (child.isGroup || child.isMesh) {
                    const worldPos = new THREE.Vector3();
                    child.getWorldPosition(worldPos);
                    const roundedPos = new THREE.Vector3(
                        Math.round(worldPos.x * 100) / 100, 
                        Math.round(worldPos.y * 100) / 100, 
                        Math.round(worldPos.z * 100) / 100
                    )
                    
                    // Применяем округлённые координаты
                    if (child.parent === cube.scene) {
                        child.position.set(roundedPos.x, roundedPos.y, roundedPos.z);
                    } else {
                        // Для вложенных объектов: пересчитываем локальную позицию
                        const localPos = child.parent.worldToLocal(roundedPos);
                        child.position.copy(localPos);
                    }

                    // Обновляем матрицу объекта
                    child.updateMatrix();
                    child.updateMatrixWorld(true);                    
            
                    const worldQuat = new THREE.Quaternion();
                    child.getWorldQuaternion(worldQuat);
                    if (child.isGroup && child.name !== 'Scene' ){
                        // cLog(`Гр.: ${child.name}, Тип: ${child.type}, Поз. [${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)}], Кватернион: [${worldQuat.x.toFixed(2)}, ${worldQuat.y.toFixed(2)}, ${worldQuat.z.toFixed(2)}, ${worldQuat.w.toFixed(2)}]`);
                        // cLog(`(без окр.) Гр.: ${child.name}, Тип: ${child.type}, Поз. [${worldPos.x}, ${worldPos.y}, ${worldPos.z}], Кватернион: [${worldQuat.x}, ${worldQuat.y}, ${worldQuat.z}, ${worldQuat.w}]`);
                        // cLog(`Гр.: ${child.name}, Тип: ${child.type}, Поз. [${roundedPos.x}, ${roundedPos.y}, ${roundedPos.z}], Кватернион: [${worldQuat.x}, ${worldQuat.y}, ${worldQuat.z}, ${worldQuat.w}]`);
                    }
                }
                
            });

            cube.objects.length = 0;
            model.traverse(child => {
                if (child.isGroup && validGroups.includes(child.name)) {
                    child.traverse(mesh => {
                        if (mesh.isMesh) {
                            const clonedMaterial = mesh.material.clone();
                            if (mesh.material.emissive) {
                                clonedMaterial.emissive = mesh.material.emissive.clone();
                                clonedMaterial.emissiveIntensity = mesh.material.emissiveIntensity;
                            }
                            if (mesh.material.map) clonedMaterial.map = mesh.material.map;
                            cube.originalMaterials.set(mesh.uuid, clonedMaterial);
                            mesh.castShadow = true;
                            mesh.receiveShadow = true;
                            mesh.material.emissiveIntensity = 0;
                            mesh.geometry.computeVertexNormals();
                            if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
                            mesh.raycast = THREE.Mesh.prototype.raycast;
                        }
                    });
                    child.userData.index = cube.objects.length;
                    cube.objects.push(child);

                    // эталонны
                    const worldPos = new THREE.Vector3();
                    const worldQuat = new THREE.Quaternion(); 
                    child.getWorldPosition(worldPos);
                    const roundedPos = new THREE.Vector3(
                        Math.round(worldPos.x * 100)/100, 
                        Math.round(worldPos.y * 100)/100,
                        Math.round(worldPos.z * 100)/100
                    )
                    child.getWorldQuaternion(worldQuat);
                    cube.referencePositions.set(child.name, {
                        position: roundedPos.clone(),
                        quaternion: worldQuat.clone()
                    });

                    // cLog(` Полное обозначение Объекта: ${child.name}, Тип: ${child.type}, Позиция: [${worldPos.x.toFixed(2)}, ${worldPos.y.toFixed(2)}, ${worldPos.z.toFixed(2)}]`);
                    // cLog(` Полное обозначение Объекта: ${child.name}, Тип: ${child.type}, Позиция: [${worldPos.x}, ${worldPos.y}, ${worldPos.z}]`);
                    // child.children.forEach(color => {
                    //     // const colormat = color.material
                    //     // cLog(`Название цвета: ${colormat.name}, цвет: ${colormat.color.toArray()}, тип: ${colormat.type} \n -------------------`)                                                
                    // })
                }
            });

            cube.objects.sort((a, b) => a.name.localeCompare(b.name))
            // cLog('Модель - динамика',cube.objects)
            // cLog('Эталлоны ',cube.staticObjects)

            // cLog('***Эталонные позиции***');
            cube.referencePositions.forEach((data, name) => {
                // cLog(`ЭП Гр.: ${name} Позиция: [${data.position.x.toFixed(2)}, ${data.position.y.toFixed(2)}, ${data.position.z.toFixed(2)}] Кватернион: [${data.quaternion.x.toFixed(2)}, ${data.quaternion.y.toFixed(2)}, ${data.quaternion.z.toFixed(2)}, ${data.quaternion.w.toFixed(2)}]`);
                // cLog(`ЭП Гр.: ${name} Позиция: [${data.position.x}, ${data.position.y}, ${data.position.z}] Кватернион: [${data.quaternion.x}, ${data.quaternion.y}, ${data.quaternion.z}, ${data.quaternion.w}]`);
            });
            cLog('initCube: Objects filled, length=', cube.objects.length);
            cube.objects.forEach((obj, i) => {
                // cLog(`Object ${i}: ${obj.name}, Children: ${obj.children.length}`);
            });

            const body = new CANNON.Body({
                mass: 1,
                position: new CANNON.Vec3(0, 5, 0),
                shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
            });
            cube.world.addBody(body);
            cube.bodies.push({ mesh: model, body });
            // cLog(`bodies initialized, lenght: ${cube.bodies.length}`)
            if (onLoadCallback) onLoadCallback();
        },
        undefined,
        (error) => {
            console.error("Ошибка загрузки модели:", error);
        }
    );
}

export function initCannon() {
    cube.world = new CANNON.World();
    cube.world.broadphase = new CANNON.NaiveBroadphase();
    cube.world.solver.iterations = 10;
    const groundBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 0, 0),
        shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    cube.world.addBody(groundBody);
}