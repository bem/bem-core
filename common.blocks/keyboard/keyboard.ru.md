# keyboard

Блок предназначен для работы с пользовательским вводом с клавиатуры.

## Элементы блока

### __codes

Элемент предоставляет набор имен для часто используемых клавиатурных кодов. Имена используются в тех же случаях, когда обычно используется код клавиши. Использование осмысленных имен вместо кодов клавиш делает программный код более легким для понимания.

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

Например, метод `_onKeyDown` сравнивает значение поля `keyCode` объекта события с полями `UP` и `DOWN` объекта `keyCodes`:

```js
modules.define(
    'test1',
    ['i-bem__dom', 'keyboard__codes'],
    function(provide, BEMDOM, keyCodes) {

provide(BEMDOM.decl(this.name, /** @lends test1.prototype */{
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


Дополнительные примеры использования блока:

* [bem-components/common.blocks/button/button.js](https://github.com/bem/bem-components/blob/v2/common.blocks/button/button.js#L125)
* [bem-components/common.blocks/menu/menu.js](https://github.com/bem/bem-components/blob/v2/common.blocks/menu/menu.js#L97)
* [bem-components/common.blocks/select/select.js](https://github.com/bem/bem-components/blob/v2/common.blocks/select/select.js#L172)
