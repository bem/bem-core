<a name="elems-event"></a>

# `event` element in the `jquery` block

This element implements support for additional types of jQuery events. The additional types are enabled using the corresponding values of the `type` modifier.

<a name="modifiers"></a>

## Element modifiers

<a name="modifiers-name"></a>

### `type` modifier

Provides a set of polyfills that implement the abstraction layer over jQuery events on input devices. This allows you to create a shared logic for different platforms (desktop, phone, etc.) and supplement it with methods specific to the device type.

Each polyfill adds a set of **pointer events** for creating hardware agnostic logic.

All the pointer events are jQuery user events. Subscribe to pointer events in the standard way:

```js
modules.define('pointer-test', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, /** @lends pointer-test.prototype */ {
    onSetMod : {
        js : {
            inited : function() {
                // subscribing to pointerpress on the block itself during initialization
                this._domEvents().on('pointerpress', this._onPress);
            }
        }
    },
    _onPress : function(e) {
        console.log(e.type);
        // subscribing to pointerrelease when calling the pointerpress handler
        this._domEvents().on('pointerrelease', this._onRelease);
    },
    _onRelease : function(e) {
        console.log(e.type);
        // unsubscribing from pointerrelease when calling the pointerrelease handler
        this._domEvents().un('pointerrelease', this._onRelease);
    }
}));
});
```

Different polyfills are enabled depending on the modifier's value.

<a name="modifiers-type-pointer"></a>

#### `type` modifier with the `pointer` value

This is a modifier for enabling all types of pointer events. It doesn't introduce additional logic.

<a name="modifiers-type-pointerclick"></a>

#### `type` modifier with the `pointerclick` value

Enables a polyfill that implements the `pointerclick` event.

<a name="events-pointerclick"></a>

##### `pointerclick` event

Generated for a left click or a touch on the device screen. Using `pointerclick` eliminates the delay of the `click` event on touch devices.

<a name="modifiers-type-pointernative"></a>

#### `type` modifier with the `pointernative` value

Enables a polyfill that implements the basic functionality of the [W3C Pointer Events](http://www.w3.org/TR/pointerevents/) model.

The following set of events is available with the modifier:

<a name="events-pointerover"></a>

##### `pointerover` event

Generated:

* When the pointer is over an element.
* Before a `pointerdown` event for devices that don't support `hover`.

<a name="events-pointerenter"></a>

##### `pointerenter` event

Generated:

* When the pointer enters the element's *active area*. When the pointer is over the element or one of its descendants.
* On a `pointerdown` event for devices that don't support `hover`.

This event is the same as `pointerover`, but it doesn't bubble.

<a name="events-pointerdown"></a>

##### `pointerdown` event

Generated when the input device is in the *active buttons* state.

* For a mouse, this is when at least one button is pressed.
* For pen and touch devices, this is when physical contact is made with the device screen.

<a name="events-pointermove"></a>

##### `pointermove` event

Generated when the pointer's coordinates change.

<a name="events-pointerup"></a>

##### `pointerup` event

Generated when exiting the *active button* state:

* For a mouse, this is the transition from having one or more buttons pressed to the state of no buttons pressed.
* For pen and touch devices, this is when physical contact is removed from the device screen.

<a name="events-pointerout"></a>

##### `pointerout` event

Generated when the pointer leaves the element's *active area*:

* When the pointer leaves the area over the element or one of its descendants.
* After `pointerup` and `pointercancel` events for devices that don't support `hover`. For example, when the stylus or finger leaves the device's working area.

<a name="events-pointerleave"></a>

##### `pointerleave` event

Generated when the pointer leaves the element's *active area*:

* When the pointer leaves the area over the element or one of its descendants.
* After `pointerup` and `pointercancel` events for devices that don't support `hover`.

This event is the same as `pointerout`, but it doesn't bubble.

<a name="events-pointercancel"></a>

##### `pointercancel` event

Generated when:

* Further pointer events are not expected to occur (for example, after changing hardware settings).
* The `pointerdown` event has been generated, if the pointer was used for zooming the page.

For example, this event is generated when changing the device orientation while it is in the *active buttons* state. Or after reaching the maximum number of simultaneous clicks on the device.

After generating the `pointercancel` event, the `pointerout` and `pointerleave` events are generated in succession.

<a name="modifiers-type-pointerpressrealease"></a>

#### `type` modifier with the `pointerpressrelease` value

Enables a polyfill that implements the `pointerpress` and `pointerrelease` events. The polyfill uses Pointer Events.

<a name="events-pointerpress"></a>

##### `pointerpress` event

Generated on the `pointerdown` event.

<a name="events-pointerrelease"></a>

##### `pointerrelease` event

Generated on the `pointerup` and `pointercancel` events.
