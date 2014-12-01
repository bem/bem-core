# Hello, BEMHTML!

This guide will help you try the `BEMHTML Templaiting Engine` and understand the basics of working with it in 7 easy steps:

 * [Step 1. Initialize Your Project](#init).
 * [Step 2. Make a Page Template](#page).
 * [Step 3. Add a Block](#block).
 * [Step 4. Create a Template for a Greeting](#template).
 * [Step 5. Rewrite the Template: Add Generation of a List Based on a Data Array](#array).
 * [Step 6. Edit the Template: Modify HTML Tags ](#tags).
 * [Step 7. Add Style and Behavior (CSS and JS)](#cssjs).

<a name="init"></a>
## Step 1. Initialize Your Project

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
process for the requested page.  For example: `http://localhost:8080/desktop.bundles/index/`

**Note: During the first build process libraries `bemhtml` and `bem-bl` will be copied
to the project directory**

### For more details see:
 * [The Local and Global Installation of `bem-tools`](https://bem.info/tools/bem/installation/)

<a name="page"></a>
## Step 2. Make a Page Template

Templates for static HTML pages are located in the directory `desktop.bundles`.

Create a template for an empty page (let's call it `test`):

    $ ./node_modules/.bin/bem create -l desktop.bundles -b test

**Note: BEMJSON is a language for describing a template for a static page (AKA: BEM-Tree)**

Let's take a look at the source code for the page (`desktop.bundles/test/test.bemjson.js`):

    ({
        block: 'page',
        title: 'test',
        head: [
            { elem: 'css', url: '_test.css' }
        ],
        scripts: [{ elem: 'js', url: '_test.js' }],
        content: [
           {
               block: 'content',
               content: [
                   'block content'
               ]
           }
        ]
    })


Here we are using the block `page` form the library `bem-bl`.

**Note: The library `bem-bl` was previously linked to the project before you cloned
the project.  After the first `build process` is complete these libraries are cloned
to the project directory and we can use and modify its blocks.**

To see the result browse to: (http://localhost:8080/desktop.bundles/test/test.html)

### More information
  * [library bem-bl](https://bem.info/libs/bem-bl/);
  * [bem-tools reference](https://bem.info/tools/bem/bem-tools/);
  * [BEMJSON tutorial](https://bem.info/technology/bemjson/current/bemjson/).

<a name="block"></a>
## Step 3. Add a Block

Let's make a very simple template. We will place a block with the text
`Hello, BEMHTML!` on the `test` page.

Edit the source BEMJSON: `desktop.bundles/test/test.bemjson.js`

    ({
        block: 'page',
        title: 'test',
        head: [
            { elem: 'css', url: '_test.css' }
        ],
        scripts: [{ elem: 'js', url: '_test.js' }],
        content: [
           {
               block: 'hello',
               content: [
                   'Hello, BEMHTML!'
               ]
           }
        ]
    })

Above code explained:
 * We define the `content` property of the `page` block as a new block `hello`.
 * Add the greeting `'Hello, BEMHTML!'` to the `content` property of the block `hello`.

**Note: If the block's template is not defined, HTML for the block is generated from
the `bemhtml` library by default.**

Let's take a look at the result. A snippet of HTML code describing our page looks like this:

    <body class="page">
      <div class="hello">Hello, BEMHTML!</div>
    </body>

We can see that:
 * The `div` element corresponds to `hello` block.
 * The block's name is used for the `class` attribute.

<a name="template"></a>
## Step 4. Create a Template for a Greeting

Let's make the block `hello` more universal, by allowing it to generate a greeting for
a specified name.  Therefore we could use `hello` with different names on various pages
or as many times as we want on the same page.

**Note: BEMJSON object can contain arbitrary data-fields which templates can make use of.**

Add a property in our block called `'name'` which will be used to store a user's name.
Edit `test.bemjson.js`:

    { block: 'hello', name: 'BEMHTML' }

In order to generate our greeting text, we need to create files for the block `hello`
and define a BEMHTML template in the project.

The blocks defined for our project are located under the `desktop.blocks` directory.
To create a directory for the block and all other necessary files, use the command `bem create`:

    $ ./node_modules/.bin/bem create -l desktop.blocks -b hello

Create the template for the `hello` block in the `desktop.blocks/hello/hello.bemhtml` file:

    block('hello')(
        content()(function() {
            return [ 'Hello, ', this.ctx.name, '!' ];
        })
    );

The code above defines the following:
 * `block('hello')` - template predicate (it will be called during processing
 of `hello` block with the standard mode `content`)
 * `['Hello, ', this.ctx.name, '!']` - template body (This array will be concatenated
 and inserted into the HTML of the block)
 * `this.ctx.name` - a context field, which corresponds to `name` field of source
 BEMJSON block object.

**Note: HTML will be generated by default templates of BEMHTML library, unless
the HTML generation is redefined in the custom templates.**

The Resulting HTML:

    <body class="page">
      <div class="hello">Hello, BEMHTML!</div>
    </body>

### More information
 * [BEMHTML syntax](https://bem.info/technology/bemhtml/current/bemhtml-js-syntax/)
 * [The standard modes](https://bem.info/technology/bemhtml/current/reference/#standardmoda)
 * [The context fields](https://bem.info/technology/bemhtml/current/reference/#context_field)

## Step 5. Rewrite the Template: Add Generation of a List Based on a Data Array <a name="array"></a>

As the project develops we might have a need for a more complex version of the block `hello`.
For example we might want to show at the same time a few greetings from a list of names.

In this case it's more convenient to use an array of names in the place of
the single name data-field `'name'`.  To do so, change the content of `test.bemjson.js` to:

    { block: 'hello', names: ['BEM', 'BEMJSON', 'BEMHTML'] }

According to the BEM methodology each greeting should be represented as an `element` called `'item'`
placed inside the `hello` block.
Or in other words, we want to have the following BEM-tree after the template was used:

    {
        block: 'hello',
        content: [
            { elem: 'item', content: 'BEM' },
            { elem: 'item', content: 'BEMJSON' },
            { elem: 'item', content: 'BEMHTML' }
        ]
    }

**Note: BEMHTML templates allow us to modify BEMJSON (BEM-tree) in runtime.**

The BEMHTML template should generate one `BEM-Element` named 'item' for every element in
the `'names'` array.  This template is in the `hello.bemhtml` file:

    block('hello')(
        content()(function() {
            return this.ctx.names.map(function(user) {
                return { elem: 'item', content: user };
            });
        }),

        elem('item').content()(function() {
            return ['Hello, ', applyNext(), '!'];
        })
    );


Here, in the template body was used:

 * templates with mode [`content`](https://bem.info/technology/bemhtml/current/reference/#content);
 * construction [`applyNext`](https://ru.bem.info/technology/bemhtml/current/templating/#applynext) (currently available in Russian only),
 which is a recursive call of templates implementation procedure;
 * construction [`Array.prototype.map`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map)
 defined in EcmaScript 5.


**Note: Arbitrary JS expressions can be used for predicate and template body **

As a result of the templates' application we will get an HTML page with three greetings:

    <div class="hello">
      <div class="hello__item">Hello, BEM!</div>
      <div class="hello__item">Hello, BEMJSON!</div>
      <div class="hello__item">Hello, BEMHTML!</div>
    </div>

<a name="tags"></a>
## Step 6. Edit the Template: Modify HTML Tags

At first glance it might seem that the use of an element `item` is unnecessary.
However when we re-format 'the greeting block' in the form of a unordered-list, you will understand
why it is useful.

In this case we need to change the BEMHTML-template just a bit.  Instead of the default `<div>` tag,
we can define tags for the `hello` block and it's elements `item`(s).  The block and element's
tag can be defined using the `'tag'` property:

    block('hello')(
        tag()('ul'),

        content()(function() {
            return this.ctx.names.map(function(user) {
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


Now we have:
 * Block and elements with the [tag](https://bem.info/technology/bemhtml/current/reference/#tag) property.

The Resulting HTML:

    <ul class="hello">
      <li class="hello__item">Hello, BEM!</li>
      <li class="hello__item">Hello, BEMJSON!</li>
      <li class="hello__item">Hello, BEMHTML!</li>
    </ul>

<a name="cssjs"></a>
## Step 7. Add Style and Behavior (CSS and JS)

When the block-level in the `project-stub` was created, files for three technologies
were generated by default:
 * `hello.bemhtml`;
 * `hello.browser.js`;
 * `hello.styl`.

The block implementation in both Stylus and JS technologies  is not a part of the BEMHTML templating engine.
However in any real-world project CSS and JS are used together with the BEMHTML.

**Note: BEMHTML places the names of BEM-Entities into the `class` attribute of HTML-elements.
Only *class*-selectors are used for CSS.**

For example: to color all blocks green, all you would have to do is add the following CSS
to `desktop.blocks/hello/hello.styl`:

    .hello
        color: green

To add special `i-bem` event handlers to any block or element you need to define the [js](https://bem.info/technology/bemhtml/current/reference/#js) property as `true`.

    block('hello')(
		js()(true),
        ...
    )



If the `js` property is set to true, BEMHTML adds `i-bem` to the list of classes,
and also an attribute to store important `i-bem` information (`data-bem` by default,
see [the mode `jsAttr`](https://bem.info/technology/bemhtml/current/reference/#jsAttr)).
JS framework when initializing adds HTML-class `hello_js_inited`:

    <div class="hello i-bem hello_js_inited" data-bem='{"hello":{}}'>

**Note: The block `i-bem` is a part of the `bem-bl` library.  `bem-bl` is a framework
which allows us to write a JavaScript for the client side.**

In the following example when the block is clicked, the warning-message with the text `Hello` will be shown.

    modules.define('hello', ['i-bem__dom'], function(provide, BEMDOM) {

        provide(BEMDOM.decl({ block : this.name }, {
            onSetMod : {
                'js' : {
                    'inited' : function() {
                        this.bindTo('click', function() { alert('Hello') });
                    }
                }
            }
        }));

    });


### More information
 * [JS-framework guide `i-bem.js`](https://bem.info/technology/i-bem/2.3.0/i-bem-js/) (Russian only).
 * [JavaScript for BEM: The Main Terms](https://bem.info/articles/bem-js-main-terms/)

## Further reading
 * [BEMHTML guide book](https://bem.info/technology/bemhtml/current/intro/)
 * [`bem-bl` blocks library](https://bem.info/libs/bem-bl/)
 * [BEM methodology](https://bem.info/method/)
