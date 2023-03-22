import { ASSERT } from '../assert.js';
import { STRING, UTIL } from '../helpers.js';

export function appendPath(path, add) {
  ASSERT.isTrue(STRING.isNotEmpty(path), 'URL.appendPath requires a path');
  ASSERT.isTrue(STRING.isNotEmpty(add), 'URL.appendPath requires add parameter');
  const parts = add.split('/');
  while (parts.length > 0) {
    let part = parts.shift();
    if (part == '..') {
      path = URL.removeLastPath(path);
    } else {
      let slash = '/';
      if (path.slice(-1) == '/') {
        slash = '';
        if (part[0] == '/') {
          part = part.substring(1);
        }
      }
      if (part[0] == '/') {
        slash = '';
      }
      if (part.length > 0) {
        path = `${path}${slash}${part}`;
      }
    }
  }
  return path;
}

export function combine(...args) {
  ASSERT.isType(args, Array, 'URL.combine requires parameters');
  ASSERT.notEmpty(args, 'URL.combine requires path components');
  let path = args.shift();
  while (args.length > 0) {
    const part = args.shift();
    if (part[0] == '/') {
      path = part;
    } else {
      path = URL.appendPath(path, part);
    }
  }
  return path;
}

export function addQueryParams(url, queryParams) {
  if (UTIL.isNullish(queryParams)) {
    return; // nothing to append
  }
  ASSERT.isType(url, 'string');
  ASSERT.isType(queryParams, Object, 'queryParams must be an object');
  const parts = ['?'];
  for (const [name, value] of Object.entries(queryParams)) {
    parts.push(name);
    parts.push('=');
    parts.push(value);
  }
  return url + parts.join('');
}

export const URL = { appendPath, combine, addQueryParams };
