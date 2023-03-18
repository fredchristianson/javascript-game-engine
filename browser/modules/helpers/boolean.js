import { STRING } from './string.js';

/** @namespace BOOLEAN */
const BOOLEAN = {

  /**
 * Return true if the value true for different types of parameters
 * 'number' is true if non-0
 * 'string' is true if equal to 'true' or 't'
 *
 * @param {Boolean|Number|String} value - the object to test
 * @return {Boolean} true if value is true,non-0, or 'true'/'t'
 */
  isTrue: function (value) {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value == 'number') {
      return value != 0;
    }
    if (typeof value == 'string') {
      return STRING.isEqualNoCase(value, 'true') || STRING.isEqualNoCase(value, 't');
    }
    return false;
  },

  /**
* Return true if the value is not true for different types of parameters
* 'number' is false if 0
* 'string' is false if not equal to 'true' or 't'
*
* @param {Boolean|Number|String} value - the object to test
* @return {Boolean} true if value is not true
*/
  isFalse: function (value) {
    return !BOOLEAN.isTrue(value);
  }
};

export { BOOLEAN };
