import { createLogger } from '../../modules/logging.js';
import { ChildWindow } from '../../modules/window.js';
import { WorldBase } from './world-base.js';
const log = createLogger('WindowWorld');

class WindowWorld extends WorldBase {
    constructor(url = null, name = 'world') {
        super();
        this._name = name;
        this._window = new ChildWindow(name, url);
    }

    async getDocument() {
        this._document = await this._window.getDocument();
        this._worldHost = this._document.body.querySelector('.world');
        super.attach(this._worldHost);
    }

    _close() {
        this._window.close();
    }

}

export { WindowWorld };