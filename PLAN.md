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

### Phase 5: Build System (ENB → modern alternative)
> **This is the highest-risk, highest-effort phase.** The entire ENB ecosystem (17+ packages) is abandoned. Options:

**Option A: Webpack 5** (most mature, biggest ecosystem)
- Install `webpack@^5.105.2`, `webpack-cli`
- Rewrite `.enb/` build configs as `webpack.config.js`
- Handle BEM level resolution, CSS concatenation, JS bundling, template compilation

**Option B: Rollup 4** (simpler, better for libraries)
- Install `rollup@^4.58.0` with plugins
- Better for producing library bundles (this project IS a library)
- Simpler configuration

**Option C: esbuild** (fastest, simplest)
- Install `esbuild@^0.27.3`
- Extremely fast builds
- Limited plugin ecosystem for BEM-specific transforms

**Option D: Keep ENB temporarily** (pragmatic)
- Pin ENB packages at current versions
- Focus on other modernization first
- Replace ENB in a separate dedicated effort

> **Recommendation: Option D** — ENB replacement is a project in itself. The BEM-specific build pipeline (BEMHTML compilation, BEM level resolution, i18n keysets, etc.) has no drop-in replacement. Keeping ENB pinned while modernizing everything else is the pragmatic choice.

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
3. `borschik` → ^3.0.0 (if still needed by ENB; if ENB is kept)
4. `vow` → ^0.4.20 (if still used; ideally replace with native Promises)
5. `bem-naming` → keep at ^1.0.1 (no newer version)
6. `bem-walk` → keep at 1.0.0-1 (no stable release)

### Phase 9: Regenerate Lock File & Validate
1. Run `npm install` to generate new `package-lock.json` (lockfile v3)
2. Run `npm run lint` — fix any ESLint issues
3. Run `npm run test-i18n` — verify i18n tests pass
4. Verify build still works (ENB tasks)

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| ENB incompatible with Node.js 24 | **CRITICAL** | Test first; may need to keep Node.js 22 or patch ENB |
| Chai 6.x ESM-only breaks test imports | High | Use Chai 4.x (last CJS) or add ESM wrapper |
| mocha-phantomjs removal breaks browser tests | High | Playwright migration for spec tests |
| BEM-specific spec files (`modules.define`) won't work outside ENB | High | Need adapter or rewrite |
| `ym` module system incompatible with modern Node.js | Medium | Test on Node.js 24 |
| ENB plugins crash on Node.js 24 | **CRITICAL** | Test early; possibly need Node.js version for build vs runtime |

## Suggested Execution Order (by priority/safety)

1. **Phase 0** — Baseline
2. **Phase 2** — Remove dead packages (safe, reduces surface)
3. **Phase 3** — ESLint migration (independent, high value)
4. **Phase 6** — Git hooks (small, independent)
5. **Phase 7** — GitHub Actions (independent)
6. **Phase 8** — Update remaining packages
7. **Phase 1** — Node.js 24 (test ENB compatibility first!)
8. **Phase 4** — Testing modernization (depends on Node.js version)
9. **Phase 5** — Build system (largest effort, separate project)
10. **Phase 9** — Final validation
