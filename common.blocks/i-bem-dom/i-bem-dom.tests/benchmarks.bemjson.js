({
    block : 'page',
    title : 'v3 benchmarks',
    head : {
        elem : 'js', url : 'https://yastatic.net/jquery/2.1.3/jquery.js'
    },
    styles : { elem : 'css', url : '_benchmarks.css' },
    scripts : { elem : 'js', url : '_benchmarks.js' },
    content : Array.apply(null, { length : 1000 }).map(function() {
        return {
            block : 'b1',
            js : true,
            content : {
                block : 'b2',
                js : true
            }
        };
    })
});
