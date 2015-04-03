# keyboard

Блок предназначен для работы с клавиатурным вводом. 

## Обзор

### Элементы блока

| Элемент | Способы использования | Описание |
| --------| --------------------- | -------- |
| <a href="#elems-codes">codes</a> | <code>JS</code> | Предоставляет объект, содержащий набор констант – имен часто используемых клавиатурных кодов. |

### Свойства и методы элементов блока

| Элемент | Имя | Тип |
| ------- | --- | --- |
| <a href="#elems-codes">codes</a> | BACKSPACE | <code>{String}</code> |
| | TAB | <code>{String}</code> |
| | ENTER | <code>{String}</code> |
| | CAPS_LOCK | <code>{String}</code> |
| | ESC | <code>{String}</code> |
| | SPACE | <code>{String}</code> |
| | PAGE_UP | <code>{String}</code> |
| | PAGE_DOWN | <code>{String}</code> |
| | END | <code>{String}</code> |
| | HOME | <code>{String}</code> |
| | LEFT | <code>{String}</code> |
| | UP | <code>{String}</code> |
| | RIGHT | <code>{String}</code> |
| | DOWN | <code>{String}</code> |
| | INSERT | <code>{String}</code> |
| | DELETE | <code>{String}</code> |

### Публичные технологии блока

Блок реализован в технологиях:

* `js`

## Подробности

<a name="elems"></a>
### Элементы блока

<a name="elems-codes"></a>
#### Элемент `codes`

Предоставляет объект, содержащий набор констант – имен часто используемых клавиатурных кодов.

<a name="elems-codes-fields"></a>
##### Свойства и методы объекта

Тип: `{String}`.

Значениями имен (свойств объекта) являются коды клавиш. Использование осмысленных имен вместо кодов клавиш делает код понятнее.

Например, метод `_onKeyDown` использует имена клавиш `UP` и `DOWN` при проверке поля `keyCode` объекта события:

```js
modules.define(
    'input',
    ['i-bem__dom', 'keyboard__codes'],
    function(provide, BEMDOM, keyCodes) {

provide(BEMDOM.decl(this.name, /** @lends input.prototype */{
    onSetMod : {
        'js': {
            inited: function() {
                this.bindTo('keydown', this._onKeyDown);
            }
        }
    },

    _onKeyDown : function(e) {
        if((e.keyCode === keyCodes.UP || e.keyCode === keyCodes.DOWN) && !e.shiftKey) {
            // ...
        }
    }
}));
});
```

Доступен следующий набор свойств:

* `BACKSPACE`
* `TAB`
* `ENTER`
* `CAPS_LOCK`
* `ESC`
* `SPACE`
* `PAGE_UP`
* `PAGE_DOWN`
* `END`
* `HOME`
* `LEFT`
* `UP`
* `RIGHT`
* `DOWN`
* `INSERT`
* `DELETE`
