
export function isNull(value) {
  return value === null || typeof value == 'undefined';
}

export function isEmpty(value) {
  return (
    STRING.isNull(value) || typeof value != 'string' || value.length == 0
  );
}
export function isNotEmpty(value) {
  return (value != null && typeof value == 'string' && value.length > 0);
}

export function isString(value) {
  return typeof value == 'string';
}

export function isEqualNoCase(first, second) {
  if (!STRING.isString(first) || !STRING.isString(second)) {
    return false;
  }
  return first.localeCompare(second, undefined, { sensitivity: 'accent' }) == 0;
}

export function startsWithNoCase(value, start) {
  if (
    !STRING.isString(value) ||
    !STRING.isString(start) ||
    value.length < start.length
  ) {
    return false;
  }
  return STRING.isEqualNoCase(value.substring(0, start.length), start);
}

export function htmlElementToString(item) {
  const parts = [];
  const tag = item.tagName;
  parts.push('[');
  parts.push(tag);
  if (item.id) {
    parts.push('#');
    parts.push(item.id);
  }

  const classes = item.classList;
  classes.forEach((c) => {
    parts.push('.');
    parts.push(c);
  });
  parts.push(']');
  return parts.join('');
}

export function jsonToString(object) {
  const seen = [];
  const deCycle = function (key, val) {
    if (val != null && typeof val === 'object') {
      if (seen.includes(val)) {
        return '...';
      }
      seen.push(val);
    }
    return val;
  };

  const result = toJsonString(object, deCycle, 2);
  return result;
}

export function toString(value) {
  if (value === null || typeof value == 'undefined') {
    return '[null]';
  }
  if (STRING.isString(value)) {
    return value;
  }
  if (typeof value.getHTMLElement == 'function') {
    value = value.getHTMLElement();
  }
  if (value instanceof HTMLElement) {
    return htmlElementToString(value);
  }
  if (typeof value.toString == 'function') {
    const text = value.toString();
    if (text != '[object Object]') {
      /*
       * if the object has overridden the base .toString() return it.
       * otherwise convert to JSON
       */
      return text;
    }
  }
  return toJsonString(value);

}


const STRING = {
  isNull,
  isEmpty,
  isNotEmpty,
  isString,
  isEqualNoCase,
  startsWithNoCase,
  toString,
  htmlElementToString,
  toJsonString
};

export { STRING };