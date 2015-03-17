# dom

Блок предоставляет объект, содержащий набор методов для работы с DOM-деревом документа. 

## Обзор блока

### Свойства и методы объекта

| Имя | Возвращаемое значение | Описание |
| -------- | --- | -------- |
| Метод <a href="#fields-contains">contains</a> | <code>{Boolean}</code> | Проверяет, содержит ли один DOM-элемент другой вложенный DOM-элемент |
| Метод <a href="#fields-getFocused">getFocused</a> | <code>{jQuery}</code> – объект в фокусе | Служит для получения ссылки на DOM-элемент в фокусе  |
| Метод <a href="#fields-containsFocus">containsFocus</a> | <code>{Boolean}</code> | Проверят, находится ли переданный DOM-элемент в фокусе |
| Метод <a href="#fields-isFocusable">isFocusable</a> | <code>{Boolean}</code> | Проверят, может ли браузер установить фокус на переданный DOM-элемент |
| Метод <a href="#fields-isEditable">isEditable</a> | <code>{Boolean}</code> | Проверят, возможен ли в переданном DOM-элементе ввод текста |

## Описание блока

<a name="fields"></a>
### Свойства и методы объекта

<a name="fields-contains"></a>
#### Метод `contains`

Метод позволяет проверить содержит ли некоторый DOM-элемент `ctx` вложенный элемент `domElem`.

Принимаемые аргументы: 

 * `ctx` `{jQuery}` – DOM-элемент внутри которого производится поиск.
 * `domElem` `{jQuery}` – искомый DOM-элемент.

Возвращаемое значение: `{Boolean}`. Если искомый элемент найден – `true`.

Например, в блоке `popup` с модификатором `autoclosable` из библиотеки `bem-components` метод используется функцией `_onDocPointerClick`. С его помощь проверяется, не был ли щелчок мыши, вызвавший событие, произведен по одному из дочерних элементов цели попапа:

```js
    _onDocPointerClick : function(e) {
        if(this.hasMod('target', 'anchor') && dom.contains(this._anchor, $(e.target))) return;

    /* ... */

    }
```


<a name="fields-getFocused"></a>
#### Метод `getFocused`

Метод служит для получения ссылки на DOM-элемент, находящийся в фокусе. 

Не принимает аргументов.

Возвращаемое значение: `{jQuery}` – объект в фокусе.

Например:

```js
modules.require(['dom'], function(Dom) {
    Dom.getFocused(); // ссылка на элемент в фокусе
});
```


<a name="fields-containsFocus"></a>
#### Метод `containsFocus` 

Метод проверяет находится ли переданный ему аргументом DOM-элемент в фокусе.

Принимаемые аргументы: 

* `domElem` `{jQuery}` – проверяемый DOM-элемент.

Возвращаемое значение: `{Boolean}`. Если искомый элемент в фокусе – `true`.

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


<a name="fields-isFocusable"></a>
#### Метод `isFocusable`

Метод проверят может ли браузер пользователя установить фокус на переданный аргументом DOM-элемент.   

Принимаемые аргументы: 

* `domElem` `{jQuery}` – проверяемый DOM-элемент.

Возвращаемое значение: `{Boolean}`. Если фокус может быть установлен – `true`.

В упомянутом блоке `control` библиотеки `bem-components` с помощью метода `isFocusable`проверяется возможность установки фокуса перед установкой:

```js
    _focus : function() {
        dom.isFocusable(this.elem('control')) && this.elem('control').focus();
    }  
```


<a name="fields-isEditable"></a>
#### Метод `isEditable`

Метод проверят возможен ли в переданном аргументом DOM-элементе ввод текста. Другими словами, с помощью метода можно проверить является ли элемент полем ввода `<input>`, текстовой областью и т.п.

Принимаемые аргументы: 

* `domElem` `{jQuery}` – проверяемый DOM-элемент.

Возвращаемое значение: `{Boolean}`. Если ввод текста в элементе возможе – `true`.

Например, есть попап, у которого могут быть вложенные блоки. Окно попапа должно скрываться по нажатию клавиши `Esc`. Но, прежде чем скрывать окно, нужно убедиться, что нажатие `Esc` не было произведено внутри вложенного поля ввода:

```js
function onDocKeyPress(e) {
    e.keyCode === keyCodes.ESC &&
        // omit ESC in inputs, selects and etc.
        !dom.isEditable($(e.target)) &&
            this.delMod('visible');
}
```


<a name="implement"></a>
### Особенности реализации

Блок реализован в технологии `js` и подходит для использования в клиентских приложениях.
