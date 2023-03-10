// ENV is a singleton that provides environment properties wherever it they are needed.
//
// Properties can come from multiple sources.
// if multiple sources have the same property, they are prioritized in this order
//  1) Set with Environment.set()
//  2) Url parameters: This url http://localhost:4263?env=dev&performance=hi
//                      sets properties for "env", and "performance"
//  3) /games/game/CURRENT-GAME/env.json
//  4) /env-local.json:  load env.json if it exists.
//                  this file should not be in git.  create if you need.
//  5) /env.json:  load the env.json file if it exists
//                  this file is the same for everyone.
//
// in the future we will add the ability to listen to change events.
// for example, logging levels may change when a new game is loaded

const envJSON = await fetch(`http://${window.location.host}/env.json`)
const variables = await envJSON.json()

/**
 * Environment.
 * @class
 * @classdesc provides environment properties wherever it they are needed.
 *
 */
class Environment {
  constructor() {
    this.env = new Map()
    this._getEnvJSON()
    this._getEnvURL()
  }

  /**
   * _getEnvJSON.
   * @private
   * @function
   * @name _getEnvJSON
   */
  _getEnvJSON() {
    for (const key in variables) {
      if (variables.hasOwnProperty(key)) {
        const value = variables[key]
        this.env.set(key,value)
      }
    }
  }

  /**
   * _getEnvURL.
   * @private
   * @function
   * @name _getEnvURL
   */
  _getEnvURL() {
    // TODO: get environemnt variables from the url
    console.log(window.location.href)
  }

  /**
   * get.
   *
   * Return the property with the given name or default if not set;
   *
   * @param {string} name
   * @param {any} defaultValue
   */
  get(name, defaultValue = null) {
    const val = this.env.get(name)
    return val ? val : defaultValue
  }

  /**
   * set.
   *
   * Set the property name
   * @param {string} name
   * @param {any} value
   */
  set(name, value = null) {
    if(!name) {
      console.log("No name provided!")
      return
    }
    if(!value) {
      console.log("Warning, no value provided")
    }
    this.env.set(name,value)
  }
}

export const ENV = new Environment();
