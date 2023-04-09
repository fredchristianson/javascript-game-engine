
import { createLogger } from '../../modules/logging/logger.js';
import { Entity } from '../entity/entity.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { AREA_TYPE } from './area-type.js';
const log = createLogger('Layer');

class Area extends Entity {
    constructor() {
        super(ENTITY_TYPE.AREA);
        this._type = AREA_TYPE.UNKNOWN;
        this._parentElement = null;
        this._renderer = null;
        this._order = null;
    }

    type(type) {
        log.debug('create area type', type);
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

export { Area };