import { createLogger } from '../../modules/logging.js';
import { layerOrderCompare } from '../layer/layer.js';
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
        this._worldDOM = null;
        this._templateDOM = null;
        this._styleDOM = null;
        this._nextId = 1;
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
        this._htmlRenderer = this._worldDOM.parseString(RENDER_HTML);
        this._worldDOM.append(this._htmlRenderer);
        this._gameRenderStyle = this._worldDOM.childDOM('#game-render-style');
        this._gameRenderLayers = this._worldDOM.childDOM('#game-render-layers');
        if (this._styleDOM != null) {
            this._gameRenderStyle.append(this._styleDOM);
        }

        const sorted = [...this._layers].sort(layerOrderCompare);
        for (const layer of sorted) {
            this._createLayerDOM(layer);
        }
    }

    _createLayerDOM(layer) {
        const element = this._gameRenderLayers.append('<div></div>');
        layer._gameRenderer = {
            element: element,
            id: this._nextId++
        };
        if (layer.TemplateSelector) {
            const template = this._templateDOM.first(layer.TemplateSelector);
            if (template == null) {
                log.error(`Layer template ${layer.TemplateSelector} not found.`);
            } else {
                const copy = template.clone();
                element.append(copy);
            }
        }
        element.setData('layer-id', layer._gameRenderer.id);
        element._gameLayer = layer;
        this._createChildren(element, layer.Children);
    }

    _createChildren(element, children) {
        if (children == null) {
            return;
        }
        for (const child of children) {
            let newElement = null;
            if (child.TemplateSelector) {
                const template = this._templateDOM.childDOM(child.TemplateSelector);
                if (template != null) {
                    template.setValues(child.Data);
                    newElement = element.append(...template.getChildNodes());
                }
            } else if (child.AttachSelector) {
                newElement = element.first(child.AttachSelector);
            }
            if (newElement) {
                newElement._gameElement = child;
                child._gameRenderer = {
                    element: newElement,
                    id: this._nextId++
                };

                if (child.Kind) {
                    newElement.setData('kind', child.Kind);
                }
            }
            this._createChildren(child._gameRenderer.element, child.Children);
        }
    }

    step() {
        for (const layer of this._layers) {
            if (layer.Renderer) {
                layer.Renderer.render(layer, layer._gameRenderer.element);
            }
        }
    }

}

export { GameRenderer };