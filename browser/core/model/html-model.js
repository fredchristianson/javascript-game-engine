
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { MODEL_TYPE } from './model-type.js';
import { Model } from './model.js';
const log = createLogger('HtmlModel');

class HtmlModel extends Model {
    constructor() {
        super(ENTITY_TYPE.MODEL);
        this._type = MODEL_TYPE.HTML;
        this._templateSelector = null;
        this._attachSelector = null;
        this._templateValueFunction = null;
    }

    getValues(data) {
        if (this._templateValueFunction) {
            return this._templateValueFunction(data);
        }
        return {};
    }

}

export { HtmlModel };