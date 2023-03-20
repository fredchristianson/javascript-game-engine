/**
 * @fileoverview The primary class used to write log messages.
 * 
 * ```
 *  import {createLogger} from '../modules/logging.js';
 *  const log = createLogger('my.module.name');
 *  log.debug("this is a log message.  ",42,{a:"objects can be logged too"});
 * ```
 * 
 */

import { LogLevel } from './log-level.js';
import { STRING } from '../helpers.js';
import { ASSERT } from '../assert.js';
import { LOGENV } from './logging-env.js';
import { createObserver } from '../observe.js';
import { ENV } from '../env.js';

/**
 *@module Logging
 * @private
 */

/**
 * An object that can be used to log message.  It has a method for
 * every log level.
 * 
 * Usage:
 * 
 * ```
 * const log = createLogger("moduleName",LOGLEVEL.DEBUG);
 * log.debug("this is a debug message"); 
 * log.info("this is", "an information","message");
 * log.warn("a warning message",{a:1,b:2});
 * log.error("an error.");
 * log.assert("message that an assertion failed",ex);
 * log.always("this will always be logged.");
 * log.never("this will never be logged");
 * ```
 * 
 * Any number of arguments can be passed.  They will be
 * converted to strings and combined
 * to form the log message if the logger's log level is at least
 * the message level.  If the message won't be logged, the 
 * combined string is not build.  Callers should not create the
 * message themselves since that may waste CPU & memory.
 * 
 * If an exception (Error) is included in any log arguments, a stack
 * trace will be included.
 * 
 */
class Logger {
  /**
   * A Logger should usually be created with createLogger(), not new Logger()
   * 
   * Creates an instance of Logger.
   *
   * @constructor
   * @param {String} moduleName - the name of the module logging messages
   * @param {LogLevel} level - only messages at or below this level are logged
   */
  constructor(moduleName, level) {

  }

  /**
   * return the Logger's module name;
   *
   * @returns {String} the name;
   */
  get ModuleName() {

  }


  /**
   * write a message if the logger's level is DEBUG
   *
   * @param {...*} message - array of arguments to be converted to strings and concatenated
   */
  debug(...message) {


  }

  /**
   * write a message if the logger's level is DEBUG or INFO
   *
   * @param {...*} message - array of arguments to be converted to strings and concatenated
   */
  info(...message) {

  }


  /**
   * write a message if the logger's level is DEBUG, INFO, or WARN
   *
   * @param {...*} message - array of arguments to be converted to strings and concatenated
   */
  warn(...message) {

  }


  /**
   * write a message if the logger's level is ERROR or above
   *
   * @param {...*} message - array of arguments to be converted to strings and concatenated
   */
  error(...message) {

  }

  /**
   * write a message if the logger's level is ASSERT or above
   *
   * @param {...*} message - array of arguments to be converted to strings and concatenated
   */
  assert(...message) {

  }

  /**
   * always write the message
   *
   * @param {...*} message - array of arguments to be converted to strings and concatenated
   */
  always(...message) {

  }

  /**
   * never write a message 
   *
   * @param {...*} message - array of arguments to be converted to strings and concatenated
   */
  never(...message) {
    // do nothing
  }
}

/**
 * Observes ENV for changes and updates the logger's
 * level.
 *
 * @param {Logger} logger - a Logger to update if ENV changes
 */
function watchEnvLoggingProperties(logger) {
  createObserver(ENV.ChangeObservable, () => {
    const logLevel = LOGENV.getConfiguredLogLevel(logger.ModuleName);
    logger.setLevel(logLevel);
  });
}

/**
 * Create a new Logger
 * @instance
 * @param {String} moduleName name of module. shows up on outupt and used to get level from env.
 * @param {LogLevel} [logLevel=null] override the configured log level
 * @returns {Logger}
 */
function createLogger(moduleName, logLevel = null) {
  ASSERT.isFalse(STRING.isBlank(moduleName), 'createLogger module name must be a string');
  ASSERT.isTypeOrNull(logLevel, LogLevel, 'logLevel must be a LogLevel or null');
  let watchEnv = false;
  if (logLevel === null) {
    logLevel = LOGENV.getConfiguredLogLevel(moduleName);
    watchEnv = true;
  }
  const logger = new Logger(moduleName, logLevel);
  if (watchEnv) {
    watchEnvLoggingProperties(logger);
  }
  return logger;
}

export { Logger, createLogger };