var path = require('path'),
    fs = require('fs'),
    filename = path.join(__dirname, '..', '..', 'i-bem.bemtree');

module.exports = fs.readFileSync(filename, 'utf-8');
