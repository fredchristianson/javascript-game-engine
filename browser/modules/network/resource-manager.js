/*
 * DO NOT USE ASSERT or Logging in this class.
 * this class is used to load the Environment. 
 * ASSERT and Logging are not available until that is done.
 */


/**
 * loads resources from the server.  It works for files in static locations
 * game files by game name.
 *
 * @class 
 * @export
 */
class ResourceManagerImpl {
    /**
     * Create a URL for a game resource
     *
     * @static
     * @param {String} gameName - name of game
     * @param {String} resourceUrl - url in the game folder.  May be nested (e.g. subfolder/sub2/env.json)
     * @returns {String}
     */
    static getGameResourceUrl(gameName, resourceUrl) {
        return `/game/${gameName}/${resourceUrl}`;
    }

    /**
     * Creates an instance of ResourceManagerImpl.
     *
     * @constructor
     */
    constructor() {

    }

    /**
     * Request a URL and return the response object
     *
     * @async
     * @param {String} url
     * @returns {Object}
     */
    async getResource(url) {
        const response = await fetch(url);
        return response;
    }

    /**
     * Import a module by url.
     *
     * @async
     * @param {String} gameName
     * @param {String} [moduleName='game.js']
     * @returns {Module}
     */
    async getGameModule(gameName, moduleName = 'game.js') {
        const url = ResourceManagerImpl.getGameResourceUrl(gameName, moduleName);
        const module = await import(url);
        return module;

    }

}

export { ResourceManagerImpl };