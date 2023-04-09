import { Enum } from '../../modules/helpers.js';


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
        this._gameState = GAME_STATE.INITIALIZING;
        this._gameManager = gameManager;
        this._gameTimer = gameManager._gameTimer;
        this._firstFrameProcessor = this.firstFrameProcessor.bind(this);
        this._frameProcessor = this.frameProcessor.bind(this);
        this._mechanics = gameManager.Mechanics;
        this._physics = gameManager.Physics;
        this._gameRenderer = gameManager.GameRenderer;
    }

    start() {
        this._gameState = GAME_STATE.RUNNING;
        requestAnimationFrame(this._firstFrameProcessor);
    }

    pause() {
        this._gameState = GAME_STATE.PAUSED;
    }

    resume() {
        this._gameState = GAME_STATE.RUNNING;
        requestAnimationFrame(this._frameProcessor);
    }

    stop() {
        this._gameState = GAME_STATE.RUNNING;
    }

    firstFrameProcessor(timestamp) {
        this._gameTimer.startGame(timestamp);

        requestAnimationFrame(this._frameProcessor);
    }

    frameProcessor(timestamp) {
        if (this._gameState != GAME_STATE.RUNNING) {
            return;
        }
        this._gameTimer.update(timestamp);
        this._mechanics.step();
        this._physics.step();
        this._gameRenderer.step();

        requestAnimationFrame(this._frameProcessor);
    }
}

export { GameRunner };