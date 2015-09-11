module.exports = function(bh) {
    bh.match('example', function(ctx) {
        ctx.content({ tag : 'button', content : 'Press me' });
    });
};
