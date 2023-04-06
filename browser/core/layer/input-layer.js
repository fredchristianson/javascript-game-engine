
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { LAYER_TYPE } from './layer-type.js';
import { Layer } from './layer.js';
const log = createLogger('InputLayer');

class InputLayer extends Layer {
    constructor() {
        super(ENTITY_TYPE.LAYER);
        this._type = LAYER_TYPE.INPUT;
        this._order = 90; // lower order has lower z-index
    }

    get Type() {
        return this._type;
    }
}


export { InputLayer };