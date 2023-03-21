/**
 * An observable object
 *
 */
class Observable {
    /**
     * Creates an instance of Observable.
     *
     * @constructor
     * @param {*} watchedObject
     */
    constructor(watchedObject) {
        this._watchedObject = watchedObject;
        this._observers = [];
    }

    /**
     * this is called when the watched object does something
     * that is being observed.  It can pass details about
     * the change or action.
     *
     * @param {*} details
     */
    async changed(details = null) {
        for (let observer of this._observers) {
            try {
                observer._handleChange(this._watchedObject, details);
            } catch (ex) {
                // logging cannot be imported at module level
                // because of cycles.  import as needed.
                const logging = await import('../logging.js');
                const log = logging.createLogger("Observable");
                log.error("Observer failed to handle change", ex);
            }
        }

    }

    _addObserver(observer) {
        if (!this._observers.includes(observer)) {
            this._observers.push(observer);
        }

    }

    _removeObserver(observer) {
        const index = this._observers.indexOf(observer);
        if (index >= 0) {
            this._observers.splice(index, 1);
        }
    }
}

export { Observable };