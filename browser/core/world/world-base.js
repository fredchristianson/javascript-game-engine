import { ShadowDOM } from '../../modules/dom/dom.js';
import { createLogger } from '../../modules/logging/logger.js';
import { Layer } from '../layer/layer.js';
const log = createLogger('WorldBase');

class WorldBase {
    constructor() {
        this._domElement = null;
        this._layers = [];
    }

    attach(element) {
        this._domElement = element;
        if (element instanceof ShadowDOM) {
            this._shadowDom = element;
        } else {
            this._shadowDom = new ShadowDOM(element);
        }
    }

    getDOM() {
        return this._shadowDom;
    }

    close() {
        this._close();
    }

    buildLayer() {
        log.debug('create layer');
        const layer = new Layer();
        this._layers.push(layer);
        return layer;
    }

    _close() { }
}

export { WorldBase };