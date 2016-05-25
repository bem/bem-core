## Коллекции блоков и элементов

Общее описание
Способы получения
API

Для удобства работы одновременно с несколькими экземплярами блоков или элементов существует специальный класс **коллекции**,
реализованный в элементах `collection` блоков `i-bem` и `i-bem-dom`.

<a name="collection-crete"></a>
### Способы получения коллекции

#### Создание экземпляра класса коллекции

Экземпляр класса коллекции создается базовыми средствами JavaScript,
с помощью класса `BemCollection` модуля `i-bem__collection` или `BemDomCollection` модуля `i-bem-dom__collection`.
Конструктор обоих классов принимает один аргумент:

* `entities` `{Array}` — массив экземпляров БЭМ-сущностей.

**Пример:**

```js
modules.define(
    'my-form',
    ['i-bem-dom', 'i-bem-dom__collection', 'button', 'input'],
    function(provide, bemDom, BemDomCollection, Button, Input) {

provide(bemDom.declBlock(this.name, {
    onSetMod : {
        'js' : {
            'inited' : function() {
                var button = this.findChildBlock(Button),
                    input = this.findChildBlock(Input);

                this._controls = new BemDomCollection([button, input]);
            }
        }
    }
}));

});
```

#### Методы поиска

[Методы поиска](i-bem-js-dom.ru.md#api-find), способные найти несколько экземпляров блоков или элементов,
возвращают коллекцию, состоящую из найденных экземпляров.

**Пример:**

```js
modules.define('my-form', ['i-bem-dom', 'input'], function(provide, bemDom, Input) {

provide(bemDom.declBlock(this.name, {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._inputs = this.findChildBlocks(Input);
            }
        }
    }
}));

});
```

### Методы коллекции

* `setMod(modName, [modVal=true])`, `delMod(modName)`, `toggleMod(modName, modVal1, [modVal2], [condition])` — соответсвуют одноименным методам
  [управления модификаторами](i-bem-js-states.ru.md#mods-api) экземпляра блока и элемента.
* `everyHasMod(modName, [modVal])`, `someHasMod(modName, [modVal])` — применяют метод `hasMod(modName, modVal)` для каждой сущности коллекции.
  Возвращает `true`, если все вызовы вернули `true` и если хотябы один вызов вернул `true`, соответсвенно.
* `get(i)` — возвращает элемент коллекции по индексу i.
* `size()` — возвращает размер коллекции.
* `forEach(fn, ctx)`, `map(fn, ctx)`, `reduce(fn, ctx)`, `reduceRight(fn, ctx)`,
  `filter(fn, ctx)`, `some(fn, ctx)`, `every(fn, ctx)`,
  `has(entity)`, `find(fn, ctx)`,
  `concat(...args)` — соответствует одноименным методам [объекта Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).
* `toArray()` — преобразовывает коллекцию в массив экземпляров блоков и элементов.

**Пример:**
