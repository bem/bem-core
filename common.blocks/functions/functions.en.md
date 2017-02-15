# functions

This block provides an object with a set of methods for working with JavaScript functions.

## Overview

### Properties and methods of the object

| Name | Type or return value | Description |
| -------- | --- | -------- |
| <a href="#fields-isFunction">isFunction</a>(`obj {*}`) |  `Boolean` | Checks whether a passed argument is a function. |
| <a href="#fields-noop">noop</a> | `Function` | Empty function. |

### Elements of the block

| Element |  Usage | Description |
| --------| ---- | -------- |
| <a href="#elems-debounce">debounce</a> | `JS`  | Function decorator that combines multiple function calls within a specified time period into one call. |
| <a href="#elems-throttle">throttle</a> | `JS` | Function decorator that limits the frequency of function execution to once per specified period. |

### Public block technologies

The block is implemented in:

* `vanilla.js`

## Description

<a name="fields"></a>

### Properties and methods of the object

<a name="fields-isFunction"></a>

#### `isFunction` method

Checks whether a passed argument is a function.  

**Accepted arguments:**

* `obj {*}` – The object being checked. Required argument.

**Return value:** `Boolean`. If the argument is a function, then `true`.

```js
modules.require('functions', function(func) {
    var a = function(){},
        b = {};
    console.log(func.isFunction(a)); //true
    console.log(func.isFunction(b)); //false
});
```

<a name="fields-noop"></a>

#### `noop` property

Empty function (`function() {}`).

No arguments or return value.

You can use `noop` when you need a function but there isn't a reason to add the logic. For example, you can use it as a placeholder for base classes at the design stage when using OOP.

Example:

```js
modules.define('base-class', ['inherit', 'functions'], function(provide, inherit, functions) {

provide(inherit({
    getData : function() {
        this._sendRequest();
    },

    _sendRequest : functions.noop

}));

});
```

<a name="elems"></a>

### Elements of the block

The block elements implement a set of function decorators.

The decorators add logic to the function without changing its original signature.

<a name="elems-debounce"></a>

#### `debounce` element

A decorator that postpones function calls for the specified delay time. After each attempt to make a call, the delay starts over again.

**Accepted arguments:**

* `fn {Function}` — Original function. Required argument.
* `timeout {Number}` — Time of delay, in milliseconds. Required argument.
* [`invokeAsap {Boolean}`] — The `debounce` mode. By default, the first mode is used (corresponding to the `false` value).
* [`context {Object}`] — The context for executing the original function.

There are two `debounce` modes, depending on the value of `invokeAsap`:

1. The original function is called when the delay expires after the last call attempt.
2. The original function is first called as soon as the decorated function is called. After this, the behavior is the same as in the first mode.

**Return value:** `Function`. The decorated function.

Example:

```js
modules.require('functions__debounce', function(provide, debounce) {

    function log() {
        console.log('hello!');
    }

    var debouncedLog = debounce(log, 300);
    setInterval(debouncedLog, 50);

});
```

<a name="elems-throttle"></a>

#### `throttle` element

This decorator allows you to "slow down" the function. It won't be executed more than once during the specified period, no matter how many times it is called during this time. All calls in the meantime are ignored.

**Accepted arguments:**

* `fn {Function}` — Original function. Required argument.
* `period {Number}` — The interval between calls, in milliseconds. Required argument.
* [`context {Object}`] — The context for executing the original function.

**Return value:** `Function`. The decorated function.

This method is convenient for setting resource-intensive handlers for frequently generated events, such as `resize`, `pointermove`, and so on.

Example:

```js
modules.require('functions__throttle', function(provide, throttle) {

    function log() {
        console.log('hello!');
    }

    var throttledLog = throttle(log, 300);
    setInterval(throttledLog, 50);

});
```

As a result, the function is executed no more than once every 300 milliseconds.
