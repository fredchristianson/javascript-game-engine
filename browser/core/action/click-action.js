import { createLogger } from '../../modules/logging.js';
import { ACTION_TYPE } from './action-type.js';
import { Action } from './action.js';
import { inputHandler } from './input-handler.js';

const log = createLogger('ClickAction');
class ClickAction extends Action {
    constructor() {
        super(ACTION_TYPE.CLICK);
        inputHandler.addClickAction(this);
        this._clicked = [];
    }

    get Type() {
        return this._type;
    }

    process() {
        if (this._handler) {
            for (const entity of this._clicked) {
                this._handler.call(entity);
            }
            this._clicked.splice(0, this._clicked.length);
        }
    }

    entityClicked(entity) {
        this._clicked.push(entity);
    }

}

export { ClickAction };