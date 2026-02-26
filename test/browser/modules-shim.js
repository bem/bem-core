/**
 * Minimal synchronous ym-compatible modules shim for browser tests.
 *
 * Supports:
 *   modules.define(name, deps, factory)   — normal definition
 *   modules.define(name, factory)          — redefinition (factory receives prev value as 2nd arg)
 *   modules.require(deps, factory)         — resolve deps synchronously, call factory
 */
export function createModulesShim(preRegistered) {
    // name → [{deps, factory, isRedef}]
    const registry = new Map();
    // name → resolved value (cache)
    const resolved = new Map();

    for (const [name, value] of Object.entries(preRegistered)) {
        resolved.set(name, value);
    }

    function resolve(name) {
        if (resolved.has(name)) return resolved.get(name);

        const entries = registry.get(name);
        if (!entries || !entries.length) {
            throw new Error(
                `Module "${name}" is not defined.\nKnown: ${[
                    ...resolved.keys(),
                    ...registry.keys(),
                ].join(', ')}`
            );
        }

        let value;
        let runCount = 0;
        for (const { deps, factory, isRedef } of entries) {
            try {
                const depVals = deps.map(d => resolve(d));
                if (isRedef) {
                    factory(v => { value = v; }, value, ...depVals);
                } else {
                    factory(v => { value = v; }, ...depVals);
                }
                runCount++;
            } catch (err) {
                // Log but continue — one failing spec factory must not block others
                console.error(`[modules] factory #${runCount} for "${name}" threw:`, err);
            }
        }

        resolved.set(name, value);
        return value;
    }

    const shim = {
        define(name, depsOrFactory, factoryArg) {
            const isRedef = typeof depsOrFactory === 'function';
            const deps = isRedef ? [] : depsOrFactory;
            const factory = isRedef ? depsOrFactory : factoryArg;

            if (!registry.has(name)) registry.set(name, []);
            registry.get(name).push({ deps, factory, isRedef });

            // Clear cache if re-defining after resolution
            resolved.delete(name);
        },

        require(deps, factory) {
            const depVals = deps.map(d => resolve(d));
            factory(...depVals);
        },
    };

    return shim;
}
