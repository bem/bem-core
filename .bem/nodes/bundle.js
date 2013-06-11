require('bem/lib/nodesregistry').decl('BundleNode', {

    'create-browser.js+bemhtml-optimizer-node' : function() {
        return this['create-js-optimizer-node'].apply(this, arguments);
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
