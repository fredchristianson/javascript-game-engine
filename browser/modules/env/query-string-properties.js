import { STRING, UTIL } from "../helpers.js";
import { PropertySource } from "./property-source.js";

/**
 * Gets properties from the document location
 * For example:
 *
 * :    index.html?mode=debug&logging.levels.default=DEBUG
 *
 * sets the properties "mode=debug" and "logging:{levels:{default}}=DEBUG"
 * @class
 * @extends PropertySource
 */
class QueryStringProperties extends PropertySource {
  constructor() {
    super();
    const query = location.search.substring(1);
    const pairs = query.split("&");
    for (const pair of pairs) {
      const [name, value] = pair.split("=");
      if (!STRING.isEmpty(name) && !STRING.isEmpty.value) {
        if (name.includes(".")) {
          this._setObjectValue(name, value);
        }
        this.set(name, value);
      }
    }
  }

  /**
   * Description placeholder
   * @private
   *
   * @param {String} name - parameter name
   * @param {String} value - parameter value
   */
  _setObjectValue(name, value) {
    const levels = name.split(".");
    const topName = levels.shift();
    let top = this.get(topName);
    if (top == null) {
      top = {};
      this.set(topName, top);
    }
    let current = top;
    while (levels.length > 1) {
      const nextName = levels.shift();
      if (UTIL.isNullish(current[nextName])) {
        current[nextName] = {};
      }
      current = current[nextName];
    }
    current[levels.shift()] = value;
  }
}

export { QueryStringProperties };
