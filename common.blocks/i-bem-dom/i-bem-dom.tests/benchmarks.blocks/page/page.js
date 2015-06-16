modules.require(['i-bem-dom__init', 'jquery'], function(init, $) {

$(function() {
    var timeStart = Date.now();
    init();
    var time = Date.now() - timeStart;
    $('body').append($('<p>' + time + '</p>'));
});

});
