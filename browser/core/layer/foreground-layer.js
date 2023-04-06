
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { LAYER_TYPE } from './layer-type.js';
import { Layer } from './layer.js';

const log = createLogger('ForegroundLayer');

class ForegroundLayer extends Layer {
    constructor() {
        super(ENTITY_TYPE.LAYER);
        this._type = LAYER_TYPE.FOREGROUND;
        this._order = 100; // lower order has lower z-index
    }

    get Type() {
        return this._type;
    }
}


export { ForegroundLayer };