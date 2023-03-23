import { createLogger } from '../logging.js';
import { TestResult } from './test-result.js';
const log = createLogger('AutoTestResult');

const NO_MESSAGE = 'no message provided';
export class AutoTestResult extends TestResult {
    constructor(suite, name, testFunction) {
        super(suite, name, testFunction);

    }

}

