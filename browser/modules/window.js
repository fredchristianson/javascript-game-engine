/* 
* DO NOT LOG in this class.  
* Logging uses this class for output and it will loop.
*/

const childWindows = [];
window.addEventListener("beforeunload", () => {
    for (let window of childWindows) {
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
            this._window.postMessage(message, "*");
        }
    }

    _handleMessage(event) {
        try {
            const message = JSON.parse(event.data);
            for (let handler of this._messageHandlers) {
                handler(message.data);
            }
        } catch (ex) {
            console.error("failed to parse window message:", event.data, ex);
        }
    }
}

export class ChildWindow extends Window {
    constructor(name, url) {
        super();
        this._name = name;
        this._url = url;
        childWindows.push(this);

    }

    async open() {
        return new Promise((resolve, reject) => {
            if (this._window == null || this._window.closed) {
                this._window = window.open(
                    this._url,
                    this._name,
                    `toolbar=false,resizeable=yes`
                );
                this._window.addEventListener("load", () => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
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