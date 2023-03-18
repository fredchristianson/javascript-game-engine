

/** @namespace TYPE */
const TYPE = {
  /**
 * Return true if the value is of the type specified.
 * 
 * The type can be 
 *    1. a string for primitive types ('string', 'boolean','number')
 *    2. a class name (e.g. 'Object', 'Game')
 *    3. an array of 1 & 2.  If an array is provided and match returns true
 *
 * @param {*} value - the object to test
 * @param {String | type | Array} type to check
 * @return {Boolean} true if type matches
 */
  isType: function (value, type) {

  },

  /**
 * Return true if the value is an imported Module
 *
 * @param {*} object to test
 * @return {Boolean} true if the object is a javascript Module
 */
  isModule: function (object) {

  }
};

export { TYPE };