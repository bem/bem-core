import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative, dirname, extname, basename } from 'node:path';

const BEM_PREFIX = 'bem:';
const VIRTUAL_PREFIX = '\0bem:';

const JS_SUFFIXES = ['.vanilla.js', '.js'];

/**
 * Scans a BEM level directory and returns all BEM entities found.
 *
 * BEM nested file structure:
 *   block/
 *     block.js
 *     block.deps.js
 *     __elem/
 *       block__elem.js
 *     _mod/
 *       block_mod.js
 *       block_mod_val.js
 *
 * @param {string} levelDir - absolute path to a BEM level directory
 * @returns {Map<string, object[]>} moduleName → array of file entries
 */
function scanLevel(levelDir) {
    const modules = new Map();

    if (!existsSync(levelDir)) return modules;

    const blocks = readdirSync(levelDir).filter(name => {
        const fullPath = join(levelDir, name);
        return statSync(fullPath).isDirectory() && !name.startsWith('.');
    });

    for (const block of blocks) {
        const blockDir = join(levelDir, block);
        scanDirectory(blockDir, block, modules, levelDir);
    }

    return modules;
}

/**
 * Recursively scans a BEM entity directory for JS files with modules.define.
 */
function scanDirectory(dir, blockName, modules, levelDir) {
    let entries;
    try {
        entries = readdirSync(dir);
    } catch {
        return;
    }

    for (const entry of entries) {
        const fullPath = join(dir, entry);
        let stat;
        try {
            stat = statSync(fullPath);
        } catch {
            continue;
        }

        if (stat.isDirectory()) {
            scanDirectory(fullPath, blockName, modules, levelDir);
            continue;
        }

        if (!stat.isFile()) continue;

        // Check if this is a JS source file (not deps, spec, test, etc.)
        const isVanillaJs = entry.endsWith('.vanilla.js');
        const isPlainJs = !isVanillaJs && entry.endsWith('.js')
            && !entry.endsWith('.deps.js')
            && !entry.endsWith('.spec.js')
            && !entry.endsWith('.bemhtml.js')
            && !entry.endsWith('.bh.js')
            && !entry.endsWith('.bemjson.js')
            && !entry.endsWith('.test.js');

        if (!isVanillaJs && !isPlainJs) continue;

        const content = readFileSync(fullPath, 'utf8');
        const parsed = parseModulesDefine(content);

        if (!parsed) continue;

        const existing = modules.get(parsed.name) || [];
        existing.push({
            name: parsed.name,
            deps: parsed.deps,
            callbackParamCount: parsed.callbackParamCount,
            isRedefinition: parsed.isRedefinition,
            filePath: fullPath,
            suffix: isVanillaJs ? '.vanilla.js' : '.js',
            levelDir,
        });
        modules.set(parsed.name, existing);
    }
}

/**
 * Parses a modules.define() call from source code.
 * Returns { name, deps, callbackParamCount, isRedefinition } or null.
 *
 * In ym, a redefinition is detected by the callback having one extra parameter
 * beyond provide + deps. That extra parameter receives the previous module value.
 *
 * Base:         modules.define('name', ['dep1'], function(provide, dep1) { ... })
 *                  → callbackParams = 2, isRedefinition = false
 *
 * Redefinition: modules.define('name', ['dep1'], function(provide, dep1, prev) { ... })
 *                  → callbackParams = 3, isRedefinition = true
 */
function parseModulesDefine(source) {
    // Match modules.define('name'  or  modules.define("name"
    const defineMatch = source.match(
        /modules\.define\s*\(\s*(['"])([^'"]+)\1/
    );
    if (!defineMatch) return null;

    const name = defineMatch[2];

    // Try to extract dependency array
    // Look for the pattern after the name: , ['dep1', 'dep2']
    const afterName = source.slice(defineMatch.index + defineMatch[0].length);
    const depsMatch = afterName.match(
        /^\s*,\s*\[([^\]]*)\]/
    );

    let deps = [];
    if (depsMatch) {
        const depsStr = depsMatch[1];
        const depPattern = /['"]([^'"]+)['"]/g;
        let m;
        while ((m = depPattern.exec(depsStr)) !== null) {
            deps.push(m[1]);
        }
    }

    // Extract callback parameter count to detect redefinitions.
    // Look for `function(` after the deps array (or after the name if no deps).
    const afterDeps = depsMatch
        ? afterName.slice(depsMatch[0].length)
        : afterName;
    const callbackMatch = afterDeps.match(
        /,\s*function\s*\(([^)]*)\)/
    );

    let callbackParamCount = 0;
    if (callbackMatch) {
        const params = callbackMatch[1].trim();
        callbackParamCount = params ? params.split(/\s*,\s*/).length : 0;
    }

    // A redefinition has more callback params than provide (1) + deps count.
    // The extra parameter receives the previous module value.
    const isRedefinition = callbackParamCount > 1 + deps.length;

    return { name, deps, callbackParamCount, isRedefinition };
}

/**
 * Parses a .deps.js file and returns the dependency declarations.
 *
 * deps.js format:
 *   ({ shouldDeps: [...], mustDeps: [...], noDeps: [...] })
 *   or
 *   ([{ shouldDeps: ... }, { ... }])
 */
function parseDepsFile(filePath) {
    if (!existsSync(filePath)) return null;

    const content = readFileSync(filePath, 'utf8');

    try {
        // deps.js files are wrapped in parentheses: ({ ... }) or ([...])
        // Use Function constructor to evaluate (safer than eval, no access to scope)
        const fn = new Function('return ' + content);
        const result = fn();
        return normalizeDeps(result);
    } catch {
        return null;
    }
}

/**
 * Normalizes deps.js result into { mustDeps: [], shouldDeps: [], noDeps: [] }
 */
function normalizeDeps(raw) {
    if (Array.isArray(raw)) {
        // Array of dep declarations — merge them
        const merged = { mustDeps: [], shouldDeps: [], noDeps: [] };
        for (const item of raw) {
            const norm = normalizeDeps(item);
            if (norm) {
                merged.mustDeps.push(...norm.mustDeps);
                merged.shouldDeps.push(...norm.shouldDeps);
                merged.noDeps.push(...norm.noDeps);
            }
        }
        return merged;
    }

    if (raw && typeof raw === 'object') {
        return {
            mustDeps: normalizeDep(raw.mustDeps || []),
            shouldDeps: normalizeDep(raw.shouldDeps || []),
            noDeps: normalizeDep(raw.noDeps || []),
        };
    }

    return null;
}

/**
 * Normalizes a single deps declaration value to an array of BEM entity references.
 * Input can be: string | object | array
 */
function normalizeDep(dep) {
    if (!dep) return [];
    if (typeof dep === 'string') return [{ block: dep }];
    if (Array.isArray(dep)) return dep.flatMap(d => normalizeDep(d));
    if (typeof dep === 'object') {
        // Could be { block: 'name' } or { elem: 'name' } or { mods: {...} } etc.
        return [dep];
    }
    return [];
}

/**
 * Converts a BEM entity reference to a module name.
 * { block: 'jquery', elem: 'event', mods: { type: 'pointer' } }
 * → 'jquery__event_type_pointer'
 *
 * This is a simplified conversion — real BEM naming is more complex,
 * but for the modules actually defined in bem-core, this covers all cases.
 */
function bemEntityToModuleName(entity, contextBlock) {
    if (typeof entity === 'string') return entity;

    const block = entity.block || contextBlock;
    if (!block) return null;

    let name = block;

    // Handle elem / elems
    if (entity.elem) {
        name += '__' + entity.elem;
    }

    // Handle mod / mods
    if (entity.mod) {
        name += '_' + entity.mod;
        if (entity.val && entity.val !== true) {
            name += '_' + entity.val;
        }
    }
    if (entity.mods) {
        for (const [mod, vals] of Object.entries(entity.mods)) {
            if (Array.isArray(vals)) {
                // Multiple values → multiple modules (e.g., type: ['dom', 'bem'])
                // Return only the first for now; caller should handle arrays
                name += '_' + mod;
            } else if (vals === true) {
                name += '_' + mod;
            } else {
                name += '_' + mod + '_' + vals;
            }
        }
    }

    return name;
}

/**
 * Expands a BEM dependency entity into one or more module names.
 * Handles elems (array) and mods (array values).
 */
function expandBemEntity(entity, contextBlock) {
    if (typeof entity === 'string') return [entity];

    const block = entity.block || contextBlock;
    if (!block) return [];

    const results = [];

    // If entity has elems (array of elements), expand each
    if (entity.elems) {
        const elems = Array.isArray(entity.elems) ? entity.elems : [entity.elems];
        for (const elem of elems) {
            if (typeof elem === 'string') {
                results.push(block + '__' + elem);
            } else if (elem && typeof elem === 'object') {
                // { elem: 'init', mods: { auto: true } }
                const elemName = elem.elem;
                results.push(block + '__' + elemName);
                if (elem.mods) {
                    for (const [mod, vals] of Object.entries(elem.mods)) {
                        const modVals = Array.isArray(vals) ? vals : [vals];
                        for (const val of modVals) {
                            if (val === true) {
                                results.push(block + '__' + elemName + '_' + mod);
                            } else {
                                results.push(block + '__' + elemName + '_' + mod + '_' + val);
                            }
                        }
                    }
                }
            }
        }
        return results;
    }

    // If entity has elem (single)
    if (entity.elem) {
        const base = block + '__' + entity.elem;
        if (entity.mods) {
            for (const [mod, vals] of Object.entries(entity.mods)) {
                const modVals = Array.isArray(vals) ? vals : [vals];
                for (const val of modVals) {
                    if (val === true) {
                        results.push(base + '_' + mod);
                    } else {
                        results.push(base + '_' + mod + '_' + val);
                    }
                }
            }
            return results;
        }
        return [base];
    }

    // Block with mods
    if (entity.mods) {
        for (const [mod, vals] of Object.entries(entity.mods)) {
            const modVals = Array.isArray(vals) ? vals : [vals];
            for (const val of modVals) {
                if (val === true) {
                    results.push(block + '_' + mod);
                } else {
                    results.push(block + '_' + mod + '_' + val);
                }
            }
        }
        return results;
    }

    // Simple block reference
    return [block];
}

/**
 * Build a complete module registry from BEM levels.
 *
 * @param {string[]} levels - ordered list of level directories (e.g., ['common.blocks', 'desktop.blocks'])
 * @param {string} rootDir - project root directory
 * @returns {{ modules: Map, deps: Map, redefinitions: Map }}
 */
function buildRegistry(levels, rootDir) {
    // moduleName → [{ name, deps, filePath, suffix, levelDir, levelIndex }]
    const allModules = new Map();

    for (let i = 0; i < levels.length; i++) {
        const levelDir = resolve(rootDir, levels[i]);
        const levelModules = scanLevel(levelDir);

        for (const [name, entries] of levelModules) {
            const existing = allModules.get(name) || [];
            for (const entry of entries) {
                entry.levelIndex = i;
            }
            existing.push(...entries);
            allModules.set(name, existing);
        }
    }

    // Mark redefinitions: first entry (lowest level index) per module is the base,
    // subsequent entries are redefinitions
    const redefinitions = new Map();
    for (const [name, entries] of allModules) {
        // Sort by level index, then by path depth (block < element < modifier)
        entries.sort((a, b) => {
            if (a.levelIndex !== b.levelIndex) return a.levelIndex - b.levelIndex;
            // Within same level: shorter paths first (base definitions before redefinitions)
            return a.filePath.length - b.filePath.length;
        });

        if (entries.length > 1) {
            entries[0].isRedefinition = false;
            for (let i = 1; i < entries.length; i++) {
                entries[i].isRedefinition = true;
            }
            redefinitions.set(name, entries);
        }
    }

    // Collect deps.js files
    const depsMap = new Map();
    for (const [name, entries] of allModules) {
        for (const entry of entries) {
            // Find corresponding .deps.js file
            // e.g., common.blocks/jquery/jquery.js → common.blocks/jquery/jquery.deps.js
            const dir = dirname(entry.filePath);
            const possibleDepsFiles = [
                // Same directory, same base name
                entry.filePath.replace(/\.(vanilla\.)?js$/, '.deps.js'),
            ];

            // Also look for block-level deps.js
            const blockDir = dirname(dir) === entry.levelDir ? dir : dirname(dir);
            const blockName = basename(blockDir);
            const blockDeps = join(blockDir, blockName + '.deps.js');
            if (!possibleDepsFiles.includes(blockDeps)) {
                possibleDepsFiles.push(blockDeps);
            }

            for (const depsFile of possibleDepsFiles) {
                if (existsSync(depsFile) && !depsMap.has(depsFile)) {
                    const parsed = parseDepsFile(depsFile);
                    if (parsed) {
                        depsMap.set(depsFile, { ...parsed, forModule: name });
                    }
                }
            }
        }
    }

    return { modules: allModules, deps: depsMap, redefinitions };
}

/**
 * Generate a barrel (re-export) module for a module with redefinitions.
 *
 * In ym, each redefinition receives the previous module value as its last
 * callback parameter and calls provide() with a new/modified value.
 *
 * In ES modules, we model this as:
 * - Base file: `export default value;`
 * - Redefinition file: `export default function(prev) { return newValue; }`
 *
 * The barrel chains them:
 *   import _base from './base.js';
 *   import _redef0 from './redef0.js';
 *   import _redef1 from './redef1.js';
 *   let _module = _base;
 *   _module = _redef0(_module);
 *   _module = _redef1(_module);
 *   export default _module;
 *
 * @param {string} name - module name
 * @param {object[]} entries - sorted array of file entries (base + redefinitions)
 * @param {string} rootDir - project root
 * @returns {string} generated ES module source code
 */
function generateBarrel(name, entries, rootDir) {
    const lines = [`// @generated by vite-plugin-bem-levels`];
    const base = entries[0];
    const basePath = './' + relative(rootDir, base.filePath).replace(/\\/g, '/');
    const baseId = safeIdentifier(name) + '_base';

    lines.push(`import ${baseId} from '${basePath}';`);

    // Import each redefinition as a named transformer
    const redefIds = [];
    for (let i = 1; i < entries.length; i++) {
        const redef = entries[i];
        const redefPath = './' + relative(rootDir, redef.filePath).replace(/\\/g, '/');
        const redefId = safeIdentifier(name) + '_redef' + (i - 1);
        lines.push(`import ${redefId} from '${redefPath}';`);
        redefIds.push(redefId);
    }

    lines.push('');
    lines.push(`let _module = ${baseId};`);
    for (const redefId of redefIds) {
        lines.push(`_module = ${redefId}(_module);`);
    }
    lines.push(`export default _module;`);

    return lines.join('\n');
}

/**
 * Generate a safe JavaScript identifier from a BEM module name.
 * 'jquery__config' → '_jquery__config'
 * 'i-bem-dom' → '_iBemDom'
 */
function safeIdentifier(name) {
    // Replace hyphens with camelCase, prefix with underscore
    let id = name
        .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        .replace(/-/g, '_');
    // Ensure starts with valid identifier char
    if (/^[0-9]/.test(id)) id = '_' + id;
    return '_' + id;
}

/**
 * Vite plugin for BEM level resolution and barrel file generation.
 *
 * @param {object} options
 * @param {string} options.platform - 'desktop' or 'touch'
 * @param {object} options.levels - platform → level directories mapping
 * @param {string} [options.rootDir] - project root (default: process.cwd())
 */
export default function bemLevels(options = {}) {
    const {
        platform = 'desktop',
        levels = {
            common: ['common.blocks'],
            desktop: ['common.blocks', 'desktop.blocks'],
            touch: ['common.blocks', 'touch.blocks'],
        },
        rootDir = process.cwd(),
    } = options;

    const platformLevels = levels[platform];
    if (!platformLevels) {
        throw new Error(`Unknown platform: ${platform}. Available: ${Object.keys(levels).join(', ')}`);
    }

    let registry = null;

    function getRegistry() {
        if (!registry) {
            registry = buildRegistry(platformLevels, rootDir);
        }
        return registry;
    }

    return {
        name: 'vite-plugin-bem-levels',

        resolveId(id) {
            if (id.startsWith(BEM_PREFIX)) {
                return VIRTUAL_PREFIX + id.slice(BEM_PREFIX.length);
            }
            return null;
        },

        load(id) {
            if (!id.startsWith(VIRTUAL_PREFIX)) return null;

            const moduleName = id.slice(VIRTUAL_PREFIX.length);
            const reg = getRegistry();
            const entries = reg.modules.get(moduleName);

            if (!entries || entries.length === 0) {
                this.error(`BEM module not found: ${moduleName}`);
                return null;
            }

            // If the module has redefinitions, generate a barrel
            if (entries.length > 1) {
                return generateBarrel(moduleName, entries, rootDir);
            }

            // Single definition — just re-export
            const entry = entries[0];
            const entryPath = './' + relative(rootDir, entry.filePath).replace(/\\/g, '/');
            return `export { default } from '${entryPath}';\n`;
        },

        // Invalidate registry on file changes in BEM levels
        configureServer(server) {
            const levelDirs = platformLevels.map(l => resolve(rootDir, l));
            server.watcher.on('all', (event, filePath) => {
                for (const levelDir of levelDirs) {
                    if (filePath.startsWith(levelDir)) {
                        registry = null; // invalidate cache
                        break;
                    }
                }
            });
        },

        // Expose registry for testing and introspection
        api: {
            getRegistry() { return getRegistry(); },
            scanLevel,
            parseModulesDefine,
            parseDepsFile,
            normalizeDeps,
            expandBemEntity,
            generateBarrel,
            buildRegistry,
        },
    };
}

// Named exports for testing
export {
    scanLevel,
    parseModulesDefine,
    parseDepsFile,
    normalizeDeps,
    normalizeDep,
    bemEntityToModuleName,
    expandBemEntity,
    buildRegistry,
    generateBarrel,
    safeIdentifier,
};
