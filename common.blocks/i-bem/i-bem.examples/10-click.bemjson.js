({
    block: 'b-page',
    title: 'Обработчик события click',
    head: [
        { elem: 'css', url: '_10-click.css', ie: false },
        { elem: 'css', url: '_10-click.ie.css', ie: 'lt IE 8' },
        { block: 'i-jquery', elem: 'core' },
        { elem: 'js', url: '10-click.js' }
    ],
    content: {
        block: 'b-square',
        js: true
    }
})