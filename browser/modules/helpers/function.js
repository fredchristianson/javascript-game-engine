
/** @namespace FUNCTION */
const FUNCTION = {

  /**
 * Return true if the value is a function
 *
 * @param {*} value - the object to test
 * @return {Boolean} true if value is a function
 */
  isFunction: function (value) {

  },

  /**
   * return all methods an object has, not including
   * methods in the base Object class.
   * This includes:
   *   1) functions added to the object after it was created
   *   2) functions in the class (if created by new)
   *   3) functions in base classes that have not been overriden 
   * 
   * @param {Object} object - the object to get functions of
   * @return {Map} map of {names ==> function}.  Empty if the parameter is not an object.
   */
  getMethods: function (object) {

  }
};

export { FUNCTION }; 