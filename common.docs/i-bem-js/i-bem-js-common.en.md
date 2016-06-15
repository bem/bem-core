# Overview

## The BEM methodology and JavaScript

In the BEM methodology, a web interface is built from independent
*[blocks](https://en.bem.info/methodology/key-concepts/#block)*, which may have *[elements](https://en.bem.info/methodology/key-concepts/#element)*. Both blocks
and elements can have states or characteristics described by
*[modifiers](https://en.bem.info/methodology/key-concepts/#modifier)*.

A web interface uses various
*[technologies](https://en.bem.info/methodology/key-concepts/#implementation-technology)*
(HTML, CSS, JS, and others). Its implementation is divided into components by block. A block contains a set of *technology files* that represent aspects of its implementation:

-   `my-block.css` — The block appearance.
-   `my-block.bemhtml.js` — [Templates](https://en.bem.info/platform/bem-xjst/) for generating HTML representations of the block.
-   `my-block.js` — The block **dynamic behavior** in the browser.

The `i-bem.js` framework allows us to break down the client JavaScript into components in BEM terms:

-   **Block** — The JS component that describes the logic of same-type interface elements. For example, all buttons can be implemented as a `button` block. In this case, `button.css` defines how all buttons look, and `button.js` defines how they work.
    Each page can have more than one **block instance** (such as buttons). Each block instance corresponds to a JS object in the browser memory that stores its state. The JS object contains a reference to the DOM node that this block instance is bound to.
-   **Elements** — DOM nodes nested in the block DOM node, with the `class` attribute pointing to their role in the BEM subject domain (the name of the block and element). Block elements are accessible via the block instance [JS-API](i-bem-js-dom.en.md).
-   **Modifiers** — Provide information about the state of a block and its elements. The state of modifiers is written in the `class` attribute on the DOM nodes of a block and elements. Modifiers are controlled using a block instance [JS-API](i-bem-js-states.en.md#managing-modifiers).

## Build

In the BEM methodology, development is modular — each block
is programmed separately. The final source code of web pages is generated
from the code of individual blocks using *[build](https://en.bem.info/methodology/build/)* procedures.

In the file system, it is [convenient to represent](https://en.bem.info/methodology/filesystem/) a block as a directory, and the block implementation in each of the technologies as a separate file:

```files
desktop.blocks/
    my-block/
        my-block.css
        my-block.js
        my-block.bemhtml.js
        ...

    other-block/
        other-block.css
        other-block.js
        other-block.bemhtml.js
        ...
```

For each web page, the code of the blocks used on it can be put in the same types of files:

```files
desktop.bundles/
    index/
        index.html
        index.css
        index.js
        ...
```

Use [ENB](https://en.bem.info/toolbox/enb/) for building separate block
descriptions into the code of resulting web pages. It automate the creation of HTML
markup for [binding JS blocks](./i-bem-js-html-binding.en.md) and
[passing parameters to a block instance](./i-bem-js-params.en.md).

## Why i-bem.js is named this way

According to the BEM methodology, the base JS library of the BEM platform was originally developed
as a special service block. This approach allows us to work with base libraries the same way as with
regular blocks. In particular, it allows us to structure code in terms of elements and modifiers and flexibly
configure the library behavior on various redefinition levels.

Service blocks in BEM were conventionally given names with the `i-` prefix. Thus, the name `i-bem.js`
is read as *an implementation of the `bem` service block in the `JS` technology*.

## How to use i-bem.js

The `i-bem.js` framework is a part of the [bem-core](https://en.bem.info/libs/bem-core/) library.

The implementation of `i-bem.js` consists of two modules:

-   **The [i-bem](https://en.bem.info/libs/bem-core/current/desktop/i-bem/jsdoc/) module**.
    Base implementation of the `i-bem` JS block, which all the blocks in
    `i-bem.js` inherit from. The `i-bem` block is written for use in any of the
    JS environments: both on the client and on the server (for example, in
    Node.js).
-   **The [i-bem__dom](https://en.bem.info/libs/bem-core/current/desktop/i-bem/jsdoc/#jsdoc-i-bem__dom-1) module**.
    The base implementation of a block bound to a DOM node.
    Intended for use on the client, and relies on browsers working with DOM. Depends on `jQuery`.

Dependencies:

-   jQuery (only for the `i-bem__dom` module). When using `bem-core`, separate installation
    of jQuery is not necessary.
-   The [ym/modules](https://github.com/ymaps/modules/blob/master/README.md) module system. When using
    [enb-modules](https://en.bem.info/toolbox/enb/enb-modules/),
     this dependency is satisfied automatically.

It is convenient to base your project on the
[project-stub](https://en.bem.info/platform/project-stub/) template repository, where automatic installation of dependent libraries and assembly is set up.

If you aren't planning to use other technologies of the BEM platform, you can just put the `bem-core` library code in an existing project.
