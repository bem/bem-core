<a name="decl"></a>

Block declaration
-----------------

A block JS implementation defines the behavior of a specific class of web interface elements. In the actual interfaces, each block can be represented by multiple instances.
A block instance implements the functionality of its class and has its own independent state.

In **object-oriented programming** terms:

-   A block is a class
-   And a block instance is a class instance

In accordance with OOP, all the functionality of a block is implemented modularly in the methods of the class *(=block)*.

The block methods are divided into:

-   Block instance methods
-   Static methods

The code of a block in `i-bem.js` is called a **declaration** to emphasize the declarative programming style
adopted in BEM.

A block behavior is programmed in declarative style as statements: `set of conditions` — `block reaction`.

<a name="decl-syntax"></a>

### Declaration syntax

#### Blocks with DOM representation

##### Declaring a new block without a parent

To declare a new JS block **with a DOM representation** (bound to an HTML element), use the `decl` method of the [ym](https://github.com/ymaps/modules) module in `i-bem__dom`.

The `decl` method accepts the following arguments:

1.  A block description as `{String}` or `{Object}`.
2.  Methods of the block instance — `{Object}`.
3.  Static methods — `{Object}`.

The declared methods will be applied to all instances of the block, regardless of their states (modifiers).

**Example:** Declaration of methods for the `button` block.

```js
modules.define('button', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name,
    {
        /* instance's methods */
    },
    {
        /* static methods */
    })
);

});
```

The `this.name` field of the `ym` context is passed to the `BEMDOM.decl` method as the first argument. It contains a reference to the name of the block specified as the first argument of `modules.define`.

<a name="bem-decl"></a>

#### Blocks without DOM representation

For declaring blocks without DOM representation, use the `decl` method of the [ym](https://github.com/ymaps/modules) module in `i-bem`.

The method accepts the same parameters as the `decl` method of the `i-bem__dom` module:

```js
modules.define('my-block', ['i-bem'], function(provide, BEM) {

provide(BEM.decl(this.name,
    {
        /*  instance's methods */
    },
    {
        /* static methods */
    })
);

});
```

------------------------------------------------------------------------

**NB** It is convenient to format infrastructure code as a block without DOM representation if you are planning to use BEM block APIs in it (states expressed as modifiers, BEM events,
and so on). If you are not planning to use the BEM subject domain,
you can format infrastructure code as a [ym](https://github.com/ymaps/modules) module.

**Example:**

```js
modules.define('router', function(provide) {

provide({
    route : function() { /* ... */ }
});

});
```

------------------------------------------------------------------------

<a name="inher"></a>

### Block inheritance

Various blocks in a project often use identical functionality.
For example, several blocks might use AJAX to request data from the backend,
perform the same operations with the DOM tree, and so on. To avoid unnecessary repetitions in the code, the shared functionality can be encapsulated as modules, then added to blocks.

Inheritance allows reusing block functionality by extending it with new logic.
Several inheritance mechanisms are available in `i-bem.js`. The choice of a particular mechanism depends on the needs of the block being created.

<a name="inher-simple"></a>

#### Simple inheritance

With simple inheritance, the block being created is declared as a descendant of an existing one. To do this:

1.  Specify the base block in the module system dependencies.
2.  Pass a reference to the base block in the special `baseBlock` field in the declaration.

For example, the `bblock` block inherits from the `ablock` block:

```js
modules.define('ablock', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {}));

});

modules.define('bblock', ['i-bem__dom', 'ablock'], function(provide, BEMDOM, ABlock) {

provide(BEMDOM.decl({ block : this.name, baseBlock : ABlock }));

});
```

This mechanism allows using the methods of the base block inside a derived block.
To call base block methods of the same name, use the [helper property](i-bem-js-context.en.md#helper-property) `this.__base`.

------------------------------------------------------------------------

**NB** You can create inheritance chains in `i-bem`, meaning that a block inherits from another one
that, in turn, inherits from a third block, and so on.

------------------------------------------------------------------------

<a name="inher-over"></a>

#### Redefining a block

To create a variation of an existing block that alters or supplements its functionality, you can **redefine** a base block on the project *redefinition level*.

In the project, create a declaration of a new block with the same name as the base block. As a result, the block will have access to all the base block functionality. However, the implementation of methods and modifiers with the same name will be taken from the new declaration.

```js
modules.define('ablock', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {})); // Declaring the base block

});

modules.define('ablock', function(provide, ABlock) {

provide(ABlock.decl({})); // Redefining the base block

});
```

This type of inheritance is often used when working with library blocks.

<a name="inher-over-modifier"></a>

##### Adding a modifier to a block

According to the BEM methodology, a block states must be defined by [modifers](i-bem-js-states.en.md#modifers).
So in order to extend a block functionality, you often need to implement support for new modifiers.

To add a modifier, pass the redefined block `decl` method:

-   A hash with the `modName` and `modVal` keys. The `modName` value is a string with the modifier name. The `modVal` value is a string with the modifier value.
-   A hash of methods that will be available for the block with the corresponding modifier. If there are methods and modifiers of the same name, their implementation from the hash is used.

```js
modules.define('ablock', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {})); // Declaring the base block

});

modules.define('ablock', function(provide, ABlock) {

provide(ABlock.decl({ modName : 'm1', modVal : 'v1' }, {})); // Redefining the base block with the modifier _m1_v1

});
```

------------------------------------------------------------------------

**NB** The block [static methods](./i-bem-js-context.en.md) will be available to all its instances, *regardless of modifier values*.
Modifiers are properties of the block instance, but static methods belong to the
block class and do not take the status of modifiers into account.

------------------------------------------------------------------------

<a name="inher-mixins"></a>

#### Mixed blocks

In `i-bem.js`, a special type of block is used for adding needed
functionality to blocks — **mixed blocks**. The main feature of mixed blocks is that they do not participate in the inheritance chain. This means their functionality can be combined with other blocks, without risk of breaking their [relationships with parent blocks](i-bem-js-context.en.md#relationships-with-parent-blocks) (`this.__base`).

<a name="inher-mixins-declwithmix"></a>

##### Adding mixed blocks

To add one or more mixed blocks to a block, assign a value to the optional `baseMix` field in the block declaration. The value is an array of strings — the names of mixed blocks to add in:

```js
modules.define('my-block', ['i-bem__dom', 'foo', 'bar'], function(provide, BEMDOM) {

provide(BEMDOM.decl({ block : this.name, baseMix : ['foo', 'bar']},
    { /* instance's methods */ },
    { /* static methods */ }
}));

});
```

<a name="inher-mixins-mixindecl"></a>

##### Mixed block declaration

Only blocks created using `declMix` can be used as mixed blocks.
The method accepts the block declaration in the same format as for the `decl` method.

```js
modules.define('mymix', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.declMix('mymix', //only a string with the name
    { /* instance's methods */ },
    { /* static methods */ }
}));

});
```

------------------------------------------------------------------------

**NB** You can't instantiate a mixed block and use it as an independent block.

------------------------------------------------------------------------

<a name="trigger-decl"></a>

#### Trigger declaration

[Triggers](./i-bem-js-states.en.md) that are executed when setting modifiers are described in the block declaration. The following properties are reserved for this purpose in the hash of the block instance methods:

-   `beforeSetMod` — Triggers called before setting **block modifiers**.
-   `beforeElemSetMod` — Triggers called before setting **element modifiers**.
-   `onSetMod` — Triggers called after setting **block modifiers**.
-   `onElemSetMod` — Triggers called after setting block **element modifiers**.

```js
modules.define('block-name', function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name,
    {
        /* instance's methods */
        beforeSetMod: { /* triggers before setting block modifiers*/}
        beforeElemSetMod: { /* triggers before setting element modifiers*/}
        onSetMod: { /* triggers after setting block modifiers */ }
        onElemSetMod: { /* triggers after setting element modifiers */ }
    },
    {
        /* static methods */
    }
));

});
```

The value of the `beforeSetMod` and `onSetMod` properties is a hash associating changes to modifiers with triggers. A trigger receives the following arguments:

-   `modName` – The modifier name.
-   `modVal` – The value of the modifier being set.
-   `prevModVal` – The previous modifier value. For `beforeSetMod`, this is the current value of the modifier, which will be changed to `modVal` if the trigger doesn't return `false`.

```js
{
    'mod1': function(modName, modVal, prevModVal) { /* ... */ }, // setting mod1 to any value
    'mod2': {
        'val1': function(modName, modVal, prevModVal) { /* ... */ }, // trigger to set mod2 to the value val1
        'val2': function(modName, modVal, prevModVal) { /* ... */ }, // trigger to set mod2 to the value val2
        '': function(modName, modVal, prevModVal) { /* ... */ } // trigger to delete the mod2 modifier
    'mod3': {
        'true': function(modName, modVal, prevModVal) { /* ... */ }, // trigger to set the simple modifier mod3
        '': function(modName, modVal, prevModVal) { /* ... */ }, // trigger to delete the simple modifier mod3
    },
    '*': function(modName, modVal, prevModVal) { /* ... */ } // trigger to set any modifier to any value
}
```

The shorthand for a trigger to set any block modifier to any value is:

```js
beforeSetMod: function(modName, modVal, prevModVal) { /* ... */ }
onSetMod: function(modName, modVal, prevModVal) { /* ... */ }
```

Triggers to set **element modifiers** are described in the `beforeElemSetMod` and `onElemSetMod` properties. The hash in the property values has an extra nesting level — the **element name**.
The trigger is passed the following as arguments:

-   `elem` — The element name.
-   `modName` – The modifier name.
-   `modVal` – The value of the modifier being set.
-   `prevModVal` – The previous modifier value. For `beforeSetMod`, this is the current value of the modifier, which will be changed to `modVal` if the trigger doesn't return `false`.

```js
{
    'elem1': {
        'mod1': function(elem, modName, modVal, prevModVal) { /* ... */ }, // trigger to set mod1 of elem 1 to any value
        'mod2': {
            'val1': function(elem, modName, modVal, prevModVal) { /* ... */ }, // trigger to set mod2 of elem1 to val1
            'val2': function(elem, modName, modVal, prevModVal) { /* ... */ } // trigger to set mod2 of elem1 to val2
            }
        },
    'elem2': function(elem, modName, modVal, prevModVal) { /* ... */ } // trigger to set any modifier of elem2 to any value
}
```

Shorthand for a trigger to set any modifier of the `elem` element to any value:

```js
beforeElemSetMod: { 'elem1': function(elem, modName, modVal, prevModVal) { /* ... */ } }
onElemSetMod: { 'elem1': function(elem, modName, modVal, prevModVal) { /* ... */ } }
```
