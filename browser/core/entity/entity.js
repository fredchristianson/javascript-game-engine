
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from './entity-type.js';

const log = createLogger('Layer');

class Entity {
    constructor(application, game, type = ENTITY_TYPE.UNKNOWN) {
        this._application = application;
        this._game = game;
        this._entityType = type;
        this._parentElement = null;
        this._renderer = null;
        this._order = null;
        this._renderer = null;
    }

    get entityType() {
        return this._entityType;
    }


    position(parent) {
        this._parentElement = parent;
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

export { Entity };