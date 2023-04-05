import { ASSERT } from '../../modules/assert.js';
import { EntityDefinition } from './entity-definition.js';
import { createLogger } from '../../modules/logging.js';
const log = createLogger('EntityBuilder');
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
        const result = [];
        for (const def of this._definitions) {
            if (!def.IsTemplate) {
                for (let count = 0; count < def.Count; count++) {
                    const entities = def.buildEntities();
                    result.push(...entities);
                    for (const entity of entities) {
                        this._entityCreated(entity, def);
                    }
                }
            }
        }
        return result;
    }

    _entityCreated(_entity, _def) {
        // derived classes can overwrite
    }


}

export { EntityBuilder };