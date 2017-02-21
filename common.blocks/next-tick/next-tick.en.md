# next-tick

This block provides a function that performs an asynchronous call of the callback function passed as an argument in the next tick of the event loop.

`next-tick` – A polyfill that implements:

* A simulated event loop for outdated browser versions.
* A unified interface for working with various browsers and NodeJS.

This function works in cases when you need the callback to be invoked after the other functions in the event loop have finished. For example, you need to be sure that data will be available that is dynamically calculated in the current loop.

**Accepted arguments:**

* `fn {Function}` – The function to invoke in the next event loop. Required argument.

No return value.

Example:

```js
modules.require(['next-tick', 'events'], function(nextTick, events) {

var event = new events.Event();

nextTick(function() { event.emit('click') }); 

// ··· 

event.on('click', function(e) { console.log(e.type) })
});
```

## Order of callbacks

The block forms a queue within the event cycle, adding each subsequent callback function to the end of the queue. The callbacks are invoked in order.

Example:

```js
modules.require(['next-tick'], function(nextTick) {
  
var order = [];

nextTick(function() { order.push(1); });
nextTick(function() { order.push(2); });
nextTick(function() { order.push(3); });
nextTick(function() { console.log(order); }); // should be [1, 2, 3]
});
```

## Public block technologies

The block is implemented in:

* `vanilla.js`
