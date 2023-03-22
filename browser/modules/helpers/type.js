

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
   * @returns {Boolean} true if type matches
   */
  isType: function (value, type) {
    if (value === null ||
      typeof value == 'undefined' ||
      type === null ||
      typeof type == 'undefined') {
      return false;
    }
    if (Array.isArray(type)) {
      const match = type.find((t) => {
        return TYPE.isType(value, t);
      });
      return match;
    }
    if (typeof value == 'object' && typeof type == 'function') {
      return value instanceof type;
    }
    if (type == 'Module') {
      return isModule(value);
    }
    return typeof value === type;
  },

  /**
   * Return true if the value is an imported Module
   *
   * @param {*} object to test
   * @returns {Boolean} true if the object is a javascript Module
   */
  isModule: function (object) {
    if (object == null || typeof object !== 'object') {
      return false;
    }
    /*
     * this isn't a great solution, but the only way to test if an object
     * is a Module
     */
    return Object.prototype.toString.call(object) === '[object Module]';
  }
};

export { TYPE };