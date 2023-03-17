


function isFunction(value) {
  if (typeof value === 'function') {
    return true;
  }
  return false;
}

/* return all methods an object has, not including Object methods.
  This includes:
    1) functions added to the object after it was created
    2) functions in the class (if created by new)
    3) functions in base classes that have not been overriden
*/
function getMethods(object) {
  const methods = new Map();
  let proto = object;

  while (proto != null && proto.constructor != Object) {
    for (let name of Object.getOwnPropertyNames(proto)) {
      const value = proto[name];
      if (isFunction(value) && methods[name] == null) {
        methods.set(name, value);
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
  return methods;
}

export const FUNCTION = {
  isFunction,
  getMethods
};
