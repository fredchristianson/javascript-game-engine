import { NotImplementedException } from '../../modules/exception/not-implemented.js';
import { FUNCTION, OBJECT, TYPE } from '../../modules/helpers.js';
import { MethodRenderer } from '../render/method-renderer.js';
import { Renderer } from '../render/renderer.js';
class EntityDefinition {
    constructor(entityType, builder = null) {
        this._builder = builder;
        this._entityType = entityType;
        this._isTemplate = false;
        this._count = 1;
        this._renderer = null;
        this._data = null;
        this._parentEntity = null;
    }

    get Count() {
        return this._count;
    }

    get IsTemplate() {
        return this._isTemplate;
    }
    build(count = null) {
        const instanceCount = count ?? this._count ?? 1;
        if (instanceCount == 0) {
            return null;
        }
        const entities = [];
        for (let number = 0; number < instanceCount; number++) {
            const instance = this._createEntity();
            entities.push(instance);
        }

        return instanceCount == 1 ? entities[0] : entities;
    }

    _createEntity() {
        log.error('derived class must implement _createEntity');
        throw new NotImplementedException();
    }
    set Renderer(renderer) {
        this._renderer = renderer;
    }
    get Renderer() {
        return this._renderer;
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

    isTemplate(template) {
        this._isTemplate = template;
        this._count = template ? 0 : 1;
        return this;
    }
    renderer(entityRenerer, method = null) {
        if (TYPE.isType(entityRenerer, Renderer)) {
            this._renderer = entityRenerer;
        } else if (FUNCTION.isFunction(entityRenerer)) {
            this._renderer = new FunctionRenderer(entityRenerer);
        } else if (OBJECT.isObject(entityRenerer) && FUNCTION.isFunction(method)) {
            this._renderer = new MethodRenderer(entityRenerer, method);
        }
        return this;
    }

    rendererType(type) {
        this._rendererType = type;
        return this;
    }

    templateSelector(selector) {
        this._templateSelector = selector;
        return this;
    }

    data(val) {
        this._data = val;
        return this;
    }
}

export { EntityDefinition };