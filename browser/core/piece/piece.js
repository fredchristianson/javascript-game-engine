
import { createLogger } from '../../modules/logging/logger.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { VisibleEntity } from '../entity/visible-entity.js';
const log = createLogger('Layer');

class Piece extends VisibleEntity {
    constructor(type) {
        super(ENTITY_TYPE.PIECE);
        this._type = type;
    }


}

export { Piece };