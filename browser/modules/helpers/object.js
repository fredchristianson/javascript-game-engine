
export function isNull(value) {
  return value === null || typeof value == 'undefined';
}

export function isEmpty(value) {
  return value == null || typeof value != 'object' || Object.keys(value).length == 0;

}
export function isObject(value) {
  // an array is an object, but when the caller wants an object, 
  // a name/value property container is what they want, not an array
  return !this.isNull(value) && typeof value == 'object' && !Array.isArray(value);
}

/*
* addNewProperties does a deep copy of all properties in 
* newProperties if they do not already exist in value.
*/
export function addNewProperties(value, newProperties) {
  if (!isObject(value) || !isObject(newProperties)) {
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

export const OBJECT = {
  isNull,
  isObject,
  isEmpty,
  addNewProperties
};
