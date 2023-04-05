
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from './entity-type.js';

const log = createLogger('Layer');

class Entity {
    constructor(type = ENTITY_TYPE.UNKNOWN) {
        this._entityType = type;
        this._parentElement = null;
        this._renderer = null;

        this._data = null;
        this._updateState = 0; // incremented each update.  
        this._changed = false;
        this._children = [];
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


    set ParentEntity(parentEntity) {
        this._parentEntity = parentEntity;
    }
    get ParentEntity() {
        return this._parentEntity;
    }

    set TemplateSelector(templateSelector) {
        this._templateSelector = templateSelector;
    }
    get TemplateSelector() {
        return this._templateSelector;
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


    get entityType() {
        return this._entityType;
    }


    position(parent) {
        this._parentElement = parent;
        return this;
    }

    renderer(render) {
        /*
         * todo: check if renderrer is a function.
         * does it need to be bound to the game?
         */
        this._renderer = render;
        return this;
    }
}

export { Entity };