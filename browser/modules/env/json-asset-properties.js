import { PropertySource } from "./property-source.js";

class JsonAssetProperties extends PropertySource {
  constructor(assetPath) {
    super();
    this._assetPath = assetPath;
  }

  async load() {
    const properties = await fetch(this._assetPath)
      .then((res) => res.json());
    for (const [name, value] of Object.entries(properties)) {
      this._values.set(name, value);
    }
  }
}

export { JsonAssetProperties };
