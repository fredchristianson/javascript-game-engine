import { EntityDefinition } from '../entity/entity-definition';
import { ACTION_TYPE } from './action-type.unknown';

class ActionDefinition extends EntityDefinition {
    constructor(gameManager) {
        super(gameManager);
        this.type = ACTION_TYPE.UNKNOWN;
        this._frequencyMSecs = null;
        this._handler = null;
        this._forKind = null;
    }

    actionType(type) {
        this._type = type;
        return this;
    }

    frequencyMilliseconds(msecs) {
        this._frequencyMSecs = msecs;
        return this;
    }

    handler(func) {
        this._handler = func;
    }

    forKind(kind) {
        this._forKind = kind;
    }

}

class ActionBuilder {
    constructor() {
        this._definition = new ActionDefinition();

    }
}

export { ActionBuilder };