/* jshint node:true */
/* global suite, setup, test, BEM, i18n */

var assert = require('assert'),
    fs = require('fs'),
    path = require('path');

require('vm').runInThisContext(
    fs.readFileSync(path.resolve(__dirname, '../i-bem__i18n.i18n/core.js')));

BEM.I18N.lang('ru');

suite('i18n legacy stuff', function() {

    setup(function() {
        BEM.I18N.lang('ru');

        BEM.I18N.decl('i-tanker__months', {
            'n1' : 'Январь',
            'n2' : 'Февраль',
            'n3' : 'Март',
            'n4' : 'Апрель',
            'n5' : 'Май',
            'n6' : 'Июнь',
            'n7' : 'Июль',
            'n8' : 'Август',
            'n9' : 'Сентябрь',
            'n10' : 'Октябрь',
            'n11' : 'Ноябрь',
            'n12' : 'Декабрь',
            'short1' : 'янв',
            'short2' : 'фев',
            'short3' : 'мрт',
            'short4' : 'апр',
            'short5' : 'май',
            'short6' : 'июн',
            'short7' : 'июл',
            'short8' : 'авг',
            'short9' : 'сен',
            'short10' : 'окт',
            'short11' : 'ноя',
            'short12' : 'дек',
            'name' : function(params) {
                return (function(params) {
                    var month = i18n['tanker']['months'][(params['case'] || 'n') + params.month]();
                    return Boolean(params.lowercase)? month.toLowerCase() : month;
                }).call(this, params);
            }

        }, { 'lang' : 'ru' });

    });

    suite('Direct call', function() {
        test('BEM.I18N', function() {
            assert.equal('Январь', BEM.I18N('i-tanker__months', 'n1'));
        });

        test('i18n', function() {
            assert.equal('Январь', i18n['tanker']['months']['n1']());
        });
    });

    suite('Dynamic call', function() {
        test('BEM.I18N', function() {
            assert.equal('Январь', BEM.I18N('i-tanker__months', 'name', { month : 1 }));
            assert.equal('январь', BEM.I18N('i-tanker__months', 'name', { month : 1, lowercase : true }));
            assert.equal('янв', BEM.I18N('i-tanker__months', 'name', { month : 1, case : 'short' }));
        });

        test('i18n', function() {
            assert.equal('Январь', i18n['tanker']['months']['name']({ month : 1 }));
            assert.equal('январь', i18n['tanker']['months']['name']({ month : 1, lowercase : true }));
            assert.equal('янв', i18n['tanker']['months']['name']({ month : 1, case : 'short' }));
        });
    });

});
