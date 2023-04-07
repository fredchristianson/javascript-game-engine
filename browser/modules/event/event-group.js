import { ASSERT } from '../assert.js';
import { EventListener } from './event-listener.js';
import { createLogger } from '../logging/logger.js';
const log = createLogger('EventGroup');

export class EventGroup {
    constructor() {
        this._eventHandlers = [];
    }

    removeAll() {
        for (const event of this._eventHandlers) {
            event.removeListeners();
        }
        this._eventHandlers.splice(0, this._eventHandlers.length);
    }

    add(eventListener) {
        ASSERT.isType(eventListener, EventListener);
        this._eventHandlers.push(eventListener);
    }
}

