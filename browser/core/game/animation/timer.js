class Timer {
    constructor(gameTimer, msecs = null) {
        this._gameTimer = gameTimer;
        this._msecs = msecs;
        this._startTime = gameTimer.CurrentTime;
    }

    get Milliseconds() {
        return this._msecs;
    }

    set Milliseconds(msecs) {
        this._msecs = msecs;
    }

    get IsDone() {
        if (this._startTime == null || this._msecs == null) {
            return false;
        }
        return (this._gameTimer.CurrentTime - this._startTime) > this._msecs;
    }

    reset() {
        this._startTime = this._gameTimer.CurrentTime;
    }
}

export { Timer };