# jquery

This block is for downloading the [jQuery](https://jquery.com) library and its extensions and enabling them on a page.
Extensions are enabled via dependencies on the block elements.

## Usage

```js
modules.require(['jquery'], function($) {
    console.log($);
});
```

## Overview

### Elements of the block

| Element | Usage | Description |
| --------| --------------------- | -------- |
| <a href="#elems-config">config</a> | `JS` | jQuery configuration. |
| <a href="#elems-event">event</a> | `JS` | Extensions for the jQuery event model. |

### Properties and methods of the block elements

| Element| Name | Return type | Description |
| -------| --- | ----------------------------- | -------- |
| <a href="#elems-config">config</a> | <a href="#fields-url">url</a> | `String` | String with the URL for connecting the jQuery library. |

### Events of the block elements

| Element | Name | Description |
| ------- | --- | -------- |
| <a href="#elems-event">event</a> | <a href="#events-pointerclick">pointerclick</a> | Eliminates the delay of the `click` event on touch devices. |
|  | <a href="#events-pointerover">pointerover</a> | Generated when the pointer on the input device is over an element. |
|  | <a href="#events-pointerenter">pointerenter</a> | Generated when the pointer enters an element's active area. |
|  | <a href="#events-pointerdown">pointerdown</a> | Generated when the input device enters the active button state. |
|  | <a href="#events-pointermove">pointermove</a> | Generated when the pointer's coordinates change. |
|  | <a href="#events-pointerup">pointerup</a> | Generated when exiting the active button state. |
|  | <a href="#events-pointerout">pointerout</a> | Generated when the pointer leaves the area over an element. |
|  | <a href="#events-pointerleave">pointerleave</a> | Generated when the pointer leaves an element's active area. |
|  | <a href="#events-pointerpress">pointerpress</a> | Generated on the `pointerdown` event. |
|  | <a href="#events-pointerrelease">pointerrelease</a> | Generated on the `pointerup` and `pointercancel` events. |
|  | <a href="#events-pointercancel">pointercancel</a> | Generated when more pointer events are not expected to occur, or after generating the `pointerdown` event. |

### Public block technologies

The block is implemented in:

* `js`
