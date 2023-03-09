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

class Environment {
  constructor() {
    // The "urlParams", "gameEnv", and "localEnv" properties are objects that will be used to store environment variables
    // loaded from their respective sources. The "globalEnv" property is an object that will be used to store environment
    // variables set using the "set()" function.
    this.urlParams = {};
    this.gameEnv = {};
    this.localEnv = {};
    this.globalEnv = {};
  }

  async loadJSON(url) {
    // fetch the JSON data from the specified URL
    const response = await fetch(url);
    // check if the response was successful (i.e. status code in the range 200-299)
    if (response.ok) {
      // parse the response body as JSON and return the result
      return await response.json();
    } else {
      // throw an error if the response was not successful
      throw new Error(`Failed to load JSON from ${url}`);
    }
  }
  
  async setGameEnv() {
    // construct the URL for the game-specific environment variables
    const gameEnvUrl = `/games/game/${CURRENT_GAME}/env.json`;
    // fetch the game-specific environment variables and merge them with any existing values in gameEnv
    const gameEnv = await this.loadJSON(gameEnvUrl);
    Object.assign(this.gameEnv, gameEnv);
  }
  
  async setLocalEnv() {
    // construct the URL for the local environment variables
    const localEnvUrl = 'browser/env-local.json';
    // fetch the local environment variables and merge them with any existing values in localEnv
    const localEnv = await this.loadJSON(localEnvUrl);
    Object.assign(this.localEnv, localEnv);
  }
  
  async setGlobalEnv() {
    // construct the URL for the global(browser) environment variables
    const globalEnvUrl = '/browser/env.json';
    // fetch the global environment variables and merge them with any existing values in globalEnv
    const globalEnv = await this.loadJSON(globalEnvUrl);
    Object.assign(this.globalEnv, globalEnv);
  }
  
  get(name, defaultValue) {
    // Look for the property in the following order:
    // 1. Check if the property is set in globalEnv
    // 2. Check if the property is set in urlParams
    // 3. Check if the property is set in gameEnv
    // 4. Check if the property is set in localEnv
    // 5. Return the default value if property is not set in any source
    
    if (this.globalEnv.hasOwnProperty(name)) {
      return this.globalEnv[name];
    } else if (this.urlParams.hasOwnProperty(name)) {
      return this.urlParams[name];
    } else if (this.gameEnv.hasOwnProperty(name)) {
      return this.gameEnv[name];
    } else if (this.localEnv.hasOwnProperty(name)) {
      return this.localEnv[name];
    } else {
      return defaultValue;
    }
  }

  set(name, value) {
    // The "set()" function takes a "name" and "value" argument and sets the value of the property with the given name in 
    // the "globalEnv" object.
    this.globalEnv[name] = value;
  }

  setUrlParams() {
    //  The setUrlParams() function parses the URL parameters using the URLSearchParams API and stores them in the urlParams 
    //  property of the Environment object using a for loop.
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of params.entries()) {
      this.urlParams[key] = value;
    }
  }
}

export const ENV = new Environment();
