<a name="events"></a>

Events
------

In `i-bem.js`, two types of events are supported:

-   **DOM events** — jQuery events on the DOM node connected with
    the block. They reflect the user's interaction with the interface (clicks,
    moving the mouse, entering text, and so on). DOM events are usually handled by
    the block instance of the DOM nodes where they occur.
-   **BEM events** — Private events generated
    by the block. They make it possible to form an API for
    [interaction with the block](./i-bem-js-interact.en.md). BEM events are usually handled by
    an instance of the block that monitors the state of other blocks
    where events are generated.

DOM events should be used only in *internal* block procedures. Use BEM events for
a block interaction with the *external* environment (other blocks).

<a name="delegated-events"></a>

### Delegating events

Handling BEM events and DOM events can be **delegated** to a container
(the entire document, or a specific DOM node). In this case, the container
serves as a handling point for events that occur on any of its
child nodes, even if some of the child nodes didn't exist yet
at the time of subscribing to events.

For example, a menu block can contain nested blocks — the menu items. Handling
clicks on the menu items should logically be delegated to the menu
block. First, this saves resources on
subscribing to events (less resources are consumed by subscribing to a container single event
than by subscribing to many events on elements). Second, this makes it possible to add and remove menu items without subscribing to the events of added items or unsubscribing from the events of removed items.

Both BEM events and DOM events can be delegated.

<a name="dom-events"></a>

### DOM events

Interaction with DOM events in `i-bem.js` is fully implemented using the jQuery framework.

#### Subscribing to DOM events

A set of methods for subscribing to DOM events is reserved on the block instance object:

-   `bindTo([elem], event, handler)` — To events of the block main DOM node and its elements DOM nodes.
-   `bindToDoc(event, [data], handler)` – To events of the `document` DOM node.
-   `bindToWin(event, [data], handler)` – To events of the `window` DOM node.

**Example:** At [initialization of the block instance](./i-bem-js-init.en.md)
`my-block`, the `click` event is subscribed to. When this event occurs,
the block sets its `size` [modifier](./i-bem-js-states.en.md) to `big`.

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited': function() {
                this.bindTo('click', function(e) {
                    this.setMod('size', 'big');
                });
            }
        }
    }
});
```

**Example:** At [initialization of the block instance](./i-bem-js-init.en.md) `my-form`, it subscribes to the
`click` event on the `submit` element. When the event occurs,
the `_onSubmit` handler function will be invoked.

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited': function() {
                this.bindTo('submit', 'click', this._onSubmit);
            }
        }
    },

    _onSubmit : function() { /* ... */ }
});
```

------------------------------------------------------------------------

**NB** The handler function is executed in the context of the
block instance where the event occurred.

------------------------------------------------------------------------

#### Removing subscriptions to DOM events

Subscriptions to DOM events are removed automatically when a block instance is destroyed. However, the block instance object has a set of methods reserved for removing subscriptions manually while the block is working:

-   `unbindFrom([elem], event, [handler])` — Unsubscribing from events of the block main DOM node and its elements DOM nodes.
-   `unbindFromDoc(event, [handler])` – Unsubscribing from events of the `document` DOM node.
-   `unbindFromWin(event, [handler])` – Unsubscribing from events of the `window` DOM node.

If the handler function isn't specified when calling one of these methods, all the handlers are removed that were set by the block on the DOM node for this event.

```js
_stopKeysListening : function() {
    this.unbindFromDoc('keydown');  // removing all the handlers of the 'keydown' event
                                    // set by the block for the 'document' DOM node
}
```

#### DOM event object

The first argument the handler function gets is a jQuery object for the DOM event — [`{jQuery.Event}`](https://api.jquery.com/category/events/event-object/).

This allows using the `stopPropagation` and `preventDefault` object methods for managing event propagation and the browser reaction to an event.

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited': function() {
                this.bindTo('click', function(e) {
                    e.stopPropаgation(); // prevents the event from bubbling up
                    this._onSubmit();
                });
            }
        }
    },

    _onSubmit : function() {
        /* ... */
    }
});
```

A DOM event can be generated manually, such as using the jQuery `trigger` function. After the event object, the handler function of the DOM event gets arguments with the parameters that were used to call `trigger` when the event was created.

------------------------------------------------------------------------

**NB** Parameters for the environment and behavior of an event handler function are identical to the jQuery [handler function](http://api.jquery.com/on/#event-handler).

------------------------------------------------------------------------

<a name="dom-events-delegated"></a>

#### Delegating DOM events

We recommend using the `liveBindTo([elem], event, handler)` method to delegate handling DOM events. In the block [static declaration methods](./i-bem-js-decl.en.md), the `live` property is reserved for subscribing to delegated DOM events.

**Example:** All instances of the `menu` block subscribe to the delegated `click` DOM event for their `item` elements. The `_onItemClick` method of the `menu` block instance will be invoked when any `item` in the menu is clicked. It doesn't matter whether this item existed when the instance was initialized.

```js
BEMDOM.decl('menu', {
    _onItemClick : function(e) { /* ... */ }
}, {
    live : function() {
        this.liveBindTo('item', 'click', function(e) {
            this._onItemClick(e);
        });
    }
});
```

If the `live` property is set in the block declaration, the initialization of block instances will be *deferred* until the moment when the block instance is needed ([lazy initialization](./i-bem-js-init.en.md#lazy-initialization)). This moment could be a DOM event on the block instance that was delegated the subscription, or a request sent to the block instance [from another block](./i-bem-js-interact.en.md).

------------------------------------------------------------------------

**NB** A handler function is executed in the context of the nearest block of this type in the direction of the DOM event bubbling (from bottom to top through the DOM tree).

------------------------------------------------------------------------

To use delegated events in a block without deferring initialization, the function set in the `live` property should return `false`:

```js
modules.define('my-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name,
    {
        _onClick: function() { /* ... */ }  // will be run each time
                                            // the 'click' event occurs
    },
    {
        live: function() {
            this.liveBindTo('click', function() { this._onClick() });
            return false; // block instances will be initialized automatically
        }
    }
));

});
```

<a name="bem-events"></a>

### BEM events

In contrast to DOM events, BEM events are not generated on DOM elements, but on **block instances**. Block elements can't generate BEM events.

<a name="bem-events-subscribe"></a>

#### Generating BEM events

The `emit(event, [data])` method of a block instance is used for generating BEM events.

DOM events occur when a user interacts with a block controls. BEM events can be created as part of their processing by the block. This allows a level of abstraction over DOM events. BEM events are generated as a reaction to DOM events, but subject to certain conditions, such as whether a modifier is present or has a specific value.

For example, a click on the `submit` button (the `click` DOM event) will generate the `click` **BEM event** only if the block doesn't have the `disabled` modifier set:

```js
BEMDOM.decl('submit', {
    onSetMod: {
        'js': {
            'inited': function() {
                this.bindTo('click', this._onClick); // subscribing to the "click" DOM event
            }
        }
    },

    _onClick: function() {
        if(!this.hasMod('disabled')) {
            this.emit('click'); // creating the "click" BEM event
        }
    }
});
```

You can pass any data as the second `emit` argument, which will be accessible as the second argument of the handler function.

<a name="bem-events-subscribe"></a>

#### Subscribing to BEM events

The `on(event, [data], handler, [handlerCtx])` method of a block instance is used for subscribing to BEM events on block instances.

**Example:** At initialization of an HTML form (an instance of the `my-form` block), a search is performed for the `submit` button embedded in the form, and its `click` BEM event is subscribed to. As a result, when the button (an instance of the `submit` block) is clicked, the `_onSubmit` method is executed for the form (the instance of the `my-form` block).

```js
BEMDOM.decl('my-form', {
    onSetMod: {
        'js': {
            'inited': function() {
                this.findBlockInside('submit').on(
                    'click', // name of the BEM event
                    this._onSubmit, // method of the 'my-form' block instance
                    this); // context for executing _onSubmit — the my-form block
            }
        }
    },

    _onSubmit: function() { /* ... */ }
});
```

------------------------------------------------------------------------

**NB** If you don't pass the `[handlerCtx]` argument, the context for the handler function will be the block where the BEM event occurred (in the example above, this is the `submit` block).

------------------------------------------------------------------------

<a name="bem-events-unsubscribe"></a>

#### Removing subscriptions to BEM events

Subscriptions to BEM events are removed automatically when the block instance is destroyed. To remove a subscription manually, use the
`un(event, [handler], [handlerCtx])` method of the block instance.

<a name="bem-events-modchange"></a>

#### Events when modifiers are changed

Use the `on(event, [data], handler, [handlerCtx])` block instance method for subscribing to BEM events for changes to a modifier of a block or element. The method accepts the arguments:

-   The properties object of the modifier that is being subscribed to.
-   The handler function that is executed when setting the corresponding modifier.

The object describing the modifier can contain the following reserved properties:

-   `modName` `{String}` – Modifier name. Required property.
-   `modVal` `{String}` – Modifier value. Required property. With the value `*`, the subscription is for setting the modifier to **any** value. With the value `''`, the subscription is for **deleting** the modifier. For more information, see the section [Triggers for setting modifiers](i-bem-js-states.en.md#triggers-for-setting-modifiers).
-   `elem` `{String}` – Element name (for element modifiers).

**Example**: At initialization, the `form` block subscribes to the event of changing a modifier on the nested `submit` block. For example, subscriptions can be for:

-   Setting the `disabled` modifier to any value.

    ```js
    BEMDOM.decl('form', {
    onSetMod: {
        'js': {
            'inited': function() {
                var submit = findBlockInside('submit');
                submit.on({ modName : 'disabled', modVal : '*' }, function() {});
            }
        }
    },
    });
    ```

-   Setting the `'disabled'` modifier to `'true'`.

    ```js
    submit.on({ modName : 'disabled', modVal : 'true' }, function() {});
    ```

-   Removing the `'disabled'` modifier.

    ```js
    submit.on({ modName : 'disabled', modVal : '' }, function() {});
    ```

-   Removing the `m1` modifier from the `'control'` element.

    ```js
    submit.on({ elem : 'control', modName : 'm1', modVal : '' }, function() {});
    ```

<a name="bem-events-delegated"></a>

#### Delegating BEM events

Delegating BEM events means that the block subscribes to a particular BEM event on **all instances** of the block with the specified name **in the scope of the specified context**.

Subscribing to delegated BEM events is performed using the `MyBlock.on([ctx], event, [data], handler, [handlerCtx])` static method of the block class.

-   `{jQuery} [ctx]` — The DOM node where BEM events are monitored (the container). If omitted, the entire document is used as the container.
-   `{String} event` — Name of the BEM event.
-   `{Object} [data]` — Any data passed to the handler function.
-   `{Function} handler` — Event handler function.
-   `{Object} [handlerCtx]` — Context of the event handler function. If omitted, the handler function executes in the context of the block instance where the event occurred.

**Example:** During initialization of the `menu` block instance, it subscribes to the `click` BEM event on all links (instances of the `link` block) in the scope of the block DOM node (`this.domElem`). The current block instance is passed as the handler function context.

```js
modules.define('menu', ['i-bem__dom', 'link'], function(provide, BEMDOM, Link) {

provide(BEMDOM.decl(this.name,
    onSetMod : {
        'js' : {
            'inited' : function() {
                Link.on( // subscribing to BEM event
                    this.domElem, // container — the DOM node of the 'menu' block instance
                    'click', // BEM event
                    this._onLinkClick, // handler
                    this); // handler context — an instance of the 'menu' block
            },

            '' : function() {
                Link.un( // unsubscribing from the BEM event
                    this.domElem,
                    'click',
                    this._onLinkClick,
                    this);
            }
        }
    },

    _onLinkClick : function(e) {
        var clickedLink = e.target; // instance of the 'link' block
                                    // where the 'click' BEM event occurred
    }
});

});
```

Any BEM events can be delegated, including events for changes to modifiers.

------------------------------------------------------------------------

**NB** **Unsubscribing** from delegated BEM events never happens automatically. Subscriptions should always be removed explicitly using
the block static method `un([ctx], event, [handler], [handlerCtx])`.

------------------------------------------------------------------------

<a name="api"></a>

### BEM event object

When invoked, a handler function gets an argument with an object describing the BEM event. The BEM event object class `events.Event` is defined in the [ym](https://github.com/ymaps/modules) module of [`events`](../../common.blocks/events/events.vanilla.js) in the bem-core library. This object contains the fields:

-   `target` — Instance of the block where the BEM event occurred.
-   `data` — Any additional data passed as the `data` argument when subscribing to a BEM event.
-   `result` — The last value returned by this event handler. The same as [jQuery.Event.result](https://api.jquery.com/event.result/).
-   `type` — The type of event. The same as [jQuery.Event.type](https://api.jquery.com/event.type/).

For more information about properties and methods of a BEM event object, see the [documentation for the 'events' block](../../common.blocks/events).
