var PATH = require('path');

exports.baseTechName = 'browser.js';

exports.techMixin = {

    /**
     * Build and return result of build of specified prefixes
     * for specified suffix.
     *
     * @param {Promise * String[]} prefixes Prefixes to build from.
     * @param {String} suffix Suffix to build result for.
     * @param {String} outputDir Output dir name for build result.
     * @param {String} outputName Output name of build result.
     * @returns {Promise * String} Promise for build result.
     */
    getBuildResult: function(prefixes, suffix, outputDir, outputName) {

        var context = this.context,
            opts = context.opts;

        return this.__base(prefixes, suffix, outputDir, outputName)
            .then(function(res) {

                return opts.declaration
                    .then(function(decl) {

                        decl = decl.depsByTechs;

                        // do nothing if decl.depsByTechs.js.bemhtml doesn't exists
                        if (!decl || !decl.js || !decl.js.bemhtml) return res;

                        // js+bemhtml decl
                        decl = { deps: decl.js.bemhtml };

                        var bemhtmlTech = context.createTech('bemhtml'),
                            output = PATH.resolve(
                                opts.outputDir,
                                opts.outputName
                            ),
                            // get `.js` build prefixes
                            prefixes = bemhtmlTech.getBuildPrefixes(
                                bemhtmlTech.transformBuildDecl(decl),
                                context.getLevels()
                            ),
                            // and build bemhtml based on them
                            bemhtmlResults = bemhtmlTech.getBuildResults(
                                prefixes,
                                PATH.dirname(output) + PATH.dirSep,
                                PATH.basename(output)
                            );

                        return bemhtmlResults
                            .then(function(r) {

                                // put bemhtml templates at the top of builded js file
                                res.push(r['bemhtml.js']);

                                // and return new result
                                return res;

                            });

                    });

            });

    }

};
