/**
 * html-from-bemtree
 * =================
 *
 * Собирает *html*-файл с помощью *bemtree* и *bemhtml*.
 *
 * **Опции**
 *
 * * *String* **bemhtmlTarget** — Исходный BEMHTML-файл. По умолчанию — `?.bemhtml.js`.
 * * *String* **bemtreeTarget** — Исходный BEMJSON-файл. По умолчанию — `?.bemtree.js`.
 * * *String* **destTarget** — Результирующий HTML-файл. По умолчанию — `?.html`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb/techs/html-from-bemjson'));
 * ```
 */
var vm = require('vm'),
    vow = require('vow'),
    vfs = require('enb/lib/fs/async-fs'),
    asyncRequire = require('enb/lib/fs/async-require'),
    dropRequireCache = require('enb/lib/fs/drop-require-cache');

module.exports = require('enb/lib/build-flow').create()
    .name('html-from-bemtree')
    .target('destTarget', '?.html')
    .useSourceFilename('bemtreeTarget', '?.bemtree.js')
    .useSourceFilename('bemhtmlTarget', '?.bemhtml.js')
    .builder(function(bemtreeFilename, bemhtmlFilename) {
        dropRequireCache(require, bemhtmlFilename);

        return vow.all([
                vfs.read(bemtreeFilename, 'utf-8'),
                asyncRequire(bemhtmlFilename)
            ])
            .spread(function(bemtree, bemhtml) {
                var ctx = vm.createContext({
                    Vow : vow,
                    console : console,
                    setTimeout : setTimeout
                });

                vm.runInContext(bemtree, ctx);

                return [ctx.BEMTREE, bemhtml.BEMHTML];
            })
            .spread(function(BEMTREE, BEMHTML) {
                return BEMTREE.apply({})
                    .then(function(bemjson) {
                        return BEMHTML.apply(bemjson);
                    });
            });
    })
    .createTech();
