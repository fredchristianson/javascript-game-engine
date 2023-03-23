import { createLogger } from '../logging.js';
import { TestResult } from './test-result.js';
const log = createLogger('AutoTestResult');

const NO_MESSAGE = 'no message provided';
export class UITestResult extends TestResult {
    constructor(suite, name, testFunction) {
        super(suite, name, testFunction);
    }
   
    
    async run() {
        try {
            this._success = true;
            this._complete = false;
            this._running = true;
            this._resolveRun(this);
            log.debug('start test ', this._name);
            await this._function(this);
            log.debug('finished test ', this._name);
        } catch (ex) {
            log.error('AutoTestResult failed', this._name, ex);
            this._success = false;
        }
        this._complete = true;
        this._resolveResult(this);
        return this._success;
    }

    expectTrue(value, message = NO_MESSAGE) {
        if (!value) {
            this._success = false;
            this._errors.push(message ?? 'test fail');
        }
    }

    expect(value, message = NO_MESSAGE) {
        this.expectTrue(value, message);
    }
    expectFalse(value, message = 'no message provided') {
        if (value) {
            this._success = false;
            this._errors.push(message ?? 'test fail');
        }
    }
}

export function createTestRunner(module) {
    return new TestRunner(module);
}