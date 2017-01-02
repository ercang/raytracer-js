define(["src/Material",
        "src/Vector3"],
    function (Material,
              Vector3) {
        'use strict';

        /**
         * @class Sphere
         */
        function Sphere(center, radius, material) {
            this.center = center;
            this.radius = radius;
            this.radius2 = radius*radius;
            this.material = material;
        }

        Sphere.prototype.intersect = function(rayOrigin, rayDir, out) {
            var l = this.center.clone().subtract(rayOrigin);
            var tca = l.dotProduct(rayDir);
            if (tca < 0){
                return false;
            }

            var d2 = l.dotProduct(l) - tca * tca;
            if (d2 > this.radius2) {
                return false;
            }

            var thc = Math.sqrt(this.radius2 - d2);

            out.t0 = tca - thc;
            out.t1 = tca + thc;

            return true;
        };

        Sphere.prototype.getCenter = function() {
            return this.center;
        };

        Sphere.prototype.getRadius = function() {
            return this.radius;
        };

        Sphere.prototype.getMaterial = function() {
            return this.material;
        };

        Sphere.prototype.getNormal = function(point) {
            var normal = point.clone().subtract(this.getCenter());
            normal.normalize();
            return normal;
        };

        Sphere.prototype.serialize = function() {
            var sc = this.material.surfaceColor;
            var ec = this.material.emissionColor;
            var transparency = this.material.transparency;
            var reflection = this.material.reflection;

            return {
                "center": [this.center.x, this.center.y, this.center.z],
                "radius": this.radius,
                "material": {
                    "surfaceColor": [sc.x, sc.y, sc.z],
                    "emissionColor": [ec.x, ec.y, ec.z],
                    "transparency": transparency,
                    "reflection": reflection
                }
            };
        };

        Sphere.deserialize = function(data) {
            var center = data.center;
            var radius = data.radius;
            var surfaceColor = data.material.surfaceColor;
            var emissionColor = data.material.emissionColor;
            var transparency = data.material.transparency;
            var reflection = data.material.reflection;

            return new Sphere(new Vector3(center[0], center[1], center[2]), radius,
                       new Material(new Vector3(surfaceColor[0], surfaceColor[1], surfaceColor[2]), reflection, transparency,
                                    new Vector3(emissionColor[0], emissionColor[1], emissionColor[2])));

        };

        return Sphere;
    });
