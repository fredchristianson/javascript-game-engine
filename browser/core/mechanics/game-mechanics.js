class GameMechanics {
    constructor(gameManager) {
        this._gameManager = gameManager;
    }


    setup() {

    }

    step() {
        for (const action of this._gameManager._actions) {
            action.process();
        }
    }
}

export { GameMechanics };