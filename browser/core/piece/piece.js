
import { createLogger } from '../../modules/logging/logger.js';
import { Entity } from '../entity/entity.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
const log = createLogger('Layer');

class Piece extends Entity {
    constructor(type) {
        super(ENTITY_TYPE.PIECE);
        this._type = type;
    }


}

export { Piece };