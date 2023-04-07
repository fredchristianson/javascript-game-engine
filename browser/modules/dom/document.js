import { DOMElement, HTML } from './html.js';
import { ASSERT } from '../assert.js';
import { TYPE, UTIL, STRING, FUNCTION, OBJECT } from '../helpers.js';
import { createLogger } from '../logging/logger.js';
import { DOMElementType, setDOMSymbol } from './dom-common.js';
import { EventGroup } from '../event/event-group.js';
import { EventListener } from '../event/event-listener.js';
import { ArgumentException } from '../exception.js';
import { resourceManager } from '../net.js';
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

class DOMDocumentBase extends DOMElement {
    constructor(htmlElement) {
        super(htmlElement);
        setDOMSymbol(this);

        this._eventGroup = new EventGroup();
    }


    addListener(listener) {
        ASSERT.isType(listener, EventListener);
        this._eventGroup.add(listener);
    }

    clone() {
        const clone = this._htmlElement.cloneNode(true);
        const dom = new FragmentDOM(clone);
        return dom;
    }
    removeListeners() {
        this._eventGroup.removeAll();
    }

    createScriptTemplate(scriptSelector) {
        const element = this.first(selector);
        if (UTIL.isNullish(element)) {
            log.warn('attempt to create childDOM but selector not found', selector);
            return null;
        } else if (element.isTag('script')) {
            return this.parseString(element.Text);
        } else {
            log.warn('element is not a <script>', selector);
            return null;
        }
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

        if (UTIL.isNullish(values)) {
            return;
        }
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

    /**
     * append one or more children.  return the first new child node
     *
     * @param {...{}} children
     * @returns {*}
     */
    append(...children) {
        let appended = null;
        for (const child of children) {
            if (TYPE.isType(child, HTMLElement)) {
                this._htmlElement.append(child);
                appended = child;
            } else if (TYPE.isType(child, DOMDocumentBase)) {
                const nodes = [...child.getChildNodes()];
                this._htmlElement.append(...nodes);
                appended = nodes[0];
            } else if (TYPE.isType(child, DOMElementType)) {
                this._htmlElement.append(child.HTMLElement);
                appended = child.HTMLElement;
            } else if (STRING.isString(child)) {
                const parsedDOM = this.parseString(child);
                appended = this.append(parsedDOM);
            }
        }
        return HTML.domElementOf(appended);
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


    async load(...urls) {
        ASSERT.isArray(urls, 'load requires one or more urls');
        for (const url of urls) {
            // eslint-disable-next-line no-await-in-loop
            const response = await resourceManager.getText(url);
            if (!OBJECT.isObject(response) || !STRING.isString(response.text)) {
                log.error('failed to get text from ', url);
            }
            if (response.isCSS) {
                this.addStyle(response.text);
            }
            if (response.isHTML) {
                this.append(response.text);
            }
        }
    }

}

export class DocumentDOM extends DOMDocumentBase {
    constructor(doc = document) {
        super(doc);
    }

    getChildNodes() {
        /*
         * ignore text nodes.  only care about HTML nodes
         * templates may have whitespace before or after
         */
        const allNodes = this._htmlElement.children;
        const body = allNodes[0]?.querySelector('body');
        if (body != null) {
            // return all nodes, including text
            return body.childNodes;
        } else {
            return allNodes;
        }
    }

}

export class PartialDOM extends DOMDocumentBase {
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

    getChildNodes() {
        if (this._htmlElement.tagName == 'BODY') {
            return this._htmlElement.childNodes;
        }
        return [this._htmlElement];
    }

    clone() {
        const clone = this._htmlElement.cloneNode(true);
        const dom = new FragmentDOM(clone);
        return dom;
    }

}

export class ShadowDOM extends DOMDocumentBase {
    constructor(shadowHostElement) {
        super(createShadowRoot(shadowHostElement));
    }

    clone() {
        const clone = this._htmlElement.cloneNode(true);
        const dom = new FragmentDOM(clone);
        return dom;
    }

}

export const DOM = {
    DocumentDOM,
    PartialDOM,
    FragmentDOM,
    ShadowDOM
};