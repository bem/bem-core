i-bem.js: User's guide
======================

i-bem.js: JavaScript framework for BEM
--------------------------------------

`i-bem.js` is a specialized JavaScript framework for web development
using the [BEM methodology](https://en.bem.info/method/).

`i-bem.js` makes it possible to:

-   Develop a web interface in terms of blocks, elements, and modifiers.
-   Describe a block logic in declarative style, as a set of states.
-   Easily integrate JavaScript code with BEMHTML or BH templates and CSS in BEM style.
-   Flexibly redefine the behavior of library blocks.

`i-bem.js` is not meant to replace the general-purpose framework, like jQuery.

**What this document covers**:

-   [Overview](./i-bem-js-common.en.md) of the framework: its relationship to the BEM subject domain, and a summary of the framework modular
    structure, a template project, and assembly tools written
    using `i-bem.js`.
-   [Binding JS blocks to HTML](./i-bem-js-html-binding.en.md) — Markup for JS blocks in a page
    HTML code and the possible relationships of HTML elements to JS blocks.
-   [Block declaration](./i-bem-js-decl.en.md) — Syntax for describing JS blocks.
-   [Passing parameters](./i-bem-js-params.en.md) — Passing parameters to a block instance and accessing block parameters from an instance.
-   [Working with the DOM tree](./i-bem-js-dom.en.md) — The API for working with DOM nodes of blocks:
    elements, dynamic changes to the DOM tree (using AJAX), and searching DOM nodes.
-   [Block states](./i-bem-js-states.en.md) — Modifiers and triggers for state changes (setting modifiers).
-   [Events](./i-bem-js-events.en.md) — The `i-bem.js` event model: DOM and BEM events and event delegation.
-   [Initialization](./i-bem-js-init.en.md) — Initializing and deleting block instances; deferred and automatic initialization.
-   [Interaction of blocks](./i-bem-js-interact.en.md) — Calls from a block to other blocks and classes of blocks.
-   [Context](./i-bem-js-context.en.md) — Private and static properties of a block. BEMDOM static properties.
-   [What next?](./i-bem-js-extras.en.md) — Links to documentation and supplemental materials.
