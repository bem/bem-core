({
    block : 'page',
    title : 'Пример подключения es5-shims для IE',
    head : [
        '<!--[if lt IE 9]>',
        { elem : 'js', url : 'https://yastatic.net/es5-shims/0.0.1/es5-shims.min.js' },
        '<![endif]-->'
    ],
    content : 'Подключение es5-shims для IE'
})
