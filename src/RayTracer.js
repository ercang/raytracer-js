define(["src/Vector3",
        "src/Sphere"],
    function (Vector3,
              Sphere) {
        'use strict';

        var MAX_RAY_DEPTH = 5;
        var INFINITY = 1e8;

        /**
         * @class RayTracer
         */
        function RayTracer(backgroundColor, scene) {
            this.backgroundColor = backgroundColor;
            this.scene = scene;
        }

        RayTracer.prototype.mix = function(a, b, mix) {
            return b * mix + a * (1 - mix);
        };

        RayTracer.prototype.trace = function(rayOrigin, rayDir, depth) {
            var tnear = INFINITY;
            var element = undefined;

            var elements = this.scene.getElements();
            var elementsLen = elements.length;

            var hitInfo = {t0:INFINITY, t1:INFINITY};
            for(var i=0; i<elementsLen; i++) {
                hitInfo.t0 = INFINITY;
                hitInfo.t1 = INFINITY;
                var sphere = elements[i];
                if(sphere.intersect(rayOrigin, rayDir, hitInfo)) {
                    // ray hit intersect
                    if(hitInfo.t0 < 0) {
                        hitInfo.t0 = hitInfo.t1;
                    }

                    if(hitInfo.t0 < tnear) {
                        tnear = hitInfo.t0;
                        element = sphere;
                    }
                }
            }

            if(element == undefined) {
                // no hit, return background color
                return this.backgroundColor;
            }

            // test, only return surface color
            return element.getMaterial().surfaceColor;
        };

        RayTracer.prototype.render = function(width, height) {
            // create buffer, 4 bytes for 1 pixel, r, g, b, a order
            var colorDepth = 4;
            var buffer = new ArrayBuffer(width*height*colorDepth);
            var bufferView = new Uint32Array(buffer);
            var invWidth = 1/width;
            var invHeight = 1/height;
            var fov = 30;
            var aspectRatio = width/height;
            var angle = Math.tan(Math.PI * 0.5 * fov / 180);
            var rayOrigin = new Vector3(0, 0, 0);

            // Trace rays
            for (var y = 0; y<height; ++y) {
                for (var x = 0; x<width; ++x) {
                    var xx = (2 * ((x + 0.5) * invWidth) - 1) * angle * aspectRatio;
                    var yy = (1 - 2 * ((y + 0.5) * invHeight)) * angle;
                    var rayDir = new Vector3(xx, yy, -1);
                    rayDir.normalize();

                    // trace
                    var pixelColor = this.trace(rayOrigin, rayDir, 0);

                    // convert pixel to bytes
                    var r = Math.round(pixelColor.x * 255);
                    var g = Math.round(pixelColor.y * 255);
                    var b = Math.round(pixelColor.z * 255);

                    bufferView[y * width + x] =
                        (255   << 24) |	// alpha
                        (b << 16) |	// blue
                        (g <<  8) |	// green
                        r;		// red
                }
            }

            return buffer;
        };

        return RayTracer;
    });
