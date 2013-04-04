modules.define(
    'utils',
    ['identify', 'inherit', 'nextTick'],
    function(provide, identify, inherit, nextTick) {

provide({
    identify : identify,

    inherit : inherit.inherit,
    inheritSelf : inherit.inheritSelf,

    nextTick : nextTick
});

});