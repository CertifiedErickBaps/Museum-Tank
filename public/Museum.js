//Variables for objects and scene
let camera, webgl_scene, renderer, controls, stats;
let objects = [];
let tanksArr = [];
let root;
let blocker, instructions;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let prevTime = performance.now();
let velocity, direction;
let wall_colider = [];
let wall_material, info_material;

//Variables for video
let videoObj = [];

//Variables for museum walls, roof and floor
let floorUrl = "../img/cuadrosPiso.jpg";
let wallUrl = "../img/wall.jpg";
let roofUrl = "../img/roof4.png";

let size_info = {w: 20, h: 14, d: 0.5};

let SHADOW_MAP_WIDTH = 2048,
    SHADOW_MAP_HEIGHT = 2048;

let loadingManager;

/*-------------------------------------------------------------------------------------------------------------------*/

//Create webgl_scene
function createScene(canvas) {
    //Create the variables for velocity and direction
    velocity = new THREE.Vector3();
    direction = new THREE.Vector3();

    renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true, antialias: true});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.BasicShadowMap;
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 750);
    webgl_scene = new THREE.Scene();
    webgl_scene.background = new THREE.Color(0x000000);
    webgl_scene.fog = new THREE.Fog(0x000000, 1, 800);

    loadingM();

    root = new THREE.Object3D();


    // A light source positioned directly above the webgl_scene, with color fading from the sky color to the ground color.
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
    // let spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // webgl_scene.add(spotLightHelper);
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    webgl_scene.add(spotLight);
    root.add(ambientLight);

    // Create the floor and add in webgl_scene
    let map_floor = new THREE.TextureLoader(loadingManager).load(floorUrl);
    map_floor.wrapS = map_floor.wrapT = THREE.RepeatWrapping;
    map_floor.repeat.set(100, 100);
    let floor_geometry = new THREE.PlaneGeometry(1200, 850, 100, 100);
    let floor = new THREE.Mesh(floor_geometry, new THREE.MeshPhongMaterial({
        color: 0xffffff,
        // flatShading: true,
        map: map_floor,
        side: THREE.DoubleSide
    }));
    floor.rotation.x = -Math.PI / 2;
    floor.castShadow = false;
    floor.receiveShadow = true;
    floor.position.set(420, 0, -350);
    root.add(floor);

    //Create the roof and add in webgl_scene
    let map_roof = new THREE.TextureLoader(loadingManager).load(roofUrl);
    map_roof.wrapS = map_roof.wrapT = THREE.RepeatWrapping;
    map_roof.repeat.set(25, 25);
    let roofGeometry = new THREE.PlaneGeometry(1200, 850, 100, 100);
    let roof = new THREE.Mesh(roofGeometry, new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: map_roof,
        side: THREE.DoubleSide
    }));
    roof.rotation.x = -Math.PI / 2;
    // roof.castShadow = false;
    // roof.receiveShadow = true;
    roof.position.set(420, 340, -350);
    root.add(roof);

    //Create the models
    loadObjectsTanks().then(element => {
        for (const eachTank of element) {
            // console.log(element);
            root.add(eachTank);
        }
    });

    // Add the museum room
    loadWallMaterial(wallUrl);
    for (const eachWall of walls) {
        cloneWalls(eachWall.size, eachWall.position, eachWall.rotation, root);
    }

    // Add the video of history
    // for (const eachVideo of videos) {
    //     addVideo(eachVideo.position, eachVideo.rotation, eachVideo.url, eachVideo.id);
    // }

    // Add the 3D text
    for (const eachText of text) {
        loadText(eachText.message, eachText.position, eachText.rotation, eachText.propertiesFont, root);
    }


    // console.log(objects_tanks);
    for (const tank of objects_tanks) {
        // console.log(information);
        createInformation(tank.information.texture, size_info, tank.information.position, tank.information.rotation_info, webgl_scene);
    }

    initPointerLock();
    webgl_scene.add(root);
    if (!controls.isLocked) {
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);
    }
    window.addEventListener('resize', onWindowResize, false);

}

/*-------------------------------------------------------------------------------------------------------------------*/

//Loading manager
function loadingM() {
    let countLoad = 0;
    loadingManager = new THREE.LoadingManager();

    // loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
    //     console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    // };

    loadingManager.onLoad = function () {
        countLoad += 1;
        // console.log('Loading complete!');
        if (countLoad >= 4) {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('fade-out');

            // optional: remove loader from DOM via event listener
            loadingScreen.addEventListener('transitionend', onTransitionEnd);
        }


    };

    // loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    //     console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    // };
    //
    // loadingManager.onError = function (url) {
    //     console.log('There was an error loading ' + url);
    // };
}

//Load objects
async function loadObjectsTanks() {
    let loaderFBX = promisifyLoader(new THREE.FBXLoader(loadingManager));
    let loaderOBJ = promisifyLoader(new THREE.OBJLoader(loadingManager));
    let id_name = 0;
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
                ? new THREE.TextureLoader(loadingManager).load(tank.map)
                : null;
            let texture2 = tank.hasOwnProperty("map")
                ? new THREE.TextureLoader(loadingManager).load(tank.map2)
                : null;
            let normalMap = tank.hasOwnProperty("normalMap")
                ? new THREE.TextureLoader(loadingManager).load(tank.normalMap)
                : null;
            let specularMap = tank.hasOwnProperty("specularMap")
                ? new THREE.TextureLoader(loadingManager).load(tank.specularMap)
                : null;
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.shininess = 100;
                    child.material.specular = {r: 0.8, g: 0.8, b: 0.8};
                    child.material.color = {r: 1, g: 1, b: 1};
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
                        } else if (tank.obj.toLowerCase().endsWith("btr80a.fbx")) {
                            child.material.color = {r: 1, g: 1, b: 1};
                            switch (child.name) {
                                case "BTR_80_WA007":
                                    child.material.map = texture2;
                                    break;
                                default:
                                    child.material.map = texture;
                                    break;
                            }
                        } else {
                            child.material.normalMap = normalMap;
                            child.material.specularMap = specularMap;
                            child.material.map = texture;
                        }
                    }
                }
            });
            object.scale.set(tank.scale, tank.scale, tank.scale);
            object.position.set(tank.position.x, tank.position.y, tank.position.z);
            object.rotation.set(tank.rotation.x, tank.rotation.y, tank.rotation.z);
            object.name = id_name;
            id_name += 1;
            tanksArr.push(object);
        }
        return tanksArr;
    } catch (e) {
        console.log(e);
    }

}

//Load wall material
function loadWallMaterial(texture) {
    let loader = new THREE.TextureLoader(loadingManager);
    let wall_map = loader.load(texture);
    wall_material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x303030,
        shininess: 100,
        map: wall_map,
        side: THREE.DoubleSide
    });
}

//Load information
function loadInformation(texture) {
    let loader = new THREE.TextureLoader(loadingManager);
    let info_map = loader.load(texture);
    info_material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: info_map,
    });
}

//Load and Add text in webgl_scene
async function loadText(message, position, rotation, propertiesFont, root) {
    let loader = promisifyLoader(new THREE.FontLoader(loadingManager));
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
        root.add(textMesh);
    } catch (e) {
        console.log(e);
    }
}

/*-------------------------------------------------------------------------------------------------------------------*/

//Utils and functions to create objects in webgl_scene

function onTransitionEnd(event) {

    event.target.remove();

}

//Add videos in webgl_scene
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
        webgl_scene.add(movieScreen);
        videoElementsArray.push(movieScreen);
        videoObj.push(videoElementsArray);
    } catch (e) {
        console.log(e);
    }
}

//Clone walls
function cloneWalls(size, position, rotation, webgl_scene) {
    let wallGeometry = new THREE.BoxBufferGeometry(size.w, size.h, size.d);
    let wall = new THREE.Mesh(wallGeometry, wall_material);
    wall.position.set(position.x, position.y, position.z);
    wall.rotation.set(rotation.x, rotation.y, rotation.z);
    let collider = new THREE.Box3().setFromObject(wall);
    wall_colider.push(collider);
    objects.push(wall);
    webgl_scene.add(wall);
}

//Clone information
function createInformation(texture, size, position, rotation, webgl_scene) {
    loadInformation(texture);
    let info_geometry = new THREE.BoxBufferGeometry(size.w, size.h, size.d);
    let info_mesh = new THREE.Mesh(info_geometry, info_material);
    info_mesh.position.set(position.x, position.y, position.z);
    info_mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    webgl_scene.add(info_mesh);

    let cylinder_geometry = new THREE.CylinderBufferGeometry(1, 1, 10, 30);
    let material = new THREE.MeshBasicMaterial({color: 0x403f3f});
    let cylinder_mesh = new THREE.Mesh(cylinder_geometry, material);
    // console.log(info_mesh.position);
    cylinder_mesh.position.set(info_mesh.position.x, info_mesh.position.y - 6, info_mesh.position.z);
    webgl_scene.add(cylinder_mesh);
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
    controls.getObject().position.y = 10;
    webgl_scene.add(controls.getObject());
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


    if (controls.isLocked) {
        let time = performance.now();
        let delta = (time - prevTime) / 1000;

        for (const rotationTank of tanksArr) {
            if (rotationTank.name < 2) {
                rotationTank.rotation.y += (delta / 3);
            }
        }
        ;
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
        velocity.x -= velocity.x * 5.0 * delta;
        velocity.z -= velocity.z * 5.0 * delta;

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
    renderer.render(webgl_scene, camera);
}

/*-------------------------------------------------------------------------------------------------------------------*/
