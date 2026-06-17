import isSymbol from "../isSymbol";

/** Used as references for various `Number` constants */
const NAN = 0 / 0;

/**
 * the base implementation of `toNumber` which doesn't ensure correct conversion of binary, hexadecimal, or octal string values.
 * 
 * @private
 * @param {*} value the value to process
 * @returns {number} returns the number
 */

function baseToNumber(value) {
  if (typeof value === 'number') {
    return value
  }

  if (isSymbol(value)) {
    return NAN
  }
  return +value
}

export default baseToNumber
