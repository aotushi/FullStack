import baseAt from './.internal/baseAt.js'
import baseFlatten from './.internal/baseFlatten'

/**
 * Creates an array of values corresponding to `paths` of `objects`.
 * 
 * @category Object
 * @param {Object} object the object to iterate over.
 * @param {...baseAt(string|string[])} [paths] The property to pick.
 * @returns {Array} returns the picked values
 * @example
 * 
 * const object = {'a': [{'b': {'c':3}}, 4] }
 * at(object, ['a[0].b.c', 'a[1]'])
 * // => [3, 4]
 */

const at = (object, ...paths) => baseAt(object, baseFlatten(paths, 1))

export default at
