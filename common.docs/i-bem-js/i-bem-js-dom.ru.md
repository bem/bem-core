<a name="dom"></a>
## Работа с DOM-деревом

<a name="domElem"></a>
### DOM-узел экземпляра блока

В контексте экземпляра блока с DOM-представлением зарезервировано поле `this.domElem`, содержащее jQuery-объект со ссылками на все DOM-узлы, с которыми связан данный экземпляр.

<a name="elem-api"></a>
### Элементы

БЭМ-элементы блоков представлены в `i-bem.js` как DOM-узлы, вложенные в DOM-узел экземпляра блока. 

Для обращения к DOM-узлам элементов и работы с их модификаторами, следует использовать API экземпляра блока:

* Кэширующий доступ: `elem(elems, [modName], [modVal])`. Элемент,
полученный таким образом, не требуется сохранять в переменную.

```js
BEMDOM.decl('link', {
    setInnerText: function() {
        this.elem('inner').text('Текст ссылки');
        /* ... */
        this.elem('inner').text('Другой текст');
    }
);
```


* Некэширующий доступ: `findElem(elems, [modName], [modVal])`.

```js
BEMDOM.decl('link', {
    setInnerText: function() {
        var inner = this.findElem('inner');
        inner.text('Текст ссылки');
        /* ... */
        inner.text('Другой текст');
    }
});
```


При [динамическом добавлении и удалении элементов блока](#dynamic) может
потребоваться очистить кэш элементов. Для этого служит метод `dropElemCache('elements')`. Он принимает строку – разделенный пробелами список имен элементов, кэш которых нужно сбросить.

```js
BEMDOM.decl('attach', {
    clear: function() {
        BEMDOM.destruct(this.elem('control'));
        BEMDOM.destruct(this.elem('file'));
        return this.dropElemCache('control file');
    }
});
```


<a name="api-find"></a>
### Поиск экземпляров блоков в DOM-дереве

Обращение к другому блоку в `i-bem.js` выполняется из текущего блока,
размещенного на определенном узле DOM-дерева. Поиск других блоков в
DOM-дереве может вестись по трем направлениям (осям) относительно
DOM-узла текущего блока:

* **Внутри блока** — на DOM-узлах, вложенных в DOM-узел текущего блока. Вспомогательные методы: `findBlocksInside([elem], block)` и `findBlockInside([elem], block)`.
* **Снаружи блока** — на DOM-узлах, потомком которых является DOM-узел
текущего блока. Вспомогательные методы: `findBlocksOutside([elem], block)` и `findBlockOutside([elem], block)`.
* **На себе** — на том же DOM-узле, на котором размещен текущий блок. Это актуально в случае [размещения нескольких JS-блоков на одном DOM-узле](i-bem-js-html-binding.ru.md#html-mixes) (микс). Вспомогательные методы: `findBlocksOn([elem], block)` и `findBlockOn([elem], block)`.

Сигнатура вспомогательных методов идентична:

* `[elem]` `{String|jQuery}` – имя или DOM-узел элемента блока.
* `block` `{String|Object}` – имя или описание искомого блока. Описанием служит хеш вида `{ block : 'name', modName : 'foo', modVal : 'bar' }`.

Вспомогательные методы для поиска парные. Различаются возвращаемым значением:

* `findBlocks<Direction>` – возвращает массив найденных блоков.
* `findBlock<Direction>` – возвращает первый найденный блок.

**Пример**: При переключении модификатора `disabled` экземпляр блока
`attach` находит вложенный в него блок `button` и переключает его
модификатор `disabled` в то же значение, которое получил сам:

```js
modules.define('attach', ['i-bem__dom', 'button'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        'disabled': function(modName, modVal) {
            this.findBlockInside('button').setMod(modName, modVal);
        }
    }
}));

});
```


***

**NB** Не используйте jQuery-селекторы для поиска блоков и элементов.
`i-bem.js` предоставляет высокоуровневое API для доступа к DOM-узлам блоков и элементов. Прямое обращение к DOM-дереву делает код менее устойчивым к изменениям БЭМ-библиотек и может привести к возникновению сложно обнаруживаемых ошибок.

***

<a name="dynamic"></a>
### Динамическое обновление блоков и элементов в DOM-дереве

В современных интерфейсах зачастую необходимо создавать новые
фрагменты DOM-дерева и заменять старые в процессе работы (AJAX). В
`i-bem.js` предусмотрены следующие функции для добавления и замены
фрагментов DOM-дерева.

* Добавить DOM-фрагмент:

  * `append` —  в конец указанного контекста;
  * `prepend` — в начало указанного контекста;
  * `before` — перед указанным контекстом;
  * `after` — после указанного контекста;

* Заместить DOM-фрагмент:

  * `update` —  внутри указанного контекста;
  * `replace` — заменить указанный контекст новым DOM-фрагментом.

Все функции автоматически выполняют [инициализацию блоков на обновленном фрагменте DOM-дерева](i-bem-js-init.ru.md#init-ajax).

Чтобы упростить создание БЭМ-сущностей на обновляемых фрагментах
DOM-дерева, можно использовать шаблонизатор
[BEMHTML](https://ru.bem.info/technology/bemhtml/current/intro/), подключив
его в качестве [ym][]-модуля. БЭМ-сущности описываются в формате
[BEMJSON](https://ru.bem.info/technology/bemjson/current/bemjson/)
непосредственно в коде блока. Функция `BEMHTML.apply` генерирует
HTML-элементы по BEMJSON-декларации в соответствии с правилами
именования БЭМ.

**Пример:** Метод `_updateFileElem` блока `attach` удаляет элемент `file`, если он существовал, и создает новый элемент с помощью функции `BEMHTML.apply`:

```js
modules.define(
    'attach',
    ['BEMHTML', 'strings__escape', 'i-bem__dom'],
    function(provide, BEMHTML, escape, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    _updateFileElem : function() {
        var fileName = extractFileNameFromPath(this.getVal());
        this.elem('file').length && BEMDOM.destruct(this.elem('file'));
        BEMDOM.append(
            this.domElem,
            BEMHTML.apply({
                block : 'attach',
                elem : 'file',
                content : [
                    {
                        elem : 'icon',
                        mods : { file : extractExtensionFromFileName(fileName) }
                    },
                    { elem : 'text', content : escape.html(fileName) },
                    { elem : 'clear' }
                ]
            }));
        return this.dropElemCache('file');
    }
}));

});
```


[ym]: https://github.com/ymaps/modules

[i-bem]: https://ru.bem.info/libs/bem-core/current/desktop/i-bem/jsdoc/

[i-bem__dom]: https://ru.bem.info/libs/bem-core/current/desktop/i-bem/jsdoc/
