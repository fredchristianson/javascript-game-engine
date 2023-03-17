import { ResourceManager } from './network/resource-manager.js';

/**
 * @module Net
 * 
 * test
 */

/**
 * A singleton instance of the ResourceManager
 *
 * @type {ResourceManager}
 */
const resourceManager = new ResourceManager();


export { resourceManager, ResourceManager };