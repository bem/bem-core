# strings

This block provides helpers for manipulating string data.

## Overview

### Elements of the block

| Element | Usage | Description |
| --------| --------------------- | -------- |
| <a href="#elems-escape">escape</a> | `JS` | A set of methods for escaping XML and HTML control characters. |

### Properties and methods of the block elements

| Element| Name | Type or return value | Description |
| -------| --- | ----------------------------- | -------- |
| <a href="#elems-escape">escape</a> | <a href="#elems-escape-fields-xml">xml</a>(`str {String}`) | `String` | Use for escaping XML control characters. |
|  | <a href="#elems-escape-fields-html">html</a>(`str {String}`) | `String` | Use for escaping HTML control characters. |
|  | <a href="#elems-escape-fields-attr">attr</a>(`str {String}`) | `String` | Use for escaping control characters in HTML and XML attributes. |

### Public block technologies

The block is implemented in:

* `vanilla.js`

## Description

<a name="elems"></a>

### Elements of the block

<a name="elems-escape"></a>

#### `escape` element

This element provides an object with a set of methods for escaping XML and HTML control characters.

<a name="elems-name-fields"></a>

### Properties and methods of the object

<a name="elems-escape-fields-xml"></a>

#### `xml` method

Use for escaping XML control characters. Processes the symbols `&`, `<`, `>`.

**Accepted arguments:**

* `str {String}` – String to process. Required argument.

**Return value:** `String`. The string with escaped control characters.

<a name="elems-escape-fields-html"></a>

#### `html` method

Use for escaping HTML control characters. It is a synonym of the `xml` method.

<a name="elems-escape-fields-attr"></a>

#### `attr` method

Use for escaping control characters in HTML and XML attributes. Processes the control characters `"`, `\`, `'`, `&`, `<`, `>`.

**Accepted arguments:**

* `str {String}` – String to process. Required argument.

**Return value:** `String`. The string with escaped control characters.

For example, in the [`common.blocks/select`](https://github.com/bem/bem-components/blob/v2/common.blocks/select/select.js#L237) block in the `bem-components` library, `strings__escape` is used for escaping control characters in the `value` property of an HTML element:

```js
_createControlHTML : function(name, val) {
    // Using string concatenation to not depend on template engines
    return '<input ' +
        'type="hidden" ' +
        'name="' + name + '" ' +
        'class="' + this.buildClass('control') + '" ' +
        'value="' + escape.attr(typeof val === 'object'? JSON.stringify(val) : val) + '"/>';
}
```
