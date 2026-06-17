/**
 * @title  Partial sum array
 * @what creates an array of partial sum
 * @how
 *  - use `Array.prototype.reduce()`, initialized with an empty array accumulator to iterate over `nums`.
 *  - use `Array.prototype.slice()` to get the previous sum or `0` and add the current element to it.
 *  - use the spread operator(`...`) to add the new partial sum to the accumulator array containing the previous sums.
 */


const accumulate = (...nums) =>
  nums.reduce((acc, n) => [...acc, n + (acc.slice(-1) || 0)], []);


accumulate(1, 2, 3, 4); //[1,3,6,10]
accumulate([1, 2, 3, 4]); //[1,3,6,10]


