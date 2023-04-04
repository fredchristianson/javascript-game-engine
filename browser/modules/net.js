
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

export { API } from './network/api.js';
export { ResourceManagerImpl as ResourceManager, resourceManager } from './network/resource-manager.js';
export { removeLastComponent } from './network/url.js';