
/** @namespace STRING */
const STRING = {

  /**
   * Return true if the value is null or "undefined"
   *
   * @param {String} value - the object to test
   * @return {Boolean} true if null
   */
  isNull: function (value) {

  },


  /**
   * Return true if the value is not a string or is empty.
   * If it has whitespace, it is not empty.
   *
   * @param {String} value - the object to test
   * @return {Boolean} true if empty or not a string
   */
  isEmpty: function (value) {

  },

  /**
 * Return true if the value is not a string or is empty or only has whitespace.
 * If it has whitespace, it is not empty.
 *
 * @param {String} value - the object to test
 * @return {Boolean} true if empty or not a string or only has whitespace
 */
  isBlank: function (value) {

  },


  /**
   * Return true if the value is a string and not empty.
   *
   * @param {String} value - the object to test
   * @return {Boolean} true if is a string and not empty
   */
  isNotEmpty: function (value) {

  },

  /**
 * Return true if the value is a string
 *
 * @param {String} value - the object to test
 * @return {Boolean} true if is a string 
 */
  isString: function (value) {

  },

  /**
* Return true if 2 strings are equal
*
* @param {String} first - first string
* @param {String} second - second string
* @return {Boolean} true if params are both strings and equal
*/
  isEqual: function (first, second) {

  },

  /**
 * Return true if 2 strings are equal ignoring case
 *
 * @param {String} first - first string
 * @param {String} second - second string
 * @return {Boolean} true if params are both strings and equal
 */
  isEqualNoCase: function (first, second) {

  },

  /**
  * Return true if the first string starts with the second
  *
  * @param {String} first - first string
  * @param {String} second - second string
  * @return {Boolean} true first starts with second
  */
  startsWithNoCase: function (value, start) {

  },

  /**
  * Creates a string of an html element including the tag, id,  and classes.
  *
  * @param {HTMLElement} htmlElement - the HTMLElement to print
  * @return {String} displayable string of the element.  Empty string if not an HTMLElement
  */
  htmlElementToString: function (item) {

  },

  /**
  * Creates a JSON string of an Object.  Uses JSON.stringify with a function to
  * remove cycles.
  *
  * @param {Object} object - the object to stringify
  * @return {String} displayable string of the object
  */
  toJsonString: function (object) {

  },


  /**
  * Creates a displayable string of different types of parameters
  *
  * @param {*}  value - the object to stringify
  * @return {String} displayable string of the object. '[null]' if param is null
  */
  toString: function (value) {


  }

};



export { STRING };