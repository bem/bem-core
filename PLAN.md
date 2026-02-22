# Plan: Modernization of bem-core Dependencies

## Current State Analysis

### Runtime Environment
| Component | Current | Target | Status |
|-----------|---------|--------|--------|
| Node.js | 8 | 24 LTS (Krypton, v24.13.1) | 16 major versions behind |
| npm | 5-6 (lockfile v1) | 11+ (lockfile v3) | Needs regeneration |

### Dependencies — Current vs Latest

#### Production (`dependencies`)
| Package | Current | Latest | Last Published | Status |
|---------|---------|--------|----------------|--------|
| `ym` | ^0.1.2 | 0.1.2 | ancient | **Abandoned**. BEM module system. No updates for years. |

#### Dev Dependencies (`devDependencies`)

**Build System (ENB) — ALL ABANDONED:**
| Package | Current | Latest | Last Published | Status |
|---------|---------|--------|----------------|--------|
| `enb` | ^1.2.0 | 1.5.1 | 2017-11 | **Abandoned** |
| `enb-bem-techs` | ^2.2.2 | 2.2.2 | 2017-12 | **Abandoned** |
| `enb-magic-factory` | ^0.6.0 | 0.6.0 | 2018-02 | **Abandoned** |
| `enb-magic-platform` | 0.7.0 | 0.7.0 | 2016-04 | **Abandoned** |
| `enb-bemxjst` | ^8.10.2 | 8.10.6 | ~2018 | **Abandoned** |
| `enb-bemxjst-6x` | ^6.5.3 | — | — | **Abandoned** |
| `enb-bemxjst-7x` | ^7.3.1 | — | — | **Abandoned** |
| `enb-bemxjst-i18n` | 1.0.0-beta3 | — | — | **Abandoned** |
| `enb-bh` | ^1.2.1 | — | — | **Abandoned** |
| `enb-bh-i18n` | 1.0.0-beta2 | — | — | **Abandoned** |
| `enb-borschik` | ^2.8.0 | — | — | **Abandoned** |
| `enb-css` | ^1.2.2 | 1.2.2 | — | **Abandoned** |
| `enb-js` | ^1.1.1 | 1.1.1 | — | **Abandoned** |
| `enb-bem-docs` | 0.14.1 | 0.15.0 | 2019-02 | **Abandoned** |
| `enb-bem-examples` | ^1.0.2 | 1.0.2 | 2016-04 | **Abandoned** |
| `enb-bem-specs` | ^0.11.0 | 0.11.0 | 2016-12 | **Abandoned** |
| `enb-bem-tmpl-specs` | ^1.3.3 | 1.3.3 | 2018-03 | **Abandoned** |
| `enb-bem-i18n` | ^1.1.1 | — | — | **Abandoned** |

**Linting — ABANDONED/OUTDATED:**
| Package | Current | Latest | Last Published | Status |
|---------|---------|--------|----------------|--------|
| `jscs` | ^2.11.0 | 3.0.7 | 2016-07 | **Abandoned** (merged into ESLint) |
| `jscs-bem` | ^0.2.0 | — | — | **Abandoned** |
| `jshint` | ^2.9.1 | 2.13.6 | maintained | Functional but superseded by ESLint |
| `jshint-groups` | ^0.8.0 | — | — | **Abandoned** |

**Testing — PARTIALLY ABANDONED:**
| Package | Current | Latest | Last Published | Status |
|---------|---------|--------|----------------|--------|
| `mocha` | ^3.3.0 | 11.7.5 | active | 8 major versions behind |
| `mocha-phantomjs` | ^4.1.0 | 4.1.0 | 2016-06 | **Abandoned** (PhantomJS is dead) |
| `chai` | ^3.2.0 | 6.2.2 | active | 3 major versions behind; v5+ is ESM-only |
| `chai-as-promised` | ^5.1.0 | — | — | Outdated |
| `istanbul` | ^0.4.3 | 0.4.5 | 2016-08 | **Abandoned** (replaced by nyc → c8) |

**BEM Tools:**
| Package | Current | Latest | Last Published | Status |
|---------|---------|--------|----------------|--------|
| `bem-naming` | ^1.0.1 | 1.0.1 | — | **Abandoned** |
| `bem-walk` | 1.0.0-alpha1 | 1.0.0-1 | — | **Never left alpha** |

**Other:**
| Package | Current | Latest | Last Published | Status |
|---------|---------|--------|----------------|--------|
| `borschik` | ^1.5.3 | 3.0.0 | 2021-02 | Unmaintained |
| `bower` | ^1.7.9 | 1.8.14 | 2022-03 | **Deprecated** since 2017 |
| `git-hooks` | ^1.0.2 | 1.1.10 | — | Superseded by husky |
| `gitbook-api` | ^3.0.2 | — | — | **Abandoned** |
| `jsdoc` | ^3.5.5 | 4.0.5 | active | 1 major version behind |
| `vow` | ^0.4.17 | 0.4.20 | 2019-07 | **Abandoned** (native Promises exist) |

### Configuration Files to Replace
| File | Purpose | Modern Replacement |
|------|---------|-------------------|
| `.jshintrc` | JSHint config | `eslint.config.js` (ESLint flat config) |
| `.jscs.json` | JSCS style config | `eslint.config.js` (ESLint flat config) |
| `.jshint-groups.js` | JSHint groups config | `eslint.config.js` (ESLint flat config) |
| `.bowerrc` | Bower directory config | Remove (drop Bower) |
| `bower.json` | Bower package manifest | Remove (drop Bower) |
| `.travis.yml` | Travis CI config | `.github/workflows/ci.yml` (GitHub Actions) |
| `.enb/` (entire dir) | ENB build config | New build system config |
| `.githooks/pre-commit/lint` | Pre-commit hook | `.husky/pre-commit` |

### CI/CD
| Component | Current | Target |
|-----------|---------|--------|
| CI system | Travis CI | GitHub Actions |
| Coverage | Istanbul + Coveralls | c8 + Coveralls (or Codecov) |
| Node.js in CI | 8 | 24 |

---

## Implementation Plan

### Phase 0: Preparation
1. Create feature branch `claude/update-dependencies-fWO1e`
2. Verify project builds and tests in current state (baseline)

### Phase 1: Node.js & npm Modernization
1. Add `.nvmrc` with `24`
2. Add `engines` field to `package.json`: `"node": ">=24"`, `"npm": ">=11"`
3. Delete `package-lock.json` (will regenerate with lockfile v3)

### Phase 2: Remove Abandoned/Deprecated Tools
1. **Remove Bower**: delete `bower.json`, `.bowerrc`, remove `bower i` from scripts
2. **Remove JSCS**: delete `.jscs.json`, uninstall `jscs`, `jscs-bem`
3. **Remove JSHint**: delete `.jshintrc`, `.jshint-groups.js`, uninstall `jshint`, `jshint-groups`
4. **Remove Istanbul**: uninstall `istanbul`
5. **Remove mocha-phantomjs**: uninstall `mocha-phantomjs`
6. **Remove gitbook-api**: uninstall `gitbook-api`
7. **Remove git-hooks**: delete `.githooks/` directory, uninstall `git-hooks`

### Phase 3: Linting — Migrate to ESLint 10
1. Install `eslint@^10.0.1`
2. Create `eslint.config.js` (flat config, required for ESLint 10) migrating rules from:
   - `.jshintrc` rules → ESLint equivalents
   - `.jscs.json` BEM preset rules → ESLint equivalents
   - `.jshint-groups.js` file-group-specific overrides → ESLint flat config overrides
3. Support file extensions: `.js`, `.bemtree`, `.bemhtml`
4. Update `package.json` `lint` script: `"lint": "eslint ."`
5. Delete old config files: `.jshintrc`, `.jscs.json`, `.jshint-groups.js`

### Phase 4: Testing Modernization
1. **Upgrade Mocha**: `mocha@^11.7.5`
2. **Upgrade Chai**: `chai@^6.2.2` (ESM-only — requires `"type": "module"` or `.mjs` for test files using it)
   - Alternative: stay on `chai@^4.x` (last CJS version) if ESM migration is too invasive
3. **Replace Istanbul with c8**: install `c8@^10.1.3`
4. **Replace mocha-phantomjs with Playwright**: install `playwright@^1.58.2` and `@playwright/test`
   - Browser spec tests (`.spec.js` files using `modules.define`) need adaptation for Playwright
5. Update test scripts in `package.json`

### Phase 5: Build System — ENB → Vite 6 + BEM Levels Plugin

> **This is the highest-risk, highest-effort phase.** The entire ENB ecosystem (17+ packages) is abandoned.
> **Chosen approach: Vite 6** with custom `vite-plugin-bem-levels` for BEM level resolution + barrel file generation, plus dedicated plugins for BEMHTML/BH template compilation and i18n.

#### What ENB Currently Does (to be replaced)

| ENB Function | Packages | Vite Replacement |
|---|---|---|
| BEM level scanning & file resolution | `enb-bem-techs` | `vite-plugin-bem-levels` (custom) |
| JS bundling with `ym` module system | `enb-js` + `ym` | Vite native ES modules + barrel files |
| Module redefinition (`modules.define` chains) | `ym` runtime | Platform barrel files (auto-generated) |
| CSS concatenation | `enb-css` | Vite native CSS handling |
| BEMHTML template compilation | `enb-bemxjst`, `enb-bemxjst-6x`, `enb-bemxjst-7x` | `vite-plugin-bemhtml` (custom, wraps `bem-xjst`) |
| BH template compilation | `enb-bh` | `vite-plugin-bh` (custom, wraps `bh`) |
| i18n keysets processing | `enb-bem-i18n`, `enb-bemxjst-i18n`, `enb-bh-i18n` | `vite-plugin-bem-i18n` (custom) |
| Minification (borschik) | `enb-borschik`, `borschik` | Vite built-in (esbuild/terser for JS, lightningcss for CSS) |
| HTML from BEMJSON | `enb-bemxjst`, `enb-bh` | Build script using compiled templates |
| Examples/tests/specs building | `enb-bem-examples`, `enb-bem-specs`, `enb-bem-docs`, `enb-magic-*` | Vite dev server + Playwright |

#### Phase 5.0: Preparation & Coexistence

> ENB and Vite will coexist during migration. ENB stays functional until Vite fully replaces it.

1. Install Vite 6 and core dependencies:
   ```
   npm i -D vite@^6 @anthropic-ai/vite-plugin-bem-levels
   ```
   (Initially `vite-plugin-bem-levels` will live in `build/plugins/` as a local module)
2. Create build directory structure:
   ```
   build/
   ├── plugins/
   │   ├── vite-plugin-bem-levels.js    — BEM level resolution + barrel generation
   │   ├── vite-plugin-bemhtml.js       — BEMHTML compilation
   │   ├── vite-plugin-bh.js            — BH compilation
   │   └── vite-plugin-bem-i18n.js      — i18n keysets
   ├── platforms/
   │   ├── desktop.js                   — entry point for desktop platform
   │   └── touch.js                     — entry point for touch platform
   └── vite.config.js                   — main Vite config
   ```
3. Keep `.enb/` directory intact for fallback

#### Phase 5.1: `vite-plugin-bem-levels` — Core BEM Resolution Plugin

This is the central piece. The plugin:

**5.1.1. Level scanning** — scans BEM levels like ENB does:
```js
// Configuration mirrors .enb/config/levels.js
const LEVELS = {
    common: ['common.blocks'],
    desktop: ['common.blocks', 'desktop.blocks'],
    touch: ['common.blocks', 'touch.blocks']
};
```

**5.1.2. Virtual module resolution** — resolves `bem:*` imports:
```js
// In source code:
import $ from 'bem:jquery';
import bemDom from 'bem:i-bem-dom';

// Plugin resolves 'bem:jquery' → generated barrel file
```

**5.1.3. Barrel file generation for module redefinition chains**

For each module with redefinitions, generates a platform-specific barrel file.
Based on analysis, there are exactly **5 modules with redefinitions** (8 total redefinition instances):

| Module | Files in chain | Generated barrel |
|---|---|---|
| `jquery` | base + 4 redefinitions (3 common + 1 desktop) | `@bem/desktop/jquery.js`, `@bem/touch/jquery.js` |
| `jquery__config` | base (common) + 1 redefinition (desktop) | `@bem/desktop/jquery__config.js` |
| `ua` | alternative defs (desktop vs touch) + 1 redefinition (touch) | `@bem/desktop/ua.js`, `@bem/touch/ua.js` |
| `events__observable` | base + 1 redefinition | `@bem/common/events__observable.js` |
| `i-bem-dom__init` | base + dynamic redefinition | Special handling (see below) |

Example generated barrel for `jquery` on desktop platform:
```js
// @generated by vite-plugin-bem-levels for platform: desktop
import { $ } from '../../common.blocks/jquery/jquery.js';

// Redefinition: pointer events polyfill (mutates $.event.special)
import '../../common.blocks/jquery/__event/_type/jquery__event_type_pointernative.js';

// Redefinition: pointerclick event
import '../../common.blocks/jquery/__event/_type/jquery__event_type_pointerclick.js';

// Redefinition: pointerpress/pointerrelease events
import '../../common.blocks/jquery/__event/_type/jquery__event_type_pointerpressrelease.js';

// Redefinition: IE8 window resize fix (desktop only)
import '../../desktop.blocks/jquery/__event/_type/jquery__event_type_winresize.js';

export { $ };
```

**5.1.4. Automatic redefinition detection**

The plugin scans all `.js` files in BEM levels and detects `modules.define('name', ...)` calls:
- If a module name appears in multiple files → it's a redefinition chain
- Files are ordered by level priority (common < desktop/touch)
- Within a level, element/modifier files redefine block files

**5.1.5. deps.js → import graph**

Parse existing `.deps.js` files and generate import statements:
```js
// From: { shouldDeps: [{ block: 'events' }] }
// To:   import 'bem:events';
```

This runs as a build-time code generation step, not at runtime.

#### Phase 5.2: ym → ES Modules Migration

**5.2.1. Source file transformation** — Each `modules.define` file gets an ES module equivalent:

Before (ym):
```js
modules.define('jquery', ['loader_type_js', 'jquery__config'],
    function(provide, loader, cfg) {
        // ...
        provide(jQuery);
    });
```

After (ES module):
```js
import loader from 'bem:loader_type_js';
import cfg from 'bem:jquery__config';

let jQuery;
// ... loading logic ...
export default jQuery;
```

**5.2.2. Redefinition files** — become side-effect imports or wrapper modules:

Before (ym redefinition):
```js
modules.define('jquery', function(provide, $) {
    $.event.special.pointerclick = { /* ... */ };
    provide($);
});
```

After (ES module side-effect):
```js
import $ from 'bem:jquery';  // gets the base jquery
$.event.special.pointerclick = { /* ... */ };
// No export needed — this is a side-effect module imported by the barrel
```

**5.2.3. Scope of ym migration**

| Category | Count | Migration complexity |
|---|---|---|
| `.vanilla.js` files (never redefined) | ~13 | Low — straightforward `export default` |
| `.js` files (base definitions, no redefinition) | ~30 | Low — `import` deps + `export default` |
| `.js` files (redefinition participants) | 14 | Medium — need barrel coordination |
| `i-bem-dom__init` dynamic redefinition | 1 | High — needs architectural redesign |

**5.2.4. `i-bem-dom__init` special case**

The dynamic `modules.define` monkey-patching in `i-bem-dom.js` (lines 1141-1158) cannot be directly expressed in ES modules. Solution:
- The Vite plugin generates the `i-bem-dom__init` barrel by scanning which blocks depend on `i-bem-dom`
- This replaces the runtime monkey-patching with build-time dependency collection
- The barrel imports all BEM DOM blocks, then calls `bemDom.init()`

#### Phase 5.3: Template Engine Plugins

**5.3.1. `vite-plugin-bemhtml`**
- Handles `.bemhtml` and `.bemhtml.js` files
- Wraps `bem-xjst` compiler (keep as dependency)
- Produces compiled JS that can be imported as ES module
- Supports HMR in dev mode

**5.3.2. `vite-plugin-bh`**
- Handles `.bh.js` files
- Wraps `bh` runtime
- Produces CommonJS-compatible bundle (BH uses `module.exports`)

#### Phase 5.4: i18n Plugin

**`vite-plugin-bem-i18n`**
- Scans `*.i18n/` directories for keysets
- Generates per-language JS modules
- Supports `{lang}` placeholder pattern from current ENB config
- Integrates with BEMHTML i18n via `bem-xjst`

#### Phase 5.5: Vite Configuration

```js
// build/vite.config.js
import { defineConfig } from 'vite';
import bemLevels from './plugins/vite-plugin-bem-levels.js';
import bemhtml from './plugins/vite-plugin-bemhtml.js';
import bh from './plugins/vite-plugin-bh.js';
import bemI18n from './plugins/vite-plugin-bem-i18n.js';

export default defineConfig(({ mode }) => {
    const platform = process.env.BEM_PLATFORM || 'desktop';

    return {
        plugins: [
            bemLevels({
                platform,
                levels: {
                    common: ['common.blocks'],
                    desktop: ['common.blocks', 'desktop.blocks'],
                    touch: ['common.blocks', 'touch.blocks']
                }
            }),
            bemhtml(),
            bh({ jsAttrName: 'data-bem', jsAttrScheme: 'json' }),
            bemI18n({ langs: ['ru', 'en'] })
        ],
        build: {
            lib: {
                entry: `./build/platforms/${platform}.js`,
                name: 'bemCore',
                formats: ['es', 'umd']
            },
            outDir: `dist/${platform}`,
            rollupOptions: {
                output: {
                    // Reproduce ENB dist structure:
                    // bem-core.js, bem-core.css, bem-core.bemhtml.js, etc.
                }
            }
        }
    };
});
```

#### Phase 5.6: dist Task Replacement

ENB `dist` task currently produces these artifacts per platform:

| Artifact | dev | min | Vite equivalent |
|---|---|---|---|
| `bem-core.css` | `.dev.css` | `.css` | Vite CSS output (dev: unminified, build: minified) |
| `bem-core.js` | `.dev.js` | `.js` | Vite JS bundle (with autoinit) |
| `bem-core.no-autoinit.js` | `.dev.no-autoinit.js` | `.no-autoinit.js` | Separate entry point without `i-bem-dom__init_auto` |
| `bem-core.bemhtml.js` | `.dev.bemhtml.js` | `.bemhtml.js` | BEMHTML-only bundle via separate entry |
| `bem-core.bh.js` | `.dev.bh.js` | `.bh.js` | BH-only bundle via separate entry |
| `bem-core.js+bemhtml.js` | `.dev.js+bemhtml.js` | `.js+bemhtml.js` | Combined bundle (JS + BEMHTML) |
| `bem-core.js+bh.js` | `.dev.js+bh.js` | `.js+bh.js` | Combined bundle (JS + BH) |

Vite handles dev/production modes natively (no borschik needed).

npm scripts:
```json
{
    "build": "npm run build:desktop && npm run build:touch",
    "build:desktop": "BEM_PLATFORM=desktop vite build -c build/vite.config.js",
    "build:touch": "BEM_PLATFORM=touch vite build -c build/vite.config.js",
    "dev": "BEM_PLATFORM=desktop vite -c build/vite.config.js"
}
```

#### Phase 5.7: specs/tests/examples Migration

1. **Browser specs** (`*.spec.js`) — Currently use `enb-bem-specs` + mocha-phantomjs:
   - Migrate to Playwright (already planned in Phase 4)
   - Vite dev server serves spec pages instead of ENB magic nodes
   - `vite-plugin-bem-levels` resolves spec level: `libs/bem-pr/spec.blocks`

2. **Examples** (`*.examples/`) — Currently use `enb-bem-examples`:
   - Vite dev server with HTML plugin serves example pages
   - BEMJSON → HTML conversion done via imported compiled templates

3. **Template specs** (`tmpl-specs`) — Currently use `enb-bem-tmpl-specs`:
   - Run as Node.js tests with Mocha (import compiled templates, compare output)

#### Phase 5.8: Cleanup

1. Delete `.enb/` directory entirely (17 files)
2. Uninstall all ENB packages (17 packages):
   ```
   npm rm enb enb-bem-techs enb-magic-factory enb-magic-platform \
     enb-bemxjst enb-bemxjst-6x enb-bemxjst-7x enb-bemxjst-i18n \
     enb-bh enb-bh-i18n enb-borschik enb-css enb-js \
     enb-bem-docs enb-bem-examples enb-bem-specs enb-bem-tmpl-specs \
     enb-bem-i18n
   ```
3. Uninstall `borschik` (replaced by Vite built-in minification)
4. Remove `ym` from production dependencies (replaced by ES modules)
5. Remove `bem-walk` and `bem-naming` if no longer used outside ENB
6. Update `package.json` scripts to use Vite commands

#### Phase 5 Sub-Phase Execution Order

```
5.0 Preparation & coexistence setup
 │
 ├── 5.1 vite-plugin-bem-levels (CRITICAL PATH — everything depends on this)
 │    ├── 5.1.1 Level scanning
 │    ├── 5.1.2 Virtual module resolution (bem:* imports)
 │    ├── 5.1.3 Barrel file generation
 │    ├── 5.1.4 Redefinition detection
 │    └── 5.1.5 deps.js parsing
 │
 ├── 5.2 ym → ES modules migration (can start after 5.1 is functional)
 │    ├── 5.2.1 .vanilla.js files (easiest, start here)
 │    ├── 5.2.2 .js base definitions
 │    ├── 5.2.3 .js redefinition files
 │    └── 5.2.4 i-bem-dom__init special case
 │
 ├── 5.3 Template plugins (parallel with 5.2)
 │    ├── 5.3.1 vite-plugin-bemhtml
 │    └── 5.3.2 vite-plugin-bh
 │
 ├── 5.4 i18n plugin (parallel with 5.2, 5.3)
 │
 ├── 5.5 Vite config (after 5.1-5.4 plugins exist)
 │
 ├── 5.6 dist replacement (after 5.5)
 │    └── Verify output matches ENB dist artifacts
 │
 ├── 5.7 specs/tests/examples (after 5.6)
 │
 └── 5.8 Cleanup (LAST — only after full verification)
```

#### Phase 5 Risk Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Barrel file import order matters for side-effects | High | Plugin sorts by level priority; test thoroughly |
| `i-bem-dom__init` dynamic dep collection hard to replicate | High | Build-time scanning replaces runtime monkey-patching |
| `bem-xjst` may not work as Vite plugin | Medium | Keep as Node.js pre-compilation step if needed |
| Circular dependencies between BEM blocks | Medium | Vite handles circular ESM; add cycle detection to plugin |
| Output bundle size differs from ENB | Low | Compare sizes; adjust Rollup chunking |
| Dev server HMR with BEM redefinitions | Low | Regenerate barrels on file change; full reload as fallback |

### Phase 6: Git Hooks Modernization
1. Install `husky@^9.1.7` + `lint-staged@^16.2.7`
2. Configure `.husky/pre-commit` to run `lint-staged`
3. Configure `lint-staged` in `package.json` to run ESLint on staged files
4. Delete `.githooks/` directory

### Phase 7: CI/CD — Travis CI → GitHub Actions
1. Create `.github/workflows/ci.yml`:
   - Matrix: Node.js 24
   - Steps: install, lint, test
   - Coverage: c8 + upload to Coveralls
2. Delete `.travis.yml`

### Phase 8: Update Remaining Packages
1. `mocha` → ^11.7.5
2. `jsdoc` → ^4.0.5
3. `vow` → replace with native `Promise` where possible; remove if fully replaced
4. `borschik` → remove (replaced by Vite built-in minification in Phase 5.8)
5. `bem-naming` → remove if only used by ENB plugins; keep if used by `vite-plugin-bem-levels`
6. `bem-walk` → remove (replaced by custom level scanning in `vite-plugin-bem-levels`)
7. `ym` → remove from production deps (replaced by ES modules in Phase 5.2)

### Phase 9: Regenerate Lock File & Validate
1. Run `npm install` to generate new `package-lock.json` (lockfile v3)
2. Run `npm run lint` — fix any ESLint issues
3. Run `npm run build` — verify Vite builds succeed for both platforms
4. Run `npm run test` — verify all tests pass
5. Compare Vite dist output with archived ENB dist output (size, functionality)
6. Run examples in Vite dev server, verify they work

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| `vite-plugin-bem-levels` barrel generation order incorrect | **CRITICAL** | Comprehensive tests comparing ENB and Vite output |
| `i-bem-dom__init` dynamic monkey-patching hard to replicate statically | **HIGH** | Build-time BEM block scanning replaces runtime logic |
| `bem-xjst` (BEMHTML compiler) integration with Vite plugin | High | Keep as pre-compilation step if direct plugin fails |
| Chai 6.x ESM-only breaks test imports | Medium | Use Chai 4.x (last CJS) or add ESM wrapper |
| mocha-phantomjs removal breaks browser tests | High | Playwright migration for spec tests |
| Circular dependencies between BEM blocks in ES modules | Medium | Vite handles circular ESM natively; add cycle detection |
| BEM-specific spec files (`modules.define`) won't work without `ym` | High | Migrate spec files to ES imports as part of Phase 5.2 |
| Output bundle size/behavior differs from ENB | Medium | Comparison testing: run both builds, diff output |
| ym → ES modules migration introduces regressions | High | Phased migration with coexistence; ENB stays as reference |

## Suggested Execution Order (by priority/safety)

1. **Phase 0** — Baseline
2. **Phase 1** — Node.js 24 (needed for Vite 6 and modern tooling)
3. **Phase 2** — Remove dead packages (safe, reduces surface)
4. **Phase 3** — ESLint migration (independent, high value)
5. **Phase 6** — Git hooks (small, independent)
6. **Phase 7** — GitHub Actions (independent)
7. **Phase 8** — Update remaining packages
8. **Phase 4** — Testing modernization (Playwright needed for Phase 5.7)
9. **Phase 5** — Build system migration to Vite (largest effort):
   - 5.0 → 5.1 → 5.2 + 5.3 + 5.4 (parallel) → 5.5 → 5.6 → 5.7 → 5.8
10. **Phase 9** — Final validation (verify all Vite builds match ENB output)
