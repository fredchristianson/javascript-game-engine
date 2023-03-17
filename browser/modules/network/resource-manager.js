/*
 * DO NOT USE ASSERT or Logging in this class.
 * this class is used to load the Environment. 
 * ASSERT and Logging are not available until that is done.
 */

/**
 * loads resources from the server.  It works for files in static locations
 * game files by game name.
 *
 * 
 * @class ResourceManager
 * 
 */
class ResourceManager {
    /**
     * Create a URL for a game resource
     *
     * @static
     * @param {String} gameName - name of game
     * @param {String} resourceUrl - url in the game folder.  May be nested (e.g. subfolder/sub2/env.json)
     * @returns {string}
     */
    static getGameResourceUrl(gameName, resourceUrl) {
        return `/game/${gameName}/${resourceUrl}`;
    }
    constructor() {

    }

    async getResource(url) {
        const response = await fetch(url);
        return response;
    }

    async getGameModule(gameName, moduleName = 'game.js') {
        const url = ResourceManager.getGameResourceUrl(gameName, moduleName);
        const module = await import(url);
        return module;
        /*
         * const response = this.getResource(url);
         * return (await response).text();
         */
    }

}

export { ResourceManager };