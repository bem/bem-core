import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
    scanLevel,
    parseModulesDefine,
    parseDepsFile,
    normalizeDeps,
    expandBemEntity,
    buildRegistry,
    generateBarrel,
    safeIdentifier,
} from './vite-plugin-bem-levels.js';

const ROOT = resolve(import.meta.dirname, '../..');

// --- parseModulesDefine ---

describe('parseModulesDefine', function() {
    it('parses simple define without deps', function() {
        const result = parseModulesDefine(
            "modules.define('cookie', function(provide) { provide({}); });"
        );
        assert.strictEqual(result.name, 'cookie');
        assert.deepStrictEqual(result.deps, []);
        assert.strictEqual(result.callbackParamCount, 1);
        assert.strictEqual(result.isRedefinition, false);
    });

    it('parses define with dependency array', function() {
        const result = parseModulesDefine(
            "modules.define('i-bem', ['i-bem__internal', 'inherit'], function(provide, internal, inherit) {});"
        );
        assert.strictEqual(result.name, 'i-bem');
        assert.deepStrictEqual(result.deps, ['i-bem__internal', 'inherit']);
        assert.strictEqual(result.callbackParamCount, 3);
        assert.strictEqual(result.isRedefinition, false);
    });

    it('parses define with double quotes', function() {
        const result = parseModulesDefine(
            'modules.define("jquery", ["loader_type_js"], function(provide, loader) {});'
        );
        assert.strictEqual(result.name, 'jquery');
        assert.deepStrictEqual(result.deps, ['loader_type_js']);
        assert.strictEqual(result.isRedefinition, false);
    });

    it('returns null for non-module files', function() {
        const result = parseModulesDefine('var x = 1;');
        assert.strictEqual(result, null);
    });

    it('handles multiline define', function() {
        const result = parseModulesDefine(`
modules.define(
    'i-bem-dom',
    [
        'i-bem', 'i-bem__internal', 'inherit',
        'identify', 'objects', 'functions',
        'jquery', 'dom'
    ],
    function(provide, BEM, BEMINTERNAL, inherit, identify, objects, functions, $, dom) {
    });
`);
        assert.strictEqual(result.name, 'i-bem-dom');
        assert.deepStrictEqual(result.deps, [
            'i-bem', 'i-bem__internal', 'inherit',
            'identify', 'objects', 'functions',
            'jquery', 'dom',
        ]);
        assert.strictEqual(result.callbackParamCount, 9);
        assert.strictEqual(result.isRedefinition, false);
    });
});

// --- parseModulesDefine: redefinition detection ---

describe('parseModulesDefine (redefinition detection)', function() {
    it('detects redefinition: jquery__config on desktop (2 deps + prev)', function() {
        const result = parseModulesDefine(
            "modules.define('jquery__config', ['ua', 'objects'], function(provide, ua, objects, base) {});"
        );
        assert.strictEqual(result.name, 'jquery__config');
        assert.deepStrictEqual(result.deps, ['ua', 'objects']);
        assert.strictEqual(result.callbackParamCount, 4);
        assert.strictEqual(result.isRedefinition, true);
    });

    it('detects redefinition: jquery pointerclick (1 dep + prev)', function() {
        const result = parseModulesDefine(
            "modules.define('jquery', ['next-tick'], function(provide, nextTick, $) {});"
        );
        assert.strictEqual(result.isRedefinition, true);
        assert.strictEqual(result.callbackParamCount, 3);
    });

    it('detects redefinition: jquery pressrelease (0 deps + prev)', function() {
        const result = parseModulesDefine(
            "modules.define('jquery', function(provide, $) {});"
        );
        assert.strictEqual(result.isRedefinition, true);
        assert.strictEqual(result.callbackParamCount, 2);
    });

    it('detects redefinition: events__observable type_bem-dom (1 dep + prev)', function() {
        const result = parseModulesDefine(
            "modules.define('events__observable', ['i-bem-dom'], function(provide, bemDom, observable) {});"
        );
        assert.strictEqual(result.isRedefinition, true);
        assert.strictEqual(result.callbackParamCount, 3);
    });

    it('detects redefinition: ua__dom on touch (1 dep + prev)', function() {
        const result = parseModulesDefine(
            "modules.define('ua', ['i-bem-dom'], function(provide, bemDom, ua) {});"
        );
        assert.strictEqual(result.isRedefinition, true);
    });

    it('does NOT detect base as redefinition: cookie (0 deps, 1 param)', function() {
        const result = parseModulesDefine(
            "modules.define('cookie', function(provide) { provide({}); });"
        );
        assert.strictEqual(result.isRedefinition, false);
    });

    it('does NOT detect base as redefinition: events (3 deps, 4 params)', function() {
        const result = parseModulesDefine(
            "modules.define('events', ['identify', 'inherit', 'functions'], function(provide, identify, inherit, functions) {});"
        );
        assert.strictEqual(result.isRedefinition, false);
        assert.strictEqual(result.callbackParamCount, 4);
    });
});

// --- parseModulesDefine: real file detection ---

describe('parseModulesDefine (real file cross-check)', function() {
    it('real file: jquery base is now ESM (migrated)', function() {
        const source = readFileSync(resolve(ROOT, 'common.blocks/jquery/jquery.js'), 'utf8');
        const result = parseModulesDefine(source);
        assert.strictEqual(result, null, 'migrated ESM file has no modules.define');
        assert.ok(source.includes('export default'), 'should have export default');
    });

    it('real file: jquery pointerclick is now ESM (migrated)', function() {
        const source = readFileSync(
            resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.js'), 'utf8'
        );
        const result = parseModulesDefine(source);
        assert.strictEqual(result, null, 'migrated ESM file has no modules.define');
        assert.ok(source.includes('export default'), 'should have export default');
    });

    it('real file: jquery pressrelease is now ESM (migrated)', function() {
        const source = readFileSync(
            resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointerpressrelease.js'), 'utf8'
        );
        const result = parseModulesDefine(source);
        assert.strictEqual(result, null, 'migrated ESM file has no modules.define');
        assert.ok(source.includes('export default'), 'should have export default');
    });

    it('real file: jquery__config base is now ESM (migrated)', function() {
        const source = readFileSync(
            resolve(ROOT, 'common.blocks/jquery/__config/jquery__config.js'), 'utf8'
        );
        const result = parseModulesDefine(source);
        assert.strictEqual(result, null, 'migrated ESM file has no modules.define');
        assert.ok(source.includes('export default'), 'should have export default');
    });

    it('real file: jquery__config desktop is now ESM (migrated)', function() {
        const source = readFileSync(
            resolve(ROOT, 'desktop.blocks/jquery/__config/jquery__config.js'), 'utf8'
        );
        const result = parseModulesDefine(source);
        assert.strictEqual(result, null, 'migrated ESM file has no modules.define');
        assert.ok(source.includes('export default'), 'should have export default');
    });

    it('real file: events__observable base is now ESM (migrated)', function() {
        const source = readFileSync(
            resolve(ROOT, 'common.blocks/events/__observable/events__observable.js'), 'utf8'
        );
        const result = parseModulesDefine(source);
        assert.strictEqual(result, null, 'migrated ESM file has no modules.define');
        assert.ok(source.includes('export default'), 'should have export default');
    });

    it('real file: events__observable type_bem-dom is now ESM (migrated)', function() {
        const source = readFileSync(
            resolve(ROOT, 'common.blocks/events/__observable/_type/events__observable_type_bem-dom.js'), 'utf8'
        );
        const result = parseModulesDefine(source);
        assert.strictEqual(result, null, 'migrated ESM file has no modules.define');
        assert.ok(source.includes('export default'), 'should have export default');
    });

    it('real file: ua touch base is now ESM (migrated)', function() {
        const source = readFileSync(
            resolve(ROOT, 'touch.blocks/ua/ua.js'), 'utf8'
        );
        const result = parseModulesDefine(source);
        assert.strictEqual(result, null, 'migrated ESM file has no modules.define');
        assert.ok(source.includes('export default'), 'should have export default');
    });

    it('real file: ua__dom touch is now ESM (migrated)', function() {
        const source = readFileSync(
            resolve(ROOT, 'touch.blocks/ua/__dom/ua__dom.js'), 'utf8'
        );
        const result = parseModulesDefine(source);
        assert.strictEqual(result, null, 'migrated ESM file has no modules.define');
        assert.ok(source.includes('export default'), 'should have export default');
    });

    it('real file: desktop winresize is now ESM (migrated)', function() {
        const source = readFileSync(
            resolve(ROOT, 'desktop.blocks/jquery/__event/_type/jquery__event_type_winresize.js'), 'utf8'
        );
        const result = parseModulesDefine(source);
        assert.strictEqual(result, null, 'migrated ESM file has no modules.define');
        assert.ok(source.includes('export default'), 'should have export default');
    });
});

// --- scanLevel ---

describe('scanLevel', function() {
    it('scans common.blocks and finds modules', function() {
        const modules = scanLevel(resolve(ROOT, 'common.blocks'));
        assert.ok(modules.size > 0, 'Should find modules');
        assert.ok(modules.has('jquery'), 'Should find jquery');
        assert.ok(modules.has('i-bem'), 'Should find i-bem');
        assert.ok(modules.has('i-bem-dom'), 'Should find i-bem-dom');
        assert.ok(modules.has('events'), 'Should find events');
        assert.ok(modules.has('cookie'), 'Should find cookie');
        assert.ok(modules.has('objects'), 'Should find objects');
        assert.ok(modules.has('inherit'), 'Should find inherit');
    });

    it('finds correct file suffixes', function() {
        const modules = scanLevel(resolve(ROOT, 'common.blocks'));
        const objects = modules.get('objects');
        assert.ok(objects, 'objects should exist');
        assert.strictEqual(objects[0].suffix, '.vanilla.js');

        const cookie = modules.get('cookie');
        assert.ok(cookie, 'cookie should exist');
        assert.strictEqual(cookie[0].suffix, '.js');
    });

    it('scans desktop.blocks', function() {
        const modules = scanLevel(resolve(ROOT, 'desktop.blocks'));
        assert.ok(modules.has('ua'), 'Should find ua on desktop');
        assert.ok(modules.has('jquery__config'), 'Should find jquery__config on desktop');
    });

    it('scans touch.blocks', function() {
        const modules = scanLevel(resolve(ROOT, 'touch.blocks'));
        assert.ok(modules.has('ua'), 'Should find ua on touch');
    });

    it('returns empty map for non-existent directory', function() {
        const modules = scanLevel(resolve(ROOT, 'nonexistent.blocks'));
        assert.strictEqual(modules.size, 0);
    });

    it('derives module name from filename, not file content', function() {
        const modules = scanLevel(resolve(ROOT, 'common.blocks'));
        assert.ok(modules.has('jquery__event_type_pointerclick'),
            'Should derive module name from filename');
        const jqEntries = modules.get('jquery');
        assert.ok(jqEntries, 'jquery base should still exist');
        assert.strictEqual(jqEntries.length, 1,
            'jquery should have exactly 1 entry (base only, no within-level redefinitions)');
    });

    it('finds new modules from BEM naming', function() {
        const modules = scanLevel(resolve(ROOT, 'common.blocks'));
        assert.ok(modules.has('jquery__event_type_pointernative'));
        assert.ok(modules.has('jquery__event_type_pointerpressrelease'));
        assert.ok(modules.has('events__observable_type_bem-dom'));
        assert.ok(modules.has('tick_start_auto'));
        assert.ok(modules.has('idle_start_auto'));
        assert.ok(modules.has('i-bem-dom__init_auto'));
    });
});

// --- buildRegistry ---

describe('buildRegistry', function() {
    it('builds registry for desktop platform', function() {
        const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
        assert.ok(reg.modules.size > 0);
        assert.ok(reg.modules.has('jquery'));
        assert.ok(reg.modules.has('ua'));
        assert.ok(reg.modules.has('i-bem-dom'));
    });

    it('builds registry for touch platform', function() {
        const reg = buildRegistry(['common.blocks', 'touch.blocks'], ROOT);
        assert.ok(reg.modules.has('ua'));
        const uaEntries = reg.modules.get('ua');
        assert.strictEqual(uaEntries.length, 1, 'ua has single touch definition');
        assert.ok(reg.modules.has('ua__dom'), 'ua__dom is a separate module');
    });

    it('jquery has single entry per level (BEM naming)', function() {
        const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
        const jquery = reg.modules.get('jquery');
        assert.ok(jquery, 'jquery should exist');
        assert.strictEqual(jquery.length, 1,
            'jquery should have exactly 1 entry (only common.blocks/jquery/jquery.js)');
        assert.ok(reg.modules.has('jquery__event_type_pointerclick'));
        assert.ok(reg.modules.has('jquery__event_type_pointernative'));
        assert.ok(reg.modules.has('jquery__event_type_pointerpressrelease'));
        assert.ok(reg.modules.has('jquery__event_type_winresize'),
            'desktop winresize should be a separate module');
    });

    it('detects jquery__config cross-level redefinition on desktop', function() {
        const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
        assert.ok(reg.redefinitions.has('jquery__config'), 'jquery__config should have redefinitions');
        const entries = reg.redefinitions.get('jquery__config');
        assert.strictEqual(entries.length, 2);
        assert.ok(entries[0].filePath.includes('common.blocks'));
        assert.ok(entries[1].filePath.includes('desktop.blocks'));
    });

    it('events__observable has no cross-level redefinition (type_bem-dom is separate module)', function() {
        const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
        assert.ok(!reg.redefinitions.has('events__observable'),
            'events__observable should NOT have redefinitions — type_bem-dom is a separate module');
        assert.ok(reg.modules.has('events__observable_type_bem-dom'),
            'events__observable_type_bem-dom should be its own module');
    });

    it('ua has single entry per platform (no common.blocks/ua/ua.js)', function() {
        const regDesktop = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
        const uaDesktop = regDesktop.modules.get('ua');
        assert.ok(uaDesktop, 'ua should exist on desktop');
        assert.strictEqual(uaDesktop.length, 1, 'desktop ua has 1 entry');

        const regTouch = buildRegistry(['common.blocks', 'touch.blocks'], ROOT);
        const uaTouch = regTouch.modules.get('ua');
        assert.ok(uaTouch, 'ua should exist on touch');
        assert.strictEqual(uaTouch.length, 1, 'touch ua has 1 entry');

        assert.ok(regTouch.modules.has('ua__dom'),
            'ua__dom should be its own module on touch');
    });

    it('detects i-bem-dom__init definition', function() {
        const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
        const init = reg.modules.get('i-bem-dom__init');
        assert.ok(init, 'i-bem-dom__init should exist');
        assert.ok(init.length >= 1, 'i-bem-dom__init should have at least base definition');
    });

    it('finds all expected modules (complete inventory, BEM naming)', function() {
        const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
        const expectedModules = [
            // common.blocks .vanilla.js
            'objects', 'identify', 'functions', 'inherit', 'i-bem',
            'tick', 'tick_start_auto', 'uri', 'next-tick',
            'events', 'functions__throttle', 'functions__debounce',
            'i-bem__internal', 'uri__querystring', 'strings__escape',
            'events__channels', 'vow',
            // common.blocks .js
            'cookie', 'dom', 'jquery', 'idle', 'idle_start_auto',
            'keyboard__codes', 'loader_type_js', 'loader_type_bundle',
            'events__observable', 'events__observable_type_bem-dom',
            'i-bem__collection', 'i-bem-dom', 'i-bem-dom__collection',
            'i-bem-dom__init', 'i-bem-dom__init_auto',
            'i-bem-dom__events', 'i-bem-dom__events_type_bem',
            'i-bem-dom__events_type_dom', 'jquery__config',
            'jquery__event_type_pointerclick',
            'jquery__event_type_pointernative',
            'jquery__event_type_pointerpressrelease',
            // desktop.blocks .js
            'ua', 'jquery__event_type_winresize',
        ];

        const missing = expectedModules.filter(m => !reg.modules.has(m));
        assert.deepStrictEqual(missing, [],
            `Missing modules: ${missing.join(', ')}`);
    });
});

// --- parseDepsFile ---

describe('parseDepsFile', function() {
    it('parses simple shouldDeps', function() {
        const result = parseDepsFile(resolve(ROOT, 'common.blocks/dom/dom.deps.js'));
        assert.ok(result);
        assert.ok(result.shouldDeps.length > 0);
    });

    it('parses mustDeps', function() {
        const result = parseDepsFile(
            resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.deps.js')
        );
        assert.ok(result);
        assert.ok(result.mustDeps.length > 0);
    });

    it('parses complex deps with elem and mods', function() {
        const result = parseDepsFile(resolve(ROOT, 'common.blocks/i-bem-dom/i-bem-dom.deps.js'));
        assert.ok(result);
        assert.ok(result.shouldDeps.length > 0);
    });

    it('returns null for non-existent file', function() {
        const result = parseDepsFile(resolve(ROOT, 'nonexistent.deps.js'));
        assert.strictEqual(result, null);
    });
});

// --- expandBemEntity ---

describe('expandBemEntity', function() {
    it('expands string to itself', function() {
        assert.deepStrictEqual(expandBemEntity('jquery'), ['jquery']);
    });

    it('expands block with elem', function() {
        assert.deepStrictEqual(
            expandBemEntity({ block: 'i-bem', elem: 'internal' }),
            ['i-bem__internal']
        );
    });

    it('expands block with elems array', function() {
        const result = expandBemEntity({ block: 'i-bem', elems: ['internal', 'collection'] });
        assert.deepStrictEqual(result, ['i-bem__internal', 'i-bem__collection']);
    });

    it('expands elem with mods', function() {
        const result = expandBemEntity({
            block: 'i-bem-dom',
            elem: 'events',
            mods: { type: ['dom', 'bem'] },
        });
        assert.deepStrictEqual(result, [
            'i-bem-dom__events_type_dom',
            'i-bem-dom__events_type_bem',
        ]);
    });

    it('expands block with bool mod', function() {
        const result = expandBemEntity({ block: 'i-bem-dom', elem: 'init', mods: { auto: true } });
        assert.deepStrictEqual(result, ['i-bem-dom__init_auto']);
    });

    it('expands block-level mods', function() {
        const result = expandBemEntity({ block: 'loader', mods: { type: 'js' } });
        assert.deepStrictEqual(result, ['loader_type_js']);
    });

    it('expands elems with nested mods', function() {
        const result = expandBemEntity({
            block: 'i-bem-dom',
            elems: { elem: 'init', mods: { auto: true } },
        });
        assert.deepStrictEqual(result, ['i-bem-dom__init', 'i-bem-dom__init_auto']);
    });
});

// --- generateBarrel ---

describe('generateBarrel', function() {
    it('generates chained barrel for module with redefinitions', function() {
        const entries = [
            { filePath: resolve(ROOT, 'common.blocks/jquery/jquery.js'), isRedefinition: false },
            { filePath: resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointernative.js'), isRedefinition: true },
            { filePath: resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.js'), isRedefinition: true },
        ];

        const barrel = generateBarrel('jquery', entries, ROOT);
        assert.ok(barrel.includes('@generated'));
        assert.ok(barrel.includes("import _jquery_base from './common.blocks/jquery/jquery.js'"));
        assert.ok(barrel.includes("import _jquery_redef0 from './common.blocks/jquery/__event/_type/jquery__event_type_pointernative.js'"));
        assert.ok(barrel.includes("import _jquery_redef1 from './common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.js'"));
        assert.ok(barrel.includes('let _module = _jquery_base;'));
        assert.ok(barrel.includes('_module = _jquery_redef0(_module);'));
        assert.ok(barrel.includes('_module = _jquery_redef1(_module);'));
        assert.ok(barrel.includes('export default _module;'));
    });

    it('generates barrel for jquery__config with desktop redefinition', function() {
        const entries = [
            { filePath: resolve(ROOT, 'common.blocks/jquery/__config/jquery__config.js'), isRedefinition: false },
            { filePath: resolve(ROOT, 'desktop.blocks/jquery/__config/jquery__config.js'), isRedefinition: true },
        ];

        const barrel = generateBarrel('jquery__config', entries, ROOT);
        assert.ok(barrel.includes("import _jquery__config_base from './common.blocks/jquery/__config/jquery__config.js'"));
        assert.ok(barrel.includes("import _jquery__config_redef0 from './desktop.blocks/jquery/__config/jquery__config.js'"));
        assert.ok(barrel.includes('let _module = _jquery__config_base;'));
        assert.ok(barrel.includes('_module = _jquery__config_redef0(_module);'));
        assert.ok(barrel.includes('export default _module;'));
    });

    it('generates barrel for events__observable with type redefinition', function() {
        const entries = [
            { filePath: resolve(ROOT, 'common.blocks/events/__observable/events__observable.js'), isRedefinition: false },
            { filePath: resolve(ROOT, 'common.blocks/events/__observable/_type/events__observable_type_bem-dom.js'), isRedefinition: true },
        ];

        const barrel = generateBarrel('events__observable', entries, ROOT);
        assert.ok(barrel.includes('_events__observable_base'));
        assert.ok(barrel.includes('_events__observable_redef0'));
        assert.ok(barrel.includes('_module = _events__observable_redef0(_module);'));
    });

    it('barrel does NOT use side-effect imports', function() {
        const entries = [
            { filePath: resolve(ROOT, 'common.blocks/jquery/jquery.js'), isRedefinition: false },
            { filePath: resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.js'), isRedefinition: true },
        ];

        const barrel = generateBarrel('jquery', entries, ROOT);
        const sideEffectImport = /^import\s+'/m;
        assert.ok(!sideEffectImport.test(barrel),
            'barrel should not contain side-effect imports');
    });

    it('barrel with single redefinition produces correct chain', function() {
        const entries = [
            { filePath: '/root/common.blocks/foo/foo.js', isRedefinition: false },
            { filePath: '/root/desktop.blocks/foo/foo.js', isRedefinition: true },
        ];

        const barrel = generateBarrel('foo', entries, '/root');
        const expectedLines = [
            "// @generated by vite-plugin-bem-levels",
            "import _foo_base from './common.blocks/foo/foo.js';",
            "import _foo_redef0 from './desktop.blocks/foo/foo.js';",
            "",
            "let _module = _foo_base;",
            "_module = _foo_redef0(_module);",
            "export default _module;",
        ];
        assert.strictEqual(barrel, expectedLines.join('\n'));
    });

    it('barrel with 4 redefinitions produces full chain', function() {
        const entries = [
            { filePath: '/root/a/m.js' },
            { filePath: '/root/b/m.js' },
            { filePath: '/root/c/m.js' },
            { filePath: '/root/d/m.js' },
            { filePath: '/root/e/m.js' },
        ];

        const barrel = generateBarrel('m', entries, '/root');
        assert.ok(barrel.includes('_m_redef0'));
        assert.ok(barrel.includes('_m_redef1'));
        assert.ok(barrel.includes('_m_redef2'));
        assert.ok(barrel.includes('_m_redef3'));
        assert.strictEqual((barrel.match(/_module = _m_redef/g) || []).length, 4);
    });
});

// --- safeIdentifier ---

describe('safeIdentifier', function() {
    it('converts simple name', function() {
        assert.strictEqual(safeIdentifier('jquery'), '_jquery');
    });

    it('converts hyphenated name', function() {
        assert.strictEqual(safeIdentifier('i-bem-dom'), '_iBemDom');
    });

    it('converts name with double underscore', function() {
        assert.strictEqual(safeIdentifier('jquery__config'), '_jquery__config');
    });
});
