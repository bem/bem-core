<a name="states"></a>

States of a block
-----------------

When designing a dynamic block in BEM style, you need to provide the complete logic of
changes that occur in it as a set of **states** for the block. Then the block behavior is determined by
**triggers** — callback functions that are performed when the block switches
from one state to another.

This allows you to write the block code declaratively as a set of statements in the format: `state description` — `action performed when switching to this state`.

<a name="modifiers"></a>

### Modifiers

According to the BEM methodology,
**modifiers** describe the state of a block and its elements.

A modifier indicates which of the possible states the block is in. A modifier is a **name** — **value** pair. The list of acceptable modifier values describes the set of block states. For example,
to describe a block size, you can use the `size` modifier with the possible values `s`, `m` and `l`.

A **simple modifier** is a special case when only the presence or absence
of the modifier on the block is important, and its value is insignificant. An example is the modifier describing the ”disabled“ state: `disabled`. A modifier with an unspecified `i-bem.js` value is interpreted as boolean and automatically assigned the value `true`.

Each block can have one or more modifiers set. A block isn't required to have
any modifiers. The block developer defines the list of acceptable modifiers and their
values.

Modifiers are set during [initialization of a block instance](./i-bem-js-init.en.md) (if modifiers and their values are specified in the `class` attribute of the corresponding HTML element).

Modifiers can change as part of the block functioning (for example, as a reaction to a [DOM event](i-bem-js-events.en.md#dom-event) of the block), or at the request of other blocks (see [Interaction of blocks](./i-bem-js-interact.en.md)).

When setting, deleting, and changing modifier values, [triggers](#triggers) are executed.

------------------------------------------------------------------------

**NB** If modifiers were set in a block HTML element before its initialization, the triggers to set these modifiers **are not executed**. In this case, the block instance gets its original state, and doesn't change it.

------------------------------------------------------------------------

<a name="mods-api"></a>

#### Managing modifiers

Methods of a block instance for working with modifiers:

-   `hasMod([elem], modName, [modVal])` – Checks for the presence of a modifier. Returns `true` if the `modName` modifier is set.
-   `getMod([elem], modName)` – Returns the value of `modName`.
-   `getMods([elem], [...modNames])` – Returns a hash with the values of all modifiers. You can get the values of multiple modifiers by passing their names in separate arguments (`[...modNames]`). To get the modifiers of an element, you can specify the `[elem]` argument.
-   `setMod([elem], modName, [modVal=true])` – Sets the `modName` modifier. If the value of `modVal` isn't specified, a *simple modifier* will be set.
-   `toggleMod([elem], modName, modVal1, [modVal2], [condition])` – Toggles a modifier's value. If the `[modVal2]` argument is passed, it switches between `modVal1` and `modVal2`. If not, `modVal1` will be set and removed in turn. The `condition` argument with the `true` value allows inverting the order for toggling modifier values.
-   `delMod([elem], modName)` – Deletes `modName`.

**Example:** The `changeColor` method of the `square` block toggles the `color` modifier between the values `green` and `red`, if the block has the `has-color` modifier set:

```js
BEMDOM.decl('square', {
    changeColor : function(e) {
        if(this.hasMod('has-color')) {
            this.toggleMod('color', 'green', 'red');
        }
    }
});
```

The same methods allow managing modifiers of the block elements. To do this, a reference to the **element DOM node** (not the element name) is passed as the first argument.

**Example:** On a click, the `searchbox` block can assign its `input` element the simple modifier `clean` (the assumed value is `true`):

```js
BEMDOM.decl('searchbox', {
    _onClick: function() {
        this.setMod(this.elem('input'), 'clean');
    }
});
```

------------------------------------------------------------------------

**NB** Use the API for changing the values of modifiers. Don't set modifiers by altering the CSS classes of the corresponding DOM node yourself.

------------------------------------------------------------------------

For complete documentation of the API for managing modifiers, see the [JSDoc](https://en.bem.info/libs/bem-core/current/desktop/i-bem/jsdoc/) section for the `i-bem` block.

<a name="mods-api-trigger"></a>

### Triggers to set modifiers

Triggers to set modifiers are executed in two phases:

1.  **Before setting the modifier**. This phase is reserved for the ability to
    **cancel** setting modifiers. If at least one of the triggers executed in this phase returns
    `false`, modifiers are not set.
2.  **After setting the modifier**. Triggers executed in this phase
    can't cancel setting modifiers.

Triggers can be bound to the following types of changes to modifier values:

1.  Setting *any* modifier to *any* value.
2.  Setting a *specific* `modName` modifier to *any* value (including
    setting a simple modifier to `true`).
3.  Setting a *specific* `modName` modifier to a *specific* `modVal` value.
4.  Setting a modifier to the value `''` (empty string), which is
    equivalent to deleting the modifier or setting a simple modifier
    to `false`.

When setting the `modName` modifier to the `modVal` value, triggers in
each phase (if they are defined) are fired in the same order as they are
listed in the list of events above (from general to specific).

Thus, when defining a trigger, the user specifies:

-   The execution phase (before or after setting a modifier).
-   The event type (the modifier name and value to set).

<a name="mods-api-trigger-phase"></a>

#### Execution phases

An additional phase prior to setting a modifier allows performing
certain checks without risk of affecting the logic for setting the modifier. For example, if there are mutually exclusive modifiers, it makes sense before setting one of them to check whether the other is already set.

**Example**: The `focused` modifier won't be set on the `searchbox` block if it has the `disabled` modifier.

```js
BEMDOM.decl('searchbox', {
    beforeSetMod : {
        'focused' : {
            'true' : function() {
                return !this.hasMod('disabled');
            }
        }
    },

    onSetMod : {
        'focused' : {
            'true' : function() { /* ... */ }
        }
    }
});
```

If the trigger for the phase prior to setting (`beforeSetMod`) returns `false`, the modifier is not set.

For more information about using triggers, see [Declaring triggers](i-bem-js-decl.en.md#declaring-triggers).

------------------------------------------------------------------------

**NB** The trigger to set the `js` modifier to `inited` is a constructor of a block instance, but with the value `''` it is a destructor of a block instance. For more information, see [Initialization](./i-bem-js-init.en.md).

------------------------------------------------------------------------
