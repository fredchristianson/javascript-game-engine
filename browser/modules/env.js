import { Environment } from './env/env.js';

/**
 * @module Env
 * 
 * 
 */

/**
 * A singleton instance of the environment properties.
 * @type {Environment}
 * 
 * @instance
 */
let ENV = new Environment();

/**
 * loadENV needs to be called before ENV is used.
 * one or more urls can be specified to load properties
 * 
 * ```
 * await loadENV('env-local.json','env.json')
 * ```
 * 
 * will load both urls.  env-local.json takes priority if both define the same property.
 *
 * @param {...{}} urls
 */
async function loadENV(...urls) {
    await ENV.loadUrls(...urls);
    return ENV;
}


export { loadENV, ENV };
