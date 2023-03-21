import { UTIL, BOOLEAN, STRING, OBJECT } from '../helpers.js';
import { PropertySource } from './proptery-source.js';
import { QueryStringProperties } from './query-string-properties.js';
import { JsonResourceProperties } from './json-resource-properties.js';
import { ResourceManager } from '../net.js';
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
    this._loaded = false;
    this._setProperties = new PropertySource();
    this._queryStringProperties = new QueryStringProperties();
    this._gameProperties = null;
    this._loadedProperties = [];

    this._loaded = true;
    this._loadPromises = [];
  }

  get ChangeObservable() { return this._changeObservable; }
  /**
   * Load env.json for gameName
   *
   * @async
   * @param {String} gameName - the game to load.  
   */
  async loadGameEnvironment(gameName) {
    this._loaded = false;
    this._gameProperties = new JsonResourceProperties(ResourceManager.getGameResourceUrl(gameName, 'env.json'));
    this._loadPromises.push(this._gameProperties.load());
    await Promise.all(this._loadPromises);
    this._loaded = true;
    this._changeObservable.changed({ gameUpdated: true });
  }

  /**
   * loads properties from one or more urls.  if multiple
   * urls have the same property, the first one has priority.
   * 
   * If a load fails, the urls is ignored.  It's not an error
   * to try to load a url that doesn't exist.
   *
   * @async
   * @param {...String} urls - urls to load
   */
  async loadUrls(...urls) {
    this._loaded = false;
    for (const url of urls) {
      const props = new JsonResourceProperties(url);
      this._loadPromises.push(props.load());
      this._loadedProperties.push(props);
    }
    await Promise.all(this._loadPromises);
    this._loaded = true;
    this._changeObservable.changed({ UrlsAdded: true, urls: urls });

  }

  /**
   * wait until any loading resource are complete.  return true
   * if there were no issues.  
   *
   * @async
   * @returns {Boolean} - always true
   */
  async waitForLoad() {

    if (!this._loaded) {
      await Promise.all(this._loadPromises);
    }
    return this._loaded;
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

export { Environment };

