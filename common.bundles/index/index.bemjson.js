({
    block: 'page',
    title: 'Обработчик события click',
    head: [
        { elem: 'css', url: '_index.css', ie: false },
        { elem: 'css', url: '_index.ie.css', ie: 'lt IE 8' },
        { elem: 'js', url: '_index.js' }
    ],
    content: [{
        block: 'b-square',
        js: {id:1}
    },{
        block: 'b-square',
        js: {id:1}
    }]
});
