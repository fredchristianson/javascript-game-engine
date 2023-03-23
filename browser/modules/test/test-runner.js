import { TestSuite } from './test-suite.js';
import { TYPE, UTIL, STRING } from '../helpers.js';
import { ASSERT } from '../assert.js';
import { createLogger } from '../logging.js';

const log = createLogger('TestRunner');

async function* generateResults(testSuites) {
    for (const suiteResult of testSuites) {
        for (const testResult of suiteResult.Results) {
            // eslint-disable-next-line no-await-in-loop
            await testResult.isRunning();
            yield { isRunning: true, isComplete: false, test: testResult };
            // eslint-disable-next-line no-await-in-loop
            await testResult.isComplete();

            yield { isRunning: false, isComplete: true, test: testResult };
        }
    }
}

class TestRunner {
    constructor(module) {
        ASSERT.notNull(module, 'TestRunner requires a module');
        this._module = module;
        this._testSuites = [];
        this._buildTests(module, this._testSuites);
        this._cancelled = false;
        if (!STRING.isBlank(module.Name)) {
            this._name = module.Name;
        } else if (this._testSuites.length > 0) {
            this._name = this._testSuites[0].Name;
        } else {
            this._name = 'unnamed';
        }
        this._successCount = 0;
        this._failureCount = 0;
    }

    cancel() {
        this._cancelled = true;
    }

    get Name() {
        return this._name;
    }
    get IsCancelled() {
        return this._cancelled;
    }
    get SuccessCount() {
        return this._testSuites.reduce((count, suite) => {
            count += suite.SuccessCount;
            return count;
        }, 0);
    }
    get FailureCount() {
        return this._testSuites.reduce((count, suite) => {
            count += suite.FailureCount;
            return count;
        }, 0);

    }


    results() {
        return generateResults(this._testSuites);
    }

    run() {
        /*
         * suites will run asynchronously but we don't wait for them
         * instead, return a generator that will return each result as
         * it is complete;
         */
        this._successCount = 0;
        this._failureCount = 0;
        this._cancelled = false;

        this._runSuites();
        return this.results();
    }

    async _runSuites() {
        for (const suite of this._testSuites) {
            if (!this.IsCancelled) {
                try {
                    // eslint-disable-next-line no-await-in-loop
                    await suite.run();
                } catch (ex) {
                    log.error(`Test ${suite.Name} failed`, ex);
                }
            }
        }
    }

    _buildTests(module, testSuites) {
        ASSERT.isType(testSuites, Array, 'tests parameter must be an array');
        log.info('TestRunner building tests');
        try {
            const testImplementations = [];
            this._collectTestImplementations(module, testImplementations);
            testSuites.push(...testImplementations.map((implementation) => {
                return new TestSuite(this, implementation);
            }));
            log.debug(`got ${testSuites.length} suites`);
        } catch (ex) {
            log.error('failed to build tests');
            throw ex; // rethrow the same exception
        }
    }

    _collectTestImplementations(supplier, testImplementations) {
        ASSERT.isArray(testImplementations, 'testImplementations must be an array');
        ASSERT.notNull(supplier, 'Test supplier cannot be null');

        if (TYPE.isModule(supplier)) {
            log.debug('got Module test supplier');
            const tests = UTIL.toArray(supplier.tests);
            tests.forEach((test) => {
                this._collectTestImplementations(test, testImplementations);
            });
        } else if (TYPE.isType(supplier, Object)) {
            log.debug(`got Test Supplier ${supplier?.Name ?? 'unnamed'}`);
            testImplementations.push(supplier);
        }
    }


}

export function createTestRunner(module) {
    return new TestRunner(module);
}