/** @fileoverview A LogWriter that sends JSON messages to the server */
import { DEFAULT_FORMATTER, JSONFormatter } from './log-formatter.js';
import { LogWriter } from './log-writer.js';
import { API } from '../network/api.js';
import { STRING } from '../helpers.js';

/** @module Logging */
let defaultApiWriter = null;
/**
 * Writes log messages to the browser console.
 *
 * @extends {LogWriter}
 */
class ApiWriter extends LogWriter {
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

    /**
     * Creates an instance of ApiWriter.
     *
     * @constructor
     * @param {LogLevel} [level=null] the LOGLEVELS value to filter messages.  If null, ENV is used to get the level
     * @param {string} [apiUrl='/api/v1/log'] the api URL to write
     * @param {LogFormatter} [formatter=null] the way to format messages.  
     * JSONFormatter is used to create the API body, but it includes a 
     * formatted message that is created with this formatter
     */
    constructor(level = null, apiUrl = '/api/v1/log', formatter = DEFAULT_FORMATTER) {
        super(level, formatter);
        this._apiUrl = apiUrl;
        this._jsonFormatter = new JSONFormatter();
    }

    _getWriterType() {
        return 'api';
    }
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