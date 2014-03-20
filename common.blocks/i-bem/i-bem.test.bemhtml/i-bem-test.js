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
    return fs.readFileSync(path.resolve(__dirname, 'files', file)).toString();
  }

  function unit(name, file, raw) {
    test(name, function() {
      var contents = {
        src : readFile('i-bem/' + file + '.bemhtml'),
        data : JSON.parse(readFile('i-bem/' + file + '.json')),
        dst : readFile('i-bem/' + file + '.html')
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
});
