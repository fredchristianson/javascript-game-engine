/**
 * @fileoverview This is a container object for components of 
 * a message being logged
 * 
 * - moduleName
 * - LogLevel
 * - Array of arguments provided to the Logger
 * - time 
 * 
 * It has additional properties filled in if it is not filtered out
 * 
 * - _formattedMessages 
 * - _stackTrace - if any of the arguments is an Error()
 */

/** @module Logging */
import { TYPE, UTIL } from '../helpers.js';

/**
 * A container for log message properties.
 *
 * @private
 * @class LogMessage
 * @typedef {LogMessage}
 */
class LogMessage {
    constructor(moduleName, logLevel, messageParts, time, stack) {
        this._moduleName = moduleName;
        this._logLevel = logLevel;
        this._messageParts = UTIL.toArray(messageParts);
        this._time = time ?? new Date();
        this._formatedMessages = new Map();
        this._stackTrace = stack ?? this._getStackTrace(messageParts);
    }

    getFormatByFormatID(id) {
        return this._formatedMessages.get(id);
    }

    setFormattedMessage(id, message) {
        this._formatedMessages.set(id, message);
    }

    get ModuleName() {
        return this._moduleName;
    }
    get Level() {
        return this._logLevel;
    }
    get Parts() {
        return this._messageParts;
    }
    get Time() {
        return this._time;
    }
    get StackTrace() {
        return this._stackTrace;
    }

    _getStackTrace(messageParts) {
        if (!Array.isArray(messageParts)) {
            return null;
        }
        const err = messageParts.find((part) => {
            return TYPE.isType(part, Error);
        });
        if (TYPE.isType(err, Error)) {
            return err.stack;
        }
        return null;
    }
}


/**
 * Used by Logger to create LogMessage instances
 *
 * @param {String} moduleName name of module doing the logging
 * @param {LogLevel} logLevel level of the message for writers to filter
 * @param {Array<*>} messageParts array of parts of the message
 * @param {Date} [time=new Date] time of the message
 * @returns {LogMessage}
 */
function createLogMessage(moduleName, logLevel, messageParts, time = null) {
    return new LogMessage(moduleName, logLevel, messageParts, time ?? new Date());
}

export { createLogMessage, LogMessage };