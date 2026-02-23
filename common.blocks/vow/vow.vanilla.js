/**
 * @module vow
 * @description Thin compatibility shim around native Promise.
 * Replaces the full vow library (v0.4.17) with native ES2024+ equivalents.
 *
 * Dropped APIs (no native equivalent, rarely used):
 * - progress/notify (never standardized in Promises/A+)
 * - spread (use destructuring in .then())
 * - done (use .catch() or unhandledrejection event)
 * - always (use .finally())
 * - allPatiently (use Promise.allSettled + manual filtering)
 * - valueOf, isFulfilled, isRejected, isResolved on instances (synchronous state inspection)
 * - fulfill (use resolve)
 * - fail (use .catch())
 *
 * Changed behavior:
 * - vow.allResolved() now returns Promise.allSettled() format ({status, value/reason})
 * - vow.any() rejects with AggregateError (native), not first rejection reason
 * - Deferred.reject() with a promise no longer auto-unwraps
 */

/**
 * @class TimedOutError
 * @augments Error
 */
class TimedOutError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TimedOut';
    }
}

/**
 * @class Deferred
 * @description Encapsulates a promise with external resolve/reject controls.
 * Use `vow.defer()` to create instances.
 */
class Deferred {
    constructor() {
        let resolve, reject;
        this._promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        this._resolve = resolve;
        this._reject = reject;
    }

    /**
     * Returns the corresponding promise.
     * @returns {Promise}
     */
    promise() {
        return this._promise;
    }

    /**
     * Resolves the corresponding promise with the given value.
     * @param {*} value
     */
    resolve(value) {
        this._resolve(value);
    }

    /**
     * Rejects the corresponding promise with the given reason.
     * @param {*} reason
     */
    reject(reason) {
        this._reject(reason);
    }
}

/** @exports vow */
var vow = {
    Deferred,
    Promise,
    TimedOutError,

    /**
     * Creates a new deferred.
     * @returns {Deferred}
     */
    defer() {
        return new Deferred();
    },

    /**
     * Returns a promise resolved with the given value.
     * @param {*} value
     * @returns {Promise}
     */
    resolve(value) {
        return Promise.resolve(value);
    },

    /**
     * Returns a promise rejected with the given reason.
     * @param {*} reason
     * @returns {Promise}
     */
    reject(reason) {
        return Promise.reject(reason);
    },

    /**
     * Returns a promise fulfilled when all items are fulfilled.
     * @param {Array|Iterable} iterable
     * @returns {Promise}
     */
    all(iterable) {
        return Promise.all(iterable);
    },

    /**
     * Returns a promise fulfilled when all items are settled (fulfilled or rejected).
     * @param {Array|Iterable} iterable
     * @returns {Promise}
     */
    allResolved(iterable) {
        return Promise.allSettled(iterable);
    },

    /**
     * Returns a promise fulfilled when any item is fulfilled.
     * @param {Array|Iterable} iterable
     * @returns {Promise}
     */
    any(iterable) {
        return Promise.any(iterable);
    },

    /**
     * Returns a promise fulfilled when the first item settles.
     * @param {Array|Iterable} iterable
     * @returns {Promise}
     */
    anyResolved(iterable) {
        return Promise.race(iterable);
    },

    /**
     * Checks whether the given value is a promise-like object (thenable).
     * @param {*} value
     * @returns {Boolean}
     */
    isPromise(value) {
        return value !== null &&
            typeof value === 'object' &&
            typeof value.then === 'function';
    },

    /**
     * Coerces the given value to a promise.
     * @param {*} value
     * @returns {Promise}
     */
    cast(value) {
        return Promise.resolve(value);
    },

    /**
     * Static equivalent to promise.then().
     * @param {*} value
     * @param {Function} [onFulfilled]
     * @param {Function} [onRejected]
     * @returns {Promise}
     */
    when(value, onFulfilled, onRejected) {
        return Promise.resolve(value).then(onFulfilled, onRejected);
    },

    /**
     * Invokes fn with args, returns a promise of the result.
     * @param {Function} fn
     * @param {...*} args
     * @returns {Promise}
     */
    invoke(fn, ...args) {
        try {
            return Promise.resolve(fn(...args));
        } catch(e) {
            return Promise.reject(e);
        }
    },

    /**
     * Returns a promise that resolves after a delay.
     * @param {*} value
     * @param {Number} delay milliseconds
     * @returns {Promise}
     */
    delay(value, delay) {
        return Promise.resolve(value).then(
            val => new Promise(resolve => setTimeout(() => resolve(val), delay))
        );
    },

    /**
     * Returns a promise that rejects if not resolved within timeout.
     * @param {*} value
     * @param {Number} timeout milliseconds
     * @returns {Promise}
     */
    timeout(value, timeout) {
        return Promise.race([
            Promise.resolve(value),
            new Promise((_, reject) =>
                setTimeout(() => reject(new TimedOutError('timed out')), timeout)
            ),
        ]);
    },
};

export default vow;
