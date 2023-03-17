// ENV is a singleton that provides environment properties wherever it they are needed.
//
// Properties can come from multiple sources.
// if multiple sources have the same property, they are prioritized in this order
//  1) Set with Environment.set()
//  1) Url parameters: This url http://localhost:4263?env=dev&performance=hi
//                      sets properties for "env", and "performance"
//  2) /games/game/CURRENT-GAME/env.json
//  3) /env-local.json:  load env.json if it exists.
//                  this file should not be in git.  create if you need.
//  4) /env.json:  load the env.json file if it exists
//                  this file is the same for everyone.
//
// in the future we will add the ability to listen to change events.
// for example, logging levels may change when a new game is loaded
import { UTIL, BOOLEAN, STRING, OBJECT } from './helpers.js';
import { ArgumentException } from './exception.js';



/**
 * Description placeholder
 * @date 3/16/2023 - 6:37:18 AM
 *
 * @class PropertySource
 * @typedef {PropertySource}
 */
class PropertySource {
  constructor() {
    this._values = new Map();
  }
  get(name) {
    if (STRING.isEmpty(name)) {
      throw new ArgumentException("PropertySource.get() requires a name");
    }
    return this._values.get(name);
  }
  set(name, value) {
    if (!STRING.isString(name)) {
      throw new ArgumentException("PropertySource.set() requires a name");
    }

    if (UTIL.isNullish(value)) {
      this._values.delete(name);
    } else {
      this._values.set(name, value);
    }

  }

  _clear() {
    this._values.clear();
  }
  _setNestedValue(name, value) {
    const levels = name.split('.').reverse();

  }
}

class QueryStringProperties extends PropertySource {
  constructor() {
    super();
    const query = location.search.substring(1);
    const pairs = query.split('&');
    for (let pair of pairs) {
      let [name, value] = pair.split('=');
      if (!STRING.isEmpty(name) && !STRING.isEmpty.value) {
        if (name.includes('.')) {
          this._setObjectValue(name, value);
        }
        this.set(name, value);
      }
    }
  }

  _setObjectValue(name, value) {
    const levels = name.split('.');
    const topName = levels.shift();
    let top = this.get(topName);
    if (top == null) {
      top = {};
      this.set(topName, top);
    }
    let current = top;
    while (levels.length > 1) {
      let nextName = levels.shift();
      if (UTIL.isNullish(current[nextName])) {
        current[nextName] = {};
      }
      current = current[nextName];
    }
    current[levels.shift()] = value;
  }
}

class JsonAssetProperties extends PropertySource {
  constructor(url) {
    super();
    this._assetUrl = url;
    this._loaded = false;
  }

  async load() {
    try {
      const response = await fetch(this._assetUrl);
      if (response != null) {
        this._clear();
        const json = await response.json();
        for (let entry of Object.entries(json)) {
          let [name, value] = entry;
          this.set(name, value);
        }
      }
    } catch (ex) {
      console.info(`failed to load environment file ${this._assetUrl}`);
    }
  }


}

class Environment {
  constructor() {
    this._loaded = false;
    this._setProperties = new PropertySource();
    this._queryStringProperties = new QueryStringProperties();
    this._gameProperties = null;
    this._loadedProperties = [];
    //this._localEnvProperties = new JsonAssetProperties("/env-local.json");
    //this._envProperties = new JsonAssetProperties("/env.json");
    this._propertySources = [
      this._setProperties,
      this._queryStringProperties,
      this._gameProperties,
      this._localEnvProperties,
      this._envProperties
    ];
    this._loaded = true;
    this._loadPromises = [];
  }

  async loadUrls(...urls) {
    this._loaded = false;
    for (let url of urls) {
      const props = new JsonAssetProperties(url);
      this._loadPromises.push(props.load());
      this._loadedProperties.push(props);
      this._propertySources.push(props);
    }
    await Promise.all(this._loadPromises);
    this._loaded = true;
  }
  async isLoaded() {

    if (!this._loaded) {
      await Promise.all(this._loadPromises);
    }
    return this._loaded;
  }

  isDebug() {
    let debug = this.get('isDebug');
    if (!UTIL.isNullish(debug)) {
      return BOOLEAN.isTrue(debug);
    }
    let mode = this.get('mode') ?? this.get('env');
    return STRING.isEqualNoCase(mode, 'debug');
  }
  get(name, defaultValue = null) {
    let resultValue = null;
    for (let source of this._propertySources) {
      let value = source?.get(name);
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
  }
}

export const ENV = new Environment();

