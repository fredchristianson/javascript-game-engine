import { ASSERT } from '../assert.js';
import { DOMElement, domElementOf } from '../dom/html.js';
import { STRING, UTIL } from '../helpers.js';
import { createLogger } from '../logging/logger.js';
import { HandlerFunction } from './handler-function.js';
const log = createLogger('EventListener');


export class EventHandler {
    constructor() {
        /*
         * either _selector or _targetElement can be non-null;
         * _selector is a CSS selector.  _targetElement is a DOMElement
         */
        this._selector = null;
        this._targetElement = null;
        this._continuation = null;
        this._handlerFunctions = [];
        this._eventTypes = [];
        this._dom = null;
        this._capture = false;
        this._passive = false;
        this._listenOnce = false;
    }

    get PassiveListener() {
        return this._passive;
    }
    get Capture() {
        return this._capture;
    }
    get ListenOnce() {
        return this._listenOnce;
    }
    set PassiveListener(enable) {
        this._passive = enable;
    }
    set Capture(enable) {
        this._capture = enable;
    }
    set ListenOnce(enable) {
        this._listenOnce = enable;
    }

    get EventTypes() {
        return this._eventTypes;
    }
    set EventTypes(types) {
        ASSERT.isType(types, ['string', Array], 'EventTypes must be a string or array');
        this._eventTypes = UTIL.toArray(types);
    }

    addHandlerFunction(func) {
        ASSERT.isType(func, HandlerFunction, 'Parameter must be a HandlerFunction');
        this._handlerFunctions.push(func);
    }

    addEventTypes(...types) {
        ASSERT.isType(types, Array, 'addEventType parameter must be an array');
        for (const type of types) {
            ASSERT.isType(type, 'string', 'addEventTypes parameters must be strings');
            this._eventTypes.push(type);
        }
        this._eventTypes.push(type);
    }

    get Selector() {
        return this._selector ?? this._targetElement;
    }
    set Selector(selector) {
        ASSERT.isType(selector, ['string', DOMElement, HTMLElement], 'eventselector must be a string (CSS selector) or HTMLElement');
        ASSERT.isTrue(this._selector == null && this._targetElement == null,
            'EventHandler selector is already set');
        if (STRING.isString(selector)) {
            this._selector = selector;
            this._targetElement = null;
        } else {
            this._selector = null;
            this._targetElement = HTML.domElementOf(selector);
        }
    }

    get Continuation() {
        return this._continuation;
    }
    set Continuation(continuation) {
        ASSERT.isType(continuation, ['string', Element, HTMLElement], 'eventcontinuation must be a string (CSS selector) or HTMLElement');
        this._continuation = continuation;
    }

    processEvent(event) {
        const target = this._getEventHandlerTarget(event);
        if (target === null) {
            // event does not match selector of this handler
            return;
        }
        const args = this._getHandlerArguments(event, target);
        for (const handlerFunction of this._handlerFunctions) {
            handlerFunction.call(this, event, target, ...args);
        }
    }

    _getEventHandlerTarget(event) {
        if (this._selector) {
            /*
             * if there is a selector string,
             * find a matching element that is a parent of the target.
             * returns null if no match found.
             */
            return domElementOf(event.target).closest(this._selector);
        } else if (this._targetElement) {
            /*
             * if we have a single targetElement,
             * make sure the event target is the targetElement or a child
             */
            domElement = this._targetElement;
            if (domElement.matches(event.target) || domElement.contains(event.target)) {
                return domElement;
            }
            return null;
        } else {
            // return the event target if there is no selector or targetElement
            return domElementOf(event.target);
        }
    }

    _getHandlerArguments(_event, _target) {
        return [];
    }

}

export class ClickEventHandler extends EventHandler {
    constructor() {
        super();
        this.EventTypes = ['click', 'mousedown'];
    }

    _getHandlerArguments(event, target) {
        if (event.type == 'click') {
            return [target];
        }
        return [];
    }
}