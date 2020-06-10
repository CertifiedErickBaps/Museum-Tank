# Proyecto Final de Graficas Computacionales

### Vista general
Esta documentacion fue diseñada para explicar el trabajo realizado durante el semestre
para el curso de **Graficas Computacionales**, creando un proyecto usando Three.js y otras 
librerias externas.

La estructura del directorio del proyecto se ve de la siguiente manera:

    MuseumTank/
        css/                        Folder que contiene la hoja de estilos del proyecto.
        fonts/                      Folder que contiene estilos de fuentes usadas para cargar TextGeometry y FontGeometry. 
        info/                       Folder que contiene los cuadros de informacion de cada objeto tanque.
        js/                         Folder que contiene las librerias de three js.
        models/                     Folder que contiene los modelos obj y fbx del proyecto.
        public/                     Folder para funcionalidad y la vista principal del proyecto.


### Como correr el proyecto

Necesitas tener instalado python para poder correr un servidor localmente o si lo es mas facil
con el pluging de onLive de VSC, escribir el siguiente comando en terminal, verificando que estas en la ruta 
del proyecto.

    $python -m http.server

Despues escribir en tu browser localhost:8000 (por default) y entrar a public para correr <b>Museum.html</b>

### Advertencias y consejos

Debido a que GitHub no permite subir archivos mayores a 25MB los videos son videos cortos del video original,
por lo que los videos originales estan en el siguiente enlace: [https://drive.google.com/drive/folders/1nbqIPU1pENc_k2VixKJb28jdz6ryC_SE?usp=sharing]

### Elementos usados

* Pointer Lock Controls
* Post-Procesamiento
* Shaders
* FontLoader as 3D view
* Object Loader
* Lights - SpotLight - AmbientLight
* Geometry
* Video Loader
* Box3 for Colliders


### Autor

* *A01379896* <em>Erick Bautista Pérez</em>

### Acknowledgments

Professor Octavio Navarro Hinojosa

## Demo

![](./img/demo.gif)

### Referencias
- mrdoob/three.js. (2020). Retrieved 10 June 2020, from [https://github.com/mrdoob/three.js/tree/master/examples/js/postprocessing]
- Three.js - examples. (2020). Retrieved 10 June 2020, from [http://stemkoski.github.io/Three.js/#video-texture]
- mrdoob/three.js. (2020). Retrieved 10 June 2020, from [https://github.com/mrdoob/three.js/tree/master/examples/js/loaders]
- History of the tank. (2020). Retrieved 10 June 2020, from [https://en.wikipedia.org/wiki/History_of_the_tank]

