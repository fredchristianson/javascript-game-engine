
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { MODEL_TYPE } from './model-type.js';
import { Model } from './model.js';
const log = createLogger('StyleModel');

class StyleModel extends Model {
    constructor() {
        super(ENTITY_TYPE.MODEL);
        this._type = MODEL_TYPE.STYLE;
        this._styles = {};
    }

    get Style() {
        return this._styles;
    }
}

export { StyleModel };