import { createLogger } from '../../modules/logging.js';
import { Entity } from '../entity/entity.js';

const log = createLogger('Collision');

class Collision extends Entity {

    constructor(type) {
        super(type);
        this._handler = null;
        this._colliderKind = null;
        this._targetKind = null;
    }

    process() {
        log.once(LOGLEVELS.ERROR, 'derived class does not implement Collision.process()', this._type);

    }
}

export { Collision };