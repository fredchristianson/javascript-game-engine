/** @fileoverview public interface for Logging classes and functions */

import { LOGLEVELS as loglevels } from './logging/log-level.js';
import { createLogger as create } from './logging/logger.js';
import { ConsoleWriter } from './logging/console-writer.js';
import { WindowWriter } from './logging/window-writer.js';
import { ApiWriter } from './logging/api-writer.js';
import { LogWriterBase } from './logging/log-writer.js';

export {
  JSONFormatter, HTMLFormatter, DefaultFormatter
} from './logging/log-formatter.js';


/** @module Logging */

/**
 * An object with all of the log levels
 *
 * ```
 * LOGLEVELS.DEBUG
 * LOGLEVELS.INFO
 * LOGLEVELS.WARN
 * LOGLEVELS.ERROR
 * LOGLEVELS.ASSERT
 * LOGLEVELS.ALWAYS
 * LOGLEVELS.NEVER
 * ```
 * 
 * 
 * @type {Object}
 * @instance
 */
const LOGLEVELS = loglevels;


/**
 * Creates a new Logger for a module
 *
 * @function
 * @param {String} moduleName name of module. shows up on outupt and used to get level from env.
 * @param {LogLevel} [logLevel=null] override the configured log level
 * @returns {Logger}
 * @instance
 */
const createLogger = create;

/**
 * The default console writer configured from the ENV.
 * This can be used to change log level or format during runtime.
 *
 * @type {ConsoleWriter}
 * @instance
 */
const defaultConsoleWriter = ConsoleWriter.getDefault();

/**
 * The default WindowWriter configured from the ENV;
 *
 * This can be used to change log level or format during runtime.
 *
 * @type {WindowWriter}
 * @instance
 *
 */
const defaultWindowWriter = WindowWriter.getDefault();

/**
 * The default ApiWriter configured from the ENV;
 *
 * This can be used to change log level or format during runtime.
 *
 * @type {ApiWriter}
 * @instance
 *
 * @instance
 */
const defaultApiWriter = ApiWriter.getDefault();

/**
 * Uses EVN to setup console, window, and API writers
 * @instance
 */
function configureLogOutput() {
  defaultConsoleWriter._configureDefault();
  defaultWindowWriter._configureDefault();
  defaultApiWriter._configureDefault();
}

/** 
 * The base class for new LogWriters.  Probably not needed.
 * 
 * @class
 * @extends {LogWriterBase} 
 * @type {LogWriterBase}
 */
const LogWriter = LogWriterBase;


export {
  LOGLEVELS,
  createLogger,
  configureLogOutput,
  defaultConsoleWriter,
  defaultWindowWriter,
  defaultApiWriter,
  LogWriter
};