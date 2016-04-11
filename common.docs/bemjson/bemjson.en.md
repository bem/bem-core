# BEMJSON reference

<a id="intro"></a>
## Introduction

**This document** is a guide to the format for describing input data called BEMJSON.

The guide describes:

* BEMJSON's main features distinguishing it from other formats;
* BEMJSON syntax for data description.


**The target audience for this guide**  are web developers and HTML coders who use the [BEM methodology](https://en.bem.info/method/).

The reader is assumed to be familiar with:

* HTML
* JavaScript
* CSS
* [BEM](https://en.bem.info/method/)


The description of tools for generating a BEM tree in BEMJSON format is **beyond the scope of this document**.


<a id="common"></a>
## Key concepts

To describe web page markup in BEM terms, BEM projects introduce the concept of a **BEM tree**, named by analogy to the DOM tree data structure.

A BEM tree is a data structure that describes:

* web page structure – the order and nesting of the blocks;
* names of BEM entities – the names of the blocks, elements, and their modifiers;
* states of BEM entities – the occurrence of logical modifiers and their values;
* arbitrary fields – custom data (hash keys, public API addresses, etc.)

The standard BEM tree format in the bem-core library (and many other BEM projects) is **BEMJSON**.

BEMJSON is a JavaScript data structure (object) with a set of extra conventions on the representation of BEM entities.


<a id="bemcore"></a>
## BEMJSON and data templating in bem-core

A BEMJSON-formatted BEM tree is an integral part of the data templating mechanisms implemented in `bem-core`. BEMJSON is used as an input data format for these template engines:

* [BEMTREE](https://en.bem.info/technology/bemtree/current/bemtree/)
* [BEMHTML](https://en.bem.info/technology/bemhtml/current/intro/)

From a BEMTREE and BEMHTML templates perspective, a portion of input data corresponding to the current BEM tree element (node) and its child elements is contained in the context field `this.ctx`.


**NB** The BEMTREE template engine is used for generating BEMJSON from arbitrary data (the data normally comes in the form of a web page skeleton in BEMJSON format, which gets filled with content element by element as it is processed by the template engine).



<a id="sbor"></a>
## BEMJSON and the build process

Certain build systems, such as [bem-tools](https://en.bem.info/tools/bem/bem-tools/), use files that contain the literal record BEMJSON as a build **declaration**. In `bem-tools`, `bemjson.js`-suffixed files serve this purpose. Based on a BEM tree defined in such files, the build system determines a set of BEM entities whose implementations are to be built from block folders.

In practice, it works like this: first, based on the `bemjson.js` declaration and the build settings, the build tool creates a basic declaration file in `bemdecl.js` format. The latter is then used to build a file in `deps.js` format that describes build dependencies. The dependencies file is a flat list of BEM entities involved in the build, which looks like this:

```js
exports.deps = [
    {
        "block": "page",
        "elem": "css"
    },
    {
        "block": "page",
        "elem": "js"
    },
    {
        "block": "page",
        "elem": "meta"
    },
    {
        "block": "header"
    },
    {
        "block": "content"
    },
    {
        "block": "footer"
    }
];
```

The dependencies file serves as the basis for the subsequent building of tech files from the folders of blocks, elements and modifiers targeted by the declaration. The files are grouped into technology bundles according to their **suffixes**.

The part of a filename that follows the first occurrence of the period is considered a suffix. For example, in the filename `index.bemjson.js`, the suffix is `bemjson.js`.

**See also**:

* [Dependencies in bem-tools](https://en.bem.info/technology/deps/)
* [Building and connecting BEMTREE and BEMHTML technology bundles](https://ru.bem.info/technology/bemhtml/current/templating/#polymorph) (Russian version only)



<a name="bemjson"></a>

## BEMJSON syntax

<a id="datatype"></a>

### Data types

Data types in BEMJSON correspond to data types in JavaScript.

* Strings and numbers:
 * **String** `` 'a' `` `"a"`;
 * **Number** `1` `0.1`;

   A data structure consisting of a single string or number is valid BEMJSON.

* **Boolean**. Values: `true`, `false`.

* **Object** (associative array) '{key: value}' and other types except array.

* **Array** – a list; can include elements of different types (strings, numbers, objects, arrays)
  `[ "a", 1, {key: value}, [ "b", 2, ... ] ]`.

<a id="fields_bemjson"></a>

### BEMJSON special fields

For the BEM domain data and HTML data representation, BEMJSON uses objects with special reserved field names.

<a name="notionbem"></a>

#### Representation of BEM entities

BEM entities are represented in BEMJSON as objects that can contain the following fields:

<table>
<tr>
    <th>Field</th>
    <th>Value</th>
    <th>Value type</th>
    <th>Example</th>
</tr>
<tr>
    <td><code>block</code></td>
    <td>Block name</td>
    <td>String</td>
    <td><code>{ block: 'menu' }</code></td>
</tr>

<tr>
    <td><code>elem</code></td>
    <td>Element name</td>
    <td>String</td>
    <td><code>{ elem: 'item' }</code></td>
</tr>

<tr>
    <td><code>mods</code></td>
    <td>Block modifiers</td>
    <td>Object containing the names and values of block modifiers as key-value pairs:
        <code>{modifier_name: 'modifier_value'}</code>
    </td>
    <td>
        <pre><code>
{
  block: 'link',
  mods: { pseudo: true, color: 'green' }
}
        </code></pre>
    </td>
</tr>

<tr>
    <td><code>elemMods</code></td>
    <td>Element modifiers</td>
    <td>Object containing the names and values of element modifiers as key-value pairs:
        <code>{modifier_name: 'modifier_value'}</code>
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
    <td>Mixed blocks/elements</td>
    <td>Array of objects that describe mixed blocks and elements or Object interpreted as an array consisting of a single element.</td>
    <td>
        <pre><code>
{
  block: 'link',
  mix: [ { block: 'serp-item', elem: 'link' } ]
}
        </code></pre>
    </td>
</tr>
</table>

**See also**:

* [Context-aided completion of BEM entities](https://ru.bem.info/technology/bemhtml/current/templating/#extensionbem) (Russian version only)

<a name="notionhtml"></a>

#### HTML representation

BEMJSON supports the ability to specify certain aspects of the resulting HTML directly in the input data. Admittedly, that is not recommended as common practice, considering that BEMJSON essentially describes data, while actual HTML layout is built at the BEMHMTL template engine level. Still there may be situations that warrant the use of HTML representation at BEMJSON level.


The following fields in BEMJSON are used to control HMTL rendering:

<table>
<tr>
    <th>Field</th>
    <th>Value</th>
    <th>Value type</th>
    <th>Example</th>
</tr>
<tr>
    <td><code>tag</code></td>
    <td>HTML tag for the current entity</td>
    <td><code>String</code></td>
    <td>
        <pre><code>{
  block: 'my-block',
  tag: 'img'
}</code></pre>
    </td>
</tr>
<tr>
    <td><code>attrs</code></td>
    <td>HTML attributes for the current entity</td>
    <td><code>Object</code></td>
    <td>
        <pre><code>{
  block: 'my-block',
  tag: 'img',
  attrs: { src: '//yandex.ru/favicon.ico', alt: '' }
}</code></pre>
    </td>
</tr>
<tr>
    <td><code>cls</code></td>
    <td>Line added to the HTML attribute <code>class</code> (besides automatically generated classes)</td>
    <td><code>String</code></td>
    <td>
        <pre><code>{
  block: 'my-block',
  cls: 'some-blah-class'
}</code></pre>
    </td>
</tr>
<tr>
    <td><code>bem</code></td>
    <td>Flag to cancel the generation of BEM classes in the HTML attribute <code>class</code> for the current entity</td>
    <td><code>Boolean</code></td>
    <td>
        <pre><code>{
  block: 'page',
  tag: 'html',
  bem: false
}</code></pre>
    </td>
</tr>
<tr>
    <td><code>js</code></td>
    <td>Either flag to indicate the presence of client JavaScript in the entity or JavaScript parameters</td>
    <td><code>Boolean|Object</code></td>
    <td>
        <pre><code>{
  block: 'form-input',
  mods: { autocomplete: 'yes' },
  js: {
    dataprovider: { url: 'http://suggest.yandex.ru/...' }
  }
}</code></pre>
    </td>
</tr>
</table>

Note that the names and meanings of these HTML-specific BEMJSON fields are equivalent to those of the corresponding BEMHTML [standard modes](https://en.bem.info/technology/bemhtml/current/reference/#standardmoda) (tags, attributes, classes, etc.) If the same HTML aspects are specified **in both the input data and BEMHTML templates**, the values specified in the BEMHTML templates take priority.

During the HTML generation process, the BEMHTML template engine will perform one of two actions:

* **Merge** the values of the HTML parameters set in the BEMJSON with those specified in the BEMHTML template. Such merging is done only for those parameters where it makes obvious sense: `attrs`, `js`, `mix`.
* **Override** the values of the HTML parameters set in the BEMJSON with those specified in the **BEMHTML template**. This is done for all other values: `tag`, `cls`, `bem`, `content`.


<a name="nesting"></a>

#### Nesting: content

The field `content` is reserved in BEMJSON for the representation of nested BEM entities (BEM tree). The field can take arbitrary BEMJSON as its value:

* A primitive data type (string, number) - the value is used as the content (text) of the HTML element that corresponds to the context entity.
* An object describing a BEM tree - the value is used for generating HTML elements nested inside the HTML element that corresponds to the context entity.

There is no fixed limit on nesting depth for a tree of BEM entities that can be built from the `content` field.



<a id="custom_fields"></a>

#### Custom fields

In addition to special fields that describe the BEM entity and its HTML representation, an object can contain any fields with custom data. The data will be available for use in BEMHTML and BEMTREE templates.

An example of a custom field is the field `url` in a link block:

```js
{
  block: 'link',
  url: '//yandex.ru'
}
```

To see how data from a custom field is used, refer to the section [Condition-based template selection](https://en.bem.info/technology/bemhtml/current/reference/#select_template) of the BEMHTML document.

<a name="customjs"></a>

### Arbitrary JavaScript in BEMJSON

As a format, BEMJSON has fewer restrictions than JSON. Arbitrary JavaScript expressions are all valid BEMJSON.

BEMJSON differs from other data formats in its adherence to the above listed naming conventions for fields in objects (in what concerns the representation of BEM entities and HTML) as well as the object nesting rules.
