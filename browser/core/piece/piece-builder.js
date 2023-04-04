import { EntityDefinition } from '../entity/entity-definition.js';
import { EntityBuilder } from '../entity/entity-builder.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';

class PieceDefinition extends EntityDefinition {
    constructor(pieceType, builder) {
        super(ENTITY_TYPE.PIECE, builder);
        this._pieceType = pieceType;
        this.pieceKind = null;
    }

    kind(pieceKind) {
        this._pieceKind = pieceKind;
        return this;
    }
};

class PieceBuilder extends EntityBuilder {
    constructor(gameManager) {
        super(gameManager);
    }

    definePiece(pieceType) {
        const def = new PieceDefinition(pieceType, this);
        this._addDefinition(def);
        return def;
    }
    defineBoard() {
        const def = new PieceDefinition(PIECE_TYPE.BOARD, this);
        this._addDefinition(def);
        return def;
    }

}

export { PieceBuilder };