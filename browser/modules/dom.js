import { ASSERT } from './assert.js';
import { DOM as dom } from './dom/document.js';
import { setDocumentDOM, DOMElementType } from './dom/dom-common.js';
import { HTML } from './dom/html.js';
import { HTMLTemplate } from './dom/html-template.js';
import { createLogger } from './logging.js';
const log = createLogger('DOM Module');
export const documentDOM = new dom.DocumentDOM();
setDocumentDOM(documentDOM);

export function ofSelector(parent) {
    const element = documentDOM.first(parent);
    if (element != null) {
        return new dom.PartialDOM(element);
    }
    return null;
}

export function ofText(text) {
    ASSERT.isType(text, 'string', 'ofText() requires a string parameter');
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const fragment = new dom.FragmentDOM();

    /*
     * the parsed doc has html and body elements we don't want
     * just keep children of the body
     */
    fragment.append(...doc.body.childNodes);
    return fragment;
}

export function ofScript(selector) {
    ASSERT.isType(selector, ['string', HTMLElement, DOMElementType], 'ofScript parameter must be a CSS selector or HTMLElement');
    const script = documentDOM.first(selector);
    if (script == null) {
        log.warn('ofScript did not find element ', selector);
        return null;
    }
    if (!script.isTag('script')) {
        log.error('ofScript element is not a <script>');
        return null;
    }
    return ofText(script.Text);

}

export function firstElement(selector) {
    return documentDOM.first(selector);
}


export function allElements(selector) {
    return documentDOM.all(selector);
}


export { HTML, HTMLTemplate };
export const DOM = {
    DocumentDOM: dom.DocumentDOM,
    PartialDOM: dom.PartialDOM,
    FragmentDOM: dom.FragmentDOM,
    firstElement,
    allElements,
    ofSelector,
    ofScript,
    ofText,
    documentDOM,
    HTML,
    HTMLTemplate
};