# ua

Use this block to collect data about the user's browser.

## Overview

### Elements of the block

| Element | Usage | Description |
| ------- | --------------------- | -------- |
| <a href="#elems-svg">svg</a> | `deps` | Checks whether the browser supports SVG format. |

### Public block technologies

The block is implemented in:

* `bh.js`
* `bemhtml`

## Description

The block enables an inline script that adds `CSS` classes to the `<html>` tag to specify whether JavaScript is enabled – `ua_js_no` or `ua_js_yes`.

It doesn't have a visual representation on the page.

Used inside the [page](https://github.com/bem/bem-core/blob/v2/common.blocks/page/page.en.md) block. You normally don't need to connect it to the page yourself.

<a name="elems"></a>

### Elements of the block

<a name="elems-svg"></a>

#### `svg` element

This element enables an inline script that adds `CSS` classes to the `<html>` tag to specify whether SVG is supported – `ua_svg_no` or `ua_svg_yes`.

It doesn't have a visual representation on the page.

To use it, add the element to the `deps.js` dependencies file for the block that needs information about SVG support:

```js
({ shouldDeps : { block : 'ua', elem : 'svg' } })
```
