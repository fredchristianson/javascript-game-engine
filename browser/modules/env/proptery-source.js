/**
 * a PropertySource is anything that can provide properties
 *  + url query parameters ?name=value&name2=value2
 *  + files (env.json)
 *  + set(name,value) from code
 * 
 */

import { UTIL, STRING } from '../helpers.js';
import { ArgumentException } from '../exception.js';

/**
 * PropertySource is the base class for anything providing ENV properties
 *
 */
class PropertySource {
  /** @constructor */
  constructor() {

    /**
     * @property { Map } _values - the name / value map for this source
     * @private
     */
    this._values = new Map();
  }

  /**
   * Gets a property value by name.  return null if not found
   * @date 3/16/2023 - 7:30:12 AM
   *
   * @param {string} name - name of the property
   * @returns {*} - a primitive type (usually)
   */
  get(name) {
    if (STRING.isEmpty(name)) {
      throw new ArgumentException('PropertySource.get() requires a name');
    }
    return this._values.get(name) ?? null;
  }

  /**
   * Description placeholder
   *
   * @param {String} name - name of property to set
   * @param {*} value - value for the name.  can be any type but
   *            prefer base types (string, number, bool)
   */
  set(name, value) {
    if (!STRING.isString(name)) {
      throw new ArgumentException('PropertySource.set() requires a name');
    }

    if (UTIL.isNullish(value)) {
      this._values.delete(name);
    } else {
      this._values.set(name, value);
    }

  }


  /**
   * remove all values
   * @private
   */
  _clear() {
    this._values.clear();
  }


}

export { PropertySource };
