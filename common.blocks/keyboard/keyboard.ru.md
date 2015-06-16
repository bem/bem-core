# keyboard

Блок предназначен для работы с клавиатурным вводом. 

## Элементы блока

### __codes

Элемент предоставляет набор имен для часто используемых клавиатурных кодов. Имена заменяют коды клавиш. Использование осмысленных имен вместо кодов клавиш делает создаваемый код понятнее.

Например, метод `_onKeyDown` использует имена клавиш `UP` и `DOWN` при проверке поля `keyCode` объекта события:

```js
modules.define(
    'test1',
    ['i-bem__dom', 'keyboard__codes'],
    function(provide, bemDom, keyCodes) {

provide(bemDom.decl(this.name, /** @lends test1.prototype */{
    onSetMod : {
        'js': {
            inited: function() {
                this.bindTo('click', _onKeyDown(e));
            }
        }

    },
    _onKeyDown : function(e) {
        if((e.keyCode === keyCodes.UP || e.keyCode === keyCodes.DOWN) && !e.shiftKey) {
            e.preventDefault();
            this.setMod('opened');
        }
    }

}));
});
```


Доступен следующий набор имен:

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

Дополнительные примеры использования блока:

* [bem-components/common.blocks/button/button.js](https://github.com/bem/bem-components/blob/v2/common.blocks/button/button.js#L125)
* [bem-components/common.blocks/menu/menu.js](https://github.com/bem/bem-components/blob/v2/common.blocks/menu/menu.js#L97)
* [bem-components/common.blocks/select/select.js](https://github.com/bem/bem-components/blob/v2/common.blocks/select/select.js#L172)
