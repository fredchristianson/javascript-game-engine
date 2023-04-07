import { EntityBuilder } from '../entity/entity-builder.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { VisibleEntityDefinition } from '../entity/visible-entity-definition.js';
import { AREA_TYPE } from './area-type.js';
import { BoardArea } from './board-area.js';

class AreaDefinition extends VisibleEntityDefinition {
    constructor(areaType, builder) {
        super(ENTITY_TYPE.AREA, builder);
        this._areaType = areaType;
    }


    _createEntity() {
        const area = this._createArea();
        area._data = this._data;
        area.ParentEntity = this._parentEntity;
        return area;
    }

}

class BoardAreaDefinition extends AreaDefinition {
    constructor(builder) {
        super(AREA_TYPE.BOARD, builder);
    }

    _createArea() {
        const area = new BoardArea();
        return area;
    }
}

class AreaBuilder extends EntityBuilder {
    constructor(gameManager) {
        super(gameManager);
    }


    defineBoard() {
        const def = new BoardAreaDefinition(AREA_TYPE.BOARD, this);
        this._addDefinition(def);
        return def;
    }

}

export { AreaBuilder };