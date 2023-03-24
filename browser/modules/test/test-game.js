const moduleUrl = import.meta.url;
import { NETURL } from '../../modules/net.js';

import { ASSERT } from '../assert.js';
import { WindowWorld } from '../../core/world/window-world.js';
import { createLogger } from '../logging.js';
import { TestSuite } from './test-suite.js';
import { BuildClickHandler } from '../../modules/event.js';

const log = createLogger('TestGame');

function getHtmlURL() {
    const parentUrl = NETURL.removeLastComponent(moduleUrl);
    return new URL('test-game.html', parentUrl);

}

class TestGame {
    constructor() {
        this._resolve = null;
        this._reject = null;
    }

    async setup(testSuite, testImplementation) {
        ASSERT.isType(testSuite, TestSuite, 'TestGame setup requires a suite');
        ASSERT.isObject(testImplementation, 'TestGame requires a test implementation');
        this._world = new WindowWorld(getHtmlURL(), 'test-window');
        await this._world.create();
        this._worldDocumentDOM = this._world.getDocumentDOM();
        this._worldDOM = await this._world.getDOM();

        BuildClickHandler()
            .listenTo(this._worldDocumentDOM)
            .selector('button.success')
            .onClick((_event) => {
                if (this._resolve) {
                    this._resolve(true);
                }
            })
            .build();
        BuildClickHandler()
            .listenTo(this._worldDocumentDOM)
            .selector('button.fail')
            .onClick((_event) => {
                if (this._resolve) {
                    this._resolve(false);
                }
            })
            .build();

        await testImplementation.setup(this, this._world);
    }

    testRunning(test) {
        const prompt = test.Prompt ?? 'need a description of this test.';
        this._worldDocumentDOM.setValues({ '.description': prompt });
    }

    async isSuccess() {
        const success = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        return await success;
    }

    cleanup() {
        this._world.close();
    }

}

export {
    TestGame
};