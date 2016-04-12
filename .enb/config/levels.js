var path = require('path'),
    PROJECT_LEVELS = {
        common : ['common.blocks'],
        desktop : ['common.blocks', 'desktop.blocks'],
        touch : ['common.blocks', 'touch.blocks']
    },
    SPEC_LEVEL = {
        path : path.join('libs', 'bem-pr', 'spec.blocks'),
        check : false
    };

/**
 * Returns list of levels for specified platform.
 *
 * @param {String} platform - platform name (desktop or touch)
 * @param {Object} [opts]
 * @param {Boolean} [opts.specs] — adds level for specs
 */
module.exports = function (platform, opts) {
    opts = opts || {};

    var levels = PROJECT_LEVELS[platform];

    if(opts.specs) {
        return [].concat(
            SPEC_LEVEL,
            levels
        );
    }

    return levels;
};
