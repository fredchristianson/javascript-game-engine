import { Renderer } from './renderer.js';

class FunctionRenderer extends Renderer {
    constructor(func) {
        super();
        this._function = func;
    }
}

export { FunctionRenderer };