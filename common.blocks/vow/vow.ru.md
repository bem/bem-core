# vow

Блок предоставляет тонкую обёртку совместимости над нативным `Promise`.

Начиная с версии 5.0, полная библиотека [Vow](https://github.com/dfilatov/vow) заменена на нативные ES2024+ эквиваленты.

## Использование

```js
import vow from 'bem:vow';

// Создать deferred
const defer = vow.defer();
defer.promise().then(value => console.log(value));
defer.resolve('ok');

// Promise.all
vow.all([promise1, promise2]).then(results => { /* ... */ });

// Проверка на thenable
vow.isPromise(value); // true/false
```

## API

| Метод | Нативный эквивалент |
|-------|---------------------|
| `vow.resolve(value)` | `Promise.resolve(value)` |
| `vow.reject(reason)` | `Promise.reject(reason)` |
| `vow.all(iterable)` | `Promise.all(iterable)` |
| `vow.allResolved(iterable)` | `Promise.allSettled(iterable)` |
| `vow.any(iterable)` | `Promise.any(iterable)` |
| `vow.anyResolved(iterable)` | `Promise.race(iterable)` |
| `vow.defer()` | `Promise.withResolvers()` |
| `vow.when(value, fn)` | `Promise.resolve(value).then(fn)` |
| `vow.invoke(fn, ...args)` | try/catch + `Promise.resolve()` |

## Публичные технологии блока

Блок реализован в технологиях:

* `vanilla.js`
