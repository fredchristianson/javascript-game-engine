import { Enum } from '../../modules/helpers.js';

class CollisionType extends Enum {
    constructor(name) {
        super(name);
    }
}

const COLLISION_TYPE = {
    BOUNDARY: new CollisionType('boundary')
};

export { COLLISION_TYPE };