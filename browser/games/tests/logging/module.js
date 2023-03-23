import { LOGLEVELS, LogWriter, HTMLFormatter, createLogger } from '/modules/logging.js';
import { test } from './tests/custom-log-writer.js';

const log = createLogger('TestLogging', LOGLEVELS.DEBUG);


export const tests = [test];

