
import { createLogger } from '../../modules/logging/logger.js';
import { Entity } from '../entity/entity.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
const log = createLogger('Layer');

class Layer extends Entity {
    constructor(type) {
        super(ENTITY_TYPE.LAYER);
        this._type = type;
        this._order = 0; // lower order has lower z-index
    }

    get Type() {
        return this._type;
    }


}

function layerOrderCompare(a, b) {
    if (a == null) {
        return b == null ? 0 : -1;
    }
    if (b == null) {
        return 1;
    }

    return a._order - b._order;

}

export { Layer, layerOrderCompare };