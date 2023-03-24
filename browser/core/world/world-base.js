import { ShadowDOM } from '../../modules/dom/dom.js';
import { createLogger } from '../../modules/logging/logger.js';
const log = createLogger('WorldBase');

class WorldBase {
    constructor() {
        this._domElement = null;
    }

    attach(element) {
        this._domElement = element;
        this._shadowDom = new ShadowDOM(element);
    }

    getDOM() {
        return this._shadowDom;
    }

    close() {
        this._close();
    }

    _close() { }
}

export { WorldBase };