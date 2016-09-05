({
    block : 'page',
    title : 'Пример подключения es5-shims для IE',
    head : [
        { html : '<!--[if lt IE 9]>', tag : false },
        { elem : 'js', url : 'https://yastatic.net/es5-shims/0.0.1/es5-shims.min.js' },
        { html : '<![endif]-->', tag : false }
    ]
})
