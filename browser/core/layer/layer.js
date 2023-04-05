
import { createLogger } from '../../modules/logging/logger.js';
import { Entity } from '../entity/entity.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
const log = createLogger('Layer');

class Layer extends Entity {
    constructor(type) {
        super(ENTITY_TYPE.LAYER);
        this._type = type;
    }

    get Type() {
        return this._type;
    }
}

export { Layer };