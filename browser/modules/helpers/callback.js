import { ASSERT } from '../assert.js';
import { FUNCTION } from './function.js';
import { OBJECT } from './object.js';
import { TYPE } from './type.js';
import { UTIL } from './util.js';

class Callback {
    constructor(obj, func, data = null) {
        this._object = obj;
        this._function = func;
        this._data = data;
    }

    async call(...args) {
        return await this._function.apply(this._object, [...args, ...this._data ?? []]);
    }
}
/** @namespace CALLBACK */
const CALLBACK = {

    create: function (...args) {
        ASSERT.notNull(args, 'CALLBACK.create requires arguments');
        ASSERT.isTrue(!UTIL.isEmpty(args), 'a function is required.');
        let obj = null;
        let func = null;
        let data = null;
        if (TYPE.isType(args[0], Callback)) {
            return args[0];
        }
        if (OBJECT.isObject(args[0])) {
            obj = args.shift();
        }
        if (FUNCTION.isFunction(args[0])) {
            func = args.shift();
        }
        data = args;
        return new Callback(obj, func, data);
    }
};

export { CALLBACK };