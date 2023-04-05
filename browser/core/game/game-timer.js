import { Timer } from './animation/timer.js';

class GameTimer {
    constructor() {
        this._startTime = 0;
        this._currentTime = 0;
        this._lastFrame = 0;
        this._stepTime = 0;
        this._pauseStart = 0;
        this._pausedTime = null;

    }

    createTimer(msecs = null) {
        return new Timer(this, msecs);
    }
    get CurrentTime() {
        return this._currentTime;
    }

    startGame(startTime) {
        this._startTime = startTime;
        this._currentTime = startTime;
        this._lastFrame = startTime;
        this._elapsedTime = 0;
        this._stepTime = 0;

    }

    pause(timestamp) {
        this._currentTime = timestamp;
        this._stepTime = this._currentTime - this._lastFrame;
        this._lastFrame = timestamp;
        this._pauseStart = timestamp;
    }

    resume(timestamp) {
        this._pausedTime += (timestamp - this._pauseStart);
        this._currentTime = timestamp;
        this._stepTime = 0;
        this._lastFrame = timestamp;
        this._pauseStart = null;
    }

    update(timestamp) {
        this._currentTime = timestamp;
        this._stepTime = this._currentTime - this._lastFrame;
        this._lastFrame = timestamp;
    }

    get IsPaused() {
        return this._pausedTime != null;
    }
}

const gameTimer = new GameTimer();

export { gameTimer };