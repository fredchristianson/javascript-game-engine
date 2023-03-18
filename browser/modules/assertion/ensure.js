
import { TYPE, BOOLEAN, UTIL } from '../helpers.js';

/**
 * @function
 * Log a message  if a test fails
 * 
 * @todo use the Logging module instead of console when the Logging module is implemented
 * @private
 * @param {...{}} message
 */
function ensureFailed(...message) {
    const exceptionMessage = message.join(' ');
    // create an exception to get a stack trace
    const error = new Error(exceptionMessage);
    console.error(...message, error);
}

/** @namespace ENSURE */
const ENSURE = {
    /**
     * Test that the value is not null or 'undefined'.
     *
     * @param {*} value - the value to test
     * @param {*} goodValue - value to return if the test fails
     * @returns {*} either value or goodValue depending on success
     */
    notNull: function (value, goodValue, ...message) {
        if (value === null || typeof value === 'undefined') {
            ensureFailed(...message);
            return goodValue;
        }
        return value;
    },
    /**
     * Test that the value is  null or 'undefined'.
     *
     * @param {*} value - the value to test
     * @param {*} goodValue - value to return if the test fails
     * @returns {*} either value or goodValue depending on success
     */
    isNull: function (value, goodValue, ...message) {
        if (value !== null && typeof value !== 'undefined') {
            ensureFailed(...message);
            return goodValue;
        }
        return value;
    },
    /**
    * Throw an exception if the value is not true.
    * BOOLEAN.isTrue is used to determine if it's true.
    *
    * @param {*} value - the value to test
     * @param {*} goodValue - value to return if the test fails
     * @returns {*} either value or goodValue depending on success
    */
    isTrue: function (value, goodValue, ...message) {
        if (!BOOLEAN.isTrue(value)) {
            ensureFailed(...message);
            return goodValue;
        }
        return true;
    },

    /**
    * Throw an exception if the value is true.
    * BOOLEAN.isTrue is used to determine if it's true.
    *
    * @param {*} value - the value to test
     * @param {*} goodValue - value to return if the test fails
     * @returns {*} either value or goodValue depending on success
    */
    isFalse: function (value, goodValue, ...message) {
        if (!BOOLEAN.isFalse(value)) {
            ensureFailed(...message);
            return goodValue;
        }
        return false;
    },
    /**
     * determine if the value is the correct type.
     * type can be a string ('number','function') or a class (e.g. Object, Array, Game).
  
    * if type is an array, value must match one of the types.
    *
    * @param {*} value - the value to test
    * @param {string | class | Array} type or types the value must match
     * @param {*} goodValue - value to return if the test fails
     * @returns {*} either value or goodValue depending on success
    */
    isType: function (value, type, goodValue, ...message) {
        let success = false;
        if (Array.isArray(type)) {
            success = type.find((t) => {
                return TYPE.isType(value, t);
            });
        } else {
            success = TYPE.isType(value, type);
        }
        if (!success) {
            ensureFailed(...message);
            return goodValue;
        }
        return value;
    },
    /**
    * determine if the value is the correct type but allow null.
    * 
    * @param {*} value - the value to test
    * @param {string | class | Array} type or types the value must match
      * @param {*} goodValue - value to return if the test fails
     * @returns {*} either value or goodValue depending on success
   */
    isTypeOrNull: function (value, type, goodValue, ...message) {
        if (value !== null && typeof value !== 'undefined') {
            return ENSURE.isType(value, type, goodValue, ...message);
        }
        return null;
    },
    /**
    * determine if the value is an Array.
    * this is the same as isType(value,Array,message)
    * 
    * @param {*} value - the value to test
    * @param {string | class | Array} type or types the value must match
      * @param {*} goodValue - value to return if the test fails
     * @returns {*} either value or goodValue depending on success
   */
    isArray: function (value, goodValue, ...message) {
        return ENSURE.isType(value, Array, ...message);
    },
    /**
     * Determine if the value is in an array.
     * For example if debug level must be DEBUG, INFO, or WARN
    * 
    * ```
    * ASSERT.isOneOf(level,[DEBUG,INFO,WARN], "invalid debug level",level);
    * ```
     * 
    * @param {*} value - the value to test
    * @param {Array<*>} array - an array of allowed values.
    * @param {string | class | Array} type or types the value must match
      * @param {*} goodValue - value to return if the test fails
     * @returns {*} either value or goodValue depending on success
    */
    isOneOf: function (value, options, goodValue, ...message) {
        if (UTIL.isNullish(value)) {
            logger.error('ASSERT.isOneOf called with null value');
            ensureFailed(...message);
            return goodValue;
        }
        if (!Array.isArray(options)) {
            logger.error('ASSERT.isOneOf called with no options');
            ensureFailed(...message);
            return goodValue;
        }
        if (options.indexOf(value) < 0) {
            ensureFailed(...message);
            return goodValue;
        }
        return value;
    },
    /**
   * Determine if the value empty.
   * Strings, arrays, and objects have different tests for emptyness
   * and this works for all of them.  UTIL.isEmpty is used to test.
   *
  * @param {*} value - the value to test
  * @param {string | class | Array} type or types the value must match
     * @param {*} goodValue - value to return if the test fails
     * @returns {*} either value or goodValue depending on success
   */
    notEmpty: function (value, goodValue, ...message) {
        if (UTIL.isEmpty(value)) {
            ensureFailed(...message);
            return goodValue;
        }
        return value;
    },
    /**
    * Determine if the value is in a range. This is mainly intended for
    * testing numbers, but will work for any values that can be tested
    * with >= and <=.
    * 
    * The range is inclusive.  So all of these are ok
    * 
    * ```
    * ENSURE.inRange(0,[0,100],50, "value is not in range 0-100");
    * ENSURE.inRange(100,[0,100],50, "value is not in range 0-100");
    * ENSURE.inRange(50,[0,100],50, "value is not in range 0-100");
    * ```
    * 
    * These will return the default value 50
    * 
    * ```
    * ENSURE.inRange(0,[1,100], 50, "value is not in range 1-100");
    * ENSURE.inRange(101,[1,100], 50, "value is not in range 1-100");
    * ```
    * 
    * @param {*} value - the value to test
    * @param {Array} array of 2 values with min and max range ([min,max]);
    * @param {*} goodValue - value to return if the test fails
    * @param {...{}} message to log on failure
    */
    inRange: function (value, range, goodValue, ...message) {
        if (UTIL.isNullish(value)) {
            ensureFailed(...message);
            return goodValue;
        }
        if (!Array.isArray(range) || range.length != 2) {
            ensureFailed("inRange parameter 'range' must be an array with 2 values [min,max]", ...message);
            return goodValue;
        }
        if (value < range[0] || value > range[1]) {
            ensureFailed(...message);
            return goodValue;
        }
        return value;
    }
};

export { ENSURE };
