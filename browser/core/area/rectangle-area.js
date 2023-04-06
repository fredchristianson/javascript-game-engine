
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { AREA_TYPE } from './area-type.js';
import { Area } from './area.js';
const log = createLogger('RectangleArea');

class RectangleArea extends Area {
    constructor() {
        super(ENTITY_TYPE.AREA);
        this._type = AREA_TYPE.RECTANGLE;
    }


}

export { RectangleArea };