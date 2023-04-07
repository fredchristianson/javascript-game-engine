import { ASSERT } from '../../modules/assert.js';

class Renderer {
    constructor() {

    }

    render(...args) {
        ASSERT.fail('render() is not implemented by derived class');
    }
}

export { Renderer };