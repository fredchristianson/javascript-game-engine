import { ASSERT } from '../assert.js';
import { FUNCTION } from '../helpers.js';
import { createLogger } from '../logging.js';
import { AutoTestResult } from './auto-test-result.js';
import { UITestResult } from './ui-test-result.js';
import { TestGame } from './test-game.js';
const log = createLogger('TestSuite');

export class TestSuite {
    constructor(testRunner, implemenation) {
        ASSERT.isType(implemenation, Object, 'Test implementation must be an Object');
        ASSERT.notNull(testRunner, 'TestSuite requires a testRunner');
        this._testRunner = testRunner;
        this._implementation = implemenation;
        this._successCount = 0;
        this._failureCount = 0;
        this._hasUI = false;
        this._testGame = null;
        this._results = this._buildResults(this._implementation);
        this._name = implemenation.Name ?? 'Unnamed Test Suite';
        this._description = implemenation.Description ?? '';

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
                if (this._hasUI) {
                    this._testGame = new TestGame(this);
                    await this._testGame.setup(this, this._implementation);

                } else {
                    this._testGame = null;
                    await this._implementation.setup();
                }
            } else {
                ASSERT.isFalse(this._hasUI, 'TestSuite requires UI but does not implement setup(theGame, worldElement) ', this.Name);
            }
            for (const test of this._results) {
                log.debug('run test ', test.Name);
                if (!this._testRunner.IsCancelled) {
                    // eslint-disable-next-line no-await-in-loop
                    const isSuccess = await test.run(this._testGame);
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
            if (this._testGame) {
                this._testGame.cleanup();
            }
        } catch (ex) {
            for (const test of this._results) {
                test.error(ex.message);
            }
            log.error(`TestSuite ${this._name} has unknown exception.`, ex);
            this._failureCount = 1;
            throw ex;
        }
    }
    _buildResults(testObject) {
        const testResults = [];
        for (const [name, func] of FUNCTION.getMethods(testObject).entries()) {

            if (typeof func == 'function') {
                if (name.startsWith('test_')) {
                    const testName = name.substring(5);
                    const test = new AutoTestResult(this, testName, func.bind(testObject));
                    testResults.push(test);
                } else if (name.startsWith('uitest_')) {
                    const testName = name.substring(6);
                    const test = new UITestResult(this, testName, func.bind(testObject));
                    testResults.push(test);
                    this._hasUI = true;
                }
            }
        }
        return testResults;
    }
}