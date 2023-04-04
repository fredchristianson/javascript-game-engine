import { EntityDefinition } from '../entity/entity-definition.js';
import { EntityBuilder } from '../entity/entity-builder.js';
import { ENTITY_TYPE } from '../entity/entity-type.js';
import { LAYER_TYPE } from './layer-type.js';

class LayerDefinition extends EntityDefinition {
    constructor(layerType, builder) {
        super(ENTITY_TYPE.LAYER, builder);
        this._layerType = layerType;
    }
};

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
}

export { LayerBuilder };