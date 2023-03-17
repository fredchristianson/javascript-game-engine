/* Do not import other modules in these helpers.
 * Any module that uses helpers will casue
 * an import cycle if these module import other modules.
 */

export function isNullish(value) {
  return value === null || typeof value === 'undefined';
}

export function toArray(item) {
  if (isNullish(item)) {
    return [];
  }
  if (Array.isArray(item)) {
    return item; // alread an array;
  }
  return [item];
}

export function isEmpty(item) {
  if (isNullish(item)) { return true; }
  if (typeof item == 'string') {
    return item.length == 0;
  }
  if (Array.isArray(item)) {
    return item.length == 0;
  }
  if (item instanceof Map) {
    return item.size == 0;
  }
  if (typeof item == 'object') {
    return Object.keys(item).length == 0;
  }
  ASSERT.fail("Unknown item type for isEmpty");
}

function join(listA, listB) {
  if (isNullish(listA[Symbol.iterator]) ||
    isNullish(listB[Symbol.iterator])) {
    // cannot use logging so write to the console.
    console.warn("join called with non-iterable");
    return [];
  };
  const result = [...listA].reduce((pairs, valueA) => {
    const aPairs = [...listB].map(valueB => { return [valueA, valueB] });
    pairs.push(...aPairs);
    return pairs;
  }, []);
  return result;
}

export const UTIL = {
  isNullish,
  toArray,
  isEmpty,
  join
};
