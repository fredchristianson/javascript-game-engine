/** @namespace OBJECT */
const OBJECT = {
  /**
   * Return true if the value is null or "undefined"
   *
   * @param {*} value - the object to test
   * @return {Boolean} true if null
   */
  isNull: function (value) {
    return value == undefined;
  },

  /**
   * Return true if the value is null or "undefined" or an object with no properties
   *
   * @param {Object} value - the object to test
   * @return {Boolean} true if value is null or not an Object or has no properties
   */
  isEmpty: function (value) {
    return value == null || typeof value != "object" ||
      Object.keys(value).length == 0;
  },

  /**
   * Return true if the value is
   *    1) not null null or "undefined"
   *    2) typeof == 'object'
   *    3) is not an Array or Map since caller shouldn't treat those like Object
   *
   * Only Array and Map are considered "not Objects" even thought the are 'object'.
   * Typed arrays like Int8Array return true;
   *
   * @param {Object} value - the object to test
   * @return {Boolean} true if value is an object
   */
  isObject: function (value) {
    // an array is an object, but when the caller wants an object,
    // a name/value property container is what they want, not an array
    return !this.isNull(value) && typeof value == "object" &&
      !Array.isArray(value) && !(value instanceof Map);
  },

  /**
   * Recursively copies all properties from the newProperties object
   * into the value object if they do not already exist.
   * If these 2 objects are the parameters
   *
   * OBJECT.addNewProperties(a,b)
   *
   * const a = {
   *  mode:"deubg",
   *  logging: {
   *    level: {
   *      default: "info",
   *      game: "debug",
   *      net:  "warn"
   *    }
   *  }
   * }
   *
   * const b = {
   *  mode:"prod",
   *  logging: {
   *    level: {
   *      default: "error",
   *      game: "never",
   *      ui:  "debug"
   *    }
   *  },
   *  quality: "high"
   * }
   *
   * the result value of a will be
   *
   * {
   *  mode:"deubg",
   *  logging: {
   *    level: {
   *      default: "info",
   *      game: "debug",
   *      ui:  "debug"
   *    }
   *  },
   *  quality: "high"
   * }
   *
   * The deep value "logging.level.ui" and the top-level "quality" are
   * added.  All other values in b were already in a so are not added.
   *
   * @param {Object} value - the object to add properties to
   * @param {Object} newProperties - object to copy properties from
   */
  merge: function (value, newProperties) {
    if (!this.isObject(value) || !this.isObject(newProperties)) {
      return;
    }
    for (const [name, newValue] of Object.entries(newProperties)) {
      const old = value[name];
      if (!old) {
        value[name] = newValue;
      } else if (this.isObject(newValue)) {
        this.merge(old, newValue);
      }
    }
  },
};

export { OBJECT };
