# inherit

This block provides a function for declaring and inheriting classes.

## Overview

### Usage

| Use | Signature | Return type | Description |
| ----- | --------- | --------------------- | -------- |
| <a href="#runmode-declare">Declaring a base class</a> | inherit(<br>`props {Object}`, <br>`[staticProps {Object}]`) | `Function` | Use for creating (declaring) a base class from the object properties. |
| <a href="#runmode-extend">Creating a derived class</a> | inherit(<br>`BaseClass {Function} `&#124;` {Array}`, <br>`props {Object}`, <br>`[staticProps {Object}]`) | `Function` | Use for inheriting and redefining the properties and methods of a base class. |

### Special fields of the declared class

| Name | Data type | Description |
| --- | ---------- | -------- |
| <a href="#constructor">__constructor</a> | `Function` | The function that will be called when creating a class instance. |

### Special fields of the declared class instance

| Field | Data type | Description |
| ---- | ---------- | -------- |
| <a href="#self">__self</a> | `*` | Allows you to access the class and its instance. |
| <a href="#base">__base</a> | `Function` | Allows you to use the methods of the base class inside the derived class (super call). |

### Public block technologies

The block is implemented in:

* `vanilla.js`

## Description

Use the `inherit` function to:

* Create a class using a declaration.
* Set a constructor method.
* Use mix-ins.
* Call the methods of the base implementation (super call).
* Get access to static properties of a class from its instance.

This is the main block inheritance mechanism in `bem-core`.

The function is polymorphic and, depending on the first argument type, it can be used for:

* `Object` type – declaring the base class.
* `Function` type – deriving a class from the base class.

The signature of the function's other arguments depends on how it is run.

### Usage

<a name="runmode-declare"></a>

#### Declaring a base class

This approach allows you to define the base class by passing the function an object with the class properties.

**Accepted arguments:**

* `props {Object}` – An object with its own properties for the base class. Required argument.
* [`staticProps {Object}`] – An object with static properties of the base class.

**Return value:** `Function`. The fully-formed class.

```js
modules.require(['inherit'], function(inherit) {

var props = {}, // object for the base class properties
    baseClass = inherit(props); // base class

});
```

##### Base class with static properties

Properties of the `staticProps` object are added as static properties for the class being created.

Example:

```js
modules.require(['inherit'], function(inherit) {

var A = inherit(props, {
    callMe : function() {
        console.log('mr.Static');
    }
});

A.callMe(); // mr.Static

});
```

##### Special fields of the declared class

<a name="constructor"></a>

###### `__constructor` field

Type: `Function`.

The object with the base class properties can contain the reserved `__constructor` property, a function that is called automatically when a class instance is created.

Example:

```js
modules.require(['inherit'], function(inherit) {

var A = inherit({
        __constructor : function(property) { // constructor
            this.property = property;
        },

        getProperty : function() {
            return this.property + ' of instanceA';
        }
    }),
    aInst = new A('Property');

aInst.getProperty(); // Property of instanceA

});
```

<a name="runmode-extend"></a>

#### Creating a derived class

This approach allows you to create a derived class from the base class and the objects with the static properties and the custom properties.

**Accepted arguments:**

* `BaseClass {Function} | {Array}` – The base class. Can be an array of mix-in functions. Required argument.
* `props {Object}` – Custom properties (added to the prototype). Required argument.
* [`staticProps {Object}`] – Static properties.

If one of the objects contains properties that already exist in the base class, the base class properties are redefined.

**Return value:** `Function`. Derived class.

Example:

```js
modules.require(['inherit'], function(inherit) {

var A = inherit({
    getType : function() {
        return 'A';
    }
});

// class derived from A
var B = inherit(A, {
    getType : function() { // redefinition + super call
        return this.__base() + 'B';
    }
});

var instanceOfB = new B();

instanceOfB.getType(); // returns 'AB'

});
```

##### Creating a derived class with mix-ins

When declaring a derived class, you can specify an additional set of functions. Their properties will be mixed in to the created class. To do this, the first argument for `inherit` should specify an array that has the base class as its first element, followed by the functions to mix in.

Example:

```js
modules.require(['inherit'], function(inherit) {

var A = inherit({
    getA : function() {
        return 'A';
    }
});

var B = inherit({
    getB : function() {
        return 'B';
    }
});

// class derived from A and B
var C = inherit([A, B], {
    getAll : function() {
        return this.getA() + this.getB();
    }
});

var instanceOfC = new C();

instanceOfC.getAll(); // returns 'AB'

});
```

##### Special fields of the declared class instance

<a name="self"></a>

###### `__self` field

Type: `*`.

Allows you to access the class and its instance.

Example:

```js
modules.require(['inherit'], function(inherit) {

var A = inherit({
        getStaticProperty : function() {
            return this.__self.staticMethod; // access to static methods
        }
    }, {
        staticProperty : 'staticA',

        staticMethod : function() {
            return this.staticProperty;
        }
    }),
    aInst = new A();

aInst.getStaticProperty(); //staticA

});
```

<a name="base"></a>

###### `__base`

Type: `Function`.

Allows you to call base class methods inside the derived class (super call). When used in a static method, it will call the static method of the same name in the base class.

Example:

```js
modules.require(['inherit'], function(inherit) {

var A = inherit({
    getType : function() {
        return 'A';
    }
}, {
    staticProperty : 'staticA',

    staticMethod : function() {
        return this.staticProperty;
    }
});

// class derived from A
var B = inherit(A, {
    getType : function() { // redefinition + super call
        return this.__base() + 'B';
    }
}, {
    staticMethod : function() { // static redefinition + super call
        return this.__base() + ' of staticB';
    }
});

var instanceOfB = new B();

instanceOfB.getType(); // returns 'AB'
B.staticMethod(); // returns 'staticA of staticB'

});
```

<a name="extra-examples"></a>

### More examples

For more examples, see the repository of the [inherit](https://github.com/dfilatov/inherit) library.
