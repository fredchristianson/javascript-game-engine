/*
 * Do not import other modules in these helpers.
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
   * @returns {Boolean} true if the value is null or "undefined"
   */
  isNullish: function (value) {
    return value === null || typeof value === 'undefined';
  },

  /**
   * Return an array.  
   * If the item is an array, return it.  
   * If the item is null, return []
   * Otherwise return [item]
   *
   * @param {*}  item - the object turn into an array
   * @returns {Array} an Array
   */
  toArray: function (item) {
    if (UTIL.isNullish(item)) {
      return [];
    }
    if (Array.isArray(item)) {
      return item; // alread an array;
    }
    return [item];
  },

  /**
   * Return true if the item is empty.
   *   1) null or type "undefined" always true
   *   2) strings and arrays are empty if length is 0
   *   3) Objects are empty if no properties
   *   4) Maps are empty if no entries
   *
   * @param {*} item - the object turn into an array
   * @returns {Array} an Array
   */
  isEmpty: function (item) {
    if (UTIL.isNullish(item)) {
      return true;
    }
    if (typeof item == 'string') {
      return item.length == 0;
    }
    if (Array.isArray(item)) {
      return item.length == 0;
    }
    if (item instanceof Map) {
      return item.size == 0;
    }
    if (typeof item == 'object') {
      return Object.keys(item).length == 0;
    }
    /*
     * todo: when ASSERT is implemented
     * ASSERT.fail("Unknown item type for isEmpty");
     */
    return false;
  },

  /**
   * Perform a cartesian join of 2 iterables like Array (or extend to arbitrary number with ...lists)
   *
   * join([a,b,c],[1,2,3])
   * 
   * would return 
   * 
   * [ [a,1],[a,2],a[3], [b,1],[b,2],[b,3], [c,1], [c,2][c,3]]
   * 
   * @param {Iterable}  listA the first list
   * @param {Iterable} listB the second list
   * @returns {Array} an Array of arrays
   */
  join: function (listA, listB) {
    if (UTIL.isNullish(listA[Symbol.iterator]) ||
      UTIL.isNullish(listB[Symbol.iterator])) {
      // cannot use logging so write to the console.
      console.warn('join called with non-iterable');
      return [];
    };
    const result = [...listA].reduce((pairs, valueA) => {
      const aPairs = [...listB].map((valueB) => {
        return [valueA, valueB]
      });
      pairs.push(...aPairs);
      return pairs;
    }, []);
    return result;
  },
  includes: function (object, member) {
    if (UTIL.isNullish(object)) {
      return false;
    }
    if (Array.isArray(object)) {
      return object.includes(member);
    }
    if (typeof object == 'string') {
      return object.includes(member);
    }
    if (object instanceof Map) {
      return object.has(member);
    }
    return false;
  }
}
export { UTIL }; 
