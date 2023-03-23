import { LOGLEVELS, LogWriter, DefaultFormatter, createLogger } from '/modules/logging.js';

const log = createLogger('TestLogging', LOGLEVELS.DEBUG);

function reverseMessage(message) {
    // reverse the message
    return `---reverse='${message.split('').reverse()
        .join('')}'---`;
}

class TestFormatter extends DefaultFormatter {
    constructor() {
        super();
    }

    format(logMessage) {
        return {
            orig: logMessage, formatted: super.format(logMessage)
        }
    }
}

class TestLogWriter extends LogWriter {
    constructor(level) {
        super(level, new TestFormatter());
        this._messages = [];
    }
    _write(_logMessage, formattedMessage) {
        this._messages.push(formattedMessage);
    }

    get Messages() {
        return this._messages;
    }
}


class CustomLogWriterTest {
    constructor() {

    }

    // return Name for reports
    get Name() {
        return 'CustomLogWriter';
    }

    // return Description
    get Description() {
        return 'Create a custom LogWriter and make sure messages are received.';
    }

    // do any necessary setup before tests are run
    async setup() {
        /*
         * this._childWindow = new ChildWindow('TestLogging');
         * this._htmlWriter = new TestLogWriter(DOM.ofElement(await this._childWindow.getDocument()));
         */
    }

    /*
     * free resources or anything else needed
     * after all tests are run;
     */
    cleanup() { }

    /*
     * any method beginning with "test_" will be called with
     * a result object (/browser/modules/test/test-result.js).
     * 
     * the result has many methods to set success/fail.
     * if any expect*() method fails, the test is counted as failing.
     * the number of expect*() sucess and failure is not counted
     */
    test_DebugLogged(result) {
        const writer = new TestLogWriter(LOGLEVELS.DEBUG);
        result.Name = 'CustomLogWriter: debug logged';
        const message = 'testing debug';

        const testLogger = createLogger('testLogger', LOGLEVELS.DEBUG);

        // reverseMessage will only be called if DEBUG level
        testLogger.debug(message, () => {
            return reverseMessage(message);
        });

        result.expect(1 == writer.Messages.length);

        writer.close();
    }

    test_InfoLoggerDebugMessage(result) {
        const writer = new TestLogWriter(LOGLEVELS.DEBUG);
        //result.Name = 'CustomLogWriter: debug logged';
        const message = 'testing debug';

        const testLogger = createLogger('testLogger', LOGLEVELS.INFO);

        // reverseMessage will only be called if DEBUG level
        testLogger.debug(message);

        result.expect(0 == writer.Messages.length);

        writer.close();
    }


    test_InfoWriterDebugMessage(result) {
        const writer = new TestLogWriter(LOGLEVELS.INFO);
        //result.Name = 'CustomLogWriter: debug logged';
        const message = 'testing debug';

        const testLogger = createLogger('testLogger', LOGLEVELS.DEBUG);

        // reverseMessage will only be called if DEBUG level
        testLogger.debug(message);

        result.expect(0 == writer.Messages.length);

        writer.close();
    }

}

export const test = new CustomLogWriterTest();