import { ASSERT } from '../assert.js';
import { FUNCTION } from '../helpers.js';
import { TestResult } from './test-result.js';
import { createLogger } from '../logging.js';
const log = createLogger('TestSuite');

export class TestSuite {
    constructor(testRunner, implemenation) {
        ASSERT.isType(implemenation, Object, 'Test implementation must be an Object');
        ASSERT.notNull(testRunner, 'TestSuite requires a testRunner');
        this._testRunner = testRunner;
        this._implementation = implemenation;
        this._results = this._buildResults(this._implementation);
        this._name = implemenation.Name ?? 'Unnamed Test Suite';
        this._description = implemenation.Description ?? '';
        this._successCount = 0;
        this._failureCount = 0;
    }

    get Name() {
        return this._name;
    }
    get SuccessCount() {
        return this._successCount;
    }
    get FailureCount() {
        return this._failureCount;
    }

    get Results() {
        return this._results;
    }

    async run() {
        try {
            this._successCount = 0;
            this._failureCount = 0;

            if (FUNCTION.isFunction(this._implementation.setup)) {
                this._implementation.setup();
            }
            for (const test of this._results) {
                log.debug('run test ', test.Name);
                if (!this._testRunner.IsCancelled) {
                    const isSuccess = await test.run();
                    log.debug('completed test ', test.Name);
                    if (isSuccess) {
                        this._successCount++;
                    } else {
                        this._failureCount++;
                    }
                }
            }
            if (FUNCTION.isFunction(this._implementation.cleanup)) {
                this._implementation.cleanup();
            }
        } catch (ex) {
            log.error(`TestSuite ${this._name} has unknown exception.`, ex);
        }
    }
    _buildResults(testObject) {
        const testResults = [];
        for (const [name, func] of FUNCTION.getMethods(testObject).entries()) {

            if (typeof func == 'function' && name.startsWith('test_')) {
                const testName = name.substring(5);
                const test = new TestResult(this, testName, func.bind(testObject));
                testResults.push(test);
            }
        }
        return testResults;
    }
}