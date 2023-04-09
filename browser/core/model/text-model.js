
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { MODEL_TYPE } from './model-type.js';
import { Model } from './model.js';
const log = createLogger('TextModel');

class TextModel extends Model {
    constructor() {
        super(ENTITY_TYPE.MODEL);
        this._type = MODEL_TYPE.TEXT;
        this._text = '';
    }

    get Text() {
        return this._text;
    }
}

export { TextModel };