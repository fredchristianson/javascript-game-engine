import { Enum } from '../../modules/helpers.js';

class AreaType extends Enum {
    constructor(name) {
        super(name);
    }
}

const AREA_TYPE = {
    UNKNOWN: new AreaType('unknown'),
    BOARD: new AreaType('board')
};

export { AREA_TYPE, AreaType };