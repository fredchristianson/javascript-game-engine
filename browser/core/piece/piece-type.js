import { Enum } from '../../modules/helpers.js';

class PieceType extends Enum {
    constructor(name) {
        super(name);
    }
}

const AREA_TYPE = {
    UNKNOWN: new PieceType('unknown'),
    VISUAL: new PieceType('visual'),
    INTERACTIVE: new PieceType('interactive')
};

export { AREA_TYPE, PieceType };