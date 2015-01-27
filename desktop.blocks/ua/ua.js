/**
 * @module ua
 * @description Detect some user agent features (works like jQuery.browser in jQuery 1.8)
 * @see http://code.jquery.com/jquery-migrate-1.1.1.js
 */

modules.define('ua', function(provide) {

var ua = navigator.userAgent.toLowerCase(),
    match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [],
    matched = {
        browser : match[1] || '',
        version : match[2] || '0'
    },
    browser = {};

if(matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
}

if(browser.chrome) {
    browser.webkit = true;
} else if(browser.webkit) {
    browser.safari = true;
}

/**
 * @exports
 * @type Object
 */
provide(browser);

});
