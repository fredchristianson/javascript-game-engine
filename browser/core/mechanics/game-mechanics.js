class GameMechanics {
    constructor(gameManager) {
        this._gameManager = gameManager;
        this._pieces = [];
        this._actions = [];
    }

    setupPieces(pieces) {
        this._pieces = pieces;
    }

    setupActions(actions) {
        this._actions = actions;
    }
}

export { GameMechanics };