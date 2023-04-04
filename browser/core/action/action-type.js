import { Enum } from '../../modules/helpers.js';

class ActionType extends Enum {
    constructor(name) {
        super(name);
    }
}

const ACTION_TYPE = {
    CLICK: new ActionType('click'),
    TIMER: new ActionType('timer')
};

export { ACTION_TYPE };