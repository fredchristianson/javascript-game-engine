import { EntityDefinition } from '../entity/entity-definition.js';
import { EntityBuilder } from '../entity/entity-builder.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { LAYER_TYPE } from './layer-type.js';
import { HtmlLayer } from './html-layer.js';
import { ForegroundLayer } from './foreground-layer.js';
import { InputLayer } from './input-layer.js';
import { BackgroundLayer } from './background-layer.js';
import { CanvasLayer } from './canvas-layer.js';
class LayerDefinition extends EntityDefinition {
    constructor(layerType, builder) {
        super(ENTITY_TYPE.LAYER, builder);
        this._layerType = layerType;
    }

    _createEntity() {
        const layer = this._createLayer();
        layer.Renderer = this._renderer;
        layer._templateSelector = this._templateSelector;
        layer._data = this._data;
        return layer;
    }

    _createLayer() {
        let layer = null;
        switch (this._layerType) {
            case LAYER_TYPE.BACKGROUND:
                layer = new BackgroundLayer();
                break;
            case LAYER_TYPE.INPUT:
                layer = new InputLayer();
                break;
            case LAYER_TYPE.FOREGROUND:
                layer = new ForegroundLayer();
                break;
            case LAYER_TYPE.HTML:
                layer = new HtmlLayer();
                break;
            case LAYER_TYPE.CANVAS:
                layer = new CanvasLayer();
                break;
            default:
                ASSERT.fail(`Unknown layer type: ${this._layerType.toString()}`);
        }
        return layer;
    }
}

class LayerBuilder extends EntityBuilder {
    constructor(gameManager) {
        super(gameManager);

    }

    defineBackgroundLayer() {
        const def = new LayerDefinition(LAYER_TYPE.BACKGROUND, this);
        this._definitions.push(def);
        return def;
    }
    defineHtmlLayer() {
        const def = new LayerDefinition(LAYER_TYPE.HTML, this);
        this._definitions.push(def);
        return def;
    }

    _buildDefaultLayers() {

    }


    _entityCreated(entity, _def) {
        this._gameManager.addLayer(entity);
    }
}

export { LayerBuilder };