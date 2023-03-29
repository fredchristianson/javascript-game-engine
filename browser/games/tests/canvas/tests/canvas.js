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
        this._x = 0;
        this._y = 0;
        this._z = 0;
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
        this._canvas = this._worldDOM.first('canvas');
        this._controlWindow = new ChildWindow('cube-controls');
        await this._controlWindow.create(new URL('cube-controls.html', moduleBaseUrl));

        this._controlDOM = await this._controlWindow.getDOM();

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
        this._x = Number.parseInt(value);
        this.drawCube();
    }

    onYAxisChange(value) {
        log.debug('Y change ', value);
        this._y = Number.parseInt(value);
        this.drawCube();
    }

    onZAxisChange(value) {
        log.debug('Z change ', value);
        this._z = Number.parseInt(value);
        this.drawCube();
    }
    /*
     * free resources or anything else needed
     * after all tests are run;
     */
    cleanup() {
        this._controls?.close();
    }

    drawCube() {
        const canvas = this._canvas.HTMLElement;
        const ctx = this._canvas.HTMLElement.getContext('2d');
        const wsize = this._worldElement.getDocumentDOM().Root.size();

        canvas.width = wsize.width;
        canvas.height = wsize.height;

        const size = Math.min(wsize.width, wsize.height) / 3;
        const lw = 2.0 / size;
        let side = size;
        //ctx.translate(canvas.width / 2, canvas.height / 2);

        // ctx.scale(side, side);
        /*
         *        ctx.scale(side, side);
         * ctx.scale(10, 10);
         */

        side = 1.0;

        const mat = new DOMMatrix();
        mat.translateSelf(wsize.width / 2, wsize.height / 2);
        mat.scaleSelf(size);
        mat.rotateSelf(this._x, this._y, this._z);
        ctx.setTransform(mat);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        //ctx.translate(size.width / 2, 0);// size.height / 2);
        ctx.moveTo(-side, -side);
        ctx.lineTo(-side, side);
        ctx.lineTo(side, side);
        ctx.lineTo(side, -side);
        ctx.closePath();
        ctx.fillStyle = '#ff0000';
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = lw;
        ctx.stroke();
        ctx.fill();

        // ctx.beginPath();
        // //ctx.translate(ctx.width / 2, ctx.height / 2);
        // ctx.arc(this._x, this._y, 50, 0, 2 * Math.PI);
        // ctx.fillStyle = '#0000ff';
        // ctx.strokeStyle = '#ff00ff';
        // ctx.stroke();
        // ctx.fill();

    }

    uitest_Cube(result) {
        result.Name = 'Draw a cube';
        result.Prompt = 'Do you see a cube?';
        this.drawCube();
    }

    uitest_Cube2(result) {
        result.Name = 'Draw a cube 2';
        result.Prompt = 'Do you see another cube?';

    }

}

export const test = new CanvasTest();