# events

This block provides a set of JS classes for working with events.

## Overview

### Classes provided by the block

| Class | Constructor | Description |
| ----- | ----------- | -------- |
| <a href="#class-Event">Event</a> | Event(<br>`type {String}`, <br>`target {Object}`) | Creates the event object and changes and checks its states. |
| <a href="#class-Emitter">Emitter</a> | - | Generates events and subscriptions to them. |

### Properties and methods of the class object

| Class | Name | Type or return value | Description |
| ----- | --- | ----------------------------- | -------- |
| <a href="#class-Event">Event</a> | <a href="#fields-type">type</a> | `String` | Type of event. |
|  | <a href="#fields-result">result</a> | `*` | The result returned by the event's last handler. |
|  | <a href="#fields-target">target</a> | `Object` | The object where the event occurred. |
|  | <a href="#fields-data">data</a> | `*` | Data to pass to the handler as an argument. |
|  | <a href="#fields-preventDefault">preventDefault</a>()| - | Allows you to prevent execution of the default action for the event. |
|  | <a href="#fields-isDefaultPrevented">isDefaultPrevented</a>()| `Boolean` | Checks whether the default action for the event was prevented from being executed. |
|  | <a href="#fields-stopPropagation">stopPropagation</a>()| - | Allows you to stop event propagation. |
|  | <a href="#fields-isPropagationStopped">isPropagationStopped</a>()| `Boolean` | Checks whether event propagation was stopped. |
| <a href="#class-Emitter">Emitter</a> | <a href="#fields-on">on</a>(<br>`type {String}`, <br>`[data {Object}]`, <br>`fn {Function}`, <br>`[ {Object} ctx]`) | - | Subscribes to a specific type of event. |
|  | <a href="#fields-once">once</a>(<br>`type {String}`, <br>`[data {Object}]`, <br>`fn {Function}`, <br>`[ctx {Object}]`) | - | Subscribes to a specific type of event. The handler executes only once. |
|  | <a href="#fields-un">un</a>(<br>`type {String}`, <br>`fn {Function}`, <br>`[ctx {Object}]`) | - | Unsubscribes to a specific type of event. |
|  | <a href="#fields-emit">emit</a>(<br>`type {String`&#124;`events:Event}`, <br>`[data {Object}]`) | - | Generates an event. |

### Elements of the block

| Element | Usage | Description |
| ------- | --------------------- | -------- |
| <a href="#elems-channels">channels</a> | `JS` | Used for working with named event channels. |

### Functions provided by block elements

| Element | Function | Return type | Description |
| ------- | ------- | ----------------------------- | -------- |
| <a href="#elems-channels">channels</a> | channels(<br>`[id {String}]`, <br>`[drop {Boolean}]`) | `Object`&#124;`undefined` | Creates or deletes a named event channel. |

### Public block technologies

The block is implemented in:

* `vanilla.js`

## Description

<a name="class-Event"></a>

### `Event` class

You can use this class to instantiate an event object by indicating its type and source. To do this, use the `Event` constructor function.

**Accepted arguments:**

* `type {String}` – Type of event. Required argument.
* `target {Object}` – Object (source) where the event occurred. Required argument.

**Return value:** `Event`. The event object.

<a name="fields-Event"></a>

#### Properties and methods of the class object

<a name="fields-type"></a>

##### `type` property

Type: `String`.

Type of event.

```js
modules.require(['events'], function(events) {

    var myevent = new events.Event('myevent', this);
    console.log(myevent.type); // 'myevent'

});
```

<a name="fields-type"></a>

##### `target` property

Type: `Object`.

The object where the event occurred.

<a name="fields-result"></a>

##### `result` property

Type: `*`.

Contains the data returned by the event's last handler function.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();
    myEmitter.on('myevent', function() { return 'hi-hi-hi'; });

    var myEvent = new events.Event('myevent');
    myEmitter.emit(myEvent)

    console.log(myEvent.result);    // 'hi-hi-hi'
});
```

<a name="fields-data"></a>

##### `data` property

Type: `*`.

Contains the data passed to the event's handler function as an argument.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();
    myEmitter.on('myevent', 'my-data', function(e) { console.log(e.data); });

    myEmitter.emit('myevent'); // my-data
});
```

<a name="fields-preventDefault"></a>

##### `preventDefault` method

Allows you to prevent execution of the default action for the event.

Doesn't accept arguments.

No return value.

<a name="fields-isDefaultPrevented"></a>

##### `isDefaultPrevented` method

Allows you to check whether the default action for the event was prevented from being executed.

Doesn't accept arguments.

**Return value:** `Boolean`. If the default action for the event was prevented from being executed, it is `true`.

<a name="fields-stopPropagation"></a>

##### `stopPropagation` method

Allows you to stop event propagation.

Doesn't accept arguments.

No return value.

<a name="fields-isPropagationStopped"></a>

##### `isPropagationStopped` method

Allows you to check whether event propagation was stopped.

Doesn't accept arguments.

**Return value:** `Boolean`. If event propagation was stopped, it is `true`.

<a name="class-Emitter"></a>

### `Emitter` class

This class instantiates objects that you can use for generating events and subscribing to them.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

});
```

<a name="fields-Event"></a>

#### Properties and methods of the class object

<a name="fields-on"></a>

##### `on` method

Subscribes to a specific type of event.

**Accepted arguments:**

* `type {String}` – The type of event being subscribed to. Required argument.
* [`data {Object}`] – Additional data available to the handler as the value of the `e.data` field in the event object.
* `fn {Function}` – The handler function to call for the event. Required argument.
* [`ctx {Object}`] – Context for the handler function.

Returns the `this` object.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

    myEmitter.on('myevent', function() { console.log('foo'); });
    myEmitter.emit('myevent'); // 'foo'
});
```

In addition, the value of the `type` argument may be:

* Multiple event types separated by spaces, in order to set a single handler function for all of them.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

    myEmitter.on('myevent1 myevent2', function(e) { console.log(e.type) });

    myEmitter.emit('myevent1'); // 'myevent1'
    myEmitter.emit('myevent2'); // 'myevent2'
});
```

* A hash of `{ 'event-1' : handler-1, ... , 'event-n' : handler-n }`, in order to set multiple handlers for different event types.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

    myEmitter.on({
        myevent1 : function(e) { console.log(e.type) },
        myevent2 : function(e) { console.log(e.type) }
    });  

    myEmitter.emit('myevent1'); // 'myevent1'
    myEmitter.emit('myevent2'); // 'myevent2'
});
```

The same is true for the `once` and `un` methods.

<a name="fields-once"></a>

##### `once` method

Identical to the `on` method, but it only executes once. After the first event, the subscription is removed.

**Accepted arguments:**

* `type {String}` – The type of event being subscribed to. Required argument.
* [`data {Object}`] – Additional data available as the value of the `e.data` field in the event object.
* `fn {Function}` – The handler function to call for the event. Required argument.
* [`ctx {Object}`] – Context for the handler function.

Returns the `this` object.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

    myEmitter.on('myevent', function() { console.log('foo') });

    myEmitter.emit('myevent'); // 'foo'
    myEmitter.emit('myevent'); //handler isn't called
});
```

<a name="fields-un"></a>

##### `un` method

Removes a previously set subscription to a specific type of event.

**Accepted arguments:**

* `type {String}` – The type of event being unsubscribed from. Required argument.
* [`fn {Function}`] – The handler to delete.
* [`ctx {Object}`] – The handler context.

The method returns a reference to the `this` object.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter(),
        shout = function() { console.log('foo') };

    myEmitter.on('myevent', shout);
    myEmitter.emit('myevent'); // 'foo'

    myEmitter.un('myevent', shout);
    myEmitter.emit('myevent'); //handler isn't called
});
```

<a name="fields-emit"></a>

##### `emit` method

Generates an event.

This method calls all the handler functions set for the event.

**Accepted arguments:**

* `type {String|events:Event}` – The event to generate, in the form of a string or a prepared event object. Required argument.
* [`data {Object}`] – Additional data available as the second argument of the handler function.

Returns the `this` object.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

    myEmitter.on('myevent', function(e, data) { console.log(data) });
    myEmitter.emit('myevent', 'ololo');  // 'ololo'
});
```

#### Static methods of the class

The set of static methods and their signatures is exactly the same as for the methods of the object being instantiated by the class.
