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
            var getEntity = this._getEntity,
                getEventActors = this._getEventActors.bind(this);

            function handlerWrapper(fn, data) {
                return function(e) {
                    var actors = getEventActors(e, ctx, params, isInstance);

                    if(!actors.instance) return;

                    e.data = data;

                    params.bindEntityCls && (e.bemTarget = getEntity(actors.targetDomNode || this, params.bindEntityCls));
                    fn.apply(actors.instance, arguments);
                };
            }

            return new this._eventManagerCls(params, handlerWrapper, eventBuilder);
        }
    });

provide({ EventManagerFactory : EventManagerFactory });

});
