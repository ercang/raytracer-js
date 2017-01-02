requirejs.config({
    baseUrl: '../'
});

requirejs(["src/RayTracer",
           "src/Scene",
           "src/Sphere",
           "src/Material",
           "src/Vector3",
           "src/RenderPlanner"],
          function (RayTracer,
                    Scene,
                    Sphere,
                    Material,
                    Vector3,
                    RenderPlanner)
          {

              document.getElementById("startButtonId").onclick = function() {
                  startRendering();
              };

              // -------------------------------
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
              // -------------------------------
              // -------------------------------
              var backgroundColor = new Vector3(2.0, 2.0, 2.0);

              // get canvas
              var resultDiv = document.getElementById("resultDiv");
              var canvas = document.getElementById("resultCanvas");
              var ctx = canvas.getContext('2d');
              var canvasWidth  = canvas.width;
              var canvasHeight = canvas.height;

              var startTime = new Date();
              var frameCount = 0;

              // var create render planner
              var bufferPieces = [];
              var workerCount = 4;
              var renderPlanner = new RenderPlanner(workerCount, scene, backgroundColor, canvasWidth, canvasHeight);
              renderPlanner.onUpdateReceived = function(sectionStart, sectionHeight, buf8)
              {
                  // collect buffer for a single screen update
                  bufferPieces.push({
                      "buffer": buf8,
                      "start": sectionStart,
                      "height": sectionHeight
                  });

                  if(renderPlanner.isRunning() == false)
                  {
                      // rendering is completed update screen!
                      for(var i=0; i<bufferPieces.length; i++) {
                          var piece = bufferPieces[i];

                          var imageData = ctx.getImageData(0, piece.start, canvasWidth, piece.height);
                          imageData.data.set(piece.buffer);
                          ctx.putImageData(imageData, 0, piece.start);
                      }

                      bufferPieces = [];

                      // update scene data!
                      setTimeout(function(){
                          light1.center = new Vector3(10*Math.sin(new Date()/2000), 10, -30);
                          sphere1.center = new Vector3(0, 5*Math.sin(new Date()/1000), -20);
                          sphere2.center = new Vector3(5, -1*Math.sin(new Date()/500), -15);
                          sphere3.center = new Vector3(5, 6*Math.cos(new Date()/1000), -25);
                          sphere4.center = new Vector3(-5.5, 3*Math.cos(new Date()/1000), -15);

                          renderPlanner.updateScene();
                          renderPlanner.start();

                          frameCount++;
                          var currentTime = new Date();
                          if(currentTime - startTime > 1000){
                              resultDiv.innerHTML = "Worker Count: " + workerCount + " FPS = " + frameCount;
                              startTime = currentTime;
                              frameCount = 0;
                          }
                      },0);

                  }
              };

              function startRendering() {
                  // start
                  renderPlanner.initialize();
                  renderPlanner.start();
              }
          }
);