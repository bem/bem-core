## Передача параметров экземпляру блока и элемента

### Синтаксис передачи параметров

Параметры блока и элемента хранятся в атрибуте `data-bem` HTML-элемента и передаются экземпляру в момент инициализации. Параметры позволяют влиять на поведение конкретного экземпляра, привязанного к данному HTML-элементу.

Значение атрибута `data-bem` должно содержать валидный JSON описывающий хеш вида:

* ключ — `{String}`, имя блока;
* значение — `{Object}`, параметры данного блока. Если данному экземпляру не требуются параметры, указывается пустой хеш `{}`.

```html
<div class="my-block i-bem" data-bem='{ "my-block" : {} }'></div>
<div class="my-block__my-elem i-bem" data-bem='{ "my-block__my-elem" : {} }'></div>
```

Если к HTML-элементу [привязано несколько блоков или элементов в технологии JS](./i-bem-js-html-binding.ru.md#Один-html-элемент--несколько-js-блоков),
то в значении атрибута `data-bem` должны содержаться параметры для каждого из них:

```html
<div class="a-block b-block i-bem" data-bem='{ "a-block" : {}, "b-block" : {} }'></div>
```

Указание имени блока в параметрах позволяет:

* размещать несколько блоков на одном HTML-элементе без необходимости множить его атрибуты
* ускорить инициализацию блоков – не нужно парсить значение атрибута `class`

### Задание параметров по умолчанию

Для задания параметров по умолчанию в декларации блока или элемента необходимо переопределить метод `_getDefaultParams()`. Его результат будет объединён со значениями параметров из атрибута `data-bem` DOM-элемента, при этом параметры из атрибута будут иметь приоритет.

**Пример**

```js
modules.define('my-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, {
    _getDefaultParams : function() {
        return {
            param1 : 'val1'
            param2 : 'val2'
        }
    }
}));

});
```

```html
<div class="my-block i-bem" data-bem='{ "my-block" : { "param1" : "val2", "param3" : "val3" } }'></div>
```

Итоговые параметры:

```js
{
    param1 : 'val2',
    param2 : 'val2',
    param3 : 'val3'
}
```

### Доступ к параметрам из экземпляра

Доступ к параметрам из экземпляра блока и элемента можно получить через поле `this.params`.

**Пример**

```html
<div class="my-block i-bem" data-bem='{ "my-block" : { "param1" : "val1" } }'></div>
```

```js
modules.define('my-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, {
    onSetMod : {
        'js' : {
            'inited': function() {
                console.log(this.params); // { param1 : 'val1' }
            }
        }
    }
}));

});
```
