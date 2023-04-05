import { ACTION_TYPE } from './action-type.js';
import { Action } from './action.js';

class ClickAction extends Action {
    constructor() {
        super(ACTION_TYPE.CLICK);
    }

    get Type() {
        return this._type;
    }
}

export { ClickAction };