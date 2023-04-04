import { Renderer } from './renderer.js';

class MethodRenderer extends Renderer {
    constructor(object, method) {
        super();
        this._object = object;
        this._method = method;
    }
}

export { MethodRenderer };