<a name="init"></a>

Initialization
--------------

Block initialization creates a JS object corresponding to the block instance
in the browser memory. Initialization of block instances is performed by the
`init()` method of the `i-bem__dom` module on the specified fragment of the DOM tree.

Each instance of a block can be assigned three states:

-   The block instance is not initialized (the JS object has not been created).
-   The block instance is initialized (the JS object has been created in the browser memory).
-   The block instance was destroyed (all references to the block instance
    were deleted, and it may be removed by the garbage collector).

In `i-bem.js`, these states of the block instance are described using the
auxiliary `js` modifier.

-   Before initialization, the block instance does not have a `js` modifier.

```html
<div class="my-block i-bem" data-bem="...">
 ...
</div>
```

-   At the time of the block instance initialization, the
    `js` modifier is set to `inited`.

```html
<div class="my-block i-bem my-block_js_inited" data-bem="...">
 ...
</div>
```

-   If a fragment of the DOM tree is deleted during workflow (using the `destruct` method of the `i-bem__dom` module), block instances are also deleted with it if their HTML elements are all located in this fragment. Before deleting a block instance, the `js` modifier is deleted so that the block [instance destructors](#instance-destructors) are executed.

------------------------------------------------------------------------

**NB** If a block instance was [bound to multiple HTML elements](i-bem-js-html-binding.en.md#bound-to-multiple-html-elements), the block will exist as long as at least one element it is connected to remains in the HTML tree.

------------------------------------------------------------------------

If multiple instances of other blocks are located on an HTML element, the
initialization of one of them (the appearance of the `js_inited` modifier)
doesn't affect the initialization of the rest of them.

**Example**: Only the `my-block` instance is initialized on the HTML element.
The `lazy-block` instance is not initialized:

```html
<div class="my-block my-block_js_inited lazy-block i-bem" data-bem="{ " my-block="my-block">
 ...
</div>
```

------------------------------------------------------------------------

**NB** The presence of the `js` modifier makes it possible to write various CSS styles for
a block that depend on whether it is initialized or not.

------------------------------------------------------------------------

<a name="constructor"></a>

### Block instance constructor

[Triggers](i-bem-js-states.en.md#triggers) can be assigned for changing the values of the `js` modifier, the same way as for other block modifiers.

The trigger to set the `js` modifier to the `inited` value is executed
during block creation. This trigger can be considered a **block instance constructor**:

```js
onSetMod: {
    'js': {
        'inited': function() { /* ... */ } // block instance constructor
    }
}
```

<a name="destruct"></a>

### Block instance destructor

The moment of block deletion is the moment when all references to
the block JS object are destroyed. After this, the garbage collector can delete it from
browser memory.

The trigger to delete the `js` modifier (set it to an empty value
`''`) is executed before deleting the block. This trigger can be considered a
**block instance destructor**.

```js
onSetMod: {
    'js': {
        '': function() { /* ... */ } // block instance destructor
    }
}
```

<a name="init-wave"></a>

### Waves of initialization

The instances of blocks that are present on a page do not have
to be initialized simultaneously. The blocks can be added dyamically
and initialized on request or on an event.
Initialization of a consecutive group of blocks is called a **wave of initialization**.

A new wave of initialization is created in the following cases:

-   [Automatic initialization of blocks when the `domReady` event occurs](#automatic-initialization-of-blocks-when-the-)
-   [Initialization of a block when an event occurs](#initialization-of-a-block-when-an-event-occurs) (lazy initialization)
-   [Directly calling block initialization on a specified fragment of the DOM tree](#directly-calling-block-initialization-on-a-specified-fragment-of-the-dom-tree)

<a name="init-auto"></a>

### Automatic initialization

The *i-bem.js* framework allows automatically initializing blocks with DOM representation when the `domReady` event occurs.

For automatic initialization, JS objects will be created in browser memory for all the DOM nodes containing `i-bem` in the `class` attribute. Initialization is performed by the `init` function of the [i-bem__dom](https://en.bem.info/libs/bem-core/current/desktop/i-bem/jsdoc/) module.

To enable automatic initialization, specify the `i-bem` block with the `init` modifier set to the `auto` value in the `.deps.js` dependencies file.

**Example of** `.deps.js`:

```js
({
    shouldDeps: [
        {
            block: 'i-bem',
            elem: 'dom',
            mods: { 'init': 'auto' }
        }
    ]
})
```

The [page](../../common.blocks/page/) block already contains `i-bem__dom_init_auto` in dependencies, so if it is used in the project, nothing else needs to be enabled.

------------------------------------------------------------------------

**NB** Blocks that have lazy initialization set will not be initialized automatically.

------------------------------------------------------------------------

<a name="init-live"></a>

### Initialization on event (lazy initialization)

If a page has many instances of blocks, automatic initialization of
all the blocks at the time of loading is undesirable, since this increases the loading time
and the amount of memory consumed by the browser.

It is more convenient to initialize JS objects only when their functionality is needed by the user,
such as when the block is clicked. This is called **lazy** or **live** initialization.

The static property `live` is reserved in the declaration for describing conditions for lazy initialization. The `live` property can have the following types of values:

`Boolean`

-   `true` — Instances of blocks in this class will be initialized only when attempting to get the corresponding instance (see the section [Interaction of blocks](./i-bem-js-interact.en.md)).

```js
modules.define('my-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name,
    {
        onSetMod: {
            'js': {
                'inited': function() { /* ... */ } // this code will be executed
                                                   // the first time the block instance is accessed
            }
        }
    },
    { live: true } // static methods and properties
));

});
```

-   `false` — Allows cancelling lazy initialization of blocks that is set on another redefinition level.

`Function` – a function that is executed before initializing the **first instance** of a block of the specified class. If the function returns `false`, instances of the block will be initialized [automatically](#automatically).

```js
modules.define('my-block', ['i-bem__dom', 'ua'], function(provide, BEMDOM, ua) {

provide(BEMDOM.decl(this.name, {
    onSetMod : {
        'js' : {
            'inited' : function() {
                // executed when the block instance is first accessed
            }
        }
    }
}, {
    live : function() { // executed before initialization of the first instance of the block
        if(ua.msie && ua.version < 9) {
                          // disables lazy initialization of the block
            return false; // for old versions of Internet Explorer
        }
    }
}));

});
```

------------------------------------------------------------------------

**NB** Lazy initialization can be canceled for a specific instance of a block. To do this, specify `data-bem='{"live": false}'` in the [parameters](./i-bem-js-params.en.md) of the HTML element that the block instance is bound to.

------------------------------------------------------------------------

To initialize block instances as DOM events or BEM events occur, subscribe to [delegated events](i-bem-js-events.en.md#delegated-events) in the function body or use a [helper](#helper).

**Example:** Instances of `my-block` will be initialized on the `click` DOM event on the block DOM node. For each `click` DOM event, the `_onClick` method of the block instance is called:

```js
modules.define('my-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        'js': {
            'inited': function() { /* ... */ } // executed on the first "click" DOM event
        }
    },

    _onClick: function(e) { /* ... */ } // executed on every ”click“ DOM event
}, {
    live: function() {
        this.liveBindTo('click', function(e) {
            this._onClick(e);   // block instance will be created when a click occurs
                                // and its _onClick method will be called
        });
    }
}));

});
```

------------------------------------------------------------------------

**NB** The `live` property applies to static methods of a block class. So even if it is set in the block declaration with a particular modifier, `live` will be applied to all the blocks in this class, regardless of the modifiers.

------------------------------------------------------------------------

<a name="init-live-helpers"></a>

### Helpers for initialization on an event

To simplify initialization on events in the context of a block instance, a set of helper methods is reserved for subscribing to the following types of events:

-   DOM events:
    -   `liveBindTo([elemName], event, [callback])` — Subscribes to an event on the block DOM node or its elements, with deferred initialization. The block will be initialized on the first `event`. The `callback` handler function will be called on `event` and after block initialization.
    -   `liveUnbindFrom([elemName], event, [callback])` — Deletes the subscription with deferred initialization on an event on the block DOM node or its elements.
    -   `liveInitOnEvent([elemName], event, callback)` — Initialization on an event on the block DOM node or its elements.
-   BEM events:
    -   `liveInitOnBlockEvent(event, blockName, callback)` — Initialization on a BEM event of an instance of a different block placed on the DOM node of the current block instance.
    -   `liveInitOnBlockInsideEvent(event, blockName, [callback])` — Initialization on a BEM event of an instance of a different block nested in the DOM node of the current block instance.

For example, the `menu` block is initialized on the `click` **BEM event** of the nested `menu-item` block.

```js
modules.define('menu', ['i-bem__dom', 'menu-item'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    _onItemClick : function(e, data) {
        // handler function for the ”click“ BEM event on nested ”menu-item“ instances
    }
}, {
    live : function() {
        this.liveInitOnBlockInsideEvent('click', 'menu-item', function(e, data) {
            this._onItemClick(e, data);
        });
    }
}));

});
```

<a name="init-ajax"></a>

### Initialization of blocks on a fragment of the DOM tree

The initialization of JS objects can be called
directly for a specified fragment of the DOM tree. This is often necessary when developing AJAX interfaces,
when new instances of blocks have to be [dynamically added](i-bem-js-dom.en.md#dynamically-added) to a page or existing ones have to be updated.

In `i-bem.js`, the following functions perform dynamic initialization of blocks:

-   `init`, `destruct` – Initialization/destruction of blocks on a specified fragment of the DOM tree.
-   `update`, `replace`, `append`, `prepend`, `before`, `after` – Adding/replacing a fragment of the DOM tree with simultaneous initialization of blocks on the updated fragment.

For an example of using functions that perform dynamic initialization, see [Dynamically updating blocks and elements in the DOM tree](i-bem-js-dom.en.md#dynamically-updating-blocks-and-elements-in-the-dom-tree).

<a name="destruct-dom"></a>

### Deleting blocks on a fragment of the DOM tree

Like the block initialization process, the deletion process can be called directly for a specified fragment of the DOM tree. For example, you may use this for dynamically deleting instances of blocks from a page when developing AJAX interfaces.

Explicitly invoking this procedure guarantees correct deletion of:

-   Nested DOM nodes.
-   Blocks mixed into other blocks.

Use the `BEMDOM.destruct` static method to explicitly invoke deletion.

The method accepts:

-   `ctx` `{jQuery}` – The root DOM element. Deleted together with all the nested DOM nodes.
-   `excludeSelf` `{Boolean}` – Doesn't delete the root DOM element if set to `true`. By default, `false`.

<a name="init-bem"></a>

### Initializing and deleting blocks without DOM representation

Use the `BEM.create` method for creating JS objects of a block without DOM representation (that aren't bound to an HTML element).

The method accepts:

-   `name` `{String|Object}` – The name of the block.

Returns an instance of a block of the specified class.

**Deletion** of instances of blocks without DOM representation can't be
performed automatically. Blocks without DOM representation are normal JS objects and are deleted when
all the references to the block object are deleted.
