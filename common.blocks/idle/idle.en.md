# idle

This block provides an object with a set of methods for generating an event when user activity ends (i.e. the user switches to another window or doesn't finish actions).

## Overview

### Object events

The following events are available:

| Name | Description |
| -------- | -------- |
| <a href="#events-idle">idle</a> | The browser is idle. |
| <a href="#events-wakeup">wakeup</a> | The user has resumed activity. |

### Properties and methods of the object

| Name | Returned value | Description |
| -------- | --- | -------- |
| <a href="#fields-start">start</a>() | - | Starts tracking user activity. |
| <a href="#fields-stop">stop</a>() | - | Stops tracking user activity. |
| <a href="#fields-isIdle">isIdle</a>() | `Boolean` | Checks the current state. |

### Block modifiers

| Modifier | Acceptable values | Usage | Description |
| ----------- | ------------------- | --------------------- | -------- |
| <a href="#modifiers-start">start</a> | `auto` | `JS` | Automatically starts tracking user activity. |

### Public block technologies

The block is implemented in:

* `js`

## Description

Subscribing to the block's event allows you to suspend operations, such as displaying animation, when there isn't any user activity.

The block is a descendant of the `Emitter` class in the `events` block, which allows it to call these methods.

```js
modules.require(['idle'], function(idle) {

idle
    .on({
        idle : function() {
            // idle event handler
        },
        wakeup : function() {
            // wakeup event handler
        }
    })
    .start(); // start event generation

});
```

<a name="events"></a>

### Object events

<a name="events-idle"></a>

#### `idle` event

Generated when user activity ends.

<a name="events-wakeup"></a>

#### `wakeup` event

Generated when user activity resumes.

<a name="fields"></a>

### Properties and methods of the object

<a name="fields-start"></a>

#### `start` method

Starts tracking user activity.

Doesn't accept arguments.

No return value.

```js
modules.require(['idle'], function(idle) {

idle.start()

});
```

<a name="fields-stop"></a>

#### `stop` method

Stops user activity tracking.

Doesn't accept arguments.

No return value.

```js
modules.require(['idle'], function(idle) {

idle.start() // start tracking activity
idle.stop() // stop tracking activity

});
```

<a name="fields-isIdle"></a>

#### `isIdle` method

Checks whether there is any user activity.

Doesn't accept arguments.

**Return value:** `Boolean`. If there isn't any activity, `true`.

```js
modules.require(['idle'], function(idle) {

idle.isIdle() // true or false, depending on the current state

});
```

<a name="modifiers"></a>

### Block modifiers

<a name="modifiers-start"></a>

#### `start` modifier

Acceptable values: `'auto'`.

Usage: enabled in the `deps.js` dependencies file.

Automatically starts tracking user activity.
