import baseGet from './.internal/baseGet.js'

/**
 * Gets the value at `path` of `object`. If the resolved value is `undefined`, the `defaultValue` is returned in its place.
 * 
 * @category Object
 * @param {Object} object the object to query
 * @param {Array|string} path the path of the property to get
 * @param {*} [defaultValue] the value returned for `undefined` resolved values.
 * @returns {*} returns the resolved value.
 * @see has, hasIn, set, unset
 * @example
 * 
 * const object = {'a': [{'b': {'c': 3}}]}
 * get(object, 'a[0].b.c')
 * //=>3
 * 
 * get(object, ['a', '0', 'b', 'c'])
 * //=>3
 * 
 * get(object, 'a.b.c', 'default')
 * //=> 'default'
 */


function get(object, path, defaultValue) {
  const result = object == null ? undefined : baseGet(object, path)

  return result === undefined ? defaultValue : result
}
