/**
 * Error thrown if and API request fails
 *
 * @export
 * @class APIException
 * @extends {Error}
 */
class ApiException extends Error {
  /**
   * Creates an instance of APIException.
   *
   * @constructor
   * @param {String} message - the error message
   * @param {Object} response - response from API request
   */
  constructor(message, response) {
    super(message ?? 'ArgumentException');
    this._response = response;
  }

  /**
   * Return the  HTTP response object
   *
   */
  get Response() {
    return this._response;
  }
}

export { ApiException };