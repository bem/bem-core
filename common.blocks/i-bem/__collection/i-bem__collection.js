/**
 * Base class for collections
 * Create collection of similar objects
 * @abstract
 * @inherit Array
 */
BEM.decl('i-bem__collection', null, {

    /**
     * Get method names that will be implemented in collection
     * @return {Array}
     */
    getMethods : function() {

        return ['on', 'onFirst', 'un', 'trigger',
            'setMod', 'toggleMod', 'delMod',
            'afterCurrentEvent', 'destruct'];

    },

    /**
     * Get base prototype for collection
     * @return {Object}
     */
    getBase : function() {

        return {

            __constructor : function(a) {

                a && this.push.apply(this, a);

            },

            applyMethod : function(method, args) {

                this.forEach(function(context) {
                    context[method] && context[method].apply(context, args);
                });

                return this;

            },

            callMethod : function() {

                var args = this.slice.call(arguments);

                return this.applyMethod(args.shift(), args);

            }

        };

    },

    /**
     * Create collection instance
     * @param {Array} a list of similar objects
     * @return {Object}
     */
    create : function(a) {

        var decl = this.getBase(),
            Collection;

        this.getMethods()
            .forEach(function(method) {
                if(!decl[method]) {
                    decl[method] = function() {
                        return this.applyMethod(method, arguments);
                    };
                }
            });
        Collection = jQuery.inherit(Array, decl);
        this.create = function(a) {
            return new Collection(a);
        };

        return this.create(a);

    }

});
