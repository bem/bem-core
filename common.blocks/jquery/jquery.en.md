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

### Properties and methods of the block elements

| Element| Name | Return type | Description |
| -------| --- | ----------------------------- | -------- |
| <a href="#elems-config">config</a> | <a href="#fields-url">url</a> | `String` | String with the URL for connecting the jQuery library. |

### Public block technologies

The block is implemented in:

* `js`
