/**
 * @class Material
 */
export default class Material {
    constructor(surfaceColor, reflection, transparency, emissionColor) {
        this.surfaceColor = surfaceColor;
        this.transparency = transparency;
        this.reflection = reflection;
        this.emissionColor = emissionColor;
    }
}
