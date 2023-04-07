import { EntityBuilder } from '../entity/entity-builder.js';
import { EntityDefinition } from '../entity/entity-definition.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { CanvasModel } from './canvas-model.js';
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
        this._valueFunction = null;
    }

    templateValues(func) {
        this._valueFunction = func;
        return this;
    }

    templateSelector(sel) {
        this._templateSelector = sel;
        return this;
    }

    _createEntity() {
        const model = new HtmlModel();
        model._templateSelector = this._templateSelector;
        model._valueFunction = this._valueFunction;
        return model;
    }
}

class CanvasModelDefinition extends ModelDefinition {
    constructor(builder) {
        super(MODEL_TYPE.CANVAS, builder);
    }

    _createEntity() {
        const model = new CanvasModel();
        return model;
    }
}

class ModelBuilder extends EntityBuilder {
    constructor(gameManager) {
        super(gameManager);
    }

    defineHtmlModel() {
        return new HtmlModelDefinition(this);
    }

    defineCanvasModel() {
        return new CanvasModelDefinition(this);
    }

}

export { ModelBuilder };