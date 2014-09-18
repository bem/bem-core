# JS syntax of BEMHTML. Migration Guide

<a name="intro"></a>
## Introduction

This article is dedicated to web developers who use [BEM methodology](http://bem.info/method/) and [BEMHTML template engine](http://bem.info/libs/bem-core/current/bemhtml/reference/).

The article describes:

* [compatibility](#compat) of BEMHTML templates written in a different syntax;
* [template runtime environment](#runmode) settings;
* [BEMHTML templates processing](#run) flow;
* Standard operations of BEMHTML template engine implementation using [JavaScript syntax](#syntax);
* templates [transform algorithm](#steps): from concise syntax to JS.

It doesn't contain any information about setting development environment or template compilation procedure, BEHTML template engine features, or BEMJSON input data format.


<a name="general"></a>
## General information

Starting from [bem-core](http://bem.info/libs/bem-core/current/) library version 1.0.0 you can apply BEMHTML templates written in JavaScript syntax.

Since `bem-core` library introduction template concise syntax is considered deprecated, our `bem-core` library supports two template syntax types: **concise** and JS syntax.

JavaScript syntax of BEMHTML templates has the following advantages:

* development environments and tools support (because you code in JavaScript);
  * code highlight;
  * JSHint, JSLint, and so on;
* fast [compilation](#run), especially in dev runtime environment;
* besides, template code runs directly in [dev runtime environment](#runmode) which makes debugging simplier.

All major features of BEMHTML template engine are still relevant if using JS syntax.


***


<a name="install"></a>
## Getting started

BEMHTML templates that use JS syntax could be applied to all BEM platform components that use `bem-core` library.

To migrate to JS syntax you can:

* use project-stub version that uses bem-core library ([bem-core](https://github.com/bem/project-stub/tree/bem-core) branch).

* install all required packages: [bem-xjst](http://bem.info/tools/templating-engines/bemxjst/), [bemhtml-compat](https://github.com/bem/bemhtml-compat), [BEMHTML API v2](https://github.com/bem/bem-core/blob/v2/.bem/techs/bemhtml.js) module from bem-tools package.

We implement BEMHTML technology module with JS syntax support using `API v2` technology from bem-tools. To be able to use it install bem-tools package version 0.6.4 or higher.


***


<a name="compat"></a>
## Compatibility of templates

Within the same project you can use different BEMHTML templates written in different syntax.

While proceeding our template engine converts concise syntax templates into JS syntax. Syntax conversion is performed by [bemhtml-compat](https://github.com/bem/bemhtml-compat) module. For more information read [template applying](#run).

Template's syntax is automatically detected by a template engine on compile time.

To make it easier to distinguish template files with different syntax you can use different suffixes:

* for consise syntax - `.bemhtml`;
* for JS syntax - `.bemhtml.xjst`.

**Important:** template file cannot be implemented in two different syntax types at the same time.


***


<a name="syntax"></a>
## JavaScript syntax of BEMHTML templates

To simplify creation of BEMHTML templates in JavaScript syntax we use [bem-xjst](http://bem.info/tools/templating-engines/bemxjst/) module.

BEM-XJST is a BEM-oriented helpers' kit which extends standard XJST syntax.

It allows JS syntax BEMHTML templates to use:

* helpers for writing subpredicates related to BEM subject domain;
* helpers for a subpredicate detection based on a mode;
* helpers for XJST constructions `apply` and `applyNext` using default mode;
* `applyCtx` construction.

BEMXJST is a superset of [XJST template language](http://bem.info/tools/templating-engines/xjst/) which in turn is Javascript superset.

BEM-XJST uses canonical XJST syntax extended by rules related to BEM subject domain. This kind of implementation allows BEMHTML templates with JS syntax to act in dev environment without preliminarily compilation.

**NB:** `apply` and `applyNext` methods behaviour is extended in BEM-XJST compared to XJST. Methods can take a string literal of a statement that can be cast to a string instead of assignment statements. It means “set string as a mode”.

For example `apply('content')` can be written as `apply({ _mode: 'content' })`.


***


<a name="template"></a>

#### Template

Template consists of two parts - `predicate` and `body`.
Every predicate is a list of one or more subpredicates (conditions).

Template's predicate is true only when all the subpredicates are true.

In acronym syntax predicate and body are divided by a colon, subpredicates are divided by commas.

```
subpredicate1, subpredicate2, subpredicate3: body
```

Use `match` keyword to describe a template in JS syntax.

`match` keyword is a helper method which have a subpredicate list as an argument. Method returns function which takes a template body as an argument.

```js
match(subpredicate1, subpredicate2, subpredicate3)(body);
```

For example:

```js
match(this.block === 'link', this._mode === 'tag', this.ctx.url)('a');
```

The same subpredicate list can be chained:

```js
match(this.block === 'link').match(this._mode === 'tag').match(this.ctx.url)('a');
```

The examples above are identical and will look like this in acronym-syntax:

```js
block link, tag, this.ctx.url: 'a'
```

----
**NB:** if there is more than one template defined for a context, the one listed the last in BEMHTML file will have a higher priority.
Specific templates should be defined after those more general ones.


***


<a name="subpredicate"></a>

#### Subpredicates

Template's predicate is a condition list describing template application moment. Template's subpredicate is a simple condition.

BEMHTML has the following condition types:

* input BEM-tree match;
* mode;
* arbitrary condition.

##### Input BEM-tree match

Input BEM-TREE match conditions allow you to describe a template applicability using BEM related entities: blocks' and elements' names, modifiers' names and values.

The following keywords are used in predicates for BEM entities:

BEM entity – **Block**.
***

Keyword – `block`.

Arguments:
* block name

Acronym-syntax example:
`block b-menu` or `block 'b-menu'` or `block 'b' + '-menu'`

JS syntax example:
`block('b-menu')` or `block('b' + '-menu')`


***

BEM entity – **Element**.
***

Keyword - `elem`.

Arguments:
* element name

Concise syntax example:

```
block b-menu, elem item
```

JS syntax example:

```js
block('b-menu').elem('item')
```

***

BEM entity – **Block modifier**.

Keyword - `mod`.

Arguments:
* block modifier name
* block modifier value

Concise syntax example:

```
block b-head-logo, mod size big
```

JS syntax example:


```js
block('b-head-logo').mod('size', 'big')
```

***

BEM entity – element modifier

Keyword - `elemMod`

Arguments
* element modifier name
* element modifier value

Concise syntax example:

```
block b-head-logo, elem text, elemMod size big
```

JS syntax example:

```js
block('b-head-logo')(elem('text').elemMod('size', 'big'))
```

***


**NB:** identifiers for blocks, elements and modifiers build a string consisting of latin letters and hyphen. Any JS statement can be used as an identifier which will be cast to a string. For example `block('b-head-logo')` is the same as `block('b-' + 'head' + '-logo')`.

JS syntax keywords related to BEM subject domain are used for reduced subpredicate definition.
In particular they allow to omit `match` keyword for BEM subpredicates.

The following predicates are equal:

```js
match(this.block === 'foo').match(this.elem === 'bar')
```

```js
block('foo').elem('bar')
```

To run templates without compilation an `elemMatch` keyword was added. It is used for arbitrary element subpredicate notation:

```js
block('my-block')
    .elemMatch(function() { return this.elem === 'e1' || this.elem === 'e2'  })
        .tag()('span')
```

While the processing templates without subpredicates that describe elements have a `!this.elem` subpredicate automatically added to them. It allows to avoid block template to be applied to the elements of the same block.

As you can see the example above will not work without `elemMatch`:

```js
block('my-block')
    .match(function() { return this.elem === 'e1' || this.elem === 'e2'  })
        .tag()('span')
```

During the processing `!this.elem` subpredicate will be added to it.


***


<a name="moda"></a>
##### The mode

The name of one of the [standard mode](http://bem.info/technology/bemhtml/current/reference/#standardmoda) can be used as a subpredicate. It means that the predicate will be true when a corresponding mode is set.

The following keywords are used for standard mode validation:

* `def`
* `tag`
* `attrs`
* `bem`
* `mix`
* `cls`
* `js`
* `jsAttr`
* `content`

To define a subpredicate using one of the standard modes in JS syntax you can use a helper corresponding to keyword.

For example ``tag()('span')`` is the same as ``match(this._mode === 'tag')('span')``

When using concise syntax, any subpredicate consisting only from identifier (`[a-zA-Z0-9-]+`) is interpreted as a non-standard mode's name.
For example, subpredicate `my-mode` is equal to ``this._mode === 'my-mode'``.

To define a subpredicate using a non-standard mode in JS syntax we use `mode` keyword. It is a helper method similar to `match` construction. It takes a string as an argument and returns a function for template's body.
Considering all this `mode('my-mode')` is the same as ``this._mode === 'my-mode'``.


***


##### Arbitrary conditions
<a name="arbitrary_condition"></a>

Arbitrary conditions take into account not related to BEM data matches.
Any JavaScript statement can be used as an arbitrary condition. It will be cast to boolean value.

***
**NB:** it is preferable to write down an arbitrary conditions using a canonical XJST form:

```js
predicate statement === value
```

where:

* `predicate statement` – any JavaScript statement, cast to boolean value;
* `value` – any JavaScript statement.

To write down any predicate statement in JS syntax use `match` keyword. For example:

```js
match(this.ctx.url)(
        tag()('a'), // Passes a string with a tag 'a' as an argument to a "tag" mode.
        attrs()({ href: this.ctx.url }) // Passes a hash with attributes as an argument to an "attrs" mode
    )`
```

Arbitrary subpredicate `this.ctx.url` will be true when an `url` field in a context will have a value assigned. In this case template's body will be applied.


***


<a name="body"></a>
#### Template's body

Template's body is an expression which result is used to generate an HTML output.
All of the following can be a template's body:

* JavaScript statement:
    * concise syntax:

```
predicate: JS statement
```

    * JS syntax:

```js
match(predicate)(JS statement)
```

* Block of a JavaScript code:
    * concise syntax:

```
predicate: { JS code }
```

    * JS syntax:

```js
match(predicate)(function() { JS code })
```

In JS syntax template's body is passed as an argument to a function which was returned by a `match` method and by helpers for BEM entity or mode.

Syntax:

```
standard-mode()(body)

mode('non-standard-mode')(body)

BEM-entity('entity-name')(body)

match(arbitrary predicate)(body)

**NB:** it is important to remember that we pass template's body to a function returned by helper method, not to a helper itself.

Wrong:

```js
block('b1').tag('span')
```

Correct:

```js
block('b1').tag()('span')
```

***


#### XJST expressions

For templates appliance in a modified contex an [XJST expressions](http://bem.info/technology/bemhtml/current/reference/#xjst) can be used in templates implemented using JS syntax.

They work similarly as if they were in templates implemented in concise syntax.

#### Templates' nesting

If there are few templates using the same subpredicates, they can be written down as a nested structure to reduce code duplication.

Curly braces are used to indicate nesting in a concise syntax. They begin after predicate's common part. Inside there is a block of code that contains different predicates parts and corresponding template bodies.

```
subpredicate1 {
  subpredicate2: body1
  subpredicate3: body2
}
```

This expression is equal to:

```
subpredicate 1, subpredicate 2: body1
subpredicate 1, subpredicate 3: body2
```

In JS syntax nested subpredicates are written in a template's body. In other words subpredicates are passed as arguments to a function returned by a `match` method and helpers of BEM entities and modes.

For example, template in a concise syntax:

```js
this.block === 'link' {
    this._mode === 'tag': 'a'
    this._mode === 'attrs': { href: this.ctx.url }
}
```

could be written as:

```js
match(this.block === 'link')(
   match(this._mode === 'tag')('a'),
   match(this._mode === 'attrs')({ href: this.ctx.url })
)
```
It is equal to the following expression:

```js
match(this.block === 'link').match(this._mode === 'tag')('a');
match(this.block === 'link').match(this._mode === 'attrs')({ href: this.ctx.url });
```


***

To simplify the expression you can use helpers for BEM entities and standard modes names.

Previous example can be written as:

```js
block('link')(
    tag()('a'),
    attrs()({ href: this.ctx.url })
)
```


***

BEMHTML template could contain a template body and subtemplates at the same nesting level.

In a concise syntax for this feature we use `true` keyword:

```
block link, tag, this.ctx.url {
    true: 'a'
    mods not-link yes: 'span'
}
```

Using JS syntax a template's body is provided to a function as the first argument. All subtemplates could be provided after it.

```js
block('link').tag().match(this.ctx.url)(
    'a',
    mod('not-link', 'yes')('span')
)
```

***

Template's nesting depth is not limited:

```js
block('link')(
    tag()('span'),
    match(this.ctx.url)(
        tag()('a'),
        attrs()({ href: this.ctx.url })
    )
)
```

**NB:** we do not recommend to use ternary operators or JavaScript conditional operators to write nested templates. This kind of expressions will not be optimized in production runtime environment.


<a name="runmode"></a>
## Template runtime environment

BEMHTML template engine can work in two different modes depending on the **runtime environment settings**. The engine itself supports two runtime environments:

* development environment (dev-environment);
* production environment.

The main difference is that in a production environment XJST translation of a template applies and returns an optimized JavaScript as a result. It increases project build time because of templates compilation, but makes it work faster at runtime.

Runtime environment is chosen by a template engine depending on a `process.env.BEMHTML_ENV` environment variable value. When value is set to `development` it uses a development environment leaving a production environment to all other cases.

The choice of a runtime environment affects a template applying flow regardless of a concise syntax or a JS syntax implementation.


<a name="run"></a>
## BEMHTML templates processing

Template engine processes BEMHTML templates in two stages:

* compilation;
* applying.


<a name="runpre"></a>
### Templates' compilation

Templates are compiled differently depending on runtime environment settings and template syntax.


<a name="runclassic"></a>
#### Concise syntax

Despite of a runtime environment settings the following steps are performed:

* all BEMHTML templates within a build are stored in a bundle file;
* templates in a bundle file are converted to XJST syntax.


<a name="runjs"></a>
#### JavaScript syntax

Despite of a runtime environment settings the following steps are performed:

* all BEMHTML templates within a build are stored in a bundle file.

**In a production development environment** for concise and JS syntax XJST translation is performed and resulted in an optimized template JavaScript code generation.


<a name="runmain"></a>
### Application of templates

Once a template compilation is over we receive a JavaScript code and apply it the same way to all syntax and settings variation:

* template engine takes a BEM-tree as an input data in [BEMJSON](http://bem.info/technology/bemhtml/current/reference/#bemjson) format;
* sequentially go through nodes of an input BEM-tree;
    * data structure called [context](http://bem.info/technology/bemhtml/current/reference/#context) is built during BEMJSON tree processing;
* HTML output is generated in cycle for every BEM-entity;
    * HTML output is recursively generated for every nested BEM entity;
    * writing to HTML result fragments buffer is performed element by element.


***


<a name="table"></a>
### Standard operations of a template engine in different syntax


| Operation | Concise syntax | JS syntax |
| ------------- |-------------|------------- |-------------|------------- |-------------|
| BEM entity match | `block b-my-block : body` | `block('b-my-block')(body)` |
| Standard mode match | `tag : 'a'`  | `tag()('a')` |
| Non-standard modifier match |  `custom-mode : body` | `mode('custom-mode')(body)`  |
| Arbitrary condition match | `block link, this.ctx.url, tag: 'a'` | `block('link').match(this.ctx.url).tag()('a')`  |


<a name="steps"></a>
### An algorithm to convert concise syntax to JS syntax

Templates implemented in a concise syntax can be converted to a JS syntax with the following simple transformation.


<a name="steps-table"></a>
#### Step-by-step template convertion
Template conversion algorithm can be described briefly as a table below.

| Step number   | Stage       | Description  | Conversion pattern |
| ------------- |-------------|------------- |-------------|------------- |-------------|
|  1  | BEM-oriented subpredicates conversion | Surround the BEM entities names with a single quotation marks | `b1` → `'b1'` |
|  2 |  | Replace a BEM entities abbreviations with helpers | `block 'b1'` → `block('b1')` |
|  3 |  | Replace all commas separating subpredicates with dots | `,`  → `.` |
|  4 | Arbitrary subpredicates conversion | Wrap an arbitrary subpredicate in `match` helper | `arbitrary-subpredicate` -> `match(arbitrary-subpredicate)` |
|  5 | Modes' subpredicate conversion | Replace standard modes names with helpers | `tag` → `tag()` |
|  6 |  | Wrap remaining subpredicates in a `mode` helper and add apostrophes | `some-mode` → `mode('some-mode')` |
|  7 | Template body and nested expressions conversion | Wrap a template's body in a parentheses and remove preceding colon | ` : ...`  →  `(...)` |
|  8 |  | Divide nested templates by commas | `block('b1'){ tag()('a') elem('e1').tag('b') }` → `block('b1'){ tag()('a'), elem('e1').tag('b') }` |
|  9 |  | Replace nesting curly braces with parentheses | `block('b1'){ tag()('a'), elem('e1').tag('b') }` → `block('b1')(tag()('a'), elem('e1').tag('b'))` |


<a name="steps-examples"></a>
#### Template convertion example

**Template 1.** Sets an `img` tag for the `logo` block.

Concise syntax:

```
block logo {
  tag: 'img'
}
```


JS syntax:

```js
block('logo').tag()('img')
```

***


**Template 2.** Sets an `img` tag and corresponding attribute set for `logo` block.

Concise syntax:

```
block logo {
  tag: 'img'
  attrs: ({alt: 'logo', href: 'http://...'})
}
```


JS syntax:

```js
block('logo')(
  tag()('img'),
  attrs()({alt: 'logo', href: 'http://...'})
)
```

***


**Template 3.** Sets an `html` tag for a `b-page` block and forbids class generation with the BEM entities name.

Concise syntax:

```
block b-page {
  tag: 'html'
  bem: false
}
```

JS syntax:

```js
block('b-page')(
  tag()('html'),
  bem()(false)
)
```

***


**Template 4.** Sets a tag for a `b-text` block elements which was defined in an input BEMJSON. If there is an `id` field defined for an element in an input data, it sets an `id` attribute as it's value.

Concise syntax:

```
block b-text {

    this.elem, tag: this.ctx.elem

    this.elem, this.ctx.id, attrs: { id: this.ctx.id  }

}
```


JS syntax:

```js
block('b-text')(

    elemMatch(this.elem).tag()(this.ctx.elem),

    elemMatch(this.elem).match(this.ctx.id).attrs()({ id: this.ctx.id  })

)
```


***


**Template 5.** Sets a `span` tag for a `b-bla` block. If there is a `o-mode` modifier set to `v2` in an input data, changes tag to an `a`. After that the `m2` element modifier with `v2` value is added to the block, indicating that the block contains JavaScript.

Concise syntax:

```
block b-bla {
  tag:'span'
  mod 0-mode v2, tag:'a'
  mix: [ { elemMods: { m2: 'v2' }} ]
  js: true
}
```


JS syntax:

```js
block('b-bla')(
  tag()('span'),
  mod('0-mode', 'v2').tag()('a'),
  mix()([{ mods: { m2: 'v2' } }]),
  js()(true)
)
```

***


**Template 6.** Wraps `b-inner` block in `b-wrapper` block. Input BEMJSON fragment in a `default` mode is substituted by `b-wrapper` block containing the original input data.

Concise syntax:

```
block b-inner, default: applyCtx({ block: 'b-wrapper', content: this.ctx })
```


JS syntax:


While using a fragment of input BEMJSON `this.ctx` with an `applyCtx` structure in dev-environment, endless cycle may occur. To avoid it, you need to add a flag, indicating that the template was already processed, and subpredicate to check flag's value:

```js
block('b-inner')(def()
    .match(!this.ctx._wrapped)(function() {
            var ctx = this.ctx;
            ctx._wrapped=true;
            applyCtx({ block: 'b-wrapper', content: ctx })
   })
)
```


To avoid declaring a local variable, XJST expression `local` can be used to add the flag preventing endless cycle. It allows to apply template to a modified context:

```js
block('b-inner')(def()
    .match(!this.ctx._wrapped)(function() {
            local({ 'ctx._wrapped': true })(applyCtx({ block: 'b-wrapper', content: this.ctx }))
   }))
```

***


**Template 7.** Sets the `span` tag by default for the element `e1` of a `b-bla` block. If there is an `url` field defined in an input data, changes the tag to `a` sets the field content as a `href` attribute value.
In case of a match with a non-standard mode `reset`, a `href` attribute value is set to `undefined`.

Concise syntax:

```
block b-link, elem e1 {
  tag: 'span'
  this.ctx.url {
     tag: 'a'
     attrs: { href: this.ctx.url }
     reset {
         attrs: { href: undefined }
      }
   }
}
```


JS syntax:

```js
block('b-link').elem('e1') (
  tag()('span'),
  match(this.ctx.url)(
     tag()('a'),
     attrs()({ href: this.ctx.url }),
     mode('reset')(
         attrs()({ href: undefined })
      )
   )
)
```

***
