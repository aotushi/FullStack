const toString = Object.prototype.toString

/**
 * get the `toString` of `value`
 * 
 * @primitive 
 * @param {*} value The value to query
 * @returns {string} Returns the `toString`
 */

function getTag(value) {
  // if check is unnecessary
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return toString.call(value)
}


export default getTag
