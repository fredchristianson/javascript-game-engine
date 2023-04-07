
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from './entity-type.js';

const log = createLogger('Layer');

class Entity {
    constructor(type = ENTITY_TYPE.UNKNOWN) {
        this._entityType = type;
        this._data = null;
        this._updateState = 0; // incremented each update.  
        this._changed = false;
        this._parentId = null;
        this._parent = null;
        this._children = null;
        this._kind = null;
    }

    set Kind(kind) {
        this._kind = kind;
    }
    get Kind() {
        return this._kind;
    }

    get Parent() {
        return this._parent;
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

    get EntityType() {
        return this._entityType;
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


    addChild(childEntity) {
        if (this._children == null) {
            this._children = [];
        }
        if (UTIL.includes(this._children, childEntity)) {
            log.warn('child ', childEntity, ' alread added to entityt', this);
            return;
        }
        this._children.push(childEntity);
    }

    setParent(parent) {
        this._parent = parent;
    }

}

export { Entity };