# Migration

## 4.0.0

### Changes in the `i-bem` block

#### Separate `i-bem-dom` block

The `dom` element of the `i-bem` block was moved to a separate `i-bem-dom` block.

Before:

```js
modules.define('my-dom-block', ['i-bem__dom'], function(provide, BEMDOM) {
    /* ... */
});
```

After:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom) {
    /* ... */
});
```

The `i-bem` and `i-bem-dom` blocks are no longer classes. They are modules with methods for declaring BEM entities, links to classes of BEM entities, and some additional helpers. These methods are no longer class methods for the corresponding blocks.

Issue: [#413](https://github.com/bem/bem-core/issues/413).

#### Declaration

#### Block declaration

Instead of the `decl()` method, use the `declBlock()` method to declare a block.

Before:

```js
modules.define('my-dom-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, { /* ... */ }));

});
```

After:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, { /* ... */ }));

});
```

#### Modifier declaration

Instead of the static `decl()` method, use the static `declMod()` method to declare a modifier.

Before:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.decl({ modName : 'my-mod', modVal : 'my-val' }, { /* ... */ }));

});
```

After:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.declMod({ modName : 'my-mod', modVal : 'myVal' }, { /* ... */ }));

});
```

#### Boolean modifier declaration

Before:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.decl({ modName : 'my-mod', modVal : 'true' }, { /* ... */ }));

});
```

After:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.declMod({ modName : 'my-mod' }, { /* ... */ }));

});
```

Issue: [#1374](https://github.com/bem/bem-core/issues/1374).

#### Declaration for a modifier with any value

Before:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.decl({ modName : 'my-mod' }, { /* ... */ }));

});
```

After:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.declMod({ modName : 'my-mod', modVal : '*' }, { /* ... */ }));

});
```

Issue: [#1376](https://github.com/bem/bem-core/pull/1376).

#### Block redefinition

Instead of the `decl()` method for a block class, use the `declBlock()` method for the `i-bem-dom` module.

Before:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.decl({ /* ... */ }));

});
```

After:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom, MyDomBlock) {

provide(bemDom.declBlock(MyDomBlock, { /* ... */ }));

});
```

#### Inherited block declaration

Before:

```js
modules.define('my-dom-block', ['i-bem__dom', 'my-base-dom-block'], function(provide, BEMDOM, MyBaseDomBlock) {

provide(BEMDOM.decl({ block : this.name, baseBlock : MyBaseDomBlock }, { /* ... */ }));

});
```

After:

```js
modules.define('my-dom-block', ['i-bem-dom', 'my-base-dom-block'], function(provide, bemDom, MyBaseDomBlock) {

provide(bemDom.declBlock(this.name, MyBaseDomBlock, { /* ... */ }));

});
```

#### Mix declaration

The `declMix` method has been renamed to `declMixin`. This clarifies the concept of [mixes of multiple BEM entities on a single DOM node](https://en.bem.info/methodology/key-concepts/#Mix) as opposed to JS-level mixins.

Before:

```js
modules.define('my-mix-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.declMix(this.name, { /* ... */ }));

});
```

After:

```js
modules.define('my-mixin-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declMixin({ /* ... */ }));

});
```

#### Mixing a mixin

Before:

```js
modules.define('my-dom-block', ['i-bem__dom', 'my-mix-1', 'my-mix-2'], function(provide, BEMDOM) {

provide(BEMDOM.decl({ block : this.name, baseMix : ['my-mix-1', 'my-mix-2']}, { /* ... */ }));

});
```

After:

```js
modules.define('my-dom-block', ['i-bem-dom', 'my-mixin-1', 'my-mixin-2'], function(provide, bemDom, MyMixin1, MyMixin2) {

provide(bemDom.declBlock(this.name, [MyMixin1, MyMixin2], { /* ... */ }));

});
```

#### Triggers for changing modifiers

When declaring a specific modifier (for example, `_my-mod_my-val`), it wasn't possible to declare the behavior for deleting this modifier. We had to make two declarations.

Before:

```js
//

modules.define('my-dom-block', function(provide, MyDomBlock) {

MyDomBlock.decl({
    onSetMod : {
        'my-mod' : {
            '' : function() { /* ... */ } // declaration for deleting the _my-mod_my-val modifier
        }
    }

});

provide(MyDomBlock.decl({ modName : 'my-mod', modVal : 'my-val' }, { /* ... */ }));

});
```

After:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.declMod({ modName : 'my-mod', modVal : 'my-val' }, {
    onSetMod : {
        'mod1' : {
            '' : function() { /* ... */ } // declaration for deleting the _my-mod_my-val modifier
        }
    }
}));
});
```

Issue: [#1025](https://github.com/bem/bem-core/issues/1025).

Shorthand syntax is now available for declaring behaviors for changing modifiers.

Before:

```js
onSetMod : {
    'my-mod' : {
        '*' : function(modName, modVal, prevModVal) {
            if(prevModVal === 'my-val') {
                /* ... */ // declaration for changing _my-mod_my-val to any other value
            }
        }
    }
}
```

After:

```js
onSetMod : {
    'my-mod' : {
        '~my-val' : function() { /* ... */ } // declaration for changing the my-mod value from my-val to any other value
        }
    }
}
```

Before:

```js
onSetMod : {
    'my-mod' : {
        '*' : function(modName, modVal) {
            if(modVal !== 'my-val') {
                /* ... */ // declaration for changing my-mod to any value other than my-val
            }
        }
    }
}
```

After:

```js
onSetMod : {
    'my-mod' : {
        '!my-val' : function() { /* ... */ } // declaration for changing my-mod to any value other than my-val
        }
    }
}
```

Issue: [#1072](https://github.com/bem/bem-core/issues/1072).


#### Lazy initialization

The functionality of the `live` field has been divided into two parts: the `lazyInit` field and the `onInit()` method.

Before:

```js
modules.define('my-dom-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, { /* ... */ }, {
    live : true
}));

});
```

After:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, { /* ... */ }, {
    lazyInit : true
}));

});
```

Before:

```js
modules.define('my-dom-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, { /* ... */ }, {
    live : function() {
        /* ... */
    }
}));

});
```

After:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, { /* ... */ }, {
    lazyInit : true,

    onInit : function() {
        /* ... */
    }
}));

});
```

Before:

```js
modules.define('my-dom-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, { /* ... */ }, {
    live : function() {
        /* ... */
        return false;
    }
}));

});
```

After:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, { /* ... */ }, {
    onInit : function() {
        /* ... */
    }
}));

});
```

Before:

```js
{
    block : 'b1',
    js : { live : false }
}
```

After:

```js
{
    block : 'b1',
    js : { lazyInit : false }
}
```

Issue: [#877](https://github.com/bem/bem-core/issues/877).

#### Instances for elements

Deleted the `elem-instances` element of the `i-bem` block and the `elem-instances` modifier of the `dom` element in the `i-bem` block.
Now the corresponding functionality is incorporated into `i-bem` and `i-bem-dom`.

Before:

```js
modules.define('my-dom-block__my-elem', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl({ block : 'my-dom-block', elem : 'my-elem' }, { /* ... */ }));

});
```

After:

```js
modules.define('my-dom-block__my-elem', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declElem('my-dom-block', 'my-elem', { /* ... */ }));

});
```

Now the `_elem(elemName)` method of the block instance (previously `elem(elemName)`) returns an instance of the element's class, instead of a jQuery object with all the elements named `elemName`.

To get a collection of instances of the element's class, use the `_elems()` method.


Now the caches for elements with JS implementation found with `_elem()` and `_elems()` are invalidated automatically when the DOM is modified.
Issue: [#1352](https://github.com/bem/bem-core/issues/1352).

Note: When this methods are used for elements without JS implementation you still need to use `_dropElemCache()` in cases of dynamically DOM update.

Note: don't forget to switch on support for elements instances in template engine.
For `bem-xjst` please refer to https://github.com/bem/bem-xjst/blob/master/docs/en/3-api.md#support-js-instances-for-elements-bem-core-v4 or for `BH` see https://github.com/bem/bh#jselem.

##### Ways to work with elements

Before:

```js
this.setMod(this.elem('my-elem'), 'my-mod', 'my-val');
```

After:

```js
this._elem('my-elem').setMod('my-mod', 'my-val');
```

The same is true for the methods `getMod()`, `hasMod()`, `toggleMod()`, and `delMod()`.

##### Deleted methods and fields

The following methods were deleted from the block API: `elemify()`, `elemParams()`, and the `onElemSetMod` field. The corresponding functionality is provided in instances of elements.

Also see  the changes for [search methods](#Search-methods).

Issue: [#581](https://github.com/bem/bem-core/issues/581).

#### Search methods

Renamed the following methods:

- `findBlockInside()` to `findChildBlock()`
- `findBlocksInside()` to `findChildBlocks()`
- `findBlockOutside()` to `findParentBlock()`
- `findBlocksOutside()` to `findParentBlocks()`
- `findBlockOn()` to `findMixedBlock()`
- `findBlocksOn()` to `findMixedBlocks()`

The optional first parameter about the element has been removed from these methods.

Added the following methods: `findChildElem()`, `findChildElems()`, `findParentElem()`, `findParentElems()`, `findMixedElem()`, `findMixedElems()`.

Before:

```js
this.findBlockInside(this.elem('my-elem'), 'my-block-2');
```

After:

```js
this.findChildElem('my-elem').findChildBlock(MyBlock2);
```

Deleted the following methods: `findElem()`, `closestElem()`. Use the `findChildElem()` and `findParentElem()` elements, instead.

The methods `findChildBlocks()`, `findParentBlocks()`, `findMixedBlocks()`, `findChildElems()`, `findParentElems()`, and `findMixedElems()` return [collections of BEM entities](#Collections).

The `findChildElem()` and `findChildElems()` methods (unlike the previous equivalent `findElem`) don't search on their own DOM nodes of the instance.

Before:

```js
this.findElem('my-elem');
```

After:

```js
this.findChildElems('my-elem').concat(this.findMixedElems('my-elem'));
```

However, consider whether you really need both searches. In most cases, you can just use either `this.findChildElems('my-elem')` or `this.findMixedElems('my-elem')`.

##### Checking for nesting

In place of the deleted `containsDomElem()` method, use the `containsEntity()` method.

Before:

```js
this.containsDomElem(someElem);
```

After:

```js
this.containsEntity(someElem);
```

#### Collections

The functionality of the `collection` element of the `i-bem` block is no longer optional.

All methods that return an array of BEM entities now return collections.

Before:

```js
this.findBlocksInside('my-block-2')[0].setMod('my-mod', 'my-val');
```

After:

```js
this.findChildBlocks(MyBlock2).get(0).setMod('my-mod', 'my-val');
```

Before:

```js
this.findBlocksInside('my-block-2').forEach(function(myBlock2) {
    return myBlock2.setMod('my-mod', 'my-val');
});
```

After:

```js
this.findChildBlocks(MyBlock2).setMod('my-mod', 'my-val');
```

Issue: [#582](https://github.com/bem/bem-core/issues/582).

#### Events

The events API has been simplified. Deleted the following block instance methods: `on()`, `un()`, `once()`, `bindTo()`, `unbindFrom()`, `bindToDoc()`, `bindToWin()`, `unbindFromDoc()`, `unbindFromWin()`, and class methods: `liveBindTo()`, `liveUnbindFrom()`, `on()`, `un()`, `once()`, `liveInitOnBlockEvent()`, `liveInitOnBlockInsideEvent()`.
They have been replaced with the new `_domEvents()` and `_events()` methods, which return an instance of the events manager class with the `on()`, `un()` and `once()` methods.

##### DOM events on instances

Before:

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this.bindTo('click', this._onClick);
            }
        }
    }
});
```

After:

```js
bemDom.declBlock('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._domEvents().on('click', this._onClick);
            }
        }
    }
});
```

Before:

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this.bindToDoc('click', this._onDocClick);
            }
        }
    }
});
```

After:

```js
bemDom.declBlock('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._domEvents(bemDom.doc).on('click', this._onDocClick);
            }
        }
    }
});
```

Before:

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this.bindToWin('resize', this._onWinResize);
            }
        }
    }
});
```

After:

```js
bemDom.declBlock('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._domEvents(bemDom.win).on('resize', this._onWinResize);
            }
        }
    }
});
```

##### Link to instance

If an event was fired on BEM instance the event object will contain a link to an instance:

```js
this._domEvents('my-elem').on('click', function(e) {
    e.bemTarget // refers to `my-elem` instance
});
```

##### BEM events on instances

Before:

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this.findBlockOutside('my-block-2').on('my-event', this._onMyBlock2MyEvent, this);
            },

            '' : function() {
                this.findBlockOutside('my-block-2').un('my-event', this._onMyBlock2MyEvent, this);
            }
        }
    }
});
```

After:

```js
bemDom.declBlock('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._events(this.findParentBlock('my-block-2')).on('my-event', this._onMyBlock2MyEvent);
            }
        }
    }
});
```

Note that unsubscribing from events is now automatic when the instance is destroyed.

##### Delegated DOM events

Before:

```js
BEMDOM.decl('my-block', { /* ... */ }, {
    live : function() {
        this.liveBindTo('click', this.prototype._onClick);
    }
});
```

After:

```js
bemDom.declBlock('my-block', { /* ... */ }, {
    onInit : function() {
        this._domEvents().on('click', this.prototype._onClick);
    }
});
```

Before:

```js
BEMDOM.decl('my-block', { /* ... */ }, {
    live : function() {
        this.liveBindTo('my-elem', 'click', this.prototype._onMyElemClick);
    }
});
```

After:

```js
bemDom.declBlock('my-block', { /* ... */ }, {
    onInit : function() {
        this._domEvents('my-elem').on('click', this.prototype._onMyElemClick);
    }
});
```

##### Delegated BEM events

Before:

```js
BEMDOM.decl('my-block', { /* ... */ }, {
    live : function() {
        this.liveInitOnBlockInsideEvent('my-event', 'my-block-2', this.prototype._onMyBlock2MyEvent);
    }
});
```

After:

```js
bemDom.declBlock('my-block', { /* ... */ }, {
    onInit : function() {
        this._events(MyBlock2).on('my-event', this.prototype._onMyBlock2MyEvent);
    }
});
```

Note that the parameter with the event handler function is now required.

Before:

```js
modules.define('my-block', ['i-bem__dom', 'my-block-2'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, { /* ... */ }, {
    live : function() {
        this.liveInitOnBlockInsideEvent('my-event', 'my-block-2');
    }
}));

});
```

After:

```js
modules.define('my-block', ['i-bem-dom', 'my-block-2', 'functions'], function(provide, bemDom, MyBlock2, functions) {

provide(bemDom.declBlock(this.name, { /* ... */ }, {
    onInit : function() {
        this._events(MyBlock2).on('my-event', functions.noop);
    }
}));

});
```

Before:

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                MyBlock2.on(this.domElem, 'my-event', this._onMyBlock2MyEvent, this);
            },

            '' : function() {
                MyBlock2.un(this.domElem, 'my-event', this._onMyBlock2MyEvent, this);
            }
        }
    }
});
```

After:

```js
bemDom.declBlock('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._events(MyBlock2).on('my-event', this._onMyBlock2MyEvent);
            }
        }
    }
});
```

Note that unsubscribing from events is now automatic when the instance is destroyed.

#### External code accessing BEM blocks

##### Getting an instance of a BEM block

Now the `bem()` method of a jQuery object accepts a BEM class instead of a string.

Before:

```js
modules.require(['jquery', 'i-bem__dom'], function($, BEMDOM) {

var myBlock = $('.my-block').bem('my-block');

});
```

After:

```js
modules.require(['jquery', 'my-block'], function($, MyBlock) {

var myBlock = $('.my-block').bem(MyBlock);

});
```

##### Subscribing to BEM events from external code

Before:

```js
modules.require(['jquery', 'i-bem__dom'], function($, BEMDOM) {

$('.my-block').bem('my-block').on('my-event', function() { /* ... */ });

});
```

After:

```js
modules.require(['jquery', 'my-block', 'events__observable'], function($, MyBlock, observable) {

observable($('.my-block').bem(MyBlock))
    .on('my-event', function() { /* ... */ });

});
```

In addition, you must add `{ block : 'events', elem : 'observable', mods : { type : 'bem-dom' } }` to the dependency.

Issue: [#394](https://github.com/bem/bem-core/issues/394).

#### Names of protected methods begin with `_`

Renamed the protected methods:

- `emit()` to `_emit()`
- `elem()` to `_elem()`
- `dropElemCache()` to `_dropElemCache()`
- `buildClass()` to `_buildClassName()`
- `buildSelector()` to `_buildSelector()`
- `getDefaultParams()` to `_getDefaultParams()`

Issues: [#586](https://github.com/bem/bem-core/issues/586) and [#1359](https://github.com/bem/bem-core/issues/1359).

#### Deleted methods

Deleted the `getMods()` method.

### Changes in the `querystring` block

The `querystring__uri` element is now the `uri` block. The `querystring` block is now the `uri__querystring` element.

Issue: [#967](https://github.com/bem/bem-core/issues/967).

### Changes in the `page` block

The `page__css` element does not support `ie` field. Use the `page__conditional-comment` element instead.

Before:

```
{
    block : 'page',
    head : [
        { elem : 'css', url : 'my-css.css', ie : false },
        { elem : 'css', url : 'my-css', ie : true }
    ],
    content : 'Page content'
}
```

After:

```
{
    block : 'page',
    head : [
        {
            elem : 'conditional-comment',
            condition : '! IE',
            content : { elem : 'css', url : 'my-css.css' }
        },
        {
            elem : 'conditional-comment',
            condition : '> IE 8',
            content : { elem : 'css', url : 'my-css.ie.css' }
        }
        // and so on for needed IE versions
    ],
    content : 'Page content'
}
```

Issue: [#379](https://github.com/bem/bem-core/issues/379).

## 3.0.0

To migrate to version 3.0.0, review the [history of changes](https://en.bem.info/libs/bem-core/v3/changelog/#300).

## 2.0.0

To migrate to version 2.0.0, review the [history of changes](https://en.bem.info/libs/bem-core/v2/changelog/#200).

## 1.0.0

For version 1.0.0, migrating requires switching from using [bem-bl](https://github.com/bem/bem-bl/) to using [bem-core](https://github.com/bem/bem-core/).

### Modules

The entire code is now written in terms of the modular system https://github.com/ymaps/modules.
All dependencies must be explicitly stated in the code. Minimize or eliminate use of global variables, if possible.

Example:

```js
modules.define(
    'my-module', // module name
    ['module-from-library', 'my-another-module'], // module dependencies
    function(provide, moduleFromLibrary, myAnotherModule) { // module declaration, called when all dependencies are resolved

// module representation
provide({
    myModuleMethod : function() {}
});

});
```

TODO: Add information about the build process (usage of special technologies for JS and instructions for custom builders).

### jQuery and jQuery plugins

jQuery is represented by a `jquery` wrapper module that uses the global jQuery object if it already exists on the page, or loads it otherwise.
jQuery is now used only for operations directly related to the DOM (searching for elements, binding listeners to events, setting and getting attribute values, and so on).

All other operations have corresponding modules that provide the same functionality without depending on jQuery:
 * The `objects` module for operating on objects (with the `extend`, `isEmpty`, and `each` methods).
 * The `functions` module for operating on functions (with the `isFunction` and `noop` methods).

In addition, all the jQuery plugins that aren't directly related to jQuery (`$.observable`, `$.inherit`, `$.cookie`, `$.identify`, `$.throttle`) are now modules:
 * The `events` module replaces `$.observable` for working with events. It provides the "classes" `EventsEmitter` and `Event`.
 * The `inherit` module instead of `$.inherit` for working with "classes" and inheritance.
 * The `cookie` module instead of `$.cookie`.
 * The `identify` module instead of `$.identify`.
 * The `functions__throttle` and `functions__debounce` modules instead of `$.throttle` and `$.debounce`.

Before:

```js
// block code
$.throttle()
// block code
```

After:

```js
module.define('my-module', ['functions__throttle'], function(provide, throttle) {
// module code
throttle()
// module code
});
```

### BEM.DOM blocks

#### Declaration

Instead of a declaration via BEM.DOM.decl, you need to extend the `i-bem__dom` module.

Before:

```js
BEM.DOM.decl('block', /* ... */);
```

After:

```js
modules.define('i-bem__dom', function(provide, BEMDOM) {

BEMDOM.decl('block', /* ... */);

provide(BEMDOM);

});
```

#### Constructor

You must use full notation for the handler for setting the `js` modifier to `inited`.

Before:

```js
onSetMod : {
  js : function() {
      // constructor code
    }
}
```

After:

```js
onSetMod : {
    'js' : {
        'inited' : function() {
            // constructor code
        }
    }
}
```

#### Desctructor

Instead of the `destruct` method, you need to use the handler for setting the `js` modifier to an empty value (remove the modifier).
You no longer need to call `__base` in order to run the base destructor defined in `i-bem__dom` on blocks.

Before:

```js
destruct : function() {
    this.__base.apply(this, arguments);
    // destructor code
}
```

After:

```js
onSetMod : {
    js : {
        '' : function() {
            // destructor code
        }
    }
}
```

#### `changeThis` method

Instead of the `changeThis` method, use either the corresponding parameter, or the native `bind` method if there isn't a parameter.

Before:

```js
// block code
obj.on('event', this.changeThis(this._method));
// block code
```

After:

```js
obj.on('event', this._method.bind(this));
// or better
obj.on('event', this._method, this);
```

#### `afterCurrentEvent` method

Instead of the `afterCurrentEvent` method, use the `nextTick` method, which guarantees that the block still exists during the callback (if the block has already been destroyed by this time, the callback isn't executed).

Before:

```js
BEM.DOM.decl('block', {
    method : function() {
        this.afterCurrentEvent(function() {
            /* ... */
        })
    }
});
```

After:

```js
modules.define('i-bem__dom', function(provide, BEMDOM) {

BEMDOM.decl('block', {
    method : function() {
        this.nextTick(function() {
                /* ... */
            });
        }
    });
});
```

#### `findElem` method

The context for finding an element is no longer set as a string. Instead, pass a jQuery object.

Before:

```js
var nestedElem = this.findElem('parent-elem', 'nested-elem');
```

After:

```js
var nestedElem = this.findElem(this.findElem('parent-elem'), 'nested-elem'),
    oneMoreElem = this.findElem(this.elem('another-elem'), 'nested-elem');
```

#### `liveBindTo` method

The `liveBindTo` method no longer supports the `elemName` field for passing the element name. Use the `elem` field instead.

#### Access to a DOM element in an event handler

A DOM element that had an event handler bound to it is now accessed as `$(e.currentTarget)` instead of `e.data.domElem`.

Before:

```js
onClick : function(e) {
    e.data.domElem.attr(/* ... */);
}
```

After:

```js
onClick : function(e) {
    $(e.currentTarget).attr(/* ... */);
}
```

#### Channels

Channels are no longer an integral part of BEM. Now they are separate `events__channels` modules.

Before:

```js
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('channel-name').on(/* ... */);
    }
});
```

After:

```js
modules.define('i-bem__dom', ['events__channels'], function(provide, channels, BEMDOM) {

BEMDOM.decl('block', {
    method : function() {
        channels('channel-name').on(/* ... */);

        }
    });
});
```

#### The `i-system` block and the `sys` channel for the `tick`, `idle`, and `wakeup` events

This block and channel no longer exist. They have been replaced with separate modules: `tick` with the "tick" event, and `idle` with the "idle" and "wakeup" events.

Before:

```js
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('sys').on('tick', /* ... */);
    }
});
```

After:

```js
modules.define('i-bem__dom', ['tick'], function(provide, tick, BEMDOM) {

BEMDOM.decl('block', {
    method : function() {
        tick.on('tick', /* ... */);

        }
    });
});
```

Before:

```js
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('sys').on('wakeup', /* ... */);
    }
});
```

After:

```js
modules.define('i-bem__dom', ['idle'], function(provide, idle, BEMDOM) {

BEMDOM.decl('block', {
    method : function() {
        idle.on('wakeup', /* ... */);

        }
    });
});
```

### BEM blocks
BEM blocks that were used as storage for some methods but that didn't use the BEM methodology in any way can now be written as modules.

Before:

```js
BEM.decl('i-router', {
    route : function() { /* ... */ }
});
```

After:

```js
modules.define('router', function(provide) {

provide({
    route : function() { /* ... */ }
});

});
```

If for some reason you need BEM blocks (not BEM.DOM blocks), you can declare them by extending the `i-bem` module.

Before:

```js
BEM.decl('my-block', { /* ... */ });
```

After:

```js
modules.define('i-bem', function(provide, BEM) {

BEM.decl('my-block', { /* ... */ });

provide(BEM);

});
```

#### Refactoring using the `b-spin` block example

Before:

```js
BEM.DOM.decl('b-spin', {

    onSetMod : {

        'js' : function() {

            this._size = this.getMod('size') || /[\d]+/.exec(this.getMod('theme'))[0];

            this._bgProp = 'background-position';
            this._posPrefix = '0 -';

            if (this.elem('icon').css('background-position-y')) { /* In IE, you can't get the background-position property. You can only get background-position-y, so use this workaround */
                this._bgProp = 'background-position-y';
                this._posPrefix = '-';
            }

            this._curFrame = 0;

            this.hasMod('progress') && this.channel('sys').on('tick', this._onTick, this);

        },

        'progress' : {

            'yes' : function() {

                this.channel('sys').on('tick', this._onTick, this);

            },

            '' : function() {

                this.channel('sys').un('tick', this._onTick, this);

            }

        }
    },

    _onTick: function(){

        var y = ++this._curFrame * this._size;

        (y >= this._size * 36) && (this._curFrame = y = 0);

        this.elem('icon').css(this._bgProp, this._posPrefix + y +'px');

    },

    destruct : function() {

        this.channel('sys').un('tick', this._onTick, this);
        this.__base.apply(this, arguments);

    }

});
```

After:

```js
modules.define(
    'i-bem__dom',
    ['tick'],
    function(provide, tick, BEMDOM) {

var FRAME_COUNT = 36;

BEMDOM.decl('b-spin', {
    onSetMod : {
        'js' : {
            'inited' : function() { // constructor
                var hasBackgroundPositionY = !!this.elem('icon').css('background-position-y')); /* In IE we can't get the background-position property, only background-position-y */

                this._bgProp = hasBackgroundPositionY? 'background-position-y' : 'background-position';
                this._posPrefix = hasBackgroundPositionY? '-' : '0 -';
                this._curFrame = 0;
                this._size = Number(this.getMod('size') || /[\d]+/.exec(this.getMod('theme'))[0]);

                this.hasMod('progress') && this._bindToTick();
            },

            '' : function() { // destructor
                this._unbindFromTick();
            }
        },

        'progress' : {
            'true' : function() {
                this._bindToTick();
            },

            '' : function() {
                this._unbindFromTick();
            }
        }
    },

    _bindToTick : function() {
        tick.on('tick', this._onTick, this);
    },

    _unbindFromTick : function() {
        tick.un('tick', this._onTick, this);
    },

    _onTick : function() {
        var offset;
        this._curFrame++ >= FRAME_COUNT?
            offset = this._curFrame * this._size :
            this._curFrame = offset = 0;

        this.elem('icon').css(this._bgProp, this._posPrefix + offset + 'px');
    }
});

provide(BEMDOM);

});
```
