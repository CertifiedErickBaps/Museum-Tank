let camera, scene, renderer, controls, stats;

let objects = [];
let blocker, instructions;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let prevTime = performance.now();
let velocity, direction;
let wall_colider = [];
let wall_material;

//Variables for video
let videoObj = [];
let video = {
    position: {x: 163, y: 100, z: -150},
    rotation: {x: 0, y: -300 - 0.02, z: 0},
    url: "../img/history_of_tanks.mp4",
    id: "video-1"
};
let video2 = {
    position: {x: 985, y: 100, z: -150},
    rotation: {x: 0, y: 300 - 0.02, z: 0},
    url: "../img/inside_of_tanks.mp4",
    id: "video-2"
};

//Variables for text
let text_1 = {
    message: 'P : play/resume | SPACE : pause | R : rewind',
    position: {x: 163, y: 10, z: -30},
    rotation: {x: 0, y: -300, z: 0},
    propertiesFont: {size: 7, height: 1},
};
let text_2 = {
    message: 'History of tanks',
    position: {x: 163, y: 190, z: -60},
    rotation: {x: 0, y: -300, z: 0},
    propertiesFont: {size: 15, height: 1},
};

//Variables for museum walls, roof and floor
let floorUrl = "../img/cuadrosPiso.jpg";
let wallUrl = "../img/wall.jpg";
let roofUrl = "../img/roof4.png";

let objects_tanks = [
    t_34_85 = {
        obj: "../models/T-34-85/T-34.obj",
        map: "../models/T-34-85/tex/texture.jpg",
        normalMap: "../models/T-34-85/tex/normal.jpg",
        // specularMap: "../models/Ft_Renault/thread_spec.jpg",
        scale: 0.05,
        position: {x: 0, y: 10, z: -50}
    },
    mc_1 = {
        obj: "../models/MC1/MC1.obj",
        map: "../models/MC1/MC-1_Base_2k.bmp",
        map2: "../models/MC1/MC-1_Tracks_2k.bmp",
        scale: 12,
        position: {x: 0, y: 10, z: -100}
    },
    btr_80a = {
        obj: "../models/BTR80A/BTR80A.FBX",
        map: "../models/BTR80A/mapTexture.png",
        normalMap: "../models/BTR80A/normal.png",
        specularMap: "../models/BTR80A/spec.png",
        scale: 0.05,
        position: {x: 0, y: 10, z: -150}
    },
    t_34 = {
        obj: "../models/T-34/tank.FBX",
        map: "../models/T-34/diffuse.jpg",
        normalMap: "../models/T-34/Normal.jpg",
        specularMap: "../models/T-34/Specular.jpg",
        scale: 0.001,
        position: {x: 0, y: 10, z: -200}
    },
    panzer = {
        obj: "../models/Panzer/panzer-tank.fbx",
        map: "default",
        normalMap: "default",
        specularMap: "default",
        scale: 1,
        position: {x: 0, y: 10, z: -250}
    }
];

let SHADOW_MAP_WIDTH = 2048,
    SHADOW_MAP_HEIGHT = 2048;
/*-------------------------------------------------------------------------------------------------------------------*/

//Create scene
function createScene(canvas) {
    //Create the variables for velocity and direction
    velocity = new THREE.Vector3();
    direction = new THREE.Vector3();

    //Create the render and put the scene
    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFShadowMap;
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('resize', onWindowResize, false);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 4000);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x5c5757, 0, 1000);

    // A light source positioned directly above the scene, with color fading from the sky color to the ground color.
    // HemisphereLight( skyColor, groundColor, intensity )
    // skyColor - (optional) hexadecimal color of the sky. Default is 0xffffff.
    // groundColor - (optional) hexadecimal color of the ground. Default is 0xffffff.
    // intensity - (optional) numeric value of the light's strength/intensity. Default is 1.

    //Create the light and shadows
    let spotLight = new THREE.SpotLight(0xffffff, 0.4, 1120);//, Math.PI / 2);
    spotLight.position.set(0, 1120, 0);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    let spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(spotLight);
    scene.add(ambientLight);

    // Create the floor and add in scene
    let map_floor = new THREE.TextureLoader().load(floorUrl);
    map_floor.wrapS = map_floor.wrapT = THREE.RepeatWrapping;
    map_floor.repeat.set(128, 128);
    let floor_geometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    let floor = new THREE.Mesh(floor_geometry, new THREE.MeshPhongMaterial({
        color: 0xffffff,
        // flatShading: true,
        map: map_floor,
        side: THREE.DoubleSide
    }));
    floor.rotation.x = -Math.PI / 2;
    floor.castShadow = false;
    floor.receiveShadow = true;
    floor.position.set(0, 0, -800);
    scene.add(floor);

    //Create the roof and add in scene
    let map_roof = new THREE.TextureLoader().load(roofUrl);
    map_roof.wrapS = map_roof.wrapT = THREE.RepeatWrapping;
    map_roof.repeat.set(25, 25);
    let roofGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    let roof = new THREE.Mesh(roofGeometry, new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: map_roof,
        side: THREE.DoubleSide
    }));
    roof.rotation.x = -Math.PI / 2;
    // roof.castShadow = false;
    // roof.receiveShadow = true;
    roof.position.set(0, 340, -800);
    scene.add(roof);

    // Add the museum room
    museumRoom(scene);

    // Add the video of history
    // addVideo(video.position, video.rotation, video.url, video.id);
    // addVideo(video2.position, video2.rotation, video2.url, video2.id);

    // Add the 3D text
    loadText(text_1.message, text_1.position, text_1.rotation, text_1.propertiesFont);
    loadText(text_2.message, text_2.position, text_2.rotation, text_2.propertiesFont);

    //Create the models
    loadObjectsTanks();

    initPointerLock();

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
}

/*-------------------------------------------------------------------------------------------------------------------*/

//Load objects
async function loadObjectsTanks() {
    let loaderFBX = promisifyLoader(new THREE.FBXLoader());
    let loaderOBJ = promisifyLoader(new THREE.OBJLoader());
    try {
        let object = null;
        for (const tank of objects_tanks) {
            // console.log(tank.obj);
            if (tank.obj.toLowerCase().endsWith("fbx")) {
                // console.log("Es fbx");
                object = await loaderFBX.load(tank.obj);
            } else {
                // console.log("Es obj");
                object = await loaderOBJ.load(tank.obj);
            }

            let texture = tank.hasOwnProperty("map")
                ? new THREE.TextureLoader().load(tank.map)
                : null;
            let texture2 = tank.hasOwnProperty("map")
                ? new THREE.TextureLoader().load(tank.map2)
                : null;
            let normalMap = tank.hasOwnProperty("normalMap")
                ? new THREE.TextureLoader().load(tank.normalMap)
                : null;
            let specularMap = tank.hasOwnProperty("specularMap")
                ? new THREE.TextureLoader().load(tank.specularMap)
                : null;
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    console.log(child);
                    if (!(tank.obj.toLowerCase().endsWith("panzer-tank.fbx"))) {
                        if (tank.obj.toLowerCase().endsWith("mc1.obj")) {
                            switch (child.name) {
                                case "Body_UV.004":
                                case "Tower_UV.001":
                                case "Gun_UV.008":
                                    child.material.map = texture;
                                    break;
                                default:
                                    child.material.map = texture2;
                                    break;
                            }
                        } else {
                            child.material.normalMap = normalMap;
                            child.material.specularMap = specularMap;
                            child.material.map = texture;
                        }
                    }


                    // child.material.color = {r:1, g: 1, b: 1};
                    // child.material.envMap = null;
                    // child.material.emissive = {r: 0.1, g: 0.1, b: 0.1};
                }
            });
            object.scale.set(tank.scale, tank.scale, tank.scale);
            object.position.set(tank.position.x, tank.position.y, tank.position.z);
            scene.add(object);
        }
    } catch (e) {
        console.log(e);
    }
}

//Load wall material
function loadWallMaterial(texture) {
    let loader = new THREE.TextureLoader();
    let wall_map = loader.load(texture);
    wall_material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x303030,
        shininess: 100,
        map: wall_map,
        side: THREE.DoubleSide
    });
}

//Load and Add text in scene
async function loadText(message, position, rotation, propertiesFont) {
    let loader = promisifyLoader(new THREE.FontLoader());
    try {
        let textObject = await loader.load('../fonts/Open_Sans_Bold.json');
        let fontGeometry = new THREE.TextGeometry(message, {
            font: textObject,
            size: propertiesFont.size,
            height: propertiesFont.height,
            curveSegments: 3,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.2,
            material: 0,
            extrudeMaterial: 1,
            bevelOffset: 0,
            bevelSegments: 10
        });
        let material = new THREE.MeshBasicMaterial({color: 0x000000, flatShading: true});
        let textMesh = new THREE.Mesh(fontGeometry, material);
        fontGeometry.computeBoundingBox();
        fontGeometry.computeVertexNormals();
        // let textWidth = fontGeometry.boundingBox.max.x - fontGeometry.boundingBox.min.x;
        // textMesh.position.set(140, 100, -100 );
        textMesh.position.set(position.x, position.y, position.z);
        // textMesh.rotation.set(0, 300, 0);
        textMesh.rotation.set(rotation.x, rotation.y, rotation.z);
        scene.add(textMesh);
    } catch (e) {
        console.log(e);
    }
}

/*-------------------------------------------------------------------------------------------------------------------*/
//Utils and functions to create objects in scene

//Add walls
function museumRoom(scene) {
    loadWallMaterial(wallUrl);
    //The wall of back
    let sizeFirstRoom = {h: 370, w: 2000, d: 20};
    let rotation = {x: 0, y: 0, z: 0};
    let positionRoomBack = {x: 0, y: 180, z: 50};
    cloneWalls(sizeFirstRoom, positionRoomBack, rotation, scene);

    // The walls of the sides
    let sizeFirstRoomLR = {h: 370, w: 360, d: 20};
    let positionRoomLeft = {x: -150, y: 180, z: -140};
    let rotationSides = {x: 0, y: 300 + 0.02, z: 0};
    cloneWalls(sizeFirstRoomLR, positionRoomLeft, rotationSides, scene);

    let positionRoomRight = {x: 150, y: 180, z: -140};
    cloneWalls(sizeFirstRoomLR, positionRoomRight, rotationSides, scene);

    let sizeWallUp = {h: 250, w: 150, d: 20};
    let positionWallUp = {x: -150, y: 240, z: -395};
    let rotationWallUp = {x: 0, y: 300 + 0.02, z: 0};
    cloneWalls(sizeWallUp, positionWallUp, rotationWallUp, scene);

    let positionWallUp2 = {x: 150, y: 240, z: -395};
    cloneWalls(sizeWallUp, positionWallUp2, rotationWallUp, scene);

    let positionRoomRight2 = {x: 150, y: 180, z: -650};
    cloneWalls(sizeFirstRoomLR, positionRoomRight2, rotationSides, scene);

    let positionRoomLeft2 = {x: -150, y: 180, z: -650};
    cloneWalls(sizeFirstRoomLR, positionRoomLeft2, rotationSides, scene);

    //The wall of front
    let positionRoomFront = {x: 0, y: 180, z: -750};
    cloneWalls(sizeFirstRoom, positionRoomFront, rotation, scene);
    // console.log(objects);

    // The wall of left end
    let sizeMuseumRL = {h: 370, w: 830, d: 20};
    let positionMusemRight = {x: 1000, y: 180, z: -350};
    cloneWalls(sizeMuseumRL, positionMusemRight, rotationSides, scene);

    let positionMusemLeft = {x: -1000, y: 180, z: -350};
    cloneWalls(sizeMuseumRL, positionMusemLeft, rotationSides, scene);
}

//Add videos in scene
async function addVideo(position, rotation, videoUrl, id) {
    try {
        let videoElementsArray = [];
        let video = document.createElement("video");
        video.id = id;
        video.src = videoUrl;
        await video.load();
        videoElementsArray.push(video);
        // video.play();
        let videoImage = document.createElement('canvas');
        videoImage.width = 1280;
        videoImage.height = 720;
        let videoImageContext = videoImage.getContext('2d');
        videoImageContext.fillStyle = '#000000';
        videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
        videoElementsArray.push(videoImageContext);
        let videoTexture = new THREE.Texture(videoImage);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoElementsArray.push(videoTexture);
        let movieMaterial = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide});
        let movieGeometry = new THREE.PlaneGeometry(300, 150, 4, 4);
        let movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
        movieScreen.position.set(position.x, position.y, position.z);
        movieScreen.rotation.set(rotation.x, rotation.y, rotation.z);
        movieScreen.name = id;
        scene.add(movieScreen);
        videoElementsArray.push(movieScreen);
        videoObj.push(videoElementsArray);
    } catch (e) {
        console.log(e);
    }
}

//Clone walls
function cloneWalls(size, position, rotation, scene) {
    let wallGeometry = new THREE.BoxBufferGeometry(size.w, size.h, size.d);
    let wall = new THREE.Mesh(wallGeometry, wall_material);
    wall.position.set(position.x, position.y, position.z);
    wall.rotation.set(rotation.x, rotation.y, rotation.z);
    let collider = new THREE.Box3().setFromObject(wall);
    wall_colider.push(collider);
    objects.push(wall);
    scene.add(wall);
}

/*-------------------------------------------------------------------------------------------------------------------*/

//Controls and behaivour
function initPointerLock() {
    blocker = document.getElementById('blocker');
    instructions = document.getElementById('instructions');

    controls = new THREE.PointerLockControls(camera, document.body);

    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });

    instructions.addEventListener('click', function () {
        controls.lock();
    }, false);

    scene.add(controls.getObject());
}

function onKeyDown(event) {
    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = true;
            break;

        case 37: // left
        case 65: // a
            moveLeft = true;
            break;

        case 40: // down
        case 83: // s
            moveBackward = true;
            break;

        case 39: // right
        case 68: // d
            moveRight = true;
            break;

        case 32: // space
            videoObj.forEach(element => {
                if (controls.getObject().position.x < 400 && controls.getObject().position.x > element[3].position.x) {
                    element[0].pause();
                }
                if (controls.getObject().position.x > 785 && controls.getObject().position.x < element[3].position.x) {
                    element[0].pause();
                }
            });
            break;

        case 80:
            videoObj.forEach(element => {
                if (controls.getObject().position.x < 400 && controls.getObject().position.x > element[3].position.x) {
                    console.log(element[0].id);
                    element[0].play();
                }
                if (controls.getObject().position.x > 785 && controls.getObject().position.x < element[3].position.x) {
                    element[0].play();
                }
            });
            break;

        case 82:
            videoObj.forEach(element => {
                if (controls.getObject().position.x < 400 && controls.getObject().position.x > element[3].position.x) {
                    element[0].currentTime = 0;
                }
                if (controls.getObject().position.x > 785 && controls.getObject().position.x < element[3].position.x) {
                    element[0].currentTime = 0;
                }
            });
            break;

    }

}

function onKeyUp(event) {

    switch (event.keyCode) {
        case 38: // up
        case 87: // w
            moveForward = false;
            break;

        case 37: // left
        case 65: // a
            moveLeft = false;
            break;

        case 40: // down
        case 83: // s
            moveBackward = false;
            break;

        case 39: // right
        case 68: // d
            moveRight = false;
            break;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/*-------------------------------------------------------------------------------------------------------------------*/

//Create function of run
function run() {
    requestAnimationFrame(run);

    if (controls.isLocked === true) {
        let time = performance.now();
        let delta = (time - prevTime) / 1000;

        // if (controls.getObject().position.x < 400 && controls.getObject().position.x > videoObj[0][3].position.x) {
        //     console.log("Video 1");
        // }
        //
        // if (controls.getObject().position.x > 785 && controls.getObject().position.x < videoObj[1][3].position.x) {
        //     console.log("Video 2");
        //     //     element[0].pause();
        // }

        // videoObj.forEach(element => {
        //     if (element[0].readyState === element[0].HAVE_ENOUGH_DATA) {
        //         element[1].drawImage(element[0], 0, 0);
        //         if (element[2]) element[2].needsUpdate = true;
        //     }
        // });

        //TODO Modify later
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);

        direction.normalize(); // this ensures consistent movements in all directions
        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
        wall_colider.find(element => {
            if (element.containsPoint(controls.getObject().position)) {
                if ((direction.x > 0 && direction.z < 0) || (direction.x < 0 && direction.z > 0)) {
                    velocity.z = Math.max(0, velocity.z);
                    velocity.x = Math.max(0, velocity.x);
                    if (direction.z < 0) {
                        velocity.z -= 50 * 100.0;
                    }
                    if (direction.x < 0) {
                        velocity.x -= 50 * 100.0;
                    }
                    if (direction.z > 0) {
                        velocity.z += 50 * 100.0;
                    }
                    if (direction.x > 0) {
                        velocity.x += 50 * 100.0 * delta;
                    }
                }
                if (direction.z < 0 || direction.x < 0) {
                    velocity.z = Math.min(velocity.z, 0);
                    velocity.x = Math.min(velocity.x, 0);
                    if (direction.z < 0) {
                        velocity.z -= 50 * 100.0 * delta;
                    }
                    if (direction.x < 0) {
                        velocity.x -= 50 * 100.0 * delta;
                    }
                }
                if (direction.z > 0 || direction.x > 0) {
                    velocity.z = Math.max(0, velocity.z);
                    velocity.x = Math.max(0, velocity.x);
                    if (direction.z > 0) {
                        velocity.z += 50 * 100.0 * delta;
                    }
                    if (direction.x > 0) {
                        velocity.x += 50 * 100.0 * delta;
                    }
                }

            }
        });

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        if (controls.getObject().position.y < 10) {
            controls.getObject().position.y = 10;
        }
        prevTime = time;
    }
    renderer.render(scene, camera);
}

/*-------------------------------------------------------------------------------------------------------------------*/
