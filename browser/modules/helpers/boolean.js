import { STRING } from './string.js';

export const BOOLEAN = {
  isTrue: function (value) {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value == 'number') {
      return value != 0;
    }
    if (typeof value == 'string') {
      return STRING.isEqualNoCase(value, 'true') || STRING.isEqualNoCase(value, 't');
    }
    return false;
  },
  isFalse: function (value) {
    return !BOOLEAN.isTrue(value);
  }
};
