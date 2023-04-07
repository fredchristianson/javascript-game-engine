import { createLogger } from '../../modules/logging.js';
import { Entity } from '../entity/entity.js';

const log = createLogger('Action');

class Action extends Entity {

    constructor(type) {
        super(type);
        this._handler = null;
    }


    get Handler() {
        return this._handler;
    }
    set Handler(handler) {
        this._handler = handler;
    }

    check() {
        if (this._warnOnce == null) {
            this._warnOnce = 'done';
            log.warn('derived class does not implement Action.check()', this._type);
        }
    }
    _doAction() {
        this._handler.call(this._data);
    }
}

export { Action };