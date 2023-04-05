/*
 * do not use Logging in this file
 * WindowLogger uses Window and will recurse
 */

import { TIMER } from './timer.js';
import { UTIL } from './helpers.js';
import { DocumentDOM } from './dom/dom.js';

function registerChildWindow(child) {
    if (window._gameChildren == null) {
        window._gameChildren = [];
    }
    window._gameChildren.push(child);
}

window.addEventListener('beforeunload', () => {
    if (window._gameChildren != null) {
        for (const child of window._gameChildren) {
            child?.close();
        }
    }
});

class Window {
    constructor(window = null) {
        this._window = window;
        this._messageHandlers = [];
    }

    addMessageHandler(handlerFunction) {
        this._messageHandlers.push(handlerFunction);
    }

    listen() {
        this._window.addEventListener('message', this._handleMessage.bind(this));
    }

    sendMessage(type, data) {
        if (this._window != null) {
            const message = JSON.stringify({ type, data });
            this._window.postMessage(message, '*');
        }
    }

    _handleMessage(event) {
        try {
            const message = JSON.parse(event.data);
            for (const handler of this._messageHandlers) {
                handler(message.data);
            }
        } catch (ex) {
            console.error('failed to parse window message:', event.data, ex);
        }
    }
}

export class ChildWindow extends Window {
    constructor(name) {
        super();
        this._name = name ?? 'unnamed';
        this._isLoaded = false;
        this._unloaded = true;
        //childWindows.push(this);
        registerChildWindow(this);

        this._window = null;

        this._boundLoadHandler = this._loadHandler.bind(this);
        this._boundUnloadHandler = this._unloadHandler.bind(this);
        this._positionTimer = TIMER.repeatSeconds(5)
            .call(this._saveScreenPosition.bind(this));
    }

    async create(url) {
        this._url = url;
        this.close();
        this._positionTimer = TIMER.repeatSeconds(5)
            .call(this._saveScreenPosition.bind(this));
        await this.open();
        return this._window.document;
    }

    async open() {
        if (UTIL.isNullish(this._window) || this._window.closed) {

            this._isLoaded = new Promise((resolve, _reject) => {
                this._resolve = resolve;
            });
            const features = this._createFeatures();
            //console.log('open window');
            this._window = window.open(
                this._url,
                this._name,
                features
            );

            this._addListeners();

            await this._isLoaded;
        } else if (this._isLoaded) {
            await this._isLoaded;
        }

    }

    /**
     * The 3rd parameter of window.open is a string of features.  
     * If we have saved the window's position before set the 
     * top/left/width/height features.
     * Otherwise set the "popup=true" feature and the browser will 
     * set the position.  If it is not a popup, it will probably
     * be a new tab instead of new window.
     *
     * @returns {*}
     */
    _createFeatures() {
        let values = ['popup=true'];
        try {
            const position = localStorage.getItem(`child-view-position-${this._name}`);
            if (position !== null && typeof position == 'string') {
                values = []; // no popup if we have a position
                // pos
                const pos = JSON.parse(position);
                if (typeof pos.left == 'number') {
                    values.push(`left=${pos.left}`);
                }
                if (typeof pos.top == 'number') {
                    values.push(`top=${pos.top}`);
                }
                if (typeof pos.width == 'number') {
                    values.push(`width=${pos.width}`);
                }
                if (typeof pos.height == 'number') {
                    values.push(`height=${pos.height}`);
                }
            }
        } catch (ex) {
            // ignore exceptions (invalid JSON position in localStorage)
            log.error(`cannot parse position ${ex.message}`);
            console.log(ex);
        }

        return values.join(',');
    }

    _addListeners() {

        this._window.addEventListener('load', this._boundLoadHandler);
    }

    _loadHandler() {
        this._unloaded = false;


        this._setScreenPosition();
        if (this._window.getScreenDetails) {
            this._window.getScreenDetails()
                .then(() => {
                    //user allowed multiscreen
                    this._resolve();
                })
                .catch((ex) => {
                    // user did not allow multiscreen.  not a problem.
                    this._resolve();
                });
            //console.log('set unload handler');
        }
        this._window.onunload = this._boundUnloadHandler;

    }

    _unloadHandler() {
        //console.log('unload');

        /*
         *  doesn't work well.  save position on 
         *  a timer instead
         * this._saveScreenPosition();
         */
        if (this._window && this._window.onunload != null && this._window.onunload == this._boundUnloadHandler) {
            this._window.onunload = null;
        }
        this._removeListeners();
        this._positionTimer?.cancel();
    }
    _removeListeners() {
        if (this._window) {
            this._window.removeEventListener('load', this._boundLoadHandler);
        }
    }

    _setScreenPosition() {

        const value = localStorage.getItem(`child-view-position-${this._name}`);
        if (value) {
            setTimeout(() => {
                const pos = JSON.parse(value);
                if (pos.w > 100 && pos.h > 100) {
                    this._window?.resizeTo(pos.width, pos.height);
                    this._window?.moveTo(pos.left, pos.top);
                }
            }, 200);
        }
    }

    _saveScreenPosition() {
        if (this._window == null || this._window.closed) {
            return;
        }

        /*
         * if user allowed multiple screens, this will get the
         * screen position.  if not, this will position the this._window
         * on the main this._window's screen;
         */
        const x = this._window.screenX;
        const y = this._window.screenY;
        const w = this._window.innerWidth;
        const h = this._window.innerHeight;
        if (w > 0 && h > 0) {
            const pos = { left: x, top: y, width: w, height: h };
            const value = JSON.stringify(pos);
            //console.log(`save screen postion ${value}`);
            localStorage.setItem(`child-view-position-${this._name}`, value);
        }
    }

    async getDocument() {
        await this.open();
        return this._window?.document;
    }

    async getDOM() {
        await this.open();
        return new DocumentDOM(this._window?.document);
    }

    close() {
        if (this._window) {
            this._window.close();
            this._removeListeners();
            this._window = null;
        }
        this._positionTimer?.cancel();
    }


}

export class ParentWindow extends Window {
    constructor() {
        super(window.parent);
        this.listen();
    }
}