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
        def._setBuilder(this);
    }


    buildAll() {
        const result = [];
        for (const def of this._definitions) {
            if (!def.IsTemplate && def.Count > 0) {
                const entities = def.buildEntities();
                result.push(...entities);
            }
        }
        return result;
    }

    _entityCreated(entity) {
        this._gameManager._addEntity(entity);
    }
}

export { EntityBuilder };