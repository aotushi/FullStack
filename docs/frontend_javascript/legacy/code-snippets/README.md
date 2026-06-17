collect some  exercises from some websites, e.g, codewars,nowcoder,github...

### 30s snippets

#### Partial sum array

> partial sum array

```javascript
const arr = (...nums) =>
	nums.reduce((acc, n) => [n + acc.slice(-1)[0] || 0 ], [])
```



#### add class to HTML element

```javascript
const addClass = (el, className) => el.classList.add(className)
```



#### add days to date

```javascript
const addDaysToDate = (date, n) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  d.toISOString().split('T')
}
```



#### add minutes to date

```javascript
const addMinutesToDate = (date, n) => {
  const d = new Date(date);
  d.setTime(d.getTime() + n * 60000);
  return d.toISOString().split('.').replace('T', '')
}
```

#### add multiple listeners

```javascript
const addMultipleListeners = (el, types, listeners, options, useCapture) => {
  types.forEach(type => 
    el.addEventListener(type, listener, options, useCapture)  
  )
}
```
#### add styles to HTML element

```javascript
const addStyle = (el, styles) => Object.assign(el.style, styles);
```

#### add weekdays to date

```js
const addWeekDays = (startDate, count) =>
  Array.from({length:count}).reduce(date => {
    date = new Date(date.setDate(date.getDate()) + 1);

    if (date.getDay() % 6 === 0) 
      date = new Date(date.setDate(date.getDate() + (date.getDay() / 6 + 1)))
  }, startDate)
```

#### all

```js
const all = (arr, fn=Boolean) => arr.every(fn)
```

#### allEqual

```js
const allEqual = arr => arr.every(val => val === arr[0])
```

#### allEqualBy

```js
const allEqualBy = (arr, fn) => {
  const eql = fn(arr[0])
  return arr.every(val => fn(val) === eql)
}
```

#### allUnique

```js
const allUnique = arr => arr.length === new Set(arr).size;
```

#### allUniqueBy

```js
const allEqualBy = (arr, fn) => arr.length === new Set(arr.map(fn)).size;
```

#### and

```js
const and = (a, b) => a && b;
```

#### any

```js
const any = (arr, fn= Boolean) => arr.some(fn);
```

#### aperture

```js
const aperture = (n, arr) =>
  n > arr.length
    ? []
    : arr.slice(n-1).map((v, i) => arr.slice(i, i+n));
```

#### approximatelyEqual

```js
const approximatelyEqual = (v1, v2, epsilon=0.01) => 
  Math.abs(v1 - v2) < epsilon;
```

#### arithmeticProgression

```js
const arithmeticProgression = (n, lim) =>
  Array.from({length: Math.ceil(lim/n)}, (_, i) => (i+1)*n);
```

#### arrayToHTMLList

```js
const arrayToHTMLList = (arr, listID) =>
  document.querySelector(`#${listID}`)
    .map(item => `<li>${item}</li>`)
    .join('');
```

#### ary

```js
const ary = (fn, n) => (...args) => fn(...args.slice(0, n));
```

#### assertValidateKeys

```js
const assertValidateKeys = (obj, keys) =>
  Object.keys(obj).every(v => keys.includes(v));
```

#### atob

```js
const atob = str => Buffer.from(str, 'base64').toString('binary');
```

#### attempt

```js
const attempt = (fn, ...args) => {
  try {
    return fn(...args);
  } catch(e) {
    return e instanceof Error ? e : new Error(e);
  }
}
```

#### average 

```js
const average = (...nums) => 
  return nums.reduce((acc, crt) => acc + crt, 0) / nums.length;
```

#### averageBy

```js
const averageBy = (arr, fn) =>
  arr
    .map(typeof fn === 'function' ? fn : val => val[fn])
    .reduce((acc, crt) => acc + crt, 0) / arr.length;
```

#### bifurcate

```js
const bifurcate = (arr, filter) =>
  arr.reduce((acc, crt, i) => (acc[ filter[i] ? 0 : 1].push(val), acc),
    [
      [],
      []
    ]
  )
```

#### bifurcateBy

```js
const bifurcateBy = (arr, fn) =>
  arr.reduce((acc, crt, i) => (acc[fn(crt, i) ? 0 : 1].push(crt), acc), [
    [],
    []
  ])
```

#### binary

```js
const binary = fn => (a, b) => fn(a, b);
```

#### binarySearch

```js
const binarySearch = (arr, fn) => {
  let l = 0,
      r = arr.length - 1;
  while (l <= r) {
    const mid = Math.floor((l+r)/2);
    const guess = arr[mid];
    if (guess === mid) return mid;
    if (guess > mid) r = mid - 1;
    else l = mid + 1;
  }
  return -1;
}
```

#### bind

```js
const bind = (fn, context, ...boundArgs) =>
  fn.apply(context, [...boundArgs, ...arguments]);
```

#### bindAll

```js
const bindAll = (obj, ...fns) =>
  fns.forEach(
    fn =>
      (f=obj[fn]),
      (obj[fn] = function() {
        return f.apply(obj);
      })
  )
```

#### bindKey

```js
const bindKey = (context, fn, ...boundArgs) => (...args) =>
  context[fn].apply(context, [...boundArgs, ...args]);
```

#### binomialCoefficient
(不是很理解)

```js
const binomialCoefficient = (n, k) => {
  if (Number.isNaN(n) || Number.isNaN(k)) return NaN;
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k === 1 || k === n-1) return n;
  if (n - k < k) k = n - k;
  let res = n;
  for (let j=2; j <= k; j++) res *= (n-j+1) / j;
  return Math.round(res);
}
```

#### both

```js
const both = (f, g) => (...args) => f(...args) && g(...args);
```

#### bottomVisible

```js
const bottomVisible = () =>
  document.documentElement.clientHeight + window.scrollY >=
  (document.documentElement.scrollHeight ||
    document.documentElement.clientHeight)
```

#### btoa

```js
const btoa = str => Buffer.from(str, 'binary').toString('base64');
```

#### bubbleSort

```js
const bubbleSort = arr => {
  let swapped = false;
  const a = [...arr];
  for (let i=1; i<arr.length; i++) {
    swapped = false;
    for (let j=0; j<arr.length - 1; j++) {
      if (arr[j] > arr[j+1]) {
        [ arr[j], arr[j+1] ] = [ arr[j+1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) return a;
  }
  return a;
}
```

#### bucketSort

```js
const bucketSort = (arr, size=5) => {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const buckets = Array.from(
    {length: Math.floor((max - min) / size) + 1},
    () => []
  );
  arr.forEach( val => {
    buckets[Math.floor((val - min) / size)].push(val);
  });
  return buckets.reduce((acc, crt) => [...acc, ...crt.sort((a, b) => a - b)], []);
}
```

#### byteSize

```js
const byteSize = str => new Blob([str]).size;
```

#### caesarCipher
!!!
```js
const caesarCipher = (str, shift, decrypt = false ) => {
  const s = decrypt ? (26 - shift) % 26 : shift;
  const n = s > 0 ? s : 26 + (s % 26);
  return [...str]
    .map((v, i) => {
      const c = str.charCodeAt(i);
      if (c >= 65 && c <= 90)
        return String.fromCharCode(((c - 65 + n) % 26) + 65);
      if (c >= 97 && c <= 122)
        return String.fromCharCode(((c - 65 +n ) % 26) + 65);
      return v;
    })
    .join('');
};
```

#### call

```js
const call = (key, ...args) => context => context[key](...args);
```

#### callOrReturn

```js
const callOrReturn = (fn, ...args) =>
  typeof fn === 'function' ? fn(...args) : fn;
```

#### capitalize

```js
const capitalize = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() +
  (lowerRest ? rest.join('').toLowerCase() : rest.join(''));
```

#### castArray

```js
const castArray = val => (Array.isArray(val) ? val : [val]);
```

#### celsiusToFahrenheit

```js
const celsiusToFahrenheit = degrees => 1.8 * degrees + 32;
```

#### chainAsync

```js
const chainAsync = fns => {
  let curr = 0;
  const last = fns[fns.length - 1];
  const next = () => {
    const fn = fns[curr++];
    fn === last ? fn() : fn(next);
  }
}
```

#### changeLightness

```js
const changeLightness = (delta, hslStr) => {
  const [hue, saturation, lightness] = hslStr.match(/\d/g).
    map(Number);

  const newLightness = Math.max(
    0,
    Math.min(100, lightness + parseFloat(delta))
  );

  return `hsl(${hue}, ${saturation}%, ${newLightness}%)`
}
```

#### checkProp

```js
const checkProp = (predicate, prop) => obj => !!predicate(obj[prop]);
```

#### chunk

```js
const chunk = (arr, size) =>
  Array.from(
    {length: Math.ceil(arr.length / size)},
    (v, i) => arr.slice( i * size, i * size + size)
  );
```

#### chunkif

```js
const chunkif = function* (itr, size) {
  let chunk = [];
  for (const v of itr) {
    chunk.push(v);
    if (chunk.length === size) {
      yield chunk;
      chunk = [];
    }
  }
  if (chunk.length) yield chunk;
}
```

#### chunkIntoN

```js
const chunkIntoN = (arr, n) => Array.from(
  {length: Math.ceil( arr.length / n)},
  arr.slice(i * n, i * n + n)
)
```

#### clampNumber

```js
const clampNumber = (num, a, b) =>
  Math.max(
    Math.min(a, b),
    Math.min(num, Math.max(a, b))
  )
```

#### cloneRegExp

```js
const cloneRegExp = regExp = new RegExp(regExp.source, regExp.flags)
```

#### closet

```js
const closet = (arr, n) =>
  arr.reduce((acc, crt) => (Math.abs(acc - n) > Math.abs(crt - n) ? num : acc));
```

#### coalesce

```js
const coalesce = (...args) => args.find(v => ![undefined, null].includes(v));
```

#### coalesceFactory

```js
const coalesceFactory = valid => (...args) => args.find(valid);
```

#### collectInto ??

```js
const collectInto = fn => (...args) => fn(args);
```

#### colorize !!

```js
const colorize = (...args) => ({
  black: `\x1b[30m${args.join(' ')}`,
  red: `\x1b[31m${args.join(' ')}`,
  green: `\x1b[32m${args.join(' ')}`,
  yellow: `\x1b[33m${args.join(' ')}`,
  blue: `\x1b[34m${args.join(' ')}`,
  magenta: `\x1b[35m${args.join(' ')}`,
  cyan: `\x1b[36m${args.join(' ')}`,
  white: `\x1b[37m${args.join(' ')}`,
  bgBlack: `\x1b[40m${args.join(' ')}\x1b[0m`,
  bgRed: `\x1b[41m${args.join(' ')}\x1b[0m`,
  bgGreen: `\x1b[42m${args.join(' ')}\x1b[0m`,
  bgYellow: `\x1b[43m${args.join(' ')}\x1b[0m`,
  bgBlue: `\x1b[44m${args.join(' ')}\x1b[0m`,
  bgMagenta: `\x1b[45m${args.join(' ')}\x1b[0m`,
  bgCyan: `\x1b[46m${args.join(' ')}\x1b[0m`,
  bgWhite: `\x1b[47m${args.join(' ')}\x1b[0m`
});
```


#### combine

```js
const combine = (a, b, prop) => 
  Object.values(...a, ...b).reduce((acc, crt) => {
    if (crt[prop]) {
      acc[ crt[prop] ] = acc[ crt[prop] ]
        ? {...acc[crt[prop]], ...crt}
        : {...crt};
    }
    return acc;
  }, {})

```

#### commonKeys

```js
const commonKeys = (obj1, obj2) =>
  Object.keys(obj1).filter(key => obj2.hasOwnProperty(key));
```

#### compact

```js
const compact = arr => arr.filter(Boolean);
```

#### compactJoin

```js
const compactJoin = (arr, delim=',') => arr.filter(Boolean).join(delim);
```

#### compactObject

```js
const compactObject = val => {
  const data = Array.isArray(val)
    ? val.filter(Boolean).join('')
    : val;
  return Object.keys(val).reduce(
    (acc, key) => {
      const value = data[key]
      if (Boolean(value)) {
        acc[key] = typeof value === 'object'
          ? compactObject(value)
          : value;
      }
      return acc;
    },
    Array.isArray(key) ? [] : {}
  )
}
```

#### compactWhitespace

```js
const compactWhitespace = str = str.replace(/\s{2,}/g, ' ');
```

#### complement

```js
const complement = fn => (...args) => !fn(...args);
```

#### compose ???

```js
const compose = (...fns) =>
  fns.reduce((f, g) => (...args) => f(g(...args)))
```

#### composeRight

```js
const composeRight = (...fns) =>
  fns.reduce((f, g) => (...args) => g(f(...args)));
```

#### containWhitespace

```js
const containWhitespace = str => /\s/.test(str);
```

#### converge

```js
const converge = (converge, fns) => (...args) =>
  converge(...fns.map(fn => fn.apply(null, args)))
```

#### copySign

```js
const copySign = (x, y) => Math.sign(x) === Math.sign(y) ? x: -1;
```

#### copyToClipboard

```js
const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected = 
    document.getSelection().rangeCount() > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRange();
    document.getSelection().addRange(selected);
  }
};
```

#### copyToClipboardAsync

```js
const copyToClipboardAsync = str => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(str);
  return Promise.reject('The Clipboard API is not available.');
};
```


#### countBy

```js
const countBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
```
#### counter ???

```js
counter('#my-id', 1, 1000, 5, 2000);
// Creates a 2-second timer for the element with id="my-id"
```

```js
const counter = (selector, start, end, step = 1, duration = 2000) => {
  let current = start,
      _step = (end - start) * step < 0 ? -step : step,
      timer = setInterval(() => {
        current += _step;
        document.querySelector(selector).innerHTML = current;
        if (current >= end) document.querySelector(selector).innerHTML = end;
        if (current >= end) clearInterval(timer);
      }, Math.abs(Math.floor(duration / (end - start))));
  return timer;
}
```


#### countOccurrences

```js
countOccurrences([1, 1, 2, 1, 2, 3], 1); // 3
```

```js
const countOccurrences = (arr, val) => arr.reduce((acc, crt) => crt === val ? acc+1 : acc, 0)
```

#### countSubstring
```js
countSubstrings('tiktok tok tok tik tok tik', 'tik'); // 3
countSubstrings('tutut tut tut', 'tut'); // 4
```

```js
const countSubstrings = (str, searchValue) => {
  let count = 0,
      i = 0;

  while(true) {
    const r = str.indexOf(searchValue, i);
    if (r !== -1) [count, i ] = [count+1, r+1];
    else return count;
  }
}
```

#### countWeekDaysBetween
```js
countWeekDaysBetween(new Date('Oct 05, 2020'), new Date('Oct 06, 2020')); // 1
countWeekDaysBetween(new Date('Oct 05, 2020'), new Date('Oct 14, 2020')); // 7
```

```js
const countWeekDaysBetween = (startDate, endDate) =>
  Array
    .from({length: (endDate - startDate) / (1000*3600*24)})
    .reduce(count => {
      if (startDate.getDay() % 6 !== 0) count++;
      startDate = new Date(startDate.setDate(startDate.getDate() + 1));
      return count;
    }, 0)
```

#### createDirIfNotExists

```js
createDirIfNotExists('test');
// creates the directory 'test', if it doesn't exist
```

```js
const fs = require('fs');

const createDirIfNotExists = dir =>
  !fs.existsSync(dir) ? fs.mkdirSync(dir) : undefined;
```

#### createElement

```js
const el = createElement(
  `<div class="container">
    <p>Hello!</p>
  </div>`
);
console.log(el.className); // 'container'
```
```js
const createElement = str => {
  const el = document.createElement('div');
  el.innerHTML = str;
  return el.firstElementChild;
}
```


#### createEventHub

```js
const handler = data => console.log(data);
const hub = createEventHub();
let increment = 0;

// Subscribe: listen for different types of events
hub.on('message', handler);
hub.on('message', () => console.log('Message event fired'));
hub.on('increment', () => increment++);

// Publish: emit events to invoke all handlers subscribed to them, passing the data to them as an argument
hub.emit('message', 'hello world'); // logs 'hello world' and 'Message event fired'
hub.emit('message', { hello: 'world' }); // logs the object and 'Message event fired'
hub.emit('increment'); // `increment` variable is now 1

// Unsubscribe: stop a specific handler from listening to the 'message' event
hub.off('message', handler);
```

```js
const createEventHub = () => ({
  hub: Object.create(null),
  emit(event, data) {
    (this.hub[event] || []).forEach(handler => handler(data))
  },
  on(event, handler) {
    if (!this.hub[event]) this.hub[event] = [];
    this.hub[event].push(handler)
  },
  off(event, handler) {
    const i = (this.hub[event] || []).findIndex(h => h === handler);
    if (i > -1) this.hub[event].splice(i, 1);
    if (this.hub[event].length === 0) delete this.hub[event];
  }
})
```


#### CSVToJSON

```js
CSVToJSON('col1,col2\na,b\nc,d');
// [{'col1': 'a', 'col2': 'b'}, {'col1': 'c', 'col2': 'd'}];
CSVToJSON('col1;col2\na;b\nc;d', ';');
// [{'col1': 'a', 'col2': 'b'}, {'col1': 'c', 'col2': 'd'}];
```

```js
const CSVToJSON = (data, delimiter = ',') => {
  const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
  return data
    .slice(data.indexOf('\n') + 1)
    .split('\n')
    .map(v => {
      const values = v.split(delimiter);
      return titles.reduce(
        (obj, title, index) => ((obj[title] = values[index]), obj),
        {}
      )
    })
}
```

#### currentURL


```js
const currentURL = () => Window.location.href;
```

```js
currentURL(); // 'https://www.google.com/'
```


#### curry

```js
curry(Math.pow)(2)(10); // 1024
curry(Math.min, 3)(10)(50)(2); // 2
```
```js
const curry = (fn, arity = fn.length, ...args) =>
  arity <= args.length ? fn(...args) : curry.bind(null, fn, arity, ...args);
```


#### cycleGenerator

```js
const binaryCycle = cycleGenerator([0, 1]);
binaryCycle.next(); // { value: 0, done: false }
binaryCycle.next(); // { value: 1, done: false }
binaryCycle.next(); // { value: 0, done: false }
binaryCycle.next(); // { value: 1, done: false }
```

```js
const cycleGenerator = function *(ar) {
  let i = 0
  while(true) {
    yield arr[i % arr.length]
    i++;
  }
}
```

#### dateRangeGenerator

```js
[...dateRangeGenerator(new Date('2021-06-01'), new Date('2021-06-04'))];
// [ 2021-06-01, 2021-06-02, 2021-06-03 ]
```
```js
const dateRangeGenerator = function *(start, end, step = 1) {
  let d = start;
  while (d < end) {
    yield new Date(d);
    d.setDate(d.getDate + step)
  }
}
```

#### dayName

```js
const dayName = (date, locale) =>
  date.toLocaleDateString(locale, {weekday: 'long'});
```

#### dayOfYear

```js
const dayOfYear = date =>
  Math.floor((date - new Date(date.getFullYear(), 0, 0)) /1000*60*60*24);
```

#### daysAgo

```js
const daysAgo = n => {
  let d = new Date();
  d.setDate(d.getDate() - Math.abs(n));
  return d.toISOString().split('T')[0];
}
```

#### daysFromNow

```js
const daysFromNow = n => {
  const d = new Date();
  d.setDate(d.getDate() + Math.abs(n));
  return d.toISOString().split('T')[0];
}
```

```js
daysFromNow(5); // 2020-10-13 (if current date is 2020-10-08)
```

#### daysInMonth

```js
daysInMonth(2020, 12)); // 31
daysInMonth(2024, 2)); // 29
```

```js
const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
```

#### debounce

```js
const debounce = (fn, time = 0) => {
  let timeId;
  return function(...args) {
    clearTimeout(timeId);
    timeId = setTimeout(() => fn.apply(this, args), time);
  }
}
```

#### debouncePromise

```js
const debouncePromise = (fn, ms = 0) => {
  let timeoutId;
  const pending = [];
  return (...args) =>
    new Promise((res, rej) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentPending = [...pending];
        pending.length = 0;
        Promise.resolve(fn.apply(this, args)).then(
          data => {
            currentPending.forEach(({ resolve }) => resolve(data));
          },
          error => {
            currentPending.forEach(({ reject }) => reject(error));
          }
        );
      }, ms);
      pending.push({ resolve: res, reject: rej });
    });
};
```

```js
const fn = arg => new Promise(resolve => {
  setTimeout(resolve, 1000, ['resolved', arg]);
});
const debounced = debouncePromise(fn, 200);
debounced('foo').then(console.log);
debounced('bar').then(console.log);
// Will log ['resolved', 'bar'] both times
```


#### decapitalize


```js
const decapitalize = ([first, ...rest], upperRest = false) =>
  first.toUpperCase() +
  (upperRest ? rest.join('').toUpperCase() : rest.join(''));
```


```js
decapitalize('FooBar'); // 'fooBar'
decapitalize('FooBar', true); // 'fOOBAR'
```

#### deepClone

```js
const deepClone = obj => {
  if (typeof obj === null) return obj
  let clone = Object.assign({}, obj)
  Object.keys(clone).forEach(
    key =>
      (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  )
  if (Array.isArray(obj)) {
    clone.length = obj.length
    return Array.from(clone)
  }
  return clone
}
```

#### deepFlatten

```js
const deepFlatten = arr => {
  return [].concat(...arr.map(v => Array.isArray(v) ? deepFlatten(v) : v))
}
```

#### deepFreeze

```js
const deepFreeze = obj => {
  Object.keys(obj).forEach(key =>
    if (typeof obj[key] === 'object') {
      deepFreeze(obj[key])
    }
  )
  return Object.freeze(obj)
}
```

#### deepGet

```js
const deepGet = (obj, keys) =>
  keys.reduce(
    (xs, x) => (xs && xs[x] !== null && xs[x] !== undefined ?
    xs[x] : null),
    obj
  )
```

#### deepMapKeys

```js
const deepMapKeys = (obj, fn) =>
  Array.isArray(obj)
    ? obj.map(val => deepMapKeys(val, fn))
    : typeof obj === 'object'
    ? Object.keys(obj).reduce((acc, current) => {
      const key = fn(current);
      const val = obj[current]
      acc[key] = 
        val !== null && typeof val === 'object' ? deepMapKeys(val, fn) : val;
      return acc;
      }, {})
    :obj

```

#### deepMerge

```js
const deepMerge = (a, b, fn) =>
  [...new Set([...Object.keys(a), ...Object.keys(b)])].reduce(
    (acc, key) => ({ ...acc, [key]: fn(key, a[key], b[key])})
  ,{}
  )
```

```js
deepMerge(
  { a: true, b: { c: [1, 2, 3] } },
  { a: false, b: { d: [1, 2, 3] } },
  (key, a, b) => (key === 'a' ? a && b : Object.assign({}, a, b))
);
// { a: false, b: { c: [ 1, 2, 3 ], d: [ 1, 2, 3 ] } }
```

#### defaults

```js
const defaults = (obj, ...defs) =>
  Object.assign({}, obj, ...defs.reverse(), obj)
```

```js
defaults({ a: 1 }, { b: 2 }, { b: 6 }, { a: 3 }); // { a: 1, b: 2 }
```

#### 



#### lodash





### codeWars

