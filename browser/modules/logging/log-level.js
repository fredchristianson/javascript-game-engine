/**
 * @fileoverview
 * Logging levels have a name and a value.
 * in most cases, a message level value must be less than
 * a Logger level and a LoggerOutput level to be shown.
 * The exception is LogLevel ALWAYS (-1).  A message of this value is always written (unless compared to LOG_LEVEL_NEVER).
 * LogLevel NEVER (-2) messages are never written.
 */


import { STRING, TYPE, NUMBER } from '../helpers.js';
import { ArgumentException } from '../exception.js';


/**
 * @module Logging
 * @private
 */


const LEVEL_DEBUG_VALUE = 100;
const LEVEL_INFO_VALUE = 80;
const LEVEL_WARN_VALUE = 60;
const LEVEL_ERROR_VALUE = 40;
const LEVEL_ASSERT_VALUE = 20;
const LEVEL_ALWAYS_VALUE = -1;
const LEVEL_NEVER_VALUE = -2;

export class LogLevel {
  constructor(name, value) {
    if (STRING.isEmpty(name)) {
      throw new ArgumentException('LogLevel requires name');
    }
    if (!NUMBER.isNumber(value)) {
      throw new ArgumentException('LogLevel value must be a number');
    }

    this._name = name ?? 'unknown';
    this._value = value ?? 0;
  }

  get isError() {
    return this.Value == LEVEL_ERROR_VALUE || this.Value == LEVEL_ASSERT_VALUE;
  }

  get isWarning() {
    return this.Value == LEVEL_WARN_VALUE;
  }

  get Name() {
    return this._name;
  }
  get Value() {
    return this._value;
  }

  isWanted(messageLevel) {
    if (!TYPE.isType(messageLevel, LogLevel)) {
      throw new ArgumentException('isWanted requires a LogLevel');
    }
    if (this._value == LEVEL_NEVER_VALUE || messageLevel.Value == LEVEL_NEVER_VALUE) {
      return false;
    }

    if (this._value == LEVEL_ALWAYS_VALUE || messageLevel.Value == LEVEL_ALWAYS_VALUE) {
      return true;
    } else {
      return this._value >= messageLevel.Value;
    }
  }
}

/**
 * @namespace LOGLEVELS 
 */

const LOGLEVELS = {
  /** DEBUG*/
  DEBUG: new LogLevel('DEBUG', LEVEL_DEBUG_VALUE),
  /** INFO*/
  INFO: new LogLevel('INFO', LEVEL_INFO_VALUE),
  /** WARN */
  WARN: new LogLevel('WARN', LEVEL_WARN_VALUE),
  /** ERROR*/
  ERROR: new LogLevel('ERROR', LEVEL_ERROR_VALUE),
  /** ASSERT is intended for ASSERT.test() errors*/
  ASSERT: new LogLevel('ASSERT', LEVEL_ASSERT_VALUE),
  /** ALWAYS is mainly for temporarily changing messages without needing to enable DEBUG for the entire module*/
  ALWAYS: new LogLevel('ALWAYS', LEVEL_ALWAYS_VALUE),
  /** NEVER is an easy to to turn logging off.  search/replace ALWAYS<->NEVER can enable/disable a set of messages */
  NEVER: new LogLevel('NEVER', LEVEL_NEVER_VALUE),
  /**
   * get returns a LOGLEVELS value by name.
   * 
   * ```
   * get('debug')
   * ```
   * returns LOGLEVELS.DEBUG;
   * 
   * @param {String} name is the name of the level to get.  Name is not case sensitive. "debug" or "DEBUG" are the same.
   */
  get: function (name) {
    if (STRING.isEqualNoCase(name, 'DEBUG')) {
      return LOGLEVELS.DEBUG;
    } else if (STRING.isEqualNoCase(name, 'INFO')) {
      return LOGLEVELS.INFO;
    } else if (STRING.isEqualNoCase(name, 'WARN')) {
      return LOGLEVELS.WARN;
    } else if (STRING.isEqualNoCase(name, 'ERROR')) {
      return LOGLEVELS.ERROR;
    } else if (STRING.isEqualNoCase(name, 'ASSERT')) {
      return LOGLEVELS.ASSERT;
    } else if (STRING.isEqualNoCase(name, 'ALWAYS')) {
      return LOGLEVELS.ALWAYS;
    } else if (STRING.isEqualNoCase(name, 'NEVER')) {
      return LOGLEVELS.NEVER;
    }
    return null;
  },
};

export { LOGLEVELS };