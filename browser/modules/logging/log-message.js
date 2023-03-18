import { TYPE, UTIL } from "../helpers.js";

export class LogMessage {
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

    get ModuleName() { return this._moduleName; }
    get Level() { return this._logLevel; }
    get Parts() { return this._messageParts; }
    get Time() { return this._time; }
    get StackTrace() { return this._stackTrace; }

    _getStackTrace(messageParts) {
        if (!Array.isArray(messageParts)) {
            return null;
        }
        const err = messageParts.find(part => { return TYPE.isType(part, Error); });
        if (TYPE.isType(err, Error)) {
            return err.stack;
        }
        return null;
    }
}

export function createLogMessage(moduleName, logLevel, messageParts, time = null) {
    return new LogMessage(moduleName, logLevel, messageParts, time ?? new Date());
}