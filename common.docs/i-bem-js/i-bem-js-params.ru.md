<a name="data-bem"></a>
## Передача параметров экземпляру блока

### Синтаксис передачи параметров

Параметры блока хранятся в атрибуте `data-bem` HTML-элемента и передаются блоку в момент инициализации. Параметры позволяют влиять на поведение конкретного экземпляра блока, привязанного к данному HTML-элементу.

Значение атрибута `data-bem` должно содержать валидный JSON описвающий хэш вида:

* ключ — `{String}`, имя блока;
* значение — `{Object}`, параметры данного блока. Если данному экземпляру блока не требуются
параметры, указывается пустой хэш `{}`.

```html
<div class="my-block i-bem" data-bem='{ "my-block": {} }'></div>
```


Если к HTML-элементу [привязано несколько JS-блоков](./i-bem-js-html-binding.ru.md#html-mixes), в значении атрибута `data-bem` должны содержаться параметры для каждого из них:

```html
<div class="my-block another-block i-bem" data-bem='{ "my-block": {}, "another-block": {} }'></div>
```


**Параметры элемента** передаются через атрибута `data-bem` DOM-узла элемента. Например, передать параметры элементу `my-elem` блока `my-block` можно так:

```html
<div class="my-block i-bem" data-bem='{ "my-block": {} }'>
    <div class="my-block__my-elem" data-bem='{ "my-block__my-elem": {} }'></div>
</div>
```

Указание имени блока в параметрах позволяет:

 * ускорить инициализацию блоков – не нужно парсить значение атрибута `class`.
 * размещать несколько блоков на одном HTML-элементе без необходимости множить его атрибуты.

### Доступ к параметрам из экземпляра блока

Доступ к параметрам из экземпляра блока можно получить через поле `this.params`. Его значение – хэш параметров из атрибута `data-bem` DOM-элемента блока (`this.domElem`).

Например, получить доступ к параметрам блока `my-block` можно так:

```html
<div class="my-block i-bem" data-bem='{ "my-block": { "foo" : "bar" } }'></div>
```


```js
modules.define('my-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod : {
        'js' : {
            'inited': function() {
                console.log(this.params); // { foo : 'bar' }
            }
        }
    }
}));

});
```


Для получения параметров элемента служит метод экземпляра блока `elemParams`. Он принимает аргументом строку с именем элемента или его jQuery-объект. Возвращает хэш параметров элемента.

```html
<div class="my-block i-bem" data-bem='{ "my-block": {} }'>
    <div class="my-block__my-elem" data-bem='{ "my-block__my-elem": { "foo" : "bar" } }'></div>
</div>
```


```js
modules.define('my-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod : {
        'js' : {
            'inited': function() {
                    console.log(this.elemParams('my-elem')); // { foo : 'bar' }
            }
        }
    }
}));

});
```
