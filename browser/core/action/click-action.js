import { createLogger } from '../../modules/logging.js';
import { ACTION_TYPE } from './action-type.js';
import { Action } from './action.js';

const log = createLogger('ClickAction');
class ClickAction extends Action {
    constructor() {
        super(ACTION_TYPE.CLICK);
        this._clicked = [];
    }

    get Type() {
        return this._type;
    }

    setInputHandler(inputHandler) {
        this._inputHandler = inputHandler;
        inputHandler.addClickAction(this);
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