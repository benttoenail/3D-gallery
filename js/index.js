/*
BASIC THREE.JS TEMPLATE
Max Rose -->  July 4th, 2016 
INDEPENDANCE DAY 
*/

//Init of camera, scene and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({alpha : true, preserveDrawingBuffer: true});
var controls = new THREE.OrbitControls( camera, renderer.domElement);


//INIT all scene objects
var Init = function() {
    
    //Init of Renderer and Canvas
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0xf7e6f6, 0);

    //Camera Controls
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    //Ground Helper
    var grid = new THREE.GridHelper(10, 0.5, 0xd3d3d3, 0xd3d3d3);
    grid.position.y = 0;
    scene.add(grid);
    
    camera.position.z = 15;
    camera.position.y = 2;
    
    var windowResize = new THREEx.WindowResize(renderer, camera);
    
}

//Lighting
var InitLights = function() {
    
    var dirlight = new THREE.DirectionalLight(0xfffff, 1);
    var ambLight = new THREE.AmbientLight(0xfffff, 0.25);
    dirlight.position.z = 7;
    dirlight.position.x = 5;
    scene.add(dirlight, ambLight);
    
}


//Load centerCube
var centerCube = new THREE.Object3D();
var material = new THREE.MeshPhongMaterial({color:0x82dd34});

var manager = new THREE.LoadingManager();

var loader = new THREE.OBJLoader();
loader.load( "obj/centerCube.obj", function( object ) {
    
    object.traverse( function (child) {
        if( child instanceof THREE.Mesh ) {
            child.material = material;
        }
    });
    object.children[0].name = 'centerCube';
    console.log(object.children[0].name);
    
    centerCube.add(object);
});
scene.add(centerCube);


//init centerCube
var InitCenterCube = function() {
    
    centerCube.scale.x = 0;

    centerCube.rotation.y = 180*(Math.PI / 180);
    centerCube.rotation.x = 180*(Math.PI / 180);
    
    TweenMax.to(centerCube.position, 2, {y:1, ease: Elastic.easeOut.config(2, 0.75)});
    TweenMax.to(centerCube.scale, 1.2, {x:1, y:1, z:1});
    TweenMax.to(centerCube.rotation, 1.2, {x:25*(Math.PI / 180), y:45*(Math.PI / 180)});
    
}


// -- -- -- RAYCASTING -- -- -- \\

var mouse = new THREE.Vector2(), INTERSECTED;
raycaster = new THREE.Raycaster();

//Find intersected objects
var cubeInterSect = false;
var WindowRayCast = function() {
    
    raycaster.setFromCamera( mouse, camera );
    
    var intersects = raycaster.intersectObjects( scene.children, true );
    
    if(intersects.length > 0){//If something is Intersected 
        
        if( INTERSECTED != intersects[0].object ){ // If intersected does not equal the previous intersected object 
            
            if(intersects[0].object.name == 'centerCube'){ //Look for CenterCube
                
                cubeInterSect = true;
                
            }
        }
        
    } else {
        
        cubeInterSect = false;
        
        INTERSECTED = null;
        
    }
    
}

var onMouseMove = function( e ) {
    
    e.preventDefault();
    
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    
}

var onMouseDown = function( e ) {
    
    e.preventDefault();
    
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children, true );
    
    if(intersects.length > 0){
        if(intersects[0].object.name == 'centerCube'){
            console.log('Center Cube Clicked');    
        } else{
            console.log('objectClicked');    
        }
    }
    
}


document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mousedown', onMouseDown, false);

// -- -- -- END -- -- -- \\


//Update scene 
var Update = function() {
    
    if(cubeInterSect){
        TweenMax.to(centerCube.scale, .25, {x:2, y:2, z:2});
    } else {
        TweenMax.to(centerCube.scale, .25, {x:1, y:1, z:1});
    }
    
}


//
/*
var cube = new THREE.BoxGeometry(1,1,1);
var mat = new THREE.MeshLambertMaterial({color:0x82dd34});
var cubeMesh = new THREE.Mesh(cube, mat);

scene.add(cubeMesh);
*/

//Main Render Function 
var render = function() {
    window.requestAnimationFrame( render );
    
    WindowRayCast();
    controls.update();
    Update();
    renderer.render(scene, camera);
}

Init();
InitCenterCube();
InitLights();
render();