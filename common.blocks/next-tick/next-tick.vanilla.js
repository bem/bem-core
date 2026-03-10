/**
 * @module next-tick
 */

/**
 * Executes given function on next tick.
 * @type Function
 * @param {Function} fn
 */

let fns = []
const enqueueFn = fn => {
    fns.push(fn)
    return fns.length === 1
  },
  callFns = () => {
    const fnsToCall = fns
    fns = []
    for(const fn of fnsToCall)
      fn()
  }

/* global process */
const nextTick = typeof queueMicrotask === 'function'
  ? fn => { enqueueFn(fn) && queueMicrotask(callFns) }
  : typeof process === 'object' && process.nextTick
    ? fn => { enqueueFn(fn) && process.nextTick(callFns) }
    : fn => { enqueueFn(fn) && globalThis.setTimeout(callFns, 0) }

export default nextTick
