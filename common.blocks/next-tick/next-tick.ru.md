# next-tick

Блок `next-tick` служит для асинхронного вызова переданной callback функции в следующем витке событийного цикла. 

`next-tick` – полифил, реализующий:

* симуляцию событийного цикла для старых версий браузеров;
* унифицированный интерфейс для работы с различными браузерами и `node.js`.

Блок реализован в технологии `vanilla.js` и подходит для использования как на клиенте, так и на сервере.

Блок реализует единственный метод и подходит для случаев, когда требуется, чтобы callback был выполнен после того, как другие функции в рамках событийного цикла отработали. Например, чтобы убедиться что доступны данные, динамически вычислявшиеся в рамках цикла.

Другой пример – случай, когда необходимо убедиться, что некоторое событие всплыло до верхнеуровневого элемента, как, например, в блоке `popup` с модификатором `autoclosable`:

```js
provide(Popup.decl({ modName : 'autoclosable', modVal : true }, /** @lends popup.prototype */{
    onSetMod : {
        'visible' : {
            'true' : function() {
                this
                    // NOTE: nextTick because of event bubbling to document
                    .nextTick(function() {
                        this.bindToDoc('pointerclick', this._onDocPointerClick);
                    })
                    .__base.apply(this, arguments);
            }
        }
    },

    _onDocPointerClick : function(e) { /* ... */ }
}}));
```


## Порядок вызова callback

В рамках событийного цикла работы блок формирует очередь, добавляя каждую следующую callback функцию в ее конец. Порядок вызова callback сохраняется. Например:

```js
modules.define('test', ['next-tick', 'i-bem-dom'], function(provide, nextTick, bemDom) {

provide(bemDom.decl({ block : this.name }, /** @lends test.prototype */
{ 
    onSetMod : {
        'js' : {
            'inited' : function() {
                var order = [];

                nextTick(function() { order.push(1); });
                nextTick(function() { order.push(2); });
                nextTick(function() { order.push(3); });
                nextTick(function() { console.log(order)); }; // should be [1, 2, 3]
            }
        }
    }
}));
});
```
