var vm = require('vm'),
    vow = require('vow'),
    generate = require('bem-xjst').generate;

module.exports = function(code) {
    var out = generate(code),
        ctx = {
            Vow : vow,
            exports : exports,
            console : console
        };

     vm.runInNewContext(out, ctx);

     return exports;
};
