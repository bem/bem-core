module.exports = function(bh) {
    bh.match('ua', function(ctx, json) {
        ctx.applyBase();
        ctx.content([
            json.content,
            {
                tag : false,
                html : [
                    '(function(d,n){',
                        'd.documentElement.className+=',
                        '" ua_svg_"+(d[n]&&d[n]("http://www.w3.org/2000/svg","svg").createSVGRect?"yes":"no");',
                    '})(document,"createElementNS");'
                ].join('')
            }
        ], true);
    });
};
