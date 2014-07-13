<a id="intro"></a>

### Introduction

**This document** is a BEMHTML reference book.

This document describes:

* the basic features of BEMHTML;
* a syntax of BEMJSON input data and BEMHTML templates;
* a input data processing sequence and HTML generation;
* the examples of typical problems solving by means of BEMHTML.

**The target audience of this document** is web-developers and HTML-coders who are using the [BEM-methodology](http://bem.info/method/).

We assume that reader is familiar with:

* HTML;
* JavaScript;
* CSS;
* BEM.

Setup of the development environment and templates compilation procedures **are not described in this document**.

<a name="bemhtml"></a>

### BEMHTML Features

<a id="bem_area"></a>

#### Binding to the BEM Subject Domain

The templating engine BEMHTML is one of the technological solutions, that are ensuring creation of web-interfaces according to the [BEM-methodology](http://bem.info/method/).

The BEMHTML input data is a BEM-tree in [BEMJSON](#bemjson) format, it describes the web-page.
The pattern language of BEMHTML provides a special structures for processing blocks, elements and modifiers.

<a id="decl_templatе"></a>

#### Declarative Templates

<a id="imperativ"></a>

##### Imperative Approach

Standard templating engines are using **imperative approach** for the templates: HTML is formed by consistent reading and applying of the templates.

<table>
<tr>
    <th>The Input Data</th>
    <th>Template</th>
    <th>The Result</th>
</tr>
<tr>
    <td>
        <pre><code>
{
  items: [
    { text: '1' },
    { text: '2' }
  ]
}
        </code></pre>
    </td>

    <td>
        <pre><code>
&lt;ul class="menu"&gt;
    [% foreach item in items %]
        &lt;li class="menu__item"&gt;
            [% item.text %]
        &lt;/li&gt;
    [% end %]
&lt;/ul&gt;
        </code></pre>
    </td>
    <td>
        <pre><code>
&lt;ul class="menu"&gt;
    &lt;li class="menu__item">1&lt;/li&gt;
    &lt;li class="menu__item">2&lt;/li&gt;
&lt;/ul&gt;
        </code></pre>
    </td>

</tr>
</table>

In such templates the redundancy caused by the syntactic requirements of the HTML(the opening
tag - generated content - the closing tag) is inevitable. The redundancy is even higher for tables, lists, etc.

<a id="declarativ"></a>


##### Declarative Approach

Declarative approach allows us to write templates in form of sets of descriptive statement with the following structure: *the input data type (BEM-entity) — HTML representation (tag, attribute, etc.)*.

<table>
    <tr>
        <th>The Input Data</th>
        <th>Template</th>
        <th>The Result</th>
    </tr>
    <tr>
        <td>
        <pre><code>
{
    block: 'menu',
    content: [
        { elem: 'item', content: '1' },
        { elem: 'item', content: '2' }
    ]
}
        </code></pre>
        </td>
        <td>
        <pre><code>
block('menu')(
    tag()('ul'),
    elemMatch('item').tag()('li')
)
        </code></pre>
        </td>
        <td>
        <pre><code>
&lt;ul class="menu"&gt;
    &lt;li class="menu__item"&gt;1&lt;/li&gt;
    &lt;li class="menu__item"&gt;2&lt;/li&gt;
&lt;/ul&gt;
        </code></pre>
        </td>
    </tr>
</table>

The generation procedure of an HTML-item is standardized in BEMHTML and performed by the templating engine. Such approach allows us to use the declarative templates. The same approach is used for the data transformation in XSLT and AWK.

<a id="descriptionlanguage"></a>

#### The Description Language — JavaScript

BEMHTML is a specialized language (DSL) which is **dilating** JavaScript.

More precisely, BEMHTML is a superset of [XJST](https://github.com/veged/xjst/) pattern language, which is a superset of JavaScript.

BEMHTML syntax provides a short notation for the correspondence between BEM-entities and generation of the HTML elements an attributes.
Besides that, **any** JavaScript constructions can be used in templates.

<a id="execution_language"></a>

#### Templates' Execution Language — JavaScript

BEMHTML is compiled before the execution into an optimized JavaScript, which receives BEMJSON data and returns HTML.

Such template can be executed at the server side as well at the client side.

<a id="restrictions"></a>

#### Restrictions

BEMHTML developers tried to create a tool with maximal flexibility, so BEMHTML is not provided with any technological limitations on the operations performed in the templates. In fact, everything that is possible in JavaScrip, is possible in BEMHTML-code.

All restrictions, which are ensuring the correctness and effectiveness of the performance, are implemented at the level of agreements on templates writing.
Such agreements are provided in this document as a guideline.
Therefore it's possible not to follow the conventions, however in this case it is necessary to weigh the advantages and disadvantages of the new solutions.

<a id="basic"></a>

### The Main Terms

<a id="inputdata"></a>

#### The Input Data: BEMJSON

Since BEMHTML is based on JavaScript, JSON with a set of supplemental agreements on BEM-entities (BEMJSON) is selected for the format of BEM-tree.

In order to maintain flexibility and maintainability, any complex transformations of input data shouldn't be performed at the level of a templating engine.
The templates should have a form of simplest possible statements that map each type of BEM-entity to HTML-representation.

For these reasons, structure of the BEM-tree should be view-oriented, so there won't be need to change the set of blocks, elements and their order during the process of HTML-tree generation.
BEM-tree should be transformed into a view-oriented format at the back-end level (before passing it to the templating engine).
A good example of view-oriented data format you can find in the section [Transformation of the input data into a view-oriented format](#bringing_input).

At the same time, the details of an HTML-page organization, which is the front-end developer's responsibility, should be determined only at the level of the templating engine.
**You can find an example of implementation of such solution in the chapter [Adding BEM-entities for solving layout problems](#additionbem).**


**See also**:

  * [BEMJSON syntax](#bemjson)

<a name="templatebemjson"></a>

#### The Template

The unit of BEMHTML program is a **template**. BEMHTML template associates an input BEM-entity (which is specified by the entity name, the element name and the value of modifier) with the corresponding HTML-element.

The template consists of the following parts:

  * the **predicate**, it is a set of conditions under which the template will be applied. A typical predicate describes the properties of the input BEM-entity;
  * the **body**, it contains the instructions for output HTML generation.

**See also**:

* [BEMHTML syntax](#bemhtml)

<a name="moda"></a>

#### The Mode

During runtime the templating engine successively reeds nodes of the input BEM-tree.
It runs a cycle of output HTML-element generation for each node (BEM-entity).
For nested entities the cycle of HTML-elements generation is run recursively.
Therefore the output HTML-tree is formed element by element during the processing of the input BEM-tree.

The generation cycle of each element sequentially passes through a series of phases which are called **modes**.
Each of these modes is responsible for a certain part of the generated HTML-element(the tag, attributes, class, etc).
The appropriate template is selected and executed for the each mode.

The modes allows us to divide an input element into the fragments.
For description of each fragment a simple data-type can be used: strings are used for tag and class, a dictionary is used for attributes, booleans are used to describe the need of HTML-classes, etc.

Thus it's possible to write the declarative templates with a mode specified in template's predicate, and the data (of simple type which is corresponded to the mode) contained in the template's body. In this case the full representation of an HTML-element can be defined with a several templates.

The **[default mode](#default)** has a special status. It's responsible for the entire generation of an HTML-element. This mode defines: the set and the order for processing the other modes corresponded to the fragments of an HTML-element, the procedure of final build of an HTML-element representations from the fragments generated in the other modes.

The template which redefines a behavior in a default mode gives us the total control on elements generation from BEMHTML.

**See also**:

* [The standard modes](#standardmoda)

<a name="context"></a>

#### The Context

During processing of the input BEMJSON-tree, the tempating engine builds **the context**. It's a data structure which is accessible during the time when templates are being applied. The context corresponds to the current element (node) of the input BEM-tree. It includes:

* normalized information about the current BEM-entity;
* a fragment of an original input data (a current BEMJSON-tree element and its descendants);
* a string buffer in which the resulting HTML is being written;
* service fields that contain information about the current state (mode, position in the input BEM-tree, etc.);
* the auxiliary functions.

BEM-entity, which is described by the current context, is called a **context entity**.

**See also**:

* [The context fields](#context_field)
* [Completing BEM-entities with help of the context](#extensionbem)

<a name="bemjson"></a>

### BEMJSON Syntax

<a id="datatype"></a>

#### The Data Type

Data types in BEMJSON are similar to the corresponding JavaScript types.

* Strings and numbers:
 * **String** `` 'a' `` `"a"`;
 * **Number** `1` `0.1`;

   A data structure, which consists of a string or number, is a valid BEMJSON.

* **Object** (an associative array) '{key: value}' and other types except an array.

* **Array**, it may contain elements of different type (strings, numbers, objects, arrays)
  `[ "a", 1, {key: value}, [ "b", 2, ... ] ]`.

<a id="fields_bemjson"></a>

#### BEMJSON Special Fields

To represent BEM and HTML subject domain data in BEMJSON, objects with special reserved field names are used.

<a name="notionbem"></a>

##### Representation of BEM-entities

BEM-entities are represented in BEMJSON as objects, which can have the following fields:

<table>
<tr>
    <th>Filed</th>
    <th>Value</th>
    <th>Value's Type</th>
    <th>Examplw</th>
</tr>
<tr>
    <td><code>block</code></td>
    <td>Block's name</td>
    <td>String</td>
    <td><code>{ block: 'b-menu' }</code></td>
</tr>

<tr>
    <td><code>elem</code></td>
    <td>Element's name</td>
    <td>String</td>
    <td><code>{ elem: 'item' }</code></td>
</tr>

<tr>
    <td><code>mods</code></td>
    <td>Block's modifiers</td>
    <td>An object that contains names and values of modifiers in form of a pairs key-value:
        <code>{the_name_of_modifier: 'the_value_of_modifier'}</code>
    </td>
    <td>
        <pre><code>
{
  block: 'b-link',
  mods: { pseudo: 'yes', color: 'green' }
}
        </code></pre>
    </td>
</tr>

<tr>
    <td><code>elemMods</code></td>
    <td>Element's modifiers</td>
    <td>An object that contains names and values of modifiers in form of pairs key-value:
        <code>{name_of_modifier: 'value_of_modifier'}</code>
    </td>
    </td>
    <td>
        <pre><code>
{
  elem: 'item',
  elemMods: { selected: 'yes' }
}
        </code></pre>
    </td>
</tr>

<tr>
    <td><code>mix</code></td>
    <td>Mixed blocks / elements</td>
    <td>An array of objects that describe mixed blocks and elements. An object is also acceptable, it will be interpreted as an array with a single element.</td>
    <td>
        <pre><code>
{
  block: 'b-link',
  mix: [ { block: 'b-serp-item', elem: 'link' } ]
}
        </code></pre>
    </td>
</tr>
</table>

**See also**:

* [Completing BEM-entities with help of the context](#extensionbem)

<a name="notionhtml"></a>

##### HTML Representation

BEMJSON provides ability to specify the certain aspects of the output HTML directly in the input data.
This capability shouldn't be abused. BEMJSON is a data level, so HTML layout should be build at the level of the templating engine (BEMHTML).
However, there are some situations where description of an HTML-representation at the BEMJSON level is warrantable.
In this case, the author of the BEMHTML templates should understand how the HTML parameters, specified in the input data, interact with an HTML-representation defined at the templates' level.

BEMJSON provides the following fields for the direct management of an HTML-representation:

<table>
<tr>
    <th>Field</th>
    <th>Value</th>
    <th>Value's type</th>
    <th>Example</th>
</tr>
<tr>
    <td><code>tag</code></td>
    <td>HTML-tag for the given entity</td>
    <td><code>String</code></td>
    <td>
        <pre><code>{
  block: 'b-my-block',
  tag: 'img'
}</code></pre>
    </td>
</tr>
<tr>
    <td><code>attrs</code></td>
    <td>HTML-attributes for the given entity</td>
    <td><code>Object</code></td>
    <td>
        <pre><code>{
  block: 'b-my-block',
  tag: 'img',
  attrs: { src: '//yandex.ru/favicon.ico', alt: '' }
}</code></pre>
    </td>
</tr>
<tr>
    <td><code>cls</code></td>
    <td>Line which will be added to the HTML-attribute<code>class</code> (besides the automatically generated classes)</td>
    <td><code>String</code></td>
    <td>
        <pre><code>{
  block: 'b-my-block',
  cls: 'some-blah-class'
}</code></pre>
    </td>
</tr>
<tr>
    <td><code>bem</code></td>
    <td>The flag for cancellation the generation of BEM-class attribute in the HTML- <code>class</code> for the given entity</td>
    <td><code>Boolean</code></td>
    <td>
        <pre><code>{
  block: 'b-page',
  tag: 'html',
  bem: false
}</code></pre>
    </td>
</tr>
<tr>
    <td><code>js</code></td>
    <td>Either the flag that indicates the presence of a client-side JavaScript in the entity, or JavaScript parameters.</td>
    <td><code>Boolean</code></td>
    <td>
        <pre><code>{
  block: 'b-form-input',
  mods: { autocomplete: 'yes' },
  js: {
    dataprovider: { url: 'http://suggest.yandex.ru/...' }
  }
}</code></pre>
    </td>
</tr>
</table>

Please note that names and meaning of the BEMJSON fields, that are managing an HTML-representation, are the same as the names and the meaning of the corresponding BEMHTML [standard modes](# standardmoda) (tag, attributes, class, etc.).
If some aspects of the output HTML are **defined in the input data, and in the BEMHTML-templates**, the higher priority have the definition given in the BEMHTML-templates.

When generating HTML one of the following actions will be done:

  * **Merge** of the values of the HTML-parameters specified in BEMJSON with values of the parameters specified in the BEMHTML-template. Merge of the values is performed only for the parameters that have an obvious meaning: `attrs`, `js`, `mix`.
  * **Replacement** of the values of the HTML-parameters specified in BEMJSON with the values set in the **BEMHTML-template**. It holds for the all other values: `tag`, `cls`, `bem`, `content`.

***
**NB** Priority of the BEMHTML-templates allows **the templates' author** to decide which HTML-parameters will have top-priority for each case (the parameters set in BEMHTML or in BEMJSON).
The values of the HTML-parameters specified in BEMJSON are available in the templates when addressing to a fragment of the input BEMJSON-tree in the context of (field `this.ctx`).
***

<a name="nesting"></a>

##### Nesting: Content

For representation of the nested BEM-entities (BEM-tree) BEMJSON has the reserved field `content`. Its value can be set to an arbitrary BEMJSON:

 * A primitive data type (a string, number). The value is used as a content (text) of the HTML-element corresponded to the context entity.
 * An object which describes the BEM-tree. The value is used for generation of the HTML-elements nested in the corresponding to the context entity HTML-element.

There is no limitations on nesting depth of the tree of BEM-entities build with help of the `content` field.

**See also**:

* [The content mode](#content)

<a id="custom_fields"></a>

##### Arbitrary Fields

In addition to the special fields, that describe a BEM-entity and its HTML-representation, the object may have any fields with an arbitrary data. This data will be available for use in the BEMHTML-templates.

An example of an arbitrary field is a field `url` in the reference block:

```js
{
  block: 'b-link',
  url: '//yandex.ru'
}
```

An example of use of an arbitrary data field can be found in section [Template selection based on the condition](#select_template).

<a name="customjs"></a>

#### Arbitrary JavaScript in BEMJSON

Format of BEMJSON has less restrictions than JSON. Arbitrary JavaScript-expressions are valid BEMJSON.

Particularity of BEMJSON format involves adherence to the agreements on objects' fields naming (for BEM-entities and HTML-representation), which were mentioned in the previous sections, and the rules of objects nesting.

<a name="bemhtml"></a>

###BEMHTML Syntax

This section describes all syntactic structures of BEMHTML.

<a name="template"></a>

#### Template

A template consists of two expressions: **predicate** and **body**.

Each **predicate** is a list of one or more **sub-predicates** (conditions).

The predicate evaluates to true if only all sub-predicates taek on the true value.
The order of sub-predicates doesn't matter, *there is no guarantee on the order in which sub-predicates will be checked*.

For a template definition a shorthand `match` is reserved.  The `match` is a method, which takes a list of the sub-predicates in the argument. It returns a function which takes a template body in the argument.


```js
match(subpredicate1, subpredicate2, subpredicate3)(body);
```

For example:

```js
match(this.block === 'link', this._mode === 'tag', this.ctx.url)('a');
```

This sub-predicate set can be writen with the chain:

```js
match(this.block === 'link').match(this._mode === 'tag').match(this.ctx.url)('a');
```


From the logic's point of view, a BMHTML program is a flat **list of templates**.
However, if multiple templates have **common sub-predicates**, they can be written as a nested structure in order to minimize the code repetition.


Nested sub-predicates and corresponding to them templates' bodies are paced inside a common sub-predicate body and separeted by a comma.
Nesting depth of the sub-predicates is not limited.


```js
match(subpredicate1)(
  match(subpredicate2)(body1),
  match(subpredicate3)(body2)
)
```

It's equivalent to:

```
match(subpredicate1).match(subpredicate2)(body1)
match(subpredicate1).match(subpredicate3)(body2)
```

----
**NB** If more than one template was defined for the given context, the **last** (in the listing order) template in a BEMHTML-file will be executed.
The specific templates should be listed after the more general ones.
***

**See also**:

* [Check of the predicates in a certain order](#check_predicate)

<a name="podpredicate"></a>

#### Sub-predicates

A template's predicate is a set of conditions that describes a  template apply.
A template's sub-predicate is an elementary condition.

BEMHTML provides the following types of conditions:

* Match of the input BEM-tree
* Mode
* Arbitrary condition


##### Match of the Input BEM-tree.


Conditions on match of the input BEM-tree allow us to describe the applicability of the templates in terms of the BEM-entities: blocks' and elements' names, names and values of modifiers.

For this purpose BEM-related keywords are used in the predicates. It allows us to avoid a `match` keyword usage for the BEM-related sub-predicates:


Folowing predicates are equivalent:

```js
match(this.block === 'foo').match(this.elem === 'bar')
```

```js
block('foo').elem('bar')
```

The next set of the keywords for BEM-entities is available:

<table>
<tr>
    <th>Keyword</th>
    <th>Arguments</th>
    <th>Value's Type</th>
    <th>Example</th>
</tr>
<tr>
    <td><code>block</code></td>
    <td>the block's name</td>
    <td>identifier <code>[a-zA-Z0-9-]+ </code> or arbitrary js-expression</td>
    <td><pre><code>block('b-menu'), block('b' + '-menu')</code></pre></td>
</tr>
<tr>
    <td><code>elem</code></td>
    <td>the element's name</td>
    <td>identifier <code>[a-zA-Z0-9-]+</code> or arbitrary js-expression</td>
    <td><pre><code>block('b-menu').elem('item')</code></pre></td>
</tr>
<tr>
    <td><code>mod</code></td>
    <td>the name and value of block's modifier</td>
    <td>identifier <code>[a-zA-Z0-9-]+ </code> or arbitrary js-expression</td>
    <td><pre><code>block('b-head-logo').mod('size', 'big')</code></pre></td>
</tr>
<tr>
   <td><code>elemMod</code></td>
   <td>the name and value of element's modifier</td>
   <td>identifier <code>[a-zA-Z0-9-]+ </code> or arbitrary js-expression</td>
   <td><pre><code>block('b-head-logo').elem('text').elemMod('size', 'big')</code></pre></td>
</tr>
</table>


A BEMHTML parser accepts any string that consists of Latin characters and the hyphen as an identifier.
Instead of an identifier any JavaScript-expression can be used, it will be converted into a string.

----
**NB** Don't be confused with the block's modifiers and the element's modifiers in the predicates.

 * `block input, mod theme black, elem hint` defines an element `hint` nested into the block `input` with **the block's modifier** `theme` and the modifier's value `black`.
 * `block input, elem hint, elemMod visibility visible` defines an element `hint` with **the element's modifier** `visibility` with value `visible`, the element is nested into the block `input`.
 * `block input, mod theme black, elem hint, elemMod visibility visible` defines an element `hint` with **the element's modifier** `visibility` set to the value `visible`, the element is nested into the block `input` which has **the block's modifier** `theme` set to the value `black`.

For blocks' and elements' modifiers the different keywords are used, therefore in predicates it's possible to combine conditions for modifiers of blocks and elements.

***
For the arbitrary element-related sub-predicates a keyword `elemMatch` is used. It alows executing templates without previous compilation:


```js
block('my-block')
    .elemMatch(function() { return this.elem === 'e1' || this.elem === 'e2'  })
        .tag()('span')
```


During processing, `!this.elem` sub-predicate is automatically added to the templates without any element-related predicates. It helps us to avoid a block's template triggering of the elements of the same block.


As a consequence, the example above will not work if we will use the construction `match` instead of `elemMatch`. Because of adding of a `!this.elem` sub-predicate durring a template processing.


<a name="moda2"></a>

##### Mode

The helper constructions, similar to the names of any [standard modes](#standardmoda) can be used as a predicate.
It mens that the given predicate will be evaluated to true when the corresponding mode is set.

For checking of the standard modes the next keywords are used:

* `def` (`default` mode)
* `tag`
* `bem`
* `mix`
* `cls`
* `js`
* `jsAttr`
* `attrs`
* `content`

A standart mode helper's notation is following:

```
keyword()(body)
```

For example:

```js
tag()('a')
```
or

```js
js()(true)
```

The `mode` keyword is used to check an arbitrary mode. It is a helper method that acts similar to the `match` construction.
The method takes in the argument a string-identifier (`[a-zA-Z0-9]+`) - the name of an arbitrary mode - and returns a function to which a templates' body shuold be passed in the  argument. Notice, that a keyword `mode('my-mode')` is a shorthand for the `match(this._mode = 'my-mode')` literal.


<a name="random_condition"></a>

##### Arbitrary Condition

The arbitrary conditions are taking into account of the matching with data that do not belong to the BEM subject domain.
Any JavaScript-expression, which can be evaluated to a boolean, can be used as an arbitrary condition.

***
**NB** It's preferable to write the arbitrary conditions in the <a name="xjst-canonical"></a> **canonical XJST form**:

```
predicate expression === value
```

Where
* `predicate expression` is an arbitrary JavaScript expression, which can be evaluated to a boolean;
* `value` is an arbitrary JavaScript expression.

At the same time, the number of **different** predicate expressions in sub-predicates should be minimized.
Abidance of this recommendations allows XJST compiler to perform optimization of templates' arbitrary conditions along with the standard conditions'(BEM-entities and modes) optimization.


For the arbitrary predicate literals a `match` keyword should be used:

```js
match(this.ctx.url)( //an aribtrary conditin. Check if there url field is in input data.
        tag()('a'),
        attrs()({ href: this.ctx.url })
    )
```
The arbitrary sub-predicate `this.ctx.url` evaluates to true if the `url` field is set in the input data. In this case a template body will be executed.
***

<a name="body"></a>

#### The Body

A template's body is an expression, the result of its evaluation is used for output HTML generation.
For a template's body can be used:

* a JavaScript-expression:

```js
match(predicate)(JS-expression)
```

* A block of JavaScript code:

```js
match(predicate)(function() { JS-code })
```

* Object literal (hash):

```
match(predicate)({name: value})
```


***
**NB** Necessity to wrap a block of JS-code into an anonymous function is determined by the templates execution in development environment. This is the best practice. It alows us to avoid the errors while accessing the context fields, which cannot yet be determined at the time of a template execution.

If the JavaScript-code block is a simple constant literal, there is no need to an anonymous function.
***


A template body should be passed in the argument of a function, returned by:
* the `match` method;
* the helper for the BEM-entities;
* the helper for the mode, whether it standart or arbitrary.



The syntax is following:

```
standart-mode()(body)

mode('arbirary-mode')(body)

BEM-entitie('entitie-name')(body)

match(arbitrary-predicate)(body)
```

***
**NB** Be aware, that you should pass templates' body to a function returned by a helper, but not to the helper itself.

Wrong:
```js
block('b1').tag('span')
```

Right:

```js
block('b1').tag()('span')
```
***

Within a template's body it's possible to perform the following actions:

* Calculate and return a value.
  If a value of the particular type is expected in the current mode, the result of template's body evaluation will be converted to the expected type and used.
  If the template doesn't return any value, the value `undefined` will be used.
* Write some data directly into the HTML-result.
  For this purpose data should be written into the buffer of HTML-result (`this._buf.push(…)`).
* Perform the arbitrary operations.

<a id="xjst"></a>

#### BEM-XJST Special Constructions

For interpretation of the BEMHTML-templates the [bem-xjst](https://github.com/bem/bem-xjst) module is used. It provides a set of BEM related helpers which expands the [XJST](https://github.com/veged/xjst) subject domain.

Together with the helpers for BEM-entities and modes, it's possible to use the BEM-XJST special constructions in the BEMHTML-templates. It allows modifying the context and call procedures for template selection and its implementation within the new (modified) context.

***
**NB** Notice that functionality and syntax of the BEM-XJST constructions may vary from the similar XJST constructions (for example, `apply()`).

***


<a id="local"></a>

##### local

The construction `local` is used for temporary change of the context, variables, and further operations with them.
Syntax of the `local` code block is similar to the JavaScript blocks `while` and `for`.

The block `local` can be written in the following way:

```
local(this)({hash})(function() {
    // code
})
```


Here

* `this` — object being used as a context. Can be omitted, then the current context will be used;
* `hash` — hash of context fields. The nested constructions like `ctx.foo` are allowed in the `hash` block. The values of hash variables will be set for the context fields durring the `local` block execution.
* `code` is a JavaScript-code, which is executed in a context with values assigned to the variables in the `expressions` bock.

For example the `hash` block can be noted in the following way:

```js
local()({ x: 1, 'a.b.c': 2 })(function() {

    // statements body

})
```

When leaving the block `local` all variables whose values were changed in the block `expressions`, acquire their original values (the values they had before the execution of the block `expressions`).
The variables get back their original values in the order reverse to the order of variables assignment performed in the block `expressions`.


***
**NB** If a variable (an object field), that wasn't previously defined, is assigned to a value within the block `expressions`, it will exist after leaving the block `local`, but its value will be set to `undefined`.
***




<a id="apply"></a>

##### apply

The construction `apply` serves for an explicit call of the selection and execution procedures for a template with a predicate that evaluates to true in the given context. `apply` allows us to call templates in the modified context.

The syntax:

```js
apply(expressions)
```
where `expressions` is a list of expressions which are modifying the context. This list can be empty.

Each of the expressions in the `expressions` list can be:

* an object literal (hash) with the variables values, which will be used in a modified context. It's similar to the block `expressions` of the [`local` construction](#local).
* a string or an expression that can be evaluated to a string. It means: «use the given string as a mode name».

For example, the expression `apply('content')` is equivalent to `apply(this._mode = 'content')`.

When evaluating the expression `apply` the following steps will be done:
 1. Expressions evaluation (assignment) of the block `expressions`.
 2. The call of templates' selection and execution procedures in the context obtained at the step 1.
 3. Restore the values of the variables.

The construction `apply(expressions)` is a short form of the expression `local(expressions)(apply())`.

<a id="applynext"></a>

##### applyNext


The construction `applyNext` allows us to re-start the process of templates application to the current context directly in the template body.
The result is obtained that way as if the template, in which this construction is executed, doesn't exist.
The construction returns a value obtained by the templates' application to the current context.

The syntax:

```js
applyNext(expressions)
```

where `expressions` is a list of expressions which modify the context (variables hash or a string that means a mode assignment). This list can be empty. It's similar to the block `expressions` of the [`apply` construction](#apply).

When `applyNext` is called the following steps will be done:

  1. A flag is created in the context in order to prevent an infinite recursion. A random number is used as a flag.
  2. Check of the flag existence is added into the templates' predicate.
  3. Execution of the block `expressions` (modification of the current context).
  4. The call of the template's `apply()` selection and execution procedure.
  5. The value obtained by the template's execution is returned.

For example the template

```js
block('b1')(
    statements
    applyNext()
)
```

is equivalent to the following template:

```js
var _randomflag = ~~(Math.random() * 1e9)
block('b1').match(!this.ctx[_randomflag])(
    statements
    local(this.ctx[_randomflag] = true) apply()
)
```

where `statements` is an arbitrary JavaScript-expression allowed in the template's body.

**See also**:

* [Inheritance](#inheritage)
* [Adding BEM-entities for solving layout problems](#additionbem)


<a id="applyctx"></a>

##### applyCtx

The construction `applyCtx` is designed to modify a fragment of input BEM-tree `this.ctx` and then call the procedure of templates' applying `apply()` in the context of the modified BEM-tree.

Syntax:

```js
applyCtx(newctx)
```
Where for `newctx` it's possible to use:

* An object (hash) which will be used as an input fragment of BEM-tree. It might contain links to the original `this.ctx`.
* A variable assignment.

During evaluation of the expression `applyCtx` the following steps are performed:

  1. To prevent an infinite recursion when calling templates a flag is created in the context. A random number is used for the flag.
  2. The flag existence check is added to the templates' predicate.
  3. The current mode is set to the [empty mode](#empty_moda).
  4. The call of the selection and execution procedure of the template `apply()`.
  5. The value obtained by the template's execution is returned.

The expression `applyCtx(newctx)` is a short form of the expression `applyNext(this.ctx = {newctx}, '')`.

***
**NB** To use a `this.ctx` object as an argument of `applyCtx()` do the following:

* add some protective flag to the context, to avoid an infinite recursion;
* add to the template's predicate check for the protective flag availability.

***

**See also**:

  * [Wrapping up a block into another block](#wrappingunit)
  * [Adding BEM-entities for solving layout problems](#additionbem)




<a name="standardmoda"></a>

### Standard Modes

At the core of BEMHTML a set of standard modes is defined. They determine the order of input BEM-tree (BEMJSON) bypass and the generation of output HTML, that is used by BEMHTML by default.

By functionality the modes can be divided into two classes:

  * **The «Empty» Mode** defines the bypass algorithm for input BEMHTML nodes and for the call of other modes;
  * All other modes define the order for the output HTML generation. In each of such modes a fragment of the output HTML-tree is formed.

For HTML generation in each mode the procedures of selection and execution of a suitable template (a predicate of the template has to evaluate to true) are called.
The fragment of output HTML-tree (HTML-element) for which the current mode is responsible is substituted with the result of the template's body evaluation.

Such approach places the following restrictions on the templates:

  * If the template writes some date into HTML, a mode should be specified in its predicate.
  * The maximum number of modes that can be specified in a predicate is one.
  * A template's body should evaluate to a value of the type which is expected for the current mode.

In the following sections the modes are listed in the order of its call when an element of the input BEMJSON is being processed.

<a name="empty_moda"></a>

#### The «Empty» Mode (`""`)

*The type of a template's body: `not used`*

The empty (not defined) mode corresponds to the situation when the context field `this._mode` equals to an empty string (`""`). This value is set in the following cases:

  * before the beginning of the input tree processing;
  * during recursive call of the tree bypass in the `default` mode.

The action, that will be performed in the empty mode, is defined by the type of the context (the current context) element of the input BEMJSON-tree.

<table>
<tr>
    <th>Element's Type</th>
    <th>Action</th>
</tr>
<tr>
    <td><b>BEM-entity</b>(block or element)</td>
    <td>Setting the values of the context service fields (<code>block elem mods elemMods ctx position</code>)
    and templates' call in the mode <code>default</code>.</td>
</tr>

<tr>
    <th>string/number</th>
    <td>Output of the value converted into a string to the HTML-result buffer.</td>
</tr>
<tr>
    <th>Boolean, undefined, null</th>
    <td>Output of an empty string to the buffer of HTML-result.</td>
</tr>
<tr>
    <th>array</th>
    <td>Iteration through an array with recursive call of templates in empty mode.</td>
</tr>
</table>

Definition of a template in the empty mode (sub-predicate `mode("")`) makes sense if only one needs to override the bypass principle for the input tree.

The call of templates in empty mode (the construction `apply('')` in the template's body) is necessary if one needs to deviate from the univocal correspondence "input BEM-entity - the output HTML-element" and generate more than one item from one input entity.
In particular, such call can be performed automatically when using [constructions `applyCtx`](#applyctx).

**See also**:

  * [Wrapping up a block into another block](#wrappingunit)

<a id="default"></a>

#### default

*The type of a template's body: `not used`*

In the mode `default` the entire output HTML-element corresponding to the input BEM-entity is formed.

During the execution of the mode `default` the following actions are performed:

  * the call of all other standard modes which are responsible for the different aspects of HTML-element;
  * merge of the results of all called modes execution into a resulting string;
  * a recursive call of templates for the result of execution of the mode `content`.

The figure below shows in which modes the different fragments of the output HTML-element are generated.

![mode-default](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_default.png)

The figure represents the case of processing an element which has a pair (opening and closing) of tags and attached content.
Processing of short (closed in the start tag) elements is similar to the represented in the figure above. The only difference is the absence of the closing tag and recursion.
The context auxiliary function `this.isShortTag` depending on the element's (tag) name decides if the current element should be processed as the short one.

Template's definition in the mode `default` (sub-predicate `def()`) is needed if you need to override the generation process of the output HTML-element, for example, to add DOCTYPE to the tag HTML:

```js
block('b-page')(
  def(
    this._buf.push('<!DOCTYPE html>');
    applyNext();
  ),
  tag()('html')
)
```

<a id="tag"></a>

#### tag

* *Type of the template's body: `String`*
* *The default value: `` 'div' ``*

The mode `tag` specifies the name of an input HTML-element (the tag). By default the element's name is `div`. In the figure below the fragments for which the mode `tag` is responsible are highlighted:

![mode-tag](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_tag.png)

***
**NB** If the value of `tag` is set to an empty string, then for the given entity the step of HTML-element generation (tag and attributes generation) will be skipped, but the element's content will be processed in a standard way.
***

Template's definition in the mode `tag` (sub-predicate `tag()`) is necessary in the following cases:

  * if it is necessary to generate an HTML-element for the given entity with the name that differs from `div`;
  * if generation of an HTML-element for the given entity is cancelled, the nested entities should be processed.

<table>
<tr>
    <th>Input Data</th>
    <th>Template</th>
    <th>HTML-Result</th>
</tr>

<tr>
    <td>
        <pre><code>{
  block: 'b1',
  content: 'text'
}</code></pre>
    </td>
    <td><pre><code>block('b1').tag()('span')</code></pre></td>
    <td><pre><code>&lt;span class="b1"&gt;text&lt;/span&gt;</code></pre></td>
</tr>
<tr>
    <td>
        <pre><code>{
  block: 'b1',
  content: {
    block: 'b2'
  }
}</code></pre>
    </td>
    <td><pre><code>block('b1').tag()('')</code></pre></td>
    <td><pre><code>&lt;div class="b2"&gt;&lt;/div&gt;</code></pre></td>
</tr>
</table>

<a id="js"></a>

#### js

* *Type of the template's body: `Boolean|Object`*
* *The default value: `false`*

The mode `js` indicates if the block, that is being processed, has a client-side JavaScript.
In the case the block has JavaScript, it's possible to pass the JavaScript parameters in the mode `js`. The parameters will be written to an HTML-element attribute specified by [the mode `jsAttr`](#jsattr).

The mode `js` accepts two types for the template's body:

  * `Boolean` is a flag that specifies if the given block has a client-side JavaScript.
  * `Object` is a hash which contains JavaScript parameters (it's assumed that the given block has a client-side JavaScript).

Code section of HTML, that are generated by mode `js`, are highlighted in the figure below:

![mode-js](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_js.png)

Template's definition in the mode `js` (sub-predicate `js()`) makes sense if only the block has a client-side JavaScript.

<table>
<tr>
    <th>Input Data</th>
    <th>Template</th>
    <th>HTML-Result</th>
</tr>
<tr>
    <td><pre><code>{block: 'b1'}</code></pre></td>
    <td><pre><code>block('b1').js()(true)</code></pre></td>
    <td><pre><code>&lt;div class="b1 i-bem"
    data-bem="{ 'b1': {} }"&gt;
&lt;/div&gt;</code></pre></td>
</tr>
<tr>
    <td><pre><code>{block: 'b1'}</code></pre></td>
    <td><pre><code>block('b1').js()({param: 'value'})</code></pre></td>
    <td><pre><code>&lt;div class="b1 i-bem"
    data-bem="{ 'b1': { 'param': 'value' } }"&gt;
&lt;/div&gt;</code></pre></td>
</tr>
</table>

**See also**:

  * [JS-implementation of the block i-bem](http://bem.info/libs/bem-bl/current/desktop/i-bem/)

<a id="bem"></a>

#### bem

* *The type of a template's body: `Boolean`*
* *The default value: `true`*

The `bem` mode specifies whether the auto-generated class names, that describe the BEM-entity, should be included in the HTML-attribute `class`.
By default, the BEM-classes are generated.
A fragment of HTML, for which generation the mode `bem` is responsible, is highlighted in the figure below:

![mode-bem](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_bem.png)

Template's definition in the mode `bem` (sub-predicate `bem()`) makes sense if only for the given entity there is **no need** to generate HTML-classes related to the BEM subject domain.
It may be necessary for the compliance with the HTML syntax requirements.
For example, the tag `html`, `meta`, `link`, `script`, `style` cannot have the attribute `class`.

<table>
<tr>
    <th>Input Data</th>
    <th>Template</th>
    <th>HTML-Result</th>
</tr>
<tr>
    <td>
        <pre><code>{
  block: 'b-page'
}</code></pre>
    </td>
    <td>
        <pre><code>block('b-page')(
  tag()('html'),
  bem()(false)
)</code></pre>
    </td>
    <td><pre><code>&lt;html&gt;&lt;/html&gt;</code></pre></td>
</tr>
</table>

<a id="cls"></a>

#### cls

* *The type of a template's body: `String`*
* *The default value: ``*

The mode `cls` allows us to define an arbitrary string which will be added to the attribute `class` besides the automatically-generated values.
The `cls` is responsible for the fragment which is highlighted in the figure below:

![mode-cls](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_cls.png)

Template's definition in the mode `cls` (sub-predicate `cls()`) makes sense if only for the given element the specific HTML-classes, which are not related to the BEM subject domain, are necessary.

<table>
<tr>
    <th>Input Data</th>
    <th>Template</th>
    <th>HTML-Result</th>
</tr>
<tr>
    <td>
        <pre><code>{
  block: 'b1'
}</code></pre>
    </td>
    <td><pre><code>block('b1').cls()('custom')</code></pre></td>
    <td><pre><code>&lt;div class="b1 custom"&gt;&lt;/div&gt;</code></pre></td>
</tr>
</table>

<a id="mix"></a>

#### mix

* *The type of a template's body: `Array|Object`*
* *The default value: `[]`*

The mode `mix` specifies a list of BEM-entities which should be admixed to the given entity.
The entity, within which confines the mixing is performed, is called the **base** entity, and the added entity is called the **admixed**. It makes sense to admix blocks and elements.

Technically the admixture reduces to the following operations:

  * BEM-classes of the admixed entity are added to the value of the `class` attribute of the current element, along with the base entity's classes;
  * If the admixed entity has JavaScript-parameters, they are added to the value of the attribute specified by the mode `jsAttr`. JavaScript-parameters are passed as a hash, where the key is the name of the admixed entity.

All other components of an HTML-element (tag and attributes) are generated based on templates for the base entity.

The value of the template's body for a given mode can be:

  * An **array** which contains a list of objects (hashes), each of those objects describes BEM-entities which are needed to be admixed with the base entity.
  * An **object** which describes the admixed BEM-entity. It's interpreted as an array with one element.

The HTML-fragment, for the generation of which the mode `mix` is responsible, is highlighted in the picture below:

![mode-mix](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_mix.png)

The template's definition for mode `mix` (sub-predicate `mix()`) is required when one needs admixing of a block or element at the level of the templating engine.

***
**NB** The admixing of BEM-entities is executed recursively.
In other words, if for the admixed entity template, in which it has admixture with other entities, is defined, all these entities are added recursively and classes for all of them will appear in the `class` attribute of the base entity (see example below).
***

<table>
<tr>
    <th>Input Data</th>
    <th>Template</th>
    <th>HTML-Result</th>
</tr>
<tr>
    <td>
        <pre><code>{
  block: 'b1'
  js: { p: 1 }
}</code></pre>
    </td>
    <td>
        <pre><code>block('b1').mix()({
  block: 'b2',
  js: { p: 2 }
})</code></pre>
    </td>
    <td><pre><code>&lt;div class="b1 b2 i-bem"
    data-bem="{
        'b1': { 'p': 1},
        'b2': { 'p': 2}
    }"&gt;
&lt;/div&gt;</code></pre></td>
</tr>
<tr>
    <td>
        <pre><code>{
  block: 'b1'
}</code></pre>
    </td>
    <td>
        <pre><code>block('b1').mix()([ { block: 'b2' } ])
block('b2').mix()([ { block: 'b3' } ])
block('b3').mix()([ { block: 'b4' } ])
block('b4').mix()([ { block: 'b1' } ])</code></pre>
    </td>
    <td><pre><code>&lt;div class="b1 b2 b3 b4"&gt;&lt;/div&gt;</code></pre></td>
</tr>
</table>

<a id="jsAttr"></a>

####jsAttr

* *The type of a template's body: `String`*
* *The default value: `'onclick'`*

The mode `jsAttr` defines a name of HTML-attribute in the value of which the client-side JavaScript parameters for the given block will be passed.
By default the attribute `onclick` is used.
In the figure below the HTML-fragment, for generation of which the mode `jsAttr` is responsible, is highlighted:

![mode-jsattr](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_jsattr.png)

The template's definition in the  mode `jsAttr` (sub-predicate `jsAttr()`) is necessary if it is necessary to pass the JavaScript parameters in nonstandard attribute.
For example, for the touch-sites for this purpose the attribute `ondblclick` is used.

<table>
<tr>
    <th>Input Data</th>
    <th>Template</th>
    <th>HTML-Result</th>
</tr>
<tr>
    <td>
        <pre><code>{
  block: 'b1',
  js: true
}</code></pre>
    </td>
    <td><pre><code>block('b1').jsAttr()('ondblclick')</code></pre></td>
    <td><pre><code>&lt;div class="b1 i-bem"
    ondblclick="{'b1': {} }"&gt;
&lt;/div&gt;</code></pre></td>
</tr>
</table>

<a id="attrs"></a>

#### attrs

* *The type of a template's body: `Object`*
* *The default value: `{}`*

The mode `attrs` allows us to specify the names of the arbitrary HTML-attributes for a given element.
By default the additional attributes are not generated.
The HTML-fragment, for generation of which the mode `attrs` is responsible, is highlighted in the figure below:

![mode-attrs](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_attrs.png)

The value of a template's body for the given mode should be an object (hash), which keys and values are names and values of the attributes.
A valid identifier of an HTML-attribute should be used for a key, and a string or a number should be used for the value.
When using a special characters in attribute values, they are escaped with the auxiliary function `this.attrEscape()`.

***
**NB** If value of an attribute is set to `undefined`, this attribute won't be outputted to the HTML-element.
***

A template should be defined in the mode `attrs` (sub-predicate `attrs()`) in the following cases:

  * it is necessary to add the arbitrary attributes to the level of the templating engine;
  * it is necessary to exclude some attributes from the output, even if they have been defined in the input BEMJSON.

<table>
<tr>
    <th>Input Data</th>
    <th>Template</th>
    <th>HTML-Result</th>
</tr>

<tr>
    <td>
        <pre><code>{
  block: 'logo',
}</code></pre>
    </td>
    <td>
        <pre><code>block('logo')(
  tag()('img'),
  attrs()({ alt: 'logo', href: 'http://...' })
)</code></pre>
    </td>
    <td><pre><code>&lt;img alt="logo"
    href="http://..." /&gt;</code></pre></td>
</tr>

<tr>
    <td>
        <pre><code>{
  block: 'input',
  disabled: true
}</code></pre>
    </td>
    <td>
        <pre><code>block('input')(
  tag()('input'),
  attrs()({
    disabled: this.ctx.disabled ? 'disabled' : undefined
  })
)</code></pre>
    </td>
    <td><pre><code>&lt;input class="input"
    disabled="disabled"/&gt;</code></pre></td>
</tr>

<tr>
    <td>
        <code>{ block: 'input' }</code>
    </td>

    <td>The same template</td>
    <td><pre><code>&lt;input class="input"/&gt;</code></pre></td>
</tr>
</table>

<a name="content"></a>

#### content

* *The type of a template's body: `BEMJSON`*
* *The default value: `this.ctx.content`*

In the mode `content` content of an HTML-element is computed, which can be a random BEMJSON (such as a string or a number, or a BEM-entities tree).
As a default value the `content` field value of the context BEM-entity (`this.ctx.content`) is used.

The HTML-fragment, for generation of which the mode `content` is responsible, is highlighted in the figure below:

![mode-content](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_content.png)

The definition of a template in the mode `content` (sub-predicate `content()`) is necessary in the following cases:

 * At the level of the templating engine it's necessary to add a content for the entity that doesn't have `content` in the input BEMJSON.
 * It's necessary to replace the entity's content at the level of the templating engine.

<table>
<tr>
    <th>Input Data</th>
    <th>Template</th>
    <th>HTML-Result</th>
</tr>

<tr>
    <td>
        <pre><code>{
  block: 'b1'
}</code></pre>
    </td>
    <td>
        <pre><code>block('b1').content()({
  block: 'b2'
})</code></pre>
    </td>
    <td><pre><code>&lt;div class="b1"&gt;&lt;div class="b2"&gt;&lt;/div&gt;&lt;/div&gt;</code></pre></td>
</tr>
</table>


**See also**:

* [Inheritance](#inheritage)
* [Adding BEM-entities for solving layout problems](#additionbem)

<a name="context_field"></a>

### The Context Fields

During the runtime BEMHTML templating engine builds a data structure that contains information about the processing BEMJSON node and the state of the processing.
In addition, several auxiliary functions BEMHTML are available in the context.

During the template's execution the context is available as an object, which is denoted by the keyword `this`. It's accessible from the predicate, as well as from the template's body.

A template's author can define any additional fields in the context.

All fields can be divided into two categories:

  * **Context-dependent**, which values vary depending on the node which is being processed and the processing phase.
  * **Context-independent**, which values are unchanged.

**See also**:

  * [The Context](#context)

<a name="contextdependent"></a>

#### Context-dependent Fields

<table>
<tr>
    <th>Field</th>
    <th>Value's Type</th>
    <th>Description</th>
</tr>
<tr>
    <td><code>this.block</code></td>
    <td><code>String</code></td>
    <td>The block's name (of the context BEM-entity).</td>
</tr>
<tr>
    <td><code>this.elem</code></td>
    <td><code>String</code></td>
    <td>The element's name (of the context BEM-entity).</td>
</tr>
<tr>
    <td><code>this.mods</code></td>
    <td><code>Object</code></td>
    <td>The block's modifiers (of the context BEM-entity), <code>name_of_modifier: value_of_modifier</code>.</td>
</tr>
<tr>
    <td><code>this.elemMods</code></td>
    <td><code>Object</code></td>
    <td>The element's modifiers (of the context BEM-entity), <code>name_of_modifier: value_of_modifier</code>.</td>
</tr>
<tr>
    <td><code>this.ctx</code></td>
    <td><code>BEMJSON</code></td>
    <td>A fragment of the input BEMJSON-tree, that contains the processed node and its unchanged descendants. It's used to get access arbitrary fields of input BEMJSON data.</td>
</tr>
<tr>
    <td><code>this.position</code></td>
    <td><code>Number</code></td>
    <td>The position number of the current entity among its siblings in the input BEMJSON-tree (starting from 1).</td>
</tr>

<tr>
    <td><code>this._mode</code></td>
    <td><code>String</code></td>
    <td>The current mode. If one needs to define non-standard modes, this field in the corresponding template should be assigned to the mode's name at in time of entering to this mode.</td>
</tr>
<tr>
    <td><code>this._buf</code></td>
    <td><code>Array</code></td>
    <td>The HTML-result buffer. Usually it's used only for recording ready HTML-fragments by using the method <code>this._buf.push()</code>.</td>
</tr>
<tr>
    <td><code>this.isFirst()</code></td>
    <td><code>Boolean</code></td>
    <td>It checks whether the given BEM-entity is the first one among the siblings in the input BEM-tree.</td>
</tr>

<tr>
    <td><code>this.isLast()</code></td>
    <td><code>Boolean</code></td>
    <td>It checks whether a given BEM-entity is the last one among the siblings in the input BEM-tree. For more details see <a href="#algorithmbem">The algorithm for computing position of the BEM-entity</a>.</td></tr>
<tr>
    <td><code>this.generateId()</code></td>
    <td><code>Number</code></td>
    <td>It returns the unique identifier of the current context. It's used when one needs to generate HTML-elements binded with help of the attribute <code>id</code>.</td>
</tr>
</table>

***
**NB** The keywords for checking BEM-entities in the predicate are a shorthand for checking the values of the fields `block`, `elem`, etc. in the current context. For example, sub-predicate `block b1` is equivalent to sub-predicate `this.block === 'b1'`.

Similarly, the key words for the mode checking in the predicate are shorthand for checking the value of service field `_mode` in the current context. For example, sub-predicate `tag` equivalent to sub-predicate
`this._mode === 'tag'`.
***

<a name="extensionbem"></a>

##### Completing BEM-entities With Help of the Context

In BEMJSON the BEM-entities are usually written in a minimized form. For example, the element `item` is nested into the block `menu`; in the object, which describes the menu item, the name of the menu block, that contains it, is not specified:

```js
{
  block: 'menu',
  content: {
    elem: 'item'
  }
}
```

During operation of the templating engine, the fact that `item` belongs to the block `menu` will be established form the context (based on the nesting). When the block `menu` is the context entity, the context fields will have the following values:

```js
this.block: 'menu'
this.elem: undefined
this.ctx.block: 'menu'
this.ctx.elem: undefined
```

At the time of entry into the sub-element `item`, the field `this.block` is being completed with the value `menu`.
At the same time, the field `this.ctx.block` has the value `undefined`, since in the input BEMJSON this field for the element `item` is not defined:

```js
this.block: 'menu'
this.elem: 'item'
this.ctx.block: undefined
this.ctx.elem: 'item'
```

The elements, which were admixed inside blocks, will be also completed. For example, for the following BEM-tree:

```js
{ block: 'b1', mix: { elem: 'e1' } }
```

In admixed element the block's name will be completed:

```js
{ block: 'b1', mix: { block: 'b1', elem: 'e1' } }
```

Completing of the BEM-entities is necessary for the correct work of predicates with the blocks' elements of the form `block menu, elem item`, since in such predicates the context fields `this.block` and `this.elem` are being checked.

***
**NB** To avoid triggering of the predicate of the form `block menu` nested within a block of elements, at the templates' compilation stage for such predicates the sub-predicate `!this.elem` is automatically added where it's necessary.
If template's predicate contains a sub-predicate with an arbitrary condition, which is not written in the [canonical XJST form](# xjst-canonical), the automatic adding of the sub-predicate may not work.
***

<a name="algorithmbem"></a>

##### The Algorithm for Computing Position of the BEM-entity

Position in the BEM-tree (context field `this.position`) is a natural number that indicates the index number of the current (the context one) BEM-entity among its siblings in the BEM-tree (peer entities).

When computing the position:

  * Only the BEMJSON nodes, that correspond to the BEM-entities, are numbered. All other nodes don't have any position number.
  * The position numbering starts from 1.
  * Numbering is performed in the order of the tree traversal (flattened list of the BEMJSON hierarchical representation).

An example of the numbering in the input BEM-tree:

```js
{
  block: 'page',          // this.position === 1
  content: [
    { block: 'head' },    // this.position === 1
    'text',               // this.position === undefined
    {
      block: 'menu',      // this.position === 2
      content: [
        { elem: 'item' }, // this.position === 1
        { elem: 'item' }, // this.position === 2
        { elem: 'item' }  // this.position === 3
      ]
    }
  ]
}
```

***
**NB** BEM-tree can be completed during the process of templates' implementation with help of templates in the mode `contend` and templates in the empty mode.
Such dynamic change of the BEM-tree is taken into account in the position calculation.
***

The function `this.isLast ()`, which serves for determining the last BEM-entity among the sibling, won't work if the last element is not a BEM-entity.
For example:

```js
  block('b1')(
  	content()([
    	{ block: 'b2' },
    	{ block: 'b3' }, // this.isLast() === false
    	'text'
	])
  )
```

Such behavior is explained by the fact that in order to optimize BEMHTML the full preliminary traversal of the BEM-tree is not performed.
Therefore, at the time of processing the block `b3`, length of the array is already known (`b3` is not the last element), but it is not known that the last element is not a BEM-entity, so it won't receive the index number.

In reality, the case of `this.isLast()` incorrect operation described above shouldn't generate errors, because the check on the first / last BEM-entity is usually applied to automatically-generated lists of entities, and including data of other types into this lists doesn't make sense.

<a name="context_independent"></a>

#### Context-independent Fields

All context-independent fields are grouped in the object `this._`. This fields are auxiliary functions, that are used by the templating engine.
Author of templates can also use these functions in the template's body as well as in predicates.

<table>
<tr>
    <th>Field</th>
    <th>Value's Type</th>
    <th>Description</th>
</tr>
<tr>
    <td><code>this.isArray(Object)</code></td>
    <td><code>Boolean</code></td>
    <td>It checks if the given object is an array</td>
</tr>
<tr>
    <td><code>this.isSimple(Object)</code></td>
    <td><code>Boolean</code></td>
    <td>It checks if the given object is a primitive JavaScript type.</td>
</tr>
<tr>
    <td><code>this.isShortTag(String)</code></td>
    <td><code>Boolean</code></td>
    <td>It checks if the specified tag name belongs to the list of short tags (tags which don't need a closing element and a recursive processing). The full list of short tags: <code>area</code>, <code>base</code>, <code>br</code>, <code>col</code>, <code>command</code>, <code>embed</code>, <code>hr</code>, <code>img</code>, <code>input</code>,
    <code>keygen</code>, <code>link</code>, <code>meta</code>, <code>param</code>, <code>source</code>, <code>wbr</code>.</td>
</tr>
<tr>
    <td><code>this.extend(Object, Object)</code></td>
    <td><code>Object</code></td>
    <td>It returns a hash which merges the content of the two passed in the arguments hashes. If the hashes contain matching keys,  in the result the value of the hash passed in the second argument will be stored.</td>
</tr>
<tr>
    <td><code>this.xmlEscape(String)</code></td>
    <td><code>String</code></td>
    <td>It returns the passed string with escaped XML control characters <code>[&<>]</code>.</td>
</tr>
<tr>
    <td><code>this.attrEscape(String)</code></td>
    <td><code>String</code></td>
    <td>It escapes the control characters for the values of XML and HTML attributes (<code>"[&<>]</code>).</td>
</tr>
</table>

<a name="examples"></a>

### Examples and Recipes

<a name="bringing_input"></a>

#### Converting the Input Data into the View-oriented Format

##### Problem

One needs to form an input BEM-tree for a news feed page (a list of posts with information about the author) which will be easy to handle in terms of the BEMHTML templates.
This tree should be view-oriented, i.e. set and order of the BEM-entities should correspond to set and order of the DOM-nodes of an output HTML.

##### Solution

Reduction to the view-oriented format shouldn't be performed by BEMHTML, but at the back-end level of data-preparation. Such back-end usually works with the normalized data (data-oriented format). In the case of news feed, the original data might have the following format:

```js
{
    posts: [ { text: 'post text', author: 'login' }, … ],
    users: [ { 'login': { userpic: 'URL', name: 'Full Name' } }, … ],
}
```

The data is two lists of objects of different type.
Only a user ID is used in the list of posts, and the complete information about the user is contained in the corresponding hash in the list of users.

The view-oriented data format expects denormalizated data, i.e. the deployment of the list of posts in the way that each post contains full information about the author, even if the list contains multiple posts of the same author. In BEMJSON this format might have the following view:

```js
{
    block: 'posts',
    content: [
        {
            block: 'post',
            content: [
                { block: 'userpic', content: 'URL' },
                { block: 'user', content: 'Full Name' },
                { elem: 'text', content: 'post text' }
            ]
        },
        …
    ]
}
```

<a name="select_template"></a>

#### A Template Selection Based on the Condition

##### Problem

Block `b-link` occurs in two varieties:

  * `{ block: 'b-link', content: 'a link without URI' }`
  * `{ block: 'b-link', url: '//ya.ru', content: 'a link with URL' }`

The output HTML-element should be formed differently depending on the presence / absence of the field `url` in the block's data.

##### Solution

Existence of the field `url` should be checked in a template's sub-predicate: the expression `this.ctx.url` will be evaluated to true if only the field `url` is defined.

```js
block('b-link')(
  tag()('span'),
  match(this.ctx.url)(
    tag()('a'),
    attrs()({ href: this.ctx.url })
  )
)
```

It's **wrong** to use JavaScript conditional statement in the template's body for solving this problem:

```js
block('b-link').tag()(this.ctx.url ? 'a' : 'span')
```

This expression won't be optimized during compilation, so it will have a negative impact on the template's speed.

**See also**:

  * [Syntax for Templates](#template)

<a name="inheritage"></a>

#### Inheritance

##### Problem

At the different [redefinition levels](http://bem.info/method/) two different templates for the same BEM-entity (`block b1`) are defined. Each of the templates defines its own content in the mode `content`.

The content, that was defined at the first level of redefinition, should be **inherited** at the second level of redefinition, and also some extra content should be added. One needs an analog of `<xsl:apply-imports/>`.

##### Solution

BEMHTML has an analog of `<xsl:apply-imports/>`.
Its implementation is based on the ability to restart the procedure of templates' application for the current context (`apply()`).
Therefore it's possible to call the same template as was previously defined for the given context (BEM-entities, modes, etc.) or was defined at another level of redefinition.

When evaluating the expression `apply()`, the result obtained by the application of the previously defined template will be returned.
To avoid an infinite loop, the sub-predicate for check of a flag (for example, `_myGuard`) should be added. This flag must be set when executing `apply()`.

```js
// the template at the first level of redefinition
block('b1').content()('text1')
// the template at the second level of redefinition
block('b1').match(!this._myGuard).content()([
    apply({_myGuard:true}),  // get the previous value of content
    'text2'
])
```

As a result of the templates' application to the block `b1`, the following HTML will be received:

```xml
<div class="b1">text1text2</div>
```

As an alternative, you can use the `applyNext` construction. It automatically generates a unique name for the flag to prevent an infinite loop.


```js
block('b1').content()('text1')
block('b1').content()([
    applyNext(), // gets the previous value of content
    'text2'
])
```

**See also**:

  * [The construction applyNext](#applynext)


<a name="parentblock"></a>

#### Selection of a Template Depending on the Parent Element

##### Problem

To implement a markup similar to DocBook language, depending on the context in which the given block occurs different templates are needed for the block `para`.
Particularly, a tag `<p>` should not be generated for the block `para`, if it's nested into the block `listitem`.

##### Solution

In BEMHTML(or rather in BEM-XJST) there is no implicit saving of the context for using it in predicates. It's made this way for the reasons of performance.

To implement in BEMHTML a context dependence, one has to save explicitly the context information that is required for the processing of the nested blocks.

The context information storing should be implemented in the template for the block `listitem`.
Let's the flag `inListItem`:

```js
block('listitem').match(!this.inListItem)(apply({inListItem:true}))
```

Pay attention to the sub-predicate `!this.inListItem`, it allows us avoid an infinite loop during a recursive call of the templates application procedure in a modified context (`apply({inListItem:true})`).

To process `para` it's enough to check the presence of the flag `inListItem` in the context.

```js
block('para').match(this.inListItem).tag()('')
```

An empty string in the template's value in the mode `tag` indicates that for this block an HTML-element shouldn't be generated.

<a name="wrappingunit"></a>

#### Wrapping Up a Block into Another Block

##### Problem

One needs to wrap up a block (`b-inner`) into another block (`b-wrapper`) during the template's execution.
Therefore one input block will correspond to two nested into each other blocks.

##### Solution

When processing the block `b-inner` in a template in `default` mode (generation of the entire element), one should modify the fragment of the input tree `this.ctx` (the block `b-wrapper` should be added) and recursively perform a call of the templates in the empty mode, using the `applyCtx()` construction.

To avoid an infinite loop the check of the special flag (`_wraped`) should be performed when calling `applyCtx()`. This flag must be set before executing `applyCtx()`.

```js
block('b-inner').def()
    .match(!this.ctx._wrapped)(function() {
        var ctx = this.ctx;
        ctx._wrapped=true;
        applyCtx({ block: 'b-wrapper', content: ctx })
   })
```


***
**NB** The construction `applyCtx()` can be used to **replace** a BEM-entity in the source tree if one doesn't use the original content of the block (`this.ctx`) in the argument of `applyCtx()`.
***

**See also**:

  * [The construction applyCtx](#applyctx)

<a name="additionbem"></a>

#### Adding BEM-entities for Solving Layout Problems

##### Problem

One needs to make a block with rounded corners that works in all browsers (without using CSS3).

Input BEMJSON might might have the following view:

```js
{ block: 'box', content: 'text' }
```

For implementation of rounded corners one has to add four extra elements to the block.
Since these elements are the details of the layout, one shouldn't clutter up the input BEM-tree with these elements.
These elements should be added at the level of BEMHTML-template. The final BEM-tree should look like this:

```js
{
    block: 'box',
    content: {
        elem: 'left-top',
        content: {
            elem: 'right-top',
            content: {
                elem: 'right-bottom',
                content: {
                    elem: 'left-bottom',
                    content: 'text'
                }
            }
        }
    }
}
```


##### Solution

To modify the input BEM-tree at the level of BEMHTML one needs to write a template in the mode `content` for the block `box`.
The fragment of the input BEM-tree is replaced with help of the construction `applyCtx()` (adding the necessary elements), and the substitution of the original content is performed with the help of the construction `applyNext()`.

The BEMHTML-template, which performs this conversion, has the following view:

```js
block('box').match(!this.ctx._processed).content()(local({'ctx._processed':true})(applyCtx({
    elem: 'left-top',
    content: {
        elem: 'right-top',
        content: {
            elem: 'right-bottom',
            content: {
                elem: 'left-bottom',
                content: applyNext()
            }
        }
    }
})))
```



**See also**:

  * [The construction apply](#apply)
  * [The construction applyNext](#applynext)
  * [The construction applyCtx](#applyctx)

<a name="use_bem"></a>

#### Use of the BEM-entity Position

##### Problem

One needs to number menu items starting with 1. The serial number of each menu item with a point should be added to its text.

##### Solution

We use the mechanism for calculating the BEM-entity position among the siblings (the context field `this.position`). The input data may look like this:

```js
{
  block: 'menu',
  content: [
    { elem: 'item', content: 'aaa' },
    { elem: 'item', content: 'bbb' },
    { elem: 'item', content: 'ccc' }
  ]
}
```

To perform the numbering one should write a template in the mode `content` for the menu item. In this template the item's content should be build form the position number, the separator (point with a space) and the original text of the item (can be obtained with help of the construction `applyNext()`):

```js
block('menu')(
  tag()('ul'),
  elemMatch('item')(
    tag()('li'),
    content()([
      this.position, '. ',
      applyNext()
    ]
  )
))
```

**See also**:

  * [The mode content](#content)
  * [The construction applyNext](#applynext)

<a name="check_predicate"></a>

#### Check of the Predicates in a Certain Order

##### Problem

One needs to check templates' sub-predicate in a specific order.
For example, one needs at first check the presence of the object `this.world` in the context, and then check value of the field in this object `this.world.answer`.

##### Solution

Let's use the fact that sub-predicate of a BEMHTML-template can be an arbitrary JavaScript-expression, so we can write it in the following form:

```js
match(this.world && this.world.answer === 42)
```

This solution has a disadvantage: this expression won't be optimized during compilation, this will have a negative effect on the template's speed.
In the majority of cases, it's possible and necessary to avoid the need of the check of sub-predicates in a strict order.

<a name="binding_html"></a>

#### Binding HTML-elements with Help of ID

##### Problem

For the input block `input` one needs to generate a pair of HTML-elements `<label>` and `<input>`. Value of the attribute `input@id` should be automatically-generated, unique and should match the value of the attribute `label@for`.

The input data can be the following:

```js
{
  block: 'input',
  label: 'My Input',
  content: 'my value'
}
```

##### Solution

To generate a unique ID, that is suitable value of the attribute `id`, let's use the auxiliary function of the context `this.generateId()`. For generation of two HTML-elements based on a single input block, one needs two templates:

  * Template in the mode `tag`. This template indicates an empty string to cancel the generation of HTML-element for the given block. However the content should be processed;
  * Template for the mode `content`, which forms two required elements and their attributes.

```js
block('input')(
  tag()(''),
  content()([
    {
      tag: 'label',
      attrs: { 'for': this.generateId() },
      content: this.ctx.label
    },
    {
      tag: 'input',
      attrs: {
        id: this.generateId(),
        value: this.ctx.content
      }
    }
  ]
))
```

