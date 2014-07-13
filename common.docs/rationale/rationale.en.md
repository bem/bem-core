# BEMHTML: a templating tngine for BEM

**BEMHTML** is a templating engine for thous who are using [BEM metodology](http://bem.info/method)
for web development.

BEMHTML is:
 * an HTML layout in terms of blocks, elements and modifiers;
 * support of BEM-style CSS;
 * support of BEM-style JS;
 * declarative and impressive templates;
 * convenient code support for long-term developing projects.


## BEMHTML: the World-View <a name="worldview"></a>

BEM methodology and BMHTML, as it's part, are the product of many-ears experience of
web development and maintenance of web interfaces at Yandex. Web development at Yandex were
affected by the following factors:
 * the need of creating a common portal style;
 * the need for long-term maintainable code;
 * the need of quick changes in the projects;
 * joint work on the code of different specialists.


BEM was created as a solution for all these problems. At the first place it's a set
of web development principles (a world-view), and only at second it's a technology.

BEMHTML is one of technologies that helps to carry development according to BEM principles.
Hence the problems, that BEMHTML is solving, are imposed by the same principles as for BEM.

### HTML+CSS is an assembler for web
After this principle stands a conviction that HTML and CSS are not suitable for
a semantic description of web interfaces (as a framework). The reason is in the difference
of interpretation of HTML and CSS for different browsers. As the result, one needs
to include into HTML and CSS specific elements for providing a cross-browser compatibility. For example,
in the recent past, for making a cross-browser rounded corners one needed to wrap an element in six nested `div`.

Web interfaces should be described in hight-level terms (as header, button, menu, etc.).
That allows us to separate **semantics** and **implementation**. Such contrast helps
to divide the labor of those who design the structure of the interface (design, usability,
connection with the back-end), and those who are aware of the subtleties of HTML coding
(cross-browser compatibility, support for IE, etc.).

The conversion (translation) of high-level interface terms in the low-level command language of
the browser (HTML + CSS) reminds a compilation *assembler for the web*.

** The task for a templating engine: separate the logic of interface realization and HTML-representation. **

   * Templates and the organization of interface (a set of element and layout for the page)
   should be described separately.
     BEM structure of interface is described by **BEM-tree**. It's a hierarchical structure of blocks, elements and modifiers.
   * Templates define only the rules of HTML-decoration for the certain parts of
   the interface.
     According to BEM methodology, for each part of interface there is a corresponding
     ***BEM entity* (block or element with modifiers).

### Say 'No' to 'Copy-Paste' of code

This principle is not unique for the web developing, and it's unlikely to cause objections. However
technological features of many templating engines are often forcing to code duplication. This problem
arises when the same interface element (for example a button) is being used many times. The code for
the button has to be repeated on every page for every its usage. If the button changes, the developer
will have to update templates of every page where the button appears. Even if the templating engine
allows us to put the code for the button into the global function, in every page the button code needs
to be replaced by the function call.

**A templating engine should provide the ability of creation of flexible libraries of templates**
Flexibility for a library means the following,
 for the project's developer it's:
  * ability to use any template as a bock for the page building;
  * ability to modify easily any template in the project without making
  any changes in the library source code;
 for the library developer:
  * there should be no need of pre-design of special parts that can be overridden in the future.

### BEM

BEMHTML is an expansion of BEM methodology to HTML. BEM gives an opportunity to designer,
interface developer, JavaScript-coder to speak one language (in the same terms,
these terms are Blocks, Elements, Modifiers). BEMHTML allows HTML coders to join them.

** The task: tools for HTML-development in terms of BEM.**

 * There should be a template for each BEM entity (block, element or modifier).
 * CSS integration within BEM style (BEM classes should be generated automatically for all blocks, elements and modifiers).
 * JS integration within BEM style (JS parameters should be generated automatically for blocks, elements and modifiers).

## Capability of BEMHTML

### Web-page in terms of BEM (Blocks, Elements, Modifiers)

 - Page structure is described in BEMJSON format, it's a JavaScript representation of the BEM-tree;
 - The templating engine converts the BEM-tree into a HTML code;
 - CSS integration within the BEM style
 - JS integration within the BEM style

#### Examples
The templating engine receives the following data:

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

There is no need in a template (the data is handled by default templates).

The resulting HTML:

```xml
<div class="widgets">
  <div class="widgets__weather">4</div>
</div>
```

If the `weather` block has a JavaScript realization with usage of `i-bem.js` one needs
to use the following template for passing JavaScript parameters into the block:

```js
block weather, js: { id: Math.random() * 1e4 }
```

The resulting HTML:

```xml
<div class="widgets i-bem" onclick="return { 'weather': { 'id': 4321 } }">
  <div class="widgets__weather">4</div>
</div>
```

### Syntax for data and templates description is based on JavaScript.
 - Declarative templates: the template consists of condition for usage (predicate)
 and data structure, that describes the resulting HTML (the template's body).
 - JavaScript syntax is extend with a key-words (`block`, `elem`, `mods`, `elemMods`)
 for working with BEM entities.
 - For the templates an arbitrary JavaScript code can be used. There is no technical
 limitations placed by BEMHTML on operations in predicates or template. An efficiency
 and consistency of templates' work is provided by developers' agreements.
 - All BEMHTML templates are compiled in JavaScript, therefore it can be executed at
 the server side as well, as at the client side.


#### Examples
Definition of HTML tags in a declarative style:

```js
block widgets {
  tag: 'ul'
  elem weather, tag: 'li'
}
```

The resulting HTML:

```xml
<ul class="widgets">
  <li class="widgets__weather">4</li>
</ul>
```

Arbitrary calculations performed in the template's body:

```js
block widgets, elem weather, content: {
  var oldContent = applyNext()
  return oldContent > 0 ? '+' : '' + oldContent + ' °C'
}
```

The resulting HTML:

```xml
<ul class="widgets">
  <li class="widgets__weather">+4 °C</li>
</ul>
```


### Flexibility and extendability
 - BEMHTML allows us to separate a layout into an **independent blocks**, that can
 be combined among themselves without any restrictions.
 - ***Definition Levels* allow us to collect templates into libraries, and then
 can be used in other projects.

#### Examples
The input-data:

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

```js
block header, tag: 'h1'
block header, mod level 2, tag: 'h2'
```

Templates defined in the project:

```js
block header, tag: 'h2'
block header, mod level 2, tag: 'h3'
```

The result:

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

### Multi-time implementation
 - During runtime BEMHTML can generate additional elements, that are needed for solving
 layout problems (different kinds of wrappings). The initial data (BEM-tree) can
 be modified during the templates' implementation. Moreover, the same templates can
 be applied again to modified data. Therefore all layout's wrappings can be implemented
 without messing-up the input data with extra elements.

#### Examples
The input data is a name of Yandex user:

```js
{
  block: 'ya-user',
  content: 'Hamster'
}
```

The template selects the first letter of the name and wraps it into instantly generated element:

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

```xml
<div class="ya-user"><div class="ya-user__first-letter">H</div>amster</div>
```

## BEMHTML and other temlating engines <a name="andothers"></a>

There are hundreds of different kinds of template engines. Among all of them several
fields of application (generation of HTML and other text formats) and a few different
approaches for text generation from data by using a template can be distinguished.

By its approaches BEMHTML can be classified as "exotic". Let's take a look at several
classification principles of templating engines and the place of BEMHTML among them.

### Classification by semantics (What does the templating engine)
#### Strings' interpolation

The templating engine places a corresponding to needed data string into the text of template.
In addition different conditions, variables and loops can be used. It's the largest class of
templating engines.

```%username%, don't worry, be happy!```

Templaing engines of this kind: [Mustache](http://mustache.github.com),
[Handlebars](http://handlebarsjs.com), [Jade](https://github.com/visionmedia/jade),
[DustJS](http://linkedin.github.com/dustjs/), etc.

#### Data bind

A templating engine associates data with HTML by using some rules. The rules are
described separately form the HTML.

```js
var html ="<span class="name"/> "+ "don't worry, be happy!"
, data = { username: 'John Smith' }
, map = plates.Map();

map.class('name').to('username');
plates.bind(html, data, map);
```

Exaples: [Transparency](https://github.com/leonidas/transparency),
[Flatiron.js](http://flatironjs.org/#templating), [Angular.js](http://angularjs.org),
[Pure](http://beebole.com/pure/) and many others.

**Live data bind**: the connection with a changing data can also be declared. An example
of such templating engine is [Knockout.js](http://knockoutjs.com).


#### Data Driven

A templating engine connects a data key-word with a fragment of input HTML. In this case
at the begging we have the data structure, and later with help of templates it's converted
into HTML. In the approaches mentioned above, a page is built form a template, that is
filled up with some data.

For example the XSLT template below doesn't place any restrictions on the data structure,
it can include key-worlds:

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

Or:

```xml
<ul>
  <li><username>Veni</username>,</li>
  <li><username>Vidi</username>,</li>
  <li><username>Vici</username></li>
</ul>
```

Examples: [XSLT](http://www.w3.org/TR/xslt), **BEMHTML**.

### Classification by semantics
#### The final version of the text with special insertions

This model is correlated with Strings' Interpolation approach. A template looks very
similar to the final HTML:

```xml
<span class="name">[% username %]</span>
```

There is no need of learning a special syntax, and very often it's mentioned as an
advantage of this approach.

Examples:  [Mustache](http://mustache.github.com), [Handlebars](http://handlebarsjs.com),
[DustJS](http://linkedin.github.com/dustjs/) and many others.

#### Short HTML Notation

HTML language has a peculiar syntactic redundancy. Almost all tags have to be in pairs
(one opening and one closing tag). For example if we want to declare 'there is a table',
we need to mention `table` two times: in the opening tag and in the closing tag.
To simplify code writing and make it more readable, some developers suggest to use the
short notation for HTML. For example:

```
span.name #{username}
```

Example:

#### The object-oriented syntax

In this approach the rules for the HTML generation are described in a template, according
to the data scope of the templating engine.

```js
var html = "<span class="name"/> "+ "don't worry, be happy!"
, data = { username: 'John Smith' }
, map = plates.Map();

map.class('name').to('username');
plates.bind(html, data, map);
```

Examples: [XSLT](http://www.w3.org/TR/xslt), [Flatiron.js](http://flatironjs.org/#templating), **BEMHTML**.

### Classification by the base language
#### One basic language
The templating engine accepts only the certain programming language, and all control
structures of the templates are written in this language.

Examples: [XSLT — XML](http://www.w3.org/TR/xslt), [ECO — CoffeeScript](https://github.com/sstephenson/eco),
**BEMHTML — JavaScript**.

#### Compiling in a few different languages

In the templating engine its own data scope is created. It's simple enough to allow
compilation of control structures into a wide range of programming languages.

Examples: [TT2](http://www.template-toolkit.org/), [Mustache](http://mustache.github.com).

### Why BEMHTML was build this way
 * **Data driven**.
   Templates are bounded to the data elements. Therefore it's possible to create templates
   as a **declarative** and **atomic** (independent and  self-sufficient) statements, which
   connects an element with its representation in HTML. For example the *tag* of
   the *block "header" - `table`*. BEM-style CSS describes the style with atomic statements:
   the *color* of the *block "header" - red**.

   Such templates are similar to modules (in sense of the way they are built). Regardless
   to its location, the key-word will be handled by the same template. Hence there is no need
   of code duplication. Also the atomic statements is easy to redefine, therefore allows
   us to build flexible libraries.

 * **Subject-oriented syntax**.
   The main criteria for the syntax selection are: the small size of templates
   (without a need to repeat tags two times) and the ability to bound templates
   to BEM entities (but not to the HTML nodes).

 * **JavaScript is the basic language**
   JavaScript as a basic language gives many advantages: performance, portability,
   the active development of technologies, and the last but very important, it's familiar
   to HTML-coders.

### Why not XSLT?
According to the classification mentioned above, BEMHTML fits to the same categories
as XSLT. XSLT was being used a lot at Yandex. However BEM developers refused XSLT and developed
their own templating engine because of the following reasons:
  * **Problems of Performance**.
    Implementation of transformations in XSLT has significant performance limitations.
    The solutions based on XSLT have significantly lower speed in comparison to the solutions
    based on other temolating engines.

  * **XSLT isn't being developed anymore**.
    In fact XSLT wasn't developing during the last few years. Despite the fact that in 2007
    the specification XSLT 2.0 was published. Its implementation is still far from its serious
    usage in the real-world applications. In the absence of active development of XSLT one cannot
    expect performance improvements or extension of functionality.

  * **XSLT is not designed to work in BEM terms**
    In order to maximize the integration of templating engine in a set of bem-tools,
    a native support of BEM data scope is needed at the level of the template engine.

## How to try?

### A Template of a project

To start using BEHTML you need to clone [a project template ](https://github.com/bem/project-stub).
It has already: a prepared structure for a project, the blocks library [bem-bl](https://github.com/bem/bem-bl),
environment  customized for the building process and the result viewing, and very simple static page.

In fact, the template of this project is a startup for a HTML coder. It can be extended
with custom blocks, and any project can be based on it.

### Documentation

  * [Step-by-step BEMHTML guide](http://bem.info/articles/bemhtml-intro/)
  * [BEMHTML reference](http://bem.info/libs/bem-core/current/templating/reference/)
  * [bem-tools reference](http://bem.info/tools/bem/)
  * [The blocks bem-bl library documentation](http://bem.info/libs/bem-bl/)

