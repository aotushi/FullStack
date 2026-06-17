/**
 * @what Add days to date
 * @how
 *  - Use the `Date` constructor to create a `Date` object from the first argument.
 *  - Use `Date.prototype.getDate()` and `Date.prototype.setDate()` to add `n` days to the given days.
 *  - Use `Date.prototype.toISOString()` to return a string in `yyyy-mm-dd` format.
 */

const addDaysToDate = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

```js
addDaysToDate('2020-10-15', 10); // '2020-10-25'
addDaysToDate('2020-10-15', -10); // '2020-10-05'
```
