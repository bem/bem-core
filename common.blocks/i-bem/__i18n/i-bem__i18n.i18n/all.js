var PATH = require('path'),
    FS = require('fs');

module.exports = {
    'all' : {
        '' : FS.readFileSync(PATH.resolve(__dirname, './core.js'), 'utf8')
    }
};
