/**
 * @class Scene
 */
export default class Scene {
    constructor() {
        this.elements = [];
    }

    add(element) {
        this.elements.push(element);
    }

    getElements() {
        return this.elements;
    }

    clear() {
        this.elements = [];
    }
}
