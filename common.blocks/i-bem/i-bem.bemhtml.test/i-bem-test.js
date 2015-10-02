var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    bemhtml = require('bem-xjst/lib/bemhtml'),
    iBem = fs.readFileSync(path.resolve(
      __dirname,
      '../i-bem.bemhtml'
    )).toString();

suite('i-bem block and others', function() {
  function readFile(file) {
    return fs.readFileSync(path.resolve(__dirname, 'fixtures', file)).toString();
  }

  function unit(name, file, raw) {
    test(name, function() {
      var contents = {
        src : readFile(file + '.bemhtml'),
        data : JSON.parse(readFile(file + '.json')),
        dst : readFile(file + '.html')
      };

      assert.equal(
        bemhtml.compile(iBem + contents.src, { devMode : true, raw : raw })
            .apply.call(contents.data) + '\n',
        contents.dst
      );
      assert.equal(
        bemhtml.compile(iBem + contents.src, { devMode : false, raw : raw })
            .apply.call(contents.data) + '\n',
        contents.dst
      );
    });
  }

  unit('basic block', 'basic-block');
  unit('block with nested mixes', 'nested-mix');
  unit('block with nested looped mixes', 'looped-mix');
  unit('block with single non-array mix', 'single-mix');
  unit('blocks with local variables', 'local-var');
  unit('attr with empty value', 'empty-attrs');
  unit('one symbol elem', 'one-symbol-elem');
  unit('mix regression #232', 'gh-232');
  unit('condition regression #239', 'gh-239', true);
  unit('simple types regression #254', 'gh-254');
  unit('applyNext in content regression #289', 'gh-289');
  unit('boolean mods bem-core/169', 'boolean-mods');
  unit('mods redefinition bem-core/441', 'redefine-mods');
  unit('mix with same block bem-core/804', 'gh-core-804');
  unit('nested mix as object bem-core/873', 'gh-core-873');
  unit('string mix', 'string-mix');
  unit('reset apply next when entering content', 'reset-apply-next');
  unit('reapply regression bem-xjst#79', 'gh-bem-xjst-97');
});
