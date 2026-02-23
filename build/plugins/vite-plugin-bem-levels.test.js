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

function test(name, fn) {
    try {
        fn();
        console.log(`  \u2713 ${name}`);
    } catch (err) {
        console.log(`  \u2717 ${name}`);
        console.log(`    ${err.message}`);
        if (err.stack) {
            const lines = err.stack.split('\n').slice(1, 3);
            lines.forEach(l => console.log(`    ${l.trim()}`));
        }
        test.failures = (test.failures || 0) + 1;
    }
}

// --- parseModulesDefine ---

console.log('\nparseModulesDefine:');

test('parses simple define without deps', () => {
    const result = parseModulesDefine(
        "modules.define('cookie', function(provide) { provide({}); });"
    );
    assert.strictEqual(result.name, 'cookie');
    assert.deepStrictEqual(result.deps, []);
    assert.strictEqual(result.callbackParamCount, 1);
    assert.strictEqual(result.isRedefinition, false);
});

test('parses define with dependency array', () => {
    const result = parseModulesDefine(
        "modules.define('i-bem', ['i-bem__internal', 'inherit'], function(provide, internal, inherit) {});"
    );
    assert.strictEqual(result.name, 'i-bem');
    assert.deepStrictEqual(result.deps, ['i-bem__internal', 'inherit']);
    assert.strictEqual(result.callbackParamCount, 3); // provide + 2 deps
    assert.strictEqual(result.isRedefinition, false);
});

test('parses define with double quotes', () => {
    const result = parseModulesDefine(
        'modules.define("jquery", ["loader_type_js"], function(provide, loader) {});'
    );
    assert.strictEqual(result.name, 'jquery');
    assert.deepStrictEqual(result.deps, ['loader_type_js']);
    assert.strictEqual(result.isRedefinition, false);
});

test('returns null for non-module files', () => {
    const result = parseModulesDefine('var x = 1;');
    assert.strictEqual(result, null);
});

test('handles multiline define', () => {
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
    assert.strictEqual(result.callbackParamCount, 9); // provide + 8 deps
    assert.strictEqual(result.isRedefinition, false);
});

// --- parseModulesDefine: redefinition detection ---

console.log('\nparseModulesDefine (redefinition detection):');

test('detects redefinition: jquery__config on desktop (2 deps + prev)', () => {
    // modules.define('jquery__config', ['ua', 'objects'], function(provide, ua, objects, base) {
    const result = parseModulesDefine(
        "modules.define('jquery__config', ['ua', 'objects'], function(provide, ua, objects, base) {});"
    );
    assert.strictEqual(result.name, 'jquery__config');
    assert.deepStrictEqual(result.deps, ['ua', 'objects']);
    assert.strictEqual(result.callbackParamCount, 4); // provide + 2 deps + prev
    assert.strictEqual(result.isRedefinition, true);
});

test('detects redefinition: jquery pointerclick (1 dep + prev)', () => {
    const result = parseModulesDefine(
        "modules.define('jquery', ['next-tick'], function(provide, nextTick, $) {});"
    );
    assert.strictEqual(result.isRedefinition, true);
    assert.strictEqual(result.callbackParamCount, 3); // provide + 1 dep + prev
});

test('detects redefinition: jquery pressrelease (0 deps + prev)', () => {
    const result = parseModulesDefine(
        "modules.define('jquery', function(provide, $) {});"
    );
    assert.strictEqual(result.isRedefinition, true);
    assert.strictEqual(result.callbackParamCount, 2); // provide + prev
});

test('detects redefinition: events__observable type_bem-dom (1 dep + prev)', () => {
    const result = parseModulesDefine(
        "modules.define('events__observable', ['i-bem-dom'], function(provide, bemDom, observable) {});"
    );
    assert.strictEqual(result.isRedefinition, true);
    assert.strictEqual(result.callbackParamCount, 3);
});

test('detects redefinition: ua__dom on touch (1 dep + prev)', () => {
    const result = parseModulesDefine(
        "modules.define('ua', ['i-bem-dom'], function(provide, bemDom, ua) {});"
    );
    assert.strictEqual(result.isRedefinition, true);
});

test('does NOT detect base as redefinition: cookie (0 deps, 1 param)', () => {
    const result = parseModulesDefine(
        "modules.define('cookie', function(provide) { provide({}); });"
    );
    assert.strictEqual(result.isRedefinition, false);
});

test('does NOT detect base as redefinition: events (3 deps, 4 params)', () => {
    const result = parseModulesDefine(
        "modules.define('events', ['identify', 'inherit', 'functions'], function(provide, identify, inherit, functions) {});"
    );
    assert.strictEqual(result.isRedefinition, false);
    assert.strictEqual(result.callbackParamCount, 4); // provide + 3 deps, no extra
});

// --- parseModulesDefine: real file detection ---

console.log('\nparseModulesDefine (real file cross-check):');

test('real file: jquery base is NOT redefinition', () => {
    const source = readFileSync(resolve(ROOT, 'common.blocks/jquery/jquery.js'), 'utf8');
    const result = parseModulesDefine(source);
    assert.strictEqual(result.name, 'jquery');
    assert.strictEqual(result.isRedefinition, false);
});

test('real file: jquery pointerclick IS redefinition', () => {
    const source = readFileSync(
        resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.js'), 'utf8'
    );
    const result = parseModulesDefine(source);
    assert.strictEqual(result.name, 'jquery');
    assert.strictEqual(result.isRedefinition, true);
});

test('real file: jquery pressrelease IS redefinition', () => {
    const source = readFileSync(
        resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointerpressrelease.js'), 'utf8'
    );
    const result = parseModulesDefine(source);
    assert.strictEqual(result.name, 'jquery');
    assert.strictEqual(result.isRedefinition, true);
});

test('real file: jquery__config base is NOT redefinition', () => {
    const source = readFileSync(
        resolve(ROOT, 'common.blocks/jquery/__config/jquery__config.js'), 'utf8'
    );
    const result = parseModulesDefine(source);
    assert.strictEqual(result.name, 'jquery__config');
    assert.strictEqual(result.isRedefinition, false);
});

test('real file: jquery__config desktop IS redefinition', () => {
    const source = readFileSync(
        resolve(ROOT, 'desktop.blocks/jquery/__config/jquery__config.js'), 'utf8'
    );
    const result = parseModulesDefine(source);
    assert.strictEqual(result.name, 'jquery__config');
    assert.strictEqual(result.isRedefinition, true);
});

test('real file: events__observable base is NOT redefinition', () => {
    const source = readFileSync(
        resolve(ROOT, 'common.blocks/events/__observable/events__observable.js'), 'utf8'
    );
    const result = parseModulesDefine(source);
    assert.strictEqual(result.name, 'events__observable');
    assert.strictEqual(result.isRedefinition, false);
});

test('real file: events__observable type_bem-dom IS redefinition', () => {
    const source = readFileSync(
        resolve(ROOT, 'common.blocks/events/__observable/_type/events__observable_type_bem-dom.js'), 'utf8'
    );
    const result = parseModulesDefine(source);
    assert.strictEqual(result.name, 'events__observable');
    assert.strictEqual(result.isRedefinition, true);
});

test('real file: ua touch base is NOT redefinition', () => {
    const source = readFileSync(
        resolve(ROOT, 'touch.blocks/ua/ua.js'), 'utf8'
    );
    const result = parseModulesDefine(source);
    assert.strictEqual(result.name, 'ua');
    assert.strictEqual(result.isRedefinition, false);
});

test('real file: ua__dom touch IS redefinition', () => {
    const source = readFileSync(
        resolve(ROOT, 'touch.blocks/ua/__dom/ua__dom.js'), 'utf8'
    );
    const result = parseModulesDefine(source);
    assert.strictEqual(result.name, 'ua');
    assert.strictEqual(result.isRedefinition, true);
});

test('real file: desktop winresize IS redefinition', () => {
    const source = readFileSync(
        resolve(ROOT, 'desktop.blocks/jquery/__event/_type/jquery__event_type_winresize.js'), 'utf8'
    );
    const result = parseModulesDefine(source);
    assert.strictEqual(result.name, 'jquery');
    assert.strictEqual(result.isRedefinition, true);
});

// --- scanLevel ---

console.log('\nscanLevel:');

test('scans common.blocks and finds modules', () => {
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

test('finds correct file suffixes', () => {
    const modules = scanLevel(resolve(ROOT, 'common.blocks'));
    const objects = modules.get('objects');
    assert.ok(objects, 'objects should exist');
    assert.strictEqual(objects[0].suffix, '.vanilla.js');

    const cookie = modules.get('cookie');
    assert.ok(cookie, 'cookie should exist');
    assert.strictEqual(cookie[0].suffix, '.js');
});

test('scans desktop.blocks', () => {
    const modules = scanLevel(resolve(ROOT, 'desktop.blocks'));
    assert.ok(modules.has('ua'), 'Should find ua on desktop');
    assert.ok(modules.has('jquery__config'), 'Should find jquery__config on desktop');
});

test('scans touch.blocks', () => {
    const modules = scanLevel(resolve(ROOT, 'touch.blocks'));
    assert.ok(modules.has('ua'), 'Should find ua on touch');
});

test('returns empty map for non-existent directory', () => {
    const modules = scanLevel(resolve(ROOT, 'nonexistent.blocks'));
    assert.strictEqual(modules.size, 0);
});

test('scanLevel derives module name from filename, not file content', () => {
    const modules = scanLevel(resolve(ROOT, 'common.blocks'));
    // jquery__event_type_pointerclick.js → module 'jquery__event_type_pointerclick' (not 'jquery')
    assert.ok(modules.has('jquery__event_type_pointerclick'),
        'Should derive module name from filename');
    // The old approach would have registered it as 'jquery' by parsing modules.define
    const jqEntries = modules.get('jquery');
    assert.ok(jqEntries, 'jquery base should still exist');
    assert.strictEqual(jqEntries.length, 1,
        'jquery should have exactly 1 entry (base only, no within-level redefinitions)');
});

test('scanLevel finds new modules from BEM naming', () => {
    const modules = scanLevel(resolve(ROOT, 'common.blocks'));
    // These were previously "redefinitions" of jquery, now separate modules
    assert.ok(modules.has('jquery__event_type_pointernative'));
    assert.ok(modules.has('jquery__event_type_pointerpressrelease'));
    // This was a "redefinition" of events__observable, now separate
    assert.ok(modules.has('events__observable_type_bem-dom'));
    // Auto-start modules now visible as separate entities
    assert.ok(modules.has('tick_start_auto'));
    assert.ok(modules.has('idle_start_auto'));
    assert.ok(modules.has('i-bem-dom__init_auto'));
});

// --- buildRegistry ---

console.log('\nbuildRegistry:');

test('builds registry for desktop platform', () => {
    const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    assert.ok(reg.modules.size > 0);
    assert.ok(reg.modules.has('jquery'));
    assert.ok(reg.modules.has('ua'));
    assert.ok(reg.modules.has('i-bem-dom'));
});

test('builds registry for touch platform', () => {
    const reg = buildRegistry(['common.blocks', 'touch.blocks'], ROOT);
    assert.ok(reg.modules.has('ua'));
    const uaEntries = reg.modules.get('ua');
    assert.strictEqual(uaEntries.length, 1, 'ua has single touch definition');
    assert.ok(reg.modules.has('ua__dom'), 'ua__dom is a separate module');
});

test('jquery has single entry per level (BEM naming)', () => {
    const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    const jquery = reg.modules.get('jquery');
    assert.ok(jquery, 'jquery should exist');
    assert.strictEqual(jquery.length, 1,
        'jquery should have exactly 1 entry (only common.blocks/jquery/jquery.js)');
    // Pointer event files are now separate modules by BEM naming
    assert.ok(reg.modules.has('jquery__event_type_pointerclick'));
    assert.ok(reg.modules.has('jquery__event_type_pointernative'));
    assert.ok(reg.modules.has('jquery__event_type_pointerpressrelease'));
    assert.ok(reg.modules.has('jquery__event_type_winresize'),
        'desktop winresize should be a separate module');
});

test('detects jquery__config cross-level redefinition on desktop', () => {
    const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    assert.ok(reg.redefinitions.has('jquery__config'), 'jquery__config should have redefinitions');
    const entries = reg.redefinitions.get('jquery__config');
    assert.strictEqual(entries.length, 2);
    assert.ok(entries[0].filePath.includes('common.blocks'));
    assert.ok(entries[1].filePath.includes('desktop.blocks'));
});

test('events__observable has no cross-level redefinition (type_bem-dom is separate module)', () => {
    const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    assert.ok(!reg.redefinitions.has('events__observable'),
        'events__observable should NOT have redefinitions — type_bem-dom is a separate module');
    assert.ok(reg.modules.has('events__observable_type_bem-dom'),
        'events__observable_type_bem-dom should be its own module');
});

test('ua has single entry per platform (no common.blocks/ua/ua.js)', () => {
    // ua exists only in platform-specific levels, not in common.blocks
    const regDesktop = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    const uaDesktop = regDesktop.modules.get('ua');
    assert.ok(uaDesktop, 'ua should exist on desktop');
    assert.strictEqual(uaDesktop.length, 1, 'desktop ua has 1 entry');

    const regTouch = buildRegistry(['common.blocks', 'touch.blocks'], ROOT);
    const uaTouch = regTouch.modules.get('ua');
    assert.ok(uaTouch, 'ua should exist on touch');
    assert.strictEqual(uaTouch.length, 1, 'touch ua has 1 entry');

    // ua__dom is a separate module on touch
    assert.ok(regTouch.modules.has('ua__dom'),
        'ua__dom should be its own module on touch');
});

test('detects i-bem-dom__init definition', () => {
    const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    const init = reg.modules.get('i-bem-dom__init');
    assert.ok(init, 'i-bem-dom__init should exist');
    assert.ok(init.length >= 1, 'i-bem-dom__init should have at least base definition');
});

test('finds all expected modules (complete inventory, BEM naming)', () => {
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

// --- parseDepsFile ---

console.log('\nparseDepsFile:');

test('parses simple shouldDeps', () => {
    const result = parseDepsFile(resolve(ROOT, 'common.blocks/dom/dom.deps.js'));
    assert.ok(result);
    assert.ok(result.shouldDeps.length > 0);
});

test('parses mustDeps', () => {
    const result = parseDepsFile(
        resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.deps.js')
    );
    assert.ok(result);
    assert.ok(result.mustDeps.length > 0);
});

test('parses complex deps with elem and mods', () => {
    const result = parseDepsFile(resolve(ROOT, 'common.blocks/i-bem-dom/i-bem-dom.deps.js'));
    assert.ok(result);
    assert.ok(result.shouldDeps.length > 0);
});

test('returns null for non-existent file', () => {
    const result = parseDepsFile(resolve(ROOT, 'nonexistent.deps.js'));
    assert.strictEqual(result, null);
});

// --- expandBemEntity ---

console.log('\nexpandBemEntity:');

test('expands string to itself', () => {
    assert.deepStrictEqual(expandBemEntity('jquery'), ['jquery']);
});

test('expands block with elem', () => {
    assert.deepStrictEqual(
        expandBemEntity({ block: 'i-bem', elem: 'internal' }),
        ['i-bem__internal']
    );
});

test('expands block with elems array', () => {
    const result = expandBemEntity({ block: 'i-bem', elems: ['internal', 'collection'] });
    assert.deepStrictEqual(result, ['i-bem__internal', 'i-bem__collection']);
});

test('expands elem with mods', () => {
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

test('expands block with bool mod', () => {
    const result = expandBemEntity({ block: 'i-bem-dom', elem: 'init', mods: { auto: true } });
    assert.deepStrictEqual(result, ['i-bem-dom__init_auto']);
});

test('expands block-level mods', () => {
    const result = expandBemEntity({ block: 'loader', mods: { type: 'js' } });
    assert.deepStrictEqual(result, ['loader_type_js']);
});

test('expands elems with nested mods', () => {
    const result = expandBemEntity({
        block: 'i-bem-dom',
        elems: { elem: 'init', mods: { auto: true } },
    });
    assert.deepStrictEqual(result, ['i-bem-dom__init', 'i-bem-dom__init_auto']);
});

// --- generateBarrel ---

console.log('\ngenerateBarrel:');

test('generates chained barrel for module with redefinitions', () => {
    const entries = [
        { filePath: resolve(ROOT, 'common.blocks/jquery/jquery.js'), isRedefinition: false },
        { filePath: resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointernative.js'), isRedefinition: true },
        { filePath: resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.js'), isRedefinition: true },
    ];

    const barrel = generateBarrel('jquery', entries, ROOT);
    assert.ok(barrel.includes('@generated'));
    // Base import
    assert.ok(barrel.includes("import _jquery_base from './common.blocks/jquery/jquery.js'"));
    // Redefinition imports (as named transformers, not side-effects)
    assert.ok(barrel.includes("import _jquery_redef0 from './common.blocks/jquery/__event/_type/jquery__event_type_pointernative.js'"));
    assert.ok(barrel.includes("import _jquery_redef1 from './common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.js'"));
    // Chain application
    assert.ok(barrel.includes('let _module = _jquery_base;'));
    assert.ok(barrel.includes('_module = _jquery_redef0(_module);'));
    assert.ok(barrel.includes('_module = _jquery_redef1(_module);'));
    assert.ok(barrel.includes('export default _module;'));
});

test('generates barrel for jquery__config with desktop redefinition', () => {
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

test('generates barrel for events__observable with type redefinition', () => {
    const entries = [
        { filePath: resolve(ROOT, 'common.blocks/events/__observable/events__observable.js'), isRedefinition: false },
        { filePath: resolve(ROOT, 'common.blocks/events/__observable/_type/events__observable_type_bem-dom.js'), isRedefinition: true },
    ];

    const barrel = generateBarrel('events__observable', entries, ROOT);
    assert.ok(barrel.includes('_events__observable_base'));
    assert.ok(barrel.includes('_events__observable_redef0'));
    assert.ok(barrel.includes('_module = _events__observable_redef0(_module);'));
});

test('barrel does NOT use side-effect imports', () => {
    const entries = [
        { filePath: resolve(ROOT, 'common.blocks/jquery/jquery.js'), isRedefinition: false },
        { filePath: resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.js'), isRedefinition: true },
    ];

    const barrel = generateBarrel('jquery', entries, ROOT);
    // Should NOT have bare side-effect imports like: import './path';
    const sideEffectImport = /^import\s+'/m;
    assert.ok(!sideEffectImport.test(barrel),
        'barrel should not contain side-effect imports');
});

test('barrel with single redefinition produces correct chain', () => {
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

test('barrel with 4 redefinitions produces full chain', () => {
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
    // 4 chain applications
    assert.strictEqual((barrel.match(/_module = _m_redef/g) || []).length, 4);
});

// --- safeIdentifier ---

console.log('\nsafeIdentifier:');

test('converts simple name', () => {
    assert.strictEqual(safeIdentifier('jquery'), '_jquery');
});

test('converts hyphenated name', () => {
    assert.strictEqual(safeIdentifier('i-bem-dom'), '_iBemDom');
});

test('converts name with double underscore', () => {
    assert.strictEqual(safeIdentifier('jquery__config'), '_jquery__config');
});

// --- Summary ---

console.log('\n' + '='.repeat(40));
if (test.failures) {
    console.log(`FAILED: ${test.failures} test(s) failed`);
    process.exit(1);
} else {
    console.log('ALL TESTS PASSED');
}
