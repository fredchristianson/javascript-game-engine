// importing from ./logging.js causes loop.  get from logger.js
import { createLogger } from './logging/logger.js';
const log = createLogger('Window');


const childWindows = [];
window.addEventListener('beforeunload', () => {
    for (const window of childWindows) {
        window.close();
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
    constructor(name, url) {
        super();
        this._name = name ?? 'unnamed';
        this._url = url;
        this._isLoaded = false;
        this._unloaded = true;
        childWindows.push(this);

    }

    async open() {
        const other = childWindows.find((child) => {
            return child._name == this._name;
        });
        if (other != null) {
            this._window = other._window;
        }
        if (this._window == null || this._window.closed) {
            this._isLoaded = new Promise((resolve, _reject) => {
                this._window = window.open(
                    this._url,
                    this._name,
                    'toolbar=false,resizeable=yes'
                );
                this._addListeners(resolve, _reject);


            });
            await this._isLoaded;
        }
    }

    _addListeners(resolve, _reject) {
        this._window.addEventListener('load', () => {
            log.debug(`loaded window for ${this._url}`);
            this._unloaded = false;
            /*
             * this._window.addEventListener('beforeunload', () => {
             *     this._saveScreenPosition();
             * });
             */

            this._setScreenPosition();
            this._window.getScreenDetails()
                .then(() => {
                    //user allowed multiscreen
                    resolve();
                })
                .catch(() => {
                    // user did not allow multiscreen.  not a problem.
                    resolve();
                });

        });
        this._window.onunload = () => {
            log.debug(`unloading ${this._url}`);
            this._saveScreenPosition();
            this._unloaded = true;
        };
    }

    _setScreenPosition() {
        log.debug('set screen postion');

        const value = localStorage.getItem(`log-view-position-${this._name}`);
        if (value) {
            setTimeout(() => {
                log.debug('got  postion', value);
                const pos = JSON.parse(value);
                if (pos.w > 100 && pos.h > 100) {
                    this._window.resizeTo(pos.w, pos.h);
                    this._window.moveTo(pos.x, pos.y);
                }
            }, 200);
        }
    }

    _saveScreenPosition() {
        if (this._unloaded || this._window == null || this._window.closed) {
            log.warn('saving position of closed window');
            return;
        }

        log.debug('save screen postion');
        /*
         * if user allowed multiple screens, this will get the
         * screen position.  if not, this will position the this._window
         * on the main this._window's screen;
         */
        const x = this._window.screenX;
        const y = this._window.screenY;
        const w = this._window.outerWidth;
        const h = this._window.outerHeight;
        if (w > 0 && h > 0) {
            const pos = { x, y, w, h };
            const value = JSON.stringify(pos);
            log.debug('save screen postion', value);
            localStorage.setItem(`log-view-position-${this._name}`, value);
        }
    }

    async getDocument() {
        await this.open();
        return this._window?.document;
    }

    close() {
        this._window.close();
    }


}

export class ParentWindow extends Window {
    constructor() {
        super(window.parent);
        this.listen();
    }
}