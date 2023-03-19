import { JSONFormatter } from './log-formatter.js';
import { LogWriterBase } from './log-writer.js';
import { ChildWindow } from '../window.js';
import { LOGLEVELS } from './log-level.js';

let defaultWindowWriter = null;

/**
 * Writes log messages to the browser console.
 *
 * @class WindowWriter
 * @extends {LogWriterBase}
 */
class WindowWriter extends LogWriterBase {
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

    constructor(level = null, formatter = null) {
        super(level, formatter ?? new JSONFormatter());
        this._loggerWindow = new ChildWindow('log-view', 'log-view.html');
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
     * @param {Object} conf - the "logging.output['window']" value from ENV
     */
    _configureWriter(conf) {
        if (this._logLevel == LOGLEVELS.NEVER) {
            this._loggerWindow.close();
        }
    }
}

export { WindowWriter };