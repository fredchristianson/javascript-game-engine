import { EntityDefinition } from '../entity/entity-definition.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { PieceBuilder } from '../piece/piece-builder.js';

class AreaDefinition extends EntityDefinition {
    constructor(areaType, builder) {
        super(ENTITY_TYPE.AREA, builder);
        this._areaType = areaType;
    }
};

class AreaBuilder extends EntityBuilder {
    constructor(gameManager) {
        super(gameManager);
    }

    defineArea(areaType) {
        const def = new AreaDefinition(areaType, this);
        this._addDefinition.push(def);
    }
    defineBoard() {
        const def = new AreaDefinition(AREA_TYPE.BOARD, this);
        this._addDefinition(def);
    }

    buildPiece() {
        pieceBuilder = new PieceBuilder
    }
}

export { AreaBuilder };