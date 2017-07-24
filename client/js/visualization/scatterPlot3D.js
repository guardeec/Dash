/**
 * Created by Guardeec on 20.07.17.
 */

drawScatterPlot3D = function (div, container) {

    $("#" + div).append("<canvas id=\"canvas_" + div + "\"></canvas>");

    function getSvgHeight(div) {
        return $("#" + div).parent().height() - 50;
    }

    function getSvgWidth(div) {
        return $("#" + div).width() - 20;
    }

    //глобальные переменные
    let renderer;
    let scene;
    let camera;
    //используются для контроля камеры
    let controls;
    //используются для реакции на нажатие на меши
    let plane;
    let selectedObject;
    let offset = new THREE.Vector3();
    let objects = [];
    let padding;
    //при нажатии появляются оси-курсоры
    let axis = [];
    let metrics = {
        source_YELLOW: 0,
        target_RED: 0,
        port_BLUE: 0
    };
    let tools = {
        enableAxis: true,
        enableRotation: true
    };

    //инициализация статических компонентов
    function init() {
        //инициализация сцены и камеры
        let width = getSvgWidth(div);
        let height = getSvgHeight(div);
        let canvas = $("#canvas_" + div)[0];
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, logarithmicDepthBuffer: true});
        renderer.setClearColor("rgb(255, 255, 255)");
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);
        camera.position.set(200, 100, 10);

        //свет
        let light = new THREE.AmbientLight(0xffffff);
        scene.add(light);

        //инициализация управления камерой
        controls = new THREE.OrbitControls(camera, $("#canvas_" + div)[0]);
        controls.addEventListener('change', function () {
            renderer.render(scene, camera);
        });
        controls.autoRotate = true;
        controls.dollyOut = function(){
            this.object.position.z -= 100;
        };
        controls.dollyIn = function(){
            this.object.position.z += 100;
        };



        //иниициализация гуи

        //gui.add(size, "size").min(1).max(5).step(1);

        //инициализация объектов нужных для реакции на нажиатие на меши
        plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 18, 18), new THREE.MeshBasicMaterial());
        plane.visible = false;
        scene.add(plane);

        //
        //initAxis();
    }



    function dynamic() {
        //запрос на сервер за данными
        let scatterPlot3DData = Containers.find({name: container}).fetch()[0].data;
        //сначала нарисуем контейнер и сместим его на центр
        padding = getSizeOfContainer(scatterPlot3DData) / 2;   //смещение
        //camera.position.set(padding*5, padding*5, camera.position.x);
        controls.minDistance = 10;
        controls.maxDistance = padding*5;

        //camera.position.x=(camera.position.x * Math.cos(0.78)) + (camera.position.z * Math.sin(0.78)) ;
        //camera.translateY( 100 );
        console.log();
        drawContainer(scatterPlot3DData);

        //теперь нарисуем содержимое контейнера
        for (let i = 0; i < scatterPlot3DData.length; i++) {
            let geometry = new THREE.CubeGeometry(1, 1, 1);
            let material = new THREE.MeshBasicMaterial({color: new THREE.Color("rgb(162, 164, 169)"), wireframe: false});
            let cube = new THREE.Mesh(geometry, material);
            cube.position.x = scatterPlot3DData[i].x - padding;
            cube.position.y = scatterPlot3DData[i].y - padding;
            cube.position.z = scatterPlot3DData[i].z - padding;
            cube.name = "x" + scatterPlot3DData[i].x + "y" + scatterPlot3DData[i].y + "z" + scatterPlot3DData[i].z;
            cube.text = scatterPlot3DData[i].text;
            // cube.callback = function () {
            //     console.log("hi");
            //     console.log(scatterPlot3DData[i].text);
            // };
            objects.push(cube);   //сохраняем ссылки на кубы в массив
            scene.add(cube);
        }
    }

    //поиск рамеров контейнера
    function getSizeOfContainer(data) {
        let s = 0;
        for (let i = 0; i < Object.keys(data).length; i++) {
            if (data[i].x > s) {
                s = data[i].x;
            }
            if (data[i].y > s) {
                s = data[i].y;
            }
            if (data[i].z > s) {
                s = data[i].z;
            }
        }
        return s;
    }

    //отрисовка контейнера
    function drawContainer(data) {
        let s = padding * 2;
        let edgesCoordinates = [
            [0, s, s, 0, s, 0], [0, s, 0, s, s, 0], [s, s, 0, s, s, s], [s, s, s, 0, s, s],
            [0, 0, s, 0, 0, 0], [0, 0, 0, s, 0, 0], [s, 0, 0, s, 0, s], [s, 0, s, 0, 0, s],
            [0, 0, s, 0, s, s], [0, 0, 0, 0, s, 0], [s, 0, 0, s, s, 0], [s, 0, s, s, s, s]
        ];
        for (let i = 0; i < edgesCoordinates.length; i++) {
            let geometry = new THREE.Geometry();
            geometry.vertices.push(
                new THREE.Vector3(edgesCoordinates[i][0] - padding, edgesCoordinates[i][1] - padding, edgesCoordinates[i][2] - padding),
                new THREE.Vector3(edgesCoordinates[i][3] - padding, edgesCoordinates[i][4] - padding, edgesCoordinates[i][5] - padding)
            );
            let line = new THREE.MeshLine();
            line.setGeometry(geometry, function () {
                return 1;
            });
            let material = new THREE.MeshLineMaterial({
                color: new THREE.Color("rgb(92, 164, 169)"),
                opacity: 1
                // ,
                // lineWidth: 1,
                // sizeAttenuation: true,
                // near: camera.near,
                // far: camera.far
                /*,
                 useMap: false,
                 opacity: 1,
                 resolution: new THREE.Vector2( window.innerWidth, window.innerHeight ),
                 sizeAttenuation: false,
                 lineWidth: 10,
                 near: camera.near,
                 far: camera.far
                 */
            });
            let mesh = new THREE.Mesh(line.geometry, material); // this syntax could definitely be improved!
            scene.add(mesh);
        }
    }

    function loop() {
        requestAnimationFrame(function () {
            loop();
        });
        controls.update();
    }

    function clearUp(){
        while (scene.children.length > 0) {
            if(scene.getObjectByName(scene.children.length - 1)){
                scene.getObjectByName(scene.children.length - 1).geometry.dispose();
                scene.getObjectByName(scene.children.length - 1).material.dispose();
            }
            let toRemove = scene.children[scene.children.length - 1];
            scene.remove(toRemove);
            toRemove = null;
        }
    }

    init();
    dynamic();
    loop();

    setInterval(function () {
        clearUp();
        dynamic();
    }, 2000);

    document.onmousedown = function (event) {
        controls.autoRotate = false;
        //находим координаты мыши
        let mouse_x = ( event.clientX / window.innerWidth ) * 2 - 1;
        let mouse_y = -( event.clientY / window.innerHeight ) * 2 + 1;

        // находим какие объекты находятся на линии мыши и отключаем движение камеры
        let vector = new THREE.Vector3(mouse_x, mouse_y, 0.5);
        vector.unproject(camera);
        let raycaster = new THREE.Raycaster(camera.position,
            vector.sub(camera.position).normalize());
        let intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0) {
            controls.enabled = false;
            intersects[0].object.material.color.setHex(Math.random()*0xffffff);
            // selectedObject = intersects[0].object;
            // selectedObject.material.color.setHex( "0xffffff" );
            //
            // //intersects = raycaster.intersectObject(plane);
            // //offset.copy(intersects[0].point).sub(plane.position);
            //
            console.log(intersects[0].object.text);
            // selectedObject.geometry = new THREE.SphereGeometry(4, 1, 1);;
            //showAxis(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
        }
        controls.update();
    };

    $(window).resize(function () {
        height = $("#" + div).parent().height() - 50;
        width = $("#" + div).width() - 20;
        camera.aspect = width/ height;
        camera.updateProjectionMatrix();
        renderer.setSize( width, height);
    });

    document.onmouseup = function (event) {
        controls.enabled = true;
        //selectedObject = null;
        for(let i=0; i<3; i++){
            //axis[i].visible=false;
        }
        controls.autoRotate = true;
    }
};