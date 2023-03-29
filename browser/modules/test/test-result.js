import { createLogger } from '../logging.js';
const log = createLogger('TestResult');

const NO_MESSAGE = 'no message provided';
export class TestResult {
    constructor(suite, name, testFunction) {
        this._testSuite = suite;
        this._function = testFunction;
        this._name = name;
        this._description = null;
        this._success = true;
        this._complete = false;
        this._running = false;
        this._errors = [];
        this._result = new Promise((resolve, reject) => {
            this._resolveResult = resolve;
            this._rejectResult = reject; // should not happen
        });
        this._run = new Promise((resolve, reject) => {
            this._resolveRun = resolve;
            this._rejectRun = reject; // should not happen
        });
    }
    get Suite() {
        return this._testSuite;
    }

    set Name(name) {
        this._name = name;
    }
    get Name() {
        return this._name;
    }
    set Description(description) {
        this._description = description;
    }
    get Description() {
        return this._description;
    }
    get IsSuccess() {
        return this._success;
    }
    get IsComplete() {
        return this._complete;
    }
    get IsRunning() {
        return this._running;
    }
    get Errors() {
        return this._errors;
    }
    async isComplete() {
        await this._result;
    }
    async isRunning() {
        await this._run;
    }

    async run(testGame) {
        try {
            this._testGame = testGame;
            this._success = true;
            this._complete = false;
            this._running = true;
            this._resolveRun(this);
            log.debug('start test ', this._name);
            await this._function(this);
            if (this._testGame) {
                this._testGame.testRunning(this);
                this._success = await this._testGame.isSuccess();
                if (this._errors.length == 0) {
                    this._errors.push('user failed');
                }
            }
            log.debug('finished test ', this._name);
        } catch (ex) {
            log.error('AutoTestResult failed', this._name, ex);
            this._success = false;
        }
        this._complete = true;
        this._resolveResult(this);
        return this._success;
    }


    error(message = NO_MESSAGE) {
        this._errors.push(message);
        this._success = false;
        this._resolveRun(this);
        this._resolveResult(this);
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
