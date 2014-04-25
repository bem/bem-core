modules.require(['jquery'], function($) {
    $('button').on('pointerpress', onPress);

    var doc = $(document);

    function onPress(e) {
        console.log(e.type);
        doc.on('pointerrelease', onRelease);
    }

    function onRelease(e) {
        console.log(e.type);
        doc.off('pointerrelease', onRelease);
    }
});
