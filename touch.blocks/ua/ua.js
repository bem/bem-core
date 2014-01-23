/**
 * @module ua
 * @description Detect some user agent features
 */

modules.define('ua', ['jquery'], function(provide, $) {

var win = window,
    doc = document,
    ua = navigator.userAgent,
    platform = {},
    device = {},
    match;

if(match = ua.match(/Android\s+([\d.]+)/)) {
    platform.android = match[1];
} else if(ua.match(/\sHTC[\s_].*AppleWebKit/)) {
    // фэйковый десктопный UA по умолчанию у некоторых HTC (например, HTC Sensation)
    platform.android = '2.3';
} else if(match = ua.match(/iPhone\sOS\s([\d_]+)/)) {
    platform.ios = match[1].replace(/_/g, '.');
    device.iphone = true;
} else if(match = ua.match(/iPad.*OS\s([\d_]+)/)) {
    platform.ios = match[1].replace(/_/g, '.');
    device.ipad = true;
} else if(match = ua.match(/Bada\/([\d.]+)/)) {
    platform.bada = match[1];
} else if(match = ua.match(/Windows\sPhone.*\s([\d.]+)/)) {
    platform.wp = match[1];
} else {
    platform.other = true;
}

var browser = {};
if(win.opera) {
    browser.opera = win.opera.version();
} else if(match = ua.match(/\sCrMo\/([\d.]+)/)) {
    browser.chrome = match[1];
}

var support = {},
    connection = navigator.connection;

if(connection) {
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
if(plugins && i) {
    var plugin;
    while(plugin = plugins[--i])
        if(plugin.name === 'Shockwave Flash' && (match = plugin.description.match(/Flash ([\d.]+)/))) {
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
        if(landscape !== lastOrient && width !== lastWidth) {
            $win.trigger('orientchange', {
                landscape : landscape,
                width : width,
                height : height
            });

            lastOrient = landscape;
            lastWidth = width;
        }
    });

provide(/** @exports */{
    /**
     * User agent
     * @type String
     */
    ua : ua,

    /**
     * iOS version
     * @type String|undefined
     */
    ios : platform.ios,

    /**
     * Is iPhone
     * @type Boolean|undefined
     */
    iphone : device.iphone,

    /**
     * Is iPad
     * @type Boolean|undefined
     */
    ipad : device.ipad,

    /**
     * Android version
     * @type String|undefined
     */
    android : platform.android,

    /**
     * Bada version
     * @type String|undefined
     */
    bada : platform.bada,

    /**
     * Windows Phone version
     * @type String|undefined
     */
    wp : platform.wp,

    /**
     * Undetected platform
     * @type Boolean|undefined
     */
    other : platform.other,

    /**
     * Opera version
     * @type String|undefined
     */
    opera : browser.opera,

    /**
     * Chrome version
     * @type String|undefined
     */
    chrome : browser.chrome,

    /**
     * Screen size, one of: large, normal, small
     * @type String
     */
    screenSize : screen.width > 320? 'large' : screen.width < 320? 'small' : 'normal',

    /**
     * Device pixel ratio
     * @type Number
     */
    dpr : win.devicePixelRatio || 1,

    /**
     * Connection type, one of: wifi, 3g, 2g
     * @type String
     */
    connection : support.connection,

    /**
     * Flash version
     * @type String|undefined
     */
    flash : support.flash,

    /**
     * Is video supported?
     * @type Boolean
     */
    video : support.video,

    /**
     * Is SVG supported?
     * @type Boolean
     */
    svg : support.svg,

    /**
     * Viewport width
     * @type Number
     */
    width : win.innerWidth,

    /**
     * Viewport height
     * @type Number
     */
    height : win.innerHeight,

    /**
     * Is landscape oriented?
     * @type Boolean
     */
    landscape : lastOrient
});

});
