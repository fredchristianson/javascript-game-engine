
/** @module ASSERT */

import { ASSERT as assert } from './assertion/assert.js';
import { ENSURE as ensure } from './assertion/ensure.js';

/**
 * ASSERT tests that throw an error if there is an
 * unexpected state (e.g. invalid argument)
 *
 * @type {ASSERT}
 * @export
 * @instance
 */
const ASSERT = assert;

/**
 * ENSURE tests return a corrected value if there is an
 * unexpected state (e.g. invalid argument)
 *
 * @type {ENSURE}
 * @export
 * @instance
 */
const ENSURE = ensure;

export { ASSERT, ENSURE };