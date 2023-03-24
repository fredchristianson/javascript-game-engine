import { HTML, NullElement } from './html.js';
import { ASSERT } from '../assert.js';
import { TYPE, UTIL, STRING, FUNCTION } from '../helpers.js';
import { createLogger } from '../logging.js';
import { DOMElementType, setDOMSymbol } from './dom-common.js';
import { EventGroup } from '../event/event-group.js';
import { EventListener } from '../event/event-listener.js';
import { ArgumentException } from '../exception.js';
const log = createLogger('DOM');

function createShadowRoot(shadowParent) {
    let hostParent = null;
    if (shadowParent instanceof HTMLElement) {
        hostParent = shadowParent;
    } else if (shadowParent instanceof DOMElementType) {
        hostParent = shadowParent.HTMLElement;
    } else if (FUNCTION.hasMethod(shadowParent, 'attachShadow')) {
        // elements from other windows don't match HTMLElement in this document
        hostParent = shadowParent;
    }
    if (hostParent != null) {
        // clear children.  removes previous shadow root if there is one
        hostParent.replaceChildren();
        const parentElement = hostParent.ownerDocument.createElement('div');
        parentElement.classList.add('shadow-host');
        parentElement.dataset['isShadow'] = 'true';
        hostParent.appendChild(parentElement);
        const shadow = parentElement.attachShadow({ mode: 'open' });
        return shadow;
    }
    throw new ArgumentException('createShadowRoot needs and HTMLElement or DOMElement parameter');
}

function isHTMLElement(value) {
    /*
     * elements from other windows do not match by type.
     * treat anything with a querySelector as an element
     */
    return value == document ||
        FUNCTION.hasMethod(value, 'querySelector');
    //return TYPE.isType(root, [HTMLElement, HTMLHtmlElement, Document, DocumentFragment]) || root == document
}

class DOMBase {
    constructor(root) {
        ASSERT.notNull(root, 'DOM constructor must have an HTMLElement parameter');
        setDOMSymbol(this);
        if (isHTMLElement(root)) {
            this._htmlElement = root;
            this._root = new HTML.DOMElement(root);
        } else {
            this._root = root;
            this._htmlElement = root.getHTMLElement();
        }
        this._eventGroup = new EventGroup();
    }

    get Root() {
        return this._root;
    }
    get DOMElement() {
        return this._root;
    }
    addListener(listener) {
        ASSERT.isType(listener, EventListener);
        this._eventGroup.add(listener);
    }

    removeListeners() {
        this._eventGroup.removeAll();
    }

    first(selector) {
        ASSERT.notNull(selector, 'DOM.first parameter must not be null');
        if (TYPE.isType(selector, DOMElementType)) {
            return selector;
        }
        if (TYPE.isType(selector, HTMLElement)) {
            return HTML.domElementOf(selector);
        }
        log.debug('Find first element: ', selector);
        const htmlElement = this._htmlElement.querySelector(selector);
        if (htmlElement === null) {
            log.debug('selector ', selector, ' not found');
            return null;
        }
        return HTML.domElementOf(htmlElement);

    }

    firstOrIgnore(selector) {
        const first = this.first(selector);
        return first ?? new NullElement();

    }

    all(selector) {
        ASSERT.notNull(selector, 'DOM.all parameter must not be null');
        log.debug('Find first element: ', selector);
        if (TYPE.isType(selector, DOMElementType)) {
            return [selector];
        }
        if (TYPE.isType(selector, HTMLElement)) {
            return [HTML.elementOf(selector)];
        }
        const htmlElements = this._htmlElement.querySelectorAll(selector);
        if (htmlElements === null) {
            log.debug('selector ', selector, ' not found');
            return [];
        }
        return [...htmlElements].map((htmlElement) => {
            return HTML.domElementOf(htmlElement);
        });

    }

    childDOM(selector) {
        const element = this.first(selector);
        if (UTIL.isNullish(element)) {
            log.warn('attempt to create childDOM but selector not found', selector);
            return null;
        } else if (element.isTag('script')) {
            return this.parseString(element.Text);
        } else {
            return new PartialDOM(element);
        }

    }

    shadowDOM(selector) {
        const element = this.first(selector);
        if (UTIL.isNullish(element)) {
            log.warn('attempt to create shadowDOM but selector not found', selector);
            return null;
        }
        return new ShadowDOM(element);
    }

    setValues(values) {
        /*
         * todo: create different types of values.  
         *  currently only sets element innerText. need attributes, values, class,etc
         */
        ASSERT.isType(values, Object, 'setValues requires an object');
        for (const [selector, value] of Object.entries(values)) {
            const elements = this.all(selector);
            const valueArray = UTIL.toArray(value);
            for (const value of valueArray) {
                for (const element of elements) {
                    element.setValue(value);
                }
            }
        }
    }

    append(...children) {
        for (const child of children) {
            if (TYPE.isType(child, HTMLElement)) {
                this._htmlElement.append(child);
            } else if (TYPE.isType(child, DOMElementType)) {
                this._htmlElement.append(child.HTMLElement);
            } else if (TYPE.isType(child, DOMBase)) {
                this._htmlElement.append(...child.getChildNodes());
            } else if (STRING.isString(child)) {
                const parsedDOM = this.parseString(child);
                this.append(parsedDOM);
            }
        }
    }

    parseString(html) {
        ASSERT.isString(html, 'parseString requires a string parameter');
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return new FragmentDOM(doc);
        } catch (ex) {
            log.error('failed to parse html ', ex);
            throw ex;
        }
    }

    getChildNodes() {
        return this._htmlElement;
    }

    addStyle(style) {
        ASSERT.notNull(style, 'addStyle requires a non-null parameter');
        if (STRING.isString(style)) {
            const styleElement = document.createElement('style');
            styleElement.textContent = style;
            this.append(styleElement);
        } else {
            ASSERT.false('unknown style type ', style);
        }
    }

    removeAllChildren() {
        this._root.removeAllChildren();
    }

}

export class DocumentDOM extends DOMBase {
    constructor(doc = document) {
        super(doc);
    }

    getChildNodes() {
        return this._htmlElement.childNodes;
    }

}

export class PartialDOM extends DOMBase {
    constructor(root) {
        super(root);
    }

    hide() {
        this._root.setStyle('display', 'none');
    }

    show(display = 'block') {
        this._root.setStyle('display', display);
    }
}

export class FragmentDOM extends DocumentDOM {
    constructor(doc) {
        super(doc ?? document.createDocumentFragment());
    }

    clone() {
        const clone = this._htmlElement.cloneNode(true);
        const dom = new FragmentDOM(clone);
        return dom;
    }

}

export class ShadowDOM extends DOMBase {
    constructor(shadowHostElement) {
        super(createShadowRoot(shadowHostElement));
    }

    clone() {
        const clone = this._htmlElement.cloneNode(true);
        const dom = new FragmentDOM(clone);
        return dom;
    }

}

export const DOM = { DocumentDOM, PartialDOM, FragmentDOM };