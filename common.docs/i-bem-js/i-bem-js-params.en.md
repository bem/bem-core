<a name="data-bem"></a>

Passing parameters to a block instance
--------------------------------------

### Syntax for passing parameters

Block parameters are stored in the `data-bem` attribute of an HTML element, and are passed to the block at the time of initialization. Use parameters to control the behavior of a specific block instance that is bound to a given HTML element.

The value of the `data-bem` attribute must contain valid JSON describing a hash in the format:

-   key — `{String}`, name of the block.
-   value — `{Object}`, parameters of the block. If this instance of the block does not need
    parameters, specify an empty hash `{}`.

```html
<div class="my-block i-bem" data-bem="{ " my-block="my-block">
</div>
```

If an HTML element has [multiple JS blocks bound to it](./i-bem-js-html-binding.en.md#multiple-js-blocks-bound-to-it), the value of the `data-bem` attribute must contain the parameters for each of them:

```html
<div class="my-block another-block i-bem" data-bem="{ " my-block="my-block">
</div>
```

**Element parameters** are passed via the `data-bem` attribute of the element DOM node. For example, you can pass parameters to the `my-elem` element in the `my-block` block like this:

```html
<div class="my-block i-bem" data-bem="{ " my-block="my-block">
 <div class="my-block__my-elem" data-bem="{ " my-block__my-elem="my-block__my-elem">
 </div>
</div>
```

Specifying the block name in the parameters provides the following advantages:

-   Blocks are initialized faster, since the value of the `class` attribute doesn't have to be parsed.
-   Multiple blocks can be put on the same HTML element without having to multiply its attributes.

### Accessing parameters from a block instance

You can access parameters from a block instance via the `this.params` field. Its value is a hash of parameters from the `data-bem` attribute of the block DOM element (`this.domElem`).

For example, you can access parameters of the `my-block` block like this:

```html
<div class="my-block i-bem" data-bem="{ " my-block="my-block">
</div>
```

```js
modules.define('my-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod : {
        'js' : {
            'inited': function() {
                console.log(this.params); // { foo : 'bar' }
            }
        }
    }
}));

});
```

To get element parameters, use the `elemParams` method of the block instance. It accepts a string argument with the element name or its jQuery object. It returns a hash of element parameters.

```html
<div class="my-block i-bem" data-bem="{ " my-block="my-block">
 <div class="my-block__my-elem" data-bem="{ " my-block__my-elem="my-block__my-elem">
 </div>
</div>
```

```js
modules.define('my-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod : {
        'js' : {
            'inited': function() {
                    console.log(this.elemParams('my-elem')); // { foo : 'bar' }
            }
        }
    }
}));

});
```
