define([],
    function () {
        'use strict';

        /**
         * @class Material
         */
        function Material(surfaceColor, transparency, reflection) {
            this.surfaceColor = surfaceColor;
            this.transparency = transparency;
            this.reflection = reflection;
        }

        return Material;
    });
