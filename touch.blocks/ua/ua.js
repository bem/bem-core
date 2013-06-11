modules.define('i-bem__dom', function(provide, DOM) {

var win = DOM.win,
    doc = document, // NOTE: не DOM.doc т.к. в DOM.doc в случае _conflicts_no может быть не document, а нода скоупа
    ua = navigator.userAgent,
    platform = {},
    device = {},
    match;

if (match = ua.match(/Android\s+([\d.]+)/)) {
    platform.android = match[1];
} else if (ua.match(/\sHTC[\s_].*AppleWebKit/)) {
    // фэйковый десктопный UA по умолчанию у некоторых HTC (например, HTC Sensation)
    platform.android = '2.3';
} else if (match = ua.match(/iPhone\sOS\s([\d_]+)/)) {
    platform.ios = match[1].replace(/_/g, '.');
    device.iphone = true;
} else if (match = ua.match(/iPad.*OS\s([\d_]+)/)) {
    platform.ios = match[1].replace(/_/g, '.');
    device.ipad = true;
} else if (match = ua.match(/Bada\/([\d.]+)/)) {
    platform.bada = match[1];
} else if (match = ua.match(/Windows\sPhone.*\s([\d.]+)/)) {
    platform.wp = match[1];
} else {
    platform.other = true;
}

var browser = {};
if (win.opera) {
    browser.opera = win.opera.version();
} else if (match = ua.match(/\sCrMo\/([\d.]+)/)) {
    browser.chrome = match[1];
}

var support = {},
    connection = navigator.connection;

if (connection) {
    var connections = {};
    connections[connection.ETHERNET] = connections[connection.WIFI] = 'wifi';
    connections[connection.CELL_3G] = '3g';
    connections[connection.CELL_2G] = '2g';
    support.connection = connections[connection.type];
}

var videoElem = doc.createElement('video');
support.video = !!(videoElem.canPlayType && videoElem.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, ''));

support.svg = !!(doc.createElementNS && doc.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);

var plugins = navigator.plugins,
    i = plugins.length;
if (plugins && i) {
    var plugin;
    while(plugin = plugins[--i])
        if (plugin.name == 'Shockwave Flash' && match = plugin.description.match(/Flash ([\d.]+)/)) {
            support.flash = match[1];
            break;
        }
}

// http://stackoverflow.com/a/6603537
var lastOrient = win.innerWidth > win.innerHeight,
    lastWidth = win.innerWidth,
    $win = $(win).bind('resize', function() {
        var width = win.innerWidth,
            height = win.innerHeight,
            landscape = width > height;

        // http://alxgbsn.co.uk/2012/08/27/trouble-with-web-browser-orientation/
        // check previous device width to disallow Android shrink page and change orientation on opening software keyboard
        if (landscape !== lastOrient && width !== lastWidth) {
            $win.trigger('orientchange', {
                landscape: landscape,
                width: width,
                height: height
            });

            lastOrient = landscape;
            lastWidth = width;
        }
    });

DOM.decl('ua', {
    onSetMod: {
        js: function() {
            var self = this.__self;
            this
                .setMod('platform',
                    self.ios ? 'ios' :
                    self.android ? 'android' :
                    self.bada ? 'bada' :
                    self.wp ? 'wp' :
                    self.opera ? 'opera' :
                    'other')
                .setMod('browser',
                    self.opera ? 'opera' :
                    self.chrome ? 'chrome' :
                    '')
                .setMod('ios', self.ios ? self.ios.charAt(0) : '')
                .setMod('ios-subversion', self.ios ? self.ios.match(/(\d\.\d)/)[1].replace('.', '') : '')
                .setMod('screen-size', self.screenSize)
                .setMod('svg', self.svg ? 'yes' : 'no')
                .setMod('orient', self.landscape ? 'landscape' : 'portrait')
                .bindToWin(
                    'orientchange',
                    function(e, data) {
                        self.width = data.width;
                        self.height = data.height;
                        self.landscape = data.landscape;
                        this.setMod('orient', data.landscape ? 'landscape' : 'portrait');
                    });
        }
    }
}, {
    ua: ua,
    ios: platform.ios,
    iphone: device.iphone,
    ipad: device.ipad,
    android: platform.android,
    bada: platform.bada,
    wp: platform.wp,
    other: platform.other,
    opera: browser.opera,
    chrome: browser.chrome,
    screenSize: screen.width > 320 ? 'large' : screen.width < 320 ? 'small' : 'normal',
    dpr: win.devicePixelRatio || 1,
    connection: support.connection,
    flash: support.flash,
    video: support.video,
    svg: support.svg,
    width: win.innerWidth,
    height: win.innerHeight,
    landscape: lastOrient
});

provide(DOM);

});
