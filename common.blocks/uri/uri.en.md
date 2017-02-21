# uri

This block provides an object with a set of methods for decoding a URI-encoded string.

## Overview

### Properties and methods of the object

| Name | Return type | Description |
| --- | -------------------------- | -------- |
| <a href="#fields-decodeURI">decodeURI</a>(`str {String}`) | `String` | Decodes a URI. |
| <a href="#fields-decodeURIComponent">decodeURIComponent</a>(`str {String}`) | `String` | Decodes a URI component. |

### Elements of the block

| Element | Usage | Description |
| --------| --------------------- | -------- |
| <a href="#elems-querystring">querystring</a> | `JS` | This element provides an object with a set of methods for working with a URI query string. It decodes the string from URI format. |

#### Properties and methods of the object

| Element | Name | Returned value | Description |
| ------- | --- | --------------------- | -------- |
| <a href="#elems-querystring">querystring</a> | <a href="#elems-querystring-fields-parse">parse</a>(`str {String}`) | `Object` | Creates an object using the query parameters from the address bar. |
| | <a href="#elems-querystring-fields-stringify">stringify</a>(`obj {Object}`) | `String` | Creates a query string based on the object properties. |

### Public block technologies

The block is implemented in:

* `vanilla.js`

<a name="fields"></a>

### Properties and methods of the object

Both of these methods function as wrappers for the standard JavaScript methods `decodeURI` and `decodeURIComponent`.

As they execute, the methods check whether the passed string is in UTF-8 format. If not, they generate an error.

<a name="fields-decodeURI"></a>

#### `decodeURI` method

Decodes a URI. This method is identical to the standard JavaScript method [decodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI), but it supports Cyrillic encoding `CP-1251`.

**Accepted arguments:**

* `str {String}` – A string with escape sequences. Required argument.

**Return value:** `String`. If escape sequences are not found in the string, the method returns the string without any changes.

Example:

```js
modules.require('uri', function(uri){
    uri.decodeURI("https://developer.mozilla.org/ru/docs/JavaScript_%D1%88%D0%B5%D0%BB%D0%BB%D1%8B");
    // "https://developer.mozilla.org/ru/docs/JavaScript_Shells"
})
```

<a name="fields-decodeURIComponent"></a>

#### `decodeURIComponent` method

Decodes a URI component. This method is identical to the standard JavaScript method [decodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent), but it supports Cyrillic encoding `CP-1251`.

**Accepted arguments:**

* `str {String}` – A string with escape sequences. Required argument.

**Return value:** `String`. If escape sequences are not found in the string, the method returns the string without any changes.

Example:

```js
modules.require('uri', function(uri){
    uri.decodeURIComponent("JavaScript_%D1%88%D0%B5%D0%BB%D0%BB%D1%8B");
    // "JavaScript_Shells"
})
```

<a name="elems"></a>

### Elements of the block

<a name="elems-querystring"></a>

#### `querystring` element

This element provides an object with a set of methods for working with a URI query string.

<a name="elems-name-fields"></a>

### Properties and methods of the object

<a name="elems-querystring-fields-parse"></a>

#### `parse` method

Creates an object using the parameters from a URI query string.

**Accepted arguments:**

* `str {String}` – A string with parameters as key-value pairs. The `=` symbol separates a key from its value. Pairs are separated by the `&` symbol. During parsing, keys and values are decoded from URI format. Required argument.

**Return value:** `Object`. The object created from the parameters in the address bar.

<a name="elems-querystring-fields-stringify"></a>

#### `stringify` method

Creates a URI query string from an object.

**Accepted arguments:**

* `obj {Object}` – The object to create the string from. Required argument.

**Return value:** `String`. Property names are separated from values by the `=` symbol, and the `&` symbol separates pairs in the string.
