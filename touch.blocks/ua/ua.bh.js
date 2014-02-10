module.exports = function(bh) {
    bh.match('ua', function(ctx) {
        ctx.js(true);
    });
};
