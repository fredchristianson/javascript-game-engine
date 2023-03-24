/**
 * @fileoverview A LogWriter that opens a new window to display 
 * log messages
 */
import { JSONFormatter } from './log-formatter.js';
import { LogWriter } from './log-writer.js';
import { ChildWindow } from '../window.js';
import { LOGLEVELS } from './log-level.js';

/**
 * @module Logging
 * @private
 */

let defaultWindowWriter = null;

/**
 * Writes log messages to the browser console.
 *
 * @extends {LogWriter}
 */
class WindowWriter extends LogWriter {
    /**
     * returns the a default instance of WindowWriter
     *
     * @static
     * @returns {WindowWriter}
     */
    static getDefault() {
        if (defaultWindowWriter == null) {
            defaultWindowWriter = new WindowWriter();
        }
        return defaultWindowWriter;
    }

    /**
     * Creates an instance of WindowWriter.
     *
     * @constructor
     * @param {LogLevel} [level=null] the level of messages to write.  Use ENV if null.
     * @param {*} [formatter=DEFAULT_FORMATTER] The formatter for messages
     */
    constructor(level = null, formatter = new JSONFormatter()) {
        super(level, formatter);
        this._loggerWindow = new ChildWindow('log-view');
        this._loggerWindow.create('log-view.html');
    }

    async _write(logMessage, formattedMessage) {
        await this._loggerWindow.open();
        this._loggerWindow.sendMessage('log', formattedMessage);
    }

    _getWriterType() {
        return 'window';
    }

    /**
     * Derived classes can do additional config
     *
     * @param {Object} _conf - the "logging.output['window']" value from ENV
     */
    _configureWriter(_conf) {
        /*
         * _logLevel has already been updated from the _conf.
         * close the child window if NEVER.
         * window will be opened if needed later for other levels
         */
        if (this._logLevel == LOGLEVELS.NEVER) {
            this._loggerWindow.close();
        }
    }
}

export { WindowWriter };