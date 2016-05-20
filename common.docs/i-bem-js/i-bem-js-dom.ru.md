<a name="dom"></a>
## Работа с DOM-деревом

<a name="domElem"></a>
### DOM-узел экземпляра блока и элемента

В контексте экземпляра блока и элемента с DOM-представлением зарезервировано поле `this.domElem`,
содержащее jQuery-объект со ссылками на все DOM-узлы, с которыми связан данный экземпляр.

<a name="api-find"></a>
### Поиск экземпляров блоков и элементов в DOM-дереве

Обращение к другому блоку в `i-bem.js` выполняется из текущего блока, размещенного на определенном узле DOM-дерева.
Поиск других блоков в DOM-дереве может вестись по трём направлениям (осям) относительно DOM-узла текущего блока:

* **Внутри блока** — на DOM-узлах, вложенных в DOM-узел текущего блока.
  Вспомогательные методы: `findChildBlock(block)`, `findChildBlocks(block)`, `findChildElem(elem)`, `findChildElems(elem)`.
* **Снаружи блока** — на DOM-узлах, потомком которых является DOM-узел текущего блока.
  Вспомогательные методы: `findParentBlock(block)`, `findParentBlocks(block)`, `findParentElem(elem)`, `findParentElems(elem)`.
* **На себе** — на том же DOM-узле, на котором размещен текущий блок.
  Это актуально в случае [размещения нескольких JS-блоков на одном DOM-узле](i-bem-js-html-binding.ru.md#html-mixes) (микс).
  Вспомогательные методы: `findMixedBlock(block)`, `findMixedBlocks(block)`, `findMixedElem(elem)`, `findMixedElems(elem)`.
  Методы `findMixedBlocks(block)` и `findMixedElems(elem)` могут возвращать больше одного экземпляра в случае,
  когда к [блоку или элементу с несколькими DOM-узлами](i-bem-js-html-binding#distrib-block)
  примешаны несколько разных экземпляров одного и того же блока (`block`) или (`elem`).

Сигнатура вспомогательных методов поиска блоков идентична:

* `block` `{Function|Object}` – класс или описание искомого блока. Описанием служит хеш вида `{ block : MyBlock, modName : 'my-mod', modVal : 'my-val' }`.

Для методов поиска элементов:

* `elem` `{String|Function|Object}` – имя, класс или описание искомого элемента. Описанием служит хеш вида `{ elem : MyElem, modName : 'my-mod', modVal : 'my-val' }` или `{ elem : 'my-elem', modName : 'my-mod', modVal : 'my-val' }`.
* `[strictMode=false]` `{Boolean}` – нужно ли учитывать вложенность одноимённых блоков.

Вспомогательные методы для поиска парные. Различаются возвращаемым значением:

* `find<Direction>Block` и `find<Direction>Elem` – возвращает первый найденный экземпляр
* `find<Direction>Blocks` `find<Direction>Elems` – возвращает [коллекцию](i-bem-js-collections.ru.md) найденных экземпляров

**Пример**:

```js
modules.define('attach', ['i-bem-dom', 'button'], function(provide, bemDom, Button) {

provide(bemDom.declBlock(this.name, {
    onSetMod: {
        'js': {
            'inited' : function(modName, modVal) {
                this._button = this.findChildBlock(Button);
            }
        }
    }
}));

});
```


***

**NB** Не используйте jQuery-селекторы для поиска блоков и элементов.
`i-bem.js` предоставляет высокоуровневое API для доступа к DOM-узлам блоков и элементов.
Прямое обращение к DOM-дереву делает код менее устойчивым к изменениям БЭМ-библиотек и может привести
к возникновению сложно обнаруживаемых ошибок.

***

<a name="elem-api"></a>
#### Кэширующие методы поиска экземпляров элементов

Для оптимизации производительности для распространённых случаев поиска элементов одновременно по двум осям (**внутри** и **на себе**),
служат кэширующие методы `_elem(elem)` и `_elems(elem)`. Оба метода принимают один параметр:

* `elem` `{String|Function|Object}` – имя, класс или описание искомого элемента. Описанием служит хеш вида `{ elem : MyElem, modName : 'my-mod', modVal : 'my-val' }` или `{ elem : 'my-elem', modName : 'my-mod', modVal : 'my-val' }`.

Аналогично с некэширующими методами поиска кеширующие метода различаются возвращаемым значением:

* `_elem()` – возвращает первый найденный экземпляр элемента
* `_elems()` – возвращает [коллекцию](i-bem-js-collections.ru.md) найденных экземпляров элементов

**Пример**:

```js
modules.define('button', ['i-bem-dom', 'button__control'], function(provide, bemDom, ButtonControl) {

provide(bemDom.declBlock(this.name, {
    setName : function(name) {
        this._elem(LinkInner).setName(name);
    },

    setValue : function(value) {
        this._elem(LinkInner).setValue(value);
    }
}));

});
```

***

**NB** Результат кеширующих методов нет необходимости сохранять в переменную (см. предыдущий пример).
В то время как для некеширующих методов хорошей практикой является единоразовый поиск всего,
что нужно, с сохранением в переменную или внутреннее поле.

***

<a name="dynamic"></a>
### Динамическое обновление блоков и элементов в DOM-дереве

В модуле `i-bem-dom` предусмотрены следующие функции для добавления и замены фрагментов DOM-дерева.

* Добавить DOM-фрагмент:

  * `append(ctx, content)` —  в конец указанного контекста;
  * `prepend(ctx, content)` — в начало указанного контекста;
  * `before(ctx, content)` — перед указанным контекстом;
  * `after(ctx, content)` — после указанного контекста;

* Заместить DOM-фрагмент:

  * `update(ctx, content)` —  внутри указанного контекста;
  * `replace(ctx, content)` — заменить указанный контекст новым DOM-фрагментом.

Сигнатура функций добавления и замены идентична:

* `ctx` `{jQuery}` – DOM-элемент
* `content` `{jQuery|String}` – содержимое

Все функции возвращают DOM-элемент с содержимым для которого была выполнена [инициализация для новых блоков и элементов](i-bem-js-init.ru.md#init-fragment).

Чтобы упростить создание БЭМ-сущностей на обновляемых фрагментах DOM-дерева,
можно использовать шаблонизатор [BEMHTML](https://ru.bem.info/technology/bemhtml/current/intro/), подключив его в качестве [ym][]-модуля.
БЭМ-сущности описываются в формате [BEMJSON](https://ru.bem.info/technology/bemjson/current/bemjson/) непосредственно в коде блока.
Функция `BEMHTML.apply` генерирует HTML-элементы по BEMJSON-декларации в соответствии с правилами именования БЭМ.

**Пример:** Метод `_updateFileElem` блока `attach` удаляет элемент `file`, если он существовал,
и создает новый элемент с помощью функции `BEMHTML.apply`:

```js
modules.define( 'attach', ['BEMHTML', 'i-bem-dom'], function(provide, BEMHTML, bemDom) {

provide(bemDom.declBlock(this.name, {
    _updateFileElem : function() {
        bemDom.replace(
            this._elem('file').domElem,
            BEMHTML.apply({
                block : 'attach',
                elem : 'file',
                content : this.getValue()
            }));
        return this;
    }
}));

});
```


[ym]: https://github.com/ymaps/modules

[i-bem]: https://ru.bem.info/libs/bem-core/current/desktop/i-bem/jsdoc/

[i-bem-dom]: https://ru.bem.info/libs/bem-core/current/desktop/i-bem-dom/jsdoc/
