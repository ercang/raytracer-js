import RayTracer from './RayTracer.js'
import Scene from './Scene.js'
import Sphere from './Sphere.js'
import Vector3 from './Vector3.js'

var messageHandler = undefined;

onmessage = function(e) {
    if(messageHandler)
    {
        messageHandler(e);
    }
};

var scene = new Scene();
var backgroundColor = new Vector3(0, 0, 0);
var rendererWidth = 0;
var rendererHeight = 0;
var startY = 0;
var scanHeight = 0;

function rendererMessageHandler(e) {
    var action = e.data.action;
    var data = e.data.data;

    if(action == "elements") {
        scene.clear();
        var elements = data;
        for(var i=0; i<elements.length; i++) {
            scene.add(Sphere.deserialize(elements[i]));
        }
    }
    else if(action == "backgroundColor")
    {
        backgroundColor.x = data[0];
        backgroundColor.y = data[1];
        backgroundColor.z = data[2];
    }
    else if(action == "dimensions")
    {
        rendererWidth = data[0];
        rendererHeight = data[1];
        startY = data[2];
        scanHeight = data[3];
    }
    else if(action == "render")
    {
        startRendering();
    }
}
messageHandler = rendererMessageHandler;

function startRendering()
{
    var startTime = new Date();
    var rayTracer = new RayTracer(backgroundColor, scene);
    var buffer = rayTracer.render(rendererWidth, rendererHeight, startY, scanHeight);
    var endTime = new Date();

    // send result buffer
    var buf8  = new Uint8ClampedArray(buffer);
    postMessage({
        "action": "result",
        "data": buf8
    });
}