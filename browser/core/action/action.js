import { createLogger } from '../../modules/logging.js';

const log = createLogger('Action');

class Action {

    constructor(type) {
        this._type = type;
        this._handler = null;
        this._data = null;
    }

    get Handler() {
        return this._handler;
    }
    set Handler(handler) {
        this._handler = handler;
    }
    get Type() {
        return this._type;
    }

    get Data() {
        return this._data;
    }

    set Data(data) {
        this._data = data;
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