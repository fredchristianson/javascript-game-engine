import { EntityBuilder } from '../entity/entity-builder.js';
import { EntityDefinition } from '../entity/entity-definition.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { CanvasModel } from './canvas-model.js';
import { HtmlModel } from './html-model.js';
import { MODEL_TYPE } from './model-type.js';
import { StyleModel } from './style-model.js';
import { TextModel } from './text-model.js';

class ModelDefinition extends EntityDefinition {
    constructor(modelType, builder) {
        super(ENTITY_TYPE.MODEL, builder);
        this._modelType = modelType;
    }


}

class HtmlModelDefinition extends ModelDefinition {
    constructor(builder) {
        super(MODEL_TYPE.HTML, builder);
        this._templateSelector = null;
        this._templateValueFunction = null;
    }

    templateValues(func) {
        this._templateValueFunction = func;
        return this;
    }

    templateSelector(sel) {
        this._templateSelector = sel;
        return this;
    }

    _createEntity() {
        const model = new HtmlModel();
        this._initializeEntity(model);
        model._templateSelector = this._templateSelector;
        model._templateValueFunction = this._templateValueFunction;
        return model;
    }
}

class CanvasModelDefinition extends ModelDefinition {
    constructor(builder) {
        super(MODEL_TYPE.CANVAS, builder);
    }

    _createEntity() {
        const model = new CanvasModel();
        this._initializeEntity(model);
        model._styles = this._styles;
        return model;
    }
}

class StyleModelDefinition extends ModelDefinition {
    constructor(builder) {
        super(MODEL_TYPE.STYLE, builder);
        this._styles = {};
    }


    backgroundColor(color) {
        this._styles['backgroundColor'] = color;
        return this;
    }
    _createEntity() {
        const model = new StyleModel();
        this._initializeEntity(model);
        model._styles = this._styles;
        return model;
    }
}

class TextModelDefinition extends ModelDefinition {
    constructor(builder) {
        super(MODEL_TYPE.TEXT, builder);
        this._text = null;
    }

    _createEntity() {
        const model = new TextModel();
        this._initializeEntity(model);
        model._text = this._text;
        return model;
    }

    text(t) {
        this._text = t;
        return this;
    }
}

class ModelBuilder extends EntityBuilder {
    constructor(gameManager) {
        super(gameManager);
    }

    defineHtmlModel() {
        const def = new HtmlModelDefinition(this);
        this._addDefinition(def);
        return def;
    }

    defineCanvasModel() {
        const def = new CanvasModelDefinition(this);
        this._addDefinition(def);
        return def;
    }

    defineStyleModel() {
        const def = new StyleModelDefinition(this);
        this._addDefinition(def);
        return def;
    }

    defineTextModel() {
        const def = new TextModelDefinition(this);
        this._addDefinition(def);
        return def;
    }

    _buildDefaultModels() {
        // none
    }

}

export { ModelBuilder };