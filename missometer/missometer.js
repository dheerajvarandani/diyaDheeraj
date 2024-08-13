
import * as THREE from 'three';
import { GLTFLoader } from "./three/GLTFLoader.js";
import { OrbitControls } from './three/OrbitControls.js';
import { RGBELoader } from './three/RGBELoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const container = document.getElementById("threejscanvas")

const renderer = new THREE.WebGLRenderer({canvas: container});
renderer.setSize( container.clientWidth, container.clientHeight );
//document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

const light2 = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1);
scene.add( light2 );     

let missometer;
let aortaAnim;
let mixer;
let labels = [];

camera.position.z = 2;
    camera.position.y = 1;

var clock = new THREE.Clock()
var delta = clock.getDelta();

var missValue = document.getElementById("miss_value")

var needleMoving = false;

var needle;

var toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click",function(){

    if(needleMoving){
        needleMoving = false;
        this.innerHTML = "START"
    }
    else{
        needleMoving = true;
        this.innerHTML = "STOP"
    }
    

})

// ---------------------------------------------------------------------
// HDRI - IMAGE BASED LIGHTING
// ---------------------------------------------------------------------
new RGBELoader()
.setPath('./assets/')
.load('brown_photostudio_01_2k.hdr', function (texture) {

    
    texture.mapping = THREE.EquirectangularReflectionMapping;

    

    
    //scene1.background = texture;
    scene.background = new THREE.Color( "rgb(1,22,45)" );
    scene.environment = texture;
    scene.environment.rotation = 180

});

var loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = function() {
document.getElementById("loadingDiv").innerHTML = "Loaded!";    }


loadingManager.onError = function(item){
document.getElementById("loadingDiv").innerHTML = "Error: " + item }


const loader = new GLTFLoader(loadingManager);
loader.load(
// resource URL
'./assets/missometer.glb',
//'https://storage.googleapis.com/dheerajv-bucket/images/aorta.glb',
// called when the resource is loaded
function ( gltf ) {


    missometer = gltf.scene;
    aortaAnim = gltf.animations;
    scene.add( missometer);

    mixer = new THREE.AnimationMixer(missometer);

    needle = missometer.getObjectByName("needle")

   


});







function animate() {
    requestAnimationFrame( animate );

    if(needleMoving){
        needle.rotation.z -= 0.15
        missValue.innerHTML = Math.trunc(-(THREE.MathUtils.radToDeg(needle.rotation.z) + 180) * 3.33) %1200
    }



    renderer.render( scene, camera );

}
animate();

