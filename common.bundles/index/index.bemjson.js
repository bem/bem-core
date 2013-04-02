({
    block: 'b-page',
    title: 'Обработчик события click',
    head: [
        { elem: 'css', url: '_index.css', ie: false },
        { elem: 'css', url: '_index.ie.css', ie: 'lt IE 8' },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: '_index.js' }
    ],
    content: {
        block: 'b-square',
        js: true
    }
});