
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from './entity-type.js';
import { Entity } from './entity.js';

const log = createLogger('Layer');

class VisibleEntity extends Entity {
    constructor(type = ENTITY_TYPE.UNKNOWN) {
        super(type);
        this._templateSelector = null;
        this._attachSelector = null;
        this._models = null;
        this._modelIds = null;
        this._beforeRender = null;
    }

    beforeRender() {
        if (this._beforeRender) {
            for (const handler of this._beforeRender) {
                handler.call(this);
            }
        }
    }

    set Kind(kind) {
        this._kind = kind;
    }
    get Kind() {
        return this._kind;
    }


    get Children() {
        return this._children;
    }

    get AttachSelector() {
        return this._attachSelector;
    }
    set Data(data) {
        this._data = data;
    }
    get Data() {
        return this._data;
    }

    set Renderer(renderer) {
        this._renderer = renderer;
    }
    get Renderer() {
        return this._renderer;
    }


    set TemplateSelector(templateSelector) {
        this._templateSelector = templateSelector;
    }
    get TemplateSelector() {
        return this._templateSelector;
    }

    get EntityType() {
        return this._entityType;
    }

    get Models() {
        return this._models;
    }

    get ModelIds() {
        return this._modelIds;
    }
    addModel(model) {
        this._models = this._models || [];
        this._models.push(model);
    }


    setChanged() {
        this._changed = true;
        this._updateState += 1;
    }

    isChanged() {
        return this._changed;
    }

    isStateChanged(prevState) {
        return prevState != this._updateState;
    }


}

export { VisibleEntity };