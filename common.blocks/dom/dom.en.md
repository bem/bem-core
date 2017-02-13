# dom

This block provides an object with a set of methods for working with the DOM tree.

## Overview

### Object properties and methods

| Name | Return type | Description |
| -------- | --- | -------- |
| <a href="#fields-contains">contains</a>(<br>`ctx {jQuery}`,<br>`domElem {jQuery}`) | `Boolean` | Checks whether a DOM element contains another DOM element. |
| <a href="#fields-getFocused">getFocused</a>(<br>`domElem {jQuery} `) | `jQuery` | Gets a reference to the DOM element that is in focus. |
| <a href="#fields-containsFocus">containsFocus</a>(<br>`domElem {jQuery} `) | `Boolean` | Checks whether a DOM element or its descendants contains the focus. |
| <a href="#fields-isFocusable">isFocusable</a>(<br>`domElem {jQuery} `) | `Boolean` | Checks whether the DOM element is in focus. |
| <a href="#fields-isEditable">isEditable</a>(<br>`domElem {jQuery}`) | `Boolean` | Checks whether text can be entered in the DOM element. |

### Public block technologies

The block is implemented in:

* `js`

## Description

<a name="fields"></a>

### Object properties and methods

<a name="fields-contains"></a>

#### `contains` method

Use this method to check whether a `ctx` DOM element contains `domElem`.

**Accepted arguments:**

* `ctx {jQuery}` – The DOM element to search inside. Required argument.
* `domElem {jQuery}` – The DOM element to search for. Required argument.

**Return value:** `Boolean`. If found, then `true`.

Example:

```js
modules.require(['dom', 'jquery'], function(dom, $) {

/*
<div class="block1">
  <div class="block2"></div>
</div>
*/

dom.contains($('.block1'), $('.block2'));  // true

});
```

<a name="fields-getFocused"></a>

#### `getFocused` method

Gets a reference to the DOM element that is in focus.

Doesn't accept arguments.

**Return value:** `jQuery` – The object in focus.

Example:

```js
modules.require(['dom'], function(dom) {

dom.getFocused(); // a reference to the element in focus

});
```

<a name="fields-containsFocus"></a>

#### `containsFocus` method

This method checks whether the focus is on the DOM element passed in the argument or one of its descendants.

**Accepted arguments:**

* `domElem {jQuery}` – The DOM element to check. Required argument.

**Return value:** `Boolean`. If this element is in focus, then `true`.

Example:

```js
modules.require(['dom', 'jquery'], function(dom, $) {

/*
<div class="block1">
  <input class="block1__control"></div>
</div>
*/

$('.block1__control').focus();
dom.containsFocus($('.block1'));  // true

});
```

<a name="fields-isFocusable"></a>

#### `isFocusable` method

This method checks whether the user's browser can set the focus on the DOM element passed in the argument.   

**Accepted arguments:**

* `domElem {jQuery}` – The DOM element to check. Required argument. If there are mutiple DOM elements in the jQuery chain, the first one is checked.

**Return value:** `Boolean`. If the focus can be set on this element, then `true`.

Example:

```js
modules.require(['dom', 'jquery'], function(dom, $) {

/*
<div class="menu">
  <a class="menu__item" href="/">Link 1</a>
</div>
*/

dom.isFocusable($('.menu__item')); // true

/*
<div class="menu">
  <span class="menu__item menu__item_current">Link 1</span>
</div>
*/

dom.isFocusable($('.menu__item')); // false

});
```

<a name="fields-isEditable"></a>

#### `isEditable` method

This method checks whether text can be entered in the DOM element passed in the argument. In other words, you can use this method to check whether the element is an input field, text field, and so on.

**Accepted arguments:**

* `domElem {jQuery}` – The DOM element to check. Required argument. If there are mutiple DOM elements in the jQuery chain, the first one is checked.

**Return value:** `Boolean`. If text can be entered in the DOM element, then `true`.

Example:

```js
modules.require(['dom', 'jquery'], function(dom, $) {

dom.isEditable($('input, textarea')); // true

});
```
