var PATH = require('path'),
    BEM = require('bem'),
    Q = BEM.require('q');

exports.baseTechName = 'vanilla.js';

exports.techMixin = {

    getSuffixes : function() {
        return ['vanilla.js', 'browser.js', 'js'];
    },

    getCreateSuffixes : function() {
        return ['browser.js'];
    },

    getBuildSuffixesMap : function() {
        return {
            'js' : this.getSuffixes()
        };
    }

};
