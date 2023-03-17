/* Do not import other modules in these helpers.
 * Any module that uses helpers will casue
 * an import cycle if these module import other modules.
 */

/** @module Helpers */

import { STRING as string } from "./helpers/string.js";
import { UTIL as util } from "./helpers/util.js";
import { TYPE as type } from "./helpers/type.js";
import { OBJECT as object } from "./helpers/object.js";
import { BOOLEAN as boolean } from "./helpers/boolean.js";
import { FUNCTION as func } from "./helpers/function.js";
import { NUMBER as number } from "./helpers/number.js";

/**
 * Collection of functions for working with strings.
 *
 * @type {STRING}
 * @export
 * @instance
 */
const STRING = string;

/**
 * Collection of functions for working with utils.
 *
 * @type {UTIL}
 * @export
 * @instance
 */
const UTIL = util;

/**
 * Collection of functions for working with types.
 *
 * @type {TYPE}
 * @export
 * @instance
 */
const TYPE = type;

/**
 * Collection of functions for working with objects.
 *
 * @type {OBJECT}
 * @export
 * @instance
 */
const OBJECT = object;

/**
 * Collection of functions for working with functions.
 *
 * @type {FUNCTION}
 * @export
 * @instance
 */
const FUNCTION = func;


/**
 * Collection of functions for working with booleans.
 *
 * @type {BOOLEAN}
 * @export
 * @instance
 */
const BOOLEAN = boolean;

/**
 * Collection of functions for working with numberss.
 *
 * @type {NUMBER}
 * @export
 * @instance
 */
const NUMBER = numbers;


export { STRING, UTIL, TYPE, OBJECT, BOOLEAN, FUNCTION, NUMBER };