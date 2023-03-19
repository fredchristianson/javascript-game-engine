import { DEFAULT_FORMATTER } from './log-formatter.js';
import { LOGLEVELS } from './log-level.js';
import { LOGENV } from './logging-env.js';
import { TYPE } from '../helpers.js';
import { createObserver } from '../observe.js';
import { ENV } from '../env.js';

/**
 * An array of LogWriters.  The constructor of LogWriterBase
 * adds writers to the list.
 *
 * @private
 * @type {Array.LogWriterBase}
 * 
 */
const logWriters = [];


/**
 * The base class for all LogWriter types.  The standard types are
 * - ConsoleLogWriter
 * - WindowLogWriter
 * - ApiLogWriter
 *
 * @export
 * 
 */
class LogWriterBase {
    constructor(level, formatter) {
        this._logLevel = level;
        this._formatter = formatter ?? DEFAULT_FORMATTER;
        logWriters.push(this);
        createObserver(ENV.ChangeObservable, () => {
            this._configureDefault();
        });
    }

    get ID() {
        return this._id;
    }

    write(logMessage) {
        if (this._logLevel != null && this._logLevel.isWanted(logMessage.Level)) {
            const formattedMessage = this._formatter.format(logMessage);
            this._write(logMessage, formattedMessage);
        }
    }
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

export { LogWriterBase, writeMessage };
