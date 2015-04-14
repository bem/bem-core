module.exports = function(bh) {
    bh.match('i-bem__i18n', function(ctx, json) {
        if(!json) return '';

        var keyset = json.keyset,
            key = json.key,
            params = json.params || {};

        if(!(keyset || key))
            return '';

        /**
         * Consider `content` is a reserved param that contains
         * valid bemjson data
         */
        if(typeof json.content === 'undefined' || json.content !== null) {
            params.content = bh.apply(json.content);
        }

        return bh.lib.i18n(keyset, key, params);
    });
};
