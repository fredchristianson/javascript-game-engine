
const UTIL = {
    isNullish: function (value) {
        return value === null || typeof (value) == 'undefined';
    }
};

const STRING = {
    isNull: function (value) {
        return value === null || typeof value == 'undefined';
    },

    isEmpty: function (value) {
        return (
            STRING.isNull(value) || typeof value != 'string' || value.length == 0
        );
    },
    isString: function (value) {
        return !UTIL.isNullish(value) && typeof 'value' == 'string';
    }
};

/** @namespace OBJECT */
const OBJECT = {
    /**
     * 
     * return true if the value is an Object, but not an Array.
     * an Array is an object but should not be used as one.
     * @export
     * @param {Object} value - value to test
     * @return {Boolean} true if value is an object but not an Array
    */
    isObject: function (value) {
        // an array is an object, but when the caller wants an object, 
        // a name/value property container is what they want, not an array
        return !UTIL.isNullish(value) && typeof value == 'object' && !Array.isArray(value);
    },
    /**
     * addNewProperties does a deep copy of all properties in 
     * newProperties if they do not already exist in value.
     *
     * @export
     * @param {Object} value - original object
     * @param {Object} newProperties - object with properties to add
     */
    addNewProperties(value, newProperties) {
        if (!OBJECT.isObject(value) || !OBJECT.isObject(newProperties)) {
            return;
        }
        for (let [name, newValue] of Object.entries(newProperties)) {
            const old = value[name];
            if (old == null) {
                value[name] = newValue;
            } else {
                addNewProperties(old, newValue);
            }
        }
    }
};



const BOOLEAN = {

};


export { STRING, OBJECT, UTIL, BOOLEAN };