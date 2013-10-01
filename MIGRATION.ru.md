# Миграция

## Модули
Весь код теперь пишется в терминах модульной системы https://github.com/ymaps/modules.
Все зависимости должны явно указываться в коде, обращения к глобальным объектом необходимо минимизировать, а, по возможности, и полностью исключить.

Пример:
````javascript
modules.define(
    'my-module', // имя модуля
    ['module-from-library', 'my-another-module'], // зависимости модуля
    function(provide, moduleFromLibrary, myAnotherModule) { // декларация модуля, вызывается когда все зависимости "разрезолвлены"

// предоставление модуля
provide({
    myModuleMethod : function() {}
}); 
    
});
````

TODO: дописать про изменение сборки (использование специальных технологий для js и как быть с кастомными сборщиками)

## jQuery и jQuery-плагины
jQuery представлен модулем-оберткой `jquery`, который использует глобальный объект jQuery, в случае если он уже присутствует на странице, в противном случае загружая его самостоятельно.
jQuery теперь используется только для операций, связанных непосредственно с DOM (поиск элементов, подписка на события, установка/получение атрибутов элементов, и т.д.).

Для всех остальных операций написаны соответствующие модули, предоставляющие аналогичный функционал, но, при этом, не зависящие от jQuery:
 * модуль `objects` для работы с объектами (с методами `extend`, `isEmpty`, `each`)
 * модуль `functions` для работы с функциями (с методами `isFunction` и `noop`)

Также, все jQuery-плагины, не связанные непосредственно с jQuery (`$.observable`, `$.inherit`, `$.cookie`, `$.identify`, `$.throttle`) стали модулями:
 * модуль `events` вместо `$.observable` для работы с событиями, предоставляющий "классы" `EventsEmitter` и `Event`)
 * модуль `inherit` вместо `$.inherit` для работы с "классами" и наследованием
 * модуль `cookie` вместо `$.cookie`
 * модуль `identify` вместо `$.identify`
 * модули `functions__throttle`, `functions__debounce` вместо $.throttle и $.debounce, соответственно

Было:
````javascript
// код блока
$.throttle(...
// код блока
````

Стало:
````javascript
module.define('my-module', ['functions__throttle'], function(provide, throttle) {
// код модуля
throttle(...
// код модуля
````

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

### Метод changeThis ###
Вместо метода `changeThis` необходимо использовать нативный метод `bind`.

Было:
````javascript
// код блока
obj.on('event', this.changeThis(this._method);
// код блока
````

Стало:
````javascript
obj.on('event', this._method.bind(this));
````

### Метод afterCurrentEvent ###
Вместо метода `afterCurrentEvent` необходимо использовать метод `nextTick`, который гарантирует, что блок еще существует в момент исполнения колбэка (если блок уже уничтожен к этому моменту, то колбэк не исполняется).

Было:
````javascript
BEM.DOM.decl('block', {
    method : function() {
        this.afterCurrentEvent(function() { ...
````

Стало:
````javascript
modules.define('i-bem__dom', function(provide, BEMDOM) {    

BEMDOM.decl('block', {
    method : function() {
        this.nextTick(function() { ...
````

### Доступ до DOM-элемента в обработчике события
DOM-элемент, к которому был подвешен обработчик события теперь доступен как `$(e.currentTarget)` вместо `e.data.domElem`.

Было:
````javascript
onClick : function(e) {
    e.data.domElem.attr(...
````

Стало:
````javascript
onClick : function(e) {
    $(e.currentTarget).attr(...
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

DOM.decl('block', {
    method : function() {
        channels('channel-name').on(....    
````

### Блок `i-system` и канал `sys` событий tick, idle, wakeup.
Этот блок и канал перестали существовать, вместо них появились отдельные модули: `tick` с событием tick  и `idle` с событиями idle и wakeup.

Было:
````javascript
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('sys').on('tick', ...
````

Стало:
````javascript
modules.define('i-bem__dom', ['tick'], function(provide, tick, BEMDOM) {    

BEMDOM.decl('block', {
    method : function() {
        tick.on('tick', ...
````

Было:
````javascript
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('sys').on('wakeup', ...
````

Стало:
````javascript
modules.define('i-bem__dom', ['idle'], function(provide, idle, BEMDOM) {    

BEMDOM.decl('block', {
    method : function() {
        idle.on('wakeup', ...
````

## BEM-блоки
Те BEM-блоки, которые использовались как хранилище для каких-то методов, при этом никак не использующие BEM-методологию, теперь 
могут быть написаны как модули.

Было:
````javascript
BEM.decl('i-router', {
    route : function() { ... }
});
````

Стало:
````javascript
modules.define('router', function(provide) {

provide({
    route : function() { ... }
});

});

````

Если же, по каким-то причинам, нужны именно BEM-блоки (не BEM.DOM-блоки), то их можно объявлять, доопределяя модуль `i-bem`.

Было:
````javascript
BEM.decl('my-block', { ... });
````

Стало:
````javascript
modules.define('i-bem', function(provide, BEM) {

BEM.decl('my-block', { ... });

provide(BEM);

});
````

### Рефакторинг на примере блока `b-spin`
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
    function(provide, tick, BEMDOM) {

var FRAME_COUNT = 36;

BEMDOM.decl('b-spin', {
    onSetMod : {
        'js' : {
            'inited' : function() { // конструктор
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

        'progress' : {
            'true' : function() {
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
````
