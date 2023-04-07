import { Enum } from '../../modules/helpers.js';

class ModelType extends Enum {
    constructor(name) {
        super(name);
    }
}

const MODEL_TYPE = {
    UNKNOWN: new ModelType('unknown'),
    HTML: new ModelType('HTML'),
    CANVAS: new ModelType('CANVAS')

};

export { MODEL_TYPE, ModelType };