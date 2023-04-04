import { ASSERT } from '../../modules/assert.js';
import { EntityBuilder } from '../entity/entity-builder.js';
import { EntityDefinition } from '../entity/entity-definition.js';
import { HtmlTemplateRenderer } from './html-template-render.js';
import { RENDERER_TYPE } from './renderer-type.js';

class RendererDefinition extends EntityDefinition {
    constructor(rendererType, builder) {
        super();
        this._rendererType = rendererType;
        this._builder = builder;
        this._templateSelector = null;
    }

    rendererType(type) {
        this._rendererType = type;
        return this;
    }

    templateSelector(selector) {
        if (this._rendererType == RENDERER_TYPE.UNKNOWN) {
            this.rendererType(RENDERER_TYPE.HTML_TEMPLATE);
        }
        this._templateSelector = selector;
        return this;
    }

    // eslint-disable-next-line consistent-return
    build() {
        if (this._rendererType == RENDERER_TYPE.HTML_TEMPLATE) {
            return new HtmlTemplateRenderer(this._templateSelector);
        } else if (this._rendererType == RENDERER_TYPE.HTML) {
            return new HtmlTemplateRenderer();
        }
        ASSERT.fail('RendererDefinition requires a RENDERER_TYPE');

    }
}

class RendererBuilder extends EntityBuilder {
    constructor(gameManager) {
        super(gameManager);
    }

    defineRenderer() {
        const def = new RendererDefinition(RENDERER_TYPE.UNKNOWN, this);
        this._addDefinition(def);
        return def;

    }


}

export { RendererBuilder };