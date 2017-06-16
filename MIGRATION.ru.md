# Миграция

## 4.0.0

### Изменения в блоке `i-bem`

#### Отдельный блок `i-bem-dom`

Элемент `dom` блока `i-bem` был перенесён в отдельный блок `i-bem-dom`.

Было:

```js
modules.define('my-dom-block', ['i-bem__dom'], function(provide, BEMDOM) {
    /* ... */
});
```

Стало:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom) {
    /* ... */
});
```

Блоки `i-bem` и `i-bem-dom` больше не являются классами, представляя собой модули с методами для декларации
БЭМ-сущностей, ссылками на классы БЭМ-сущностей и некоторыми дополнительными хелперами. Эти методы больше не являются методами класса для соответсвующих блоков.

Задача: [#413](https://github.com/bem/bem-core/issues/413).

#### Декларация

#### Декларация блока

Для декларации блока, вместо метода `decl()`, следует использовать метод `declBlock()`.

Было:

```js
modules.define('my-dom-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, { /* ... */ }));

});
```

Стало:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, { /* ... */ }));

});
```

#### Декларация модификатора

Для декларации модификатора, вместо статического метода `decl()`, следует использовать статический метод `declMod()`.

Было:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.decl({ modName : 'my-mod', modVal : 'my-val' }, { /* ... */ }));

});
```

Стало:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.declMod({ modName : 'my-mod', modVal : 'myVal' }, { /* ... */ }));

});
```

#### Декларация булевого модификатора

Было:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.decl({ modName : 'my-mod', modVal : 'true' }, { /* ... */ }));

});
```

Стало:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.declMod({ modName : 'my-mod' }, { /* ... */ }));

});
```

Задача: [#1374](https://github.com/bem/bem-core/issues/1374).

#### Декларация для модификатора с любым значением

Было:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.decl({ modName : 'my-mod' }, { /* ... */ }));

});
```

Стало:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.declMod({ modName : 'my-mod', modVal : '*' }, { /* ... */ }));

});
```

Задача: [#1376](https://github.com/bem/bem-core/pull/1376).

#### Доопределение блока

Вместо метода `decl()` класса блока следует использовать метод `declBlock()` модуля `i-bem-dom`.

Было:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.decl({ /* ... */ }));

});
```

Стало:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom, MyDomBlock) {

provide(bemDom.declBlock(MyDomBlock, { /* ... */ }));

});
```

#### Декларация наследуемого блока

Было:

```js
modules.define('my-dom-block', ['i-bem__dom', 'my-base-dom-block'], function(provide, BEMDOM, MyBaseDomBlock) {

provide(BEMDOM.decl({ block : this.name, baseBlock : MyBaseDomBlock }, { /* ... */ }));

});
```

Стало:

```js
modules.define('my-dom-block', ['i-bem-dom', 'my-base-dom-block'], function(provide, bemDom, MyBaseDomBlock) {

provide(bemDom.declBlock(this.name, MyBaseDomBlock, { /* ... */ }));

});
```

#### Декларация миксина

Метод `declMix` переименован в `declMixin`, чтобы отделить понятие
[миксов нескольких БЭМ-сущностей на одном DOM-узле](https://ru.bem.info/methodology/key-concepts/#Микс) от миксинов на уровне JS.

Было:

```js
modules.define('my-mix-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.declMix(this.name, { /* ... */ }));

});
```

Стало:

```js
modules.define('my-mixin-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declMixin({ /* ... */ }));

});
```

#### Примешивание миксина

Было:

```js
modules.define('my-dom-block', ['i-bem__dom', 'my-mix-1', 'my-mix-2'], function(provide, BEMDOM) {

provide(BEMDOM.decl({ block : this.name, baseMix : ['my-mix-1', 'my-mix-2']}, { /* ... */ }));

});
```

Стало:

```js
modules.define('my-dom-block', ['i-bem-dom', 'my-mixin-1', 'my-mixin-2'], function(provide, bemDom, MyMixin1, MyMixin2) {

provide(bemDom.declBlock(this.name, [MyMixin1, MyMixin2], { /* ... */ }));

});
```

#### Триггеры для изменения модификаторов

При декларации определённого модификатора (например, `_my-mod_my-val`) невозможно было задекларировать поведение
на удаление этого модификатора. Приходилось делать две декларации.

Было:

```js
// my-dom-block_my-mod_my-val.js

modules.define('my-dom-block', function(provide, MyDomBlock) {

MyDomBlock.decl({
    onSetMod : {
        'my-mod' : {
            '' : function() { /* ... */ } // декларация для удаления модификатора _my-mod_my-val
        }
    }

});

provide(MyDomBlock.decl({ modName : 'my-mod', modVal : 'my-val' }, { /* ... */ }));

});
```

Стало:

```js
modules.define('my-dom-block', function(provide, MyDomBlock) {

provide(MyDomBlock.declMod({ modName : 'my-mod', modVal : 'my-val' }, {
    onSetMod : {
        'mod1' : {
            '' : function() { /* ... */ } // декларация для удаления модификатора _my-mod_my-val
        }
    }
}));

});
```

Задача: [#1025](https://github.com/bem/bem-core/issues/1025).

Появился сокращённый синтаксис для декларации поведения на изменение модификатора.

Было:

```js
onSetMod : {
    'my-mod' : {
        '*' : function(modName, modVal, prevModVal) {
            if(prevModVal === 'my-val') {
                /* ... */ // декларация для изменения _my-mod_my-val в любое другое значение
            }
        }
    }
}
```

Стало:

```js
onSetMod : {
    'my-mod' : {
        '~my-val' : function() { /* ... */ } // декларация для изменения значения my-mod из my-val в любое другое значение
        }
    }
}
```

Было:

```js
onSetMod : {
    'my-mod' : {
        '*' : function(modName, modVal) {
            if(modVal !== 'my-val') {
                /* ... */ // декларация для изменения my-mod в любое значение, кроме my-val
            }
        }
    }
}
```

Стало:

```js
onSetMod : {
    'my-mod' : {
        '!my-val' : function() { /* ... */ } // декларация для изменения my-mod в любое значение, кроме my-val
        }
    }
}
```

Задача: [#1072](https://github.com/bem/bem-core/issues/1072).


#### Ленивая инициализация

Функциональность поля `live` была разделена на две части: поле `lazyInit` и метод `onInit()`.

Было:

```js
modules.define('my-dom-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, { /* ... */ }, {
    live : true
}));

});
```

Стало:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, { /* ... */ }, {
    lazyInit : true
}));

});
```

Было:

```js
modules.define('my-dom-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, { /* ... */ }, {
    live : function() {
        /* ... */
    }
}));

});
```

Стало:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, { /* ... */ }, {
    lazyInit : true,

    onInit : function() {
        /* ... */
    }
}));

});
```

Было:

```js
modules.define('my-dom-block', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, { /* ... */ }, {
    live : function() {
        /* ... */
        return false;
    }
}));

});
```

Стало:

```js
modules.define('my-dom-block', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declBlock(this.name, { /* ... */ }, {
    onInit : function() {
        /* ... */
    }
}));

});
```

Было:

```js
{
    block : 'b1',
    js : { live : false }
}
```

Стало:

```js
{
    block : 'b1',
    js : { lazyInit : false }
}
```

Задача: [#877](https://github.com/bem/bem-core/issues/877).

#### Экземпляры для элементов

Удалены элемент `elem-instances` блока `i-bem` и модификатор `elem-instances` элемента `dom` блока `i-bem`.
Теперь соответствующая функциональность является частью `i-bem` и `i-bem-dom`.

Было:

```js
modules.define('my-dom-block__my-elem', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl({ block : 'my-dom-block', elem : 'my-elem' }, { /* ... */ }));

});
```

Стало:

```js
modules.define('my-dom-block__my-elem', ['i-bem-dom'], function(provide, bemDom) {

provide(bemDom.declElem('my-dom-block', 'my-elem', { /* ... */ }));

});
```

Теперь метод `_elem(elemName)` экземпляра блока (бывший `elem(elemName)`) возвращает не jQuery-объект со всеми элементами
с именем `elemName`, а экземпляр класса элемента.

Для того, чтобы получить коллекцию экземпляров класса элемента, используйте метод `_elems()`.

Теперь кэш для элементов с JS-реализацией найденных через `_elem()` и `_elems()` инвалидируется автоматически при DOM модификациях.
Задача: [#1352](https://github.com/bem/bem-core/issues/1352).

Когда эти методы используются для элементов без JS-реализации необходимо использовать `_dropElemCache()` при динамическом обновлении DOM.

Не забудьте включить поддержку экземплятор для элементов в шаблонизаторе.
Опция [elemJsInstances](https://github.com/bem/bem-xjst/blob/master/docs/ru/3-api.md#%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B0-js-%D1%8D%D0%BA%D0%B7%D0%B5%D0%BC%D0%BF%D0%BB%D1%8F%D1%80%D0%BE%D0%B2-%D0%B4%D0%BB%D1%8F-%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-bem-core-v4) для `bem-xjst` или [jsElem](https://github.com/bem/bh#jselem) для `BH`.

##### Cпособы взаимодействия с элементами

Было:

```js
this.setMod(this.elem('my-elem'), 'my-mod', 'my-val');
```

Стало:

```js
this._elem('my-elem').setMod('my-mod', 'my-val');
```

Аналогично для методов `getMod()`, `hasMod()`, `toggleMod()`, `delMod()`.

##### Удалённые методы и поля

Из API блока удалены методы: `elemify()`, `elemParams()` и поле `onElemSetMod`. Соответствующая
им функциональность выражается через экземпляры элементов .

См. также изменения про [методы поиска](#Методы-поиска).

Задача: [#581](https://github.com/bem/bem-core/issues/581).

#### Методы поиска

Переименованы следующие методы:

- `findBlockInside()` в `findChildBlock()`
- `findBlocksInside()` в `findChildBlocks()`
- `findBlockOutside()` в `findParentBlock()`
- `findBlocksOutside()` в `findParentBlocks()`
- `findBlockOn()` в `findMixedBlock()`
- `findBlocksOn()` в `findMixedBlocks()`

Из этих методов удален опциональный первый параметр про элемент.

Добавлены методы: `findChildElem()`, `findChildElems()`, `findParentElem()`, `findParentElems()`, `findMixedElem()`, `findMixedElems()`.

Было:

```js
this.findBlockInside(this.elem('my-elem'), 'my-block-2');
```

Стало:

```js
this.findChildElem('my-elem').findChildBlock(MyBlock2);
```

Удалены методы: `findElem()`, `closestElem()`, вместо них следует использовать методы `findChildElem()`
и `findParentElem()`, соответсвенно.

Методы `findChildBlocks()`, `findParentBlocks()`, `findMixedBlocks()`, `findChildElems()`, `findParentElems()`,
`findMixedElems()` возвращают [коллекции БЭМ-сущностей](#Коллекции).

Методы `findChildElem()` и `findChildElems()` (в отличие от предыдущего аналога `findElem`) не выполняют поиск на собственных DOM-узлах экземпляра.

Было:

```js
this.findElem('my-elem');
```

Стало:

```js
this.findChildElems('my-elem').concat(this.findMixedElems('my-elem'));
```

Но рекомендуется обратить внимание, действительно ли необходимы оба поиска:
в большинстве случаев достаточно использовать или `this.findChildElems('my-elem')` или `this.findMixedElems('my-elem')`.

##### Проверка вложенности

Вместо удаленного метода `containsDomElem()`, следует использовать метод `containsEntity()`.

Было:

```js
this.containsDomElem(someElem);
```

Стало:

```js
this.containsEntity(someElem);
```

#### Коллекции

Функциональность элемента `collection` блока `i-bem` перестала быть опциональной.

Все методы возвращавшие массив БЭМ-сущностей, теперь возвращают коллекции.

Было:

```js
this.findBlocksInside('my-block-2')[0].setMod('my-mod', 'my-val');
```

Стало:

```js
this.findChildBlocks(MyBlock2).get(0).setMod('my-mod', 'my-val');
```

Было:

```js
this.findBlocksInside('my-block-2').forEach(function(myBlock2) {
    return myBlock2.setMod('my-mod', 'my-val');
});
```

Стало:

```js
this.findChildBlocks(MyBlock2).setMod('my-mod', 'my-val');
```

Задача: [#582](https://github.com/bem/bem-core/issues/582).

#### События

API работы с событиями значильно упрощено. Удалены методы экземпляра блока: `on()`, `un()`, `once()`, `bindTo()`,
`unbindFrom()`, `bindToDoc()`, `bindToWin()`, `unbindFromDoc()`, `unbindFromWin()` и методы класса: `liveBindTo()`,
`liveUnbindFrom()`, `on()`, `un()`, `once()`, `liveInitOnBlockEvent()`, `liveInitOnBlockInsideEvent()`.
Вместо них добавлены методы `_domEvents()` и `_events()`, возвращающие экземпляр класса менеджера событий, с методами
`on()`, `un()` и `once()`;

##### DOM-события на экземплярах

Было:

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this.bindTo('click', this._onClick);
            }
        }
    }
});
```

Стало:

```js
bemDom.declBlock('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._domEvents().on('click', this._onClick);
            }
        }
    }
});
```

Было:

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this.bindToDoc('click', this._onDocClick);
            }
        }
    }
});
```

Стало:

```js
bemDom.declBlock('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._domEvents(bemDom.doc).on('click', this._onDocClick);
            }
        }
    }
});
```

Было:

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this.bindToWin('resize', this._onWinResize);
            }
        }
    }
});
```

Стало:

```js
bemDom.declBlock('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._domEvents(bemDom.win).on('resize', this._onWinResize);
            }
        }
    }
});
```

##### Ссылка на экземпляр

Если событие произошло на БЭМ-экземпляре, в объект события будет добавлено поле, ссылающееся на экземпляр:

```js
this._domEvents('my-elem').on('click', function(e) {
    e.bemTarget // ссылается на экземпляр `my-elem`
});
```

##### БЭМ-события на экземплярах

Было:

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this.findBlockOutside('my-block-2').on('my-event', this._onMyBlock2MyEvent, this);
            },

            '' : function() {
                this.findBlockOutside('my-block-2').un('my-event', this._onMyBlock2MyEvent, this);
            }
        }
    }
});
```

Стало:

```js
bemDom.declBlock('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._events(this.findParentBlock('my-block-2')).on('my-event', this._onMyBlock2MyEvent);
            }
        }
    }
});
```

Следует обратить внимание, что теперь, отписка от событий происходит автоматически во время уничтожения экземпляра.

##### Делегированные DOM-события

Было:

```js
BEMDOM.decl('my-block', { /* ... */ }, {
    live : function() {
        this.liveBindTo('click', this.prototype._onClick);
    }
});
```

Стало:

```js
bemDom.declBlock('my-block', { /* ... */ }, {
    onInit : function() {
        this._domEvents().on('click', this.prototype._onClick);
    }
});
```

Было:

```js
BEMDOM.decl('my-block', { /* ... */ }, {
    live : function() {
        this.liveBindTo('my-elem', 'click', this.prototype._onMyElemClick);
    }
});
```

Стало:

```js
bemDom.declBlock('my-block', { /* ... */ }, {
    onInit : function() {
        this._domEvents('my-elem').on('click', this.prototype._onMyElemClick);
    }
});
```

##### Делегированные БЭМ-события

Было:

```js
BEMDOM.decl('my-block', { /* ... */ }, {
    live : function() {
        this.liveInitOnBlockInsideEvent('my-event', 'my-block-2', this.prototype._onMyBlock2MyEvent);
    }
});
```

Стало:

```js
bemDom.declBlock('my-block', { /* ... */ }, {
    onInit : function() {
        this._events(MyBlock2).on('my-event', this.prototype._onMyBlock2MyEvent);
    }
});
```

Следует обратить внимание, что параметр с функцией обработчиком события теперь обязательный.

Было:

```js
modules.define('my-block', ['i-bem__dom', 'my-block-2'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, { /* ... */ }, {
    live : function() {
        this.liveInitOnBlockInsideEvent('my-event', 'my-block-2');
    }
}));

});
```

Стало:

```js
modules.define('my-block', ['i-bem-dom', 'my-block-2', 'functions'], function(provide, bemDom, MyBlock2, functions) {

provide(bemDom.declBlock(this.name, { /* ... */ }, {
    onInit : function() {
        this._events(MyBlock2).on('my-event', functions.noop);
    }
}));

});
```

Было:

```js
BEMDOM.decl('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                MyBlock2.on(this.domElem, 'my-event', this._onMyBlock2MyEvent, this);
            },

            '' : function() {
                MyBlock2.un(this.domElem, 'my-event', this._onMyBlock2MyEvent, this);
            }
        }
    }
});
```

Стало:

```js
bemDom.declBlock('my-block', {
    onSetMod : {
        'js' : {
            'inited' : function() {
                this._events(MyBlock2).on('my-event', this._onMyBlock2MyEvent);
            }
        }
    }
});
```

Следует обратить внимание, что теперь, отписка от событий происходит автоматически во время уничтожения экземпляра.

#### Взаимодействие стороннего кода с БЭМ-блоками

##### Получение экземпляра БЭМ-блока

Теперь, метод jQuery-объекта `bem()` принимает БЭМ-класс, вместо строки.

Было:

```js
modules.require(['jquery', 'i-bem__dom'], function($, BEMDOM) {

var myBlock = $('.my-block').bem('my-block');

});
```

Стало:

```js
modules.require(['jquery', 'my-block'], function($, MyBlock) {

var myBlock = $('.my-block').bem(MyBlock);

});
```

##### Подписка на БЭМ-события из стороннего кода

Было:

```js
modules.require(['jquery', 'i-bem__dom'], function($, BEMDOM) {

$('.my-block').bem('my-block').on('my-event', function() { /* ... */ });

});
```

Стало:

```js
modules.require(['jquery', 'my-block', 'events__observable'], function($, MyBlock, observable) {

observable($('.my-block').bem(MyBlock))
    .on('my-event', function() { /* ... */ });

});
```

При этом в зависимости нужно добавить `{ block : 'events', elem : 'observable', mods : { type : 'bem-dom' } }`.

Задача: [#394](https://github.com/bem/bem-core/issues/394).

#### Имена protected-методов начинаются с `_`

Переименованы protected-методы:

- `emit()` в `_emit()`
- `elem()` в `_elem()`
- `dropElemCache()` в `_dropElemCache()`
- `buildClass()` в `_buildClassName()`
- `buildSelector()` в `_buildSelector()`
- `getDefaultParams()` в `_getDefaultParams()`

Задачи: [#586](https://github.com/bem/bem-core/issues/586), [#1359](https://github.com/bem/bem-core/issues/1359).

#### Удалённые методы

Удалён метод `getMods()`.

### Изменения в блоке `querystring`

Элемент `querystring__uri` стал блоком `uri`. Блок `querystring` стал элементом `uri__querystring`.

Задача: [#967](https://github.com/bem/bem-core/issues/967).

### Изменения в блоке `page`

Элемент `page__css` больше не поддреживает поле `ie`. Используйте элемент `page__conditional-comment`.

Было:

```
{
    block : 'page',
    head : [
        { elem : 'css', url : 'my-css.css', ie : false },
        { elem : 'css', url : 'my-css', ie : true }
    ],
    content : 'Page content'
}
```

Стало:

```
{
    block : 'page',
    head : [
        {
            elem : 'conditional-comment',
            condition : '! IE',
            content : { elem : 'css', url : 'my-css.css' }
        },
        {
            elem : 'conditional-comment',
            condition : '> IE 8',
            content : { elem : 'css', url : 'my-css.ie.css' }
        }
        // и т.д. для других нужных версий IE
    ],
    content : 'Page content'
}
```

Задача: [#379](https://github.com/bem/bem-core/issues/379).

## 3.0.0

Для миграции на версию 3.0.0 достаточно ознакомиться с [историей изменений](https://ru.bem.info/libs/bem-core/v3/changelog/#300).

## 2.0.0

Для миграции на версию 2.0.0 достаточно ознакомиться с [историей изменений](https://ru.bem.info/libs/bem-core/v2/changelog/#200).

## 1.0.0

Для версии 1.0.0 миграция подразумевается с использования [bem-bl](https://github.com/bem/bem-bl/) на использование [bem-core](https://github.com/bem/bem-core/).

### Модули

Весь код теперь пишется в терминах модульной системы https://github.com/ymaps/modules.
Все зависимости должны явно указываться в коде, обращения к глобальным объектам необходимо минимизировать, а, по возможности, и полностью исключить.

Пример:

```js
modules.define(
    'my-module', // имя модуля
    ['module-from-library', 'my-another-module'], // зависимости модуля
    function(provide, moduleFromLibrary, myAnotherModule) { // декларация модуля, вызывается когда все зависимости "разрезолвлены"

// предоставление модуля
provide({
    myModuleMethod : function() {}
});

});
```

TODO: дописать про изменение сборки (использование специальных технологий для js и как быть с кастомными сборщиками)

### jQuery и jQuery-плагины

jQuery представлен модулем-оберткой `jquery`, который использует глобальный объект jQuery,
в случае если он уже присутствует на странице, в противном случае загружая его самостоятельно.
jQuery теперь используется только для операций, связанных непосредственно с DOM
(поиск элементов, подписка на события, установка/получение атрибутов элементов, и т.д.).

Для всех остальных операций написаны соответствующие модули,
предоставляющие аналогичный функционал, но, при этом, не зависящие от jQuery:
 * модуль `objects` для работы с объектами (с методами `extend`, `isEmpty`, `each`)
 * модуль `functions` для работы с функциями (с методами `isFunction` и `noop`)

Также, все jQuery-плагины, не связанные непосредственно с jQuery
(`$.observable`, `$.inherit`, `$.cookie`, `$.identify`, `$.throttle`) стали модулями:
 * модуль `events` вместо `$.observable` для работы с событиями, предоставляющий "классы" `EventsEmitter` и `Event`
 * модуль `inherit` вместо `$.inherit` для работы с "классами" и наследованием
 * модуль `cookie` вместо `$.cookie`
 * модуль `identify` вместо `$.identify`
 * модули `functions__throttle`, `functions__debounce` вместо `$.throttle` и `$.debounce`, соответственно

Было:

```js
// код блока
$.throttle()
// код блока

```

Стало:
```js
module.define('my-module', ['functions__throttle'], function(provide, throttle) {
// код модуля
throttle()
// код модуля
});
```

### BEM.DOM-блоки

#### Декларация

Вместо декларации через BEM.DOM.decl необходимо доопределять модуль `i-bem__dom`.

Было:
```js
BEM.DOM.decl('block', /* ... */);
```
Стало:
```js
modules.define('i-bem__dom', function(provide, BEMDOM) {

BEMDOM.decl('block', /* ... */);

provide(BEMDOM);

});
```

#### Конструктор

Необходимо использовать полную нотацию для обработчика установки модификатора `js` в значение `inited`.

Было:

```js
onSetMod : {
  js : function() {
      // код конструктора
    }
}
```

Стало:

```js
onSetMod : {
    'js' : {
        'inited' : function() {
            // код конструктора
        }
    }
}
```

#### Деструктор

Вместо метода `destruct` необходимо использовать обработчик установки модификатора `js` в пустое значение (удаление модификатора).
Вызывать `__base` для того, чтобы у блоков работал базовый деструктор, определенный в `i-bem__dom`, больше не нужно.

Было:

```js
destruct : function() {
    this.__base.apply(this, arguments);
    // код деструктора
}
```

Стало:

```js
onSetMod : {
    js : {
        '' : function() {
            // код деструктора
        }
    }
}
```

#### Метод `changeThis`

Вместо метода `changeThis` необходимо использовать либо соответствующий параметр, либо нативный метод `bind`, если такой параметр отсутствует.

Было:

```js
// код блока
obj.on('event', this.changeThis(this._method));
// код блока
```

Стало:

```js
obj.on('event', this._method.bind(this));
// или лучше
obj.on('event', this._method, this);
```

#### Метод `afterCurrentEvent`

Вместо метода `afterCurrentEvent` необходимо использовать метод `nextTick`,
который гарантирует, что блок еще существует в момент исполнения callback'а
(если блок уже уничтожен к этому моменту, то callback не исполняется).

Было:

```js
BEM.DOM.decl('block', {
    method : function() {
        this.afterCurrentEvent(function() {
            /* ... */
        });
    }
});
```

Стало:

```js
modules.define('i-bem__dom', function(provide, BEMDOM) {

BEMDOM.decl('block', {
    method : function() {
        this.nextTick(function() {
                /* ... */
            });
        }
    });
});
```

#### Метод `findElem`

Контекст для поиска элемента больше не задается строкой, вместо нее следует передавать jQuery-объект.

Было:

```js
var nestedElem = this.findElem('parent-elem', 'nested-elem');
```

Стало:

```js
var nestedElem = this.findElem(this.findElem('parent-elem'), 'nested-elem'),
    oneMoreElem = this.findElem(this.elem('another-elem'), 'nested-elem');
```

#### Метод `liveBindTo`

Метод `liveBindTo` больше не поддерживает поле `elemName` для передачи имени элемента. Вместо него следует использовать поле `elem`.

#### Доступ до DOM-элемента в обработчике события

DOM-элемент, к которому был подвешен обработчик события теперь доступен
как `$(e.currentTarget)`вместо `e.data.domElem`.

Было:

```js
onClick : function(e) {
    e.data.domElem.attr(/* ... */);
}
```

Стало:

```js
onClick : function(e) {
    $(e.currentTarget).attr(/* ... */);
}
```

#### Каналы (channels)

Каналы больше не являются встроенными в BEM, теперь они являются самостоятельным модулем `events__channels`.

Было:

```js
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('channel-name').on(/* ... */);
    }
});
```

Стало:

```js
modules.define('i-bem__dom', ['events__channels'], function(provide, channels, BEMDOM) {

BEMDOM.decl('block', {
    method : function() {
        channels('channel-name').on(/* ... */);

        }
    });
});
```

#### Блок `i-system` и канал `sys` событий `tick`, `idle`, `wakeup`

Этот блок и канал перестали существовать, вместо них появились отдельные модули: `tick` с событием tick  и `idle` с событиями idle и wakeup.

Было:

```js
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('sys').on('tick', /* ... */);
    }
});
```

Стало:

```js
modules.define('i-bem__dom', ['tick'], function(provide, tick, BEMDOM) {

BEMDOM.decl('block', {
    method : function() {
        tick.on('tick', /* ... */);

        }
    });

});
```

Было:

```js
BEM.DOM.decl('block', {
    method : function() {
        BEM.channel('sys').on('wakeup', /* ... */);
    }
});
```

Стало:

```js
modules.define('i-bem__dom', ['idle'], function(provide, idle, BEMDOM) {

BEMDOM.decl('block', {
    method : function() {
        idle.on('wakeup', /* ... */);

        }
    });
});
```

### BEM-блоки

Те BEM-блоки, которые использовались как хранилище для каких-то методов, при этом никак не использующие BEM-методологию, теперь
могут быть написаны как модули.

Было:

```js
BEM.decl('i-router', {
    route : function() { /* ... */ }
});
```

Стало:

```js
modules.define('router', function(provide) {

provide({
    route : function() { /* ... */ }
});

});
```

Если же, по каким-то причинам, нужны именно BEM-блоки (не BEM.DOM-блоки), то их можно объявлять, доопределяя модуль `i-bem`.

Было:

```js
BEM.decl('my-block', { /* ... */ });
```

Стало:

```js
modules.define('i-bem', function(provide, BEM) {

BEM.decl('my-block', { /* ... */ });

provide(BEM);

});
```

#### Рефакторинг на примере блока `b-spin`

Было:

```js
BEM.DOM.decl('b-spin', {

    onSetMod : {

        'js' : function() {

            this._size = this.getMod('size') || /[\d]+/.exec(this.getMod('theme'))[0];

            this._bgProp = 'background-position';
            this._posPrefix = '0 -';

            if (this.elem('icon').css('background-position-y')) { /* В IE нельзя получить свойство background-position, только background-position-y, поэтому костыляем */
                this._bgProp = 'background-position-y';
                this._posPrefix = '-';
            }

            this._curFrame = 0;

            this.hasMod('progress') && this.channel('sys').on('tick', this._onTick, this);

        },

        'progress' : {

            'yes' : function() {

                this.channel('sys').on('tick', this._onTick, this);

            },

            '' : function() {

                this.channel('sys').un('tick', this._onTick, this);

            }

        }
    },

    _onTick: function(){

        var y = ++this._curFrame * this._size;

        (y >= this._size * 36) && (this._curFrame = y = 0);

        this.elem('icon').css(this._bgProp, this._posPrefix + y +'px');

    },

    destruct : function() {

        this.channel('sys').un('tick', this._onTick, this);
        this.__base.apply(this, arguments);

    }

});
```

Стало:

```js
modules.define(
    'i-bem__dom',
    ['tick'],
    function(provide, tick, BEMDOM) {

var FRAME_COUNT = 36;

BEMDOM.decl('b-spin', {
    onSetMod : {
        'js' : {
            'inited' : function() { // конструктор
                var hasBackgroundPositionY = !!this.elem('icon').css('background-position-y')); /* В IE нельзя получить свойство background-position, только background-position-y */

                this._bgProp = hasBackgroundPositionY? 'background-position-y' : 'background-position';
                this._posPrefix = hasBackgroundPositionY? '-' : '0 -';
                this._curFrame = 0;
                this._size = Number(this.getMod('size') || /[\d]+/.exec(this.getMod('theme'))[0]);

                this.hasMod('progress') && this._bindToTick();
            },

            '' : function() { // деструктор
                this._unbindFromTick();
            }
        },

        'progress' : {
            'true' : function() {
                this._bindToTick();
            },

            '' : function() {
                this._unbindFromTick();
            }
        }
    },

    _bindToTick : function() {
        tick.on('tick', this._onTick, this);
    },

    _unbindFromTick : function() {
        tick.un('tick', this._onTick, this);
    },

    _onTick : function() {
        var offset;
        this._curFrame++ >= FRAME_COUNT?
            offset = this._curFrame * this._size :
            this._curFrame = offset = 0;

        this.elem('icon').css(this._bgProp, this._posPrefix + offset + 'px');
    }
});

provide(BEMDOM);

});
```
