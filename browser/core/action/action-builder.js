import { CALLBACK } from '../../modules/helpers/callback.js';
import { EntityBuilder } from '../entity/entity-builder.js';
import { EntityDefinition } from '../entity/entity-definition.js';
import { ENTITY_TYPE } from '../game.js';
import { ACTION_TYPE } from './action-type.js';
import { ClickAction } from './click-action.js';
import { TimerAction } from './timer-action.js';

class ActionDefinition extends EntityDefinition {
    constructor(type, builder) {
        super(ENTITY_TYPE.ACTION, builder);
        this._actionType = type;
        this._periodMSecs = null;
        this._handler = null;
        this._forKind = null;
    }

    actionType(type) {
        this._actionType = type;
        return this;
    }

    periodMilliseconds(msecs) {
        this._periodMSecs = msecs;
        return this;
    }

    handler(...args) {
        this._handler = CALLBACK.create(...args);
        return this;
    }

    forKind(kind) {
        this._forKind = kind;
        return this;
    }


    _createEntity() {
        const action = this._createActionByType(this._actionType);
        this._initializeEntity(action);
        action.Kind = this._actionKind;
        action.Data = this._data;
        action.Handler = this._handler;
        return action;
    }

    _createActionByType(type) {
        let action = null;
        switch (type) {
            case ACTION_TYPE.TIMER:
                action = new TimerAction();
                action.PeriodMilliseconds = this._periodMSecs;
                break;
            case ACTION_TYPE.CLICK:
                action = new ClickAction();
                break;
        }
        return action;
    }

}

class ActionBuilder extends EntityBuilder {
    constructor(gameManager) {
        super(ENTITY_TYPE.ACTION);
        this._gameManager = gameManager;
    }

    defineAction(type) {
        const def = new ActionDefinition(type, this);
        this._addDefinition(def);
        return def;
    }


    defineTimer() {
        return this.defineAction(ACTION_TYPE.TIMER);
    }

    defineClick() {
        return this.defineAction(ACTION_TYPE.CLICK);
    }


}

export { ActionBuilder };