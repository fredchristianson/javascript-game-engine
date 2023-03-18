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


/**
 * The external name for the class ResourceManagerImpl
 *
 * @class
 * @extends {ResourceManagerImpl} 
 * @type {ResourceManagerImpl}
 * 
 */
const ResourceManager = ResourceManagerImpl;

export { ResourceManager, resourceManager };