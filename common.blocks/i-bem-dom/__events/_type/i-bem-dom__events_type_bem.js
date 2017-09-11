/**
 * @module i-bem-dom__events_type_bem
 */
modules.define(
    'i-bem-dom__events_type_bem',
    [
        'i-bem-dom__events',
        'i-bem__internal',
        'inherit',
        'functions',
        'dom',
        'identify',
        'events'
    ],
    function(
        provide,
        bemDomEvents,
        bemInternal,
        inherit,
        functions,
        dom,
        identify,
        events) {

var EVENT_PREFIX = '__bem__',
    MOD_CHANGE_EVENT = 'modchange',

    eventsInUse = {},

    createCustomEvent = function(eventName, detail) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, detail);
        return event;
    },

    eventBuilder = function(e, params, eventMethod) {
        var event = EVENT_PREFIX + params.bindEntityCls.getEntityName() +
            (typeof e === 'object'?
                e instanceof events.Event?
                    ':' + e.type :
                    bemInternal.buildModPostfix(e.modName, e.modVal) :
                ':' + e);

        eventMethod === 'on' && // TODO: count usage and remove on 'un'
            !eventsInUse[event] &&
                (eventsInUse[event] = true);

        return event;
    },

    /**
     * @class EventManagerFactory
     * @augments i-bem-dom__events:EventManagerFactory
     * @exports i-bem-dom__events_type_bem:EventManagerFactory
     */
    EventManagerFactory = inherit(bemDomEvents.EventManagerFactory,/** @lends EventManagerFactory.prototype */{
        /** @override */
        _createEventManager : function(ctx, params, isInstance) {
            var getEntity = this._getEntity,
                getEventActors = this._getEventActors.bind(this);

            function handlerWrapper(fn, data, fnCtx, fnId) {
                return function(e) {
                    var detail = e.detail,
                        fns = detail.fns,
                        originalEvent = detail.originalEvent;

                    if(fns[fnId]) return;

                    var instance = getEventActors(e, ctx, params, isInstance).instance;

                    if(!instance) return;

                    if(!detail.propagationStoppedDomNodes || !dom.contains(instance.domNodes, detail.propagationStoppedDomNodes)) {
                        originalEvent.data = data;
                        // TODO: do we really need both target and bemTarget?
                        originalEvent.bemTarget = originalEvent.target;
                        fns[fnId] = true;
                        fn.call(fnCtx || instance, originalEvent, detail.data);

                        if(originalEvent.isPropagationStopped()) {
                            e.stopPropagation();
                            detail.propagationStoppedDomNodes = instance.domNodes;
                        }
                    }
                };
            }

            return new this._eventManagerCls(params, handlerWrapper, eventBuilder);
        }
    });

provide({
    /**
     * @param {BemDomEntity} ctx
     * @param {String|Object|events:Event} e Event name
     * @param {Object} [data]
     */
    emit : function(ctx, e, data) {
        var originalEvent;
        if(typeof e === 'string') {
            originalEvent = new events.Event(e, ctx);
        } else if(e.modName) {
            originalEvent = new events.Event(MOD_CHANGE_EVENT, ctx);
        } else if(!e.target) {
            e.target = ctx;
            originalEvent = e;
        }

        var event = eventBuilder(e, { bindEntityCls : ctx.__self }, 'emit');

        if(eventsInUse[event]) {
            var fns = {};
            ctx.domNodes.forEach(function(domNode) {
                domNode.dispatchEvent(
                    createCustomEvent(
                        event,
                        {
                            data : data,
                            fns : fns,
                            propagationStoppedDomNodes : null,
                            originalEvent : originalEvent
                        }));
            });
        }
    },

    EventManagerFactory : EventManagerFactory
});

});
