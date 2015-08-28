require('./utils/setup');

var EOL = require('os').EOL,
    compiler = require('bem-xjst'),
    compile = require('bem-xjst').compile,
    baseCode = require('./utils/i-bem-contents'),
    compileWithVow = require('./utils/compile-with-vow');

describe('BEMTREE', function () {
    it('should throw if no base templates', function () {
        (function () {
            var template = compile('block("bar").content()("baz");');

            template.apply();
        }).should.throw('Match failed, no templates found');
    });

    it('should expect Vow', function () {
        (function () {
            var template = compile(baseCode);

            template.apply();
        }).should.throw('Vow is not defined');
    });

    it('should return promise', function () {
        var template = compileWithVow(baseCode);

        return template.apply()
            .should.be.fulfilled;
    });

    it('should process bemjson', function () {
        var template = compileWithVow([
            baseCode,
            'block("bar").content()("baz");'
        ].join(EOL));

        return template.apply({ block : 'bar' })
            .should.become({
                block : 'bar',
                content : 'baz',
                mods : {}
            });
    });

    it('should return json', function () {
        var template = compileWithVow([
            baseCode,
            [
                'match(!this.data).mode("")(function() {',
                '    return apply("", {',
                '        data: {},',
                '        ctx: { expected : true }',
                '    })',
                '});'
            ].join(EOL)
        ].join(EOL));

        return template.apply({})
            .should.become({ expected : true });
    });

    it('should return promise with data', function () {
        var template = compileWithVow([
            baseCode,
            [
                'match(!this.data).mode("")(function() {',
                '    return apply("", {',
                '        data: {},',
                '        ctx: this.doAsync(function() {',
                '            return Vow.timeout({ text : "bla" }, 10);',
                '        })',
                '    })',
                '});'
            ].join(EOL)
        ].join(EOL));

        return template.apply({})
            .should.become({ text : 'bla' });
    });

    it('should return rejected promise', function () {
        var template = compileWithVow([
            baseCode,
            [
                'match(!this.data).mode("")(function() {',
                '    return apply("", {',
                '        data: {},',
                '        ctx: this.doAsync(function() {',
                '            var error = new Error("The requested resource is not found.");',
                '            return Vow.reject(error);',
                '        })',
                '    })',
                '});'
            ].join(EOL)
        ].join(EOL));

        return template.apply({})
            .should.be.rejectedWith('The requested resource is not found.');
    });
});
