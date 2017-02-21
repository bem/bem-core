# keyboard

Блок предназначен для работы с клавиатурным вводом.

## Обзор

### Элементы блока

| Элемент | Способы использования | Описание |
| --------| --------------------- | -------- |
| <a href="#elems-codes">codes</a> | `JS` | Предоставляет объект, содержащий набор констант – имен часто используемых клавиатурных кодов. |

### Свойства и методы элементов блока

| Элемент | Имя | Тип |
| ------- | --- | --- |
| <a href="#elems-codes">codes</a> | BACKSPACE | `String` |
| | TAB | `String` |
| | ENTER | `String` |
| | CAPS_LOCK | `String` |
| | ESC | `String` |
| | SPACE | `String` |
| | PAGE_UP | `String` |
| | PAGE_DOWN | `String` |
| | END | `String` |
| | HOME | `String` |
| | LEFT | `String` |
| | UP | `String` |
| | RIGHT | `String` |
| | DOWN | `String` |
| | INSERT | `String` |
| | DELETE | `String` |

### Публичные технологии блока

Блок реализован в технологиях:

* `js`

## Описание

<a name="elems"></a>

### Элементы блока

<a name="elems-codes"></a>

#### Элемент `codes`

Предоставляет объект, содержащий набор констант – имен часто используемых клавиатурных кодов.

<a name="elems-codes-fields"></a>

##### Свойства и методы объекта

Тип: `String`.

Значениями имен (свойств объекта) являются коды клавиш. Использование осмысленных имен вместо кодов клавиш делает код понятнее.

Например, метод `_onKeyDown` использует имена клавиш `UP` и `DOWN` при проверке поля `keyCode` объекта события:

```js
modules.define('input', ['i-bem-dom', 'keyboard__codes'], function(provide, bemDom, keyCodes) {

provide(bemDom.declBlock(this.name, /** @lends input.prototype */{
    onSetMod : {
        js : {
            inited : function() {
                this._domEvents().on('keydown', this._onKeyDown);
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
