import { NotImplementedException } from '../../modules/exception/not-implemented.js';
import { createLogger } from '../../modules/logging.js';
const log = createLogger('EntityDefinition');
class EntityDefinition {
    constructor(entityType, builder = null) {
        this._builder = builder;
        this._entityType = entityType;
        this._count = 1;
        this._data = null;
        this._id = null;
        this._parentId = null;
        this._kind = null;

    }

    _setBuilder(builder) {
        this._builder = builder;
    }
    get Count() {
        return this._count;
    }


    buildOne() {
        const instance = this.buildEntities(1)[0];
        this._count = 0;
        return instance;
    }

    buildEntities(count = null) {
        const instanceCount = count ?? this._count ?? 1;
        if (instanceCount == 0) {
            return null;
        }
        const entities = [];
        for (let number = 0; number < instanceCount; number++) {
            const instance = this._createEntity();

            instance._attachSelector = this._attachSelector;
            instance._templateSelector = this._templateSelector;
            entities.push(instance);

            this._builder._entityCreated(instance);
            if (instance.ParentEntity != null) {
                instance.ParentEntity.addChild(instance);
            }

            this._count -= 1;
        }

        return entities;
    }

    _initializeEntity(entity) {
        entity._entityType = this._entityType;
        if (this._data) {
            entity.Data = this._data;
        }
        if (this._parentId) {
            entity._parentId = this._parentId;
        }
        if (this._id) {
            entity._id = this._id;
        }
        if (this._kind) {
            entity.Kind = this._kind;
        }
    }

    _createEntity() {
        log.error('derived class must implement _createEntity');
        throw new NotImplementedException();
    }


    /* Builder methods.  Each returns "this" so the next can be called*/

    count(val) {
        this._count = val;
        return this;
    }

    data(val) {
        this._data = val;
        return this;
    }

    id(val) {
        this._id = val;
        return this;
    }

    parentId(id) {
        this._parentId = id;
        return this;
    }
}

export { EntityDefinition };