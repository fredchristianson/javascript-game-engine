/**
 * a PropertySource is anything that can provide properties
 *  -- url query parameters ?name=value&name2=value2
 *  -- files (env.json)
 *  -- set(name,value) from code
 * 
 */

import { UTIL, STRING } from './helpers.js';
import { ArgumentException } from './exception.js';

/**
 * PropertySource is the base class for anything providing ENV properties
 * @date 3/16/2023 - 7:29:31 AM
 *
 * @export
 * @class PropertySource
 * @typedef {PropertySource}
 */
class PropertySource {
  /**
   * Creates an instance of PropertySource.
   * @date 3/16/2023 - 7:30:04 AM
   *
   * @constructor
   */
  constructor() {
    this._values = new Map();
  }

  /**
   * Gets a property value by name.  return null if not found
   * @date 3/16/2023 - 7:30:12 AM
   *
   * @param {string} name - name of the property
   * @returns {*}
   */
  get(name) {
    if (STRING.isEmpty(name)) {
      throw new ArgumentException('PropertySource.get() requires a name');
    }
    return this._values.get(name) ?? null;
  }

  /**
   * Description placeholder
   * @date 3/16/2023 - 7:32:18 AM
   *
   * @param {string} name - name of property to set
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
   * @date 3/16/2023 - 7:33:23 AM
   */
  _clear() {
    this._values.clear();
  }


}

export { PropertySource };
