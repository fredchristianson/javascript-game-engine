import { ACTION_TYPE } from './action-type.js';
import { Action } from './action.js';

class TimerAction extends Action {
    constructor() {
        super(ACTION_TYPE.TIMER);
        this._periodMilliseconds = null;
        this._timer = null;
    }

    get PeriodMilliseconds() {
        return _periodMilliseconds;
    }

    set GameTimer(gameTimer) {
        this._gameTimer = gameTimer;
    }

    set PeriodMilliseconds(msecs) {

        this._gameTimer.createTimer(msecs);
        this._periodMilliseconds = msecs;
    }


    get Type() {
        return this._type;
    }

    process() {
        if (this._timer == null) {
            this._timer = this._gameTimer.createTimer(this._periodMilliseconds);
        }
        if (this._timer?.IsDone) {
            this._doAction();
            this._timer.reset();
        }
    }
}

export { TimerAction };