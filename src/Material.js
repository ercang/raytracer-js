define([],
    function () {
        'use strict';

        /**
         * @class Material
         */
        function Material(surfaceColor, reflection, transparency, emissionColor) {
            this.surfaceColor = surfaceColor;
            this.transparency = transparency;
            this.reflection = reflection;
            this.emissionColor = emissionColor;
        }

        return Material;
    });
