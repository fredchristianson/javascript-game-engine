
import { TYPE, BOOLEAN, UTIL } from '../helpers.js';
import { AssertionException } from '../exception.js';


/**
 * Log a message and throw an error if a test fails
 * 
 * @private
 * @param {...{}} message to write to the logs
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
    if (value === null || typeof value === 'undefined') {
      assertFailed(...message);
    }
  },
  /**
   * Test that the value is  null or 'undefined'.
   *
   * @throws AssertionException if value is null
   * @param {*} value - the value to test
   * @param {...{}} message to log on failure
   */
  isNull: function (value, ...message) {
    if (value !== null && typeof value !== 'undefined') {
      assertFailed(...message);
    }
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
    if (!BOOLEAN.isTrue(value)) {
      assertFailed(...message);
    }
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
    if (!BOOLEAN.isFalse(value)) {
      assertFailed(...message);
    }
  },
  /**
   * determine if the value is the correct type.
   * type can be a string ('number','function') or a class (e.g. Object, Array, Game).
   *
   * if type is an array, value must match one of the types.
   *
   * @throws AssertionException if value is null
   * @param {*} value - the value to test
   * @param {string | class | Array} type or types the value must match
   * @param {...{}} message to log on failure
   */
  isType: function (value, type, ...message) {
    let success = false;
    if (Array.isArray(type)) {
      success = type.find((t) => {
        return TYPE.isType(value, t);
      });
    } else {
      success = TYPE.isType(value, type);
    }
    if (!success) {
      assertFailed(...message);
    }
  },
  /**
   * determine if the value is a string
   * 
   * @throws AssertionException if value is null
   * @param {*} value - the value to test
   * @param {...{}} message to log on failure
   */
  isString: function (value, ...message) {
    ASSERT.isType(value, 'string', ...message);
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
    if (value !== null && typeof value !== 'undefined') {
      this.isType(value, type, ...message);
    }
  },
  /**
   * determine if the value is an Array.
   * this is the same as isType(value,Array,message)
   * 
   * @throws AssertionException if value is null
   * @param {*} value - the value to test
   * @param {...{}} message to log on failure
   */
  isObject: function (value, ...message) {
    this.isType(value, Object, ...message);
  },  /**
   * determine if the value is an Array.
   * this is the same as isType(value,Array,message)
   * 
   * @throws AssertionException if value is null
   * @param {*} value - the value to test
   * @param {...{}} message to log on failure
   */
  isArray: function (value, ...message) {
    this.isType(value, Array, ...message);
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
   * @param {Array<*>} options - an array of allowed values.
   * @param {string | class | Array} type or types the value must match
   * @param {...{}} message to log on failure
   */
  isOneOf: function (value, options, ...message) {
    if (UTIL.isNullish(value)) {
      logger.error('ASSERT.isOneOf called with null value');
      assertFailed(...message);
    }
    if (!Array.isArray(options)) {
      logger.error('ASSERT.isOneOf called with no options');
      assertFailed(...message);
    }
    if (options.indexOf(value) < 0) {
      assertFailed(...message);
    }
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
   * @param {Array} range array of 2 values with min and max range ([min,max]);
   * @param {...{}} message to log on failure
   */
  inRange: function (value, range, ...message) {
    if (UTIL.isNullish(value)) {
      assertFailed(...message);
    }
    if (!Array.isArray(range) || range.length != 2) {
      assertFailed("inRange parameter 'range' must be an array with 2 values [min,max]", ...message);
    }
    if (value < range[0] || value > range[1]) {
      assertFailed(...message);
    }
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
    if (UTIL.isEmpty(value)) {
      assertFailed(...message);
    }
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
    assertFailed(...message);
  }
};

export { ASSERT };
