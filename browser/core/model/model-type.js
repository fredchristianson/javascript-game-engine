import { Enum } from '../../modules/helpers.js';

class ModelType extends Enum {
    constructor(name) {
        super(name);
    }
}

const MODEL_TYPE = {
    UNKNOWN: new ModelType('unknown'),
    HTML: new ModelType('HTML'),
    CANVAS: new ModelType('CANVAS'),
    STYLE: new ModelType('STYLE'),
    TEXT: new ModelType('text')

};

export { MODEL_TYPE, ModelType };