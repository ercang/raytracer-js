define([],
    function () {
        'use strict';

        /**
         * @class Scene
         */
        function Scene() {
            this.elements = [];
        }

        Scene.prototype.add = function(element) {
            this.elements.push(element);
        };

        Scene.prototype.getElements = function() {
            return this.elements;
        };

        Scene.prototype.clear = function() {
            this.elements = [];
        };

        return Scene;
    });
