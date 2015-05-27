# Hello, BEMHTML!

Данное руководство поможет попробовать шаблонизатор BEMHTML и
понять основные принципы работы с ним, пройдя семь простых шагов:

 * [Шаг 1. Инициализировать проект](#init).
 * [Шаг 2. Создать макет страницы](#page).
 * [Шаг 3. Добавить блок](#block).
 * [Шаг 4. Написать шаблон: приветствие по образцу](#template).
 * [Шаг 5. Переписать шаблон: генерация списка по массиву элементов](#array).
 * [Шаг 6. Дополнить шаблон: модифицировать HTML-теги](#tags).
 * [Шаг 7. Настроить оформление и поведение блока (CSS и JS)](#cssjs).

<a name="init"></a>
## Шаг 1. Инициализировать проект

Чтобы создать новый BEMHTML-проект, скопируем себе шаблон проекта, подготовленный разработчиками БЭМ, и установим `npm`-зависимости.

    $ git clone https://github.com/bem/project-stub.git project-hello
    $ cd project-hello
    $ npm install

Здесь выполняется:

 * копирование заготовки проекта в локальный каталог `project-hello`;
 * локальная установка `npm`-зависимостей в каталог созданного проекта (симлинки на исполняемые файлы будут созданы в `./project-hello/node_modules/.bin/`);
 * установка `bower`-зависимостей (библиотеки `bem-core` и `bem-components`).

**NB** Для сборки проекта необходима утилита `bem` (bem-tools) или `enb`.

Организовать цикл разработки (правка—компиляция—просмотр—правка...) поможет сервер для разработки.
Запускать его нужно в корневой папке проекта:

    $ npm start

Сервер принимает соединения по адресу http://localhost:8080/ и выполняет сборку страницы по
запросу от браузера, например: http://localhost:8080/desktop.bundles/index/index.html.

<a name="page"></a>
## Шаг 2. Создать макет страницы

Макеты статических HTML-страниц размещаются в каталоге `desktop.bundles`.

Создать макет пустой страницы (назовем ее `test`):

    $ ./node_modules/.bin/bem create -l desktop.bundles -b test

**NB** Язык описания макета статической страницы (БЭМ-дерева) — BEMJSON.

Посмотрим исходный код страницы (`desktop.bundles/test/test.bemjson.js`):

```javascript
({
    block: 'page',
    title: 'test',
    head: [
        { elem: 'css', url: '_test.css' }
    ],
    scripts: [
        { elem: 'js', url:'_test.js'}
    ],
    content: [
        'block content'
    ]
})
```

Здесь используется:

 * блок `page` из библиотеки блоков `bem-core`.

**NB** В проекте подключены библиотеки блоков `bem-core` и `bem-components`. Мы можем использовать и модифицировать блоки оттуда.

Просмотрим результат сборки страницы в браузере: (http://localhost:8080/desktop.bundles/test/test.html)

### Подробнее

 * [Справочник по BEMJSON](https://ru.bem.info/technology/bemjson/current/bemjson/)
 * [Библиотека блоков bem-core](https://ru.bem.info/libs/bem-core/)
 * [Библиотека блоков bem-components](https://ru.bem.info/libs/bem-components/)
 * [Документация по bem-tools](https://ru.bem.info/tools/bem/bem-tools/)
 * [Документация по ENB](https://ru.bem.info/tools/bem/enb-bem-techs/)

<a name="block"></a>
## Шаг 3. Добавить блок

Сделаем очень простой макет — разместим на нашей новой странице `test` один блок приветствия с текстом `Hello, BEMHTML!`.

Отредактируем исходный BEMJSON (`desktop.bundles/test/test.bemjson.js`):

```javascript
({
    block: 'page',
    title: 'test',
    head: [
        { elem: 'css', url: '_test.css' }
    ],
    scripts: [
        { elem: 'js', url:'_test.js'}
    ],
    content: [
        {
            block: 'hello',
            content: 'Hello, BEMHTML!'
        }
    ]
})
```

Здесь:

 * блок `hello` поместили в содержание страницы (поле `content` блока `page`);
 * текст приветствия — в поле `content` блока `hello`.

**NB** Если в проекте не определены шаблоны блока, HTML генерируется базовыми шаблонами из библиотеки `bem-core`.

Просмотрим результат. Фрагмент HTML-кода, описывающий тело страницы, выглядит так:

```html
<body class="page page_theme_islands">
    <div class="hello">Hello, BEMHTML!</div>
    <script src="_test.js"></script>
</body>
```

Здесь:

 * блоку `hello` соответствует элемент `div`;
 * в атрибуте `class` указано имя блока.

<a name="template"></a>
## Шаг 4. Написать шаблон: приветствие по образцу

Сделаем блок `hello` более универсальным — пусть он генерирует приветствие
для указанного имени.  Указывая разные имена, можно будет использовать один и
тот же блок `hello` на разных страницах или многократно на одной странице.

**NB** Объекты BEMJSON могут содержать произвольные поля данных,
а шаблоны могут использовать эти поля.

Создадим в нашем блоке поле `name` для хранения имени пользователя. Исправим `test.bemjson.js`:

    { block: 'hello', name: 'BEMHTML' }

Теперь, чтобы генерировать шаблонный текст приветствия, нам нужно создать в проекте файлы для блока `hello` и определить BEMHTML-шаблон.

Блоки, определённые в проекте, размещаются в каталоге `desktop.blocks`. Каталог для блока и нужные файлы удобно создавать с помощью команды `bem create`:

    $ ./node_modules/.bin/bem create -l desktop.blocks -b hello

Напишем шаблон для блока `hello` в файле `desktop.blocks/hello/hello.bemhtml`:

```javascript
block('hello').content(function() {
    return ['Hello, ', this.ctx.name, '!'];
});
```

Здесь:

 * `block('hello').content()` — предикат шаблона (будет вызван при обработке блока `hello` в стандартной моде `content`);
 * `function() { return ['Hello, ', this.ctx.name, '!']; }` — тело шаблона (при выводе в HTML выполняется конкатенация строк — элементов массива);
 * `this.ctx.name` — поле контекста, соответствует полю `name` в исходном BEMJSON блока.

**NB** Этапы генерации HTML, не переопределённые в пользовательских шаблонах, выполняются базовыми шаблонами библиотеки `bem-core`.

HTML-результат:

```html
<body class="page page_theme_islands">
    <div class="hello">Hello, BEMHTML!</div>
    <script src="_test.js"></script>
</body>
```

### Подробнее

 * [Синтаксис BEMHTML](https://ru.bem.info/technology/bemhtml/current/bemhtml-js-syntax/)
 * [Стандартные моды](https://ru.bem.info/technology/bemhtml/current/reference/#standardmoda)
 * [Поля контекста](https://ru.bem.info/technology/bemhtml/current/reference/#context_field)

<a name="array"></a>
## Шаг 5. Переписать шаблон: генерация списка по массиву элементов

С развитием проекта может понадобиться усложнить блок `hello`.
Для примера представим, что нам требуется выводить сразу несколько приветствий для заданного списка имен.

В этом случае удобно в исходных данных вместо одного имени в поле `name` поместить список имен в виде массива строк в поле `names`.
Теперь `test.bemjson.js` выглядит так:

    { block: 'hello', names: ['BEM', 'BEMJSON', 'BEMHTML'] }

Следуя БЭМ-методологии, каждое приветствие правильнее представить как элемент `item`, вложенный в блок `hello`.
Иначе говоря, мы хотели бы получить такое БЭМ-дерево при наложении шаблона:

```javascript
{
    block: 'hello',
    content: [
        { elem: 'item', content: 'BEM' },
        { elem: 'item', content: 'BEMJSON' },
        { elem: 'item', content: 'BEMHTML' }
    ]
}
```

**NB** BEMHTML-шаблоны позволяют на лету модифицировать входной BEMJSON (БЭМ-дерево).

Задача шаблона теперь заключается в том, чтобы для каждого имени в списке
сгенерировать элемент `item`, вложенный в `hello`. При этом сохраним поддержку старого API. Файл `hello.bemhtml`:

```javascript
block('hello')(
    content(function() {
        return (this.ctx.names || [this.ctx.name]).map(function(user) {
            return { elem: 'item', content: user };
        });
    }),
    elem('item')(
        content()(function() {
            return ['Hello, ', applyNext(), '!'];
        })
    )
);
```


Здесь в теле шаблона используется:

 * сокращенная запись предикатов с использованием `()`, эквивалентная двум шаблонам с предикатами: `block('hello').content()`,
   `block('hello').elem('item').content()`;
 * шаблоны по моде [`content`](https://ru.bem.info/technology/bemhtml/current/reference/#content);
   `block('hello').elem('item').content()`;
 * конструкция [`applyNext`](https://ru.bem.info/technology/bemhtml/current/templating/#applynext) — рекурсивный вызов процедуры применения шаблонов;
 * конструкция [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map), определённая в стандарте EcmaScript 5.

**NB** В предикате и теле шаблона можно использовать произвольные JS-выражения.

В результате применения шаблонов мы получим HTML-страницу с блоком из трех приветствий:

```html
<div class="hello">
  <div class="hello__item">Hello, BEM!</div>
  <div class="hello__item">Hello, BEMJSON!</div>
  <div class="hello__item">Hello, BEMHTML!</div>
</div>
```

<a name="tags"></a>
## Шаг 6. Дополнить шаблон: модифицировать HTML-теги

На первый взгляд введение элементов `item` может показаться излишним, однако его
полезность можно в полной мере оценить в тот момент, когда потребуется оформить
блок приветствий в виде маркированного списка.

В этом случае модификация BEMHTML-шаблона будет очень простой: нам нужно всего
лишь указать нужные теги для блока `hello` и элементов `item` вместо используемого
по умолчанию `<div>`. Добавим шаблонам для блока и элемента шаблоны по моде `tag`:

```javascript
block('hello')(
    tag()('ul'),
    content()(function() {
        return (this.ctx.names || [this.ctx.name]).map(function(user) {
            return { elem: 'item', content: user };
        });
    }),
    elem('item')(
        tag()('li'),
        content()(function() {
            return ['Hello, ', applyNext(), '!'];
        })
    )
);
```

Здесь:

 * снова используется вложенная запись предикатов, всего четыре шаблона:
    * `block('hello').tag()`
    * `block('hello').content()`
    * `block('hello').elem('item').tag()`
    * `block('hello').elem('item').content()`;
 * шаблоны по моде [`tag`](https://ru.bem.info/technology/bemhtml/current/reference/#tag).

HTML-результат:

```html
<ul class="hello">
  <li class="hello__item">Hello, BEM!</li>
  <li class="hello__item">Hello, BEMJSON!</li>
  <li class="hello__item">Hello, BEMHTML!</li>
</ul>
```

## Шаг 7. Настроить оформление и поведение блока (CSS и JS) <a name="cssjs"></a>

При создании блока в проекте `project-stub` по умолчанию были сгенерированы файлы трех технологий:

 * `hello.bemhtml`;
 * `hello.css`;
 * `hello.js`.

Реализация блока в технологиях CSS и JS не является частью шаблонизатора
BEMHTML, однако используется вместе с ним в любом реальном проекте.

**NB** BEMHTML помещает имена БЭМ-сущностей в атрибут `class` HTML-элементов. В CSS используются только селекторы по классу.

Например, чтобы покрасить все блоки приветствий в зеленый цвет, достаточно написать в CSS блока (`desktop.blocks/hello/hello.css`):

```css
.hello
{
    color: green
}
```


Чтобы включить клиентский JavaScript для блока, **необходимо** определить для блока шаблон
по моде [`js`](https://ru.bem.info/technology/bemhtml/current/reference/#js):

```javascript
block('hello').js()(true);
```

Если для блока был инициализирован клиентский JS, BEMHTML добавляет в список HTML-классов `i-bem`, а также атрибут со значением параметров клиентского JS (по умолчанию — `data-bem`, см. [мода `jsAttr`](https://ru.bem.info/technology/bemhtml/current/reference/#jsAttr)). JS-фреймворк при инициализации добавляет HTML-класс `hello_js_inited`:

```html
<div class="hello i-bem hello_js_inited" data-bem="{&quot;hello&quot;:{}}">
```

**NB** Блок `i-bem` (часть библиотеки `bem-core`) — JS-фреймфорк, позволяющий писать клиентский JavaScript в терминах БЭМ.

Пусть, например, при клике на блоке выводится предупреждение с текстом `Hello`.
Файл `desktop.blocks/hello/hello.js`:

```javascript
modules.define('hello', ['i-bem__dom'], function(provide, BEMDOM) {
    provide(BEMDOM.decl(this.name, {
        onSetMod: {
            'js': {
                'inited': function() {
                    this.bindTo('click', function() { alert('Hello'); });
                }
            }
        }
    }));
});
```


### Подробнее

 * [Описание JS-фреймворка `i-bem.js`](https://ru.bem.info/technology/i-bem/)

## Дальнейшее чтение

 * [BEMHTML. Справочное руководство](https://ru.bem.info/technology/bemhtml/v2/reference/)
 * [Библиотека блоков bem-core](https://ru.bem.info/libs/bem-core/)
 * [БЭМ-методология](https://ru.bem.info/method/)

