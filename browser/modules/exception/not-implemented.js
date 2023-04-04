/**
 * Throw when a derived class had not implemented a required method
 * 
 * @export
 * @extends {Error}
 */
class NotImplementedException extends Error {
    /**
     * Creates an instance of NotImplementedException.
     *
     * @constructor
     * @param {String} message - displayable message
     */
    constructor(message) {
        super(message ?? 'NotImplementedException');
    }
}

export { NotImplementedException };