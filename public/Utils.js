const objects_tanks = [

    // austin =
    {
        obj: "../models/austin.fbx",
        map: "../models/Default/mapDefault.png",
        scale: 0.06,
        position: {x: 0, y: 20, z: -200},
        rotation: {x: 0, y: 0, z: 0},
        information: {
            texture: "../info/Austin_Info.png",
            position: {x: 0, y: 10, z: -150},
            rotation_info: {x: -0.7, y: 0, z: 0}
        }
    },

    // mc_1 =
    {
        obj: "../models/MC1/MC1.obj",
        map: "../models/MC1/MC-1_Base_2k_r.bmp",
        map2: "../models/MC1/MC-1_Tracks_2k_r.bmp",
        scale: 25,
        position: {x: 0, y: 0, z: -450},
        rotation: {x: 0, y: 0, z: 0},
        information: {
            texture: "../info/Renault_Info.png",
            position: {x: 0, y: 10, z: -380},
            rotation_info: {x: -0.7, y: 0, z: 0}
        }
    },

    // t_34_85 =
    {
        obj: "../models/T-34-85/T-34.obj",
        map: "../models/T-34-85/tex/texture.jpg",
        normalMap: "../models/T-34-85/tex/normal.jpg",
        rotation: {x: 0, y: -Math.PI / 1.3, z: 0},
        scale: 0.20,
        position: {x: 550, y: 0, z: -50},
        information: {
            texture: "../info/T_34_85_Info.png",
            position: {x: 550, y: 10, z: -120},
            rotation_info: {x: 0.7, y: 0, z: 0}
        }
    },


    // t_34 =
    {
        obj: "../models/T-34/tank.FBX",
        map: "../models/T-34/diffuse.jpg",
        normalMap: "../models/T-34/Normal.jpg",
        specularMap: "../models/T-34/Specular.jpg",
        scale: 0.01,
        position: {x: 850, y: 35, z: -400},
        rotation: {x: 0, y: -Math.PI / 1.4, z: 0},
        information: {
            texture: "../info/T_34_Info.png",
            position: {x: 770, y: 10, z: -400},
            rotation_info: {x: 0, y: Math.PI / 2, z: 0}
        }
    },

    // btr_80a =
    {
        obj: "../models/BTR80A/BTR80A.FBX",
        map: "../models/BTR80A/mapTexture.png",
        map2: "../models/BTR80A/btr_wheel.png",
        normalMap: "../models/BTR80A/normal.png",
        specularMap: "../models/BTR80A/spec.png",
        scale: 0.21,
        position: {x: 800, y: 0, z: -650},
        rotation: {x: 0, y: -Math.PI / 4.5, z: 0},
        information: {
            texture: "../info/Btr80_Info.png",
            position: {x: 800, y: 10, z: -540},
            rotation_info: {x: -0.7, y: 0, z: 0}
        }
    },

    // t_26 =
    {
        obj: "../models/T-26/t26.obj",
        map: "../models/Default/mapDefault.png",
        scale: 0.7,
        position: {x: 300, y: 5, z: -650},
        rotation: {x: 0, y: -Math.PI / 5.6, z: 0},
        information: {
            texture: "../info/T_26_Info.png",
            position: {x: 300, y: 10, z: -540},
            rotation_info: {x: -0.7, y: 0, z: 0}
        }
    },

    // kv_2 =
    {
        obj: "../models/Kv2/kv2.FBX",
        map: "../models/Default/mapDefault.png",
        scale: 0.047,
        position: {x: 500, y: 0, z: -300},
        rotation: {x: 0, y: -Math.PI / 1.5, z: 0},
        information: {
            texture: "../info/Kv2_Info.png",
            position: {x: 400, y: 10, z: -300},
            rotation_info: {x: 0, y: Math.PI / 2, z: 0}
        }
    },



    // leopard =
    {
        obj: "../models/Leopard/leopard.obj",
        map: "../models/leopard/map.jpg",
        normalMap: "default",
        specularMap: "default",
        scale: 15,
        position: {x: 550, y: 0, z: -650},
        rotation: {x: 0, y: -Math.PI / 3.5, z: 0},
        information: {
            texture: "../info/Panzer_Info.png",
            position: {x: 550, y: 10, z: -540},
            rotation_info: {x: -0.7, y: 0, z: 0}
        }
    }
];

//Variables for text
const text = [
    text_1 = {
        message: 'P : play/resume | SPACE : pause | R : rewind',
        position: {x: 163, y: 10, z: -30},
        rotation: {x: 0, y: Math.PI / 2, z: 0},
        propertiesFont: {size: 7, height: 1},
    },
    text_2 = {
        message: 'History of tanks',
        position: {x: 163, y: 190, z: -60},
        rotation: {x: 0, y: Math.PI / 2, z: 0},
        propertiesFont: {size: 15, height: 1},
    },
    text_3 = {
        message: 'P : play/resume | SPACE : pause | R : rewind',
        position: {x: 985, y: 10, z: -245},
        rotation: {x: 0, y: -Math.PI / 2, z: 0},
        propertiesFont: {size: 7, height: 1},
    },
    text_4 = {
        message: 'Inside of tank T - 38',
        position: {x: 985, y: 190, z: -225},
        rotation: {x: 0, y: -Math.PI / 2, z: 0},
        propertiesFont: {size: 15, height: 1},
    },
];

//Videos
const videos = [
    video = {
        position: {x: 163, y: 100, z: -150},
        rotation: {x: 0, y: -300 - 0.02, z: 0},
        url: "../img/history_of_tanks.mp4",
        id: "video-1"
    },
    video2 = {
        position: {x: 985, y: 100, z: -150},
        rotation: {x: 0, y: 300 - 0.02, z: 0},
        url: "../img/inside_of_tanks.mp4",
        id: "video-2"
    }
];

const walls = [
    {
        size: {h: 370, w: 1200, d: 20},
        rotation: {x: 0, y: 0, z: 0},
        position: {x: 420, y: 180, z: 50},
    },
    {
        size: {h: 370, w: 830, d: 20},
        rotation: {x: 0, y: 300 + 0.02, z: 0},
        position: {x: -150, y: 180, z: -350},
    },
    {
        size: {h: 370, w: 360, d: 20},
        rotation: {x: 0, y: 300 + 0.02, z: 0},
        position: {x: 150, y: 180, z: -140},
    },
    // {
    //     size: {h: 250, w: 150, d: 20},
    //     rotation: {x: 0, y: 300 + 0.02, z: 0},
    //     position: {x: -150, y: 240, z: -395},
    // },
    {
        size: {h: 250, w: 150, d: 20},
        rotation: {x: 0, y: 300 + 0.02, z: 0},
        position: {x: 150, y: 240, z: -395},
    },
    {
        size: {h: 370, w: 360, d: 20},
        rotation: {x: 0, y: 300 + 0.02, z: 0},
        position: {x: 150, y: 180, z: -650},
    },
    {
        size: {h: 370, w: 360, d: 20},
        rotation: {x: 0, y: 300 + 0.02, z: 0},
        position: {x: 150, y: 180, z: -650},
    },
    // {
    //     size: {h: 370, w: 360, d: 20},
    //     rotation: {x: 0, y: 300 + 0.02, z: 0},
    //     position: {x: -150, y: 180, z: -650},
    // },
    {
        size: {h: 370, w: 1200, d: 20},
        rotation: {x: 0, y: 0, z: 0},
        position: {x: 420, y: 180, z: -750},
    },
    {
        size: {h: 370, w: 830, d: 20},
        rotation: {x: 0, y: 300 + 0.02, z: 0},
        position: {x: 1000, y: 180, z: -350},
    },
    // {
    //     size: {h: 370, w: 830, d: 20},
    //     rotation: {x: 0, y: 300 + 0.02, z: 0},
    //     position: {x: -1000, y: 180, z: -350},
    // },

];

