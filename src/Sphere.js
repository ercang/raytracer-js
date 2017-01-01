define([],
    function () {
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

        return Sphere;
    });
