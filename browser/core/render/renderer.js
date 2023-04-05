import { ASSERT } from '../../modules/assert.js';

class Renderer {
    constructor() {

    }

    render(...args) {
        ASSERT.fail('rend() is not implemented by derived class');
    }
}

export { Renderer };