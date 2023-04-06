import { EntityBuilder } from '../entity/entity-builder.js';
import { EntityDefinition } from '../entity/entity-definition.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { AREA_TYPE } from './area-type.js';
import { BoardArea } from './board-area.js';
import { GridArea } from './grid-area.js';
import { RectangleArea } from './rectangle-area.js';

class AreaDefinition extends EntityDefinition {
    constructor(areaType, builder) {
        super(ENTITY_TYPE.AREA, builder);
        this._areaType = areaType;
    }


    _createEntity() {
        const area = this._createArea();
        area.Renderer = this._renderer;
        area._templateSelector = this._templateSelector;
        area._data = this._data;
        area.ParentEntity = this._parentEntity;
        return area;
    }

    _createArea() {
        let area = null;
        switch (this._areaType) {
            case AREA_TYPE.RECTANGLE:
                area = new RectangleArea();
                break;
            case AREA_TYPE.BOARD:
                area = new BoardArea();
                break;
            case AREA_TYPE.GRID:
                area = new GridArea();
                break;
        }
        return area;
    }
}

class AreaBuilder extends EntityBuilder {
    constructor(gameManager) {
        super(gameManager);
    }

    defineArea(areaType) {
        const def = new AreaDefinition(areaType, this);
        this._addDefinition.push(def);
        return def;
    }
    defineBoard() {
        const def = new AreaDefinition(AREA_TYPE.BOARD, this);
        this._addDefinition(def);
        return def;
    }

}

export { AreaBuilder };