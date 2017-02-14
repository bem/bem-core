# identify

This block provides a function for working with unique identifiers. It allows you to:

* Create object identifiers.
* Check whether objects have an identifier.
* Create a unique identifier string.

**Accepted arguments:**

* [`obj {Object}`] – The object to identify.
* [`onlyGet {Boolean}`] – Flag for checking whether the object has an identifier. If `true`, the function returns a string with the identifier if the object was previously assigned an identifier. By default, `false`.

**Return value:** `String`. A string with the identifier assigned to the object. Subsequent calls will always return the same identifier.

Example:

```js
modules.require(['identify'], function(identify) {
    var a = {},
        b = {},
        identA = identify(a);

    console.log(identA === identify(a)); //true
    console.log(identA === identify(b)); //false
});
```

When called without arguments, the function returns a string with a unique identifier every time.

Example:

```js
modules.require(['identify'], function(identify) {
    var a = identify(),
        b = identify();

    console.log(a === b); //false
});
```

## Public block technologies

The block is implemented in:

* `vanilla.js`
