<a name="ibc"></a>

Interaction of blocks
---------------------

In the scope of the BEM methodology, blocks should be developed in a way that minimizes their dependency on each others' states. However, the ideal of fully independent blocks is not achievable in practice.

Block interaction can be implemented in the following ways:

-   By subscribing to [BEM events](i-bem-js-events.en.md#bem-events) on other block instances
     or subscribing to [delegated BEM events](i-bem-js-events.en.md#delegated-bem-events).
-   By directly calling methods of other block instances
     or static methods of another block class.
-   By checking the states of one of the blocks.
-   Through *event channels* (for example, using the [channels](../../common.blocks/events/__channels) element in the `events` block).

------------------------------------------------------------------------

**NB** Don't use [DOM events](i-bem-js-events.en.md#dom-events) for
arranging interaction between blocks. DOM events are intended
only for implementing internal procedures of a block.

------------------------------------------------------------------------

The following `i-bem.js` APIs are provided for implementing interaction between blocks:

-   [Searching for block instances in the DOM tree](i-bem-js-dom.en.md#searching-for-block-instances-in-the-dom-tree)
-   [Access to block instances without DOM representation](i-bem-js-html-binding.en.md#access-to-block-instances-without-dom-representation)
-   [Access to block classes](#access-to-block-classes)

<a name="api-class"></a>

### Access to block classes

You can get JS components corresponding to block classes via the [module system](https://github.com/ymaps/modules). This is also true for blocks [without DOM representation](i-bem-js-html-binding.en.md#without-dom-representation).

Access to block classes is needed for:

-   [Delegating BEM events](i-bem-js-events.en.md#delegating-bem-events).
-   [Redefining](i-bem-js-decl.en.md#redefining) a block declaration.
-   Calling static methods of a class.

**Example:** Calling the `close` static method for the `popup` block will close all popups on the page.

```js
modules.define('switcher', ['i-bem__dom', 'popup'], function(provide, BEMDOM, Popup) {

provide(BEMDOM.decl(this.name,
    {
        onSetMod : {
            'popup' : {
                'disabled' : function() {
                    Popup.close();
                }
            }
        }
    }
));

});
```
