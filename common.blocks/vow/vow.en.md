# vow

This block provides a thin compatibility wrapper around native `Promise`.

Starting from version 5.0, the full [Vow](https://github.com/dfilatov/vow) library has been replaced with native ES2024+ equivalents.

## Usage

```js
import vow from 'bem:vow';

// Create a deferred
const defer = vow.defer();
defer.promise().then(value => console.log(value));
defer.resolve('ok');

// Promise.all
vow.all([promise1, promise2]).then(results => { /* ... */ });

// Check for thenable
vow.isPromise(value); // true/false
```

## API

| Method | Native equivalent |
|--------|-------------------|
| `vow.resolve(value)` | `Promise.resolve(value)` |
| `vow.reject(reason)` | `Promise.reject(reason)` |
| `vow.all(iterable)` | `Promise.all(iterable)` |
| `vow.allResolved(iterable)` | `Promise.allSettled(iterable)` |
| `vow.any(iterable)` | `Promise.any(iterable)` |
| `vow.anyResolved(iterable)` | `Promise.race(iterable)` |
| `vow.defer()` | `Promise.withResolvers()` |
| `vow.when(value, fn)` | `Promise.resolve(value).then(fn)` |
| `vow.invoke(fn, ...args)` | try/catch + `Promise.resolve()` |

## Public block technologies

The block is implemented in:

* `vanilla.js`
