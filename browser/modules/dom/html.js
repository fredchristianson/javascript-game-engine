import { ASSERT } from '../assert.js';
import { STRING, TYPE } from '../helpers.js';
import { DOMElementType } from './dom-common.js';

class DOMElementValue {
    constructor() { }
    setValue(element) {
        ASSERT.fail(this, 'must implement setValue()');
    }

}

export class DOMTextValue extends DOMElementValue {
    constructor(text) {
        super();
        this._text = text ?? '';
    }

    setValue(element) {
        ASSERT.isType(element, DOMElement, 'setValue() required DOMElement');
        element.setText(this._text);
    }
}

export class DOMClassValue extends DOMElementValue {
    constructor(className) {
        super();
        this._className = className ?? '';
    }

    setValue(element) {
        ASSERT.isType(element, DOMElement, 'setValue() required DOMElement');
        element.addClass(this._className);
    }
}
export class DOMStyleValue extends DOMElementValue {
    constructor(styleName, styleValue) {
        super();
        ASSERT.isType(styleName, 'string', 'styleName must be a string');
        ASSERT.isType(styleValue, ['string', 'number'], 'styleValue must be a string or number');
        this._styleName = styleName;
        this._styleValue = styleValue;
    }

    setValue(element) {
        ASSERT.isType(element, DOMElement, 'setValue() required DOMElement');
        element.setStyle(this._styleName, this._styleValue);
    }
}
export class DOMRepeatValue extends DOMElementValue {
    constructor(tag, iterable) {
        super();
        ASSERT.isType(tag, 'string', 'DOMRepeatValue tag must be a string');
        ASSERT.isTrue(iterable[Symbol.iterator] != null, 'DOMRepeatValue iterable must implement Symbol.iterator');
        this._tag = tag;
        this._iterable = iterable;
    }

    setValue(element) {
        /*
         *  this does not work for elements of child windows.
         * ASSERT.isType(element, DOMElement, 'setValue() required DOMElement');
         */
        for (const value of this._iterable) {
            const newElement = DOMElement.create(this._tag);
            newElement.setText(value);
            element.append(newElement);
        }
    }
}

export class DOMElement extends DOMElementType {
    static create(tag) {
        const element = document.createElement(tag);
        return new DOMElement(element);
    }
    constructor(htmlElement = null) {
        super();
        this._htmlElement = htmlElement;
    }

    get HTMLElement() {
        return this._htmlElement;
    }

    getHTMLElement() {
        return this._htmlElement;
    }

    append(other) {
        if (TYPE.isType(other, DOMElement)) {
            this._htmlElement.append(other.HTMLElement);
        } else if (FUNCTION.hasMethod(other, 'querySelector')) {  // isType does't work for elements from child windows TYPE.isType(other, HTMLElement)) {
            this._htmlElement.append(other);
        } else {
            ASSERT.fail('append parameter must be an HTMLElement. Got', other);
        }
    }
    setValue(value) {
        if (TYPE.isType(value, DOMElementValue)) {
            value.setValue(this);
        } else {
            this.setText(value);
        }
    }
    addClass(className) {
        this._htmlElement.classList.add(className);
    }
    setStyle(name, value) {
        this._htmlElement.style[name] = value;
    }

    replaceChildren(...children) {
        this._htmlElement.replaceChildren(...children);
    }

    closest(selector) {
        ASSERT.isType(selector, 'string', 'closest parameter must be a string');
        return this._htmlElement.closest(selector);
    }

    matches(selector) {
        if (STRING.isString(selector)) {
            return this._htmlElement.matches(selector);
        } else if (FUNCTION.hasMethod(other, 'querySelector')) {  // isType does't work for elements from child windows TYPE.isType(other, HTMLElement)) {
            return selector === this._htmlElement;
        } else if (TYPE.isType(selector, DOMElement)) {
            return selector.HTMLElement === this._htmlElement;
        }
        ASSERT.fail('matches() parameter must be a string, HTMLElement, or DOMElement');
        return null; // won't be reached but makes eslint happy
    }

    contains(other) {
        if (STRING.isString(other)) {
            return this._htmlElement.querySelector(other) != null;
        } else if (FUNCTION.hasMethod(other, 'querySelector')) {  // isType does't work for elements from child windows TYPE.isType(other, HTMLElement)) {TYPE.isType(selector, HTMLElement)) {
            return this._htmlElement.contains(other);
        } else if (TYPE.isType(selector, DOMElement)) {
            return this._htmlElement.contains(other.HTMLElement);
        }
        ASSERT.fail('contains() parameter must be a string, HTMLElement, or DOMElement');
        return null; // won't be reached but makes eslint happy
    }

    setText(value) {
        this._htmlElement.innerText = value;
    }

    set Text(value) {
        this._htmlElement.innerText = value;
    }

    get Text() {
        return this._htmlElement.innerText;
    }

    isTag(tag) {
        ASSERT.isType(tag, 'string', 'isTag requires a string parameters');
        return STRING.isEqualNoCase(tag, this._htmlElement.tagName);
    }

    removeAllChildren() {
        this._htmlElement.replaceChildren();
    }

}

export class InputElement extends DOMElement {
    constructor(htmlElement = null) {
        super(htmlElement);
    }
}

export class SelectElement extends InputElement {
    constructor(htmlElement) {
        super(htmlElement);
    }
}
export class TextAreaElement extends InputElement {
    constructor(htmlElement) {
        super(htmlElement);
    }
}

/*
 * create a DOMElement with an HTMLElement that is not in the DOM.
 * all methods work but have no effect.
 */
export class NullElement extends DOMElement {
    constructor() {
        super(document.createElement('div'));
    }

}


export function domElementOf(htmlElement) {
    if (TYPE.isType(htmlElement, DOMElement)) {
        // already have DOMElement
        return htmlElement;
    }
    const tag = htmlElement.tagName;
    if (['input', 'textarea'].includes(tag)) {
        return new InputElement(htmlElement);
    } else if ('SELECT' == tag) {
        return new SelectElement(htmlElement);
    } else if ('TEXTAREA' == tag) {
        return new TextAreaElement(htmlElement);
    } else {
        return new DOMElement(htmlElement);
    }
}


export const HTML = {
    DOMElement,
    domElementOf,
    classValue: function (className) {
        return new DOMClassValue(className);
    },
    styleValue: function (styleName, styleValue) {
        return new DOMStyleValue(styleName, styleValue);
    },
    textValue: function (text) {
        return new DOMTextValue(text);
    },
    repeatValue: function (tag, iterable) {
        return new DOMRepeatValue(tag, iterable);
    },

    DOMClassValue,
    DOMElementValue,
    DOMStyleValue,
    DOMTextValue,
    DOMRepeatValue
};