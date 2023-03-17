/* Do not import other modules in these helpers.
 * Any module that uses helpers will casue
 * an import cycle if these module import other modules.
 */

/** @module Helpers */

import { STRING as string } from "./helpers/string.js";
import { UTIL } from "./helpers/util.js";
import { TYPE } from "./helpers/type.js";
import { JSONX } from "./helpers/json.js";
import { OBJECT } from "./helpers/object.js";
import { BOOLEAN } from "./helpers/boolean.js";
import { FUNCTION } from "./helpers/function.js";
import { NUMBER } from "./helpers/number.js";

/**
 * Export the STRING namespace
 *
 * @type {STRING}
 * @export
 * @instance
 */
const STRING = string;


export { STRING, UTIL, TYPE, JSONX, OBJECT, BOOLEAN, FUNCTION, NUMBER };