/** 
 *  @fileOverview These classes converts a LogMessage into the format 
 * a LogWriter outputs.  It includes implementations
 *
 * - DefaultFormatter to output a string 
 * - HTMLFormatter to create a <div> with <spans> for each component
 * - JSONFormatter to create a JSON object
 */

import { LogMessage } from './log-message.js';
import { ASSERT } from '../assert.js';
import { STRING, TYPE } from '../helpers.js';
import { LOGLEVELS } from './log-level.js';

/** @module Logging */


/*
 * formatterId is used to cache formatted messages.
 * multiple writers may use the same formatter and shouldn't
 * each need to format .
 */
let nextFormatterId = 1;

/**
 * Base class to format part of a log message (time, date, module, etc)
 */
class FormatComponent {
    /**
     * 
     * @param {*} minLength pad with spaces if length is less than this
     * @param {*} maxLength truncate to this length
     */
    constructor(minLength = 0, maxLength = 250) {
        this._minLength = minLength;
        this._maxLength = maxLength;
    }

    get MinLength() {
        return this._minLength;
    }
    get MaxLength() {
        return this._maxLength;
    }

    set MinLength(len) {
        this._minLength = len;
    }
    set MaxLength(len) {
        this._maxLength = len;
    }

    fixLength(message) {
        if (message.length < this._minLength) {
            return message + ' '.repeat(this._minLength - message.length);
        } else if (message.length > this._maxLength) {
            return message.substring(0, this._maxLength);
        }
        return message;
    }

    format(logMessage) {
        return this.fixLength(this._format(logMessage));
    }

    /**
     * derived classes override this to write the component.
     *
     * @param {*} _logMessage - the entire LogMessage.  Components use the part(s) they need
     */
    _format(_logMessage) {
        throw new Error('derived class must implement _format(logMessage)');
    }
}

/**
 * Format LogMessage.Time  as a date
 *
 * @extends {FormatComponent}
 */
class DateFormatComponent extends FormatComponent {
    constructor() {
        super(11, 11); // always 11 characters (min&max)
    }
    _format(logMessage) {
        return logMessage.Time.toLocaleDateString();
    }
}

/**
 * Format LogMessage.Time  as a time
 *
 * @extends {FormatComponent}
 */
class TimeFormatComponent extends FormatComponent {
    constructor() {
        super(10, 15); // 10-15 characters
    }
    _format(logMessage) {
        return logMessage.Time.toLocaleTimeString();
    }
}

/**
 * Format the module name.  The minimum with changes to match the longest
 * module name seen.
 *
 * @extends {FormatComponent}
 */
class ModuleNameFormatComponent extends FormatComponent {
    constructor() {
        super(10, 30);
    }
    _format(logMessage) {
        return logMessage.ModuleName;
    }
}


/**
 * write the descriptive name of the Level ("DEBUG","WARN",etc)
 *
 * @extends {FormatComponent}
 */
class LevelFormatComponent extends FormatComponent {
    constructor() {
        super();
    }
    _format(logMessage) {
        const len = logMessage.Level.Name.length;
        if (len > this.MinLength) {
            this.MinLength = len;
        }
        return logMessage.Level.Name;
    }
}

/**
 * Format the message parts of the LogMessage.  This is an 
 * array of objects.  They are all converted to strings then joined.
 *
 */
class TextFormatComponent extends FormatComponent {
    constructor() {
        super();
    }
    _format(logMessage) {
        const parts = logMessage.Parts;
        const text = parts
            .filter((part) => {
                return !TYPE.isType(part, Error);
            })
            .map(STRING.toString)
            .join(' ');
        return text;
    }


}

/**
 * A constant string value inserted into the formatted message.  Usually a separator (":","|",etc)
 *
 */
class StringFormatComponent extends FormatComponent {
    constructor(value) {
        super();
        this._text = value;
    }
    _format(_logMessage) {
        return this._text;
    }
}

/**
 * The base class to format a LogMessage.  The result may be a displayable 
 * string, or JSON, or anything else.
 *
 */
export class LogFormatter {
    constructor(components = null) {
        this._id = nextFormatterId++;
        this._components = components ?? [];
    }

    get ID() {
        return this._id;
    }

    /**
     * Handles all of the common functionality of formatting a message.  
     * Formatted messages are cached, so foratting is not run twice
     * if multiple LogWriters use the same LogFormatter.
     *
     * @param {LogMessage} logMessage the LogMessage to formate
     * @returns {*}
     */
    format(logMessage) {
        ASSERT.isType(logMessage, LogMessage);
        let formattedMessage = logMessage.getFormatByFormatID(this._id);
        if (STRING.isEmpty(formattedMessage)) {
            formattedMessage = this._format(logMessage);
            logMessage.setFormattedMessage(this._id, formattedMessage);
        }
        if (logMessage.StackTrace != null) {
            return `${formattedMessage}\n${logMessage.StackTrace}`;
        }
        return formattedMessage;
    }

    _format(logMessage) {
        const parts = this._components
            .map((component) => {
                return component.format(logMessage);
            });
        return parts.join('');
    }

}

/**
 * A default log message format
 *  DATE TIME - LEVEL: MODULE: message
 *
 * @extends {LogFormatter}
 */
export class DefaultFormatter extends LogFormatter {
    constructor() {
        super([new DateFormatComponent(),
        new TimeFormatComponent(),
        new StringFormatComponent(' - '),
        new LevelFormatComponent(),
        new StringFormatComponent(' : '),
        new ModuleNameFormatComponent(),
        new StringFormatComponent(' : '),
        new TextFormatComponent()]);
    }
}

/**
 * Creates a JSON object of the message parts
 *
 * @extends {LogFormatter}
 */
export class JSONFormatter extends LogFormatter {
    constructor() {
        super();
        this._textFormatter = new TextFormatComponent(0, 1000);
    }
    format(logMessage) {
        return {
            time: logMessage.Time.toISOString(),
            level: { name: logMessage.Level.Name, value: logMessage.Level.Value },
            moduleName: logMessage.ModuleName,
            message: this._textFormatter.format(logMessage),
            stack: logMessage.StackTrace
        };
    }

    parse(jsonMessage) {
        return new LogMessage(jsonMessage.moduleName,
            LOGLEVELS.get(jsonMessage.level.name),
            jsonMessage.message, new Date(jsonMessage.time), jsonMessage.stack);
    }
}

/**
 * Format the message to be inserted into a DOM element.  The result is a div HTMLElement
 * with a span for each component.
 *
 * @extends {LogFormatter}
 */
export class HTMLFormatter extends LogFormatter {
    constructor() {
        super();
        this._timeFormatter = new TimeFormatComponent();
        this._dateFormatter = new DateFormatComponent();
        this._levelFormatter = new LevelFormatComponent();
        this._moduleFormatter = new ModuleNameFormatComponent();
        this._textFormatter = new TextFormatComponent();
    }
    format(logMessage) {
        const levelClass = ['log', `level-${logMessage.Level.Name.toLowerCase()}`];
        const element = this.createElement(null, 'div', levelClass, null);
        this.createElement(element, 'span', 'time', this._timeFormatter.format(logMessage));
        this.createElement(element, 'span', 'date', this._dateFormatter.format(logMessage));
        this.createElement(element, 'span', 'level', this._levelFormatter.format(logMessage));
        this.createElement(element, 'span', 'module', this._moduleFormatter.format(logMessage));
        let text = this._textFormatter.format(logMessage);
        const stack = logMessage.StackTrace;
        if (!STRING.isEmpty(stack)) {
            text += `\n${stack}`;
        }
        this.createElement(element, 'span', 'message', text);

        return element;
    }

    createElement(parent, tag, classList, text) {
        const element = document.createElement(tag);
        if (STRING.isString(classList)) {
            element.classList.add(classList);
        } else if (Array.isArray(classList)) {
            element.classList.add(...classList);
        }
        if (STRING.isString(text)) {
            element.innerText = text;
        }
        if (parent != null) {
            parent.appendChild(element);
        }
        return element;
    }
}

export const DEFAULT_FORMATTER = new DefaultFormatter();