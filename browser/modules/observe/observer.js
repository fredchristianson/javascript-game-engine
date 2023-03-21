import { Observable } from './observable.js';
import { ASSERT } from '../assert.js';


/**
 * Creates a callback for changes on an Observable object
 */
class Observer {
    /**
     * Creates an instance of Observer.
     *
     * @constructor
     * @param {Obserbable} observable
     * @param {function} handlerFunction
     */
    constructor(observable, handlerFunction) {
        ASSERT.isType(observable, Observable, "Observer parameter must be an Observable");
        ASSERT.isType(handlerFunction, 'function', "handlerFunction parameter must be a 'function'");
        this._observable = observable;
        this._handlerFunction = handlerFunction;
        observable._addObserver(this);
    }

    _handleChange(observable, details) {
        this._handlerFunction(observable, details);
    }

    stop() {
        this._observable.remove(this);
    }
}

export { Observer };