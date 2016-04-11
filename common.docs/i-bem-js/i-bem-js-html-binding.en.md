<a name="html"></a>

Binding JS blocks to HTML
-------------------------

JavaScript components in `i-bem.js` are used for bringing a page HTML elements
to life. The typical task of a JS block is to set reactions to events inside an HTML fragment.

In `i-bem.js`, the primary ”framework“ is the document HTML tree. Points are marked in it where interactive interface elements, the JS blocks, are connected.
The binding point for a JS block is an HTML element (DOM node) whose `class` attribute
specifies the name of the block, and the `data-bem` attribute specifies the [block parameters](./i-bem-js-params.en.md).

When loading a page in the browser, [blocks are initialized](./i-bem-js-init.en.md). This creates instances of blocks — JS objects for all the blocks mentioned in classes of the page HTML elements. A JS object bound to an HTML element
handles the [DOM events](i-bem-js-events.en.md#dom-events) that occur on it and stores the states of this block instance.

This method of binding JavaScript components to HTML has the following advantages:

-   Natural degradation of the interface on clients with JavaScript disabled.
-   Progressive rendering — the ability to begin rendering interface elements before all the page data has finished loading (for example, images).

<a name="html-syntax"></a>

### Mechanism for binding blocks

To bind a block to an HTML element (for example, `<div>...</div>`), it is necessary to:

-   **Declare the block in `i-bem`**.
    Create the [ym](https://github.com/ymaps/modules) module containing the JS implementation of the block ([the declaration](./i-bem-js-decl.en.md)). To do this, pass a string with the block name as the first argument to the `modules.define` and `BEMDOM.decl` methods.

```js
modules.define('my-block', ['i-bem__dom'], function(provide, BEMDOM){

provide(BEMDOM.decl(this.name,
    {
        /* instance methods */
    },
    {
        /* static methods */
    }
));

});
```

On the project level, each `ym` module is usually stored as a separate `js` file. For example, the `my-block` declaration might be stored in the project as `my-block/my-block.js` – the file `my-block.js`, inside the folder `my-block`.

-   **Mark the block in the HTML tree**.
    Add the `class` attribute with the block name to the HTML element.

```html
<div class="my-block">
 ...
</div>
```

-   **Allow initialization of a block instance**.
    Include the `i-bem` class in the list of classes for an HTML element. The presence of this class will show the framework that the HTML element is connected to the JS block.

```html
<div class="my-block i-bem">
 ...
</div>
```

-   **Pass parameters to a block instance**.
    Put block parameters in the `data-bem` attribute. Block parameters are written in JSON format as a hash of the format: `block name : hash of parameters`. The parameters will be passed to the block instance [at the time of initialization](./i-bem-js-init.en.md).

```html
<div class="my-block i-bem" data-bem="{ " my-block="my-block">
 ...
</div>
```

<a name="html-conection"></a>

### The relation of blocks to HTML elements

A single HTML element doesn't have to correspond to a single block instance. The following relationships between blocks and HTML elements are possible:

-   [One HTML element to one JS block](#one-html-element-to-one-js-block)
-   [One HTML element to multiple JS blocks](#one-html-element-to-multiple-js-blocks)
-   [One JS block to multiple HTML elements](#one-js-block-to-multiple-html-elements)

<a name="html-simple"></a>

#### One HTML element to one JS block

The simplest and most common way of binding blocks to HTML.

**Example:** The `div` HTML element with `my-block` placed on it.
Block parameters: an empty list `{}`.

```html
<div class="my-block i-bem" data-bem="{ " my-block="my-block">
 ...
</div>
```

<a name="html-mixes"></a>

#### One HTML element to multiple JS blocks

The technique of placing multiple blocks on a single HTML element is called a [mix](i-bem-js-decl.en.md#mix) in BEM methodology.

**Example:** The `div` HTML element, with the following blocks on it:

-   `user` with the parameter `name`: `pushkin`
-   `avatar` with the parameter `img`: `http:// ...`

```html
<div class="user avatar i-bem" data-bem="{ " user="user">
 ...
</div>
```

<a name="distrib-block"></a>

#### One JS block to multiple HTML elements

This design is convenient if you need to coordinate the states of multiple components of a block.

To bind a block instance to multiple HTML elements, you must set the same value for the `id` parameter in the `data-bem` attribute. The value of `id` can be any string.

**Example:** An instance of the `notebook` block bound to the `div` and `span` HTML elements.
The parameters specify the shared `id` — `maintab`.

```html
<div class="user avatar i-bem"
    data-bem='{
        "user": { "name": "pushkin" },
        "avatar": { "img": "http://..." }
     }'>
     ...
</div>
```

As a result, when the blocks are initialized, a single JS object is created, with a [`domElem`](./i-bem-js-dom.en.md) field that contains references to the jQuery objects of both DOM nodes.

For example, the ”tab“ widget, where a click on the tab title (the first HTML element) changes its content (the second HTML element).
Another example is a placemark that marks a point on a map (the first element), and the related description of the point in the list next to it (the second element).

The `id` is used *only at the time of initializing* the block instance. The `id` value must be unique for instances of the same block in the context of a single [wave of initialization](i-bem-js-init.en.md#wave-of-initialization).

<a name="i-blocks"></a>

### Blocks without DOM representation

Infrastructure code that performs general interface tasks (access to the backend, or helper methods) can be formatted as a block. This allows expressing block states using [modifiers](./i-bem-js-states.en.md), so that [other blocks can subscribe](i-bem-js-states.en.md#other-blocks-can-subscribe) to their changes.

To avoid binding these blocks to the HTML tree artificially, these blocks can be created in `i-bem.js` without DOM representation.

Blocks without DOM representation:

-   Do not require binding to a page's HTML code.
-   Must be explicitly [initialized](i-bem-js-init.en.md#initialized) and destroyed.

<a name="api-nodom"></a>

#### Access to block instances without DOM representation

When creating a block instance without DOM representation, you must see to it that references to this instance are stored for blocks that need to interact with it.

See also:

-   [Initializing and deleting blocks without DOM representation](i-bem-js-init.en.md#initializing-and-deleting-blocks-without-dom-representation)
