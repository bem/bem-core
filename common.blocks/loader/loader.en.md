# loader

Use the `loader` block for downloading and connecting scripts by URLs.

## Overview

### Block modifiers

| Modifier | Acceptable values | Usage | Description |
| ----------- | ------------------- | --------------------- | -------- |
| <a href="#modifiers-type">type</a> | `'js'`, `'bundle'` | `JS` | Uses a URL to get and connect JS code or a bundle. |

### Functions enabled by block elements

| Modifier | Function | Returned value | Description |
| ----------- | --- | ----------------------------- | -------- |
| <a href="#modifiers-type-js">js</a> | loader(</br>`id {String}`,</br> `url {String}`,</br> `[success {Function}]`,</br> `[error {Function}]`) | - | Downloads and connects a fragment of JavaScript code. |
| <a href="#modifiers-type-bundle">bundle</a> | loader(</br>`url {String}`,</br> `success {Function}`,</br> `[error {Function}]`) | - | Downloads and connects a bundle of CSS and JS files. |

### Public block technologies

The block is implemented in:

* `js`

## Description

<a name="modifiers"></a>

### Block modifiers

<a name="modifiers-type"></a>

#### `type` modifier

Provides a set of functions to download and connect different data types.

Acceptable values: `'js'`, `'bundle'`.

Usage: `JS`.

Depending on the value of the `type` modifier, the `loader` block lets you download from a URL and connect:

* `js` – A JavaScript fragment.
* `bundle` – A bundle of CSS and JS files.

<a name="modifiers-type-js"></a>

##### `type` modifier with the `js` value

Provides a function to download and connect a JavaScript fragment.

**Accepted arguments:**

* `url {String}` – URL of the JavaScript fragment to download. Required argument.
* [`success {Function}`] – The callback function to run when the code is loaded successfully.
* [`error {Function}`] – The callback function to run when the code couldn't load because of an error.

No return value.

For example, `loader_type_js` can be used for downloading and enabling jQuery:

```js
modules.define('jquery', ['loader_type_js'], function(provide, loader) {

    loader(
        'https://yastatic.net/jquery/2.2.0/jquery.min.js',
        function() { provide(jQuery) });

});
```

For a more advanced example, see the [common.blocks/jquery](https://github.com/bem/bem-core/blob/v2/common.blocks/jquery/jquery.js) block in the `bem-core` library.

<a name="modifiers-type-bundle"></a>

##### `type` modifier with the `bundle` value

Provides a function to download and connect a bundle of CSS and JS files.

**Accepted arguments:**

* `id {String}` – Bundle ID. Required argument.
* `url {String}` – The path to the bundle file in URL format. Required argument.
* `onSuccess {Function}` – The callback to run when the bundle is loaded successfully. Required argument.
* [`onError {Function}`] – The callback to run when the bundle didn't load.

No return value.

The specification for the `bundle` technology is currently under development. For more details, write your questions in the [forum](https://ru.bem.info/forum/).

###### `_loaded` static method

The function connected with the `type_bundle` modifier has the `_loaded` static method. It is used as a helper method after successfully loading the bundle.

**Accepted arguments:**

* `id {String}` – Bundle ID. Required argument.

No return value.
