# clearfix

This block provides a CSS class that implements the **clearfix** layout hack, also known as the [Easy Clearing Method](http://www.456bereastreet.com/archive/200603/new_clearing_method_needed_for_ie7/). The hack allows you to clear wrapping for elements with the CSS `float` property, without making any changes to the document's original HTML structure.

This block can be used as a container for elements with the `float` property, or mixed with such a container.

Example when used as a container:

```bemjson
[{
    block : 'header',
    attrs : { style : 'border : 2px solid blue;' },
    content : 'Top element'
},
{
    block : 'clearfix',
    attrs : { style : 'border : 2px dotted yellow;' },
    content : [
    {
        block : 'float',
        attrs : { style : 'float : left; border : 1px solid green;' },
        content : 'Floating item 1'
    },
    {
        block : 'float',
        attrs : { style : 'float : left; border : 1px solid green;' },
        content : 'Floating item 2'
    }]
},
{
    block : 'footer',
    attrs : { style : 'border : 2px solid red' },
    content : 'Footer'
}]
```

Mixed with a container block:

```bemjson
[{
    block : 'header',
    attrs : { style : 'border : 2px solid blue;' },
    content : 'Top element'
},
{
    block : 'some-container',
    mix : [{ block : 'clearfix' }],
    attrs : { style : 'border : 2px dotted yellow;' },
    content : [
    {
        block : 'float',
        attrs : { style : 'float : left; border : 1px solid green;' },
        content : 'Floating item 1'
    },
    {
        block : 'float',
        attrs : { style : 'float : left; border : 1px solid green;' },
        content : 'Floating item 2'
    }]
},
{
    block : 'footer',
    attrs : { style : 'border : 2px solid red' },
    content : 'Footer'
}]
```

## Public block technologies

The block is implemented in:

* `css`.
