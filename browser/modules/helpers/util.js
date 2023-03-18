/* Do not import other modules in these helpers.
 * Any module that uses helpers will casue
 * an import cycle if these module import other modules.
 */

/** @namespace UTIL */
const UTIL = {
  /**
  * Return true if the value is null or type is "undefined".  Could add null
  * symbol or other things in the future.
  *
  * @param {*}  value - the object test
  * @return {Boolean} true if the value is null or "undefined"
  */
  isNullish: function (value) {

  },

  /**
  * Return an array.  
  * If the item is an array, return it.  
  * If the item is null, return []
  * Otherwise return [item]
  *
  * @param {*}  value - the object turn into an array
  * @return {Array} an Array
  */
  toArray: function (item) {

  },

  /**
  * Return true if the item is empty.
  *   1) null or type "undefined" always true
  *   2) strings and arrays are empty if length is 0
  *   3) Objects are empty if no properties
  *   4) Maps are empty if no entries
  *
  * @param {*}  value - the object turn into an array
  * @return {Array} an Array
  */
  isEmpty: function (item) {

  },

  /**
  * Perform a cartesian join of 2 iterables like Array (or extend to arbitrary number with ...lists)
  *
  * join([a,b,c],[1,2,3])
  * 
  * would return 
  * 
  * [ [a,1], [b,2], [c,3]]
  * 
  * @param {Iterable}  listA the first list
  * @param {Iterable} listB the second list
  * @return {Array} an Array of arrays
  */
  join: function (listA, listB) {

  }
}
export { UTIL }; 
