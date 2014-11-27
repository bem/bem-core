<a id="intro"></a>

### Introduction

**This document** is a guide to the BEMHTML template engine.

The guide describes:

* BEMHTML's main features distinguishing it from other template engines;
* BEMHTML-based solutions to some typical problems.

**The target audience for this guide** are web developers and HTML coders who use the [BEM-methodology](http://bem.info/method/).

The reader is assumed to be familiar with:

* HTML
* JavaScript
* CSS
* BEM
* [BEMJSON](http://bem.info/technology/bemjson/current/bemjson/)

**This document does not cover** the setup of the development environment, the template compilation procedure, or BEMJSON syntax.

<a name="bemhtml"></a>

### BEMHTML Features

<a name="arch"></a>

#### Architecture

BEMHTML templates are processed using the module [bem-xjst](http://bem.info/tools/templating-engines/bemxjst/) extended with logic from the BEMHTML default template – [i-bem.bemhtml](https://github.com/bem/bem-core/blob/v1/common.blocks/i-bem/i-bem.bemhtml).

BEMHTML-specific logic is implemented at `i-bem.bemhtml` template level. This default template defines:

* the set of standard modes and in what order to call them;
* available context fields.

For a detailed description of BEMHTML's architecture, see the section [Architecture of BEMHTML and BEMTREE templates](http://ru.bem.info/technology/bemhtml/current/templating/#bemx_arch) of the [Data templating in bem-core](http://ru.bem.info/technology/bemhtml/current/templating/) document (currently available only in Russian).

<a name="uts"></a>
### Support of BEM-XJST templating

BEMHTML is a BEM-XJST template engine. In other words, BEMHTML uses **BEM-XJST syntax** and retains all the features of BEM-XJST template engines, such as:

* binding to the BEM domain;
* declarative templates;
* JavaScript as the template description and execution language;
* restrictions at conventions level.

<a name="basic"></a>

### Key Concepts

<a id="inputdata"></a>

#### Input Data: BEMJSON

BEMHTML is based on JavaScript, so BEMJSON - a JavaScript data structure (object) with a set of extra conventions on the representation of BEM entities - is used as the BEM tree standard format.

The purpose of the BEMHTML template engine is to convert an input BEM tree to an HTML document. It should be noted though that complex transformations of input data at template engine level are likely to compromise the flexibility and maintainability of the template engine, so it's best to keep things simple. In terms of template writing this means creating the most basic statements that map each available type of BEM entity with an appropriate HTML presentation.

Therefore the input BEM tree structure should be **view**-oriented, to preclude the need to change blocks and elements or their order during the HTML tree generation process. Transforming the BEM tree into such a format should be done at back-end level, i.e. upstream - before the data hits the BEMHTML template engine (e.g. using the [BEMTREE](http://bem.info/technology/bemtree/2.3.0/bemtree/) technology).

The view-oriented data format is discussed in the news feed example, under the
[Converting input data into view-oriented format](http://bem.info/technology/bemtree/current/bemtree/#bringing_input) problem in the **Examples and Recipes** section of the [BEMTREE](http://bem.info/technology/bemtree/current/bemtree/) document.

Conversely, the details of the HTML page layout, which is the front-end developer's responsibility, should only be specified at template engine level. For an example of how such a solution can be implemented, see [Adding BEM entities to solve layout problems](#additionbem).

**See also**:

  * [BEMJSON syntax](http://bem.info/technology/bemjson/current/#bemjson)

<a name="templatebemjson"></a>

#### Template

A **template** is a unit of a BEMHTML program. A BEMHTML template associates an input BEM entity (defined by the name of the entity, the name of the element, the name and value of the modifier) with a corresponding HTML element.

A template consists of:

* a **predicate** - a set of conditions under which the template is applied. A predicate typically describes the properties of an input BEM entity;
* a **body** - a set of instructions for generating the output HTML.

**See also**:

* [BEM-XJST syntax](http://ru.bem.info/technology/bemhtml/current/templating/#unity) (Russian version only)

<a name="moda"></a>

#### Mode

During runtime the template engine traverses the input BEM tree. It runs a cycle of output HTML element generation for each node of the tree (BEM entity).
For nested entities the cycle of HTML element generation is run recursively.
The output HTML tree is thus formed element by element during the BEM tree traversal.

The generation cycle for each element sequentially passes through a series of phases called **modes**. Each of these modes is responsible for a certain part of the resulting HTML element (tag, attributes, class, etc). The template engine selects and executes an appropriate template in each mode.

Modes allow us to divide an input element into fragments. A simple data type can be used for describing each fragment: strings are used for tags and classes, a dictionary is used for attributes, Booleans are used to specify whether BEM classes are necessary, etc.

Thus it's possible to create declarative templates with a mode specified in the template predicate, and the data (of simple type corresponding to the mode) contained in the template body. The full representation of an HTML element can then be defined with several templates.

The **[default mode](#default)** has a special status: it is responsible for the generation of an HTML element as a whole. This mode defines the set and order of all other modes corresponding to various fragments of the HTML element in question, and the procedure for building the final representation of the HTML element out of the fragments generated in those other modes.

Writing a template that redefines behaviour in the default mode allows total control over the generation of the corresponding HTML element from BEMHTML.


**See also**:

* [The standard modes](#standardmoda)

<a name="context"></a>

#### Context

While processing an input BEMJSON tree, the template engine builds **context** - a data structure accessible at the moment when templates are being applied. The context corresponds to the current element (node) of the input BEM tree. It includes:

* normalized data describing the current BEM entity;
* a fragment of original input data (the current element of the BEMJSON tree and its child elements);
* the string buffer to which the resulting HTML is being written;
* service fields that contain information about the current state (mode, position in the input BEM tree, etc.);
* auxiliary functions.

A BEM entity described by the current context is called the **context entity**.

**See also**:

* [The context fields](#context_field)
* [Context-aided completion of BEM entities](http://ru.bem.info/technology/bemhtml/current/templating/#extensionbem) (Russian version only)

<a name="standardmoda"></a>

### Standard Modes

The default BEMHTML template defines a set of standard modes which specify the default order for traversing an input BEM tree (BEMJSON) and generating an output HTML.

Functionality-wise, modes are divided into two classes:

* The **"empty mode"** determines the algorithm for processing the nodes of an input BEMJSON and calling other modes.
* All other modes determine the order in which HTML fragments are sequentially generated. Each of the modes is responsible for the generation of a specific fragment of the output HTML tree.

To generate HTML, in each mode an appropriate template (i.e. one whose predicate is evaluated to true in the current context) is chosen and executed. The result of evaluation of the chosen template's body is used in the HTML tree fragment (HTML element) for the generation of which the current mode is responsible.

This logic imposes the following limitations on templates:

* If a template outputs some data in HTML, its predicate must specify a mode.
* A template predicate cannot specify more than one mode.
* Evaluating a template body must return the object type expected within the current mode.

In the sections that follow, modes are listed in the order in which they follow each other during the processing of an input BEMJSON element.

<a name="empty_moda"></a>

#### The "empty" Mode (`""`)

*Template body value type: 'not used'*

The empty (undefined) mode corresponds to the moment when the value of the context field `this._mode` equals an empty string (`""`). This value is set:

* before the input tree traversal begins;
* during the recursive call of the tree traversal procedure in the `default` mode.

The action performed in the empty mode depends on the element type of the context (current) element in the input BEMJSON tree.

<table>
<tr>
    <th>Element type</th>
    <th>Action</th>
</tr>
<tr>
    <td><b>BEM entity</b> (block or element)</td>
    <td>Set values of context service fields (<code>block elem mods elemMods ctx position</code>)
    and call templates in the <code>default</code> mode.</td>
</tr>

<tr>
    <th>string/number</th>
    <td>Convert the value to a string and output it to the BEMJSON result buffer.</td>
</tr>
<tr>
    <th>Boolean, undefined, null</th>
    <td>Output an empty string to the BEMJSON result buffer.</td>
</tr>
<tr>
    <th>array</th>
    <td>Iterate through the array and call templates recursively in the empty mode.</td>
</tr>
</table>

Defining a template in the empty mode (sub-predicate `mode(this._mode === '')`) only makes sense if it is necessary to override the traversal process for the input tree.

Calling templates in the empty mode (the `apply('')` construction in the template body) is necessary if the one-to-one mapping principle of "input BEM entity - output HTML element" has to be broken to enable generation of more than one element per input entity. Such a call is performed automatically when using the `applyCtx` construction.

**See also**:

  * [Wrapping a block in another block](#wrappingunit)

<a id="default"></a>

#### default

*Template body value type: 'not used'*

Within the `default` mode, the entire output HTML element corresponding to the input BEM entity is formed.

During the `default` mode execution, the following takes place:

* all other standard modes responsible for different aspects of the HTML element are called;
* the execution results of all modes called are merged into a resulting HTML string;
* templates are called recursively for the result of the `content` mode execution.

The figure below shows in which modes different fragments of the output HTML element are generated.

![mode-default](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_default.png)

The case represented here is one of processing an element which has a tag pair (opening and closing tags) with some nested content. Short (single tag) elements are processed in the same way, the only difference is that there's no closing tag and no recursion.

Based on the name of the element (tag), the context auxiliary function `this.isShortTag` determines whether the current element should be processed as a short one.

A template must be defined in the `default` mode (sub-predicate `def()`) when it is necessary to redefine the procedure for generating the output HTML element, e.g., to add DOCTYPE to the HTML tag:

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

* *Template body value type: `String`*
* *Default value: `` 'div' ``*

The mode `tag` specifies the name of an output HTML element (tag). By default the element name is `div`. In the figure below the fragments generated in the mode `tag` are highlighted:

![mode-tag](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_tag.png)

***
**NB** If the value of `tag` is set to an empty string, the HTML element (tag and attributes) generation step will be skipped for the current entity, but the element content will be parsed in the usual way.
***

A template must be defined in the `tag` mode (sub-predicate `tag()`) in the following cases:

  * if it is necessary to generate an HTML element for the entity, with a name other than `div`;
  * if the generation of an HTML element for the entity is cancelled, but the nested entities must be processed.

<table>
<tr>
    <th>Input data</th>
    <th>Template</th>
    <th>HTML result</th>
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

* *Template body value type: `Boolean|Object`*
* *Default value: `false`*

The mode `js` specifies if the block that is being processed contains client-side JavaScript code. If the block contains JavaScript, the client JavaScript parameters can be passed in the mode `js`. The parameters will be written to an attribute of the HTML element - the attribute name is determined by [the mode `jsAttr`](#jsattr).

The `js` mode allows two value types for the template body:

  * `Boolean` - a flag that specifies if the block includes client-side JavaScript code.
  * `Object` - a hash that contains JavaScript parameters (it is assumed that the block includes client-side JavaScript code).

The HTML fragments generated in the `js` mode are highlighted in the figure below:

![mode-js](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_js.png)

Defining a template in the `js` mode (sub-predicate `js()`) only makes sense for a block with client-side JavaScript.

<table>
<tr>
    <th>Input data</th>
    <th>Template</th>
    <th>HTML result</th>
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

  * [JS implementation of the i-bem block](http://ru.bem.info/libs/bem-bl/current/desktop/i-bem/) (Russian version only)

<a id="bem"></a>

#### bem

* *Template body value type: `Boolean`*
* *Default value: `true`*

The mode `bem` specifies whether the auto-generated names of classes that describe the current BEM entity should be included in the HTML attribute `class`. By default, the BEM classes are generated.
The HTML fragment generated in the `bem` mode is highlighted in the figure below:

![mode-bem](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_bem.png)

Defining a template in the `bem` mode (sub-predicate `bem()`) makes sense only for an entity whose processing **does not involve** generating BEM-specific HTML classes. Sometimes it is a question of valid HTML syntax. E.g., tags such as `html`, `meta`, `link`, `script`, `style` cannot have a `class` attribute.

<table>
<tr>
    <th>Input data</th>
    <th>Template</th>
    <th>HTML result</th>
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

* *Template body value type: `String`*
* *Default value: ``*

The mode `cls` allows us to define a custom string which will be added to the attribute `class` besides the automatically generated values.
The HTML fragment generated in the `cls` mode is highlighted in the figure below:

![mode-cls](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_cls.png)

Defining a template in the `cls` mode (sub-predicate `cls()`) makes sense only for an element that requires specific HTML classes not related to the BEM domain.

<table>
<tr>
    <th>Input data</th>
    <th>Template</th>
    <th>HTML result</th>
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

* *Template body value type: `Array|Object`*
* *Default value: `[]`*

The mode `mix` specifies a list of BEM entities to be **mixed** into the current entity.
The entity that has other entities mixed into it is called the **base** entity, and an added entity is called a **mixed** entity. It makes sense to mix in blocks and elements.

Technically, mixing amounts to the following operations:

  * the BEM classes of the mixed entity are added to the value of the `class` attribute of the current element, along with the base entity's classes;
  * if the mixed entity has JavaScript parameters, they are added to the value of the attribute specified by the `jsAttr` mode. JavaScript parameters are passed as a hash, where the key is the name of the mixed entity.

All the other HTML element components (tag, attributes, etc.) are generated based on templates for the base entity.

The `mix` mode allows two value types for the template body:

  * An **array** containing a list of objects (hashes) that describe the BEM entities to be mixed into the base entity.
  * An **object** describing the mixed BEM entity - interpreted as an array consisting of a single element.

The HTML fragment generated in the `mix` mode is highlighted in the picture below:

![mode-mix](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_mix.png)

A template must be defined in the `mix` mode (sub-predicate `mix()`) when a block or an element needs to be mixed in at template engine level.

***
**NB** The mixing of BEM entities is performed recursively. In other words, if a template is defined for a mixed entity that specifies further entities to be mixed into it, then all those entities are added recursively, with the corresponding classes appearing in the `class` attribute of the base entity (see the example below).
***

<table>
<tr>
    <th>Input data</th>
    <th>Template</th>
    <th>HTML result</th>
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

* *Template body value type: `String`*
* *Default value: `'onclick'`*

The mode `jsAttr` defines the name of an HTML attribute that will store client-side JavaScript parameters for the current block.
By default, the attribute `onclick` is used.
In the figure below, the HTML fragment generated in the `jsAttr` mode is highlighted:

![mode-jsattr](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_jsattr.png)

A template must be defined in the `jsAttr` mode (sub-predicate `jsAttr()`) if it is necessary to store JavaScript parameters in a non-standard attribute.

<table>
<tr>
    <th>Input data</th>
    <th>Template</th>
    <th>HTML result</th>
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

* *Template body value type: `Object`*
* *Default value: `{}`*

The mode `attrs` allows us to specify the names and values of custom HTML attributes for the current element.
By default, additional attributes are not generated.
The HTML fragment generated in the `attrs` mode is highlighted in the figure below:

![mode-attrs](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_attrs.png)

The value of the template body for this mode is an object (hash), with its keys-value pairs containing the names and values of the attributes.
A valid identifier of the HTML attribute should be used for a key, and a string or a number should be used for the value.
Special characters in attribute values are escaped with the auxiliary function `this.attrEscape()`.

***
**NB** If the value of an attribute is set to `undefined`, the attribute won't appear in the resulting HTML element.
***

A template must be defined in the `attrs` mode (sub-predicate `attrs()`) if it is necessary to:

  * add custom attributes at template engine level;
  * exclude some attributes from the output, even if they were defined in the input BEMJSON.

<table>
<tr>
    <th>Input data</th>
    <th>Template</th>
    <th>HTML result</th>
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

* *Template body value type: `BEMJSON`*
* *Default value: `this.ctx.content`*

In the mode `content` the content of an HTML element is evaluated. This can be an arbitrary BEMJSON (either a string or a number, or a tree of BEM entities). The default value is the value of the `content` field of the context BEM entity (`this.ctx.content`).

The HTML fragment generated in the `content` mode is highlighted in the figure below:

![mode-content](https://raw.github.com//bem/bem-core/v1/common.docs/reference/reference_mode_content.png)

A template must be defined in the `content` mode (sub-predicate `content()`) if it is necessary to:

* add content at template engine level for an entity that lacks `content` in the input BEMJSON;
* substitute the content of an entity at template engine level.

<table>
<tr>
    <th>Input data</th>
    <th>Template</th>
    <th>HTML result</th>
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
* [Adding BEM entities to meet layout requirements](#additionbem)

<a name="context_field"></a>

### Context Fields

As it runs, the BEMHTML template engine builds a data structure containing information about the BEMJSON node being processed and the state of processing. In addition, several auxiliary functions are available in the context.

During the execution of a template, the context is available as an object denoted by the keyword `this`. It is available both from the predicate and from the template body.

The author of a template can define additional fields in the context.

All context fields can be divided into two categories:

* **Context-dependent** fields, whose values vary depending on the node that is being processed and the processing phase.
* **Context-independent** fields, whose values are constant.

**See also**:

  * [Context](#context)

<a name="contextdependent"></a>

#### Context-dependent Fields

BEMHTML extends the set of context-dependent fields of BEM-XJST with the following ones:

<table>
<tr>
    <td><code>this.position</code></td>
    <td><code>Number</code></td>
    <td>Number that indicates the position of the current entity among its siblings in the input BEMJSON tree (starting from 1).</td>
</tr>
<tr>
    <td><code>this._buf</code></td>
    <td><code>Array</code></td>
    <td>HTML result buffer. Usually used only for recording completed HTML fragments using the method <code>this._buf.push()</code>.</td>
</tr>
<tr>
    <td><code>this.isFirst()</code></td>
    <td><code>Boolean</code></td>
    <td>Checks whether the current BEM entity is the first one among its siblings in the input BEM tree.</td>
</tr>
<tr>
    <td><code>this.isLast()</code></td>
    <td><code>Boolean</code></td>
    <td>Checks whether the current BEM entity is the last one among its siblings in the input BEM tree. For details see <a href="#algorithmbem">The algorithm for computing the position of a BEM entity</a>.</td></tr>
</tr>
</table>

<a name="algorithmbem"></a>

##### The algorithm for computing the position of a BEM entity

The position in a BEM tree (context field `this.position`) is a natural number indicating the index number of the current (i.e. context) BEM entity among its siblings in the BEM tree (peer entities).

When computing the position of a BEM entity, the following considerations should be borne in mind:

  * Only BEMJSON nodes that correspond to BEM entities are numbered. Other nodes are not assigned position numbers.
  * The numbering starts at 1.
  * The numbering follows the order of the tree traversal (flattened list of the BEMJSON hierarchical representation).

Here's an example of position numbering in an input BEM tree:

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
**NB** A BEM tree can be completed during the execution of templates by applying templates in the `content` mode and templates in the empty mode. Such a dynamic change of the BEM tree is taken into account during the position calculation.
***

The `this.isLast ()` function, which is used to identify the last BEM entity among the siblings, won't work if the last element of the array containing peer BEM entities is itself not a BEM entity. E.g.:

```js
  block('b1')(
  	content()([
    	{ block: 'b2' },
    	{ block: 'b3' }, // this.isLast() === false
    	'text'
	])
  )
```

Such behavior is due to the fact that, for BEMHTML optimization purposes, a full preliminary traversal of the BEM tree is not performed.
Therefore, in the above example, when block `b3` is being processed, the length of the array is already known (`b3` is not the last element) but it is not known yet that the last element is not a BEM entity and thus won't be receiving an index number.

In practice, the case of `this.isLast()` incorrect operation described above shouldn't generate any errors, because the check for the first / last BEM entity is usually applied to automatically generated lists of entities, where it doesn't make sense to include data of other types.

<a name="context_independent"></a>

#### Context-independent Fields

All context-independent fields are grouped within the object `this._` and serve as auxiliary functions used when the template engine is running. The template author can use these functions in both template bodies and predicates.

BEMHTML extends the set of context-independent fields of BEM-XJST with the following ones: 

<table>
<tr>
    <th>Field</th>
    <th>Value type</th>
    <th>Description</th>
</tr>
<tr>
    <td><code>this.isShortTag(String)</code></td>
    <td><code>Boolean</code></td>
    <td>Checks if the specified tag name belongs to the list of short tags (tags that don't require a closing element or a recursive processing). The full list of short tags: <code>area</code>, <code>base</code>, <code>br</code>, <code>col</code>, <code>command</code>, <code>embed</code>, <code>hr</code>, <code>img</code>, <code>input</code>,
    <code>keygen</code>, <code>link</code>, <code>meta</code>, <code>param</code>, <code>source</code>, <code>wbr</code>.</td>
</tr>
</table>

<a name="examples"></a>

### Examples and Recipes

#### Condition-based template selection

##### Problem

The `b-link` block occurs in two varieties:

  * `{ block: 'b-link', content: 'link without URL' }`
  * `{ block: 'b-link', url: '//ya.ru', content: 'link with URL' }`

The resulting HTML element should be formed differently, depending on whether or not the block data includes the `url` field.

##### Solution

A check for existence of the `url` field should be made in the template sub-predicate: the expression `this.ctx.url` will be evaluated to true only if the field `url` is defined.

```js
block('b-link')(
  tag()('span'),
  match(this.ctx.url)(
    tag()('a'),
    attrs()({ href: this.ctx.url })
  )
)
```

It is **wrong** to use a JavaScript conditional statement in the template body as a solution to this problem:

```js
block('b-link').tag()(this.ctx.url ? 'a' : 'span')
```

This expression won't be optimized during compilation, and will consequently impact the template processing speed.

**See also**:

  * [Template syntax](http://ru.bem.info/technology/bemhtml/current/templating/#template) (Russian version only)

<a name="inheritage"></a>

#### Inheritance

##### Problem

Two different templates are defined for the same BEM entity (`block b1`) at different [redifinition levels](http://bem.info/method/filesystem/). Each of the templates defines its content in the `content` mode.

The content defined at the first level of redefinition should be **inherited** at the second level, and also some extra content should be added. An analogue of `<xsl:apply-imports/>` is required.

##### Solution

BEMHTML has an analogue of `<xsl:apply-imports/>`. Its implementation is based on the ability to restart the procedure of applying templates to the current context (`apply()`). Therefore it is possible to call the same template that was previously defined for a given context (BEM entities, modes, etc.) or was defined at another level of redefinition.

When evaluating the expression `apply()`, the result obtained by the application of the previously defined template is returned. To avoid an infinite loop, the sub-predicate to check for a flag (e.g., `_myGuard`) must be added. This flag must be set when executing `apply()`.

```js
// the template at the first level of redefinition
block('b1').content()('text1')

// the template at the second level of redefinition
block('b1').match(!this._myGuard).content()([
    apply({_myGuard:true}),  // get the previous value of content
    'text2'
])
```

Applying the templates to block `b1` will result in the following HTML:

```js
{ block: 'b1', content: 'text1text2' }
```

As a simpler alternative, you can use the `applyNext` construction. It automatically generates a unique name for the flag to prevent an infinite loop.


```js
block('b1').content()('text1')
block('b1').content()([
    applyNext(), // gets the previous value of content
    'text2'
])
```

**See also**:

  * [The applyNext construction](http://ru.bem.info/technology/bemhtml/current/templating/#applynext) (Russian version only)


<a name="parentblock"></a>

#### Template selection depending on the parent element

##### Problem

As part of implementing a DocBook-like markup language, different templates must be used for the block `para` depending on the context in which this block occurs. Specifically, if it is nested inside a `listitem` block, a `<p>` tag must not be generated for it.

##### Solution

For performance purposes, BEMHTML (or rather BEM-XJST) does not support implicit saving of context for its use in predicates.

To implement context dependence in BEMHTML, context information required for the correct processing of nested blocks needs to be saved explicitly.

The storing of context information should be implemented in the `listitem` block template. Let's use a flag called `inListItem`:

```js
block('listitem').match(!this.inListItem)(apply({inListItem:true}))
```

Note the use of the sub-predicate `!this.inListItem`, which helps avoid an infinite loop during a recursive call of the templates application procedure in a modified context (`apply({inListItem:true})`).

To process a `listitem`-nested `para` block, we just need to check if the `inListItem` flag exists in the context.

```js
block('para').match(this.inListItem).tag()('')
```

An empty string in the template body value in the mode `tag` indicates that an HTML element mustn't be generated  for this block.

<a name="wrappingunit"></a>

#### Wrapping a block in another block

##### Problem

One block (`b-inner`) must be wrapped in another block (`b-wrapper`) during the execution of a template, so that one input block corresponds to two blocks nested inside each other.

#### Solution

When processing the `b-inner` block in a template in the default mode (the entire element generation), one should modify the fragment `this.ctx` of the input tree (the block `b-wrapper` should be added). This involves the use of the `applyCtx()` construction, which assigns `this.ctx` and applies templates in the empty mode.

To avoid an infinite loop, a special flag (`_wrapped`) should be checked when calling `applyCtx()`. This flag must be set before executing `applyCtx()`.

```js
block('b-inner').def()
    .match(!this.ctx._wrapped)(function() {
        var ctx = this.ctx;
        ctx._wrapped=true;
        applyCtx({ block: 'b-wrapper', content: ctx })
   })
```

***
**NB** The `applyCtx()` construction may be used to **replace** a BEM entity in the source tree, if the original content of the block (`this.ctx`) is not used in the argument of `applyCtx()`.
***

**See also**:

  * [The applyCtx construction](http://ru.bem.info/technology/bemhtml/current/templating/#applyctx) (Russian version only)

<a name="additionbem"></a>

#### Adding BEM entities to meet layout requirements

##### Problem

Design a block with rounded corners that will work in all browsers (without using CSS3).

The input BEMJSON may look like this:

```js
{ block: 'box', content: 'text' }
```

The implementation of rounded corners requires adding four extra elements to the block. Since these elements represent details of the layout, they shouldn't clutter the input BEM tree. These elements should be added at BEMHTML template level. The resulting BEM tree should look like this:

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

The modification of the input BEM tree at BEMHTML level requires writing a template in the `content` mode for the `box` block. The fragment of the input BEM tree is replaced using the `applyCtx()` construction (adding the necessary elements), and the original content is inserted using the `applyNext()` construction.

The BEMHTML template used for this conversion looks like this:

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
**NB:** The hash with the variable `ctx._processed` set to `true` is passed to the method `applyCtx` as the first parameter to execute the method in the modified context.

**See also**:

  * [The apply construction](http://ru.bem.info/technology/bemhtml/current/templating/#apply) (Russian version only)
  * [The applyNext construction](http://ru.bem.info/technology/bemhtml/current/templating/#applynext) (Russian version only)
  * [The applyCtx construction](http://ru.bem.info/technology/bemhtml/current/templating/#applyctx) (Russian version only)

<a name="use_bem"></a>

#### Using the BEM entity Position

##### Problem

The items in a menu should be numbered, starting with 1. The numbering value followed by a period should be added to the text of the element representing a menu item.

##### Solution

We use the mechanism for calculating the position of a BEM entity among its siblings (the context field `this.position`). The input data may look like this:

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

To do the numbering, write a template in the `content` mode for the menu item, where the element content consists of a position number, a separator (a period followed by a space) and the original text of the element (obtained using the `applyNext()` construction).

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

  * [The `content` mode](#content)
  * [The applyNext construction](http://ru.bem.info/technology/bemhtml/current/templating/#applynext) (Russian version only)

<a name="check_predicate"></a>

#### Checking sub-predicates in a specific order

##### Problem

Template sub-predicates should be checked in a certain order, e.g. first the presence of the `this.world` object should be checked in the context, and then the value of the `this.world.answer` field in that object.

#### Solution

Let's make use of the fact that the sub-predicate of a BEMHTML template can be an arbitrary JavaScript expression and can be written in the following form:

```js
match(this.world && this.world.answer === 42)
```

This solution has a disadvantage: the expression won't be optimized during compilation, which will have a negative effect on the template processing speed. In the majority of cases, it is possible and necessary to avoid the need for checking sub-predicates in a strictly specific order.

<a name="binding_html"></a>

#### Binding HTML elements by ID

##### Problem

For every `input` input block, a pair of HMTL elements `<label>` and `<input>` must be generated, so that the value of the attribute `input@id` is generated automatically, is unique and is equal to the value of the attribute `label@for`.

The input data may look like this:

```js
{
  block: 'input',
  label: 'My Input',
  content: 'my value'
}
```

#### Solution

To generate a unique ID that can serve as the value of the attribute `id`, let's use the auxiliary context function `this.generateId()`. Generating two HTML elements based on a single input block requires two templates:

  * A template in the `tag` mode. This template indicates an empty string to cancel the generation of an HTML element for the block. However the block's content should be processed;
  * A template in the `content` mode, which forms two required elements and their attributes.

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

<a name="links"></a>

###See also

* [BEMTREE: examples and recipes](http://bem.info/technology/bemtree/current/bemtree/#examples)
* [Data templating in bem-core](http://ru.bem.info/libs/bem-core/current/templating/templating/) (Russian version only)

####In the community

* [BEMTREE](http://en.bem.info/technology/bemtree/current/bemtree/)
* [BEMJSON](http://en.bem.info/technology/bemjson/2.3.0/bemjson/)