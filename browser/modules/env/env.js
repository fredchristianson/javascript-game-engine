import { BOOLEAN, OBJECT, STRING, UTIL } from "../helpers.js";
import { PropertySource } from "./property-source.js";
import { QueryStringProperties } from "./query-string-properties.js";
import { JsonResourceProperties } from "./json-resource-properties.js";
import { JsonAssetProperties } from "./json-asset-properties.js";
import { ResourceManager } from "../net.js";
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
    this._loaded = false;
    this._setProperties = new PropertySource();
    this._queryStringProperties = new QueryStringProperties();
    this._gameProperties = null;
    this._loadedProperties = [];

    this._envProperties = new JsonAssetProperties("/env.json");
    // this._localEnvProperties = new JsonAssetProperties("/env-local.json");
    // this._envProperties = new JsonAssetProperties("/env.json");

    this._propertySources = [
      this._setProperties,
      this._queryStringProperties,
      this._gameProperties,
      this._envProperties,
    ];
    this._loaded = true;
    this._loadPromises = [];
  }

  /**
   * Load env.json for gameName
   *
   * @async
   * @param {String} gameName - the game to load. */
  async loadGameEnvironment(gameName) {
    this._loaded = false;
    this._gameProperties = new JsonResourceProperties(
      ResourceManager.getGameResourceUrl(gameName, "env.json"),
    );
    this._loadPromises.push(props.load());
    await Promise.all(this._loadPromises);
    this._loaded = true;
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
      this._propertySources.push(props);
    }
    await Promise.all(this._loadPromises);
    this._loaded = true;
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

  async setup() {
    await this._envProperties.load();
  }

  /**
   * Return true if environment isDebug is true or environment property mode is 'debug'
   *
   * @returns {*}
   */
  isDebug() {
    const debug = this.get("isDebug");
    if (!UTIL.isNullish(debug)) {
      return BOOLEAN.isTrue(debug);
    }
    const mode = this.get("mode") ?? this.get("env");
    return STRING.isEqualNoCase(mode, "debug");
  }

  get(name, defaultValue = null) {
    let resultValue = null;
    // for (const source of this._propertySources) {
    this._propertySources.forEach((source, i) => {
      console.log(this._propertySources);
      console.log({ source, i });
      if (source) {
        const value = source?.get(name);
        console.log({ value });
        if (OBJECT.isObject(resultValue)) {
          OBJECT.merge(resultValue, value);
        } else if (OBJECT.isObject(value)) {
          resultValue = value;
        } else {
          resultValue = value;
          return;
        }
      }
    });
    // }
    return resultValue ?? defaultValue;
  }

  set(name, value) {
    this._setProperties.set(name, value);
  }
}

export { Environment };
