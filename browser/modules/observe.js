import { Observable } from './observe/observable.js';
import { Observer } from './observe/observer.js';

/**
 * @module Observe
 * 
 */


/**
 * Creates an Observable for any object;
 *
 * Usage:
 * 
 * ```
 * usage:
 * class ToBeWatched {
 *      constructor() {
 *          this._observable = createObservable(this);
 *      }
 * 
 *      get Observable() { return this._observable; }
 * 
 *      someMethod() {
 *          // change happened
 *          const details = {...};
 *          this._observable.changed(details);
 *      }
 * }
 * ```
 * 
 * The observable object can create multiple observables for
 * different types of change or different properties that change. 
 * 
 * @instance
 * @param {*} watchedObject - the object to be watched
 * @returns {Observable} an Observable that can be watched
 */
function createObservable(watchedObject) {
    return new Observable(watchedObject);
}

/**
 * Creates an Observer for 
 *
 * usage:
 * 
 * ```
 * class WatchingClass {
 *   constructor(toBeWatched) {
 *       this._observer = createObserver(toBeWatched.Observable,
 *                              this.onChange.bind(this));
 *   }
 * 
 *   onChange(toBeWatched, details) {
 *    // something changed.  
 *   }
 * }
 * ```
 *  
 * @instance
 * @param {*} watchedObject the object to watch
 * @param {*} observationHandler - a function to call when the watched object changes or does something
 * @returns {Observer}
 */
function createObserver(observable, observationHandler) {
    return new Observer(observable, observationHandler);
}

export { createObservable, createObserver };