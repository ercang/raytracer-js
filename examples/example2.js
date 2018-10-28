import RayTracer from '../src/RayTracer.js'
import Scene from '../src/Scene.js'
import Sphere from '../src/Sphere.js'
import Material from '../src/Material.js'
import Vector3 from '../src/Vector3.js'

// create scene
var scene = new Scene();

// add background sphere
scene.add(
    new Sphere(new Vector3(0.0, -10004, -20), 10000,
               new Material(new Vector3(0.2, 0.2, 0.2), 0, 0, new Vector3()))
);

// add spheres
var sphere1 = new Sphere(new Vector3(0, 0, -20), 4,
                         new Material(new Vector3(1.00, 0.32, 0.36), 1, 0.5, new Vector3()));
scene.add(sphere1);

var sphere2 = new Sphere(new Vector3(5, -1, -15), 2,
                         new Material(new Vector3(0.9, 0.76, 0.46), 1, 0, new Vector3()));
scene.add(sphere2);

var sphere3 = new Sphere(new Vector3(5, 0, -25), 3,
                         new Material(new Vector3(0.65, 0.77, 0.97), 1, 0, new Vector3()));
scene.add(sphere3);

var sphere4 = new Sphere(new Vector3(-5.5, 0, -15), 3,
                         new Material(new Vector3(0.9, 0.9, 0.9), 1, 0, new Vector3()));
scene.add(sphere4);

// add light
var light1 = new Sphere(new Vector3(0, 20, -30), 3,
                        new Material(new Vector3(), 0, 0, new Vector3(1.2, 1.2, 1.2)));
scene.add(light1);
scene.add(
    new Sphere(new Vector3(0, 10, 10), 3,
               new Material(new Vector3(), 0, 0, new Vector3(1, 1, 1)))
);

var backgroundColor = new Vector3(2.0, 2.0, 2.0);

// create ray tracer
var rayTracer = new RayTracer(backgroundColor, scene);

// get canvas
var canvas = document.getElementById("resultCanvas");
var ctx = canvas.getContext('2d');
var canvasWidth  = canvas.width;
var canvasHeight = canvas.height;

// save start time
var startTime = Date.now();

var totalFrameCount = 0;
var resultDiv = document.getElementById("resultDiv");
function render(){
    // render
    var buffer = rayTracer.render(canvasWidth, canvasHeight);

    // copy ray tracer buffer to canvas
    var buf8 = new Uint8ClampedArray(buffer);

    var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);

    // display total duration
    totalFrameCount++;
    var currentTime = Date.now();
    if(currentTime - startTime > 1000){
        resultDiv.innerHTML = "FPS = " + totalFrameCount;
        totalFrameCount = 0;
        startTime = currentTime;
    }
}

var isAnimationRunning = false;
document.getElementById("startButtonId").addEventListener('click', () => {

    if(isAnimationRunning)
    {
        return;
    }

    isAnimationRunning = true;

    // animation loop
    setInterval(function(){
        // update positions
        light1.center = new Vector3(10*Math.sin(Date.now()/2000), 10, -30);
        sphere1.center = new Vector3(0, 5*Math.sin(Date.now()/1000), -20);
        sphere2.center = new Vector3(5, -1*Math.sin(Date.now()/500), -15);
        sphere3.center = new Vector3(5, 6*Math.cos(Date.now()/1000), -25);
        sphere4.center = new Vector3(-5.5, 3*Math.cos(Date.now()/1000), -15);

        // render
        render();
    },10);
});