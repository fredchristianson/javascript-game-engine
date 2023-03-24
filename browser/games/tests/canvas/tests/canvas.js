import { ASSERT } from '../../../../modules/assert.js';
import { WorldBase } from '../../../../core/world.js';
import { LOGLEVELS, createLogger } from '../../../../modules/logging.js';
import { TestGame } from '../../../../modules/test/test-game.js';
import { NETURL } from '../../../../modules/net.js';
import { BuildInputHandler } from '../../../../modules/event.js';
import { ChildWindow } from '../../../../modules/window.js';
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

        this._controlWindow = new ChildWindow('cube-controls');
        await this._controlWindow.create('cube-controls.html', moduleBaseUrl);

        this._controlDOM = this._controlWindow.getDOM();

        BuildInputHandler()
            .listenTo(this._controlDOM)
            .selector('input')
            .changeHandlers(this,
                {
                    "[name='x-axis']": this.onXAxisChange,
                    "[name='y-axis']": this.onYAxisChange,
                    "[name='z-axis']": this.onZAxisChange
                })
            .build();

    }

    onXAxisChange(value) {
        log.debug('X change ', value);
    }

    onYAxisChange(value) {
        log.debug('Y change ', value);
    }

    onZAxisChange(value) {
        log.debug('Z change ', value);
    }
    /*
     * free resources or anything else needed
     * after all tests are run;
     */
    cleanup() {
        this._controls?.close();
    }


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