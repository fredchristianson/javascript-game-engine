import { ASSERT } from '../assert.js';
import { createLogger } from '../logging/logger.js';
import { HandlerFunction } from './handler-function.js';
import { EventHandler } from './event-handler.js';
import { EventHandlerBuilder } from './event-builder.js';
const log = createLogger('InputHandler');


export class InputEventHandler extends EventHandler {
    constructor() {
        super();
        this.EventTypes = ['Input', 'Change'];
    }

    _getHandlerArguments(event, target) {
        if (event.type == 'input') {
            return [target.value, target];
        }
        return [];
    }
}

export class InputHandlerBuilder extends EventHandlerBuilder {
    constructor() {
        super(new InputEventHandler());
    }

    onChange(...args) {
        ASSERT.isTrue(args.length > 0, 'handler requires a paramter');
        this._eventHandler.addHandlerFunction(new HandlerFunction('Input', ...args));
        return this;
    }

    /**
     * maps CSS selectors to methods in a handler object
     *
     * @param {*} handlerObject object with methods to handle change events
     * @param {*} selectorMethods names are selectors and values are handler methods in handlerObject
     * @returns {this}
     */
    changeHandlers(handlerObject, selectorMethods) {
        ASSERT.isObject(handlerObject, 'changeHandlers requires a handler object');
        ASSERT.isNotNull(selectorMethods?.entries, 'selectorMap must implement entries()');
        for (const [selector, method] of selectorMethods.entries()) {
            const handler = new HandlerFunction('input', handlerObject, method);
            handler.setSelector(selector);
            this._eventHandler.addHandlerFunction(handler);
        }
        return this;
    }
}