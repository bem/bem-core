# strings

Блок `strings` предоставляет хелперы для манипуляций с данными строчного типа. 

## Элементы блока

### __escape

Элемент предоставляет набор методов-хелперов для экранирования (эскейпинга) управляющих символов `XML`, `HTML`, а также для подготовки строк к использованию в качестве атрибутов `attrs`:

* `xml` – экранируются `&`, `<`, `>`;
* `html` – экранируются `&`, `<`, `>`;
* `attr` – экранируются `"`, `\`, `'`, `&`, `<`, `>`;.

Элемент `strings__escape` реализован в технологии `vanilla.js` и подходит для использования как на сервере, так и на клиенте.

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

Смотрите также:

* пример использования `__escape` в блоке [attach.js](https://github.com/bem/bem-components/blob/v2/common.blocks/attach/attach.js#L83) библиотеки `bem-components`.
