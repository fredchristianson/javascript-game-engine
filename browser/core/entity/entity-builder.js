import { ASSERT } from '../../modules/assert.js';
import { EntityDefinition } from './entity-definition.js';


class EntityBuilder {
    constructor(gameManager, defs = []) {
        this._gameManager = gameManager;
        this._definitions = defs ?? [];
    }

    _addDefinition(def) {
        ASSERT.isType(def, EntityDefinition, 'definition parameter must by an EntityDefinition');
        this._definitions.push(def);
    }


    buildAll() {
        const entities = [];
        for (const def of this._definitions) {
            if (!def.isTemplate() && def.Count > 0) {
                entities.push(def.build());
            }
        }
        return entities;
    }


}

export { EntityBuilder };