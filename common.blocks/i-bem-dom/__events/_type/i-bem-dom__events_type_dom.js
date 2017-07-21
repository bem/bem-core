/**
 * @module i-bem-dom__events_type_dom
 */
modules.define(
    'i-bem-dom__events_type_dom',
    [
        'i-bem-dom__events',
        'inherit'
    ],
    function(
        provide,
        bemDomEvents,
        inherit) {

var eventBuilder = function(e) {
        return e;
    },
    /**
     * @class EventManagerFactory
     * @augments i-bem-dom__events:EventManagerFactory
     * @exports i-bem-dom__events_type_dom:EventManagerFactory
     */
    EventManagerFactory = inherit(bemDomEvents.EventManagerFactory,/** @lends EventManagerFactory.prototype */{
        /** @override */
        _createEventManager : function(ctx, params, isInstance) {
            var getEntity = this._getEntity;

            function wrapperFn(fn) {
                return function(e) {
                    var instance;

                    if(isInstance) {
                        instance = ctx;
                    } else {
                        // TODO: we could optimize all these "closest" to a single traversing
                        var entityDomNode = e.target;
                        do {
                            entityDomNode.classList.contains(params.ctxSelector) &&
                                (instance = getEntity(entityDomNode, ctx));
                        } while(instance || (entityDomNode = entityDomNode.parentNode));
                    }

                    if(instance) {
                        params.bindEntityCls && (e.bemTarget = getEntity(this, params.bindEntityCls));
                        fn.apply(instance, arguments);
                    }
                };
            }

            return new this._eventManagerCls(params, wrapperFn, eventBuilder);
        }
    });

provide({ EventManagerFactory : EventManagerFactory });

});
