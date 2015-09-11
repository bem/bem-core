module.exports = function(bh) {
    bh.match('example', function(ctx) {
        ctx.content({
            block : 'test-pointer',
            content : {
                elem : 'inner1',
                content : {
                    elem : 'inner2',
                    content : {
                        elem : 'inner3'
                    }
                }
            }
        });
    });
};
