exports.baseTechName = 'browser.js+bemhtml';

exports.techMixin = {
    getBuildResults : function(decl, levels, output, opts) {
        var _this = this;

        return this.__base(decl, levels, output, opts)
            .then(function(res) {

                return _this.concatBemxjst('bemtree', res, output, opts)
                    .then(function() {
                        return res;
                    });
            });
    }
};
