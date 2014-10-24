module.exports = function(registry) {

registry.decl('BundleNode', {

    getTechs : function() {
        if(~this.getPath().indexOf('test-bemtree')) {
            return [
                'bemdecl.js',
                'deps.js',
                'css',
                'bemtree',
                'bemhtml',
                'browser.js+bemhtml',
                'html'
            ];
        }

        return [
            'bemjson.js',
            'bemdecl.js',
            'deps.js',
            'css',
            'bemhtml',
            'browser.js+bemhtml',
            'html'
        ];
    },

    'create-html-node' : function(tech, _) {
        var args = [].slice.call(arguments, 1);

        ~this.getPath().indexOf('test-bemtree') &&
            (tech = 'bemtree-html');

        return this.__base.apply(this, [tech].concat(args));
    },

    'create-browser.js-optimizer-node' : function() {
        return this['create-js-optimizer-node'].apply(this, arguments);
    },

    'create-node.js-optimizer-node' : function() {
        return this['create-js-optimizer-node'].apply(this, arguments);
    },

    'create-bemtree.xjst-optimizer-node' : function() {
        return this['create-bemhtml-optimizer-node'].apply(this, arguments);
    },

    'create-bemtree.xjst.js-optimizer-node' : function() {
        return this['create-bemtree-xjst-optimizer-node'].apply(this, arguments);
    }

});

};
