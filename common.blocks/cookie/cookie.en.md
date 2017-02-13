# cookie

This block provides an object with a set of methods for working with browser cookies (the JS `document.cookie` property).

## Overview

### Object properties and methods

| Name | Return type | Description |
| -------- | --- | -------- |
| <a href="#fields-get">get</a>(`name`) | `String` &#124; `null` | Gets the value stored in a browser cookie. |
| <a href="#fields-set">set</a>(`name`, `val`, `[options]`) | `String` | Sets the cookie with the specified name.|

### Public block technologies

The block is implemented in:

* `js`

## Description

<a name="fields"></a>

### Object properties and methods

<a name="fields-get"></a>

#### `get` method

Use this method to get the value stored in a cookie for the name passed in the argument.

**Accepted arguments:**

| Argument | Type | Description |
| ------- | --- | -------- |
| `name`&#42; | `String` | The name of the cookie. |

&#42; Required argument.

**Returns:**

* `String` — If a cookie with the specified name was set. The value is automatically decoded using [decodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent).
* `null` — If a cookie with the specified name doesn't exist.

Example:

```js
modules.require('cookie', function(cookie) {

    cookie.set('mycookie', 'foobar');
    console.log(cookie.get('mycookie')); // 'foobar'
    console.log(cookie.get('foo')); // null

});
```

<a name="fields-set"></a>

#### `set` method

Use this method to set the cookie with the specified name. In addition to the name and value, you can pass the method a hash with additional cookie parameters.

**Accepted arguments:**

| Argument | Type | Description |
| ------- | --- | -------- |
| `name`&#42; | `String` | The name of the cookie. |
| `val`&#42; | `String` &#124; `null` | The value of the cookie. If the value is set to `null`, the cookie is deleted.|
| [`options`] | `Object` | Options. </br></br> Object properties</br></br> &#8226; `expires` (`Number`) – The cookie's time to live, in days. If the value is negative, the cookie is deleted. Alternatively, you can pass a generated date object (`new Date()`) for the value. </br> &#8226; `path` (`String`) – The path from the domain root where the cookie will be available. </br> &#8226; `domain` (`String`) – The domain. By default, this is the current domain. </br> &#8226; `secure` (`Boolean`) – Flag indicating that an encrypted SSL connection must be used with the cookie. By default, it is `false`. |

&#42; Required argument.

**Returns:** the `this` object.

Example:

```js
modules.require('cookie', function(cookie) {

    cookie.set('mycookie', 'foobar', {
        expires : 1, // lifetime is one day
        path : '/', // available for all pages secure
        secure : true // only send the cookie over SSL
    });

    console.log(cookie.get('mycookie')); // 'foobar'

    cookie.set('mycookie', null); // deleting the cookie
    console.log(cookie.get('mycookie')); // null

});
```
