Блок `page` создаёт теги верхнего уровня страницы:
* `<html>`
* `<head>`
* `<body>`

Именно он отвечает за то, какие подключить `CSS` и `JS` файлы к странице,
выставление `meta` тегов, заголовка и так далее.

Декларация блока в `BEMJSON` начинается объявлением блока и
указанием свойства `title`, которое превращается в тег `<title>` в `HTML`.

```bemjson
({
    block: 'page',
    title: 'Page title',
    content: 'Блок page'
})
```

Указание свойства `head` дополняет элемент `head`, соответствующий `HTML` тегу `<head>`,
элементами для подключения `CSS` и `JS` файлов, а также указания `meta`:

```bemjson
({
    block: 'page',
    title: 'Page title',
    head: [
        { elem: 'css', url: 'example.css', ie: false },
        { elem: 'css', url: 'example.ie.css', ie: 'lt IE 8' },
        { elem: 'js', url: 'example.js' },
        { elem: 'meta', attrs: { name: 'keywords', content: 'js, css, html' } },
        { elem: 'meta', attrs: { name: 'description', content: 'Yet another webdev blog' } }
    ],
    content: 'Страница с подключенными CSS, JS и meta-данными'
})
```

Элемент `css` превращается в `HTML` в тег `<link>`, подключающий как `CSS` стиль тот файл,
что указан в свойстве `url` этого элемента. Также у такого элемента может быть свойство `ie`.
Если это свойство `false`, то будут использоваться такие `conditional comments`, которые предотвратят использование этих стилей в `IE`. При строчном значении этого свойства тег `<link>` , будет обёрнут в соответствующий `conditional comment`, и этот стиль будет грузиться и использоваться указанных браузерах.

Также есть возможность указывать свойство `content` для содержания тега `<style>`:

```bemjson
({
    block: 'page',
    title: 'Page title',
    head: [
        {
            elem: 'css',
            content: '.b-blah { color: #f00 }'
        }
    ],
    content: 'Страница с тэгом <style>'
})
```

Элемент `js` действует аналогично, подключая к странице `JS` файлы при помощи тега `<script>`.

Свойство `head` не описывает содержание `HTML`-тега `<head>` полностью, а лишь
дополняет дефолтное, которое блок сам создаёт в своём `BEMHTML` шаблоне.

### Тег <meta> с указанием кодировки

`BEMHTML`:

```js
content: [
{
    tag: 'meta',
    attrs: { 'http-equiv': 'content-type', content: 'text/html; charset=utf-8' }
},
...
```

### Тег <meta> для использования `IE9` (и выше) в максимальном `compatibility` режиме

`BEMHTML`:

```js
content: [
...
{
    tag: 'meta',
    attrs: { 'http-equiv': 'X-UA-Compatible', content: 'IE=EmulateIE7, IE=edge' }
},
...
```

### Выставление значения тега <title> страницы из свойства

```js
content: [
...
{
    tag: 'title',
    content: this.ctx.title
},
...
```

### Выставление фавиконки

```js
content: [
...
this.ctx.favicon ? {
    elem: 'favicon',
    url: this.ctx.favicon
} : '',
...
```

### Декларация блока ua

```js
content: [
...
{
    block: 'ua'
},
...
```

Значением свойства `content` блока `page` может быть хеш-описание содержимого
(если речь идёт лишь об одном блоке) или массив блоков, описанных хешами:

```js
({
    block: 'page',
    title: 'Page title',
    content: {
        block: 'b-link',
        mods: { pseudo: 'yes', togcolor: 'yes', color: 'green' },
        url: '#',
        target: '_blank',
        title: 'Кликни меня',
        content: 'Псевдоссылка, меняющая цвет по клику'
    }
})
```

На блоки, содержащиеся в `content`, действуют их `BEMHTML` шаблоны.

### Отмена автоматической инициализации блоков

```js
noDeps: [
    { block: 'i-bem', elem: 'dom', mods: { init: 'auto' } }
]
```
