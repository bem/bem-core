# tick

This block provides an object for working with a regularly generated `tick` event (to implement the polling pattern).

## Overview

### Object events

| Name | Description |
| -------- | -------- |
| <a href="#events-tick">tick</a> | A regularly generated event. |

### Properties and methods of the object

| Name | Return type | Description |
| -------- | --- | -------- |
| <a href="#fields-start">start</a>() | - | Starts generating `tick` events if the process hasn't started yet. |
| <a href="#fields-stop">stop</a>() | - | Stops generating `tick` events if the process hasn't stopped yet. |

### Block modifiers

| Modifier | Acceptable values | Usage | Description |
| ----------- | ------------------- | --------------------- | -------- |
| <a href="#modifiers-start">start</a> | `'auto'` | `JS` | Automatically starts generating events |

### Public block technologies

The block is implemented in:

* `vanilla.js`

## Description

<a name="events"></a>

### Object events

<a name="events-tick"></a>

#### `tick` event

Subscribe to the event to use it to implement the polling pattern.

An event is generated every 50 milliseconds.

<a name="fields"></a>

### Properties and methods of the object

The block is a descendant of the `Emitter` class in the `events` block, which allows it to call these classes.

```js
modules.require('tick', function(tick) {

var update = function() { /* ... */ };

tick
    .on('tick', update) // subscribing to the tick event
    .start(); // starting generation of tick events
});
```

<a name="fields-start"></a>

#### `start` method

Starts generating [tick](#fields-tick) events if the process hasn't started yet. A `tick` is generated with an interval of 50 milliseconds after invoking the method.

Doesn't accept arguments.

No return value.

<a name="fields-stop"></a>

#### `stop` method

Stops generating [tick](#fields-tick) events.

Doesn't accept arguments.

No return value.

<a name="modifiers"></a>

### Block modifiers

<a name="modifiers-start"></a>

#### `start` modifier

Acceptable values: `'auto'`.

Usage: `JS`.

Use the block with the `start` modifier set to `auto` in order to automatically start generating [tick](#fields-tick) events. The event starts being generated at the time of block initialization.
