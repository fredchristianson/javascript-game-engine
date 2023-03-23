const moduleUrl = import.meta.url;

import { ASSERT } from '../assert.js';
import { WindowWorld } from '../../core/world/window-world.js';
import { createLogger } from '../logging.js';
import { TestSuite } from './test-suite.js';
import { URL } from '../../modules/net.js';

const log = createLogger('TestGame');

function getHtmlURL() {
    const parentUrl = URL.removeLastComponent(moduleUrl);
    return URL.combine(parentUrl, 'test-game.html');

}

class TestGame {
    constructor() {

    }

    async setup(testSuite, testImplementation) {
        ASSERT.isType(testSuite, TestSuite, 'TestGame setup requires a suite');
        ASSERT.isObject(testImplementation, 'TestGame requires a test implementation');
        this._world = new WindowWorld(getHtmlURL(), 'test-window');
        this._worldDocument = await this._world.getDocument();
        testImplementation.setup(this, this._world);
    }

    cleanup() {
        this._world.close();
    }

}

export {
    TestGame
}