require('bem/lib/nodesregistry').decl('BundleNode', {

    'create-browser.js-optimizer-node' : function() {
        return this['create-js-optimizer-node'].apply(this, arguments);
    },

    'create-node.js-optimizer-node' : function() {
        return this['create-js-optimizer-node'].apply(this, arguments);
    }

});