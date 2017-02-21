# objects

This block provides an object with a set of methods for working with JavaScript objects.

## Overview

### Properties and methods of the object

| Name | Return type | Description |
| -------- | --- | -------- |
| <a href="#fields-extend">extend</a>(<br>`target {Object}`, <br>`source {Object}`) | `Object` | Extends an object with the properties of another object. |
| <a href="#fields-isEmpty">isEmpty</a>(`obj {Object}`) | `Boolean` |  Determines whether the passed object is empty. |
| <a href="#fields-each">each</a>(<br>`obj {Object}`, <br>`fn {Function}`, <br>`[ctx {Object}]`) | - | Iteratively traverses its own object properties. |

### Public block technologies

The block is implemented in:

* `vanilla.js`

## Description

<a name="fields"></a>

### Properties and methods of the object

<a name="fields-extend"></a>

#### `extend` method

Extends an object with the properties of another object. It only copies its own properties that weren't taken from the prototype chain.

**Accepted arguments:**

* `target {Object}` – Target object. Required argument.
* `source {Object}` – The object whose properties are added to the target object. Multiple objects can be passed. The properties of each of them will be added to the target object. Required argument.

**Return value:** `Event`. The target object with the added properties.

Example:

```js
modules.require(['objects'], function(objects) {

var obj1 = { a : 1, b : 2 },
    obj2 = { b : 3, c : 4 };

console.log(objects.extend(obj1, obj2)); // { a : 1, b : 3, c : 4 }
});
```

<a name="fields-isEmpty"></a>

#### `isEmpty` method

Determines whether the passed object is empty. In other words, whether the object has its own properties.

**Accepted arguments:**

* `obj {Object}` – The object to check. Required argument.

**Return value:** `Boolean`. If the object doesn't have its own properties, `true`.

Example:

```js
modules.require(['objects'], function(objects) {

var obj1 = {},
    obj2 = { foo : 'bar' };

console.log(objects.isEmpty(obj1)); // true
console.log(objects.isEmpty(obj2)); // false
});
```

<a name="fields-each"></a>

#### `each` method

Used for iterating through an object's properties. The handler function is invoked for each of the object's own properties.

**Accepted arguments:**

* `obj {Object}` – The object whose properties are being traversed. Required argument.
* `fn {Function}` – The handler function to call for each property. Required argument.
* [`ctx {Object}`] – The handler context.

No return value.

The handler function receives arguments with the value and key of the object property that it was invoked for.

Example:

```js
modules.require(['objects'], function(objects) {
    objects.each(
        { a : 1, b : 2 },
        function(val, key) {
            console.log(key, val);
        });
    // a 1
    // b 2
});
```
