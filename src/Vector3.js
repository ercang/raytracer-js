define([],
    function () {
        'use strict';

        /**
         * @class Vector3
         */
        function Vector3(x, y, z) {
            if(x == undefined) x = 0;
            if(y == undefined) y = 0;
            if(z == undefined) z = 0;

            this.x = x;
            this.y = y;
            this.z = z;
        }

        Vector3.prototype.clone = function() {
            return new Vector3(this.x, this.y, this.z);
        };

        Vector3.prototype.length2 = function() {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        };

        Vector3.prototype.length = function() {
            return Math.sqrt(this.length2());
        };

        Vector3.prototype.normalize = function() {
            var len2 = this.length2();
            if(len2 > 0){
                var invLen = 1/Math.sqrt(len2);
                this.x *= invLen;
                this.y *= invLen;
                this.z *= invLen;
            }

            return this;
        };

        Vector3.prototype.dotProduct = function(otherVector) {
            return this.x * otherVector.x + this.y * otherVector.y + this.z * otherVector.z;
        };

        Vector3.prototype.product = function(otherVector) {
            this.x *= otherVector.x;
            this.y *= otherVector.y;
            this.z *= otherVector.z;
            return this;
        };

        Vector3.prototype.multiply = function(scalarValue) {
            this.x *= scalarValue;
            this.y *= scalarValue;
            this.z *= scalarValue;
            return this;
        };

        Vector3.prototype.add = function(otherVector) {
            this.x += otherVector.x;
            this.y += otherVector.y;
            this.z += otherVector.z;
            return this;
        };

        Vector3.prototype.subtract = function(otherVector) {
            this.x -= otherVector.x;
            this.y -= otherVector.y;
            this.z -= otherVector.z;
            return this;
        };

        Vector3.prototype.revert = function() {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        };

        return Vector3;
    });
