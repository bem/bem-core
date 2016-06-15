# Working with the DOM tree

## DOM node of a block instance

The `this.domElem` field is reserved in the context of a block instance with DOM representation. This field contains a jQuery object with references to all the DOM nodes that this instance is connected to.

## Elements

BEM elements of blocks are represented in `i-bem.js` as DOM nodes nested in the DOM node of a block instance.

To access elements DOM nodes and work with their modifiers, use the block instance API:

-   Cached access: `elem(elems, [modName], [modVal])`. An element
    obtained this way does not need to be stored in a variable.

    ```js
    BEMDOM.decl('link', {
        setInnerText: function() {
            this.elem('inner').text('Link text');
            /* ... */
            this.elem('inner').text('Another text');
        }
    );
    ```

-   Uncached access: `findElem(elems, [modName], [modVal])`.

    ```js
    BEMDOM.decl('link', {
        setInnerText: function() {
            var inner = this.findElem('inner');

            inner.text('Link text');
            /* ... */
            inner.text('Another text');
        }
    });
    ```

When [block elements are added and removed dynamically](#dynamic-changes-to-blocks-and-elements-in-the-dom-tree), the cache of elements
may need to be cleared. Use the `dropElemCache('elements')` method for this purpose. It accepts a string with a space-separated list of names of elements to drop the cache for.

```js
BEMDOM.decl('attach', {
    clear: function() {
        BEMDOM.destruct(this.elem('control'));

        BEMDOM.destruct(this.elem('file'));

        return this.dropElemCache('control file');
    }
});
```

## Searching for block instances in the DOM tree

Accessing a different block in `i-bem.js` is performed from the current block
located on a particular node of the DOM tree. The search for other blocks in
the DOM tree can be made in three directions (axes) relative to
the current block DOM node using helper methods:

-   **Inside the block** — On DOM nodes nested in the DOM node of the current block.
    ```js
    findBlocksInside([elem], block)
    findBlockInside([elem], block)
    ```
-   **Outside the block** — On DOM nodes that the current block DOM node
    is a descendent of.
    ```js
    findBlocksOutside([elem], block)
    findBlockOutside([elem], block)
    ```
-   **On itself** — On the same DOM node where the current block is located. This is relevant when [multiple JS blocks are located on a single DOM node](i-bem-js-html-binding.en.md#one-html-element-to-multiple-js-blocks) (a mix).
    ```js
    findBlocksOn([elem], block)
    findBlockOn([elem], block)
    ```

The signature of the helper methods is identical:

-   `[elem] {String|jQuery}` — The name or DOM node of the block element.
-   `block {String|Object}` — Name or description of the block being searched for. A description is a hash in the format `{ block : 'name', modName : 'foo', modVal : 'bar' }`.

The helper methods for searching are paired. They differ in the values they return:

-   `findBlocks<Direction>` — Returns an array of found blocks.
-   `findBlock<Direction>` — Returns the first block found.

**Example**: When the `disabled` modifier is toggled, the instance of the
`attach` block finds the `button` block nested inside it and toggles its
`disabled` modifer to the same value that it received itself:

```js
modules.define('attach', ['i-bem__dom', 'button'], function(provide, BEMDOM) {

    provide(BEMDOM.decl(this.name, {
        onSetMod: {
            'disabled': function(modName, modVal) {
                this.findBlockInside('button').setMod(modName, modVal);
            }
        }
    }));

});
```

**Note:** Don't use jQuery selectors to search for blocks and elements.
`i-bem.js` provides a high-level API for accessing DOM nodes of blocks and elements. Accessing the DOM tree directly makes the code less robust to changes in the BEM libraries, and may cause errors that are difficult to detect.

## Dynamic changes to blocks and elements in the DOM tree

In modern interfaces, it is often necessary to create new
fragments of the DOM tree and replace old ones as part of the workflow (using AJAX). The following functions
are provided in `i-bem.js` for adding and replacing
fragments of the DOM tree.

-   Add a DOM fragment:
    -   `append` — to the end of the specified context.
    -   `prepend` — to the beginning of the specified context.
    -   `before` — before the specified context.
    -   `after` — after the specified context.
-   Replace a DOM fragment:
    -   `update` — inside the specified context.
    -   `replace` — replace the specified context with a new DOM fragment.

All the functions automatically [initialize blocks on the updated fragment of the DOM tree](i-bem-js-init.en.md#initialization-of-blocks-on-a-fragment-of-the-dom-tree).

To simplify the creation of BEM entities on updated fragments
of the DOM tree, you can use the
[BEMHTML](https://en.bem.info/platform/bem-xjst/) template engine by enabling
it as a [ym](https://github.com/ymaps/modules/blob/master/README.md) module. BEM entities are described in
[BEMJSON](https://en.bem.info/platform/bemjson/)
 format directly in the block code. The `BEMHTML.apply` function generates
HTML elements for the BEMJSON declarations according to
BEM naming conventions.

**Example:** The `attach` block `_updateFileElem` method deletes the `file` element if it exists, and creates a new element using the `BEMHTML.apply` function:

```js
modules.define('attach', ['BEMHTML', 'strings__escape', 'i-bem__dom'],
    function(provide, BEMHTML, escape, BEMDOM) {

    provide(BEMDOM.decl(this.name, {
        _updateFileElem : function() {

            var fileName = extractFileNameFromPath(this.getVal());

            this.elem('file').length && BEMDOM.destruct(this.elem('file'));

            BEMDOM.append(
                this.domElem,

                BEMHTML.apply({
                    block : 'attach',
                    elem : 'file',
                    content : [
                        {
                            elem : 'icon',
                            mods : { file : extractExtensionFromFileName(fileName) }
                        },
                        { elem : 'text', content : escape.html(fileName) },
                        { elem : 'clear' }
                    ]
                }));

            return this.dropElemCache('file');
        }
    }));

});
```
