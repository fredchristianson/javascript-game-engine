import { Renderer } from './renderer.js';

class MethodRenderer extends Renderer {
    constructor(object, method) {
        super();
        this._object = object;
        this._method = method;
    }

    render(...args) {
        this._method.call(this._object, ...args);
    }
}

export { MethodRenderer };