import { PropertySource } from './proptery-source.js';

/**
 * Load properties from a JSON URL.  The URL is usually an env file (e.g. env.json)
 *
 * @class JsonResourceProperties
 * @extends {PropertySource}
 */
class JsonResourceProperties extends PropertySource {
  constructor(url) {
    super();
    this._assetUrl = url;
    this._loaded = false;
  }

  get Url() {
    return this._assetUrl;
  }
  async load() {
    try {
      const response = await fetch(this._assetUrl);
      if (response != null) {
        this._clear();
        const json = await response.json();
        for (const entry of Object.entries(json)) {
          const [name, value] = entry;
          this.set(name, value);
        }
      }
    } catch (ex) {
      console.info(`failed to load environment file ${this._assetUrl}`);
    }
  }


}


export { JsonResourceProperties };

