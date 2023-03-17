/**
 * Thrown if a parameter is invalid.
 *
 * @export
 * @class ArgumentException
 * @extends {Error}
 */
class ArgumentException extends Error {
  /**
   * Creates an instance of ArgumentException.
   *
   * @constructor
   * @param {String} message - displayable message
   */
  constructor(message) {
    super(message ?? 'ArgumentException');
  }
}

export { ArgumentException };