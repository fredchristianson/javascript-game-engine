/** @fileoverview public interface for Logging classes and functions */

import { ConsoleWriter } from './logging/console-writer.js';
import { WindowWriter } from './logging/window-writer.js';
import { ApiWriter } from './logging/api-writer.js';
import { _writersInitialized } from './logging/logger.js';

/** @module Logging */


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
 * Uses EVN to setup console, window, and API writers.
 * This should be called once at the beginning of the application
 * 
 * @instance
 */
function configureLogOutput() {
  defaultConsoleWriter._configureDefault();
  defaultWindowWriter._configureDefault();
  defaultApiWriter._configureDefault();
  _writersInitialized();
}

/* export implementations that should be visible outside Logging */
export { LogWriter } from './logging/log-writer.js';

export { LOGLEVELS } from './logging/log-level.js';
export { createLogger, Logger } from './logging/logger.js';

export {
  LogFormatter,
  DefaultFormatter,
  JSONFormatter,
  HTMLFormatter,
  FormatComponent,
  DateFormatComponent,
  TimeFormatComponent,
  ModuleNameFormatComponent,
  LevelFormatComponent,
  TextFormatComponent,
  StringFormatComponent,
  DEFAULT_FORMATTER

} from './logging/log-formatter.js';

export {
  configureLogOutput,
  defaultConsoleWriter,
  defaultWindowWriter,
  defaultApiWriter
};