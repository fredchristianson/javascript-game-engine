import { ASSERT } from '../assert.js';
import { createLogger } from '../logging/logger.js';
import { EventGroup } from './event-group.js';
import { EventContinuation } from './continuation.js';
import { HandlerFunction } from './handler-function.js';
import { ClickEventHandler, EventHandler } from './event-handler.js';
import { EventListener } from './event-listener.js';
import { isDOM, DOMElementType } from '../dom/dom-common.js';
const log = createLogger('EventListener');


export class EventHandlerBuilder {
    constructor(eventHandler = new EventHandler()) {
        ASSERT.isType(eventHandler, EventHandler, 'EventHandlerBuilder required an EventHandler parameter');
        this._eventHandler = eventHandler;
        this._eventGroup = null;
        this._listenTo = null;
        this._dom = null;
    }

    build() {
        const listener = new EventListener(this._dom, this._listenTo, this._eventHandler);
        if (this._eventGroup) {
            this._eventGroup.add(listener);
        }
        if (this._dom) {
            this._dom.addListener(listener);
        }
        return listener;
    }

    setGroup(eventGroup) {
        ASSERT.isType(eventGroup, EventGroup, 'setGroup parameter must be an EventGroup');
        ASSERT.isNull(this._eventGroup, 'eventGroup has already been set for this builder');
        this._eventGroup = eventGroup;
        return this;
    }

    DOM(dom) {
        ASSERT.isTrue(isDOM(dom), 'setDOM parameter must be a DOM');
        this._dom = dom;
        return this;
    }

    /*
     * an element or CSS selector that is passed to the handler function 
     */
    listenTo(element, dom = null) {
        if (dom == null && isDOM(element)) {
            this._dom = element;
            this._listenTo = element.HTMLElement;
            return this;
        }
        ASSERT.isType(element, ['string', DOMElementType, HTMLElement], 'eventTarget must be a string (CSS selector) or HTMLElement');
        this._listenTo = element;
        this._dom = dom;
        return this;
    }

    /*
     * an element or CSS selector that is passed to the handler function 
     */
    selector(target) {
        ASSERT.isType(target, ['string', DOMElementType, HTMLElement], 'eventTarget must be a string (CSS selector) or HTMLElement');
        this._eventHandler.Selector = target;
        return this;
    }

    eventType(...types) {
        this._eventHandler.addEventTypes(...types);
    }

    continuation(cont) {
        ASSERT.isType(cont, EventContinuation, 'Continuation parameter must be an EventContinuation');
        this._eventHandler.Continuation = cont;
        return this;
    }
    handle(...args) {
        ASSERT.isTrue(args.length > 0, 'handler requires a paramter');
        this._eventHandler.addHandlerFunction(new HandlerFunction(...args));
        return this;
    }
}

export class ClickHandlerBuilder extends EventHandlerBuilder {
    constructor() {
        super(new ClickEventHandler());
    }

    onClick(...args) {
        ASSERT.isTrue(args.length > 0, 'handler requires a paramter');
        this._eventHandler.addHandlerFunction(new HandlerFunction('click', ...args));
        return this;
    }
}