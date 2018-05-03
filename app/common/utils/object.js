import _zipObject from 'lodash/zipObject';

export const enumerable = (...items) => _zipObject(items, items);
