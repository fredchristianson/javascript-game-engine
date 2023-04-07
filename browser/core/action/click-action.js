import { LOGLEVELS, createLogger } from '../../modules/logging.js';
import { ACTION_TYPE } from './action-type.js';
import { Action } from './action.js';

const log = createLogger('ClickAction');
class ClickAction extends Action {
    constructor() {
        super(ACTION_TYPE.CLICK);
    }

    get Type() {
        return this._type;
    }

    check() {
        log.once(LOGLEVELS.ERROR, 'ClickAction.check not implemented');
    }
}

export { ClickAction };