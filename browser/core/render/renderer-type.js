import { Enum } from '../../modules/helpers.js';

class RendererType extends Enum {
    constructor(name) {
        super(name);
    }
}

const RENDERER_TYPE = {
    UNKNOWN: new RendererType('unknown'),
    HTML: new RendererType('html'),
    HTML_TEMPLATE: new RendererType('html-template')
};

export { RENDERER_TYPE };