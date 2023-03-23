import { ResourceManagerImpl } from './network/resource-manager.js';

/**
 * @module Net
 * 
 */

/**
 * A singleton instance of the ResourceManager
 *
 * @type {ResourceManagerImpl}
 * @export
 * @instance
 */
const resourceManager = new ResourceManagerImpl();

export { URL } from './network/url.js';
export { ResourceManagerImpl as ResourceManager } from './network/resource-manager.js';
export { resourceManager };