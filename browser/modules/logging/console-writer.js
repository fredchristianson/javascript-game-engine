import { DEFAULT_FORMATTER } from "./log-formatter.js";
import { LogWriterBase } from "./log-writer.js";
import { LogLevel } from "./log-level.js";

let defaultConsoleWriter = null;

/**
 * Writes log messages to the browser console.
 *
 * @class ConsoleWriter
 * @extends {LogWriterBase}
 */
class ConsoleWriter extends LogWriterBase {
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
    _getWriterType() { return "console"; }

}

export { ConsoleWriter };