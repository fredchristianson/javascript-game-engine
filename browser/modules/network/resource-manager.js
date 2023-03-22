/*
 * DO NOT USE ASSERT or Logging in this class.
 * this class is used to load the Environment. 
 * ASSERT and Logging are not available until that is done.
 */

import { STRING, OBJECT } from '../helpers.js';
import { URL } from './url.js';


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
        return `/game/${gameName}/resource/${resourceUrl}`;
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
     * @param {String} gameName the name of the game
     * @param {String} [moduleName='game.js'] the moduleName to get
     * @returns {Module}
     */
    async getGameModule(gameName) {
        //const url = ResourceManagerImpl.getGameResourceUrl(gameName, moduleName);
        const url = `/game/${gameName}/module`;
        const module = await import(url);
        return module;

    }

    /**
     * Import a module by url.
     *
     * @async
     * @param {String} gameName name of the game
     * @param {String} resourcePath can be a path in the game foler, or "html" for the top-level html file, or "css" for the top-level css file
     * @returns {Module}
     */
    async getGameResource(gameName, resourcePath) {
        const url = ResourceManagerImpl.getGameResourceUrl(gameName, resourcePath);
        const response = await this.getResource(url);
        if (response && response.ok) {
            return response.text();
        }
        return null;

    }

    /**
     * Request a URL and return JSON response.
     *
     * @async
     * @param {String} url - url to request
     * @param {Map|Object} params - name/value pairs to add to the query string
     * @returns {Object} the JSON object or null if failed
     */
    async getJSON(url, params) {
        if (!OBJECT.isEmpty(params)) {
            url = URL.addQueryParams(url, params);
        }
        const response = await this.getResource(url);
        if (response != null && response.ok) {
            return await response.json();
        }
        return null;
    }

    /**
     * Post a JSON body to a url
     *
     * @async
     * @param {String} url to use
     * @param {String | Object} body if this is not a string it will be converted to a JSON string
     * @returns {Object} the JSON objec returned or null if failed
     */
    async postJSON(url, body) {
        let bodyJSON = body;
        if (!STRING.isString(body)) {
            bodyJSON = STRING.toString(body);
        }
        const response = await fetch(url, {
            method: 'POST',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: bodyJSON
        });
        if (response != null) {
            return await response.json();
        }
        return null;
    }

}

export { ResourceManagerImpl };