# Hello, BEMHTML!

This guide will help you try the `BEMHTML Templaiting Engine` and understand the basics of working with it in 7 easy steps:

 * [Step 1. Initialize Your Project](#init).
 * [Step 2. Make a Page Template](#page).
 * [Step 3. Add a Block](#block).
 * [Step 4. Create a Template for a Greeting](#template).
 * [Step 5. Rewrite the Template: Add Generation of a List Based on a Data Array](#array).
 * [Step 6. Edit the Template: Modify HTML Tags ](#tags).
 * [Step 7. Add Style and Behavior (CSS and JS)](#cssjs).

## Step 1. Initialize Your Project <a name="init"></a>

To make a new BEMHTML project, we clone a repository-template, which was previously prepared by BEM developers, and then we install the `bem-tools` utilities.

Execute the following commands in the terminal:

Clone the project-template into the local directory `project-hello`:

    $ git clone https://github.com/bem/project-stub.git project-hello

Change current working directory to the project directory:

    $ cd project-hello

Install `bem-tools` locally:

    $ npm install

`bem-tools` is now located under: `./project-hello/node_modules/.bin/bem`

**Note: This step is required, and `bem` command line tool is used throughout all 
the examples below.**


`bem server` will help organize your development cycle (edit, compile, review, edit, ...).
To start it, execute the following command from the project root folder:

    $ ./node_modules/.bin/bem server


The server recieves a connection at `http://localhost:8080/` and begins the build 
process for the requested page.  For example: `http://localhost:8080/desktop.bundles/index`

**Note: During the first build process libraries `bemhtml` and `bem-bl` will be copied 
to the project directory**

### For more details see:
 * [The Local and Global Installation of `bem-tools`](http://bem.info/tools/bem/installation/)

## Step 2. Make a Page Template <a name="page"></a>

Templates for static HTML pages are located in the directory `desktop.bundles`.

Create a template for an empty page (let's call it `test`):

    $ ./node_modules/.bin/bem create -l desktop.bundles -b test 

**Note: BEMJSON is a language for describing a template for a static page (AKA: BEM-Tree)**

Let's take a look at the source code for the page (`desktop.bundles/test/test.bemjson.js`):

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

Here we are using the block `b-page` form the library `bem-bl`.

**Note: The library `bem-bl` was previously linked to the project before you cloned 
the project.  After the first `build process` is complete these libraries are cloned 
to the project directory and we can use and modify its blocks.**

To see the result browse to: (http://localhost:8080/desktop.bundles/test/test.html)

## More information:
  * [Library bem-bl](http://bem.github.com/bem-bl/index.en.html);
  * [bem-tools reference](http://bem.info/tools/);
  * **Russian only:** [BEMJSON reference](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#%D0%A1%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%81-bemjson).

## Step 3. Add a Block <a name="block"></a>

Let's make a very simple template. We will place a block with the text 
`Hello, BEMHTML!` on the `test` page.

Edit the source BEMJSON: `desktop.bundles/test/test.bemjson.js`

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

Above code explained:
 * We define the `content` property of the `b-page` block as a new block `b-hello`.
 * Add the greeting `'Hello, BEMHTML!'` to the `content` property of the block `b-hello`.

**Note: If the block's template is not defined, HTML for the block is generated from 
the `bemhtml` library by default.**

Let's take a look at the result. A snippet of HTML code describing our page looks like this:

    <body class="b-page__body b-page">
      <div class="b-hello">Hello, BEMHTML!</div>
    </body>

We can see that:
 * The `div` element corresponds to `b-hello` block.
 * The block's name is used for the `class` attribute.


## Step 4. Create a Template for a Greeting <a name="template"></a>

Let's make the block `b-hello` more universal, by allowing it to generate a greeting for 
a specified name.  Therefore we could use `b-hello` with different names on various pages 
or as many times as we want on the same page.

**Note: BEMJSON object can contain arbitrary data-fields which templates can make use of.**

Add a property in our block called `'name'` which will be used to store a user's name.  
Edit `test.bemjson.js`:

    { block: 'b-hello', name: 'BEMHTML' }

In order to generate our greeting text, we need to create files for the block `b-hello` 
and define a BEMHTML template in the project.

The blocks defined for our project are located under the `desktop.blocks` directory. 
To create a directory for the block and all other necessary files, use the command `bem create`:

    $ ./node_modules/.bin/bem create -l desktop.blocks -b b-hello

Create the template for the `b-hello` block in the `desktop.blocks/b-hello/b-hello.bemhtml` file:

    block b-hello, content: ['Hello, ', this.ctx.name, '!']

The code above defines the following:
 * `block b-hello, content` - template predicate (it will be called during processing 
 of `b-hello` block with the standard mode `content`)
 * `['Hello, ', this.ctx.name, '!']` - template body (This array will be concatenated 
 and inserted into the HTML of the block)
 * `this.ctx.name` - a context field, which corresponds to `name` field of source 
 BEMJSON block object.

**Note: HTML will be generated by default templates of BEMHTML library, unless 
the HTML generation is redefined in the custom templates.** 

The Resulting HTML:

    <body class="b-page__body b-page">
      <div class="b-hello">Hello, BEMHTML!</div>
    </body>

### **Russian only** More details can be found here:
 * [BEMJSON reference-book. BEMHTML syntax](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#%D0%A1%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%81-bemhtml)
 * [BEMJSON reference-book. The standard modes](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#%D0%A1%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%BD%D1%8B%D0%B5-%D0%BC%D0%BE%D0%B4%D1%8B)
 * [BEMJSON reference-book. The context fields](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#%D0%9F%D0%BE%D0%BB%D1%8F-%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%B0)

## Step 5. Rewrite the Template: Add Generation of a List Based on a Data Array <a name="array"></a>

As the project develops we might have a need for a more complex version of the block `b-hello`.
For example we might want to show at the same time a few greetings from a list of names.

In this case it's more convenient to use an array of names in the place of 
the single name data-field `'name'`.  To do so, change the content of `test.bemjson.js` to:

    { block: 'b-hello', names: ['BEM', 'BEMJSON', 'BEMHTML'] }

According to the BEM methodology each greeting should be represented as an `element` called `'item'` 
placed inside the `b-hello` block.
Or in other words, we want to have the following BEM-tree after the template was used:

    {
        block: 'b-hello',
        content: [
            { elem: 'item', content: 'BEM' },
            { elem: 'item', content: 'BEMJSON' },
            { elem: 'item', content: 'BEMHTML' }
        ]
    }

**Note: BEMHTML templates allow us to modify BEMJSON (BEM-tree) in runtime.**

The BEMHTML template should generate one `BEM-Element` named 'item' for every element in 
the `'names'` array.  This template is in the `b-hello.bemhtml` file:

    block b-hello {
        content: this.ctx.names.map(function(user) { return { elem: 'item', content: user } })

        elem item, content: ['Hello, ', applyNext(), '!']
    }


Here, in the template body was used:

 * a predicates' shorthand notation with use of `{}`. It's equivalent to two templates 
 with predicates `block b-hello, content` and `block b-hello, elem item, content`;
 * templates with mode [`content`](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#content)(Russian only);
 * construction [`applyNext`](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#applynext)(Russian only), 
 which is a recursive call of templates implementation procedure;
 * construction [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map) 
 defined in EcmaScript 5.


**Note: Arbitrary JS expressions can be used for predicate and template body **

As a result of the templates' application we will get an HTML page with three greetings:

    <div class="b-hello">
      <div class="b-hello__item">Hello, BEM!</div>
      <div class="b-hello__item">Hello, BEMJSON!</div>
      <div class="b-hello__item">Hello, BEMHTML!</div>
    </div>

## Step 6. Edit the Template: Modify HTML Tags <a name="tags"></a>

At first glance it might seem that the use of an element `item` is unnecessary. 
However when we re-format 'the greeting block' in the form of a unordered-list, you will understand 
why it is useful.

In this case we need to change the BEMHTML-template just a bit.  Instead of the default `<div>` tag, 
we can define tags for the `b-hello` block and it's elements `item`(s).  The block and element's 
tag can be defined using the `'tag'` property:

    block b-hello {

        tag: 'ul'

        content: this.ctx.names.map(function(user) { return { elem: 'item', content: user } })

        elem item {

            tag: 'li'
            
            content: ['Hello, ', applyNext(), '!']
        }
    }


Now we have:
 * 4 templates in total: `block b-hello, tag`, `block b-hello, content`, `block b-hello, 
 elem item, tag`, `block b-hello, elem item, content`.  (the nested notation is used to imitate 
 similar behavior as CSS Selectors).
 * Block and elements with the `'tag'` property: **Russian Only:** [BEM Documentation: Tag](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#tag)(Russian only).

The Resulting HTML:

    <ul class="b-hello">
      <li class="b-hello__item">Hello, BEM!</li>
      <li class="b-hello__item">Hello, BEMJSON!</li>
      <li class="b-hello__item">Hello, BEMHTML!</li>
    </ul>

## Step 7. Add Style and Behavior (CSS and JS) <a name="cssjs"></a>

When the block-level in the `project-stub` was created, files for three technologies 
were generated by default: 
 * `b-hello.bemhtml`;
 * `b-hello.css`;
 * `b-hello.js`.

The block implementation in both CSS and JS technologies  is not a part of the BEMHTML templating engine. 
However in any real-world project CSS and JS are used together with the BEMHTML.

**Note: BEMHTML places the names of BEM-Entities into the `class` attribute of HTML-elements. 
Only *class*-selectors are used for CSS.**

For example: to color all blocks green, all you would have to do is add the following CSS 
to `desktop.blocks/b-hello/b-hello.css`:

    .b-hello
    {
        color: green
    }

To add special `i-bem` event handlers to any block or element you need to define the js property as `true`.
(More information in Russian Only: [js property](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#js)
    
    block b-hello, js: true


If the `js` property is set to true, BEMHTML adds `i-bem` to the list of classes, 
and also an attribute to store important `i-bem` information (`onclick` by default, 
see **Russian only** [the mode `jsAttr`](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md#jsattr)). 
JS framework when initializing adds HTML-class `b-hello_js_inited`:

    <div class="b-hello i-bem b-hello_js_inited" onclick="return {&quot;b-hello&quot;:{}}">

**Note: The block `i-bem` is a part of the `bem-bl` library.  `bem-bl` is a framework 
which allows us to write a JavaScript for the client side.**

In the following example when the block is clicked, the warning-message with the text `Hello` will be shown.

    BEM.DOM.decl('b-hello', {
        onSetMod: {
        'js': {
            'inited': function() {
                this.bindTo('click', function() { alert('Hello') }); 
                }   
            }   
        }
    })


### For more details see:
 * [JS-framework guide `i-bem.js`](http://h.yandex.net/?http%3A%2F%2Fbem.github.com%2Fbem-bl%2Fsets%2Fcommon-desktop%2Fi-bem%2Fi-bem.ru.html)(Russian only).

## Further reading:
 * [BEMHTML guide book](https://github.com/bem/bemhtml/blob/master/common.docs/reference/reference.ru.md)(Russian only)
 * [`bem-bl` blocks library](http://bem.github.com/bem-bl/index.en.html)
 * [BEM methodology](http://bem.info/method/)
