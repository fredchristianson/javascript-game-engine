import { HtmlModel } from '../model/html-model.js';
import { Renderer } from './renderer.js';

class HtmlRenderer extends Renderer {
    constructor(gameRender, parentElement, entity) {
        super();
        this._gameRenderer = gameRender;
        this._parentElement = parentElement;
        this._entity = entity;
        this._element = null;
        this._attach();
        this._getTemplate();
        this._createChildRenderers();
        entity._rendererData = {
            renderer: this,
            element: this._element
        }
    }

    _createChildRenderers() {
        if (this._entity.Children && this._element) {
            this._entity.Children.map((child) => {
                return new HtmlRenderer(this._gameRenderer, this._element, child);
            });
        } else {
            this._childRenderers = [];
        }
    }

    _getTemplate() {
        if (this._entity.TemplateSelector) {
            const model = this._getHtmlModel();
            const data = this._entity.Data;
            const template = this._gameRenderer._getTemplate(this._entity.TemplateSelector);
            if (template != null && model != null && data != null) {
                template.setValues(model.getValues(data));
            }
            this._element = this._parentElement.append(template);

        }
    }

    /**
     * Return the entity's first HTML model.  An entity may
     * have different models (canvas vs html) and eventually
     * will need to filter by other factors (e.g. flat vs 3d)
     *
     * @returns {HtmlModel} the first HTML model or NULL if not found
     */
    _getHtmlModel() {
        if (this._entity.Models) {
            return this._entity.Models.find((model) => {
                return model instanceof HtmlModel;
            });
        }
        return null;
    }
    _attach() {
        if (this._entity.AttachSelector) {
            this._element = this._parentElement.first(this._entity.AttachSelector);
        }
    }

    render(...args) {
        if (this._entity.beforeRender) {
            this._entity.beforeRender();
        }
    }
}

export { HtmlRenderer };