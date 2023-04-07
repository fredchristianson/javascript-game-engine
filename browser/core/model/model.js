
import { createLogger } from '../../modules/logging/logger.js';
import { Entity } from '../entity/entity.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { MODEL_TYPE } from './model-type.js';
const log = createLogger('Layer');

class Model extends Entity {
    constructor() {
        super(ENTITY_TYPE.MODEL);
        this._type = MODEL_TYPE.UNKNOWN;
        this._parentElement = null;
        this._renderer = null;
        this._order = null;
    }

    type(type) {
        log.debug('create model type', type);
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

export { Model };