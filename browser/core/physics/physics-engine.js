class PhysicsEngine {
    constructor(gameManager) {
        this._gameManager = gameManager;
        this._pieces = [];
        this._collisions = [];
    }

    setupPieces(pieces) {
        this._pieces = pieces;
    }

    setupCollisions(collisions) {
        this._collisions = collisions;
    }
}

export { PhysicsEngine };