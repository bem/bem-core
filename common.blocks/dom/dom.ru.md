# `dom`

Блок реализует набор методов – утилит для работы с DOM-деревом документа. 

## Публичные методы блока

### `contains`

Метод позволяет проверить содержит ли некоторый DOM-элемент `ctx` вложенный элемент `domElem`. 

 * `ctx` `{jQuery}` – DOM-элемент внутри которого производится поиск.
 * `domElem` `{jQuery}` – искомый DOM-элемент.

Метод возвращает `true`, если искомый элемент найден.

Например, в блоке `popup` с модификатором `autoclosable` из библиотеки `bem-components` метод используется функцией `_onDocPointerClick`. С его помощь проверяется, не был ли щелчок мыши, вызвавший событие, произведен по одному из дочерних элементов цели попапа:

```js
    _onDocPointerClick : function(e) {
        if(this.hasMod('target', 'anchor') && dom.contains(this._anchor, $(e.target))) return;

    /* ... */

    }
```


### `getFocused`

Метод служит для получения ссылки на DOM-элемент, находящийся в фокусе. Не принимает аргументов.
Возвращаемое значение `{jQuery}` – объект в фокусе.

Например:

```js
modules.require(['dom'], function(Dom) {
    Dom.getFocused(); // ссылка на элемент в фокусе
});
```


### containsFocus 
Метод проверяет находится ли переданный ему аргументом DOM-элемент (`{jQuery}`) в фокусе. Если находится, метод возвращает `true`.

Например, в блоке `control` библиотеки `bem-components` с помощью метода производится проверка, не в фокусе ли элемент блока. Если в фокусе, выставляются соответствующие модификаторы:

```js
modules.define(
    'control',
    ['i-bem__dom', 'dom' ],
    function(provide, BEMDOM, dom) {
provide(BEMDOM.decl(this.name, {
    
    /* ... */

    onSetMod : {
        'js' : {
            'inited' : function() {
                this._focused = dom.containsFocus(this.elem('control'));
                this._focused?
                    // if control is already in focus, we need to set focused mod
                    this.setMod('focused') :
                    // if block already has focused mod, we need to focus control
                    this.hasMod('focused') && this._focus();
            }
        }
    } 
}

    /* ... */

}));
});
```


### isFocusable

Метод проверят может ли браузер пользователя установить фокус на переданный аргументом DOM-элемент (`{jQuery}`). Если браузер может, метод возвращает `true`.  

В упомянутом блоке `control` библиотеки `bem-components` с помощью метода `isFocusable`проверяется возможность установки фокуса перед установкой:

```js
    _focus : function() {
        dom.isFocusable(this.elem('control')) && this.elem('control').focus();
    }  
```


### isEditable

Метод проверят возможен ли в переданном аргументом DOM-элементе (`{jQuery}`) ввод текста.  Если возможен, метод возвращает `true`. Другими словами, с помощью метода можно проверить является ли DOM-элемент полем ввода `<input>`, текстовой областью и т.п.

Например, есть попап, у которого могут быть вложенные блоки. Окно попапа должно скрываться по нажатию клавиши `Esc`. Но, прежде чем скрывать окно, нужно убедиться, что нажатие `Esc` не было произведено внутри вложенного поля ввода:

```js
function onDocKeyPress(e) {
    e.keyCode === keyCodes.ESC &&
        // omit ESC in inputs, selects and etc.
        !dom.isEditable($(e.target)) &&
            this.delMod('visible');
}
```
