
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { MODEL_TYPE } from './model-type.js';
import { Model } from './model.js';
const log = createLogger('CanvasModel');

class CanvasModel extends Model {
    constructor() {
        super(ENTITY_TYPE.MODEL);
        this._type = MODEL_TYPE.CANVAS;
    }


}

export { CanvasModel };