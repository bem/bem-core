# clearfix

Блок предоставляет СSS-класс, реализующий прием верстки **clearfix**, также известный как [Easy Clearing Hack](http://www.456bereastreet.com/archive/200603/new_clearing_method_needed_for_ie7/). Прием позволяет отменить обтекание для элементов с CSS-свойством `float`, без внесения изменений в исходную HTML-структуру документа.

Блок можно использовать в качестве контейнера для элементов со свойством `float`, или примешивая его к такому контейнеру.

Пример использования в качестве контейнера:

```bemjson
[{
    block: 'header',
    attrs: { style: 'border: 2px solid blue;' },
    content: 'Top element'
},
{
    block: 'clearfix',
    attrs: { style: 'border: 2px dotted yellow;' },
    content: [
    {
        block: 'float',
        attrs: { style: 'float: left; border: 1px solid green;' },
        content: 'Floating item 1'
    },
    {
        block: 'float',
        attrs: { style: 'float: left; border: 1px solid green;' },
        content: 'Floating item 2'
    }]
},
{
    block: 'footer',
    attrs: { style: 'border: 2px solid red' },
    content: 'Footer'
}]
```


Примешивание к блоку-контейнеру:

```bemjson
[{
    block: 'header',
    attrs: { style: 'border: 2px solid blue;' },
    content: 'Top element'
},
{
    block: 'some-container',
    mix: [{ block: 'clearfix' }],
    attrs: { style: 'border: 2px dotted yellow;' },
    content: [
    {
        block: 'float',
        attrs: { style: 'float: left; border: 1px solid green;' },
        content: 'Floating item 1'
    },
    {
        block: 'float',
        attrs: { style: 'float: left; border: 1px solid green;' },
        content: 'Floating item 2'
    }]
},
{
    block: 'footer',
    attrs: { style: 'border: 2px solid red' },
    content: 'Footer'
}]
```


### Публичные технологии блока

Блок реализован в технологиях:

* `css`.
