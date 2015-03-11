modules.define('spec', ['objects'], function(provide, objects) {

describe('objects', function() {
    var undef;

    /* jshint -W001 */
    describe('extend', function() {
        it('should returns target object', function() {
            var target = {};
            objects.extend(target).should.be.equal(target);
        });

        it('should copy properties to target object', function() {
            objects.extend(
                { p1 : 'v1', p2 : 'v2' },
                { p2 : 'v2_2', p3 : false },
                { p4 : null },
                { p5 : 0 })
                    .should.be.eql({
                        p1 : 'v1',
                        p2 : 'v2_2',
                        p3 : false,
                        p4 : null,
                        p5 : 0
                    });
        });

        it('should return new object if target is not a object', function() {
            objects.extend(true, { p1 : 'v1' })
                .should.be.eql({ p1 : 'v1' });
        });

        it('should return new object if target is null', function() {
            objects.extend(null, { p1 : 'v1' })
                .should.be.eql({ p1 : 'v1' });
        });

        it('should properly extend object with "hasOwnProperty" property', function() {
            objects.extend(
                { hasOwnProperty : '' },
                { hasOwnProperty : 'has' })
                    .should.be.eql({ hasOwnProperty : 'has' });
        });
    });

    describe('isEmpty', function() {
        it('should returns true for object with no properties', function() {
            objects.isEmpty({}).should.be.true;
        });

        it('should returns false for object with properties', function() {
            objects.isEmpty({ prop : '' }).should.be.false;
        });

        it('should properly checks object with "hasOwnProperty" property', function() {
            objects.isEmpty({ hasOwnProperty : true }).should.be.false;
        });
    });

    describe('each', function() {
        it('should iterates over all properties', function() {
            var res = [],
                undef;

            objects.each(
                { a : 'str', b : false, c : null, d : undef },
                function(val, key) {
                    res.push({ val : val, key : key });
                });

            res.should.be.eql([
                { val : 'str', key : 'a' },
                { val : false, key : 'b' },
                { val : null, key : 'c' },
                { val : undef, key : 'd' }
            ]);
        });

        it('should properly iterates over object with "hasOwnProperty" property', function() {
            var res = [];
            objects.each(
                { hasOwnProperty : false },
                function(val, key) {
                    res.push({ val : val, key : key });
                });
            res.should.be.eql([{ val : false, key : 'hasOwnProperty' }]);
        });

        it('should call callback with given context', function() {
            var ctx = {};
            objects.each(
                { key : 'val' },
                function() {
                    this.should.be.equal(ctx);
                },
                ctx);
        });
    });
});

provide();

});
