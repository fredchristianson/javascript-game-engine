import { EntityBuilder } from '../entity/entity-builder.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { VisibleEntityDefinition } from '../entity/visible-entity-definition.js';
import { Piece } from './piece.js';

class PieceDefinition extends VisibleEntityDefinition {
    constructor(pieceType, builder) {
        super(ENTITY_TYPE.PIECE, builder);
        this._pieceType = pieceType;
        this.pieceKind = null;
    }

    kind(pieceKind) {
        this._pieceKind = pieceKind;
        return this;
    }

    _createEntity() {
        const piece = new Piece(this._pieceType);
        piece.Kind = this._pieceKind;
        piece.Renderer = this._renderer;
        piece.Data = this._data;
        piece.ParentEntity = this._parentEntity;
        piece.TemplateSelector = this._templateSelector;
        piece._modelId = this.ModelId;
        piece._parentId = this.ParentId;
        return piece;
    }
}

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