import { createLogger } from '../../modules/logging.js';
import { ChildWindow } from '../../modules/window.js';
import { WorldBase } from './world-base.js';
import { DOM } from '../../modules/dom.js';

const log = createLogger('WindowWorld');

class WindowWorld extends WorldBase {
    constructor(url = null, name = 'world') {
        super();
        this._name = name;
        this._window = new ChildWindow(name);
        this._window.create(url);
        this._documentDOM = null;
    }

    async create() {
        const document = await this._window.getDocument();
        const body = document.body;
        this._documentDOM = new DOM.DocumentDOM(body);
        this._worldHost = this._documentDOM.first('.world');
        super.attach(this._worldHost);
    }

    getDocumentDOM() {
        return this._documentDOM;
    }

    getDOM() {
        return super.getDOM();
    }


    _close() {
        this._window.close();
    }

}

export { WindowWorld };