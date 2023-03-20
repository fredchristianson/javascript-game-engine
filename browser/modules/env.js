import { Environment } from "./env/env.js";

/**
 * @module Env
 */

/**
 * A singleton instance of the environment properties.
 * @type {Environment}
 *
 * @instance
 */
const ENV = new Environment();

await ENV.setup();

export { ENV };
