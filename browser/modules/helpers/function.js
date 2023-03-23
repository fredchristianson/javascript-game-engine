
const FUNCTION = {

  /**
   * Return true if the value is a function
   *
   * @param {*} value - the object to test
   * @returns {Boolean} true if value is a function
   */
  isFunction: function (value) {
    return (typeof value === 'function');
  },

  /**
   * Return true if the object has a function with the name
   *
   * @param {Object} object - the object to test
   * @param {string} name - the method name to look for
   * @returns {Boolean} true if object has the method
   */
  hasMethod: function (object, name) {
    return (typeof object == 'object') && (typeof object[name] == 'function');
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
   * @returns {Map} map of {names ==> function}.  Empty if the parameter is not an object.
   */
  getMethods: function (object) {
    const methods = new Map();
    let proto = object;

    while (proto != null && proto.constructor != Object) {
      for (const name of Object.getOwnPropertyNames(proto)) {
        const value = proto[name];
        if (FUNCTION.isFunction(value) && methods[name] == null) {
          methods.set(name, value);
        }
      }
      proto = Object.getPrototypeOf(proto);
    }
    return methods;
  }
};

export { FUNCTION }; 