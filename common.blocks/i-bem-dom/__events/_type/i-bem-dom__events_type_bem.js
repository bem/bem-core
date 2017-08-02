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

    // specialEvents = $.event.special,
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
                    ' ' + e.type :
                    bemInternal.buildModPostfix(e.modName, e.modVal) :
                ' ' + e);

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
            var getEntity = this._getEntity;

            function handlerWrapper(fn, data, fnCtx, fnId) {
                return function(e) {
                    var detail = e.detail,
                        fns = detail.fns,
                        originalEvent = detail.originalEvent;

                    if(fns[fnId]) return;

                    var instance, instanceDomNodes, targetDomNode, domNode = e.target;

                    if(isInstance) {
                        instance = ctx;
                        instanceDomNodes = instance.domNodes;

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
                                instanceDomNodes = [domNode];
                                break;
                            }
                        } while(domNode = domNode.parentElement);
                    }

                    if(instance &&
                        (!detail.propagationStoppedDomNode ||
                            !dom.contains(instanceDomNodes[0], detail.propagationStoppedDomNode))) { // TODO: check about [0]
                        originalEvent.data = data;
                        // TODO: do we really need both target and bemTarget?
                        originalEvent.bemTarget = originalEvent.target;
                        fns[fnId] = true;
                        fn.call(fnCtx || instance, originalEvent, detail.data);

                        if(originalEvent.isPropagationStopped()) {
                            e.stopPropagation();
                            detail.propagationStoppedDomNode = instanceDomNodes[0];
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
            var i = 0, domNode;
            while(domNode = ctx.domNodes[i++])
                domNode.dispatchEvent(
                    createCustomEvent(
                        event,
                        {
                            data : data,
                            fns : {},
                            propagationStoppedDomNode : null,
                            originalEvent : originalEvent
                        }));
        }
    },

    EventManagerFactory : EventManagerFactory
});

});
