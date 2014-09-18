<a name="intro"></a>

## Introduction

**This document** is a guide to the BEMTREE template engine.

The guide describes:

* BEMTREE's main features distinguishing it from other template engines;
* Input data processing sequence and BEMJSON generation;
* BEMTREE-based solutions to some typical problems.

**The target audience for this guide** are web developers and HTML coders who use the [BEM methodology](http://bem.info/method/).

The reader is assumed to be familiar with:

* HTML
* JavaScript
* CSS
* [BEMHTML](http://bem.info/technology/bemhtml/current/reference/)
* [BEMJSON](http://bem.info/technology/bemjson/current/bemjson/)
* [BEM](http://bem.info/method/)

**This document does not cover** the setup of the development environment, the template compilation procedure or the process of receiving data from the back end.


<a name="bemtree"></a>

## BEMTREE features

<a name="arch"></a>
### Architecture

For the processing of BEMTREE templates, the module [bem-xjst](http://bem.info/tools/templating-engines/bemxjst/) is used, extended with logic from the BEMTREE default template – [i-bem.bemtree](https://github.com/bem/bem-core/blob/v2/common.blocks/i-bem/i-bem.bemtree).

BEMTREE-specific logic is implemented at `i-bem.bemtree` template level. This default template defines:

* the set and call order of standard modes;
* available context fields.

For a detailed description of BEMTREE's architecture, see section “Architecture of BEMHTML and BEMTREE templates” of the [Data templating in bem-core](http://ru.bem.info/technology/bemhtml/current/templating/) (it is available only in Russian) document.


<a name="uts"></a>
### Support of BEM-XJST templating

BEMTREE is a BEM-XJST template engine. In other words, BEMTREE uses **BEM-XJST syntax** and retains all the features of BEM-XJST template engines, such as:

* binding to the BEM-domain;
* declarative templates;
* JavaScript as the template description and execution language;
* restrictions at conventions level.


<a name="basic"></a>

## Key concepts

<a name="template"></a>
### Templating in a nutshell

BEMTREE is a template engine designed to be used in conjunction with the BEMHTML template engine.

BEMHTML converts an input BEM tree into an output HTML document element by element.

The structure of an input BEM tree must be **view**-oriented, so as to avoid the need to change blocks and elements or their order during the HTML tree generation process.

Transforming a BEM tree into such a format is what the BEMTREE technology is all about.



<a name="data"></a>

### Data handling

The BEMTREE technology is architecture-agnostic in its interaction with the back-end.

The following two approaches to interacting with data providers are normally used in BEM projects:

* centralized receipt of data;
* receipt of data at BEMTREE block template level.

There are specific aspects to each of these two approaches, and they should be kept in mind when choosing a preferred way of interacting with the back end.


#### Centralized receipt of data

This method involves the use of a separate module that interacts with the back end, the so-called **controller**.

A request from the browser (or some other event) causes the controller to send a request to the back end. It then saves the response received from the back end, e.g. by storing it in a global variable or as a property of a global object.

A BEMTREE block template maps the fields of the global object or the variable to the BEM entities in the resulting BEMJSON.

Thus the template itself contains no evidence of how the data was obtained, much like the controller does not care about its further representation.

Such an approach employs the principle of separation of the controller from data representation. This principle proves particularly useful when:

* the structure and contents of the page are known at the time of its formatting;
* blocks must not be dependent on how data are received (e.g., for use in external projects, libraries, etc.);
* data is obtained from the same few sources, e.g., a single DBMS.

***
**NB** Please note that the centralized approach to data handling assumes that a data object received from the back end is fully formed by the time a BEMTREE template is applied.
***


#### Receipt of data within a BEMTREE block template

This approach is appropriate for a block that receives its data from a source that no other block uses. Then there is no point in having a separate controller as its functionality would be inapplicable to any other blocks. A case in point would be any type of widget: a weather forecast widget, counters, new blog posts, currency exchange rate, etc.

The main advantage of this approach is that blocks are then essentially self-contained. They contain logic both for the receipt and representation of data.



<a name="inputdata"></a>

### Input and output data: BEMJSON

BEMTREE is based on JavaScript, thus BEMJSON - JavaScript data structure (object) with a set of extra conventions on the representation of BEM entities - is used as the BEM tree standard format.

BEMJSON is used for input and output data for the BEMTREE template engine. An input BEM tree is a web page skeleton, which gets filled with data element by element when it is processed by the template engine.

An input BEMSJON may consist of the description of only one BEM entity, with which the execution of BEM-templates starts - **the entry point**. Say, we call a BEMTREE template for a `page` block:


```js
BEMTREE.apply({ block: 'page' })
```

Then the BEMTREE template for the entry point BEM entity includes references to other BEM entities, e.g.:


```js
block('page').content()([{ block: 'header' }, { block: 'main' }, ...])
```

As the template is being processed, the template engine will recursively call the referenced BEMTREE templates, e.g..:


```js
block('header').content()([{ block: 'logo' }, { block: 'menu', content: { elem: 'item' }}])
```

Thus the BEM tree of the entire document is built element by element.


<a name="templatebemjson"></a>

### Template, mode and context

**Template, mode and context** are the core concepts of BEM-XJST and are absolutely applicable to BEMTREE.

You can find detailed information about them in the respective sections of the documentation about templating in bem-core:

* Template
* Mode
* Context


<a name="syntax"></a>

### Template syntax

BEMTREE templates are created using BEM-XJST-template syntax. In practice this means that all syntactic structures available in BEMHTML templates can be used in BEMTREE templates.

Syntax-wise, BEMTREE differs from BEMHTML in what sets of context fields and standard modes (including helpers) are available.

<a name="standardmoda"></a>

## Standard modes

The default BEMTREE template defines a set of standard modes which specify the default order for processing an input BEM tree (BEMJSON) and generating an output BEMJSON.

Functionality-wise, modes are divided into two classes:

* The **"Empty mode"** determines the algorithm for processing the nodes of an input BEMJSON and calling other modes;
* All other modes determine the order in which BEMJSON elements are sequentially generated. Each of the modes is responsible for the generation of a specific fragment of the output BEMJSON tree.

To generate BEMJSON, in each mode an appropriate template (i.e. one whose predicate is evaluated to true in the given context) is chosen and executed. The result of evaluation of the chosen template's body is used in that BEMJSON tree fragment (BEM entity), for the generation of which the current mode is responsible.

This logic imposes the following limitations on templates:

* If a template outputs some data in BEMJSON, its predicate must specify a mode.
* A template predicate cannot specify more than one mode.
* Evaluating a template body must return the object type expected within the current mode.

In the sections that follow, modes are listed in the order in which they follow each other during the processing of an input BEMJSON element.

BEMTREE modes are identical to BEMHTML modes, the only difference being that BEMTREE does not have modes responsible for the generation of HTML element fragments (classes, attributes, etc).

Thus in BEM-templates, besides the empty mode, which specifies the processing algorithm used for an input BEM tree and the order of other modes, only two modes are available:

* the `default` mode, responsible for the generation of a BEM tree element as a whole. It is usually used for the replacement of a context entity (e.g., for the [wrapping of a block in another block](#wrappingunit));
* the `content` mode, which describes the content of the current BEM tree element.


<a name="empty_moda"></a>

### The «empty» mode (`""`)

*Template body value type: 'not used'*

The empty (undefined) mode corresponds to the moment when the value of the context field `this._mode` equals an empty string (`""`). This value is set:

* before the start of the input tree processing;
* during the recursive call of the tree processing procedure in the `default` mode.

What action is executed in the empty mode depends on the type of a context (current) element of the input BEMJSON tree.

<table>
<tr>
    <th>Element type</th>
    <th>Action</th>
</tr>
<tr>
    <td><b>BEM entity</b> (block or element)</td>
    <td>Setting values of context service fields (<code>block elem mods elemMods ctx position</code>)
    and calling templates in the <code>default</code> mode.</td>
</tr>

<tr>
    <th>string/number</th>
    <td>Output of value, converted into a string, to BEMJSON-result buffer.</td>
</tr>
<tr>
    <th>Boolean, undefined, null</th>
    <td>Output of an empty string to BEMJSON-result buffer.</td>
</tr>
<tr>
    <th>array</th>
    <td>Iteration through the array with recursive call of templates in the empty mode.</td>
</tr>
</table>

The definition of a template in the empty mode (sub-predicate `mode(this._mode === '')`) only makes sense if it is necessary to override the processing order for the input tree.

Calling templates in the empty mode (the `apply('')` construction in the template body) is necessary if one needs to deviate from the strict correspondence of "input BEM entity - output BEMJSON-element" and, for example, generate more than one element per one input entity. Specifically, such a call can be made automatically when using the applyCtx construction.

**See also**:

  * [Wrapping a block in another block](#wrappingunit)

<a name="default"></a>

### default

*Template body value type: 'not used'*

Within the `default` mode, the entire output BEMJSON element corresponding to the input BEM entity is formed.

During the `default` mode execution, the following takes place:

* all other standard modes responsible for different aspects of the BEMJSON element are called;
* the execution results of all modes called are merged into a resulting BEMJSON;
* templates are called recursively for the result of the `content` mode execution.

The definition of a template in the `default` mode (sub-predicate `def()`) is required when the procedure for the generation of the output BEMJSON fragment needs to be overridden. As an example, let's create a BEMTREE template for a [page](https://github.com/bem/bem-core/blob/v2/common.blocks/page/page.bemhtml) block from the redefinition level `common.blocks`:

```js
block('page').def()(function() {
    return applyCtx({
        block: this.block,
        title: this.ctx.title,
        head: [{ elem: 'js', url: this.ctx.js }],
        content: {
            block: 'foo',
            content: this.ctx.foo
        }
    });
});
```

Here, to modify the input data object `this.ctx`, the `applyCtx` construction is used. It is used to assign values to different fields of the object during a call in the `default` mode, and then the procedure `apply()` is automatically called to choose and apply a template.

The template generates arbitrary fields `title` and `head` in the context, and their values are then used by the BEMHTML block template.

<a name="content"></a>

### content

* *Template body value type: `BEMJSON`*
* *Default value: `this.ctx.content`*

Within the `content` mode the content of a BEMJSON element is evaluated. This can be an arbitrary BEMJSON (either a string or a number, or a tree of BEM entities). The default value is the value of the `content` field of the context BEM entity (`this.ctx.content`).

The definition of a template in the `content` mode (sub-predicate `content()`) is required if:

* it is necessary, at template engine level, to add content for an entity that lacks `content` in the input BEMJSON;
* it is necessary to substitute the content of an entity at template engine level.

<table>
<tr>
    <th>Input data</th>
    <th>Template</th>
    <th>resulting BEMJSON</th>
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
    <td><pre><code>{ block: 'b1', content: { block: 'b2' } }</code></pre>
</td>
</tr>
</table>


**See also**:

* [Inheritance](#inheritage)
* [Adding BEM entities to a BEM tree](#additionbem)


<a name="context_field"></a>

## Context fields

As it runs, the BEMTREE template engine builds a data structure containing information about the BEMJSON node processed and the state of processing. In addition, several auxiliary functions are available in the context.

During the execution of a template, the context is available as an object denoted by the keyword `this`. It is available both from the predicate and the template body.

The author of a template can define additional fields in the context.

All context fields can be divided into two categories:

* **Context-dependent** fields, whose values vary depending on the node that is being processed and the processing phase.
* **Context-independent** fields, whose values are unchanged.

**See also**:

  * [Context](http://ru.bem.info/technology/bemhtml/current/templating/#context)


<a name="contextdependent"></a>

### Context-dependent fields

The default BEMTREE template does not add any context-dependent fields besides those common to BEM-XJST.


<a name="context_independent"></a>

### Context-independent fields

All context-independent fields are grouped into the object `this._` and serve as auxiliary functions used when the template engine is running. The author of templates can use these functions in both template bodies and predicates.

BEMTREE extends the set of context-independent fields of BEM-XJST with only one method - `this._.doAsync`.

<table>
<tr>
    <th>Field</th>
    <th>Value type</th>
    <th>Description</th>
</tr>
    <td><code>this._.doAsync(Function)</code></td>
    <td><code>Function</code></td>
    <td>Asynchronosly executes a function sent as the argument. Usually used for sending asynchronous requests to the back end. The fuction returns a promise, the result object of which contains fields with info about the context BEM entity.</td>
</tr>
</table>


<a name="examples"></a>

## Examples and recipes

<a name="bringing_input"></a>

### Converting input data into view-oriented format

#### Problem

An input BEM tree must be built for a news feed (a list of posts with information about the author) that is easy to process in terms in BEMHTML templates. This should be a view-oriented tree, i.e. the set and order of the BEM entities should correspond to those of the DOM nodes in the output HTML.

#### Solution

The back end normally handles normalized data (data-oriented format). In the case of a news feed, the format of input data may be as follows:

```js
{
    posts: [ { text: 'post text 1', author: 'login1' },  { text: 'post text 2', author: 'login2' }… ],
    users:  { 'login1': { userpic: 'URL', name: 'Full Name 1' }, 'login2': { userpic: 'URL', name: 'Full Name 2' } … },
}
```

The data is presented in normalized form. In the post list only a user ID is shown, and the full user info is contained in the corresponding hash in the user list. One user can be the author of multiple posts.

The view-oriented data format suggests data denormalization, i.e. the display of the post list in such a way whereby each post includes full information about its author, even if the list includes more than one post from the same author. In BEMJSON this format may look like this:

```js
{
    block: 'posts',
    content: [
        {
            block: 'post',
            content: [
                { block: 'userpic', content: 'URL' },
                { block: 'user', content: 'Full Name 1' },
                { elem: 'text', content: 'post text 1' }
            ]
        },
        {
            block: 'post',
            content: [
                { block: 'userpic', content: 'URL' },
                { block: 'user', content: 'Full Name 2' },
                { elem: 'text', content: 'post text 2' }
            ]
        },
        …
    ]
}
```

Let's assume that the source data is saved in the context field `this.ctx.data`. Then the BEMTREE template that does the necessary transformation may look like this:

```js
 block('posts').content()(function() {
    var data = this.ctx.data;

    return data.posts.map(function(post) {
        var user = data.users[post.author];

        return {
            block: 'post',
            content: [
                { block: 'userpic', content: user.userpic },
                { block: 'user', content: user.name },
                { elem: 'text', content: post.text }
            ]
        };
    });
});
```



<a name="inheritage"></a>

### Inheritance

#### Problem

At different [redifinition levels](http://bem.info/method/filesystem/) two different templates for the same BEM entity (`block b1`) are defined. Each of the templates defines its content in the `content` mode.

The content defined at the first level of redefinition should be inherited at the second level, and also some extra content should be added. An analogue of `<xsl:apply-imports/>` is required.

#### Solution

BEMTREE has an analogue of `<xsl:apply-imports/>`. Its implementation is based on the ability to restart the procedure of applying templates to the current context (`apply()`). Therefore it is possible to call the same template that was previously defined for the given context (BEM entities, modes, etc.) or was defined at another level of redefinition.

When evaluating the expression `apply()`, the result obtained by the application of the previously defined template is returned. To avoid an infinite loop, the sub-predicate for the check of a flag (e.g., `_myGuard`) must be added. This flag must be set when executing `apply()`.

```js
// the template at the first level of redefinition
block('b1').content()('text1')

// the template at the second level of redefinition
block('b1').match(!this._myGuard).content()([
    apply({_myGuard:true}),  // get the previous value of content
    'text2'
])
```

Applying the templates to block `b1` will result in the following BEMJSON:

```js
{ block: 'b1', content: 'text1text2' }
```

As a simpler alternative, you can use the `applyNext` construction. It automatically generates a unique name for the flag to prevent an infinite loop.

```js
block('b1').content()('text1')

block('b1').content()([
    applyNext(), // get the previous value of content
    'text2'
])
```

**See also**:

  * [applyNext construction](http://ru.bem.info/technology/bemhtml/current/templating/#applynext)


<a name="wrappingunit"></a>

### Wrapping a block in another block

#### Problem

One block (`b-inner`) must be be wrapped in another block (`b-wrapper`) during the execution of a template, so that one input block corresponds to two blocks nested into each other.

#### Solution

When processing the `b-inner` block in a template in the default mode (the entire element generation), one should modify a fragment of the input tree `this.ctx` (the block `b-wrapper` should be added). This involves the use of the `applyCtx()` construction, which assigns `this.ctx` and applies templates in the empty mode.

To avoid an infinite loop, a special flag (`_wraped`) should be checked when calling `applyCtx()`. This flag must be set before executing `applyCtx()`.

```js
block('b-inner').def()
    .match(!this.ctx._wrapped)(function() {
        var ctx = this.ctx;
        ctx._wrapped = true;
        applyCtx({ block: 'b-wrapper', content: ctx })
   })
```

***
**NB** The `applyCtx()` construction may be used to **replace** a BEM entity in the source tree, if the original content of the block (`this.ctx`) is not used in the argument of `applyCtx()`.

***

**See also**:

  * [The `applyCtx` construction](http://ru.bem.info/technology/bemhtml/current/templating/#applyctx)

<a name="additionbem"></a>

### Adding BEM entities to a BEM tree

#### Problem

A block must be made with rounded corners, which works in all browsers (without using CSS3).

The input BEMJSON may have the following view:

```js
{ block: 'box', content: 'text' }
```
The implementation of rounded corners requires adding four extra elements to the block. The final BEM tree should look like this:

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


#### Solution

The modification of the input BEM tree at BEMTREE level requires writing a template in the `content` mode for the `box` block. The fragment of the input BEM tree is replaced using the `applyCtx()` construction (adding the necessary elements), and the substitution for the original content is done using the `applyNext()` construction.

The BEMHTML template used for this conversion has the following view:

```js
block('box').match(!this.ctx._processed).content()(applyCtx({'ctx._processed':true}, {
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
}))
```

**NB:** The hash with the variable `ctx._processed` set to `true` is passed to the method `applyCtx` as the first parameter to execute the method in the modified context.


**See also**:

  * [The `apply` construction](http://ru.bem.info/technology/bemhtml/current/templating/#apply)
  * [The `applyNext` construction](http://ru.bem.info/technology/bemhtml/current/templating/#applynext)
  * [The `applyCtx` construction](http://ru.bem.info/technology/bemhtml/current/templating/#applyctx)


<a name="check_predicate"></a>

### Checking predicates in a specific order

#### Problem

Template sub-predicates should be checked in a certain order, e.g. first the presence of the `this.world` object should be checked in the context, and then the value of the `this.world.answer` field in that object.

#### Solution

Let's make use the fact that the sub-predicate of a BEMHTML template can be an arbitrary JavaScript expression and can be written in the following form:

```js
match(this.world && this.world.answer === 42)
```

This solution has a disadvantage: the expression won't be optimized during compilation, which will have a negative effect on the template processing speed. In the majority of cases, it is possible and necessary to avoid the need for checking sub-predicates in a strictly specific order.

<a name="binding_html"></a>

### HTML-element binding by id

#### Problem

For every `input` input block, a pair of HMTL elements `<label>` and `<input>` must be generated, so that the value of the attribute `input@id`is generated automatically, is unique and is equal to the value of the attribute `label@for`.

The input data may have this view:

```js
{
  block: 'input',
  label: 'My Input',
  content: 'my value'
}
```

#### Solution

To generate a unique ID that can serve as the value of the attribute `id`, let's use the auxiliary context function `this.generateId()`. Generating two HTML elements based on a single input block requires a template in the `content` mode that forms the required two elements and their attributes:

```js
block('input')(
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
        value: applyNext()
      }
    }
  ]
))
```

#### Conclusion

When creating BEMTREE templates, the same techniques can be used as are applicable to BEMHTML. So if you've come across an interesting solution in a BEMHTML template, feel free to experiment - it is more than likely that the same solution will work for BEMTREE as well.

**See also**:

* [BEMHTML: Examples and recipes](http://bem.info/technology/bemhtml/current/reference/)
* [BEMHTML](http://bem.info/technology/bemhtml/current/reference/)
* [BEMJSON](http://bem.info/technology/bemjson/current/bemjson/)
