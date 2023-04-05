/** @namespace NUMBER */
const NUMBER = {
  /**
   * Return true if the value is a 'number'
   *
   * @param {String} value - the object to test
   * @returns {Boolean} true if null
   */
  isNumber: function (value) {
    return typeof value === 'number';
  }
};

export { NUMBER };