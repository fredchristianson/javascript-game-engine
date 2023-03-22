import { ASSERT } from '../assert.js';
import { FUNCTION, STRING, TYPE } from '../helpers.js';
import { createLogger } from '../logging.js';
import { EventContinuation } from './continuation.js';
const log = createLogger('HandlerFunction');


export class HandlerFunction {
    constructor(...args) {
        ASSERT.isTrue(args.length > 0, 'EventHandler requires a handler object or function');
        let func = 0;
        let obj = null;
        let eventType = null;
        if (args.length == 1) {
            func = args[0];
        } else {
            obj = args.find((arg) => {
                return TYPE.isType(arg, Object);
            });
            func = args.find((arg) => {
                return FUNCTION.isFunction(arg);
            });
            eventType = args.find((arg) => {
                return STRING.isString(arg);
            });
        }
        ASSERT.isTrue(FUNCTION.isFunction(func), 'EventHandler argument must be a function');
        this._function = func;
        this._object = obj;
        this._eventType = eventType;
    }

    async call(handler, event, target, ...args) {
        let cont = handler.Continuation;
        if (this._eventType != null && this._eventType != event.type) {
            return; // this handler doesn't want the event type
        }
        try {
            const result = await this._function.call(this._object, ...args, target, event, handler);
            if (result != null) {
                ASSERT.isType(result, EventContinuation, 'event handler returned a result that is not an EventContinuation');
                cont = result;
            }
        } catch (ex) {
            log.error('Failed to handle event', event.type, ex);
        }
    }

}