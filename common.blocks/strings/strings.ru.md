# strings

Блок предоставляет хелперы для манипуляций с данными строчного типа. 

## Обзор

### Элементы блока

| Элемент | Способы использования | Описание |
| --------| --------------------- | -------- |
| <a href="#elems-escape">escape</a> | <code>JS</code> | Набор методов для экранирования (эскейпинга) управляющих символов XML и HTML. |

### Свойства и методы элементов блока

| Элемент| Имя | Тип или возвращаемое значение | Описание |
| -------| --- | ----------------------------- | -------- |
| <a href="#elems-escape">escape</a> | <a href="#fields-xml">xml</a>(<code>{String} str</code>) | <code>{String}</code> | Служит для экранирования управляющих символов XML. |
|  | <a href="#fields-html">html</a>(<code>{String} str</code>) | <code>{String}</code> | Служит для экранирования управляющих символов HTML. |
|  | <a href="#fields-attr">attr</a>(<code>{String} str</code>) | <code>{String}</code> | Служит для экранирования управляющих символов в HTML и XML атрибутах. |

### Публичные технологии блока

Блок реализован в технологиях:

* `vanilla.js`

## Подробности

<a name="elems"></a>
### Элементы блока

<a name="elems-name"></a>
#### Элемент `escape`

Элемент предоставляет объект, содержащий набор методов для экранирования (эскейпинга) управляющих символов XML и HTML.

<a name="elems-name-fields"></a>
### Свойства и методы объекта

<a name="elems-name-fields-xml"></a>
#### Метод `xml`

Служит для экранирования управляющих символов XML. Обрабатываются символы `&`, `<`, `>`.

Принимаемые аргументы: 

* `str` `{String}` – строка для обработки. Обязательный аргумент. 

Возвращаемое значение: `{String}`. Строка с экранированными управляющими символами.

<a name="elems-name-fields-html"></a>
#### Метод `html`

Служит для экранирования управляющих символов HTML. Является синонимом метода `xml`.

<a name="elems-name-fields-attr"></a>
#### Метод `attr`

Служит для экранирования управляющих символов в HTML и XML атрибутах. Обрабатываются управляющие символы `"`, `\`, `'`, `&`, `<`, `>`.

Принимаемые аргументы: 

* `str` `{String}` – строка для обработки. Обязательный аргумент. 

Возвращаемое значение: `{String}`. Строка с экранированными управляющими символами.

Например, в блоке [`common.blocks/select`](https://github.com/bem/bem-components/blob/v2/common.blocks/select/select.js#L237) библиотеки `bem-components`, `strings__escape` используется для экранирования управляющих символов в свойстве `value` HTML-элемента:

```js
_createControlHTML : function(name, val) {
        // Using string concatenation to not depend on template engines
        return '<input ' +
            'type="hidden" ' +
            'name="' + name + '" ' +
            'class="' + this.buildClass('control') + '" ' +
            'value="' + escape.attr(typeof val === 'object'? JSON.stringify(val) : val) + '"/>';
    }
```
