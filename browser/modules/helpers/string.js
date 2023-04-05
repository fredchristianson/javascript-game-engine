
/** @namespace STRING */
const STRING = {

  /**
   * Return true if the value is null or "undefined"
   *
   * @param {String} value - the object to test
   * @returns {Boolean} true if null
   */
  isNull: function (value) {
    return value === null || typeof value == 'undefined';
  },


  /**
   * Return true if the value is not a string or is empty.
   * If it has whitespace, it is not empty.
   *
   * @param {String} value - the object to test
   * @returns {Boolean} true if empty or not a string
   */
  isEmpty: function (value) {
    return (
      STRING.isNull(value) || typeof value != 'string' || value.length == 0
    );
  },

  /**
   * Return true if the value is not a string or is empty or only has whitespace.
   * If it has whitespace, it is not empty.
   *
   * @param {String} value - the object to test
   * @returns {Boolean} true if empty or not a string or only has whitespace
   */
  isBlank: function (value) {
    return (value === null ||
      typeof value != 'string' ||
      /\S/.test(value) === false);
  },


  /**
   * Return true if the value is a string and not empty.
   *
   * @param {String} value - the object to test
   * @returns {Boolean} true if is a string and not empty
   */
  isNotEmpty: function (value) {
    return !STRING.isBlank(value);
  },

  /**
   * Return true if the value is a string
   *
   * @param {String} value - the object to test
   * @returns {Boolean} true if is a string 
   */
  isString: function (value) {
    return typeof value == 'string';
  },

  /**
   * Return true if 2 strings are equal
   *
   * @param {String} first - first string
   * @param {String} second - second string
   * @returns {Boolean} true if params are both strings and equal
   */
  isEqual: function (first, second) {
    if (!STRING.isString(first) || !STRING.isString(second)) {
      return false;
    }
    return first.localeCompare(second, undefined) == 0;
  },

  /**
   * Return true if 2 strings are equal ignoring case
   *
   * @param {String} first - first string
   * @param {String} second - second string
   * @returns {Boolean} true if params are both strings and equal
   */
  isEqualNoCase: function (first, second) {
    if (!STRING.isString(first) || !STRING.isString(second)) {
      return false;
    }
    return first.localeCompare(second, undefined, { sensitivity: 'accent' }) == 0;
  },

  /**
   * Return true if the first string starts with the second
   *
   * @param {String} first - first string
   * @param {String} second - second string
   * @returns {Boolean} true first starts with second
   */
  startsWithNoCase: function (value, start) {
    if (
      !STRING.isString(value) ||
      !STRING.isString(start) ||
      value.length < start.length
    ) {
      return false;
    }
    return STRING.isEqualNoCase(value.substring(0, start.length), start);
  },

  /**
   * Creates a string of an html element including the tag, id,  and classes.
   *
   * @param {HTMLElement} htmlElement - the HTMLElement to print
   * @returns {String} displayable string of the element.  Empty string if not an HTMLElement
   */
  htmlElementToString: function (item) {
    const parts = [];
    const tag = item.tagName;
    parts.push('[');
    parts.push(tag);
    if (item.id) {
      parts.push('#');
      parts.push(item.id);
    }

    const classes = item.classList;
    classes.forEach((c) => {
      parts.push('.');
      parts.push(c);
    });
    parts.push(']');
    return parts.join('');
  },

  /**
   * Creates a JSON string of an Object.  Uses JSON.stringify with a function to
   * remove cycles.
   *
   * @param {Object} object - the object to stringify
   * @returns {String} displayable string of the object
   */
  toJsonString: function (object) {
    const seen = [];
    const deCycle = function (key, val) {
      if (val != null && typeof val === 'object') {
        if (seen.includes(val)) {
          return '...';
        }
        seen.push(val);
      }
      return val;
    };

    const result = JSON.stringify(object, deCycle, 2);
    return result;
  },


  /**
   * Creates a displayable string of different types of parameters
   *
   * @param {*}  value - the object to stringify
   * @returns {String} displayable string of the object. '[null]' if param is null
   */
  toString: function (value) {
    if (value === null || typeof value == 'undefined') {
      return '[null]';
    }
    if (STRING.isString(value)) {
      return value;
    }
    if (typeof value.getHTMLElement == 'function') {
      value = value.getHTMLElement();
    }
    if (value instanceof HTMLElement) {
      return STRING.htmlElementToString(value);
    }
    if (typeof value == 'function') {
      try {
        return STRING.toString(value());
      } catch (ex) {
        return `function failed: ${ex.message}`;
      }
    }
    if (typeof value.toString == 'function') {
      const text = value.toString();
      if (text != '[object Object]') {
        /*
         * if the object has overridden the base .toString() return it.
         * otherwise convert to JSON
         */
        return text;
      }
    }
    return STRING.toJsonString(value);

  }

};


export { STRING };