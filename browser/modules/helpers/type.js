export function isType(value, type) {
  if (value === null ||
    typeof value == 'undefined' ||
    type === null ||
    typeof type == null) {
    return false;
  }
  if (Array.isArray(type)) {
    let match = type.find(t => { return isType(value, t); });
    return match;
  }
  if (typeof value == 'object' && typeof type == 'function') {
    return value instanceof type;
  }
  if (type == 'Module') {
    return isModule(value);
  }
  return typeof value === type;
}

export function isModule(object) {
  if (object == null || typeof object !== 'object') {
    return false;
  }
  // this isn't a great solution, but the only way to test if an object
  // is a Module
  return Object.prototype.toString.call(object) === '[object Module]';
}

export const TYPE = {
  isType,
  isModule
};
