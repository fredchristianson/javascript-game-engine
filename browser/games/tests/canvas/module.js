import { LOGLEVELS, createLogger } from '/modules/logging.js';
import { test } from './tests/canvas.js';

const log = createLogger('TestCanvas', LOGLEVELS.DEBUG);

export function setup() {
    log.info('setup canvas test');
}
export function cleanup() {
    log.info('cleanup canvas test');
}

export const tests = [test];

