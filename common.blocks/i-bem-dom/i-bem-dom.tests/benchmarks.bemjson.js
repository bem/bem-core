({
    block : 'page',
    title : 'v3 benchmarks',
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
