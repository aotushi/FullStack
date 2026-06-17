/**
 * this method creates a function that invokes `func` once it's called `n` or more times
 * 
 * 
 * @category Function
 * @param {number} n the number of calls before `func` is invoked
 * @param {Function} the function to restrict
 * @param {Function} returns the new restrict function
 * @example
 * 
 * 
 */

function after(n, func) {
  if (typeof func !== 'function') {
    return new TypeError('Expected a function')
  }
  n = n || 0
  return function (...args) {
    if (--n < 1) {
      return func.apply(this, args)
    }
  }
}

export default after
