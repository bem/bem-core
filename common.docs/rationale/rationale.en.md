
 # BEMHTML: a Templating Engine for BEM
 # BEMHTML: шаблонизатор для БЭМ

**BEMHTML** is a templating engine for thous who are using [BEM-metodology](http://bem.info/method) fro web-development.
**BEMHTML** — шаблонизатор (шаблонный движок) для тех, кто ведет веб-разработку в рамках [БЭМ-методологии](http://ru.bem.info/method).

BEMHTML is:
 * a HTML layout in terms of blocks, elements and modifiers;
 * support of BEM-style CSS;
 * support of BEM-style JS;
 * declarative and impressive templates;
 * convenient code support for long-term developing projects.

BEMHTML — это:
  * HTML-верстка в терминах блоков, элементов, модификаторов;
  * поддержка CSS в стиле БЭМ;
  * поддержка JS в стиле БЭМ;
  * декларативные и выразительные шаблоны;
  * удобство сопровождения кода в долгоживущих и развивающихся проектах.

## BEMHTML: the World-View <a name="worldview"></a>
## BEMHTML: Картина мира <a name="worldview"></a>

BEM-methodology and BMHTML, as it's part, are the product of many-ears experience of web-development and maintenance of web interfaces in Yandex. Web-development in Yandex were affected by the following factors:
 * The need of creating a common portal style;
 * The need for long-term maintainable code;
 * The need of quick changes in the projects;
 * Joint work on the code of different specialists.

БЭМ-методология и BEMHTML, как ее часть, обязаны своим появлением опыту верстки и сопровождения веб-интерфейсов в компании Яндекс. Главные условия, определившие характер веб-разработки в Яндексе:

  * задача создания единого портального стиля;
  * необходимость в многолетнем сопровождении кода;
  * потребность быстро вносить изменения;
  * совместная работа над кодом разных специалистов.


BEM was created as a solution for all these problems. At the first place it's a set of web-development principles(a world-view), and only at second it's a technology.
 БЭМ сформировался как решение всех этих задач, причем прежде всего не как технология, а как *картина мира* — ряд принципов веб-разработки.

BEMHTML is one of technologies that helps to carry development according to BEM-principles. Hence the problems, that BEMHTML is solving, are imposed by the same principles as for BEM.
BEMHTML — это одна из технологий, позволяющих разрабатывать в соответствии с принципами БЭМ. Поэтому задачи, которые решает BEMHTML, продиктованы этими же принципами.

### HTML+CSS is an Assembler for Web
After this principle stands a conviction that HTML and CSS are not suitable for a semantic description of web-interfaces (as a framework). The reason is in the difference of interpretation of HTML and CSS for different browsers. As the result, one needs to include into HTML and CSS specific elements for providing a cross-browser compatibility. For example, in the recent past, for making a cross-browser rounded corners one needed to wrap an element in six nested `div`.

### HTML+CSS — ассемблер для веба
За этим принципом стоит убеждение, что HTML и CSS не годятся в качестве удобного фреймворка для семантического описания веб-интерфейсов. Причина этого в том, что браузеры по-разному обрабатывают один и тот же HTML и CSS. В результате приходится включать в HTML и CSS специфические элементы, направленные исключительно на обеспечение совместимости с разными браузерами. Так, в недалеком прошлом для кроссбраузерной реализации скругленных уголков приходилось помещать элемент в структуру из шести вложенных `div`.

Web-interfaces should be described in hight-level terms (as header, button, menu, etc.). That allows us to separate **semantics** and **implementation**. Such contrast helps to divide the labor of those who design the structure of the interface (design, usability, connection with the back-end), and those who are aware of the subtleties of HTML-coding (cross-browser compatibility, support for IE, etc.).
Веб-интерфейс следует описывать в высокоуровневых терминах (шапка, кнопка, меню), что позволяет разделить **семантику** и **реализацию**. Такое противопоставление помогает и разделить труд тех, кто разрабатывает структуру интерфейса (дизайн, юзабилити, связь с бэкендом), и тех, кто владеет тонкостями HTML-верстки (кроссбраузерность, поддержка IE).

The conversion(translation) of high-level interface terms in the low-level command language of the browser (HTML + CSS) reminds a compilation *assembler for the web*.
Преобразование высокоуровневых интерфейсных терминов в низкоуровневый командный язык браузера (HTML+CSS) напоминает компиляцию в *ассемблер для веба*.

** The task for a templating engine: separate the logic of interface realization and HTML-representation. **

   * Templates and the Organization of interface (a set of element and layout for the page) should be described separately.
     BEM structure of interface is described by **BEM-tree**. It's a hierarchical structure of blocks, elements and modifiers.
   * Templates define only the rules of HTML-decoration for the certain parts of the interface.
     According to BEM methodology, for each part of interface there is a corresponding ***BEM-entity* (block or element with modifiers).

**Задача шаблонизатора: разделить логику организации интерфейса и HTML-представление**.

  * Организация интерфейса (набор и расположение элементов на странице) описывается отдельно от шаблонов.
    БЭМ организацию интерфейса описывет **БЭМ-дерево** — иерархическая структура из блоков, элементов и модификаторов.
  * Шаблоны определяют только правила HTML-оформления отдельных частей интерфейса.
    В рамках БЭМ каждой части интерфейса соответствует **БЭМ-сущность** (блок или элемент с модификаторами).

### Say 'No' to 'Copy-Paste' of Code

This principle is not unique for the web-developing, and it's unlikely to cause objections. However technological features of many templating engines are often forcing to code duplication. This problem arises when the same interface element (for example a button) is being used many times. The code for the button has to be repeated on every page for every its usage. If the button changes, the developer will have to update templates of every page where the button appears. Even if the templating engine allows us to put the code for the button into the global function, in every page the button code needs to be replaced by the function call.

### Нет дублированию кода!
Этот принцип не специфичен для веб-разработки и вряд ли вызовет возражения. Тем не менее, технологические особенности многих шаблонизаторов нередко вынуждают дублировать код. Это проявляется во всех ситуациях, когда один и тот же элемент интерфейса (например, кнопка) используется многократно. В большинстве шаблонизаторов HTML-код, описывающий кнопку, придется повторить на всех страницах, где она используется. Когда кнопку потребуется усложнить, разработчику придется отредактировать шаблоны всех страниц, где она присутствует. Даже если шаблонизатор позволяет вынести код кнопки в общую функцию, на всех страницах нужно будет заменить код кнопки вызовом этой функции.

**A templating engine should provide the ability of creation of flexible libraries of templates  **
Flexibility for a library means the following,
 for the project's developer it's:
  * ability to use any template as a bock for the page building;
  * ability to modify easily any template in the project without making any changes in the library source-code;
 for the library developer:
  * there should be no need of pre-design of special parts that can be overridden in the future.

**Задача шаблонизатора: возможность создания гибких библиотек шаблонов**.
Гибкость библиотеки подразумевает:

  * для верстальщика — возможность использовать любой шаблон в качестве блока для построения страниц;
  * и возможность легко модифицировать шаблон в своем проекте без необходимости вмешиваться в код библиотеки;
  * для автора библиотеки — отсутствие необходимости заранее проектировать, что именно можно будет переопределять.

### «БЭМ головного мозга»
### BEM

BEMHTML is an expansion of BEM-methodology to HTML. BEM gives an opportunity to designer, interface-developer, JavaScript-coder to speak one language (in the same terms, these terms are Blocks, Elements, Modifiers). BEMHTML allows HTML-coders join them.
BEMHTML представляет собой распространение БЭМ-методологии на еще одну технологию — HTML. БЭМ предлагает дизайнеру, разработчику интерфейса, JavaScript-программисту работать в терминах единой предметной области — блоков, элементов, модификаторов. BEMHTML позволяет HTML-верстальщику присоединиться к ним.

** The task: tools for HTML-development in terms of BEM.**

 * There should be a template for each BEM-entity(block, element or modifier).
 * CSS-integration within BEM-style (BEM-classes should be generated automatically for all blocks, elements and modifiers).
 * JS-integration within BEM-style (JS parameters should be generated automatically for blocks, elements and modifiers).

**Задача: инструментарий для верстки в терминах БЭМ**.

  * для каждой БЭМ-сущности (блока, элемента, модификатора) — свой шаблон;
  * интеграция с CSS в стиле БЭМ (автоматическая генерация БЭМ-классов для блоков, элементов, модификаторов);
  * интеграция с JS в стиле БЭМ (автоматическая генерация классов и JS-параметров для блоков, элементов, модификаторов).

## Capability of BEMHTML
## Возможности BEMHTML

### Web-Page in Terms of BEM (Blocks, Elements, Modifiers)

 - Page-structure is described in BEMJSON format, it's a JavaScript representation of the BEM-tree;
 - The templating engine converts the BEM-tree into a HTML-code;
 - CSS-integration within the BEM-style
 - JS-integration within the BEM-style

### Верстка в терминах БЭМ (блоков, элементов, модификаторов)

  - Структура страниц описывается в формате BEMJSON — JavaScript-представление БЭМ-дерева.
  - Шаблонизатор выполняет преобразование БЭМ-дерева в HTML.
  - Интеграция с CSS в стиле БЭМ.
  - Интеграция с JS в стиле БЭМ.


#### Examples
The templating engine receives the following data:
#### Примеры
Данные (БЭМ-дерево), которые шаблонизатор принимает на вход:

```js
{
  block: 'widgets',
  content: [
    {
      elem: 'weather',
      content: 4
    }
  ]
}
```

There is no need in a template (the data is handled by default templates)
Шаблон не требуется (обработка шаблонами по умолчанию).

The resulting HTML:
HTML-результат:

```xml
<div class="widgets">
  <div class="widgets__weather">4</div>
</div>
```

If the `weather` block has a JavaScript realization with usage of `i-bem.js` one needs to use the following template for passing JavaScript-parameters into the block :
Если блок `weather` имеет JavaScript-реализацию с использованием `i-bem.js`, то для передачи JavaScript-параметров блоку можно использовать шаблон:

```js
block weather, js: { id: Math.random() * 1e4 }
```

Resulting HTML:
HTML-результат:
```xml
<div class="widgets i-bem" onclick="return { 'weather': { 'id': 4321 } }">
  <div class="widgets__weather">4</div>
</div>
```

### Syntax for data and templates description is based on JavaScript.
 - Declarative templates: the template consists of condition for usage (predicate) and data-structure, that describes the resulting HTML(the template's body).
 - JavaScript syntax is extend with a key-words(`block`, `elem`, `mods`, `elemMods`) for working with BEM-entities.
 - For the templates an arbitrary JavaScript code can be used. There is no technical limitations placed by BEMHTML on operations in predicates or template. An efficiency and consistency of templates' work is provided by developers' agreements.
 - All BEMHTML templates are compiled in JavaScript, therefore it can be executed at the server side as well, as at the client side.

### Синтаксиc описания данных и шаблонов основан на JavaScript
  - Декларативные шаблоны. Шаблон состоит из условий применения (предикат) и структуры данных, описывающей HTML-результат (тело шаблона).
  - Для работы с БЭМ-сущностями синтаксис JavaScript расширен ключевыми словами (`block, elem, mods, elemMods`).
  - Возможность использовать произвольный JavaScript-код в шаблонах. BEMHTML не ставит технических ограничений на выполнение операций в предикате и теле шаблона. Эффективность и корректность работы шаблонов обеспечивается соглашениями, которым следуют разработчики.
  - Все BEMHTML-шаблоны компилируются в переносимый JavaScript, что позволяет выполнять шаблоны как на сервере, так и на клиенте.

#### Examples
Definition of HTML-tags in a declarative style:

#### Примеры
Объявление HTML-тегов для блоков в декларативном стиле:

```js
block widgets {
  tag: 'ul'
  elem weather, tag: 'li'
}
```

The resulting HTML:
HTML-результат:

```xml
<ul class="widgets">
  <li class="widgets__weather">4</li>
</ul>
```


Arbitrary calculations performed in the template's body:
Произвольные вычисления в теле шаблона:

```js
block widgets, elem weather, content: {
  var oldContent = applyNext()
  return oldContent > 0 ? '+' : '' + oldContent + ' °C'
}
```

The resulting HTML
HTML-результат:

```xml
<ul class="widgets">
  <li class="widgets__weather">+4 °C</li>
</ul>
```


### Flexibility and Extendability
 - BEMHTML allows us to separate a layout into an **independent blocks**, that can be combined among themselves without any restrictions.
 - ***Definition Levels* allow us to collect templates into libraries, and then can be used in other projects.

### Гибкость и расширяемость «по построению»
  - BEMHTML позволяет разделить верстку на **независимые блоки**, свободно комбинируемые между собой.
  - **Уровни переопределения** позволяют объединять шаблоны в библиотеки, которые можно использовать в одном или нескольких проектах.

#### Examples
The input-data:

#### Примеры
Входные данные:

```js
{ block: page,
  content: [
    {
      block: header,
      content: 'Title 1'
    },
    {
      block: header,
      mods: { level: 2 },
      content: 'Title 2'
    }
  ]
}
```

Templates defined in the library:
Шаблоны, определенные в библиотеке:

```js
block header, tag: 'h1'
block header, mod level 2, tag: 'h2'
```

Templates defined in the project:
Шаблоны, определенные в проекте:

```js
block header, tag: 'h2'
block header, mod level 2, tag: 'h3'
```

The result:
Результат:

```xml
<div classs="page">
  <h2 class="header">
  Title 1
  </h2>
  <h3 class="header header_level_2">
  Title 2
  </h3>
</div>
```


### Multi-Time Implementation
 - During runtime BEMHTML can generate additional elements, that are needed for solving layout problems (different kinds of wrappings). The initial data(BEM-tree) can be modified during the templates' implementation. Moreover, the same templates can be applied again to modified data. Therefore all layout's wrappings can be implemented without messing-up the input data with extra elements.

### Многопроходность
  - BEMHTML позволяет «на лету» генерировать дополнительные элементы, нужные для решения задач верстки — разного рода обертки. В ходе применения шаблонов можно модифицировать исходные данные (БЭМ-дерево) и заново применять те же шаблоны к уже модифицированным данным. Такая многопроходность позволяет реализовать всю логику генерации оберток в шаблонах, не засоряя лишними элементами входные данные.

#### Examples
The input data is a name of Yandex user:

#### Примеры
Входные данные — имя Яндекс-пользователя:

```js
{
  block: 'ya-user',
  content: 'Hamster'
}
```

The template selects the first letter of the name and wraps it into instantly generated element:
Шаблон — выделяет первую букву в имени пользователя и оборачивает ее в тут же сгенерированный элемент:

```js
block ya-user, content: {
  var oldContent = applyNext();
  return [
    { elem: 'first-letter', content: oldContent[0] },
    oldContent.substring(1)
  ]
}
```

The resulting HTML:
HTML-результат:

```xml
<div class="ya-user"><div class="ya-user__first-letter">H</div>amster</div>
```

## BEMHTML and Other Temlating Engines <a name="andothers"></a>
## BEMHTML и другие шаблонизаторы <a name="andothers"></a>

There are hundreds of different kinds of template engines. Among all of them several fields of application (generation of HTML and other text formats) and a few different approaches for text generation from data by using a template can be distinguished.
Шаблонизаторы (шаблонные движки, template engines) — чрезвычайно многочисленный отряд инструментов, насчитывающий сотни видов. За этим многообразием скрывается несколько разных областей применения (генерация HTML, других текстовых форматов, DOM) и несколько различных подходов к решению задачи генерации текста по шаблону и данным.

By its approaches BEMHTML can be classified as "exotic". Let's take a look at several classification principles of templating engines and the place of BEMHTML among them.
Не все идеи в разработке шаблонизаторов одинаково популярны. По подходам, которые реализованы в BEMHTML, его можно отнести к разряду «экзотических». Рассмотрим несколько возможных принципов классификации шаблонизаторов и место BEMHTML среди них.

### Classification by Semantics (What Does the Templating Engine)
#### Strings' Interpolation

### По семантике (что делает шаблонизатор)
#### Интерполяция строк

The templating engine places a corresponding to needed data string into the text of template. In addition different conditions, variables and loops can be used. It's the largest class of templating engines.
```%username%, don't worry, be happy!```
Шаблонизатор подставляет в текст шаблона строки, соответствующие нужным данным. В дополнение могут использоваться условия, циклы, переменные. Это самый многочисленный класс шаблонизаторов.

```Шоколад ни в чем не виноват, %username%.```

Templaing engines of this kind: [Mustache](http://mustache.github.com), [Handlebars](http://handlebarsjs.com), [Jade](https://github.com/visionmedia/jade), [DustJS](http://linkedin.github.com/dustjs/), etc.
В качестве примера таких шаблонизаторов можно привести [Mustache](http://mustache.github.com), [Handlebars](http://handlebarsjs.com), [Jade](https://github.com/visionmedia/jade), [DustJS](http://linkedin.github.com/dustjs/) и многие другие.

#### Data Bind

A templating engine associates data with HTML by using some rules. The rules are described separately form the HTML.

```js
var html ="<span class="name"/> "+ "don't worry, be happy!"
, data = { username: 'John Smith' }
, map = plates.Map();

map.class('name').to('username');
plates.bind(html, data, map);
```

Шаблонизатор связывает данные с HTML по правилам, описанным отдельно от HTML.

```js
var html = 'Шоколад ни в чем не виноват,' + '<span class="name"/>.'
, data = { username: 'John Smith' }
, map = plates.Map();

map.class('name').to('username');
plates.bind(html, data, map);
```
Exaples: [Transparency](https://github.com/leonidas/transparency), [Flatiron.js](http://flatironjs.org/#templating), [Angular.js](http://angularjs.org), [Pure](http://beebole.com/pure/) and many others.
Примеры: [Transparency](https://github.com/leonidas/transparency), [Flatiron.js](http://flatironjs.org/#templating), [Angular.js](http://angularjs.org), [Pure](http://beebole.com/pure/)  и многие другие.

**Live data bind**: the connection with a changing data can also be declared. An example of such templating engine is [Knockout.js](http://knockoutjs.com).

**Live data bind** — отличается тем, что в шаблоне можно декларировать связь не со статическими, а изменяющимися данными. Пример такого шаблонизатора — [Knockout.js](http://knockoutjs.com).

#### Data Driven

A templating engine connects a data key-word with a fragment of input HTML. In this case at the begging we have the data structure, and later with help of templates it's converted into HTML. In the approaches mentioned above, a page is built form a template, that is filled up with some data.

Шаблонизатор связывает ключевое слово в данных с фрагментом выходного HTML. В предыдущих подходах первичен шаблон, который насыщается данными. Здесь наоборот: первична структура данных, которая при помощи шаблонов транслируется в HTML.

For example the XSLT template below doesn't place any restrictions on the data structure, it can include key-worlds:
Например, приведенный ниже XSLT-шаблон никак не ограничивает структуру данных, в которой может встретиться ключевое слово:

```xml
<xsl:template match="username">
    <span class="name">
        <xsl:apply-templates/>
    </span>
</xsl:template>
```

It can also be used with the data:

```xml
`<username>John Smith</username>, don't worry, be happy!`
```

С одинаковым успехом его можно применить к таким данным:

```xml
Шоколад ни в чем не виноват, <username>John Smith</username>.`
```

Or:
И к таким:

```xml
<ul>
  <li><username>Veni</username>,</li>
  <li><username>Vidi</username>,</li>
  <li><username>Vici</username></li>
</ul>
```

Examples: [XSLT](http://www.w3.org/TR/xslt), **BEMHTML**.
Примеры: [XSLT](http://www.w3.org/TR/xslt), **BEMHTML**.

### Classification by Semantics
#### The final version of the text with special insertions

### По синтаксису
#### Текст в финальном виде со специальными вставками

This model is correlated with Strings' Interpolation approach. A template looks very similar to the final HTML:
Эта модель тесно связана с подходом к шаблонизатору как к системе интерполяции строк. Шаблон в этом случае записывается в виде HTML, который очень мало отличается от финального результата.

```xml
<span class="name">[% username %]</span>
```

There is no need of learning a special syntax, and very often it's mentioned as an advantage of this approach.
Отсутствие необходимости изучать специальный синтаксис часто выдвигается в качестве преимущества данного подхода.

Examples:  [Mustache](http://mustache.github.com), [Handlebars](http://handlebarsjs.com), [DustJS](http://linkedin.github.com/dustjs/) and many others.
Примеры: [Mustache](http://mustache.github.com), [Handlebars](http://handlebarsjs.com), [DustJS](http://linkedin.github.com/dustjs/) и многие другие.

#### Short HTML Notation
#### Сокращенная запись HTML

HTML language has a peculiar syntactic redundancy. Almost all tags have to be in pairs (one opening and one closing tag). For example if we want to declare 'there is a table', we need to mention `table` two times: in the opening tag and in the closing tag. To simplify code writing and make it more readable, some developers suggest to use the short notation for HTML. For example:
Языку HTML свойственна синтаксическая избыточность — необходимость в парных открывающих и закрывающих тегах. Например, чтобы объявить: «здесь таблица» — всегда требуется дважды указать `table` — в открывающем и закрывающем теге. Разаботчики некоторых шаблонизаторов стремятся облегчить написание и восприятие шаблонов, предлагая сокращенный синтаксис для записи HTML-конструкций.

```
span.name #{username}
```

Example:
Примеры: [Jade](https://github.com/visionmedia/jade), [Eco](https://github.com/sstephenson/eco).

#### The Object-Oriented Syntax
#### Предметно-ориентированный синтаксис

In this approach the rules for the HTML generation are described in a template, according to the data scope of the templating engine.

```js
var html = "<span class="name"/> "+ "don't worry, be happy!"
, data = { username: 'John Smith' }
, map = plates.Map();

map.class('name').to('username');
plates.bind(html, data, map);
```

При таком подходе в шаблоне описывается не финальная HTML-страница, а правила генерации HTML в соответствии с предметной областью шаблонизатора.

```js
var html = 'Шоколад ни в чем не виноват,' + '<span class="name"/>.'
, data = { username: 'John Smith' }
, map = plates.Map();

map.class('name').to('username');
plates.bind(html, data, map);
```

Examples: [XSLT](http://www.w3.org/TR/xslt), [Flatiron.js](http://flatironjs.org/#templating), **BEMHTML**.
Примеры: [XSLT](http://www.w3.org/TR/xslt), [Flatiron.js](http://flatironjs.org/#templating), **BEMHTML**.

### Classification by the Base Language
#### One Basic Language
The templating engine accepts only the certain programming language, and all control structures of the templates are written in this language.

Examples: [XSLT — XML](http://www.w3.org/TR/xslt), [ECO — CoffeeScript](https://github.com/sstephenson/eco), **BEMHTML — JavaScript**.

### По базовому языку
#### Один базовый язык
Шаблонизатор привязан к разработке на определенном языке. На этом языке записываются все управляющие конструкции в шаблонах.

Примеры: [XSLT — XML](http://www.w3.org/TR/xslt), [ECO — CoffeeScript](https://github.com/sstephenson/eco), **BEMHTML — JavaScript**.

#### Compiling in a Few Different Languages

In the templating engine its own data scope is created. It's simple enough to allow compilation of control structures into a wide range of programming languages.

Examples: [TT2](http://www.template-toolkit.org/), [Mustache](http://mustache.github.com).

#### Компиляция в несколько разных языков

В шаблонизаторе создается своя предметная область, достаточно примитивная, чтобы допускать компиляцию управляющих конструкций в широкий диапазон языков программирования.

Примеры: [TT2](http://www.template-toolkit.org/), [Mustache](http://mustache.github.com).


### Why BEMHTML was build this way
 * **Data driven**.
   Templates are bounded to the data elements. Therefore it's possible to create templates as a **declarative** and **atomic** (independent and  self-sufficient) statements, which connects an element with its representation in HTML. For example the *tag* of the *block "header" - `table`*. BEM-style CSS describes the style with atomic statements: the *color* of the *block "header" - red**.

   Such templates are similar to modules (in sense of the way they are built). Regardless to its location, the key-word will be handled by the same template. Hence there is no need of code duplication. Also the atomic statements is easy to redefine, therefore allows us to build flexible libraries.

 * **Subject-oriented syntax**.
   The main criteria for the syntax selection are: the small size of templates (without a need to repeat tags two times) and the ability to bound templates to BEM-entities (but not to the HTML nodes).

 * **JavaScript is the basic language**
   JavaScript as a basic language gives many advantages: performance, portability, the active development of technologies, and the last but very important, it's familiar to HTML-coders.


### Почему BEMHTML устроен так

  * **Data driven**.
    Привязка шаблонов к элементам данных позволяет делать шаблоны **декларативными** и **атомарными** утверждениями, связывающими элемент и его HTML-представление. Например, *тег блока «шапка» — `table`*. Аналогично CSS в стиле БЭМ описывает оформление атомарными утверждениями: *цвет блока «шапка» — красный*.

    Такие шаблоны обладают модульностью «по построению»: вне зависимости от того, на какой странице встречается ключевое слово, оно будет обрабатываться одним и тем же шаблоном. Это позволяет избежать дублирования кода. Кроме того, атомарные утверждения легко переопределять по отдельности, что открывает возможности для построения гибких библиотек.

  * **Предметно-ориентированный синтаксис**.
    Главные мотивы для выбора синтаксиса, не связанного с HTML, — компактность шаблонов (не нужно повторять каждый тег дважды) и возможность привязывать шаблоны непосредственно к БЭМ-сущностям, а не к тем или иным точкам в HTML.

  * **Базовый язык — JavaScript**.
    Выбор JavaScript в качестве базового языка несет с собой массу преимуществ: производительность, переносимость, активное развитие технологий, и — последнее, но очень важное — привычность для HTML-верстальщиков.


### Why not XSLT?
According to the classification mentioned above, BEMHTML fits to the same categories as XSLT. XSLT was being used a lot in Yandex. However BEM developers refused XSLT and developed their own templating engine because of the following reasons:
  * **Problems of Performance**.
    Implementation of transformations in XSLT has significant performance limitations. The solutions based on XSLT have significantly lower speed in comparison to the solutions based on other temolating engines.
  * **XSLT isn't being developed anymore**.
    In fact XSLT wasn't developing during the last few years. Despite the fact that in 2007 the specification XSLT 2.0 was published. Its implementation is still far from its serious usage in the real-world applications. In the absence of active development of XSLT one cannot expect performance improvements or extension of functionality.

  * **XSLT is not designed to work in BEM-terms**
    In order to maximize the integration of templating engine in a set of BEM tools, a native support of BEM data scope is needed at the level of the template engine.


### Почему не XSLT?
В приведенных выше классификациях шаблонизаторов BEMHTML попадает в те же категории, что и XSLT. В Яндексе давно и много использовали XSLT в верстке интерфейсов. Однако разработчики БЭМ отказались от использования XSLT и начали разработку собственного шаблонизатора по следующим причинам:

  * **Проблемы с производительностью**.
    Последовательная реализация модели преобразований, представленной в XSLT, существенно ограничивает его производительность. По скорости работы решения, построенные на XSLT-шаблонах, значительно проигрывают решениям с использованием других шаблонизаторов.

  * **XSLT не развивается**.
    Разработка XSLT фактически не ведется уже несколько лет. Несмотря на то, что в 2007 году опубликована спецификация XSLT 2.0, ее реализации пока далеки от серьезного использования в реальных задачах. В отсутствие активной разработки в части реализации XSLT не приходится ожидать расширения функциональности или повышения производительности.

  * **XSLT не ориентирован на работу в БЭМ-терминах**.
    Для максимальной интеграции шаблонного движка в набор инструментов БЭМ необходима нативная поддержка БЭМ предметной области на уровне шаблонизатора.


## How to Try?

## A Template of a Project

To start using BHTML you need to clone [a project template ](https://github.com/bem/project-stub).
It has already: a prepared structure for a project, the blocks library [bem-bl](https://github.com/bem/bem-bl), environment  customized for the building process and the result viewing, and very simple static page.

In fact, the template of this project is a startup for a HTML-coder. It can be extended with custom blocks, and any project can be based on it.

### Documentation

  * [Step-by-step BEMHTML guide](http://bem.info/articles/bemhtml-intro/)
  * [BEMHTML reference](http://ru.bem.info/articles/bemhtml-reference/)(Russian only)
  * [bem-tools reference](http://bem.info/tools/bem/)
  * [The blocks bem-bl library documentation](http://bem.github.com/bem-bl/index.en.html)

## Как попробовать

### Шаблон проекта

Чтобы начать использовать BEMHTML, достаточно склонировать [шаблон проекта](https://github.com/bem/project-stub).

Шаблон содержит подготовленную структуру проекта с подключенной библиотекой блоков [bem-bl](https://github.com/bem/bem-bl), настроенным окружением для сборки и просмотра результата и примером очень простой статической страницы.

Фактически шаблон проекта является готовым станком HTML-верстальщика. Его можно наполнять своими блоками и делать на его основе проекты любой сложности.

### Документация

  * [Вводное пошаговое руководство по BEMHTML](http://ru.bem.info/articles/bemhtml-intro/)
  * [Справочное руководство по BEMHTML](http://ru.bem.info/articles/bemhtml-reference/)
  * [Руководство по bem-tools](http://ru.bem.info/tools/bem/)
  * [Документация библиотеки блоков bem-bl](http://bem.github.com/bem-bl/index.en.html)

