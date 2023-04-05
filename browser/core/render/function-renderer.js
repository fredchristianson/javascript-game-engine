import { Renderer } from './renderer.js';

class FunctionRenderer extends Renderer {
    constructor(func) {
        super();
        this._function = func;
    }

    render(...args) {
        this._function(...args);
    }
}

export { FunctionRenderer };