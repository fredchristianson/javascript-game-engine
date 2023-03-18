import { LogMessage } from "./log-message.js";
import { ASSERT } from "../assert.js";
import { STRING, TYPE } from "../helpers.js";
import { LOGLEVELS } from "./log-level.js";

// formatterId is used to cache formatted messages.
// multiple writers may use the same formatter and shouldn't
// each need to format .
let nextFormatterId = 1;

class FormatComponent {
    constructor(minLength = 0, maxLength = 250) {
        this._minLength = minLength;
        this._maxLength = maxLength;
    }

    get MinLength() { return this._minLength; }
    get MaxLength() { return this._maxLength; }

    set MinLength(len) { this._minLength = len; }
    set MaxLength(len) { this._maxLength = len; }
    fixLength(message) {
        if (message.length < this._minLength) {
            return message + ' '.repeat(this._minLength - message.length);
        } else if (message.length > this._maxLength) {
            return message.substring(0, this._maxLength);
        }
        return message;
    }

    format(value) {
        return this.fixLength(this._format(value));
    }
}

class DateFormatComponent extends FormatComponent {
    constructor() {
        super(11, 11);
    }
    _format(logMessage) {
        return logMessage.Time.toLocaleDateString();
    }
}

class TimeFormatComponent extends FormatComponent {
    constructor() {
        super(10, 15);
    }
    _format(logMessage) {
        return logMessage.Time.toLocaleTimeString();
    }
}

class ModuleNameFormatComponent extends FormatComponent {
    constructor() {
        super(10, 20);
    }
    _format(logMessage) {
        return logMessage.ModuleName;
    }
}


class LevelFormatComponent extends FormatComponent {
    constructor() {
        super();
    }
    _format(logMessage) {
        return logMessage.Level.Name;
    }
}

class TextFormatComponent extends FormatComponent {
    constructor() {
        super();
    }
    _format(logMessage) {
        let parts = logMessage.Parts;
        let text = parts
            .filter(part => { return !TYPE.isType(part, Error); })
            .map(STRING.toString).join(' ');
        return text;
    }


}

class StringFormatComponent extends FormatComponent {
    constructor(value) {
        super();
        this._text = value;
    }
    _format(_logMessage) {
        return this._text;
    }
}

export class LogFormatter {
    constructor(components = null) {
        this._id = nextFormatterId++;
        this._components = components ?? [];
    }

    get ID() { return this._id; }

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
            .map(component => { return component.format(logMessage); });
        return parts.join('');
    }

}

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
        const levelClass = [`log`, `level-${logMessage.Level.Name.toLowerCase()}`];
        const element = this.createElement(null, "div", levelClass, null);
        this.createElement(element, "span", "time", this._timeFormatter.format(logMessage));
        this.createElement(element, "span", "date", this._dateFormatter.format(logMessage));
        this.createElement(element, "span", "level", this._levelFormatter.format(logMessage));
        this.createElement(element, "span", "module", this._moduleFormatter.format(logMessage));
        let text = this._textFormatter.format(logMessage);
        let stack = logMessage.StackTrace;
        if (!STRING.isEmpty(stack)) {
            text += "\n" + stack;
        }
        this.createElement(element, "span", "message", text);

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