import castPath from './castPath.js'
import toKey from './toKey.js'

/**
 * the base implementation of `get` without support for default value
 * 
 * 
 * @private
 * @params {Object} object the object to query
 * @params {Array|string} path the path of the property to get
 * @returns {*} returns the resolved value
 */
function baseGet(object, path) {
  path = castPath(path, object)

  let index = 0
  const length = path.length

  while (object != null && index < length) {
    object = object[toKey(path[index++])]
  }
  return (index && index == length) ? object : undefined
}
export default baseGet
