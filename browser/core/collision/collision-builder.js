import { ASSERT } from '../../modules/assert.js';
import { CALLBACK } from '../../modules/helpers/callback.js';
import { createLogger } from '../../modules/logging.js';
import { EntityBuilder } from '../entity/entity-builder.js';
import { EntityDefinition } from '../entity/entity-definition.js';
import { ENTITY_TYPE } from '../game.js';
import { COLLISION_TYPE } from './collision-type.js';

const log = createLogger('CollisionBuilder');

class CollisionDefinition extends EntityDefinition {
    constructor(type, builder) {
        super(ENTITY_TYPE.COLLISION, builder);
        this._collisionType = type;
        this._handler = null;
        this._colliderKind = null;
        this._targetKind = null;
    }

    actionType(type) {
        this._actionType = type;
        return this;
    }


    handler(...args) {
        this._handler = CALLBACK.create(...args);
        return this;
    }

    colliderKind(kind) {
        this._colliderKind = kind;
        return this;
    }

    targetKind(kind) {
        this._targetKind = kind;
        return this;
    }


    _createEntity() {
        const action = this._createCollision();
        this._initializeEntity(action);
        action._colliderKind = this._colliderKind;
        action._targetKind = this._targetKind;
        action._handler = this._handler;
        return action;
    }

    _createCollision() {
        ASSERT.fail('Derived class must implement _createCollision()');

    }

}

class BoundaryCollisionDefinition extends CollisionDefinition {
    constructor() {
        super(COLLISION_TYPE.BOUNDARY);
        this._boundaryId = null;
        this._colliderId = null;
    }

    colliderId(id) {
        this._colliderId = id;
        return this;
    }

    boundaryId(boundardId) {
        this._boundardId = boundardId;
        return this;
    }

    _createCollision() {
        const collision = new BoundaryCollision();
        collision._colliderId = this._colliderId;
        collision._boundaryId = this._boundardId;
        return collision;
    }
}

class CollisionBuilder extends EntityBuilder {
    constructor(gameManager) {
        super(ENTITY_TYPE.COLLISION);
        this._gameManager = gameManager;
    }

    defineBoundary() {
        const def = new BoundaryCollisionDefinition(type, this);
        this._addDefinition(def);
        return def;
    }


}

export { CollisionBuilder };