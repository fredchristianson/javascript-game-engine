import { ENV } from '../env.js';
import { URL } from './url.js';
import { resourceManager } from '../net.js';
import { createLogger } from '../logging/logger.js';
import { BOOLEAN } from '../helpers.js';
const logger = createLogger('API');

/** @namespace API */
const API = {
  get: async function (apiName, params = {}) {
    try {
      const base = ENV.get('apiBaseUrl', '/api/v1');
      const url = URL.combine(base, apiName);
      const json = resourceManager.getJSON(url, params);
      return json;
    } catch (ex) {
      logger.error(`API request "${apiName}" failed`, ex);
      return {
        success: false,
        message: ex.message,
        exception: ex
      };
    }
  },

  post: async function (apiName, body) {
    try {
      const base = ENV.get('apiBaseUrl', '/api/v1');
      const url = URL.combine(base, apiName);
      const json = resourceManager.postJSON(url, body);
      return json;
    } catch (ex) {
      logger.error(`API request "${apiName}" failed`, ex);
      return {
        success: false,
        message: ex.message,
        exception: ex
      };
    }
  },

  getGames: async function () {
    const games = await API.get('games');
    if (games == null || !BOOLEAN.isTrue(games.success)) {
      log.error('failed to load games: ', games?.message ?? 'unknown error');
      return [];
    } else {
      return games.data;
    }
  }
};

export { API }; 
