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
var asyncRequire = require('enb/lib/fs/async-require'),
    dropRequireCache = require('enb/lib/fs/drop-require-cache');

module.exports = require('enb/lib/build-flow').create()
    .name('html-from-bemtree')
    .target('destTarget', '?.html')
    .useSourceFilename('bemhtmlTarget', '?.bemhtml.js')
    .useSourceFilename('bemtreeTarget', '?.bemtree.js')
    .builder(function(bemhtmlFilename, bemtreeFilename) {
        dropRequireCache(require, bemtreeFilename);

        return asyncRequire(bemtreeFilename).then(function(bemtree) {
            dropRequireCache(require, bemhtmlFilename);

            return asyncRequire(bemhtmlFilename).then(function(bemhtml) {
                return bemtree.BEMTREE.apply({}).then(function(bemjson) {
                    if(!bemhtml.BEMHTML && bemhtml.lib) {
                        return bemhtml.apply(bemjson);
                    } else {
                        return bemhtml.BEMHTML.apply(bemjson);
                    }
                });
            });
        });
    })
    .createTech();
