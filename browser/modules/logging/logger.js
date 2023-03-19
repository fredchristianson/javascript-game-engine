import { LOGLEVELS, LogLevel } from './log-level.js';
import { STRING, TYPE } from '../helpers.js';
import { ArgumentException } from '../exception.js';
import { createLogMessage } from './log-message.js';
import { writeMessage } from './log-writer.js';
import { ASSERT } from '../assert.js';
import { LOGENV } from './logging-env.js';
import { createObserver } from '../observe.js';
import { ENV } from '../env.js';
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
    if (!STRING.isString(moduleName)) {
      throw new ArgumentException('moduleName must be a string');
    }
    if (!TYPE.isType(level, LogLevel)) {
      throw new ArgumentException('level must be type LogLevel');
    }
    this._moduleName = moduleName;
    this._level = level;
  }

  /**
   * return the Logger's module name;
   *
   * @returns {String} the name;
   */
  get ModuleName() {
    return this._moduleName;
  }

  /**
   * Updatee the logger's level
   *
   * @param {LogLevel} level
   */
  setLevel(level) {
    this._level = level;
  }

  /**
   * writes a message at the given level.  Mainly 
   * called from other Logger methods (debug, info,etc)
   *
   * @param {LogLevel} level the level of this message
   * @param {...*} message parts of the message that will be combined
   */
  write(level, ...message) {
    if (this._level.isWanted(level)) {
      const logMessage = createLogMessage(this._moduleName, level, message, new Date());
      writeMessage(logMessage);
    }
  }

  /**
   * write a message if the logger's level is DEBUG
   *
   * @param {...*} message
   */
  debug(...message) {
    this.write(LOGLEVELS.DEBUG, ...message);

  }

  /**
   * write a message if the logger's level is DEBUG or INFO
   *
   * @param {...*} message
   */
  info(...message) {
    this.write(LOGLEVELS.INFO, ...message);
  }


  /**
   * write a message if the logger's level is DEBUG, INFO, or WARN
   *
   * @param {...*} message
   */warn(...message) {
    this.write(LOGLEVELS.WARN, ...message);
  }


  /**
   * write a message if the logger's level is ERROR or above
   *
   * @param {...*} message
   */
  error(...message) {
    this.write(LOGLEVELS.ERROR, ...message);
  }

  /**
   * write a message if the logger's level is ASSERT or above
   *
   * @param {...*} message
   */
  assert(...message) {
    this.write(LOGLEVELS.ASSERT, ...message);
  }

  /**
   * always write the message
   *
   * @param {...*} message
   */
  always(...message) {
    this.write(LOGLEVELS.ALWAYS, ...message);
  }

  /**
   * never write a message 
   *
   * @param {...*} message
   */
  never(...message) {
    // do nothing
  }
}

/**
 * Observes ENV for changes and updates the logger's
 * level.
 *
 * @param {*} logger
 */
function watchEnvLoggingProperties(logger) {
  createObserver(ENV.ChangeObservable, () => {
    const logLevel = LOGENV.getConfiguredLogLevel(logger.ModuleName);
    logger.setLevel(logLevel);
  });
}

/**
 * Create a new Logger
 *
 * @param {String} moduleName name of module. shows up on outupt and used to get level from env.
 * @param {LogLevel} [logLevel=null] override the configured log level
 * @returns {*}
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