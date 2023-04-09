class PhysicsEngine {
    constructor(gameManager) {
        this._gameManager = gameManager;

    }

    setup() {

    }

    step() {
        const movements = [];
        for (const piece of this._gameManager._pieces) {
            const startEnd = this._move(piece);
            if (startEnd != null) {
                movements.push(startEnd);
            }
        }


    }

    _move(piece) {
        return null;
    }

}

export { PhysicsEngine };