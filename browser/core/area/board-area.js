
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { AREA_TYPE } from './area-type.js';
import { RectangleArea } from './rectangle-area.js';
const log = createLogger('BoardArea');

class BoardArea extends RectangleArea {
    constructor() {
        super(ENTITY_TYPE.AREA);
        this._type = AREA_TYPE.BOARD;
    }


}

export { BoardArea };