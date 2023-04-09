import { EntityBuilder } from '../entity/entity-builder.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { LAYER_TYPE } from './layer-type.js';
import { HtmlLayer } from './html-layer.js';
import { ForegroundLayer } from './foreground-layer.js';
import { InputLayer } from './input-layer.js';
import { BackgroundLayer } from './background-layer.js';
import { CanvasLayer } from './canvas-layer.js';
import { VisibleEntityDefinition } from '../entity/visible-entity-definition.js';
class LayerDefinition extends VisibleEntityDefinition {
    constructor(layerType, builder) {
        super(ENTITY_TYPE.LAYER, builder);
        this._layerType = layerType;
    }

    _createEntity() {
        const layer = this._createLayer();
        this._initializeEntity(layer);
        layer._beforeRenderer = this._beforeRenderer;
        layer._templateSelector = this._templateSelector;
        layer._attachSelector = this._attachSelector;
        layer._parentEntity = this._parentEntity;
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

class CanvasLayerDefinition extends LayerDefinition {
    constructor(builder) {
        super(LAYER_TYPE.CANVAS, builder);
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

    defineCanvasLayer() {
        const def = new CanvasLayerDefinition(this);
        this._definitions.push(def);
        return def;
    }

    _buildDefaultLayers() {
        this.defineBackgroundLayer();
        this.defineHtmlLayer();
        this.buildAll();
    }


}

export { LayerBuilder };