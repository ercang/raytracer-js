requirejs.config({
    baseUrl: '../'
});

requirejs(["src/RayTracer",
            "src/Scene",
            "src/Sphere",
            "src/Material",
            "src/Vector3"],
    function (RayTracer,
              Scene,
              Sphere,
              Material,
              Vector3)
    {
        // create scene
        var scene = new Scene();
        scene.add(
            new Sphere(new Vector3(0, 0, -20), 4,
                new Material(new Vector3(1.00, 0.32, 0.36), 0, 0.0))
        );

        var backgroundColor = new Vector3(0.2,0.2,0.2);

        // create ray tracer
        var rayTracer = new RayTracer(backgroundColor, scene);

        // save start time
        var startTime = new Date();

        // get canvas
        var canvas = document.getElementById("resultCanvas");
        var ctx = canvas.getContext('2d');
        var canvasWidth  = canvas.width;
        var canvasHeight = canvas.height;

        // render
        var buffer = rayTracer.render(canvasWidth, canvasHeight);

        // copy ray tracer buffer to canvas
        var buf8  = new Uint8ClampedArray(buffer);

        var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        imageData.data.set(buf8);
        ctx.putImageData(imageData, 0, 0);

        // display total duration
        var totalDuration = (new Date() - startTime)/1000;
        document.getElementById("resultDiv").innerHTML = "Render completed! " + totalDuration + " seconds!";
    }
);