/**
 * Throw when and ASSERT test fails
 * 
 * @export
 * @class AssertionException
 * @extends {Error}
 */
class AssertionException extends Error {
  /**
   * Creates an instance of AssertionException.
   *
   * @constructor
   * @param {String} message - displayable message
   */
  constructor(message) {
    super(message ?? 'AssertionException');
  }
}

export { AssertionException };