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

## Шаг 1. Инициализировать проект <a name="init"></a>

Чтобы создать новый BEMHTL-проект, скопируем себе шаблон проекта, подготовленный разработчиками БЭМ,
и установим утилиты `bem-tools`.

    $ git clone https://github.com/bem/project-stub.git project-hello
    $ cd project-hello
    $ npm install

Здесь выполняется:

 * копирование заготовки проекта в локальный каталог `project-hello`;
 * локальная установка `bem-tools` в каталог созданного проекта (`./project-hello/node_modules/.bin/bem`);

**NB: Необходимый инструментарий — утилита `bem` (bem-tools)**

Организовать цикл разработки (правка—компиляция—просмотр—правка...) поможет `bem server`.
Запустить его нужно, находясь в корневой папке проекта:

    $ ./node_modules/.bin/bem server

Сервер принимает соединения по адресу http://localhost:8080/ и выполняет сборку страницы по
запросу от браузера, например: http://localhost:8080/desktop.bundles/index.

**NB: При первой сборке в каталог проекта копируются библиотеки `bemhtml` и `bem-bl`**

### Подробнее:

 * [Варианты локальной и глобальной установки `bem-tools`](http://ru.bem.info/tools/bem/installation/)

## Шаг 2. Создать макет страницы <a name="page"></a>

Макеты статических HTML-страниц размещаются в каталоге `desktop.bundles`.

Создать макет пустой страницы (назовем ее `test`):

    $ ./node_modules/.bin/bem create -l desktop.bundles -b test

**NB: Язык описания макета статической страницы (БЭМ-дерева) — BEMJSON**

Посмотрим исходный код страницы (`desktop.bundles/test/test.bemjson.js`):

    ({
        block: 'b-page',
        title: 'test',
        head: [
            { elem: 'css', url: '_test.css', ie: false},
            { elem: 'css', url: '_test', ie: true },
            { block: 'i-jquery', elem: 'core'},
            { elem: 'js', url:'_test.js'},
        ],
        content: [
            'block content'
        ]
    })

Здесь используется:

 * блок `b-page` из библиотеки блоков `bem-bl`.

**NB: В проекте подключена библиотека блоков `bem-bl`. Мы можем использовать и модифицировать блоки оттуда**

Просмотрим результат сборки страницы в браузере: (http://localhost:8080/desktop.bundles/test/test.html)

### Подробнее:

 * [Справочник по BEMJSON](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#%D0%A1%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%81-bemjson)
 * [Библиотека блоков bem-bl](http://ru.bem.info/libs/bem-bl/)
 * [Документация по bem-tools](http://ru.bem.info/tools/)

## Шаг 3. Добавить блок <a name="block"></a>

Сделаем очень простой макет — разместим на нашей новой странице `test` один блок приветствия с текстом `Hello, BEMHTML!`.

Отредактируем исходный BEMJSON (`desktop.bundles/test/test.bemjson.js`):

    ({
        block: 'b-page',
        title: 'test',
        head: [
            { elem: 'css', url: '_test.css', ie: false},
            { elem: 'css', url: '_test', ie: true },
            { block: 'i-jquery', elem: 'core'},
            { elem: 'js', url:'_test.js'},
        ],
        content: [
                {
                    block: 'b-hello',
                    content: 'Hello, BEMHTML!'
                }
        ]
    })

Здесь:

 * блок `b-hello` поместили в содержание страницы (поле `content` блока `b-page`);
 * текст приветствия — в поле `content` блока `b-hello`.

**NB: Если в проекте не определены шаблоны блока, HTML генерируется шаблонами по умолчанию из библиотеки `bemhtml`**

Просмотрим результат. Фрагмент HTML-кода, описывающий тело страницы, выглядит так:

    <body class="b-page__body b-page">
      <div class="b-hello">Hello, BEMHTML!</div>
    </body>

Здесь:

 * блоку `b-hello` соответствует элемент `div`;
 * в атрибуте `class` указано имя блока.


## Шаг 4. Написать шаблон: приветствие по образцу <a name="template"></a>

Сделаем блок `b-hello` более универсальным — пусть он генерирует приветствие
для указанного имени.  Указывая разные имена, можно будет использовать один и
тот же блок `b-hello` на разных страницах или многократно на одной странице.

**NB: Объекты BEMJSON могут содержать произвольные поля данных,
а шаблоны могут использовать эти поля**

Создадим в нашем блоке поле `name` для хранения имени пользователя. Исправим `test.bemjson.js`:

    { block: 'b-hello', name: 'BEMHTML' }

Теперь чтобы генерировать шаблонный текст приветствия, нам нужно создать в проекте файлы для блока `b-hello` и определить BEMHTML-шаблон.

Блоки, определённые в проекте, размещаются в каталоге `desktop.blocks`. Каталог для блока и нужные файлы удобно создавать с помощью команды `bem create`:

    $ ./node_modules/.bin/bem create -l desktop.blocks -b b-hello

Напишем шаблон для блока `b-hello` в файле `desktop.blocks/b-hello/b-hello.bemhtml`:

    block b-hello, content: ['Hello, ', this.ctx.name, '!']

Здесь:

 * `block b-hello, content` — предикат шаблона (будет вызван при обработке блока `b-hello` в стандартной моде `content`);
 * `['Hello, ', this.ctx.name, '!']` — тело шаблона (при выводе в HTML выполняется конкатенация строк — элементов массива);
 * `this.ctx.name` — поле контекста, соответствует полю `name` в исходном BEMJSON блока.

**NB: Этапы генерации HTML, не переопределённые в пользовательских шаблонах, выполняются шаблонами по умолчанию библиотеки BEMHTML.**

HTML-результат:

    <body class="b-page__body b-page">
      <div class="b-hello">Hello, BEMHTML!</div>
    </body>


### Подробнее:

 * [Справочное руководство по BEMHTML. Синтаксис BEMHTML](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#%D0%A1%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%81-bemhtml)
 * [Справочное руководство по BEMHTML. Стандартные моды](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#%D0%A1%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%BD%D1%8B%D0%B5-%D0%BC%D0%BE%D0%B4%D1%8B)
 * [Справочное руководство по BEMHTML. Поля контекста](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#%D0%9F%D0%BE%D0%BB%D1%8F-%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0)

## Шаг 5. Переписать шаблон: генерация списка по массиву элементов <a name="array"></a>

С развитием проекта может возникнуть требование усложнить блок `b-hello`.
Для примера представим, что нам требуется выводить сразу несколько приветствий для заданного списка имен.

В этом случае удобно в исходных данных вместо одного имени в поле `name` поместить список имен в виде массива строк в поле `names`.
Теперь `test.bemjson.js` выглядит так:

    { block: 'b-hello', names: ['BEM', 'BEMJSON', 'BEMHTML'] }

Следуя БЭМ-методологии, каждое приветствие правильнее представить как элемент `item`, вложенный в блок `b-hello`.
Иначе говоря, мы хотели бы получить такое БЭМ-дерево при наложении шаблона:

     {
        block: 'b-hello',
        content: [
            { elem: 'item', content: 'BEM' },
            { elem: 'item', content: 'BEMJSON' },
            { elem: 'item', content: 'BEMHTML' }
        ]
    }

**NB: BEMHTML-шаблоны позволяют на лету модифицировать входной BEMJSON (БЭМ-дерево)**

Задача шаблона теперь заключается в том, чтобы для каждого имени в списке
сгенерировать элемент `item`, вложенный в `b-hello`. Файл `b-hello.bemhtml`:

    block b-hello {
        content: this.ctx.names.map(function(user) { return { elem: 'item', content: user } })

        elem item, content: ['Hello, ', applyNext(), '!']
    }


Здесь в теле шаблона используется:

 * сокращенная запись предикатов с использованием `{}`. Эквивалентно двум шаблонам с предикатами: `block b-hello, content`,
   `block b-hello, elem item, content`;
 * шаблоны по моде [`content`](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#content);
 * конструкция [`applyNext`](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#applynext) — рекурсивный вызов процедуры применения шаблонов;
 * конструкция [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map), определённая в стандарте EcmaScript 5.

**NB: В предикате и теле шаблона можно использовать произвольные JS-выражения**

В результате применения шаблонов мы получим HTML-страницу с блоком из трех приветствий:

    <div class="b-hello">
      <div class="b-hello__item">Hello, BEM!</div>
      <div class="b-hello__item">Hello, BEMJSON!</div>
      <div class="b-hello__item">Hello, BEMHTML!</div>
    </div>

## Шаг 6. Дополнить шаблон: модифицировать HTML-теги <a name="tags"></a>

На первый взгляд введение элементов `item` может показаться излишним, однако его
полезность можно в полной мере оценить в тот момент, когда потребуется оформить
блок приветствий в виде маркированного списка.

В этом случае модификация BEMHTML-шаблона будет очень простой: нам нужно всего
лишь указать нужные теги для блока `b-hello` и элементов `item` вместо используемого
по умолчанию `<div>`. Добавим шаблонам для блока и элемента шаблоны по моде `tag`:

    block b-hello {

        tag: 'ul'

        content: this.ctx.names.map(function(user) { return { elem: 'item', content: user } })

        elem item {

            tag: 'li'

            content: ['Hello, ', applyNext(), '!']
        }
    }

Здесь:

 * снова используется вложенная запись предикатов, всего четыре шаблона: `block b-hello, tag`, `block b-hello, content`,
   `block b-hello, elem item, tag`, `block b-hello, elem item, content`;
 * шаблоны по моде [`tag`](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#tag).

**NB: Число шаблонов в bemhtml-файле равно числу двоеточий, отделяющих предикат от тела шаблона**

HTML-результат:

    <ul class="b-hello">
      <li class="b-hello__item">Hello, BEM!</li>
      <li class="b-hello__item">Hello, BEMJSON!</li>
      <li class="b-hello__item">Hello, BEMHTML!</li>
    </ul>

## Шаг 7. Настроить оформление и поведение блока (CSS и JS) <a name="cssjs"></a>

При создании блока в проекте `project-stub` по умолчанию были сгенерированы файлы трех технологий:

 * `b-hello.bemhtml`;
 * `b-hello.css`;
 * `b-hello.js`.

Реализация блока в технологиях CSS и JS не является частью шаблонизатора
BEMHTML, однако используeтся вместе с ним в любом реальном проекте.

**NB: BEMHTML помещает имена БЭМ-сущностей в атрибут `class` HTML-элементов. В CSS
используются только селекторы по классу.**

Например, чтобы покрасить все блоки приветствий в зеленый цвет, достаточно написать
в CSS блока (`desktop.blocks/b-hello/b-hello.css`):

    .b-hello
    {
        color: green
    }


Чтобы включить клиентский JavaScript для блока, **необходимо** определить для блока шаблон
по моде [`js`](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#js):

    block b-hello, js: true

Если для блока был инициализирован клиентский JS, BEMHTML добавляет в список HTML-классов `i-bem`, а также атрибут со значением параметров клиентского JS (по умолчанию — `onclick`, см. [мода `jsAttr`](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#jsattr)). JS-фреймворк при инициализации добавляет HTML-класс `b-hello_js_inited`:

    <div class="b-hello i-bem b-hello_js_inited" onclick="return {&quot;b-hello&quot;:{}}">

**NB: Блок `i-bem` (часть библиотеки `bem-bl`) — JS-фреймфорк, позволяющий писать клиентский JavaScript
в терминах БЭМ**

Пусть, например, при клике на блоке выводится предупреждение с текстом `Hello`.
Файл `desktop.blocks/b-hello/b-hello.js`:

    BEM.DOM.decl('b-hello', {
        onSetMod: {
        'js': {
            'inited': function() {
                this.bindTo('click', function() { alert('Hello') });
                }
            }
        }
    })


### Подробнее:

 * [Описание JS-фреймворка `i-bem.js`](http://ru.bem.info/libs/bem-bl/current/desktop/i-bem/docs/)


## Дальнейшее чтение

 * [BEMHTML. Справочное руководство](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md)
 * [Библиотека блоков bem-bl](http://ru.bem.info/libs/bem-bl/)
 * [БЭМ-методология](http://ru.bem.info/method/)

