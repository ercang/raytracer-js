import Vector3 from './Vector3.js'

const MAX_RAY_DEPTH = 1;
const INFINITY = 1e8;

/**
 * @class RayTracer
 */
export default class RayTracer {
    constructor(backgroundColor, scene) {
        this.backgroundColor = backgroundColor;
        this.scene = scene;
    }

    trace(rayOrigin, rayDir, depth) {
        var tnear = INFINITY;
        var element = null;

        var elements = this.scene.getElements();
        var elementsLen = elements.length;

        var hitInfo = {t0:INFINITY, t1:INFINITY};
        for(var i=0; i<elementsLen; i++) {
            hitInfo.t0 = INFINITY;
            hitInfo.t1 = INFINITY;
            var el = elements[i];
            if(el.intersect(rayOrigin, rayDir, hitInfo)) {
                // ray hit intersect
                if(hitInfo.t0 < 0) {
                    hitInfo.t0 = hitInfo.t1;
                }

                if(hitInfo.t0 < tnear) {
                    tnear = hitInfo.t0;
                    element = el;
                }
            }
        }

        if(element == null) {
            // no hit, return background color
            return this.backgroundColor;
        }

        var surfaceColor = new Vector3(0,0,0);
        var intersectionPoint = rayOrigin.clone().add(rayDir.clone().multiply(tnear));
        var intersectionNormal = element.getNormal(intersectionPoint);

        var bias = 1e-4;
        var inside = false;
        if (rayDir.dotProduct(intersectionNormal) > 0)
        {
            intersectionNormal.revert();
            inside = true;
        }

        var mat = element.getMaterial();
        for(var i=0; i<elementsLen; i++)
        {
            var el = elements[i];
            var lightMat = el.getMaterial();
            if(lightMat.emissionColor.x > 0 || lightMat.emissionColor.y > 0 ||
                lightMat.emissionColor.z > 0)
            {
                // light source
                var transmission = new Vector3(1, 1, 1);
                var lightDirection = el.getCenter().clone().subtract(intersectionPoint);
                lightDirection.normalize();
                var lightHitInfo = {t0:INFINITY, t1:INFINITY};

                for(var j=0; j<elementsLen; j++)
                {
                    if(i != j) {
                        if(elements[j].intersect(intersectionPoint.clone().add(intersectionNormal.clone().multiply(bias)), lightDirection, lightHitInfo)) {
                            transmission.x = 0;
                            transmission.y = 0;
                            transmission.z = 0;
                            break;
                        }
                    }

                }

                var lightRatio = Math.max(0, intersectionNormal.dotProduct(lightDirection));

                surfaceColor.add(mat.surfaceColor.clone().product(transmission).product(lightMat.emissionColor.clone().multiply(lightRatio)));
            }
        }

        surfaceColor.add(mat.emissionColor);
        return surfaceColor;
    }

    render(width, height, startY, scanHeight) {
        if(startY == undefined) {
            startY = 0;
        }

        if(scanHeight == undefined) {
            scanHeight = height;
        }

        // create buffer, 4 bytes for 1 pixel, r, g, b, a order
        var colorDepth = 4;
        var buffer = new ArrayBuffer(width*scanHeight*colorDepth);
        var bufferView = new Uint32Array(buffer);
        var invWidth = 1/width;
        var invHeight = 1/height;
        var fov = 30;
        var aspectRatio = width/height;
        var angle = Math.tan(Math.PI * 0.5 * fov / 180);
        var rayOrigin = new Vector3(0, 0, 0);
        var pixelIndex = 0;

        // trace rays
        for (var y=startY; y<startY+scanHeight; ++y) {
            for (var x=0; x<width; ++x, ++pixelIndex) {
                var xx = (2 * ((x + 0.5) * invWidth) - 1) * angle * aspectRatio;
                var yy = (1 - 2 * ((y + 0.5) * invHeight)) * angle;
                var rayDir = new Vector3(xx, yy, -1);
                rayDir.normalize();

                // trace
                var pixelColor = this.trace(rayOrigin, rayDir, 0);

                pixelColor.x = Math.min(1, pixelColor.x);
                pixelColor.y = Math.min(1, pixelColor.y);
                pixelColor.z = Math.min(1, pixelColor.z);

                // convert pixel to bytes
                var r = Math.round(pixelColor.x * 255);
                var g = Math.round(pixelColor.y * 255);
                var b = Math.round(pixelColor.z * 255);

                bufferView[pixelIndex] =
                    (255   << 24) |	// alpha
                    (b << 16) |	// blue
                    (g <<  8) |	// green
                    r;		// red
            }
        }

        return buffer;
    }
}
