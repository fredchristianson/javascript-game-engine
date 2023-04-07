import { createLogger } from '../../modules/logging.js';
import { layerOrderCompare } from '../layer/layer.js';
import { HtmlRenderer } from './html-render.js';
const log = createLogger('GameRenderer');

const RENDER_HTML = `
<div class='game-render-root' style='height:100%'>
    <style>
        #game-render-layers {height:100%;position:relative;}
        #game-render-layers > div {  position:absolute;left:0;top:0;right:0;bottom:0;background-color:transparent}
    </style>
    <div id='game-render-style'></div>
    <div id='game-render-layers'></div>
</div>
`;

class GameRenderer {
    constructor(gameManager) {
        this._gameManager = gameManager;
        this._layers = [];
        this._gameRenderLayers = [];
        this._layerRenderers = [];
        this._worldDOM = null;
        this._rootDOM = null;
        this._templateDOM = null;
        this._styleDOM = null;
        this._nextId = 1;
    }

    get RootDOM() {
        return this._rootDOM;
    }

    setupLayers(worldDOM, layers, templateDOM, styleDOM) {
        this._worldDOM = worldDOM;
        this._layers = layers;
        this._templateDOM = templateDOM;
        this._styleDOM = styleDOM;
        this._createDOM();
    }

    _createDOM() {
        this._worldDOM.removeAllChildren();
        this._gameRenderLayers = [];
        this._layerRenderers = [];
        this._rootHtml = this._worldDOM.parseString(RENDER_HTML);
        this._worldDOM.append(this._rootHtml);
        this._rootDOM = this._worldDOM.childDOM('.game-render-root');
        this._gameRenderStyle = this._worldDOM.childDOM('#game-render-style');
        this._gameRenderLayers = this._worldDOM.childDOM('#game-render-layers');
        if (this._styleDOM != null) {
            this._gameRenderStyle.append(this._styleDOM);
        }

        const sorted = [...this._layers].sort(layerOrderCompare);
        for (const layer of sorted) {
            const layerRenderer = new HtmlRenderer(this, this._gameRenderLayers, layer);
            this._layerRenderers.push(layerRenderer);
        }
    }

    _getTemplate(selector) {
        if (selector) {
            const child = this._templateDOM.childDOM(selector);
            if (child != null) {
                return child.clone();
            }
        }
        log.warn('TemplateSelector ', selector, 'not found');
        return null;
    }

    step() {
        for (const renderer of this._layerRenderers) {
            try {
                renderer.render();
            } catch (ex) {
                log.error('failed to render layer ', renderer);
            }
        }
    }
}


export { GameRenderer };