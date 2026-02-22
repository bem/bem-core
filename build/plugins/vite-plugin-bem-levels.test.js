import { strict as assert } from 'node:assert';
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
    assert.deepStrictEqual(result, { name: 'cookie', deps: [] });
});

test('parses define with dependency array', () => {
    const result = parseModulesDefine(
        "modules.define('i-bem', ['i-bem__internal', 'inherit'], function(provide, internal, inherit) {});"
    );
    assert.deepStrictEqual(result, { name: 'i-bem', deps: ['i-bem__internal', 'inherit'] });
});

test('parses define with double quotes', () => {
    const result = parseModulesDefine(
        'modules.define("jquery", ["loader_type_js"], function(provide, loader) {});'
    );
    assert.deepStrictEqual(result, { name: 'jquery', deps: ['loader_type_js'] });
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
    assert.ok(uaEntries.length >= 2, 'ua should have touch definition + redefinition');
});

test('detects jquery redefinition chain on desktop', () => {
    const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    const jquery = reg.modules.get('jquery');
    assert.ok(jquery, 'jquery should exist');
    assert.ok(jquery.length >= 4, `jquery should have 4+ entries, got ${jquery.length}`);
    assert.strictEqual(jquery[0].isRedefinition, false, 'first entry should be base');
    assert.strictEqual(jquery[1].isRedefinition, true, 'second entry should be redefinition');
});

test('detects jquery__config redefinition on desktop', () => {
    const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    assert.ok(reg.redefinitions.has('jquery__config'), 'jquery__config should have redefinitions');
    const entries = reg.redefinitions.get('jquery__config');
    assert.strictEqual(entries.length, 2);
    assert.ok(entries[0].filePath.includes('common.blocks'));
    assert.ok(entries[1].filePath.includes('desktop.blocks'));
});

test('detects events__observable redefinition', () => {
    const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    assert.ok(reg.redefinitions.has('events__observable'),
        'events__observable should have redefinitions');
    const entries = reg.redefinitions.get('events__observable');
    assert.strictEqual(entries.length, 2);
});

test('detects ua redefinition on touch', () => {
    const reg = buildRegistry(['common.blocks', 'touch.blocks'], ROOT);
    const ua = reg.redefinitions.get('ua');
    assert.ok(ua, 'ua should have redefinitions on touch');
    assert.ok(ua.length >= 2, `ua should have 2+ entries on touch, got ${ua ? ua.length : 0}`);
});

test('does NOT detect ua redefinition on desktop (only one definition)', () => {
    const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    // desktop has only one ua definition (in desktop.blocks/ua/ua.js)
    // common.blocks does NOT have ua.js — it only exists on desktop.blocks and touch.blocks
    const ua = reg.modules.get('ua');
    assert.ok(ua, 'ua should exist on desktop');
});

test('detects i-bem-dom__init definition', () => {
    const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    const init = reg.modules.get('i-bem-dom__init');
    assert.ok(init, 'i-bem-dom__init should exist');
    assert.ok(init.length >= 1, 'i-bem-dom__init should have at least base definition');
});

test('finds all expected modules (complete inventory)', () => {
    const reg = buildRegistry(['common.blocks', 'desktop.blocks'], ROOT);
    const expectedModules = [
        'objects', 'identify', 'functions', 'inherit', 'i-bem',
        'tick', 'cookie', 'keyboard__codes', 'uri', 'next-tick',
        'events', 'jquery', 'idle', 'functions__throttle',
        'functions__debounce', 'dom', 'i-bem__internal',
        'uri__querystring', 'loader_type_js',
        'events__observable', 'i-bem__collection', 'strings__escape',
        'i-bem-dom', 'i-bem-dom__collection', 'i-bem-dom__init',
        'i-bem-dom__events', 'events__channels', 'jquery__config',
        'i-bem-dom__events_type_bem', 'i-bem-dom__events_type_dom',
        'ua', 'vow',
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

test('generates barrel for module with redefinitions', () => {
    const entries = [
        { filePath: resolve(ROOT, 'common.blocks/jquery/jquery.js'), isRedefinition: false },
        { filePath: resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointernative.js'), isRedefinition: true },
        { filePath: resolve(ROOT, 'common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.js'), isRedefinition: true },
    ];

    const barrel = generateBarrel('jquery', entries, ROOT);
    assert.ok(barrel.includes('@generated'));
    assert.ok(barrel.includes("import _jquery from './common.blocks/jquery/jquery.js'"));
    assert.ok(barrel.includes("import './common.blocks/jquery/__event/_type/jquery__event_type_pointernative.js'"));
    assert.ok(barrel.includes("import './common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.js'"));
    assert.ok(barrel.includes('export default _jquery'));
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
