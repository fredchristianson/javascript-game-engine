import { EntityDefinition } from '../entity/entity-definition.js';
import { EntityBuilder } from '../entity/entity-builder.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { LAYER_TYPE } from './layer-type.js';
import { Layer } from './layer.js';
class LayerDefinition extends EntityDefinition {
    constructor(layerType, builder) {
        super(ENTITY_TYPE.LAYER, builder);
        this._layerType = layerType;
    }

    _createEntity() {
        const layer = new Layer(this._layerType);
        layer.Renderer = this._renderer;
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