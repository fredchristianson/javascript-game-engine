/**
 * @fileoverview The base class for all LogWriters.  Standard writers are
 * - ConsoleWriter: writes to the browser console
 * - ApiWriter: writes to an api (default /api/v1/log)
 * - WindowWriter: opens a new browser window for log messages
 */

import { DEFAULT_FORMATTER } from './log-formatter.js';
import { LOGLEVELS } from './log-level.js';
import { LOGENV } from './logging-env.js';
import { TYPE } from '../helpers.js';
import { createObserver } from '../observe.js';
import { ENV } from '../env.js';

/**
 * @module Logging
 * @private
 */

/**
 * An array of LogWriters.  The constructor of LogWriter
 * adds writers to the list.
 *
 * @private
 * @type {Array.LogWriter}
 * 
 */
const logWriters = [];


/**
 * The base class for all LogWriter types.  The standard types are
 * - ConsoleLogWriter
 * - WindowLogWriter
 * - ApiLogWriter
 *
 * 
 */
class LogWriter {
    /**
     * Creates an instance of LogWriter.
     *
     * @constructor
     * @param {LogLevel} level - the level of messages to write.  
     * If null, ENV.logging.output is used to configure the level.
     * @param {LogFormatter} formatter - the way messages are formatted.  Default
     */
    constructor(level = null, formatter = DEFAULT_FORMATTER) {
        this._logLevel = level;
        this._formatter = formatter;
        logWriters.push(this);
        if (level == null) {
            // get level from env so need to observe ENV changes
            createObserver(ENV.ChangeObservable, () => {
                this._configureDefault();
            });
        }
    }

    get ID() {
        return this._id;
    }

    /**
     * Writes the LogMessage provided
     *
     * @param {LogMessage} logMessage the LogMessage created by a Logger
     */
    write(logMessage) {
        if (this._logLevel != null && this._logLevel.isWanted(logMessage.Level)) {
            const formattedMessage = this._formatter?.format(logMessage) ?? null;
            this._write(logMessage, formattedMessage);
        }
    }

    /**
     * Derived classes should implement this to send the message to their target
     *
     * @param {*} _logMessage - the original LogMessage to write
     * @param {*} _formattedMessage - the formatted log message
     */
    _write(_logMessage, _formattedMessage) {
        throw new Error('LogWriter must implement _write(logMessage,formattedMessage);');
    }

    _configureDefault() {
        const conf = LOGENV._getWriterConfiguration(this._getWriterType());
        if (TYPE.isType(conf, Promise)) {
            conf.then((result) => {
                const level = LOGLEVELS.get(result.level);
                this._logLevel = level;
                this._configureWriter(conf);

            });
        } else if (conf != null) {
            const level = LOGLEVELS.get(conf.level);
            this._logLevel = level;
            this._configureWriter(conf);
        } else {
            this._logLevel = LOGLEVELS.NEVER;
            this._configureWriter({ level: never });
        }

    }


    /**
     * Derived classes can do additional config
     *
     * @param {Object} _conf - the "logging.output[TYPE]" value from ENV
     */
    _configureWriter(_conf) {
        // nothing unless overriden
    }

    _getWriterType() {
        return 'default';
    }
}


/**
 * Writes a LogMessage to all LogWriters.  Each writer will
 * determine if the log level allows it to be writen.
 *
 * This should only be used by Logger
 * 
 * @private
 * @param {LogMessage} logMessage is the LogMessage to write
 * 
 */
function writeMessage(logMessage) {
    for (const writer of logWriters) {
        writer.write(logMessage);
    }
}

export { LogWriter, writeMessage };
