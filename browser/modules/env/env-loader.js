import { ENV } from './env.js';
import { JsonResourceProperties } from './json-resource-properties.js';
import { ResourceManager } from '../net.js';
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
class EnvironmentLoader {
  constructor() {
    this._loaded = false;
    this._loadPromises = [];
  }

  /**
   * Load env.json for gameName
   *
   * @async
   * @param {String} gameName - the game to load.  
   */
  async loadGameEnvironment(gameName) {
    this._loaded = false;
    const gameProperties = new JsonResourceProperties(ResourceManager.getGameResourceUrl(gameName, 'env.json'));
    this._loadPromises.push(gameProperties.load());
    await Promise.all(this._loadPromises);
    ENV._setGameProperties(gameProperties);
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
    const loadedProperties = [];
    for (const url of urls) {
      const props = new JsonResourceProperties(url);
      loadedProperties.push(props);
      this._loadPromises.push(props.load());
    }
    await Promise.all(this._loadPromises);
    for (const props of loadedProperties) {
      ENV._addLoadedProperties(props);
    }
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

}

const loader = new EnvironmentLoader();
export async function loadUrls(...urls) {
  return await loader.loadUrls(...urls);
}

export async function loadGameEnvironment(gameName) {
  return await loader.loadGameEnvironment(gameName);
}

export { EnvironmentLoader };

