# dom

Блок предоставляет объект, содержащий набор методов для работы с DOM-деревом. 

## Обзор

### Свойства и методы объекта

| Имя | Возвращаемое значение | Описание |
| -------- | --- | -------- |
| <a href="#fields-contains">contains</a>(<br><code>{jQuery} ctx</code>,<br><code>{jQuery} domElem</code>) | <code>{Boolean}</code> | Проверяет, содержит ли один DOM-элемент другой. |
| <a href="#fields-getFocused">getFocused</a>(<br><code>{jQuery} domElem</code>) | <code>{jQuery}</code> | Служит для получения ссылки на DOM-элемент в фокусе. |
| <a href="#fields-containsFocus">containsFocus</a>(<br><code>{jQuery} domElem</code>) | <code>{Boolean}</code> | Проверят, содержит ли DOM-элемент или его потомки фокус. |
| <a href="#fields-isFocusable">isFocusable</a>(<br><code>{jQuery} domElem</code>) | <code>{Boolean}</code> | Проверят, может ли DOM-элемент находиться в фокусе. |
| <a href="#fields-isEditable">isEditable</a>(<br><code>{jQuery} domElem</code>) | <code>{Boolean}</code> | Проверят, возможен ли в DOM-элементе ввод текста. |

### Публичные технологии блока

Блок реализован в технологиях:

* `js`

## Описание

<a name="fields"></a>
### Свойства и методы объекта

<a name="fields-contains"></a>
#### Метод `contains`

Метод позволяет проверить содержит ли некоторый DOM-элемент `ctx` элемент `domElem`.

Принимаемые аргументы: 

 * `ctx` `{jQuery}` – DOM-элемент внутри которого производится поиск. Обязательный аргумент.
 * `domElem` `{jQuery}` – искомый DOM-элемент. Обязательный аргумент.

Возвращаемое значение: `{Boolean}`. Если искомый элемент найден – `true`.

```js
modules.require(['dom', 'jquery'], function(dom, $) {

/*
<div class="block1">
  <div class="block2"></div>
</div>
*/

dom.contains($('.block1'), $('.block2'));  // true

});
```


<a name="fields-getFocused"></a>
#### Метод `getFocused`

Метод служит для получения ссылки на DOM-элемент, находящийся в фокусе. 

Не принимает аргументов.

Возвращаемое значение: `{jQuery}` – объект в фокусе.

Например:

```js
modules.require(['dom'], function(dom) {

dom.getFocused(); // ссылка на элемент в фокусе

});
```


<a name="fields-containsFocus"></a>
#### Метод `containsFocus` 

Метод проверяет находится ли в фокусе переданный аргументом DOM-элемент или один из его потомков.

Принимаемые аргументы: 

* `domElem` `{jQuery}` – проверяемый DOM-элемент. Обязательный аргумент.

Возвращаемое значение: `{Boolean}`. Если искомый элемент в фокусе – `true`.

```js
modules.require(['dom', 'jquery'], function(dom, $) {

/*
<div class="block1">
  <input class="block1__control"></div>
</div>
*/

$('.block1__control').focus();
dom.containsFocus($('.block1'));  // true

});
```


<a name="fields-isFocusable"></a>
#### Метод `isFocusable`

Метод проверят может ли браузер пользователя установить фокус на переданный аргументом DOM-элемент.   

Принимаемые аргументы: 

* `domElem` `{jQuery}` – проверяемый DOM-элемент. Обязательный аргумент. Если в jQuery-цепочке несколько DOM-элементов, то проверяется первый из них.

Возвращаемое значение: `{Boolean}`. Если фокус может быть установлен – `true`.

```js
modules.require(['dom', 'jquery'], function(dom, $) {

/*
<div class="menu">
  <a class="menu__item" href="/">Link 1</a>
</div>
*/

dom.isFocusable($('.menu__item')); // true

/*
<div class="menu">
  <span class="menu__item menu__item_current">Link 1</span>
</div>
*/

dom.isFocusable($('.menu__item')); // false

}); 
```


<a name="fields-isEditable"></a>
#### Метод `isEditable`

Метод проверят возможен ли в переданном аргументом DOM-элементе ввод текста. Другими словами, с помощью метода можно проверить является ли элемент полем ввода, текстовой областью и т.п.

Принимаемые аргументы: 

* `domElem` `{jQuery}` – проверяемый DOM-элемент. Обязательный аргумент. Если в jQuery-цепочке несколько DOM-элементов, то проверяется первый из них.

Возвращаемое значение: `{Boolean}`. Если ввод текста в элементе возможен – `true`.

```js
modules.require(['dom', 'jquery'], function(dom, $) {

dom.isEditable($('input, textarea')); // true

});
```
