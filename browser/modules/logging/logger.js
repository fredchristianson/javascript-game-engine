import { LOGLEVELS, LogLevel } from './log-level.js';
import { STRING, TYPE } from '../helpers.js';
import { ArgumentException } from '../exception.js';
import { createLogMessage } from './log-message.js';
import { writeMessage } from './log-writer.js';
import { ASSERT } from '../assert.js';
import { LOGENV } from './logging-env.js';

class Logger {
  constructor(moduleName, level) {
    if (!STRING.isString(moduleName)) {
      throw new ArgumentException('moduleName must be a string');
    }
    if (!TYPE.isType(level, LogLevel)) {
      if (TYPE.isType(level, Promise)) {
        // level is a Promise.  Set level to INFO for now
        // and set to the correct level when the promise finishes.
        this._level = LOGLEVELS.INFO;
        level.then((result) => {
          this._level = result;
        });
        return;
      }
      throw new ArgumentException('level must be type LogLevel');
    } else {
      this._moduleName = moduleName;
      this._level = level;
    }
  }

  write(level, ...message) {
    if (this._level.isWanted(level)) {
      const logMessage = createLogMessage(this._moduleName, level, message, new Date());
      writeMessage(logMessage);
    }
  }

  debug(...message) {
    this.write(LOGLEVELS.DEBUG, ...message);

  }

  info(...message) {
    this.write(LOGLEVELS.INFO, ...message);
  }

  warn(...message) {
    this.write(LOGLEVELS.WARN, ...message);
  }

  error(...message) {
    this.write(LOGLEVELS.ERROR, ...message);
  }

  assert(...message) {
    this.write(LOGLEVELS.ASSERT, ...message);
  }

  always(...message) {
    this.write(LOGLEVELS.ALWAYS, ...message);
  }

  never(...message) {
    // do nothing
  }
}

/**
 * Create a new Logger
 *
 * @private
 * @param {String} moduleName name of module. shows up on outupt and used to get level from env.
 * @param {LogLevel} [logLevel=null] override the configured log level
 * @returns {*}
 */
function createLogger(moduleName, logLevel = null) {
  ASSERT.isFalse(STRING.isBlank(moduleName), "createLogger module name must be a string");
  ASSERT.isTypeOrNull(logLevel, "logLevel must be a LogLevel or null");
  if (logLevel === null) {
    logLevel = LOGENV.getConfiguredLogLevel(moduleName);
  }
  return new Logger(moduleName, logLevel);
}

export { Logger, createLogger };