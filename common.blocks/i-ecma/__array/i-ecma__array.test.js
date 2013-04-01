BEM.TEST.decl({ block : 'i-ecma', elem : 'array' }, function(undefined) {

    describe('indexOf specs', function() {
        [
            { data : [1, 2, 3], args : [1], res : 0 },
            { data : [1, 2, 3], args : [4], res : -1 },
            { data : [1, 2, 3, 2], args : [2, 2], res : 3 },
            { data : [1, 2, 3, 2], args : [1, 2], res : -1 },
            { data : [1, 2, 3, 2], args : [2, -1], res : 3 },
            { data : [1, 2, 3, 2], args : [2, -10], res : 1 },
            { data : (function() { var res = [1,,,2]; res[2] = undefined; return res; })(), args : [undefined], res : 2 }
        ].forEach(function(test) {
            it('should be correct result', function() {
                expect(test.data.indexOf.apply(test.data, test.args)).toEqual(test.res);
            });
        });
    });

    describe('forEach specs', function() {
        it('should be callback called on every item', function() {
            var data = [1, 2, 3, 4],
                spy = jasmine.createSpy();

            data[4] = undefined;
            data.forEach(spy);
            expect(spy.callCount).toEqual(5);
        });

        it('should be callback\'s arguments valid', function() {
            var data = [1];
            data.forEach(function(item, i, arr) {
                expect(i).toBe(0);
                expect(item).toBe(1);
                expect(arr).toBe(data);
            });
        });

        it('should be callback\'s context valid', function() {
            var ctx = {};
            [1].forEach(function() {
                expect(this).toBe(ctx);
            }, ctx);
            [1].forEach(function() {
                expect(this).toBe(window);
            });
        });
    });

    describe('map specs', function() {
        it('should be callback called on every item', function() {
            var data = [1, 2, 4, 5],
                spy = jasmine.createSpy();
            data[5] = undefined;

            data.map(spy);
            expect(spy.callCount).toEqual(5);
        });

        it('should be result valid', function() {
            expect([1, 2, 5, 10].map(function(item) {
                return item + 1;
            })).toEqual([2, 3, 6, 11]);
        });

        it('should be callback\'s arguments valid', function() {
            var data = [1];
            data.map(function(item, i, arr) {
                expect(i).toBe(0);
                expect(item).toBe(1);
                expect(arr).toBe(data);
            });
        });

        it('should be callback\'s context valid', function() {
            var ctx = {};
            [1].map(function() {
                expect(this).toBe(ctx);
            }, ctx);
            [1].map(function() {
                expect(this).toBe(window);
            });
        });
    });

    describe('filter specs', function() {
        it('should be callback called on every item', function() {
            var data = [1, 2, 4, 5],
                spy = jasmine.createSpy();
            data[5] = undefined;

            data.filter(spy);
            expect(spy.callCount).toEqual(5);
        });

        it('should be result valid', function() {
            expect([true, false, true].filter(function(item) {
                return item;
            })).toEqual([true, true]);
        });

        it('should be callback\'s arguments valid', function() {
            var data = [1];
            data.filter(function(item, i, arr) {
                expect(i).toBe(0);
                expect(item).toBe(1);
                expect(arr).toBe(data);
            });
        });

        it('should be callback\'s context valid', function() {
            var ctx = {};
            [1].filter(function() {
                expect(this).toBe(ctx);
            }, ctx);
            [1].filter(function() {
                expect(this).toBe(window);
            });
        });
    });

    describe('reduce specs', function() {
        it('should be callback called on every item if no initial value', function() {
            var data = [1, 2, 4, 5],
                spy = jasmine.createSpy();
            data[5] = undefined;

            data.reduce(spy, 1);
            expect(spy.callCount).toEqual(5);
        });

        it('shouldn\'t be callback called on every item if initial value', function() {
            var data = [1, 2, 4, 5],
                spy = jasmine.createSpy();
            data[5] = undefined;

            data.reduce(spy);
            expect(spy.callCount).toEqual(4);
        });

        var fn = function(acc, item) {
            return acc + item;
        };
        [
            { data : [1, 2, 3], args : [fn], res : 6 },
            { data : [1, 2, 3], args : [fn, 4], res : 10 },
            { data : [], args : [fn, 1], res : 1 },
            { data : (function() { var a = []; a[1] = 1; a[2] = 2; a[3] = 3; return a; })(), args : [fn], res : 6 }
        ].forEach(function(test) {
            it('should be correct result', function() {
                expect(test.data.reduce.apply(test.data, test.args)).toEqual(test.res);
            });
        });
    });

    describe('isArray specs', function() {
        it('should array\'s type to be Array', function() {
            expect(Array.isArray([])).toBeTruthy();
            expect(Array.isArray(new Array())).toBeTruthy();
        });

        it('shouldn\'t another types to be Array', function() {
            expect(Array.isArray(undefined)).toBeFalsy();
            expect(Array.isArray(1)).toBeFalsy();
            expect(Array.isArray(true)).toBeFalsy();
            expect(Array.isArray({})).toBeFalsy();
            expect(Array.isArray('test')).toBeFalsy();
            expect(Array.isArray(null)).toBeFalsy();
        });
    });

    describe('some spec', function() {
        it('should be correct result', function() {
            expect([1].some(function() { return true; })).toBeTruthy();
            expect([1].some(function() { return false; })).toBeFalsy();
        });

        it('shouldn\'t call callback for every item if valid item present', function() {
            var data = [1, 2, 3, 4],
                spy = jasmine.createSpy();
            data[5] = undefined;

            data.some(function() { spy(); return true; });

            expect(spy.callCount).toEqual(1);
        });

        it('should call callback for every item if no valid item present', function() {
            var data = [1, 2, 3, 4],
                spy = jasmine.createSpy();
            data[5] = undefined;

            data.some(function() { spy(); return false; });

            expect(spy.callCount).toEqual(5);
        });

        it('should return false if there is not elements', function() {
            expect([].some(function() { return false; })).toBeFalsy();
        });

        it('should be callback\'s arguments valid', function() {
            var data = ['1'],
                spy = jasmine.createSpy();

            data.some(spy);

            expect(spy).toHaveBeenCalledWith('1', 0, data);
        });
    });

    describe('every spec', function() {
        it('should be correct result', function() {
            expect([1, 2].every(function() { return true; })).toBeTruthy();
            expect([1, 2].every(function(item) { return item > 1; })).toBeFalsy();
        });

        it('should be callback for every item if all items are valid', function() {
            var data = [1, 2, 3, 4],
                spy = jasmine.createSpy();

            expect(data.every(function(item) {
                spy();
                return item > 0;
            })).toBeTruthy();

            expect(spy.callCount).toEqual(4);
        });

        it('should\'t be callback for every item if invalid item present', function() {
            var data = [1, 2, 3, 4],
                spy = jasmine.createSpy();

            expect(data.every(function(item) {
                spy();
                return item < 1;
            })).toBeFalsy();

            expect(spy.callCount).toEqual(1);
        });

        it('should return true if there is not elements', function() {
            expect([].every(function() { return true; })).toBeTruthy();
            expect([].every(function() { return false; })).toBeTruthy();
        });

        it('should be callback\'s arguments valid', function() {
            var data = ['1'],
                spy = jasmine.createSpy();

            data.every(spy);

            expect(spy).toHaveBeenCalledWith('1', 0, data);
        });
    });

});
