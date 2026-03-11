/**
 * Browser test entry point.
 *
 * 1. Sets up mocha (BDD globals: describe, it, before, after, beforeEach, afterEach)
 * 2. Imports all bem-core blocks and registers them via the modules shim
 * 3. Imports all *.spec.js files (they call modules.define('spec', …))
 * 4. Resolves the 'spec' module (runs all spec factories, registering mocha tests)
 * 5. Runs mocha and writes window.__testResults
 */

// ── 1. Mocha browser setup ────────────────────────────────────────────────────
// mocha.js is loaded as a classic <script> tag in index.html (UMD build).
// It sets up window.Mocha and window.mocha. We only need to call setup() here.
mocha.setup({ ui: 'bdd', reporter: 'html' });

// ── 2. Test helpers ───────────────────────────────────────────────────────────
// chai/sinon-chai don't have default exports — use namespace imports.
import * as chai from 'chai';
import sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

const sinonChaiPlugin = sinonChai.default ?? sinonChai;
chai.use(sinonChaiPlugin);
chai.should();

// ── 3. bem-core blocks ────────────────────────────────────────────────────────
// Import each block to capture its default export for the modules shim.
// Side-effect-only imports (jQuery event extensions, dom event types) are imported last.

import identify from 'bem:identify';
import inherit from 'bem:inherit';
import objects from 'bem:objects';
import functions from 'bem:functions';
import functionsDebounce from 'bem:functions__debounce';
import functionsThrottle from 'bem:functions__throttle';
import nextTick from 'bem:next-tick';
import stringsEscape from 'bem:strings__escape';

import events from 'bem:events';
import eventsObservable from 'bem:events__observable';

import $ from 'jquery';
import 'bem:jquery__config';

import dom from 'bem:dom';
import cookie from 'bem:cookie';
import tick from 'bem:tick';
import uri from 'bem:uri';
import uriQuerystring from 'bem:uri__querystring';
import loaderTypeJs from 'bem:loader_type_js';

import bemInternal from 'bem:i-bem__internal';
import bem from 'bem:i-bem';
import bemCollection from 'bem:i-bem__collection';

import 'bem:i-bem-dom__events';
import 'bem:i-bem-dom__events_type_dom';
import 'bem:i-bem-dom__events_type_bem';
import bemDomCollection from 'bem:i-bem-dom__collection';
import bemDom from 'bem:i-bem-dom';
import bemDomInit from 'bem:i-bem-dom__init';
// NOTE: i-bem-dom__init_auto is intentionally NOT imported in tests
//       to avoid auto-initialization on DOMContentLoaded.

import eventsObservableBemDom from 'bem:events__observable_type_bem-dom';

// ── 4. BEMHTML shim ───────────────────────────────────────────────────────────
import BEMHTML from './bemhtml-shim.js';

// ── 5. Modules shim ───────────────────────────────────────────────────────────
import { createModulesShim } from './modules-shim.js';

window.modules = createModulesShim({
    identify,
    inherit,
    objects,
    functions,
    'functions__debounce': functionsDebounce,
    'functions__throttle': functionsThrottle,
    'next-tick': nextTick,
    'strings__escape': stringsEscape,
    events,
    'events__observable': eventsObservableBemDom,
    'events__observable_type_bem-dom': eventsObservableBemDom,
    dom,
    cookie,
    tick,
    uri,
    'uri__querystring': uriQuerystring,
    'loader_type_js': loaderTypeJs,
    'i-bem__internal': bemInternal,
    'i-bem': bem,
    'i-bem__collection': bemCollection,
    'i-bem-dom': bemDom,
    'i-bem-dom__collection': bemDomCollection,
    'i-bem-dom__init': bemDomInit,
    jquery: $,
    chai,
    sinon,
    'sinon-chai': sinonChaiPlugin,
    BEMHTML,
});

// Register mocha as a module (some internal wiring may require it)
window.modules.define('mocha', function(provide) {
    provide(window.mocha);
});

// Bootstrap 'spec': sets up chai.should() and sinon-chai for the test suite.
// Individual spec files will add more 'spec' definitions after this one.
window.modules.define('spec', function(provide) {
    provide();
});

// ── 6. Import all spec files (dynamic, so window.modules is already set up) ──
// We use lazy glob (without eager:true) so spec files are imported AFTER this
// module's top-level code has executed and window.modules is available.
// Each spec file calls modules.define('spec', …) as a side effect.
const specLoaders = import.meta.glob('/common.blocks/**/*.spec.js');

Promise.all(Object.values(specLoaders).map(load => load())).then(() => {
    // ── 7. Run mocha ─────────────────────────────────────────────────────────
    // Resolve 'spec' module → runs all spec factories → registers describe/it.
    window.modules.require(['spec'], function() {
        const runner = mocha.run(function(failures) {
            window.__testResults = {
                failures,
                total: runner.stats.tests,
                passed: runner.stats.passes,
                pending: runner.stats.pending,
            };
        });
        window.__testFailures = [];
        runner.on('fail', function(test, err) {
            window.__testFailures.push({
                title: test.fullTitle(),
                err: err.message,
            });
        });
    });
});
