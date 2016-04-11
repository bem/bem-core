# page

На уровне переопределения `desktop.blocks` блок предоставляет шаблон, создающий дополнительный HTML-элемент `<meta>`. 

## Обзор

### Специализированные поля блока

| Поле | Тип | Описание |
| ---- | --- | -------- |
| <a href="#declfields-x-ua-compatible">x-ua-compatible</a> | `{String}`&#124;`{Boolean}` | Управляет поведением создаваемого блоком HTML-элемента `<meta>` с атрибутом `http-equiv` `X-UA-Compatible`. |

### Элементы блока

| Элемент | Способы использования | Описание |
| ------- | --------------------- | -------- |
| <a href="#elems-css">css</a> | `BEMJSON` | Элемент служит для подключения CSS. |
| <a href="#elems-conditional-comment">conditional-comment</a> | `BEMJSON` | Помогает использовать условные комментарии. |

### Специализированные поля элементов блока

| Элемент | Поле | Тип | Описание |
| ------- | ---- | --- | -------- |
| <a href="#elems-css">css</a> | <a href="#elems-css-declfields-ie">`ie`</a> | `{String}`&#124;`{Boolean}` | Используется для указания применимости стилей к Internet Explorer версий 6-9 и подключения специальных стилей для Internet Explorer.  |
| <a href="#elems-conditional-comment">conditional-comment</a> | <a href="#elems-conditional-comment-declfields-condition">`condition`</a> | `{String}` | Позволяет указать условие, при выполнении которого содержимое поля `content` декларации элемента, будет доступно.  |
|  | <a href="#elems-conditional-comment-declfields-msieOnly">`msieOnly`</a> | `{Boolean}` | Указывает, предназначен ли данный условный комментарий для использования исключительно в Internet Explorer.  |

### Публичные технологии блока

Блок реализован в технологиях:

* `bh.js`
* `bemhtml`

## Подробности

Создает HTML-элемент `<meta>` с атрибутом `http-equiv` `X-UA-Compatible`, определяющий совместимость с юзер-агентами. По умолчанию, значением атрибута `content` элемента является `IE=edge` (совместим с последними версиями Internet Explorer).

<a name="declfields"></a>
### Специализированные поля блока

<a name="declfields-x-ua-compatible"></a>
#### Поле `x-ua-compatible`

Тип: `{String}`|`{Boolean}`.

Управляет поведением создаваемого блоком HTML-элемента `<meta>` с атрибутом `http-equiv` `X-UA-Compatible`:

* со значением `false` HTML-элемент `<meta>` не будет создаваться.
* 
```js
{
    block : 'page',
    title : 'Hello, World!',
    'x-ua-compatible' : false,
    content : 'Отмена создания HTML-элемента <meta>'
}
```

* строчное значение будет присвоено свойству `content` HTML-элемента `<meta>`.

```js
{
    block : 'page',
    title : 'Hello, World!',
    'x-ua-compatible' : 'IE=6',
    content : 'Совместим с Internet Explorer 6'
}
```


<a name="elems"></a>
### Элементы блока

<a name="elems-css"></a>
#### Элемент `css` 

<a name="elems-css-declfields-ie"></a>
##### Специализированное поле `ie` 

Тип: `{String}`|`{Boolean}`.

Используется для указания применимости стилей к Internet Explorer версий 6-9 и подключения специальных стилей Internet Explorer. 

Допустимы следующие значения:

* строка вида `'lt IE 8'` – элемент `<link>` будет обернут в условные комментарии, для использования в соответствующих версиях Internet Explorer (для текущего примера `lt IE 8` – ниже восьмой версии).
* `false` – будут использоваться условные комментарии, предотвращающие использование стилей в IE 9 и ниже. 
* `true` – используется в случае, если в проекте есть отдельный CSS для каждой версии Internet Explorer. Значением свойства `url`, при этом, должна быть строка с путем и именем файла без суффикса. Во время подключения создаются элементы `<link>` с отдельным суффиксом для каждой версии. Другими словами, при значении `url` равном `foo.com/index` будут подключены стили `foo.com/index.ie6.css`, `foo.com/index.ie7.css` и т.д. до `...ie9.css`. При этом каждый HTML-элемент будет обернут в условный комментарий, обеспечивающий его подключение только в соответствующей версии Internet Explorer.

```js
{
    block : 'page',
    title : 'Page title',
    head : [
        { elem : 'css', url : 'example.css', ie : false },
        { elem : 'css', url : 'example.ie.css', ie : 'lt IE 8' }
    ],
    content : 'Страница с отдельными CSS правилами для IE'
}
```


<a name="elems-conditional-comment"></a>
#### Элемент `conditional-comment`

Позволяет обернуть содержимое поля `content`, определенное в BEMJSON-декларации элемента, в условные комментарии. Условие, при котором содержимое поля будет доступно, определяется специализированным полем `condition`.

```js
({
    block : 'page',
    title : 'page__conditional-comments',
    styles : 
        {
            elem : 'conditional-comment',
            condition : '<= IE 8',
            content : { elem : 'css', url : '_page.ie.css' }
        },
    scripts : 
        {
            elem : 'conditional-comment',
            condition : 'lte IE 8',
            content : { elem : 'js', url : 'https://yastatic.net/es5-shims/0.0.1/es5-shims.min.js' }
        }
})
```


<a name="elems-conditional-comment-declfields-condition"></a>
##### Специализированное поле `condition`

Тип: `{String}`.

Условие, при выполнении которого содержимое поля `content` декларации элемента, будет доступно. Например, определенная версия Internet Explorer.

Значение поля составляется из:

* квантора – `>`, `<`, `=`, `<=`, `>=`, `lt`, `gt`, `e` или `!` (логическое «не»);
* слова `IE` отделенного с обеих сторон пробелами;
* номера версии (6, 7, 8, 9). Может отсутствовать, если указан квантор `!`. Тогда, значение поля `content` будет доступно для всех браузеров, кроме Internet Explorer.

```js
({
    block : 'page',
    head :
        {
            elem : 'conditional-comment',
            condition : '! IE',
            content : 'Not for IE'
        }
})
```


<a name="elems-conditional-comment-declfields-msieOnly"></a>
##### Специализированное поле `msieOnly`

Тип: `{Boolean}`.

Указывает на то, предназначен ли данный условный комментарий для использования исключительно в Internet Explorer. Со значением `true` поле можно не указывать.

```js
({
    block : 'page',
    head :
        {
            elem : 'conditional-comment',
            condition : '> IE 8',
            msieOnly : false,
            content : 'For IE9+ and all other browsers'
        }
})
```
