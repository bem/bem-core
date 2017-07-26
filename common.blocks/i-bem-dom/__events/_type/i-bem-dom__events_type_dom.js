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

            function handlerWrapper(fn, data) {
                return function(e) {
                    var instance, targetDomNode, domNode = e.target;

                    if(isInstance) {
                        instance = ctx;

                        if(params.bindClassName) {
                            do {
                                if(domNode.classList.contains(params.bindClassName)) {
                                    targetDomNode = domNode;
                                    break;
                                }
                                if(domNode === e.currentTarget) break;
                            } while(domNode = domNode.parentElement);

                            targetDomNode || (instance = undefined);
                        }
                    } else {
                        do {
                            if(!targetDomNode) {
                                if(domNode.classList.contains(params.bindClassName)) {
                                    targetDomNode = domNode;
                                } else continue;
                            }

                            if(domNode.classList.contains(params.ctxClassName)) {
                                instance = getEntity(domNode, ctx);
                                break;
                            }
                        } while(domNode = domNode.parentElement);
                    }

                    if(instance) {
                        e.data = data;

                        params.bindEntityCls && (e.bemTarget = getEntity(targetDomNode || this, params.bindEntityCls));
                        fn.apply(instance, arguments);
                    }
                };
            }

            return new this._eventManagerCls(params, handlerWrapper, eventBuilder);
        }
    });

provide({ EventManagerFactory : EventManagerFactory });

});
