/* jshint node:true */
/* global suite, setup, test, BEM */

var assert = require('assert'),
    fs = require('fs'),
    path = require('path');

require('vm').runInThisContext(
    fs.readFileSync(path.resolve(__dirname, '../i-bem__i18n.i18n/core.js')));

BEM.I18N.lang('ru');

suite('BEM.I18N Complex tests', function() {

    setup(function() {

        BEM.I18N.decl('i-tanker__dynamic', {
            'gender' : function(params) {
                return (function(params) { return params[params.gender]; }).call(this, params);
            },
            'plural' : function(params) {
                return (function(params) {
                    var count = isNaN(parseInt(params.count, 10))? 0 : params.count,
                        lastNumber = count % 10,
                        lastNumbers = count % 100;

                    return (lastNumber === 1 && lastNumbers !== 11)?
                            params.one : (
                                    (lastNumber > 1 && lastNumber < 5) && (lastNumbers < 10 || lastNumbers > 20)?
                                        params.some : params.many );
                }).call(this, params);
            },
            'plural_adv' : function(params) {
                return (function(params) {
                    var count = isNaN(parseInt(params.count, 10))? 0 : params.count;
                    if(count === 0) { return params.none; }
                    return this.keyset('i-tanker__dynamic').key('plural', {
                            'count' : params['count'],
                            'one' : params['one'],
                            'some' : params['some'],
                            'many' : params['many']
                        });
                }).call(this, params);
            },
            'toggle' : function(params) {
                return (function(params) {
                    return Boolean(params.condition)? params['true'] : params['false'];
                }).call(this, params);
            }
        }, { 'lang' : 'ru' });

        BEM.I18N.decl('i-date', {
            'months-gen' : function(param) {
                return param['num'];
            }
        }, { 'lang' : 'ru' });

        BEM.I18N.decl('i-locale', {
            'at-all-help' : 'по всей помощи ',
            'at-this-section' : 'в этом разделе',
            'at-yandex' : 'в Яндексе',
            'empty-request' : 'Задан пустой поисковый запрос',
            'feedback' : 'Обратная связь',
            'keyboard' : 'Клавиатура',

            'not-found-in-section' : function(params) {
                return 'В разделе «' + '<b>' + params['section'] + '</b>' + '» ничего не было найдено.' +
                    '<br/>' + 'Показаны результаты поиска по всем разделам Помощи.';
            },

            'pages-found-for-help' : function(params) {
                return this.keyset('i-tanker__dynamic').key('plural_adv', {
                        'count' : params['count'],
                        'none' : 'Ничего не найдено на страницах Помощи.',
                        'one' : 'Найдена',
                        'some' : 'Найдено',
                        'many' : 'Найдено'
                    } ) + ' \n' +
                    params['count'] + '\n' +
                    this.keyset('i-tanker__dynamic').key('plural_adv', {
                        'count' : params['count'],
                        'none' : '',
                        'one' : 'страница.',
                        'some' : 'страницы.',
                        'many' : 'страниц.'
                    });
            },

            'pages-found-for-help-after-service-search' : function(params) {
                return this.keyset('i-tanker__dynamic').key('plural_adv', {
                        'count' : params['count'],
                        'none' : 'Ничего не найдено на страницах Помощи.',
                        'one' : '<p>' + this.keyset('i-locale').key('not-found-in-section', {  } ) + '</p>' + 'Найдена',
                        'some' : '<p>' + this.keyset('i-locale').key('not-found-in-section', {  } ) + '</p>' + 'Найдено',
                        'many' : '<p>' + this.keyset('i-locale').key('not-found-in-section', {  } ) + '</p>' + 'Найдено'
                    } ) + ' \n' +
                    params['count'] + '\n' +
                    this.keyset('i-tanker__dynamic').key('plural_adv', {
                        'count' : params['count'],
                        'none' : '',
                        'one' : 'страница.',
                        'some' : 'страницы.',
                        'many' : 'страниц.'
                    });
            },

            'pages-found-for-service' : function(params) {
                return this.keyset('i-tanker__dynamic').key('plural_adv', {
                        'count' : params['count'],
                        'none' : '',
                        'one' : 'Найдена',
                        'some' : 'Найдено',
                        'many' : 'Найдено'
                    }) + ' \n' +
                    params['count'] + '\n' +
                    this.keyset('i-tanker__dynamic').key('plural_adv', {
                        'count' : params['count'],
                        'none' : '',
                        'one' : 'страница.',
                        'some' : 'страницы.',
                        'many' : 'страниц.'
                    });
            }

        }, { 'lang' : 'ru' });

        BEM.I18N.decl('i-messages_type_error', {

            'ERROR' : 'Извините, что-то пошло не так.',

            'BAD_DATA' : function(params) {
                return this.keyset('i-messages_type_error').key('ERROR', {});
            },

            'PAGES_FOUND' : function(params) {
                return BEM.I18N.keyset('i-tanker__dynamic').key('plural_adv', {
                    'count' : params['count'],
                    'none' : 'Ничего не найдено на страницах Помощи.',
                    'one' : '<p>' + this.keyset('i-locale').key('not-found-in-section', {
                            section : params['section']
                        }) + '</p>' + 'Найдена',
                    'some' : '<p>' + this.keyset('i-locale').key('not-found-in-section', {
                            section : params['section']
                        }) + '</p>' + 'Найдено',
                    'many' : '<p>' + this.keyset('i-locale').key('not-found-in-section', {
                            section : params['section']
                        }) + '</p>' + 'Найдено'
                }) +
                ' ' + params['count'] + ' ' +
                this.keyset('i-tanker__dynamic').key('plural_adv', {
                    'count' : params['count'],
                    'none' : '',
                    'one' : 'страница.',
                    'some' : 'страницы.',
                    'many' : 'страниц.'
                });
            }

        }, { 'lang' : 'ru' });

        BEM.I18N.decl('alert_type_date', {

            'DATE' : function(params) {
                return this.keyset('i-tanker__dynamic').key('toggle', {
                    'condition' : params['today'],
                    'true' : 'сегодня',
                    'false' : this.keyset('i-tanker__dynamic').key('toggle', {
                        'condition' : params['tomorrow'],
                        'true' : 'завтра',
                        'false' : params['day'] + ' ' + this.keyset('i-date').key('months-gen', {
                            'num' : params['month']
                        })
                    })
                });
            }

        }, { 'lang' : 'ru' });

    });

    test('Simple keyset', function() {

        assert.equal('Извините, что-то пошло не так.',
                BEM.I18N('i-messages_type_error', 'ERROR'));

        assert.equal('Извините, что-то пошло не так.',
                BEM.I18N.keyset('i-messages_type_error').key('ERROR'));

        assert.strictEqual('', BEM.I18N('i-messages_type_error', 'undecl-key'),
                'Undeclarated key should returns an empty string');

    });

    test('Dynamic keyset', function() {

        assert.equal('Извините, что-то пошло не так.',
                BEM.I18N('i-messages_type_error', 'BAD_DATA'));

        assert.equal('Извините, что-то пошло не так.',
                BEM.I18N.keyset('i-messages_type_error').key('BAD_DATA'));

        assert.equal('Ничего не найдено на страницах Помощи. 0 ',
                BEM.I18N('i-messages_type_error', 'PAGES_FOUND', { count : 0 }));

        assert.equal('<p>В разделе «<b>Лего</b>» ничего не было найдено.<br/>' +
                'Показаны результаты поиска по всем разделам Помощи.</p>Найдена 1 страница.',
                BEM.I18N('i-messages_type_error', 'PAGES_FOUND', { count : 1, section : 'Лего' }));

        assert.equal('<p>В разделе «<b>Лего</b>» ничего не было найдено.<br/>' +
                'Показаны результаты поиска по всем разделам Помощи.</p>Найдено 2 страницы.',
                BEM.I18N('i-messages_type_error', 'PAGES_FOUND', { count : 2, section : 'Лего' }));

        assert.equal('<p>В разделе «<b>Лего</b>» ничего не было найдено.<br/>' +
                'Показаны результаты поиска по всем разделам Помощи.</p>Найдено 5 страниц.',
                BEM.I18N('i-messages_type_error', 'PAGES_FOUND', { count : 5, section : 'Лего' }));

    });

    test('Triple nestings keysets', function() {

        assert.equal('сегодня',
                BEM.I18N('alert_type_date', 'DATE', { today : true }));
        assert.equal('завтра',
                BEM.I18N('alert_type_date', 'DATE', { tomorrow : true }));
        assert.equal('1 12',
                BEM.I18N('alert_type_date', 'DATE', { day : 1, month : 12 }));

    });

});
