# Changelog

## 3.0.1

### Bug fixes

- An issue with pointer events on iOS devices was fixed ([#1253](https://github.com/bem/bem-core/issues/1253)).

## 3.0.0

### Breaking changes

- Base templates for `BEMHTML` and `BEMTREE` were removed ([#1258](https://github.com/bem/bem-core/issues/1258)). `bem-xjst` 6.3.0+ should be used instead.
- File extentions of BEMHTML templates were renamed from `*.bemhtml` to `*.bemhtml.js` ([#984](https://github.com/bem/bem-core/issues/984)). Please check that new extention is supported in you build config.
- `i-bem__i18n` element was removed ([#1304](https://github.com/bem/bem-core/issues/1304)). Please use `i18n` block for internationalization.
- `jquery__events_type_pointerclick` is not using [FastClick](https://github.com/ftlabs/fastclick) anymore ([#1088](https://github.com/bem/bem-core/issues/1088)).

### Notable changes

- `jQuery` was updated to 2.2.3 and 1.12.3 ([#1260](https://github.com/bem/bem-core/issues/1260)).

### Bug fixes

- An issue in `page` was fixed. `<meta name=viewport>` had wrong `user-scalable` value on the touch level ([#1294](https://github.com/bem/bem-core/issues/1294)).
- An issue in `jquery__event_type_pointernative` which led to JS error in IE8 was fixed ([1317](https://github.com/bem/bem-core/issues/1317)).

### Other changes

- dist: Autoinitialisation of blocks is optional now ([#1271](https://github.com/bem/bem-core/issues/1271)).

## 2.9.0

### Notable changes

- `jQuery` was updated to 2.2.0 and 1.12.0 ([#1249](https://github.com/bem/bem-core/issues/1249)).

### Bug fixes

- Fixed bug in BEMHTML 1.x which leads to drop of `this.mods` in `reapply()` ([#97](https://github.com/bem/bem-xjst/issues/97)).

### Other changes

- `jquery__event_type_pointerpressrelease` now exposes `originalEvent` ([#1254](https://github.com/bem/bem-core/issues/1254)).
- dist: Support for `i18n` was added to dist ([#1212](https://github.com/bem/bem-core/issues/1212)).
- `page__css.bemhtml` template was updated to support new `bem-xjst` versions ([#1228](https://github.com/bem/bem-core/issues/1228)).

## 2.8.0

### Notable changes

- New [i18n](https://github.com/bem/bem-core/tree/v2/common.blocks/i18n) block was introduced, providing support for internationalization ([#1074](https://github.com/bem/bem-core/issues/1074)).
- Now jQuery is included via `https` by default ([#1202](https://github.com/bem/bem-core/issues/1202)).
- Dependency on `bemhtml-compat` was dropped ([#1186](https://github.com/bem/bem-core/issues/1186)). Users of `bem-tools` need to run `npm i bemhtml-compat --save` to install it on their projects.

### Bug fixes

- Bug with undefined handler call in `loader_type_js` was fixed ([#1159](https://github.com/bem/bem-core/pull/1159)).

### Other changes

- BH bundles in `dist` now mimic to BEMHTML ([#1210](https://github.com/bem/bem-core/issues/1210)).
- `bem create` templates for `bemhtml`, `bemtree`, `vanilla.js` and `browser.js` were improved ([#1183](https://github.com/bem/bem-core/issues/1183)).
- `vow` was updated to `0.4.10` ([#1056](https://github.com/bem/bem-core/issues/1056)).

## 2.7.0

### Notable changes

- New `detach` method was added to `i-bem__dom` ([#1102](https://github.com/bem/bem-core/issues/1102)).
- `i-bem.bemhtml` now supports nested mixes as objects ([873](https://github.com/bem/bem-core/issues/873)).
- Some minor attribute escaping optimizations were added to `i-bem.bemhtml` ([#961](https://github.com/bem/bem-core/issues/961)), ([#980](https://github.com/bem/bem-core/issues/980)) and ([#982](https://github.com/bem/bem-core/issues/982)).
- Support for [bem-xjst](https://github.com/bem/bem-xjst) 2.x was added to BEMHTML templates ([#1021](https://github.com/bem/bem-core/issues/1021)).
- `clearfix` was optimized to work properly in supported IE browsers ([#722](https://github.com/bem/bem-core/issues/722)).
- `jquery` was updated to 2.1.4 and 1.11.3 ([#999](https://github.com/bem/bem-core/issues/999)).

### Bug fixes

- An issue in `i-bem__dom` was fixed. `findElem` didn't update cache of elements that
  had been found previously ([#583](https://github.com/bem/bem-core/issues/583)).
- An issue in `i-bem__dom` was fixed. `dropElemCache` worked incorrectly in some edge cases ([#1037](https://github.com/bem/bem-core/issues/1037)).
- An issue in `i-bem__dom` was fixed. `setMod` didn't add CSS classes if blocks on the same DOM node had
  overlapping end parts in their names ([#1090](https://github.com/bem/bem-core/issues/1090)).
- An issue in `page` was fixed. `zoom` attribute of the block didn't work for touch levels ([#1020](https://github.com/bem/bem-core/issues/1020)).
- An issue in `keyboard__codes` was fixed. `insert` and `delete` keys had wrong key codes ([#1002](https://github.com/bem/bem-core/issues/1002)).
- An issue in `i-bem.bemhtml` was fixed. `applyNext` calls were skipped in nested templates ([b1dc50c](https://github.com/bem/bem-core/commit/b1dc50c621b5659cff33daa4dd3f210b67cf25e1)).
- An issue in `jquery__events_type_pointernative` was fixed to work properly in IE 11/Edge ([#1066](https://github.com/bem/bem-core/issues/1066)).

### Other changes

- Russian documentation for every blocks was reworked. Please visit https://ru.bem.info/libs/bem-core/ for new documentation.
- Other minor improvements of the documentation.

## 2.6.0

### Notable changes

- Since now `i-bem__dom` provides module after DOM is ready ([#859](https://github.com/bem/bem-core/issues/859)).
- Since now `setMod` and `hasMod` methods of `i-bem__dom` convert their `modVal` argument to string in case
  it is not of type string or boolean ([#890](https://github.com/bem/bem-core/issues/890)).
- An ability to pass `nonce` attribute was added to `page`, to support related parts of Content Security Policy
  specification ([#882](https://github.com/bem/bem-core/issues/882)).
- New `page__conditional-comment` template was added ([#551](https://github.com/bem/bem-core/issues/511)).
- `vow` was updated to 0.4.8 ([#837](https://github.com/bem/bem-core/issues/837)).

### Bug fixes

- An issue in `i-bem.bemhtml` was fixed. Block CSS class repeated in case of mix with the same
  block ([#792](https://github.com/bem/bem-core/issues/792)).
- An issue in `loader_type_bundle` was fixed. Success callback might be applied after timeout
  error ([67ff55f](https://github.com/bem/bem-core/commit/da5fdb9923e7e83e3ef9cd31aefc3967ff55fd3c)).
- An issue in `i-bem__dom` was fixed. `append`, `prepend` and other similar methods won't properly work with strings
  in some cases ([#852](https://github.com/bem/bem-core/issues/852)).
- An issue in `jquery__event_type_winresize` was fixed. MSIE wasn't detected properly ([#862](https://github.com/bem/bem-core/issues/862)).
- An issue in `object` was fixed to proper handle `null` value as `target` argument in `extend` method ([#910](https://github.com/bem/bem-core/issues/910)).
- An issue in `page` was fixed. There was no way to disable `x-ua-compatible` meta tag from BEMJSON ([#794](https://github.com/bem/bem-core/issues/794)).

### Other changes

- Timeout in `loader_type_bundle` module was increased to 30000 ms ([4e27422](https://github.com/bem/bem-core/commit/000c6af02bfae4506fa460168de16d4e27422393)).
- Russian documentation for several blocks was fixed.

## 2.5.1

### Bug fixes

- An issue in `jquery__pointerpress` and `jquery__pointerrelease` was fixed. Events work now in
  Internet Explorer 8 ([#792](https://github.com/bem/bem-core/issues/792)).
- An issue in `jquery__pointernative` was fixed. `pointerenter` and `pointerleave` events have bubbled up
  to the document root, while they shouldn't ([#801](https://github.com/bem/bem-core/issues/801)).
- An issue in `loader_type_bundle` was fixed. CSS bundle has been always added to the top of the HTML `<head>`, so CSS rules
  from the bundle might not work properly ([#808](https://github.com/bem/bem-core/issues/808)).
- Issues in BH templates for `ua` were fixed. There was no possibility to pass the content of the block from
  BEMJSON ([#734](https://github.com/bem/bem-core/pull/734)).
- An issue in `page` was fixed. There was a problem with conditional comments for Internet Explorer in the BH template
  of the block ([#781](https://github.com/bem/bem-core/pull/781)).

### Other changes

- `jquery` was updated to the 2.1.3 and 1.11.2 ([#778](https://github.com/bem/bem-core/pull/788)).
- Russian documentation for modules: `clearfix`, `cookie`, `identify`, `idle`, `inherit`, `keyboard`, `loader`, `next-tick`,
  `string` and `tick` was added.
- Russian documentation for `i-bem.js` was updated.
- English guides to BEMHTM and BEMJSON were updated.

## 2.5.0

### Notable changes

- bem-core in now published under the [MPL 2.0](https://www.mozilla.org/MPL/2.0/) license ([#443](https://github.com/bem/bem-core/issues/443)).
- An ability to specify error handler was added to `loader_type_js` ([#672](https://github.com/bem/bem-core/issues/672)).
- `BEMContext` class was added to `oninit` export context in `i-bem.bemtree` ([#602](https://github.com/bem/bem-core/issues/602)).
- `reapply` static method was added to BEMContext class of BEMTREE ([#706](https://github.com/bem/bem-core/pull/706)).
- bh templates for block `page` were added to touch level ([#689](https://github.com/bem/bem-core/pull/689)).
- [bem-xjst](https://github.com/bem/bem-xjst) was updated to 0.9.0 ([#709](https://github.com/bem/bem-core/pull/709)).

### Bug fixes

- An issue in `i-bem__dom` was fixed. `findBlocksInside` could return blocks which weren't inited  ([#699](https://github.com/bem/bem-core/issues/699)).
- An issue in `tick` was fixed. Timer was not removed by `Tick#stop()` ([#694](https://github.com/bem/bem-core/issues/694)).
- An issue in `i-bem.bemhtml` was fixed. `i-bem` CSS class was added to elements by mistake ([#633](https://github.com/bem/bem-core/issues/633)).
- `html-from-bemtree` tech was fixed to expose `vow`, `console`, `setTimeout` inside BEMTREE template context  ([#438ebb8](https://github.com/bem/bem-core/commit/438ebb8f828e26977592e26511e8aad15176d7a4)).

### Other changes

- English guide to BEMJSON was added.
- Russian documentation for `querystring` module was added.
- Russian documentation for `i-bem.js` was fixed to satisfy current API.
- Documentation for BEMHML/BEMTREE for both languages was updated.

## 2.4.0

### Notable changes

- [bem-xjst](https://github.com/bem/bem-xjst) was updated to 0.8.0; [bemhtml-compat](https://github.com/bem/bemhtml-compat) was updated to 0.0.11.

### Bug fixes

- An issue in `jquery__event_type_pointerpressrelease` was fixed. `pointerpress`/`pointerrelease` events fired for any press/release
  of mouse button ([#607](https://github.com/bem/bem-core/issues/607)).
- An issue in `i-bem__dom.js` was fixed. Base `live` method was not properly called in some edge cases ([#608](https://github.com/bem/bem-core/issues/608)).

### Other changes

- English documentation for JS-syntax of BEMHTML was added.

## 2.3.0

### Notable changes

- New implementation of pointer events was added. Based on pointer events polyfills from [Polymer](http://www.polymer-project.org/) ([#567](https://github.com/bem/bem-core/pull/567)).
- Ability to specify additional data for event was added to `bindTo*` methods of `i-bem__dom.js` ([#568](https://github.com/bem/bem-core/issues/568)).

### Other changes

- An issue in `i-bem.bemhtml` was fixed. There was an error when mix was used as an object (not an array) in BEMJSON and BEMHTML simultaneously ([#555](https://github.com/bem/bem-core/issues/555)).
- An issue in `page` was fixed. There was no possibility to apply standard modes to `page` in BEMHTML template and touch template was broken ([516](https://github.com/bem/bem-core/issues/516)).

## 2.2.4

### Bug fixes

- An issue in `i-bem.js` was fixed. Modifier change event has been emitted even if `beforeSetMod` handler
  had prevented change ([#546](https://github.com/bem/bem-core/pull/546)).
- String decoding process of `querystring__uri` module was fixed to return original string
  if decode failed ([#554](https://github.com/bem/bem-core/pull/554)).

## 2.2.3

### Bug fixes

- Destruction process of blocks was fixed to prevent unexpected block reinitialization ([#540](https://github.com/bem/bem-core/issues/540)).
- An issue in `jquery__event_type_pointer` was fixed. Native mouse events were replaced with pointer events
  in unexpected cases ([#534](https://github.com/bem/bem-core/issues/534)).
- `unbindFrom*` methods of `i-bem__dom` now support multiple events to be passed in arguments ([#533](https://github.com/bem/bem-core/issues/533)).
- Lost `functions` dependency in `events` module was restored ([#532](https://github.com/bem/bem-core/issues/532)).

## 2.2.2

### Bug fixes

- An issue with block reinitialization on the DOM node, that has been processed with destructor, was fixed
  in `i-bem__dom` ([#518](https://github.com/bem/bem-core/issues/518)).
- An issue in mod events subscription was fixed in `i-bem`. `false` could be used as `modVal` ([#529](https://github.com/bem/bem-core/issues/529)).
- `jquery` was updated to the latest minor releases 2.1.1 and 1.11.1 ([#515](https://github.com/bem/bem-core/issues/515)).

## 2.2.1

- An issue in `jquery__event_type_pointerpressrelease` was fixed. `pointerpress` event has been triggered twice on each mousedown
  in IE10 ([#505](https://github.com/bem/bem-core/issues/505)).

## 2.2.0

### Notable changes

- New `keyboard__codes` module has been added ([#431](https://github.com/bem/bem-core/issues/431)).
- `BEMContext` class was added to oninit export context in `i-bem.bemhtml` ([#485](https://github.com/bem/bem-core/pull/485)).
- Ability to declare elements with block class has been added ([#481](https://github.com/bem/bem-core/issues/481)).
- Behaviour of `isSimple` method of `BEMContext` was fixed in `i-bem.bemhtml` ([#432](https://github.com/bem/bem-core/pull/432)).
- An issue with `liveUnbindFrom` method of `BEMDOM` was fixed in `i-bem__dom` ([#476](https://github.com/bem/bem-core/pull/476)).
- An issue with `isFocusable` method of `dom` module was fixed for cases where `domElem` is a link with `tabindex` attribute,
  but without `href` ([#501](https://github.com/bem/bem-core/issues/501)).
- Short way of module declaration was fixed for `i-bem__dom_elem-instances` ([#479](https://github.com/bem/bem-core/issues/479)).
- A workaround for rendering performance of blocks initialisation in Chrome-based browsers was added
  to `i-bem__dom_init_auto` ([#486](https://github.com/bem/bem-core/issues/486)).
- `vow.js` module has been moved to `vow.vanilla.js` ([#412](https://github.com/bem/bem-core/issues/412)).

### Other changes

- `vow` module has been updated to 0.4.3 ([#504](https://github.com/bem/bem-core/pull/504)).
- Russian documentation about BEMTREE technology was added ([#500](https://github.com/bem/bem-core/pull/500)).
- Russian documentation for JS-syntax of BEMHTML was updated ([#471](https://github.com/bem/bem-core/pull/471)).
- API references for JS-modules has been added as a separate branch `v2-jsdoc` ([#478](https://github.com/bem/bem-core/pull/478)).

## 2.1.0

### Notable changes

- An issue in `i-bem.js` when modifiers change event had been emitted before `onSetMod` handlers have been called was fixed ([#454](https://github.com/bem/bem-core/issues/454)).
- An issue in `i-bem.bemhtml` was fixed. Since now `this.mods` and `this.ctx.mods` use the same object ([#441](https://github.com/bem/bem-core/issues/441)).
- Error in modular declaration of element modifiers was fixed in `i-bem__dom_elem-instances` ([#447](https://github.com/bem/bem-core/issues/447)).
- [inherit](https://github.com/dfilatov/inherit) module was updated to 2.2.1 ([#466](https://github.com/bem/bem-core/issues/466)).
- An order of tags in `head` section of `page.bemhtml` was fixed ([#465](https://github.com/bem/bem-core/pull/465)).

### Other changes

- `baseMix` field description of `i-bem.js` was added to russian docs ([#461](https://github.com/bem/bem-core/pull/461)).
- CDN host was changed to `yastatic.net` ([#444](https://github.com/bem/bem-core/issues/444)).
  Previous CDN host `yandex.st` is still accessible. Physically they both are the same web servers. DNS records is the only difference.
- BEMHTML template for `bem create` command was added ([#277](https://github.com/bem/bem-core/issues/277)).
- We do not support autobuilding of our tests with Node.js 0.8 in [Travis CI](http://travis-ci.com) any longer ([#455](https://github.com/bem/bem-core/issues/455)).
- Travis's build status badge [was changed to SVG version](http://blog.travis-ci.com/2014-03-20-build-status-badges-support-svg/) :)

## 2.0.0

### Breaking changes

- All deprecated methods have been removed from `i-bem.js` and `i-bem__dom.js` ([#318](https://github.com/bem/bem-core/issues/318)).
  The following methods were removed:

  * `destruct`, use `onSetMod js ''`;
  * `extractParams`, use `elemParams`;
  * `trigger`, use `emit`;
  * `afterCurrentEvent`, use `next-tick` module;
  * `channel`, use `events__channels` module;
  * `changeThis`, use native `Function.prototype.bind`.

- `init` and `destruct` events have been removed from `i-bem.js` in favor of modifiers changes events (see "Notable changes" section below).
- `ecma` was moved to [separate repo](http://github.com/bem/es5-shims); ES5-shims should be used
  for IE < 9 ([#230](https://github.com/bem/bem-core/issues/230)).
- `vow` module has been updated to 0.4.1 ([#350](https://github.com/bem/bem-core/issues/350)).
  See [Vow's changelog](https://github.com/dfilatov/vow/blob/0.4.1/CHANGELOG.md) for changes.
- Support for vow@0.4 has been added to `i-bem.bemhtml` ([#385](https://github.com/bem/bem-core/issues/385)).

### Notable changes

- Support for defining BEMDOM-blocks as [ym](https://github.com/ymaps/modules) modules has been added ([#382](https://github.com/bem/bem-core/issues/382)).
- Events for modifiers changes have been added to `i-bem.js` ([#357](https://github.com/bem/bem-core/issues/357)).
- Support for passing string values has been added to `BEMDOM.init`
  ([#419](https://github.com/bem/bem-core/issues/419)).
  and `BEMDOM.update` methods ([#420](https://github.com/bem/bem-core/issues/420)).
- DOM helpers from `i-bem__dom.js` `replace`, `append`, `prepend`, `before`, `after` now return new context and `update` returns
  updated context as a jQuery object ([#410](https://github.com/bem/bem-core/issues/410)).
- New `loader_type_bundle` has been added ([#358](https://github.com/bem/bem-core/issues/358)).
- Default jQuery versions were updated to 2.1.0 and to 1.11.0, for IE < 9 ([#356](https://github.com/bem/bem-core/issues/356)).

### Other changes

- `i-bem.bemhtml` now uses strings concatination instead of pushing to buffer in it's internals ([#401](https://github.com/bem/bem-core/issues/401)).
- jQuery no longer removes itself from global scope if it exists ([#349](https://github.com/bem/bem-core/issues/349)).
- `jquery__event_type_pointerclick.js` has been moved from touch level to common ([#393](https://github.com/bem/bem-core/issues/393)).
- Modifiers `i-bem_elem-instances_yes` and `i-bem__dom_elem-instances_yes` were renamed to boolean style ([#352](https://github.com/bem/bem-core/issues/352)).
- Runtime error in `page` template in development mode has been fixed ([#417](https://github.com/bem/bem-core/issues/417)).
- Usage of `Function.prototype.bind` has been droped from `i-bem.js` internals in favor of support
  for Android 2.3 ([#404](https://github.com/bem/bem-core/issues/404)).
- Some bugs in `browser-js+bemhtml` tech have been fixed ([#392](https://github.com/bem/bem-core/issues/392)).
- Up to [ym@0.0.15](https://github.com/ymaps/modules/releases) ([#414](https://github.com/bem/bem-core/issues/414)).

## 1.2.0

### Notable changes

- BEM-blocks are emit `destruct` event on destructing ([#370](https://github.com/bem/bem-core/issues/370)).
- Improvements of `pointerevents` polyfills ([#354](https://github.com/bem/bem-core/pull/354)).

### Other changes

- All JSDocs were fixed so [bem-jsd](github.com/bem/bem-jsd) could parse them ([#335](https://github.com/bem/bem-core/issues/335)).
- Russian version of BEMHTML reference was actualized to JavaScript syntax ([#355](https://github.com/bem/bem-core/pull/355)).
- Use [bower](http://bower.io) for dependency management ([#367](https://github.com/bem/bem-core/issues/367)).

## 1.1.0

### Notable changes

- `jquery__config` uses jQuery 2.x by default for modern browsers ([#319](https://github.com/bem/bem-core/issues/319)).
- Add ability to use any BEMJSON as value of attributes in BEMHTML templates ([#290](https://github.com/bem/bem-core/issues/290)).
- Fix dependencies in `i-bem__collection` ([#292](https://github.com/bem/bem-core/issues/292)).
- Remove `page` block touch styles ([#306](https://github.com/bem/bem-core/issues/306)).
- Fix `page` BEMHTML wrapping in production mode ([#309](https://github.com/bem/bem-core/issues/309)).
- Fix possible JavaScript error in script injection in IE<9 in `next-tick` ([#324](https://github.com/bem/bem-core/issues/324)).
- Fix `FastClick` initialisation in `jquery__event_type_pointerclick` of `touch.blocks` ([#332](https://github.com/bem/bem-core/issues/332)).
- Fix `node.js` tech bug on Windows systems ([#274](https://github.com/bem/bem-core/issues/274)).
- Fix `i-bem__dom_elem-instances` bug with `onElemSetMod` ([#340](https://github.com/bem/bem-core/issues/340)).
- Use bemhtml from [bem-xjst](https://github.com/bem/bem-xjst) ([#329](https://github.com/bem/bem-core/issues/329)).

### Other changes

- [ym](https://github.com/ymaps/modules) was updated to 0.0.12 ([#326](https://github.com/bem/bem-core/issues/326)).
- Do not flood `console` with messages if `i-bem__i18n` is not in debug mode ([#285](https://github.com/bem/bem-core/issues/285)).
- Fix jsdoc for `dropElemCache()` method of `i-bem__dom` module ([#296](https://github.com/bem/bem-core/issues/296)).
- Development infrastructure was updated to
  [bem-pr@v0.5.x](https://github.com/narqo/bem-pr/blob/0.5.3/HISTORY.md) ([#323](https://github.com/bem/bem-core/issues/323)).
- Russian documentation for `i-bem.js` was updated.
- [List of supported browsers](https://github.com/bem/bem-core/blob/v1/README.md#supported-browsers)
  was specified in project README.

## 1.0.0

### Breaking changes

- Starts using modular system [ym](https://github.com/ymaps/modules).
- Removes all deprecated methods from `i-bem` and `i-bem__dom`.
- `i-bem` now has no dependency on jQuery. `i-bem__dom` still depends on jQuery.
- BEMHTML-template can be written with [JS-syntax](https://gist.github.com/veged/6150760).
- Introduces new tech `bemtree` (based on [bem-xjst](https://github.com/bem/bem-xjst))
  for describing dynamic generation of BEM-tree.
- Introduces new tech `vanilla.js` for JS-implementations that does not depend on particular JS-engine.
- Introduces new techs `browser.js` and `node.js` for JS-implementations targeted corresponding engines.
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
- Field `e.data.domElem` that provided DOM-element of block in DOM-events was removed. Use `$(e.currentTarget)` (provided by jQuery).
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
