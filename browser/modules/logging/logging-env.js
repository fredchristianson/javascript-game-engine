/**
 * @fileoverview Uses ENV to configure Logger and LogWriters based
 * on env.json (or other loaded env files)
 * ENV can have a "logging" property.  It looks like
 *
 * ```
 * {
 *     "logging": {
 *       "levels": {
 *         "default": "debug",
 *         "test": "error",
 *         "testModule": "info"
 *       },
 *       "output": {
 *         "console": "debug",
 *         "window": "never",
 *         "api": {"level": "warn", "url":"/api/v1/log"}
 *       }
 *     }
 * }
 * ```
 *
 * logging.levels has a list of levels for modules. "default" is used for modules without a level.
 * The level name (e.g. "testModule") matches any module beginning with that value.
 * "testModule":"info" matches
 *     "testModule", "testModule1", "testModule.submodule", etc.
 *
 *  Every module uses the level with the longest match. So a module named
 *  "testModul" will use "test" level "error" but "testModule" will use "info"
 *
 *  Valid levels are case insensitive (debug, DEBUG, and DebuG are the same)
 *   debug
 *   info
 *   warn
 *   error
 *   assert
 *   always
 *   never
 *
 * There are 3 configurable output sources
 *   console  - writes to the browser console
 *   window - opens a new browser window for log messages
 *   api - sends log messages to the server
 *
 * All 3 can be a string level value.  
 * "api" can be a level, or an object with the level and a url to write
 * 
 * If the level is "never" for "window", a new window is not created.  For any other
 * level, a window will be opened when messages are logged even if the window
 * does not display them because of the level.
 *   
 */

import { ENV } from '../env.js';
import { STRING, TYPE } from '../helpers.js';
import { LOGLEVELS } from './log-level.js';

/**
 * Currently matches the start of the name parameter.
 * The compare is not case sensitive.
 * Can add wildcards or regex in the future.
 * @private
 * @param {String} name - module name to match
 * @param {String} partialName - configured module name
 * @returns {Boolean} true if name starts with partialName.
 */
function isNameMatch(name, partialName) {
    return STRING.startsWithNoCase(name, partialName);
}

/** @namespace LOGENV */
const LOGENV = {
    /**
     * Return the log level that best matches the moduleName parameter.
     *
     * @private
     * @param {String}  moduleName - module name to match
     * @returns {LogLevel} the level configured for the module
     */
    getConfiguredLogLevel: function (moduleName) {
        let level = null;

        const levels = LOGENV._getLevelConfiguration();
        if (TYPE.isType(levels, Object)) {
            let defaultLevel = null;
            let match = null;
            for (const entry of Object.entries(levels)) {
                const [module, level] = entry;
                if (STRING.isEqualNoCase(module, 'default')) {
                    defaultLevel = level;
                }
                if (isNameMatch(moduleName, module)) {
                    if (match == null || match.name.length < moduleName.length) {
                        match = { name: module, level: level };
                    }
                }
            }
            if (match != null) {
                level = LOGLEVELS.get(match.level);
            } else if (defaultLevel != null) {
                level = LOGLEVELS.get(defaultLevel);
            }
        }

        if (level == null) {
            level = ENV.isDebug ? LOGLEVELS.DEBUG : LOGLEVELS.WARN;
        }
        return level;
    },

    /**
     * returns the output level for the given writer type.  or default level
     * if not found
     *
     *
     * @private
     * @param {String} writerType - console, api, or window
     * @returns {LogLevel} the ENV LogLevel for the provided logger type
     */
    _getWriterLevel: function (writerType) {
        const defaultConf = LOGENV._getWriterConfiguration('default');
        const writerConf = LOGENV._getWriterConfiguration(writerType);

        return writerConf.level ?? defaultConf.level;
    },

    _getWriterConfiguration: function (writerType) {
        const logging = ENV.get('logging');
        let conf = {};
        if (logging != null && typeof TYPE.isType(logging, Object)) {
            const output = logging.output;
            if (TYPE.isType(output, Object)) {
                conf = output[writerType];
            }
        }
        if (STRING.isString(conf)) {
            conf = { level: conf };
        }
        return conf;
    },

    _getLevelConfiguration: function () {
        const logging = ENV.get('logging');

        if (logging != null && typeof TYPE.isType(logging, Object)) {
            const levels = logging.levels;
            return levels;
        }

        return null;
    }
};

export { LOGENV };