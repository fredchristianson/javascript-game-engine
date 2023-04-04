import { UTIL, BOOLEAN, STRING, OBJECT } from '../helpers.js';
import { PropertySource } from './proptery-source.js';
import { QueryStringProperties } from './query-string-properties.js';
import { createObservable } from '../observe.js';
/**
 * Environment name/value property provider.  Multiple sources 
 * of property values are searched in priority order.
 * 
 *  1) Set with Environment.set()
 * 
 *  1) Url parameters: This url http://localhost:4263?env=dev&performance=hi
 *                      sets properties for "env", and "performance"
 * 
 *  2) /games/game/CURRENT-GAME/env.json
 * 
 *  3) JSON files loaded with loadUrls(url1,url2,...).  Order of urls is the priority.
 * @class
 */
class Environment {
  constructor() {
    this._changeObservable = createObservable(this);
    this._setProperties = new PropertySource();
    this._queryStringProperties = new QueryStringProperties();
    this._gameProperties = null;
    this._loadedProperties = [];

  }

  get ChangeObservable() {
    return this._changeObservable;
  }
  /**
   * Set env.json for gameName
   *
   * @async
   * @param {PropertySource} gameProps are loaded for a specific game
   */
  _setGameProperties(gameProps) {
    this._gameProperties = gameProps;
    this._changeObservable.changed({ gameUpdated: true });
  }

  /**
   * adds a new property source.  order matters and the first sources added
   * have higher priority.
   *
   * @async
   * @param {PropertySource} props properties to add
   */
  async _addLoadedProperties(props) {
    this._loadedProperties.push(props);
    this._changeObservable.changed({ UrlsAdded: true, url: props.Url });

  }


  /**
   * Return true if environment isDebug is true or environment property mode is 'debug'
   *
   * @returns {*}
   */
  isDebug() {
    const debug = this.get('isDebug');
    if (!UTIL.isNullish(debug)) {
      return BOOLEAN.isTrue(debug);
    }
    const mode = this.get('mode') ?? this.get('env');
    return STRING.isEqualNoCase(mode, 'debug');
  }
  get(name, defaultValue = null) {
    let resultValue = null;
    const sources = [
      this._setProperties,
      this._queryStringProperties,
      this._gameProperties,
      ...this._loadedProperties
    ];
    for (const source of sources) {
      const value = source?.get(name);
      if (value != null) {
        if (OBJECT.isObject(resultValue)) {
          OBJECT.addNewProperties(resultValue, value);
        } else if (OBJECT.isObject(value)) {
          resultValue = value;
        } else {
          resultValue = value;
          break;
        }
      }
    }
    return resultValue ?? defaultValue;
  }

  set(name, value) {
    this._setProperties.set(name, value);
    this._changeObservable.changed({ name: name, value: value });

  }
}

export const ENV = new Environment();


