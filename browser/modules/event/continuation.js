import { createLogger } from '../logging.js';
const log = createLogger('Continuation');


export class EventContinuation {
    constructor(stopPropagation, stopImmediate, stopDefault) {
        this._stopPropagation = stopPropagation;
        this._stopImmediate = stopImmediate;
        this._stopDefault = stopDefault;
    }

    get StopPropagation() {
        return this._stopPropagation;
    }
    get StopImmediate() {
        return this._stopImmediate;
    }
    get StopDefault() {
        return this._stopDefault;
    }
}

export const CONTINUATION = {
    STOP_PROPAGATION: new EventContinuation(true, false, false),
    STOP_IMMEDIATE: new EventContinuation(true, true, false),
    STOP_DEFAULT: new EventContinuation(false, false, true),
    STOP_ALL: new EventContinuation(true, true, true),
    CONTINUE: new EventContinuation(false, false, false)

}
