import { ASSERT } from '../assert.js';
import { createLogger } from '../logging.js';
import { UTIL } from '../helpers.js';
import { getDocumentDOM, DOMElementType } from '../dom/dom-common.js';
import { EventHandler } from './event-handler.js';
const log = createLogger("EventListener");

export class EventListener {
    constructor(dom, listenToElement, eventHandler) {
        ASSERT.isTypeOrNull(listenToElement, ['string', DOMElementType, HTMLElement], "listenTo parameter for EventListener must be a string (CSS selector) or HTMLElement");
        ASSERT.isType(eventHandler, EventHandler, "eventHandlerParameter of contructor must be an EventHandler");
        this._dom = dom ?? getDocumentDOM();
        if (UTIL.isNullish(listenToElement)) {
            this._listenToElements = [this._dom.Root];
        } else {
            this._listenToElements = this._dom.all(listenToElement);
        }
        this._eventHandler = eventHandler;
        this._eventTypes = eventHandler.EventTypes;
        this._elementTypePairs = [];
        this._onEventFunction = this._onEvent.bind(this);
        this._options = {
            passive: eventHandler.PassiveListener,
            capture: eventHandler.CaptureEvents,
            once: eventHandler.ListenOnce
        }
        this._createListeners(listenToElement, eventHandler.EventTypes);
    }

    _onEvent(event) {
        log.debug("event ", event.type);
        this._eventHandler.processEvent(event);
    }
    _createListeners() {
        ASSERT.isFalse(UTIL.isEmpty(this._listenToElements), "EventListener has no elements to listen to.");
        ASSERT.isFalse(UTIL.isEmpty(this._eventTypes), "EventListener has no event types to listen to.");
        this._elementTypePairs = UTIL.join(this._listenToElements, this._eventTypes);
        for (let [element, type] of this._elementTypePairs) {
            const htmlElement = element.getHTMLElement();
            log.debug("addEventListener", type, htmlElement);

            htmlElement.addEventListener(type, this._onEventFunction, this._options);
        }
    }

    removeListeners() {
        for (let [element, type] of this._elementTypePairs) {
            element.removeEventListener(element, type, this._onEventFunction, this._options);
        }
    }
}