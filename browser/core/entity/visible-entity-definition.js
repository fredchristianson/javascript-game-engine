import { CALLBACK } from '../../modules/helpers/callback.js';
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
        super._initializeEntity(entity);
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


    /* Builder methods.  Each returns "this" so the next can be called*/


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
        this._beforeRender.push(CALLBACK.create(...callback));
        return this;
    }


    modelId(id) {
        this._modelIds = this._modelIds || [];
        this._modelIds.push(id);
        return this;
    }
}

export { VisibleEntityDefinition };