({
    block : 'page',
    title : 'page__conditional-comments',
    head : [
        {
            elem : 'conditional-comment',
            condition : '<= IE 8',
            content : { elem : 'css', url : '60-conditional-comment.ie.css' }
        },
        {
            elem : 'conditional-comment',
            condition : '! IE',
            content : 'Not for IE'
        },
        {
            elem : 'conditional-comment',
            condition : '> IE 8',
            msieOnly : false,
            content : 'For IE9+ and all other browsers'
        }
    ],
    scripts : [
        {
            elem : 'conditional-comment',
            condition : 'lte IE 8',
            content : { elem : 'js', url : 'https://yastatic.net/es5-shims/0.0.1/es5-shims.min.js' }
        }
    ]
})
