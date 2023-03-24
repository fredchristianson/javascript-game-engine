import { createLogger } from '../logging.js';
import { TestResult } from './test-result.js';
const log = createLogger('AutoTestResult');

const NO_MESSAGE = 'no message provided';
export class UITestResult extends TestResult {
    constructor(suite, name, testFunction) {
        super(suite, name, testFunction);
        this._prompt = 'Is this working? (a better prompt should be here).';
    }

    get Prompt() {
        return this._prompt;
    }

    /**
     * a prompt explaining what the test does
     *
     * @param {String} prompt the description of the test;
     */
    set Prompt(prompt) {
        this._prompt = prompt;
    }


}

