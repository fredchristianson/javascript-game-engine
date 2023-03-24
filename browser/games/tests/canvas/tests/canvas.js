import { ASSERT } from '../../../../modules/assert.js';
import { WorldBase } from '../../../../core/world/world-base.js';
import { LOGLEVELS, createLogger } from '../../../../modules/logging.js';
import { TestGame } from '../../../../modules/test/test-game.js';
import { NETURL } from '../../../../modules/net.js';

const log = createLogger('TestCanvas', LOGLEVELS.DEBUG);
const moduleBaseUrl = NETURL.removeLastComponent(import.meta.url);

class CanvasTest {
    constructor() {

    }

    // return Name for reports
    get Name() {
        return 'CanvasTest';
    }

    // return Description
    get Description() {
        return 'Test canvas.';
    }

    // do any necessary setup before tests are run
    async setup(theGame, worldElement) {
        ASSERT.isType(theGame, TestGame, 'CanvasTest.setup requires a TestGame');
        ASSERT.isType(worldElement, WorldBase, 'CanvasTest.setup requires a World');
        this._theGame = theGame;
        this._worldElement = worldElement;
        this._worldDOM = await worldElement.getDOM();
        /*
         * this._canvas = this._worldDOM.first('canvas');
         * this._worldDOM.append('<canvas></canvas>');
         */
        await this._worldDOM.load(new URL('style.css', moduleBaseUrl),
            new URL('test.html', moduleBaseUrl));
    }


    /*
     * free resources or anything else needed
     * after all tests are run;
     */
    cleanup() { }


    uitest_Cube(result) {
        result.Name = 'Draw a cube';
        result.Prompt = 'Do you see a cube?';

    }

    uitest_Cube2(result) {
        result.Name = 'Draw a cube 2';
        result.Prompt = 'Do you see another cube?';

    }

}

export const test = new CanvasTest();