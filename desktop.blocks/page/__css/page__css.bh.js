module.exports = function(bh) {

    bh.match('page__css', function(ctx, json) {
        if(json.hasOwnProperty('ie')) {
            var ie = json.ie;
            if(ie === true) {
                var url = json.url;
                return [6, 7, 8, 9].map(function(v) {
                    return { elem : 'css', url : url + '.ie' + v + '.css', ie : 'IE ' + v };
                });
            } else {
                var hideRule = !ie?
                    ['gt IE 9', '<!-->', '<!--'] :
                    ie === '!IE'?
                        [ie, '<!-->', '<!--'] :
                        [ie, '', ''];
                return [
                    { html : '<!--[if ' + hideRule[0] + ']>' + hideRule[1], tag : false },
                    json,
                    { html : hideRule[2] + '<![endif]-->', tag : false }
                ];
            }
        }
    });

};
