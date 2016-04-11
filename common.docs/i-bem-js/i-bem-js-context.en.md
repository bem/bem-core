<a name="context"></a>

Context
-------

**A block instance methods** are executed in the context of the block instance JS object. The keyword `this` in the block instance methods references the JS object of the **block instance**.

**Static methods** are executed in the context of the JS object that corresponds to the block class. The keyword `this` in a block static methods references the **block class**.

------------------------------------------------------------------------

**NB** When developing blocks using `i-bem.js` in internal block methods that are not intended for use outside the block, it is customary to assign names that start with an underscore. For example, `_onClick`.

------------------------------------------------------------------------

### Properties of a block instance

#### With DOM representation

-   `params` is a hash of parameters passed to the block instance during initialization.
-   `domElem` is a jQuery object containing references to DOM elements that the block is [bound](./i-bem-js-html-binding.en.md) to.

#### Without DOM representation

-   `params` is a hash of parameters passed to the block instance during initialization.

<a name="spec-fields"></a>

#### Helper properties

A block instance provides a set of helper properties:

-   `__self` — For access to static properties and methods of the block and its instance.

**Example:** Calling `staticMethod` in the `onEvent` method of the `my-block` block instance.

```js
BEMDOM.decl('my-block', {
    onEvent : function() {
        this.__self.staticMethod(); // calling a static method
        this.doMore();
    }
}, {
    staticMethod : function() { /* ... */ }; // defining a static method
});
```

-   `__base` – For calling the implementation of the method with the same name from the base class that this one inherits from (`super call`).

**Example:** Calling the base implementation of the `_onClick` method of the `button` base class.

```js
BEMDOM.decl({ block : 'my-button', baseBlock : 'button' }, {
    _onClick : function() {
        this.__base(); // calling the base _onClick
        this.doMore();
    }
});
```

Helper properties are provided by the [inherit](../../common.blocks/inherit) module, which implements the inheritance mechanism in `bem-core`.

### Static block properties

<a name="spec-fields-static"></a>

#### Helper properties

Helper properties are available in the declaration of a block static methods:

-   `__base` – For calling the implementation of the method with the same name from the base class that this one inherits from (`super call`).

```js
BEMDOM.decl({ block : 'extra', baseBlock : 'my-block' },
    { /* ... */ },
    {
        staticMethod: function() {
            this.__base();
            this.doMore();
        }
    }
);
```

### Static properties of the BEMDOM module

-   `scope` — The root element of the DOM tree being processed. Allows executing several different versios of `i-bem.js` in the same runtime. By default, contains a reference to the `body` jQuery object.
-   `doc` — A reference to the `document` jQuery object.
-   `win` — A reference to the `window` jQuery object.
