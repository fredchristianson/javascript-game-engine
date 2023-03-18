import { DEFAULT_FORMATTER, JSONFormatter } from "./log-formatter.js";
import { LogWriterBase } from "./log-writer.js";
import { API } from "../network/api.js";
import { STRING } from "../helpers.js";

let defaultApiWriter = null;
/**
 * Writes log messages to the browser console.
 *
 * @class ApiWriter
 * @extends {LogWriterBase}
 */
class ApiWriter extends LogWriterBase {
    /**
     * returns the a default instance of ApiWriter
     *
     * @static
     * @returns {ApiWriter}
     */
    static getDefault() {
        if (defaultApiWriter == null) {
            defaultApiWriter = new ApiWriter();
        }
        return defaultApiWriter;
    }

    constructor(level = null, apiUrl = "/api/v1/log", formatter = null) {
        super(level, formatter);
        this._apiUrl = apiUrl;
        this._jsonFormatter = new JSONFormatter();
    }

    _getWriterType() { return "api"; }
    _write(logMessage, formattedMessage) {
        const json = this._jsonFormatter.format(logMessage);
        json.formattedMessage = formattedMessage;
        API.post(this._apiUrl, json);
    }

    /**
     * Derived classes can do additional config
     *
     * @param {Object} conf - the "logging.output[TYPE]" value from ENV
     */
    _configureWriter(conf) {
        if (!STRING.isEmpty(conf.apiUrl)) {
            this._apiUrl = conf.apiUrl;
        }
    }
}

export { ApiWriter };