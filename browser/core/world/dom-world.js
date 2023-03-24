import { createLogger } from '../../modules/logging/logger.js';
import { WorldBase } from './world-base.js';
const log = createLogger('DomWorld');

class DOMWorld extends WorldBase {
    constructor(domElement) {
        super();
        super.attach(domElement);
    }

}

export { DOMWorld };