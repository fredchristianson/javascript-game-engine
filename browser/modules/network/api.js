import { getENV } from '../env.js';
import { URL } from './url.js';
import { resourceManager } from '../net.js';
import { createLogger } from '../logging/logger.js';
const logger = createLogger("API");

/** @namespace API */
const API = {
  get: async function (apiName, params = {}) {
    try {
      const ENV = await getENV();
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
      const ENV = await getENV();
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
  }
};

export { API }; 
