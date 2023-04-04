import { Enum } from '../../modules/helpers.js';

class GameTimer {
    constructor(startTime) {
        this._startTime = startTime;
        this._currentTime = startTime;
        this._lastFrame = startTime;
        this._elapsedTime = 0;
        this._stepTime = 0;

    }

    update(timestamp) {
        this._currentTime = timestamp;
        this._stepTime = this._currentTime - this._lastFrame;
        this._elapsedTime = this._currentTime - this._startTime;
        this._lastFrame = timestamp;
    }
}

class GameState extends Enum {
    constructor(name) {
        super(name);
    }
}

const GAME_STATE = {
    STOPPED: new GameState('stopped'),
    RUNNING: new GameState('running'),
    PAUSED: new GameState('paused'),
    INITIALIZING: new GameState('initializing')
};

class GameRunner {
    constructor(gameManager) {
        this._gameState = GameState.INITIALIZING;
        this._gameManager = gameManager;
        this._timer = null;
        this._firstFrameProcessor = this.firstFrameProcessor.bind(this);
        this._frameProcessor = this.frameProcessor.bind(this);
        this._mechanics = gameManager.Mechanics;
        this._physics = gameManager.Physics;
        this._gameRenderer = gameManager.GameRenderer;
    }

    start() {
        this._gameState = GameState.RUNNING;
        requestAnimationFrame(this._firstFrameProcessor);
    }

    pause() {
        this._gameState = GameState.PAUSED;
    }

    resume() {
        this._gameState = GameState.RUNNING;
        requestAnimationFrame(this._frameProcessor);
    }

    stop() {
        this._gameState = GameState.RUNNING;
    }

    firstFrameProcessor(timestamp) {
        this._timer = new GameTimer(timestamp);
    }

    frameProcessor(timestamp) {
        this._timer.update(timestamp);
        this._mechanics.step(this._timer);
        this._physics.step(this._timer);
        this._gameRenderer.step(this._timer);
    }
}

export { GameRunner };