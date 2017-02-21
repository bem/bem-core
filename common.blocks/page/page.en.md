# page

This block provides templates that create a set of top-level HTML elements for a page: `<html>`, `<head>`, and `<body>`.

## Overview

### Special fields of the block

| Field | Type | Description |
| ---- | --- | -------- |
| <a href="#declfields-doctype">doctype</a> | `String` | Use this field to redefine the DTD string for the current document. |
| <a href="#declfields-title">title</a> | `String` | Use this field to specify the content of `<title>`. |
| <a href="#declfields-favicon">favicon</a> | `String` | Use this field to specify the URL of the favicon for the page. |
| <a href="#declfields-head">head</a> | `BEMJSON` | Use this field to add content to `<head>`. |
| <a href="#declfields-styles">styles</a> | `BEMJSON` | Use this field to connect CSS style sheets to the document. |
| <a href="#declfields-scripts">scripts</a> | `BEMJSON` | Use this field to embed scripts in the body of the document. |
| <a href="#declfields-content">content</a> | `BEMJSON` | Use this field to set the page content. |

### Elements of the block

| Element | Usage | Description |
| ------- | --------------------- | -------- |
| <a href="#elems-css">css</a> | `BEMJSON` | Connects CSS using a URL or a string. |
| <a href="#elems-js">js</a> | `BEMJSON` | Connects JS using a URL or a string. |
| <a href="#elems-meta">meta</a> | `BEMJSON` | Creates `<meta>` HTML elements. |

### Special fields of block elements

| Element | Field | Type | Description |
| ------- | ---- | --- | -------- |
| <a href="#elems-css">css</a> | <a href="#elems-css-declfields-url">url</a> | `String`  | Sets the URL for downloading styles. |
|  | <a href="#elems-css-declfields-content">content</a> | `String`  | Sets styles in string format. |
| <a href="#elems-js">js</a> | <a href="#elems-css-declfields-url">url</a> | `String`  | Sets the URL for downloading a script. |
|  | <a href="#elems-css-declfields-content">content</a> | `String`  | Sets scripts in string format |

### Public block technologies

The block is implemented in:

* `bh.js`
* `bemhtml`

## Description

This block is responsible for creating top-level HTML elements, connecting CSS, JS, and `<meta>` elements to a page, and defining the title. The BEMJSON declaration for the block and its elements have special fields reserved for this purpose.

<a name="declfields"></a>

### Special fields of the block

<a name="declfields-doctype"></a>

#### `doctype` field

Type: `String`.

Use this field to explicitly set the DTD (Document Type Definition) for the current document. If omitted, `<!DOCTYPE html>` is used by default.

<a name="declfields-title"></a>

#### `title` field

Type: `String`.

Title of the page. It becomes the `<title>` HTML element.

```js
{
    block : 'page',
    title : 'title',
    content : 'Block page'
}
```

<a name="declfields-favicon"></a>

#### `favicon` field

Type: `String`.

Use this field to specify the URL of the favicon for the page:

```js
{
    block : 'page',
    title : 'title',
    favicon : 'favicon.ico',
    content : 'Page with users favicon.ico'
}
```

<a name="declfields-head"></a>

#### `head` field

Type: `BEMJSON`.

Use this field to add content to the `<head>` `HTML` element that is defined in the block template:

```js
{
    block : 'page',
    title : 'title',
    head : [
        { elem : 'js', url : 'jquery-min.js' },
        { elem : 'meta', attrs : { name : 'description', content : 'Yet another webdev blog' } }
    ],
    content : 'Page with JS and meta-data'
}
```

<a name="declfields-styles"></a>

#### `styles` field

Type: `BEMJSON`.

Use this field to connect `CSS`:

```js
{
    block : 'page',
    title : 'title',
    styles : { elem : 'css', url : '_index.css' },
    content : 'Page with CSS'
}
```

<a name="declfields-scripts"></a>

#### `scripts` field

Type: `BEMJSON`.

Embeds JS in the body of the page, at the end of the `<body>` HTML element:

```js
{
    block : 'page',
    title : 'title',
    scripts : { elem : 'js', url : '_index.js' },
    content : 'Page with JS in body'
}
```

<a name="declfields-content"></a>

#### `content` field

Type: `BEMJSON`.

Use this field to set the page content.

```js
{
    block : 'page',
    title : 'title',
    content : {
        block : 'link',
        mods : { pseudo : 'yes', togcolor : 'yes', color : 'green' },
        url : '#',
        target : '_blank',
        title : 'Click me',
        content : 'Pseudo link'
    }
}
```

<a name="elems"></a>

### Elements of the block

<a name="elems-css"></a>

#### `css` element

Connects CSS using a URL or a string. Depending on whether the `url` field is specified in the element declaration, an HTML element is created with the tag:

* `<link>` and the `stylesheet` property, if `url` is specified.
* `<style>`, if `url` is omitted. In this case, it is assumed that the element content is passed using the `content` property in the element's BEMJSON declaration.

<a name="elems-css-declfields-content"></a>

##### Specialized `content` field

Type: `String`.

Use this field for explicitly passing the content of the `<style>` HTML element:

```js
{
    block : 'page',
    title : 'Page title',
    styles : {
        elem : 'css',
        content : '.page { color : #f00 }'
    },
    content : 'Page with tag <style>'
 }
```

<a name="elems-css-declfields-url"></a>

##### Specialized `url` field

Type: `String`.

Sets the URL for downloading CSS. The value of the `url` field in the BEMJSON declaration is passed to the `href` property in the created HTML element.

<a name="elems-js"></a>

#### `js` element

Connects JS using a URL or a string. Creates the `<script>` HTML element.

<a name="elems-js-declfields-content"></a>

##### Specialized `content` field

Type: `String`.

Use this field for explicitly passing the content of the `<script>` HTML element:

```js
{
    block : 'page',
    title : 'Page title',
    scripts : {
        elem : 'js',
        content : 'console.log(document.title)'
    },
    content : 'Page with tag <script>'
}
```

<a name="elems-js-declfields-url"></a>

##### Specialized `url` field

Type: `String`.

Sets the URL for downloading a script. The value of the `url` field in the BEMJSON declaration is passed to the `src` property in the created HTML element.

```js
{
    block : 'page',
    title : 'Page title',
    styles : { elem : 'css', url : '_index.css' },
    content : 'Page with tag style'
}
```

<a name="elems-meta"></a>

#### `meta` element

Creates `<meta>` HTML elements and defines user metadata for them. Metadata is passed as keys and values of attribute hashes, the `attrs` properties in the BEMJSON declaration of the element:

```js
{
    block : 'page',
    title : 'title',
    head : [
        { elem : 'css', url : 'example.css' },
        { elem : 'meta', attrs : { name : 'keywords', content : 'js, css, html' } }
    ],
    content : 'Page with CSS и meta-data'
}
```

For more information, see the documentation for `<meta>` [at MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta).
