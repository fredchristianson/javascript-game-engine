import { createLogger } from '../../modules/logging.js';
import { Entity } from '../entity/entity.js';

const log = createLogger('Action');

class Action extends Entity {

    constructor(type) {
        super(type);
        this._handler = null;
        this._kind = null;
        this._data = null;
    }

    get Kind() {
        return this._kind;
    }
    set Kind(kind) {
        this._kind = kind;
    }

    get Data() {
        return this._data;
    }
    set Data(data) {
        this._data = data;
    }
    get Handler() {
        return this._handler;
    }
    set Handler(handler) {
        this._handler = handler;
    }

    process() {
        log.once(LOGLEVELS.ERROR, 'derived class does not implement Action.process()', this._type);

    }
    _doAction() {
        this._handler.call(this._data);
    }
}

export { Action };