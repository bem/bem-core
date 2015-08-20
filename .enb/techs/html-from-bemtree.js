/**
 * html-from-bemtree
 * =================
 *
 * Собирает *html*-файл с помощью *bemtree* и *bemhtml*.
 *
 * **Опции**
 *
 * * *String* **bemhtmlFile** — Исходный BEMHTML-файл. По умолчанию — `?.bemhtml.js`.
 * * *String* **bemtreeFile** — Исходный BEMJSON-файл. По умолчанию — `?.bemtree.js`.
 * * *String* **target** — Результирующий HTML-файл. По умолчанию — `?.html`.
 *
 * **Пример**
 *
 * ```javascript
 * nodeConfig.addTech(require('enb/techs/html-from-bemjson'));
 * ```
 */
var vow = require('vow'),
    asyncRequire = require('enb/lib/fs/async-require'),
    dropRequireCache = require('enb/lib/fs/drop-require-cache');

module.exports = require('enb/lib/build-flow').create()
    .name('html-from-bemtree')
    .target('target', '?.html')
    .useSourceFilename('bemtreeFile', '?.bemtree.js')
    .useSourceFilename('bemhtmlFile', '?.bemhtml.js')
    .builder(function(bemtreeFilename, bemhtmlFilename) {
        dropRequireCache(require, bemtreeFilename);
        dropRequireCache(require, bemhtmlFilename);

        return vow.all([
                asyncRequire(bemtreeFilename),
                asyncRequire(bemhtmlFilename)
            ])
            .spread(function(bemtree, bemhtml) {
                var BEMTREE = bemtree.BEMTREE,
                    BEMHTML = bemhtml.BEMHTML;

                return BEMTREE.apply({})
                    .then(function(bemjson) {
                        return BEMHTML.apply(bemjson);
                    });
            });
    })
    .createTech();
