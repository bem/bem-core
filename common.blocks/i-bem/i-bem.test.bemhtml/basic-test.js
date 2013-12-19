var assert = require('assert'),
    bemhtml = require('bem-xjst/lib/bemhtml');

suite('BEMHTML Compiler', function() {
  function unit(name, src, data, dst) {
    test(name, function() {
      assert.equal(bemhtml.compile(src, { raw : true }).apply.call(data), dst);
    });
  }

  unit('true predicate', 'match().match()(true)', {}, true);
  unit('mode predicate: false case',
       'match()(false);mode("mode")(true)',
       {},
       false);
  unit('mode predicate: true case', 'match()(false);mode("mode")(true)', {
    _mode : 'mode'
  }, true);
  unit(
    'apply mode',
    'match()(false);mode("mode2")(true);mode("mode1")(function() {' +
    '  return apply("mode2");' +
    '})',
    { _mode : 'mode1' },
    true
  );
  unit(
    'applyNext mode',
    'match()(false);mode("mode1")(true);mode("mode2")(function() {' +
    '  return applyNext("mode1");' +
    '})',
    { _mode : 'mode1' },
    true
  );
});
