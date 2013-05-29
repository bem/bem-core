# Миграция

## BEM-блоки

## BEM.DOM-блоки

### Декларация
Вместо декларации через BEM.DOM.decl необходимо доопределять модуль `i-bem__dom`.

Было:
````javascript
BEM.DOM.decl('block', ...);
````
Стало:
````javascript
modules.define('i-bem__dom', function(provide, DOM) {

DOM.decl('block', ...);

provide(DOM);

});
````
### Конструктор
Необходимо использовать полную нотацию для обработчика установки модификатора `js` в значение `inited`.

Было:
````javascript
onSetMod : {
    js : function() {
        // код конструктора
````
Стало:
````javascript
onSetMod : {
    js : {
        inited : function() { 
            // код конструктора
````
### Деструктор
Вместо метода `destruct` необходимо использовать обработчик установки модификатора `js` в пустое значение (удаление модификатора).
Вызывать `__base` для того, чтобы у блоков работал базовый деструктор, определенный в `i-bem__dom`, больше не нужно.

Было:
````javascript
destruct : function() {
    this.__base.apply(this, arguments);
    // код деструктора
````
Стало:
````javascript
onSetMod : {
    js : {
        '' : function() {
            // код деструктора
````

### Каналы (channels)
Каналы больше не являются встроенными в BEM, теперь они являются самостоятельным модулем `events__channels`.

Было:
````javascript
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('channel-name').on(....
````

Стало:
````javascript
modules.define('i-bem__dom', ['events__channels'], function(provide, channels, DOM) {    

DOM.decl('blocks', {
    method : function() {
        channels('channel-name').on(....    
````

### На примере блока `b-spin`
Было:
````javascript
BEM.DOM.decl('b-spin', {

    onSetMod : {

        'js' : function() {

            this._size = this.getMod('size') || /[\d]+/.exec(this.getMod('theme'))[0];

            this._bgProp = 'background-position';
            this._posPrefix = '0 -';

            if (this.elem('icon').css('background-position-y')) { /* В IE нельзя получить свойство background-position, только background-position-y, поэтому костыляем */
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
````
Стало:
````javascript
modules.define(
    'i-bem__dom',
    ['tick'],
    function(provide, tick, DOM) {

var FRAME_COUNT = 36;

DOM.decl('b-spin', {
    onSetMod : {
        js : {
            inited : function() { // конструктор
                var hasBackgroundPositionY = !!this.elem('icon').css('background-position-y')); /* В IE нельзя получить свойство background-position, только background-position-y */

                this._bgProp = hasBackgroundPositionY? 'background-position-y' : 'background-position';
                this._posPrefix = hasBackgroundPositionY? '-' : '0 -';
                this._curFrame = 0;
                this._size = Number(this.getMod('size') || /[\d]+/.exec(this.getMod('theme'))[0]);

                this.hasMod('progress') && this._bindToTick();
            },

            '' : function() { // деструктор
                this._unbindFromTick();
            }
        },

        progress : {
            yes : function() {
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

provide(DOM);

});
````
