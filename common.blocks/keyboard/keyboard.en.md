# keyboard

This block is used for working with keyboard input.

## Overview

### Elements of the block

| Element | Usage | Description |
| --------| --------------------- | -------- |
| <a href="#elems-codes">codes</a> | `JS` | Provides an object with a set of constant names for frequently used keyboard codes. |

### Properties and methods of the block elements

| Element | Name | Type |
| ------- | --- | --- |
| <a href="#elems-codes">codes</a> | BACKSPACE | `String` |
| | TAB | `String` |
| | ENTER | `String` |
| | CAPS_LOCK | `String` |
| | ESC | `String` |
| | SPACE | `String` |
| | PAGE_UP | `String` |
| | PAGE_DOWN | `String` |
| | END | `String` |
| | HOME | `String` |
| | LEFT | `String` |
| | UP | `String` |
| | RIGHT | `String` |
| | DOWN | `String` |
| | INSERT | `String` |
| | DELETE | `String` |

### Public block technologies

The block is implemented in:

* `js`

## Description

<a name="elems"></a>

### Elements of the block

<a name="elems-codes"></a>

#### `codes` element

Provides an object with a set of constant names for frequently used keyboard codes.

<a name="elems-codes-fields"></a>

##### Properties and methods of the object

Type: `String`.

The name values (object properties) are the key codes. Using meaningful names instead of the key codes makes the code easier to understand.

For example, the `_onKeyDown` method uses the names of the `UP` and `DOWN` keys when checking the `keyCode` field for an event object:

```js
modules.define('input', ['i-bem-dom', 'keyboard__codes'], function(provide, bemDom, keyCodes) {

provide(bemDom.declBlock(this.name, /** @lends input.prototype */{
    onSetMod : {
        js : {
            inited : function() {
                this._domEvents().on('keydown', this._onKeyDown);
            }
        }
    },

    _onKeyDown : function(e) {
        if((e.keyCode === keyCodes.UP || e.keyCode === keyCodes.DOWN) && !e.shiftKey) {
            // ...
        }
    }
}));
});
```

The following properties are available:

* `BACKSPACE`
* `TAB`
* `ENTER`
* `CAPS_LOCK`
* `ESC`
* `SPACE`
* `PAGE_UP`
* `PAGE_DOWN`
* `END`
* `HOME`
* `LEFT`
* `UP`
* `RIGHT`
* `DOWN`
* `INSERT`
* `DELETE`
