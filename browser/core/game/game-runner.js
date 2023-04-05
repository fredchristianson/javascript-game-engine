import { Enum } from '../../modules/helpers.js';
import { gameTimer } from './game-timer.js';


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
        gameTimer.startGame(timestamp);

        requestAnimationFrame(this._frameProcessor);
    }

    frameProcessor(timestamp) {
        gameTimer.update(timestamp);
        this._mechanics.step();
        this._physics.step();
        this._gameRenderer.step();

        requestAnimationFrame(this._frameProcessor);
    }
}

export { GameRunner };