/** @fileoverview A LogWriter that uses console.log()/warn()/error() to write messages*/

import { DEFAULT_FORMATTER } from './log-formatter.js';
import { LogWriter } from './log-writer.js';

/**
 * @module Logging
 * @private
 */
let defaultConsoleWriter = null;

/**
 * Writes log messages to the browser console.
 *
 * @extends {LogWriter}
 */
class ConsoleWriter extends LogWriter {
    /**
     * returns the a default instance of ConsoleWriter
     *
     * @static
     * @returns {ConsoleWriter}
     */
    static getDefault() {
        if (defaultConsoleWriter == null) {
            defaultConsoleWriter = new ConsoleWriter();
        }
        return defaultConsoleWriter;
    }

    /**
     * Creates an instance of ConsoleWriter.
     *
     * @constructor
     * @param {LogLevel} [level=null] If null, the level is loaded from ENV
     * @param {DefaultFormatter} [formatter=DEFAULT_FORMATTER] - formatter for messages.  A string format is expected, but anything console.log can write is ok
     */
    constructor(level = null, formatter = DEFAULT_FORMATTER) {
        super(level, formatter);
    }

    _write(logMessage, formattedMessage) {
        const level = logMessage.Level;
        if (level.isError) {
            console.error(formattedMessage);
        } else if (level.isWarning) {
            console.warn(formattedMessage);
        } else {
            console.log(formattedMessage);
        }
    }
    _getWriterType() {
        return 'console';
    }

}

export { ConsoleWriter };