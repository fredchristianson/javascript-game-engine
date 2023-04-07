import { EntityBuilder } from '../entity/entity-builder.js';
import { EntityDefinition } from '../entity/entity-definition.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { CanvasModel } from './canvas-model.js';
import { HtmlModel } from './html-model.js';
import { MODEL_TYPE } from './model-type.js';

class ModelDefinition extends EntityDefinition {
    constructor(modelType, builder) {
        super(ENTITY_TYPE.MODEL, builder);
        this._modelType = modelType;
    }


    _createModel() {
        let model = null;
        switch (this._modelType) {
            case MODEL_TYPE.HTML:
                model = new HtmlModel();
                break;
            case MODEL_TYPE.CANVAS:
                model = new CANVASModel();
                break;
        }
        return model;
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
        return model;
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

}

export { ModelBuilder };