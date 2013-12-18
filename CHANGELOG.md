# Changelog

## 1.1.0

### Major changes

- Add ability to use any BEMJSON as value of attributes in BEMHTML templates (#290).
- Fix dependencies in `i-bem__collection` (#292).
- Remove `page` block's touch styles (#306).
- Fix `page` BEMHTML wrapping in production mode (#309).
- [ym](https://github.com/ymaps/modules) was updated to 0.0.12 (#326).
- Fix `FastClick` initialisation in `jquery__event_type_pointerclick` of `touch.blocks` (#332).

### Other changes

- Do not flood `console` with messages if `i-bem__i18n` is not in debug mode (#285).
- Fix jsdoc for `dropElemCache()` method of `i-bem__dom` module (#296).
- Development infrastructure was updated to [bem-pr@v0.5.x](https://github.com/narqo/bem-pr/blob/0.5.3/HISTORY.md) (#323).
- Russian documentation for `i-bem.js` was updated.
- [List of supported browsers](https://github.com/bem/bem-core/blob/v1/README.md#supported-browsers)
  was specified in project's README.

## 1.0.0

### Major changes

- Starts using modular system [ym](https://github.com/ymaps/modules).
- Removes all deprecated methods from `i-bem` and `i-bem__dom`.
- `i-bem` now has no dependency on jQuery. `i-bem__dom` still depends on jQuery.
- BEMHTML-template can be written with [JS-syntax](https://gist.github.com/veged/6150760).
- Introduces new tech `bemtree` (based on [bem-xjst](https://github.com/bem/bem-xjst))
  for describing dynamic generation of BEM-tree.
- Introduces new tech `vanilla.js` for JS-implementations that does not depend on particular JS-engine.
- Introduces new techs `browser.js` и `node.js` for JS-implementations targeted corresponding engines.
  For backward compatibility we assume that `.js`-files contains `browser.js` implementation.
- Introduces polyfill (`jquery__event_type_pointer` and `jquery__event_type_pointerclick` as a jQuery-plugins)
  for universalize desktop and touch pointer events.
- Introduces system for unit testing and blocks examples generation.
- Introduces "simple" modifiers (modifiers without value) support in `i-bem` and BEMHTML.

### Other changes

- Gets rid of prefixes in all block names (except `i-bem`).
- Block `i-bem__dom` becomes a module (in terms of [ym](https://github.com/ymaps/modules))
  and all `BEM.DOM`-block must define additions to `i-bem__dom` ([example](https://github.com/bem/bem-core/blob/v1/common.bundles/index/blocks/b-square/b-square.js)).
- Method for blocks declaration (`.decl()`) does not accept object with `name` field as first parameter.
  Required form with `block` field: `BEM.decl({ block: 'b1', modName: 'm', modVal: 'v' }, ...)`.
- Introduces `nextTick` method as replacement for `afterCurrentEvent` method
  for ensure of block existence in callback invocation time.
  `BEM.afterCurrentEvent` is **deprecated**.
- Introduces new `channels` module instead of `BEM.channel`. `BEM.channel` is **deprecated**.
- `changeThis` is **deprecated**. Use native `bind` instead.
- Removes `del` method from `i-bem` block.
- Removes `getWindowSize` method from `i-bem__dom` block. Use `BEMDOM.win.width()` and `BEMDOM.win.height()`.
- Introduces `jquery` module-wrapper for providing jQuery.
  If jQuery already included into the page module-wrapper provides it. Otherwise it loads jQuery (version 1.10.1) on its own.
- `$.observable` becomes `events` module and not longer depends on jQuery.
- `$.inherit` becomes `inherit` module and not longer depends on jQuery.
- `$.identify` becomes `identify` module and not longer depends on jQuery.
- `$.throttle` splits into two modules: `functions__throttle` and `functions__debounce`, they both not longer depend on jQuery.
- `$.decodeURI`, `$.decodeURIComponent` moves to `querystring__uri` module and not longer depends on jQuery.
- `$.cookie` becomes `cookie` module and not longer depends on jQuery.
- Introduces `ua` module instead of `$.browser` (with same interface).
- Use `pointerclick` instead of `leftclick`. It provides by `jquery__event_type_pointerclick` polyfill.
- `i-system` block splits into two modules: `idle` and `tick`.
- Triggers for modifiers changes now splitted into two groups:
  before setting new value (`beforeSetMod` and `beforeElemSetMod`)
  and after the value has been set (`onSetMod` and `onElemSetMod`).
  Cancellation of modifiers change is possible only from `before*`-triggers.
- Using of `{ onSetMod : { js : function() { ... } } }` is **deprecated**, use `onSetMod: { js : { inited : ... } } }`.
- `destruct` method from `i-bem` block is **deprecated**.
  Use supplementary trigger for `_js` modifiers:
  `onSetMod: { js : { inited : ... } } }` — `{ onSetMod : { js : { '' : ... } } }`.
- `exractParams` method from `i-bem__dom` block is **deprecated**.
  Use `elemParams` method for access to elements params.
- `trigger` method from `i-bem` block is **deprecated** in flavor of `emit` method.
- `onFirst` method from `i-bem` block is **deprecated** in flavor of `once` method.
- **Deprecated** field `e.block` that provided block-target of BEM-events was removed. Use `e.target` field instead.
- Field `e.domElem` that provided DOM-element of block in DOM-events was removed. Use `$(e.currentTarget)` (provided by jQuery).
- Introduces parameter for `findElem` method that allows to search elements
  of particular block instance (in case of nested blocks with same name).
- Introduces possibility to point particular function in `unbindFrom*` methods.
- Introduces `objects` module for work with JS-objects. It contains methods: `extend`, `isEmpty`, `each`.
- Introduces `functions` module for work with JS-functions. It contains methods: `isFunction`, `noop`.
- Introduces `dom` module for work with DOM-tree.
- Introduces `querystring` module for work with URL-based strings.
- Introduces `loader_type_js` module for JS loading.
- Introduces `vow` module for Promises/A+.
- Introduces `next-tick` module as polyfill for `nextTick`, `setImmediate`, `setTimeout(0, ...` and etc.
- Introduces `strings__escape` module for XML, HTML and attributes escaping.
- `inherit` module now supports mixins.
- Introduces `invokeAsap` parameter for `functions__throttle` module that allows to delay first invocation.
