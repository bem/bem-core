module.exports = function(bh) {
    function addLabel(ctx, json) {
        ctx.content([
            { elem : 'label', content : json.elem.slice(-1) },
            ctx.content()
        ], true);
    }

    bh
        .match('test-pointer', function(ctx) {
            ctx.content([
                { elem : 'label', content : 'root' },
                ctx.content()
            ], true);
        })
        .match('test-pointer__inner1', addLabel)
        .match('test-pointer__inner2', addLabel)
        .match('test-pointer__inner3', addLabel);
};
