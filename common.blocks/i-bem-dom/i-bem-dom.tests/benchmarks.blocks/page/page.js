modules.require(['i-bem-dom', 'i-bem-dom__init'], function(bemDom, init) {
    var timeStart = Date.now();
    init();
    var time = Date.now() - timeStart;
    bemDom.append(document.body, '<p>' + time + '</p>');
});
