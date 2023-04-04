import { ENV } from './env/env.js';

/**
 * @module Env
 * 
 * 
 */


/**
 * loadENV needs to be called before ENV is used.
 * one or more urls can be specified to load properties
 * 
 * ```
 * await loadENV('env-local.json','env.json')
 * ```
 * 
 * will load both urls.  env-local.json takes priority in this case
 * if both define the same property since it is loaded first.
 *
 * @param {...String} urls urls to load.  Usually ('env-local.json','env.json').
 */
async function loadENV(...urls) {
    const loader = await import('./env/env-loader.js');
    await loader.loadUrls(...urls);
    return ENV;
}


/**
 * Load the environment for a named game.  Other environment sources remain
 * the same, but the game source is replaced.
 *
 * @async
 * @param {String} gameName name of the game
 * @returns {ENV}
 */
async function loadGameENV(gameName) {
    const loader = await import('./env/env-loader.js');
    await loader.loadGameEnvironment(gameName);
    return ENV;
}


export { ENV } from './env/env.js';
export { loadENV, loadGameENV };
