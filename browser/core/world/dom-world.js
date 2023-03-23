import { createLogger } from '../../modules/logging.js';
import { WorldBase } from './world-base.js';
const log = createLogger('DomWorld');

class DomWorld extends WorldBase {
    constructor(domElement) {
        super();
        super.attach(domElement);
    }

}

export { DomWorld };