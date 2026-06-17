import memoizeCapped from './memoizeCapped.js'

const charCodeOfDot = '.'.charCodeAt(0)
const reEscapeChar = /\\(\\)?/g
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket
  '[^.[\\]]+' + '|' +
  // or match property names within brackets.
  '\\[(?:' +
  //Match a non-string expression
  '([^"\'][^[]*)' + '|' +
  // or match strings (supports escaping characters).
  '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' + ')\\]' + '|' +
  //or match "" as the space between consecutive dots or empty brackets.
  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
  , 'g')

/**
 * converts `string` to a property path array.
 * 
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} returns the property array.
 */

