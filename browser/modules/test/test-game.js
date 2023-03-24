const moduleUrl = import.meta.url;

import { ASSERT } from '../assert.js';
import { WindowWorld } from '../../core/world/window-world.js';
import { createLogger } from '../logging.js';
import { TestSuite } from './test-suite.js';
import { BuildClickHandler } from '../../modules/event.js';
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
        await this._world.create();
        this._worldDocumentDOM = this._world.getDocumentDOM();
        this._worldDOM = await this._world.getDOM();
        //this._worldDocument = new DOM.DocumentDOM(await this._world.getDocument());
        return new Promise((resolve, _reject) => {
            BuildClickHandler()
                .listenTo(this._worldDocumentDOM)
                .selector('button.success')
                .onClick((_event) => {
                    this._worldDOM.removeAllChildren();
                    resolve();
                })
                .build();

            testImplementation.setup(this, this._world);
        });
    }

    cleanup() {
        this._world.close();
    }

}

export {
    TestGame
}