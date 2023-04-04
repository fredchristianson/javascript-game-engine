
import { createLogger } from '../../modules/logging/logger.js';
import { LAYER_TYPE } from './area-type.js';
import { Entity } from '../entity/entity.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
const log = createLogger('Layer');

class Layer extends Entity {
    constructor(application, game) {
        super(application, game, ENTITY_TYPE.LAYER);
        this._type = LAYER_TYPE.UNKNOWN;
        this._parentElement = null;
        this._renderer = null;
        this._order = null;
    }

    type(type) {
        log.debug('create layer type', type);
        this._type = type;
        return this;
    }


    renderer(render) {
        /*
         * todo: check if renderrer is a function.
         * does it need to be bound to the game?
         */
        this._renderer = render;
        return this;
    }
}

export { Layer };