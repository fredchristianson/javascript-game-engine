import { PropertySource } from "./property-source.js";

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

  async load() {
    console.info(`loading environment file ${this._assetUrl}`);
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
    } catch (_ex) {
      console.info(`failed to load environment file ${this._assetUrl}`);
    }
  }
}

export { JsonResourceProperties };
