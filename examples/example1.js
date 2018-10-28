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
scene.add(
    new Sphere(new Vector3(0, 0, -20), 4,
        new Material(new Vector3(1.00, 0.32, 0.36), 1, 0.5, new Vector3()))
);
scene.add(
    new Sphere(new Vector3(5, -1, -15), 2,
        new Material(new Vector3(0.9, 0.76, 0.46), 1, 0, new Vector3()))
);
scene.add(
    new Sphere(new Vector3(5, 0, -25), 3,
        new Material(new Vector3(0.65, 0.77, 0.97), 1, 0, new Vector3()))
);
scene.add(
    new Sphere(new Vector3(-5.5, 0, -15), 3,
        new Material(new Vector3(0.9, 0.9, 0.9), 1, 0, new Vector3()))
);

// add light
scene.add(
    new Sphere(new Vector3(0, 20, -30), 3,
        new Material(new Vector3(), 0, 0, new Vector3(1.2, 1.2, 1.2)))
);
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

document.getElementById("startButtonId").addEventListener('click', () => {
    // save start time
    var startTime = Date.now();

    // render
    var buffer = rayTracer.render(canvasWidth, canvasHeight);

    // copy ray tracer buffer to canvas
    var buf8  = new Uint8ClampedArray(buffer);

    var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);

    // display total duration
    var totalDuration = (Date.now() - startTime)/1000;
    document.getElementById("resultDiv").innerHTML = "Render completed! " + totalDuration + " seconds!";
});