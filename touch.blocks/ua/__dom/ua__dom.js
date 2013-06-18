modules.define('i-bem__dom', ['ua'], function(provide, ua, DOM) {

DOM.decl('ua', {
    onSetMod : {
        js : {
            inited : function() {
                this
                    .setMod('platform',
                        ua.ios ? 'ios' :
                            ua.android ? 'android' :
                                ua.bada ? 'bada' :
                                    ua.wp ? 'wp' :
                                        ua.opera ? 'opera' :
                                            'other')
                    .setMod('browser',
                        ua.opera ? 'opera' :
                            ua.chrome ? 'chrome' :
                                '')
                    .setMod('ios', ua.ios ? ua.ios.charAt(0) : '')
                    .setMod('ios-subversion', ua.ios ? ua.ios.match(/(\d\.\d)/)[1].replace('.', '') : '')
                    .setMod('screen-size', ua.screenSize)
                    .setMod('svg', ua.svg ? 'yes' : 'no')
                    .setMod('orient', ua.landscape ? 'landscape' : 'portrait')
                    .bindToWin(
                        'orientchange',
                        function(e, data) {
                            ua.width = data.width;
                            ua.height = data.height;
                            ua.landscape = data.landscape;
                            this.setMod('orient', data.landscape ? 'landscape' : 'portrait');
                        });
            }
        }
    }
    },
    ua);

provide(DOM);

});