
import { TYPE, BOOLEAN, UTIL } from '../helpers.js';
import { AssertionException } from '../exception.js';


/**
 * @function
 * Log a message and throw an error if a test fails
 * 
 * @todo use the Logging module instead of console when the Logging module is implemented
 * @private
 * @param {...{}} message
 */
function assertFailed(...message) {
  const exceptionMessage = message.join(' ');
  const error = new AssertionException(exceptionMessage);
  console.error(...message, error);
  throw error;
}

/** @namespace ASSERT */
const ASSERT = {
  /**
   * Test that the value is not null or 'undefined'.
   *
   * @throws AssertionException if value is null
   * @param {*} value - the value to test
   * @param {...{}} message to log on failure
   * 
   */
  notNull: function (value, ...message) {

  },
  /**
   * Test that the value is  null or 'undefined'.
   *
   * @throws AssertionException if value is null
   * @param {*} value - the value to test
   * @param {...{}} message to log on failure
   */
  isNull: function (value, ...message) {

  },
  /**
  * Throw an exception if the value is not true.
  * BOOLEAN.isTrue is used to determine if it's true.
  *
  * @throws AssertionException if value is null
  * @param {*} value - the value to test
   * @param {...{}} message to log on failure
  */
  isTrue: function (value, ...message) {

  },

  /**
  * Throw an exception if the value is true.
  * BOOLEAN.isTrue is used to determine if it's true.
  *
  * @throws AssertionException if value is null
  * @param {*} value - the value to test
   * @param {...{}} message to log on failure
  */
  isFalse: function (value, ...message) {

  },
  /**
   * determine if the value is the correct type.
   * type can be a string ('number','function') or a class (e.g. Object, Array, Game).

  * if type is an array, value must match one of the types.
  *
  * @throws AssertionException if value is null
  * @param {*} value - the value to test
  * @param {string | class | Array} type or types the value must match
   * @param {...{}} message to log on failure
  */
  isType: function (value, type, ...message) {

  },
  /**
  * determine if the value is the correct type but allow null.
  * 
  * @throws AssertionException if value is null
  * @param {*} value - the value to test
  * @param {string | class | Array} type or types the value must match
   * @param {...{}} message to log on failure
  */
  isTypeOrNull: function (value, type, ...message) {

  },
  /**
  * determine if the value is an Array.
  * this is the same as isType(value,Array,message)
  * 
  * @throws AssertionException if value is null
  * @param {*} value - the value to test
   * @param {...{}} message to log on failure
  */
  isArray: function (value, ...message) {

  },
  /**
   * Determine if the value is in an array.
   * For example if debug level must be DEBUG, INFO, or WARN
  * 
  * ```
  * ASSERT.isOneOf(level,[DEBUG,INFO,WARN], "invalid debug level",level);
  * ```
   * 
  * @throws AssertionException if value is null
  * @param {*} value - the value to test
  * @param {Array<*>} array - an array of allowed values.
  * @param {string | class | Array} type or types the value must match
   * @param {...{}} message to log on failure
   */
  isOneOf: function (value, options, ...message) {

  },
  /**
 * Determine if the value is in a range. This is mainly intended for
 * testing numbers, but will work for any values that can be tested
 * with >= and <=.
 * 
 * The range is inclusive.  So all of these are ok
 * 
 * ```
 * ASSERT.inRange(0,[0,100], "value is not in range 0-100");
 * ASSERT.inRange(100,[0,100], "value is not in range 0-100");
 * ASSERT.inRange(50,[0,100], "value is not in range 0-100");
 * ```
 * 
 * These will throw exception
 * 
 * ```
 * ASSERT.inRange(0,[1,100], "value is not in range 1-100");
 * ASSERT.inRange(101,[1,100], "value is not in range 1-100");
 * ```
 * 
* @throws AssertionException if value is null
* @param {*} value - the value to test
* @param {Array} array of 2 values with min and max range ([min,max]);
 * @param {...{}} message to log on failure
 */
  inRange: function (value, range, ...message) {

  },
  /**
 * Determine if the value empty.
 * Strings, arrays, and objects have different tests for emptyness
 * and this works for all of them.  UTIL.isEmpty is used to test.
 *
* @throws AssertionException if value is null
* @param {*} value - the value to test
   * @param {...{}} message to log on failure
 */
  notEmpty: function (value, ...message) {

  },

  /**
  * Allways throw an exception.
  * This may be used when validity isn't known
  * until other things are done.  For example, the
  * final else{} in a set of if/else tests.
  *
  * @throws AssertionException if value is null
   * @param {...{}} message to log 
  */
  fail: function (...message) {

  }
};

export { ASSERT };
