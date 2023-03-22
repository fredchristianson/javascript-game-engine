/*
* Do not import anything from this module.
*
* this exists to prevent import cycles.
* DOMBase imports events.  
* and event listeners need the DOM functionality.
* Events don't need the DOM until after everything
* is loaded, so this solves the problem.
*/

let documentDOM = null;

function setDocumentDOM(dom) {
    documentDOM = dom;
}

function getDocumentDOM() {
    return documentDOM;
}

const DOMSymbol = Symbol("DOM");

function setDOMSymbol(dom) {
    dom._domSymbol = DOMSymbol;
}

function isDOM(dom) {
    return dom._domSymbol === DOMSymbol;
}

// all DOM HTMLElements are derived from this base type.
class DOMElementType {

}

export { setDocumentDOM, getDocumentDOM, isDOM, setDOMSymbol, DOMSymbol, DOMElementType };