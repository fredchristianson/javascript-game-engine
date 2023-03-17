import { ENV } from '../env.js';
import { URL } from './url.js';
import { resourceManager } from './resource-manager.js';
import { createLogger } from '../logging.js';
const logger = createLogger("API");

export async function get(apiName, params = {}) {
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
}

export async function post(apiName, body) {
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
}

export const API = { get, post };
