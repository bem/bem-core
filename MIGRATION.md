# Migration

## 1.0.0

For 1.0.0 version we assume migration from [bem-bl](https://github.com/bem/bem-bl/) to [bem-core](https://github.com/bem/bem-core/).

### Modules

From now everything should be under the [ym modular system](https://github.com/ymaps/modules).
All the dependencies have to be mentioned in the code, using global variables
have to be minimized to 0 if possible.

Example
```js
modules.define(
    'my-module', // Module name
    ['module-from-library', 'my-another-module'], // Module dependencies
    function(provide, moduleFromLibrary, myAnotherModule) { // Module declaration, runs when all the dependencies are resolved

//Module providing
provide({
    myModuleMethod : function() {}
});

});
```

TODO: add information about changes in build process (usage of special techs for js and instructions for custom builders).

### jQuery and plugins

jQuery is represented with a wrapping module `jquery` which uses the `jQuery`
global object if it is available or loads jQuery additionally.
From now jQuery is used only for operations on DOM such as selecting nodes,
binding listeners to events, getting and setting attribute values and so on.

For other operations there are special modules non-dependable on jQuery.
 * the `objects` module to operate on objects (with `extend`, `isEmpty` and `each` methods)
 *the `functions` module to operate on functions (with `isFunction` and `noop` methods)

All the jQuery plugins which are not fo DOM operation became modules:

 * the `events` module used to be the `$.observable` jQuery plugin<br/>
 It works with events, provides "classes" `EventsEmitter` and `Event`
 * the `inherit` module used to be the `$.inherit` plugin<br/>
 It provides an inherit module with classes.
 * the `cookie` module used to be the `$.cookie` plugin
 * the `identify` module used to be `$.identify` plugin
 * the `functions__throttle` and `functions__debounce` used to be the
 `$.throttle` and the `$.debounce` plugins

Before:
```js
// block code
$.throttle(...
// block code
```

After:
```js
module.define('my-module', ['functions__throttle'], function(provide, throttle) {
// module code
throttle(...
// module code
```

### BEM.DOM blocks

#### Declaration

Blocks represented in DOM were declared with BEM.DOM.decl. Now they must use
`i-bem__dom` module and extend it.

Before:
```js
BEM.DOM.decl('block', ...);
```
After:
```js
modules.define('i-bem__dom', function(provide, BEMDOM) {

BEMDOM.decl('block', ...);

provide(BEMDOM);

});
```

#### Constructor

You have to use full notation for the callback for the `js` modifier in its
`inited` value.

Before:
```js
onSetMod : {
    js : function() {
        // constructor code
```
After:
```js
onSetMod : {
    js : {
        inited : function() {
            // constructor code
```

#### Destructor

Instead of `destruct` method the destructive callback has to be applyed to the
empty value of `js` modifier, which corresponds removing a modifier from a
block.
Also you do not need to call `__base` to run a descructor from the basic
`i-bem__dom` module.

Before:
```js
destruct : function() {
    this.__base.apply(this, arguments);
    // destructor code
```

After:
```js
onSetMod : {
    js : {
        '' : function() {
            // destructor code
```

#### The `changeThis` method

Instead of `changeThis` method you have to use native `bind`.

Before:
```js
// block code
obj.on('event', this.changeThis(this._method);
// block code
```

After:
```js
obj.on('event', this._method.bind(this));
// or better
obj.on('event', this._method, this);
```

#### The `afterCurrentEvent` method

Use the `nextTick` method instead of `afterCurrentEvent`. The `nextTick` assures
that the block exists at the time of running a callback. If the block is already
destructed, the callback will not be run.

Before:
```js
BEM.DOM.decl('block', {
    method : function() {
        this.afterCurrentEvent(function() { ...
```

After:
```js
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('block', {
    method : function() {
        this.nextTick(function() { ...
```

#### Access to a DOM element from an event handler callback

The callback binded to a DOM element as an event handler is now provided with
the link to this DOM element as `$(e.currentTarget)` instead of `e.data.domElem`.

Before:
```js
onClick : function(e) {
    e.data.domElem.attr(...
```

After:
```js
onClick : function(e) {
    $(e.currentTarget).attr(...
```

**NB** Remember that jQuery is unavailable in global scope and you must use `jquery` module for access to it.

#### Channels

Channels are not embedded into BEM any more. Now they are the separate
`events__channels` module.

Before:
```js
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('channel-name').on(....
```

After:
```js
modules.define('i-bem__dom', ['events__channels'], function(provide, channels, BEMDOM) {

BEMDOM.decl('block', {
    method : function() {
        channels('channel-name').on(....
```

#### The `i-system` block, the `sys` channel and the `tick`, `idle` and `wakeup` events

The is no `i-system` block any more. Instead you can use special modules:
`tick` with the tick event and `idle` with the events idle and wakeup.

Before:
```js
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('sys').on('tick', ...
```

After:
```js
modules.define('i-bem__dom', ['tick'], function(provide, tick, BEMDOM) {

BEMDOM.decl('block', {
    method : function() {
        tick.on('tick', ...
```

Before:
```js
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('sys').on('wakeup', ...
```

After:
```js
modules.define('i-bem__dom', ['idle'], function(provide, idle, BEMDOM) {

BEMDOM.decl('block', {
    method : function() {
        idle.on('wakeup', ...
```

### The BEM blocks
If you have BEM blocks just containing some modules without using BEM
methodology in them, you can now rewrite them as modules.

Before:
```js
BEM.decl('i-router', {
    route : function() { ... }
});
```

After:
```js
modules.define('router', function(provide) {

provide({
    route : function() { ... }
});

});

```

If you need BEM blocks (not BEM.DOM blocks) anyway, you can extend the `i-bem`
module.

Before:
```js
BEM.decl('my-block', { ... });
```

After:
```js
modules.define('i-bem', function(provide, BEM) {

BEM.decl('my-block', { ... });

provide(BEM);

});
```

#### The example of migration refactoring for the `b-spin` block

Before:
```js
BEM.DOM.decl('b-spin', {

    onSetMod : {

        'js' : function() {

            this._size = this.getMod('size') || /[\d]+/.exec(this.getMod('theme'))[0];

            this._bgProp = 'background-position';
            this._posPrefix = '0 -';

            if (this.elem('icon').css('background-position-y')) { /* A dirty hack for IE which cannot get a background-position property but packground-position-y only */
                this._bgProp = 'background-position-y';
                this._posPrefix = '-';
            }

            this._curFrame = 0;

            this.hasMod('progress') && this.channel('sys').on('tick', this._onTick, this);

        },

        'progress' : {

            'yes' : function() {

                this.channel('sys').on('tick', this._onTick, this);

            },

            '' : function() {

                this.channel('sys').un('tick', this._onTick, this);

            }

        }
    },

    _onTick: function(){

        var y = ++this._curFrame * this._size;

        (y >= this._size * 36) && (this._curFrame = y = 0);

        this.elem('icon').css(this._bgProp, this._posPrefix + y +'px');

    },

    destruct : function() {

        this.channel('sys').un('tick', this._onTick, this);
        this.__base.apply(this, arguments);

    }

});
```
After:
```js
modules.define(
    'i-bem__dom',
    ['tick'],
    function(provide, tick, BEMDOM) {

var FRAME_COUNT = 36;

BEMDOM.decl('b-spin', {
    onSetMod : {
        'js' : {
            'inited' : function() { // constructor
                var hasBackgroundPositionY = !!this.elem('icon').css('background-position-y'));

                this._bgProp = hasBackgroundPositionY? 'background-position-y' : 'background-position';
                this._posPrefix = hasBackgroundPositionY? '-' : '0 -';
                this._curFrame = 0;
                this._size = Number(this.getMod('size') || /[\d]+/.exec(this.getMod('theme'))[0]);

                this.hasMod('progress') && this._bindToTick();
            },

            '' : function() { // destructor
                this._unbindFromTick();
            }
        },

        'progress' : {
            'yes' : function() {
                this._bindToTick();
            },

            '' : function() {
                this._unbindFromTick();
            }
        }
    },

    _bindToTick : function() {
        tick.on('tick', this._onTick, this);
    },

    _unbindFromTick : function() {
        tick.un('tick', this._onTick, this);
    },

    _onTick : function() {
        var offset;
        this._curFrame++ >= FRAME_COUNT?
            offset = this._curFrame * this._size :
            this._curFrame = offset = 0;

        this.elem('icon').css(this._bgProp, this._posPrefix + offset + 'px');
    }
});

provide(BEMDOM);

});
```
