import { HandlerFunction } from '../../modules/event/handler-function.js';
import { createLogger } from '../../modules/logging.js';
import { EntityDefinition } from './entity-definition.js';
const log = createLogger('VisibleEntityDefinition');

class VisibleEntityDefinition extends EntityDefinition {
    constructor(entityType, builder = null) {
        super(entityType, builder);
        this._attachSelector = null;
        this._templateSelector = null;
        this._beforeRender = [];
        this._modelIds = null;

    }


    _initializeEntity(entity) {
        if (this._attachSelector) {
            entity._attachSelector = this._attachSelector;
        }
        if (this._templateSelector) {
            entity._templateSelector = this._templateSelector;
        }
        if (this._beforeRender) {
            entity._beforeRender = this._beforeRender;
        }
        if (this._modelIds) {
            entity._modelIds = this._modelIds;
        }
    }

    get ParentId() {
        return this._parentId;
    }

    get TemplateSelector() {
        return this._templateSelector;
    }
    get BeforeRender() {
        return this._beforeRender;
    }
    get ModelId() {
        return this._modelId;
    }
    get AttachSelector() {
        return this._attachSelector;
    }

    /* Builder methods.  Each returns "this" so the next can be called*/

    parent(parentEntity) {
        this._parentEntity = parentEntity;
        return this;
    }
    count(val) {
        this._count = val;
        return this;
    }

    attachSelector(selector) {
        this._attachSelector = selector;
        return this;
    }

    templateSelector(selector) {
        this._templateSelector = selector;
        return this;
    }

    beforeRender(...callback) {
        this._beforeRender.push(new HandlerFunction(...callback));
        return this;
    }

    parentId(id) {
        this._parentId = id;
        return this;
    }

    modelId(id) {
        this._modelIds = this._modelIds || [];
        this._modelIds.push(id);
        return this;
    }
}

export { VisibleEntityDefinition };